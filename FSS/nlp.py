import os
from os import path
import pandas as pd
from collections import defaultdict
import re
from multiprocessing import cpu_count
import sys

# pip install konlpy
# pip install jpype1
from konlpy.tag import Twitter
import gensim
from gensim import corpora


def make_news_df():

    def get_paths():
        path_pair = [path.join("./DB/crawler/text/bank"),
                     path.join("./DB/crawler/text/sbank")]
        bank_paths = [path.join(path_, bank)
                      for path_ in path_pair
                      for bank in os.listdir(path_)]
        paths = [path.join(_path, file_name)
                 for _path in bank_paths
                 for file_name in os.listdir(_path)]        
        return paths

    def get_newses(path_):
        file_ = pd.read_pickle(path_)
        bank, newses =  file_["bank"], file_["newses"]
        normal_news = [{"bank": bank, **news} for news in newses
                       if news["date"] != None]
        return normal_news
    
    paths = get_paths()
    newses = sum([get_newses(path_) for path_ in paths], [])
    df = pd.DataFrame(newses)

    name_map = pd.read_pickle(DB_PATH("name_map.pickle"))
    df["bank"] = [name_map[bank] for bank in df["bank"]]
    df = df[df["bank"] != False]
    
    df = df.sort_values(["bank", "date", "press", "title"])
    df = df.reset_index(drop=True)
    
    quarters = ["19991299",
                *["20%02d%s99"%(i, month)
                  for i in range(18)
                  for month in ["03", "06", "09", "12"]]]
    bounds = list(zip(quarters[:-1], quarters[1:]))
    date2quarters = [bound[1][:6]
                     for date in df["date"]
                     for bound in bounds
                     if int(bound[0]) < int(date) < int(bound[1])]
    quarter_df = pd.DataFrame(date2quarters, columns=["quarter"])
    df = pd.concat([df, quarter_df], axis=1)
    
    df = df[["bank", "quarter", "date", "press", "title", "content"]]
    df.to_pickle(DB_PATH("news_df.pickle"))


def make_tagged_df():

    df = pd.read_pickle(DB_PATH("news_df.pickle"))

    p1 = re.compile('[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]')
    p3 = re.compile(r'\s+')
    proc = lambda text: p3.sub(' ', p1.sub(' ', text))

    twitter = Twitter()
    keep_tag = ['Verb', 'Noun', 'Adjective', 'Determiner',
                'Adverb', 'Foreign', 'Alpha', 'Number']

    contents, titles = df["content"], df["title"]
    tagged = {"title": [], "content": []}

    for i in range(len(df)):
        title = [word[0] for word in twitter.pos(proc(titles[i]))
                 if word[1] in keep_tag]
        content = [word[0] for word in twitter.pos(proc(contents[i]))
                   if word[1] in keep_tag]
        tagged["title"].append(title)
        tagged["content"].append(content)
        if i % 1000 == 0:
            log = round((i + 1) / len(df) * 100, 2)
            print("{} % pos-tagging done...".format(log))

    tagged_df = pd.DataFrame(tagged)
    df = df.drop(["title", "content"], axis=1)
    df = pd.concat([df, tagged_df], axis=1)

    df.to_pickle(DB_PATH("tagged_df.pickle"))


def make_processed_df():

    def get_quartered(bank, quarter):
        df_ = df[(df["quarter"]==quarter) & (df["bank"]==bank)]
        content = sum(df_["content"], [])
        title = sum(df_["title"], [])
        quartered = {"bank": bank,
                     "quarter": quarter,
                     "title": title,
                     "content": content}
        return quartered

    df = pd.read_pickle(DB_PATH("tagged_df.pickle"))

    quarters = sorted(list(set(df["quarter"])))
    banks = sorted(list(set(df["bank"])))
    argss = [(bank, quarter) for bank in banks for quarter in quarters]
    qdf = pd.DataFrame([get_quartered(*args) for args in argss])

    contents, titles = qdf["content"], qdf["title"]
    concatenated = [contents[i] + titles[i] for i in range(len(qdf))]

    bank_names = (pd.read_pickle("./DB/crawler/bank_querys.pickle") +
                  pd.read_pickle("./DB/crawler/sbank_querys.pickle"))
    stopwords = [name.replace("은행", "") for name in bank_names]

    c1 = lambda word: re.match("[a-zA-Z0-9_]", word)
    c2 = lambda word: len(word) <= 1
    c3 = lambda word: word in stopwords
    condition = lambda word: (c1(word) or c2(word) or c3(word))

    processed = [{"text": [word for word in text if not condition(word)]}
                 for text in concatenated]
    processed_df = pd.DataFrame(processed)

    qdf = qdf.drop(["title", "content"], axis=1)
    df = pd.concat([qdf, processed_df], axis=1)

    df.to_pickle(DB_PATH("processed_df.pickle"))


def make_lda_df():

    df = pd.read_pickle(DB_PATH("processed_df.pickle"))

    if TYPE == "sbank":
        df = df[df["bank"] == "저축은행"]
    elif TYPE == "bank":
        df = df[df["bank"] != "저축은행"]
    else:
        raise Exception("bank나 sbank를 argument로...")

    text_se = df[[len(text) > 0 for text in df["text"]]]["text"]
    texts = text_se.tolist()
    
    dictionary = corpora.Dictionary(texts)
    dictionary.filter_extremes(no_below=5,
                               no_above=0.7,
                               keep_n=50000,
                               keep_tokens=None)
    corpus = [dictionary.doc2bow(text) for text in texts]
    
    lda = gensim.models.ldamulticore.LdaMulticore(corpus,
                                                  id2word=dictionary,
                                                  num_topics=50,
                                                  passes=10,
                                                  workers=cpu_count()-1)
    
    gamma = (lda.inference(corpus)
             if hasattr(lda, 'lda_beta') else lda.inference(corpus)[0])
    doc_topic_freqs = gamma / gamma.sum(axis=1)[:, None]
    
    topic_df = pd.DataFrame(doc_topic_freqs,
                            columns=["topic%02d" % i for i in range(50)],
                            index=text_se.index)
    df = df.drop(["text"], axis=1)
    df = pd.concat([df, topic_df], axis=1)
    
    df.to_pickle(DB_PATH("lda_df", "{}.pickle".format(TYPE)))


def make_doc2vec_df():
    
    df = pd.read_pickle(DB_PATH("processed_df.pickle"))

    if TYPE == "sbank":
        df = df[df["bank"] == "저축은행"]
    elif TYPE == "bank":
        df = df[df["bank"] != "저축은행"]
    else:
        raise Exception("bank나 sbank를 argument로...")
    
    text_se = df[[len(text) > 0 for text in df["text"]]]["text"]
    docs = [gensim.models.doc2vec.TaggedDocument(text, tags=[i])
            for i, text in enumerate(text_se)]
    
    model = gensim.models.doc2vec.Doc2Vec(min_count=5,
                                          window=10,
                                          size=50,
                                          sample=1e-4,
                                          negative=5,
                                          workers=cpu_count()-1)
    model.build_vocab(docs)
    model.train(docs, total_examples=model.corpus_count, epochs=30)
    
    doc_df = pd.DataFrame(model.docvecs.doctag_syn0,
                          columns=["doc%02d" % i for i in range(50)],
                          index=text_se.index)
    df = df.drop(["text"], axis=1)
    df = pd.concat([df, doc_df], axis=1)
    
    df.to_pickle(DB_PATH("doc2vec_df", "{}.pickle".format(TYPE)))


if __name__ == "__main__":

    def DB_PATH(*args):
        return path.join("./DB/nlp/", *args)

    TYPE = sys.argv[1]

    if not path.isfile(DB_PATH("news_df.pickle")):
        make_news_df()
    
    if not path.isfile(DB_PATH("tagged_df.pickle")):
        make_tagged_df()

    if not path.isfile(DB_PATH("processed_df.pickle")):
        make_processed_df()

    if not path.isfile(DB_PATH("lda_df", "{}.pickle".format(TYPE))):
        if not path.isdir(DB_PATH("lda_df")):
           os.makedirs(DB_PATH("lda_df"))
        make_lda_df()

    if not path.isfile(DB_PATH("doc2vec_df", "{}.pickle".format(TYPE))):
        if not path.isdir(DB_PATH("doc2vec_df")):
            os.makedirs(DB_PATH("doc2vec_df"))
        make_doc2vec_df()