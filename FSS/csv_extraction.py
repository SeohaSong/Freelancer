import pandas as pd
from os import path
import os

DESCRIPTION = """
순서
    python crawler.py bank
    python crawler.py sbank
    python nlp.py
    python model.py

    # nlp와 model의 최종 파일을 csv로 추출
    python csv.py
"""


def report_count():
    
    os.makedirs(DB_PATH("count"))
    df = pd.read_pickle("./DB/nlp/news_df.pickle")[["bank", "quarter"]]
    
    banks = sorted(list(set(df["bank"])))
    quarters = [*["20%02d%s"%(i, month)
                  for i in range(18)
                  for month in ["03", "06", "09", "12"]]]
    count_dicts = [{"bank": bank, "quarter": quarter}
                   for bank in banks for quarter in quarters]
    
    for count_dict in count_dicts:
        bank, quarter = count_dict["bank"], count_dict["quarter"]
        selected_df = df[(df["bank"] == bank) & (df["quarter"] == quarter)]
        count_dict["count"] = len(selected_df)
        
    count_df = pd.DataFrame(count_dicts)[["bank", "quarter", "count"]]
    
    bank_df = count_df[count_df["bank"] != "저축은행"]
    sbank_df = count_df[count_df["bank"] == "저축은행"]
    
    bank_df.to_csv(DB_PATH("count", "bank.csv"), index=False)
    sbank_df.to_csv(DB_PATH("count", "sbank.csv"), index=False)

    
def report_by_csv(dir_name):
    
    os.makedirs(DB_PATH(dir_name))
    
    bank_df = pd.read_pickle("./DB/nlp/{}_df/bank.pickle".format(dir_name))
    sbank_df = pd.read_pickle("./DB/nlp/{}_df/sbank.pickle".format(dir_name))
    
    bank_df.to_csv(DB_PATH(dir_name, "bank.csv"), index=False)
    sbank_df.to_csv(DB_PATH(dir_name, "sbank.csv"), index=False)
    

if __name__ == "__main__":

    def DB_PATH(*args):
        return path.join("./DB/csv_extraction/", *args)
            
    try:
        if not path.isdir(DB_PATH("count")):
            report_count()
        for dir_name in ["doc2vec", "lda"]:
            if not path.isdir(DB_PATH(dir_name)):
                report_by_csv(dir_name)
        if not path.isfile(DB_PATH("report.csv")):
            df = pd.read_pickle("./DB/model/report_df.pickle")
            df.to_csv(DB_PATH("report.csv"), index=False)
    except:
        print(DESCRIPTION)