# Underscore word attack

> 고려대학교 강필성 교수님 비정형 데이타 분석 수업 발 프로젝트

> 송서하, 양우식, 정민성

## Data load (On linux shell)

```bash

$ . load-data.sh

$ file data/master.csv
data/master.csv: ISO-8859 text, with very long lines, with CRLF line terminators

```

## Logical order of file

1. Embedding.ipynb
2. LSTM.ipynb

## About data

- 원본 데이터 10만개
     - 레이블 된것 5만개
        - 평가 데이터 25000개
        - 학습 데이터 25000개
     - 레이블 안된것 5만개

- 주요 데이터 속성
    - review: 영화에 대한 리뷰 문장
    - label: 긍정(pos),  부정(neg) 두 종류의 값
    
## Description - Embedding


### 데이터 전처리

![](./img/1.png)

### Word2Vec 하이퍼 파라미터

- min_count: 10
- window
    - normal: 5
    - underscore: 10
- dimension: 128

### 각 임배딩에 대한 시간복잡도

![](./img/2.png)

### 2차원에서 본 임배딩 결과 비교

![](./img/3.png)
![](./img/4.png)
![](./img/5.png)
![](./img/6.png)
![](./img/7.png)
![](./img/8.png)