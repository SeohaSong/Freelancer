import requests
import asyncio
import time
import json
import sys


with open('./metadata.json') as f:
    METADATA = json.load(f)


def load_data(case, signal=False):
    def show_status(i=0):
        nonlocal signal
        while True:
            i += 1
            time.sleep(0.5)
            sys.stdout.write("\r[init] Loading data from remote .% -3s"
                            % ("."*(i%3)))
            if signal:
                sys.stdout.write('\r[init] Loading complete'+' '*20+'\n')
                break
    def get_data():
        nonlocal signal
        response = requests.get(METADATA['url'][key])
        with open(METADATA['path'][key], 'w') as f:
            f.write(response.text)
        signal = True
    async def main():
        futures = [
            loop.run_in_executor(None, show_status),
            loop.run_in_executor(None, get_data)
        ]
        await asyncio.wait(futures)
    print('(%s)' % METADATA['path'][case])
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())


if __name__ == '__main__':

    # for key in META_INFO['key']:
    for key in ['df']:
        load_data(key)
