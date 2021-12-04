#!/bin/bash

python=/home/recsys/miniconda3/envs/news_rec_py3/bin/python
news_recsys_path="/home/recsys/news_rec_server"

cd ${news_recsys_path}/recprocess

echo "$(date -d today +%Y-%m-%d-%H-%M-%S)"

# 离线将推荐列表和热门列表存入redis
${python} offline.py
if [ $? -eq 0 ]; then
    echo "run ${python} ${news_recsys_path}/recprocess/offline.py success."
else   
    echo "run ${python} ${news_recsys_path}/recprocess/offline.py fail."
fi

echo " "
