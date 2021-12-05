import sys
sys.path.append("../../")
from dao.mongo_server import MongoServer
from dao.redis_server import RedisServer


class NewsRedisServer(object):
    def __init__(self):
        self.rec_list_redis = RedisServer().get_reclist_redis()
        self.static_news_info_redis = RedisServer().get_static_news_info_redis()
        self.dynamic_news_info_redis = RedisServer().get_dynamic_news_info_redis()

        self.redis_mongo_collection = MongoServer().get_redis_mongo_collection()

        # 删除前一天redis中的内容
        self._flush_redis_db()

    def _flush_redis_db(self):
        """每天都需要删除redis中的内容，更新当天新的内容上去
        """
        try:
            self.rec_list_redis.flushall()
        except Exception:
            print("flush redis fail ... ")

    def _get_news_id_list(self):
        """获取物料库中所有的新闻id
        """
        # 获取所有数据的news_id,
        # 暴力获取，直接遍历整个数据库，得到所有新闻的id
        # TODO 应该存在优化方法可以通过查询的方式只返回new_id字段
        news_id_list = []
        for item in self.redis_mongo_collection.find():
            news_id_list.append(item["news_id"])
        return news_id_list

    def _set_info_to_redis(self, redisdb, content):
        """将content添加到指定redis
        """
        try: 
            redisdb.set(*content)
        except Exception:
            print("set content fail".format(content))

    def news_detail_to_redis(self):
        """将需要展示的画像内容存储到redis
        静态不变的特征存到static_news_info_db_num
        动态会发生改变的特征存到dynamic_news_info_db_num
        """ 
        news_id_list = self._get_news_id_list()

        for news_id in news_id_list:
            news_item_dict = self.redis_mongo_collection.find_one({"news_id": news_id}) # 返回的是一个列表里面套了一个字典  
            news_item_dict.pop("_id")

            # 分离动态属性和静态属性
            static_news_info_dict = dict()
            static_news_info_dict['news_id'] = news_item_dict['news_id']
            static_news_info_dict['title'] = news_item_dict['title']
            static_news_info_dict['ctime'] = news_item_dict['ctime']
            static_news_info_dict['content'] = news_item_dict['content']
            static_news_info_dict['cate'] = news_item_dict['cate']
            static_news_info_dict['url'] = news_item_dict['url']
            static_content_tuple = "static_news_detail:" + str(news_id), str(static_news_info_dict)
            self._set_info_to_redis(self.static_news_info_redis, static_content_tuple)

            dynamic_news_info_dict = dict()
            dynamic_news_info_dict['likes'] = news_item_dict['likes']
            dynamic_news_info_dict['collections'] = news_item_dict['collections']
            dynamic_news_info_dict['read_num'] = news_item_dict['read_num']
            dynamic_content_tuple = "dynamic_news_detail:" + str(news_id), str(dynamic_news_info_dict)
            self._set_info_to_redis(self.dynamic_news_info_redis, dynamic_content_tuple)

        print("news detail info are saved in redis db.")


if __name__ == "__main__":
    # 每次创建这个对象的时候都会把数据库中之前的内容删除
    news_redis_server = NewsRedisServer()
    # 将最新的前端展示的画像传到redis
    news_redis_server.news_detail_to_redis()

    