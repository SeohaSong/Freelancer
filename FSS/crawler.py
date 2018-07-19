from copy import deepcopy
import pickle
import sys
import pandas as pd
import os
from os import path
import requests
import re
from bs4 import BeautifulSoup


def get_remains_paths():

    def _save_dir(path_):
        os.makedirs(path_)        
        remains_path = path.join(path_, "remains.pickle")
        all_years = [str(i) for i in range(2000, 2018)]
        with open(remains_path, "wb") as f:
            pickle.dump(all_years, f)

    def get_remains_path(path_):
        if not path.isdir(path_):
            _save_dir(path_)
        return path.join(path_, "remains.pickle")

    banks = pd.read_pickle(DB_PATH(TYPE + "_querys.pickle"))    
    paths = [DB_PATH("text", TYPE, bank) for bank in banks]
    remains_paths = [get_remains_path(path_) for path_ in paths]

    return [remains for remains in remains_paths if path.isfile(remains)]


def get_remain_files(remains_paths):

    def get_argss(path_):
        bank = path.split(path.dirname(path_))[-1]
        remain_years = pd.read_pickle(path_)
        years = [str(i) for i in range(2000, 2018)]
        argss = [(bank, year) for year in years if year in remain_years]
        return argss

    def get_file(bank, year):
        schema = pd.read_pickle(DB_PATH("schema.pickle"))
        file_ = deepcopy(schema)
        file_["bank"] = bank
        file_["year"] = year
        file_["type"] = TYPE
        return file_

    argss = sum([get_argss(path_) for path_ in remains_paths], [])
    files = [get_file(*args) for args in argss]

    return files


def crawl_url(file_, safe=True, page=0):

    def crawl():
        default_url = "https://search.naver.com/search.naver" + \
                      "?ie=utf8&where=news&sort=1&field=1"
        start = "&start=" + str((page) * 10 + 1)
        nso = "&nso=so:dd,p:from" + from_ + "to" + to + ",a:t"
        query = "&query=\"" + bank + "\""
        url = default_url + query + start + nso
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        bs = BeautifulSoup(response.text, "html.parser")
        return bs, url

    def parse():
        a_tags = bs.select("._sp_each_url")
        for a_tag in a_tags:
            url = a_tag["href"]
            if not re.compile("http://news.naver").match(url) is None:
                news = newses[0].copy()
                news["url"] = url
                newses.append(news)
        raw_page_info1 = bs.select_one(".section_head div span").text
        raw_page_info2 = raw_page_info1.replace(",", "")
        page_info = [int(s) for s in re.findall(r'\d+', raw_page_info2)]
        new_from = from_
        if len(page_info) == 0 or page_info[1] == page_info[2]:
            safe = False
        else:
            safe = True
            if page == 399:
                inlines = bs.select(".txt_inline")
                new_from = (re.compile(r"\d\d\d\d\.\d\d\.\d\d")
                            .search(str(inlines[-1]))
                            .group()
                            .replace(".", ""))
        return safe, new_from, page + 1, page_info

    def make_file():
        path_ = DB_PATH("text", TYPE, bank)
        file_path = path.join(path_, year + ".pickle")
        remains_path = path.join(path_, "remains.pickle")
        remains = pd.read_pickle(remains_path)
        remains.remove(year)
        if len(newses) > 0:
            with open(file_path, "wb") as f:
                pickle.dump(file_, f)
        if len(remains) == 0:
            os.remove(remains_path)
        else:
            with open(remains_path, "wb") as f:
                pickle.dump(remains, f)

    def remove_overlap(url_set = [], news_set = []):
        newses.pop(0)
        for news in newses:
            if news["url"] not in url_set:
                url_set.append(news["url"])
                news_set.append(news)
        file_["newses"] = news_set

    year, bank = file_["year"], file_["bank"]
    newses = file_["newses"]
    from_, to = (year + "1231"), (year + "0101")

    while safe:
        bs, url = crawl()
        safe, from_, page, page_info = parse()
        print("{} in {} ({}/{}): {}/{} \n {}".format(
            bank, year, index + 1, len(files), page, page_info, url))
        page %= 400

    remove_overlap()
    make_file()


def get_undownloaded_path_pairs():        

    def _get_pair(t_path, s_path, name):
        t_file_path = path.join(t_path, name)
        s_file_path = path.join(s_path, name)
        if not path.isdir(s_path):
            os.makedirs(s_path)
        return t_file_path, s_file_path

    def get_path_pairs(bank):
        t_path = DB_PATH("text", TYPE, bank)
        s_path = DB_PATH("source", TYPE, bank)
        names = os.listdir(t_path)
        pairs = [_get_pair(t_path, s_path, name) for name in names
                 if not path.isfile(path.join(s_path, name))]
        return pairs

    banks = os.listdir(DB_PATH("text", TYPE))
    path_pairs = sum([get_path_pairs(bank) for bank in banks], [])

    return path_pairs


def download(path_pair):

    def get_source_and_news(news, log=[]):
        url = news["url"]
        try:
            response = requests.get(url)
            response_text = response.text
            bs = BeautifulSoup(response_text, "html.parser")
            press = bs.select_one("meta[property='me2:category1']")["content"]
            date = bs.select_one(".t11").text.split(" ")[0].replace("-", "")
            title = bs.select_one("#articleTitle").text
            raw_content1 = bs.select_one("#articleBodyContents")
            raw_content1.select_one("script").clear()
            raw_content2 = raw_content1.text
            content = (raw_content2.replace("\n", "")
                                   .replace("\t", "")
                                   .replace("\r", ""))
            news["press"], news["date"] = press, date
            news["title"], news["content"] = title, content
            source = {"url": url, "html": response_text}
            result = "Success: {}".format(url)
        except:
            source = {"url": url, "html": None}
            result = "Fail: {}".format(url)
        log.append(None)
        print("{}/{} in {}\n{}".format(len(log), len(newses), LOG, result))
        return source

    text_path, source_path = path_pair
    text_file = pd.read_pickle(text_path)
    newses = text_file["newses"]
    source_file = [get_source_and_news(news) for news in newses]

    with open(text_path, "wb") as f:
        pickle.dump(text_file, f)

    with open(source_path, "wb") as f:
        pickle.dump(source_file, f)


if __name__ == "__main__":

    def DB_PATH(*args):
        return path.join("./DB/crawler/", *args)

    TYPE = sys.argv[1]

    print("Check for remain banks...")
    remains_paths = get_remains_paths()

    print("Check for remain years...")
    files = get_remain_files(remains_paths)

    for index, file_ in enumerate(files):        
        print("Crawl and save file...")
        crawl_url(file_)

    print("Get undownloaded file paths...")
    path_pairs = get_undownloaded_path_pairs()
    
    for index, path_pair in enumerate(path_pairs):
        LOG = "{}/{}\nfor {}".format(index + 1, len(path_pairs), path_pair)
        download(path_pair)













