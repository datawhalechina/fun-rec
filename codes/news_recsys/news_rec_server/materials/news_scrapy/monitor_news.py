# -*- coding: utf-8 -*-
import sys, time
import pymongo
from sinanews.settings import MONGO_HOST, MONGO_PORT, SINA_DB_NAME, COLLECTION_NAME_PRFIX

if __name__ == "__main__":
    news_num = int(sys.argv[1])
    time_str = time.strftime("%Y%m%d", time.localtime())

    # 实际的collection_name
    collection_name = COLLECTION_NAME_PRFIX + "_" + time_str
    
    # 链接数据库
    client = pymongo.MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[SINA_DB_NAME]
    collection = db[collection_name]

    # 查找当前集合中所有文档的数量
    cur_news_num = collection.count()

    if cur_news_num < news_num:
        print("the news nums of {}_{} collection is {} and less then {}.".\
            format(COLLECTION_NAME_PRFIX, time_str, cur_news_num, news_num))