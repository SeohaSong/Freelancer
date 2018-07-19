import pandas as pd
import asyncio
import time
import json
import sys


with open('./metadata.json') as f:
    METADATA = json.load(f)


class DH():
    
    def __init__(self, case):
        self._load_data(case)
    
    def _load_data(self, case, signal=False, data=None):
        def show_status(i=0):
            nonlocal signal
            while True:
                i += 1
                time.sleep(0.5)
                sys.stdout.write("\r[DH] Loading .% -3s"%("."*(i%3)))
                if signal:
                    sys.stdout.write("\r[DH] Loading complete\n")
                    break
        def get_data():
            nonlocal signal, data
            df = pd.read_csv(METADATA['path'][case], index_col=0)
            data = df.loc[:, df.sum(axis=0) > 0]
            signal = True
        async def main():
            futures = [
                loop.run_in_executor(None, show_status),
                loop.run_in_executor(None, get_data)
            ]
            await asyncio.wait(futures)
        loop = asyncio.get_event_loop()
        loop.run_until_complete(main())
        self.df = data
        
    def set_data(self, n_train, i=0):
        print("[Data_Handler] Making train & test data ...")
        df = self.df
        cols = df.columns
        def get_data(c):
            nonlocal i
            i += 1
            se = df[c]
            se = se[df.index[se > 0][0]:]
            b1, b2 = n_train, n_train+1
            data = (se[:b1], se[b1:b2]) if len(se) > n_train+1 else None
            sys.stdout.write("\r% 5.2f%%" % (i/len(cols)*100))
            return data
        se = pd.Series({c: get_data(c) for c in cols})
        print()
        se = se[se.notna()]
        self.i2d = se
        return self