#!/bin/bash
# python 环境需要换成自己的虚拟环境中的Python
python=/home/recsys/miniconda3/envs/news_rec_py3/bin/python
home_path=$HOME
news_recsys_path=${home_path}"/fun-rec/codes/news_recsys/news_rec_server"

echo "$(date -d today +%Y-%m-%d-%H-%M-%S)"

# 为了更方便的处理路径的问题，可以直接cd到我们想要运行的目录下面
cd ${news_recsys_path}/materials

# 更新物料画像
${python} process_material.py
if [ $? -eq 0 ]; then
    echo "process_material success."
else   
    echo "process_material fail."
fi 

# 更新用户画像
${python} process_user.py
if [ $? -eq 0 ]; then
    echo "process_user.py success."
else   
    echo "process_user.py fail."
fi

# 清除前一天redis中的数据，更新最新今天最新的数据
${python} update_redis.py
if [ $? -eq 0 ]; then
    echo "update_redis success."
else   
    echo "update_redis fail."
fi


echo " "

