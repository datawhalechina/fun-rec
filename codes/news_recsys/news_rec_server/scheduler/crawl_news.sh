#!/bin/bash
# python 环境需要换成自己的虚拟环境中的Python
python=/home/recsys/miniconda3/envs/news_rec_py3/bin/python
home_path=$HOME

news_recsys_path=${home_path}"/fun-rec/codes/news_recsys/news_rec_server"

# 得跳转到这个目录才能执行下面爬虫的命令
cd ${news_recsys_path}/materials/news_scrapy

# 系统正式运行的时候需要修改pages的值
pages=30
min_news_num=1000

echo "$(date -d today +%Y-%m-%d-%H-%M-%S)"
# 爬虫
${python} ${news_recsys_path}/materials/news_scrapy/sinanews/run.py  --pages=${pages}
if [ $? -eq 0 ]; then
    echo "scrapy crawl sina_spider --pages ${page} success."
else   
    echo "scrapy crawl sina_spider --pages ${page} fail."
fi


# 检查今天爬取的数据是否少于min_news_num篇文章，这里也可以配置邮件报警
${python} ${news_recsys_path}/materials/news_scrapy/monitor_news.py ${min_news_num}
if [ $? -eq 0 ]; then
    echo "run python monitor_news.py success."
else   
    echo "run python monitor_news.py fail."
fi
