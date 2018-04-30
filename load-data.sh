curl -o imdb_master.csv \
https://s3.ap-northeast-2.amazonaws.com/seohasong/imdb_master.csv

mkdir data
mv imdb_master.csv data/master.csv