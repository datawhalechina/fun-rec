# -*- coding: utf-8 -*-
from re import S
import sys
import json
sys.path.append("../")
from material_process.utils import get_key_words
from dao.mongo_server import MongoServer
from dao.redis_server import RedisServer

"""
新闻画像中包含的字段：
0. news_id 新闻的id
1. title 标题
2. raw_key_words (爬下来的关键词，可能有缺失)
3. manual_key_words (根据内容生成的关键词)
4. ctime 时间
5. content 新闻具体内容
6. cate 新闻类别
7. likes 新闻点赞数量
8. collections 新闻收藏数量
9. read_nums 阅读次数
10. url 新闻原始链接
"""

class NewsPortraitServer:
    def __init__(self):
        """初始化相关参数
        """
        self.mongo_server = MongoServer()   
        self.sina_collection = self.mongo_server.get_sina_news_collection()
        self.material_collection = self.mongo_server.get_feature_protrail_collection()
        self.redis_mongo_collection = self.mongo_server.get_redis_mongo_collection()

        self.news_dynamic_feature_redis = RedisServer().get_dynamic_news_info_redis()

    def _find_by_title(self, collection, title):
        """从数据库中查找是否有相同标题的新闻数据
        数据库存在当前标题的数据返回True, 反之返回Flase
        """
        # find方法，返回的是一个迭代器
        find_res = collection.find({"title": title})
        if len(list(find_res)) != 0:
            return True
        return False

    def _generate_feature_protrail_item(self, item):
        """生成特征画像数据，返回一个新的字典
        """
        news_item = dict()
        news_item['news_id'] = item['news_id']
        news_item['title'] = item['title']
        # 从新闻内容中提取的关键词没有原始新闻爬取时的关键词准确，所以手动提取的关键词
        # 只是作为一个补充，当原始新闻中没有提供关键词的时候可以使用
        news_item['raw_key_words'] = item['raw_key_words']
        key_words_list = get_key_words(item['content'])
        news_item['manual_key_words'] = ",".join(key_words_list)
        news_item['ctime'] = item['ctime']
        news_item['content'] = item['content']
        news_item['cate'] = item['cate']
        news_item['url'] = item['url']
        news_item['likes'] = 0
        news_item['collections'] = 0
        news_item['read_num'] = 0
        news_item['hot_value'] = 1000 # 初始化一个比较大的热度值，会随着时间进行衰减
        
        return news_item

    def update_new_items(self):
        """将今天爬取的数据构造画像存入画像数据库中
        """
        # 遍历今天爬取的所有数据
        for item in self.sina_collection.find():
            # 根据标题进行去重
            if self._find_by_title(self.material_collection, item["title"]):
                continue

            news_item = self._generate_feature_protrail_item(item)

            # 插入物料池
            self.material_collection.insert_one(news_item)
        
        print("run update_new_items success.")

    def update_redis_mongo_protrail_data(self):
        """每天都需要将新闻详情更新到redis中，并且将前一天的redis数据删掉
        """
        # 每天先删除前一天的redis展示数据，然后再重新写入
        self.redis_mongo_collection.drop()
        print("delete RedisProtrail ...")
        # 遍历特征库
        for item in self.material_collection.find():
            news_item = dict()
            news_item['news_id'] = item['news_id']
            news_item['title'] = item['title']
            news_item['ctime'] = item['ctime']
            news_item['content'] = item['content']
            news_item['cate'] = item['cate']
            news_item['url'] = item['url']
            news_item['likes'] = item['likes']
            news_item['collections'] = item['collections']
            news_item['read_num'] = item['read_num']

            self.redis_mongo_collection.insert_one(news_item)
        print("run update_redis_mongo_protrail_data success.")

    def update_dynamic_feature_protrail(self):
        """用redis的动态画像更新mongodb的画像
        """
        # 遍历redis的动态画像，将mongodb中对应的动态画像更新        
        news_list = self.news_dynamic_feature_redis.keys()
        for news_key in news_list:
            news_dynamic_info_str = self.news_dynamic_feature_redis.get(news_key)
            news_dynamic_info_str = news_dynamic_info_str.replace("'", '"' ) # 将单引号都替换成双引号
            news_dynamic_info_dict = json.loads(news_dynamic_info_str)
            
            # 查询mongodb中对应的数据，并将对应的画像进行修改
            news_id = news_key.split(":")[1]
            mongo_info = self.material_collection.find_one({"news_id": news_id})
            new_mongo_info = mongo_info.copy()
            new_mongo_info['likes'] = news_dynamic_info_dict["likes"]
            new_mongo_info['collections'] = news_dynamic_info_dict["collections"]
            new_mongo_info['read_num'] = news_dynamic_info_dict["read_num"]

            self.material_collection.replace_one(mongo_info, new_mongo_info, upsert=True) # upsert为True的话，没有就插入
        print("update_dynamic_feature_protrail success.")



if __name__ == "__main__":
    # TODO 需要放到 其他逻辑中，将物料这块的逻辑打通
    news_protrait = NewsPortraitServer()
    # news_protrait.update_new_items()
    news_protrait.update_redis_mongo_protrail_data()
    # news_protrait.update_dynamic_feature_protrail()
