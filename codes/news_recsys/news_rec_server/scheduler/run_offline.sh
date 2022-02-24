#!/bin/bash

# python 环境需要换成自己的虚拟环境中的Python
python=/home/recsys/miniconda3/envs/news_rec_py3/bin/python
home_path=$HOME
news_recsys_path=${home_path}"/fun-rec/codes/news_recsys/news_rec_server"

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
