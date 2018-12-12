
import os
import re
import shutil


def get_global_filepaths(root_dir):

    ls = os.listdir(root_dir)
    paths = [os.path.join(root_dir, c) for c in ls]
    
    filepaths = [[path] if os.path.isfile(path)
                 else get_global_filepaths(path)
                 for path in paths]
    
    filepaths = sum(filepaths, [])
    
    return filepaths


def clear_current_dir(blacklist):

    results = [re.compile('(.*?/'+black+')(/.*|$)').search(path)
               for path in get_global_filepaths('.')
               for black in blacklist]
    targets = set(result.group(1) for result in results if result)

    for target in targets:
        print(target)
        if os.path.isdir(target):
            shutil.rmtree(target)
        else:
            os.remove(target)


if __name__ == '__main__':

    clear_current_dir([
        '.DS_Store',
        '__pycache__',
        '.ipynb_checkpoints',
        '.vscode'
    ])