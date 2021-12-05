
import sys
sys.path.append("../")
from dao.mongo_server import MongoServer
from dao.redis_server import RedisServer
from recall.hot_recall import HotRecall
from cold_start.cold_start import ColdStart

# 这个类是用来实现离线推荐流程的，给每个用户都存储一个倒排索引列表
# 对于热门页的内容，初始化的时候每个用户都是一样的
# 这个类的实例会在处理完物料之后，生成当前最新的用户推荐列表，热门列表，及冷启动内容模板
class OfflineServer(object):
    def __init__(self):
        self.redis_mongo_collection = MongoServer().get_redis_mongo_collection()
        self.reclist_redis = RedisServer().get_reclist_redis()
        self.hot_recall = HotRecall()
        self.cold_start = ColdStart()
        
    def hot_list_to_redis(self):
        """热门页面，初始化的时候每个用户都是同样的内容
        """
        self.hot_recall.get_hot_rec_list()
        print("a hot rec list are saved into redis.....")
        
    def rec_list_to_redis(self):
        """个性化推荐列表，千人千面
        """
        pass 

    def cold_start_template_to_redis(self):
        """冷启动列表模板
        """
        self.cold_start.generate_cold_user_strategy_templete_to_redis()
        # 对现有用户先拷贝一份
        self.cold_start.generate_cold_start_news_list_to_redis_for_register_user()
        
    def _get_user_id_list(self):
        """获取所有注册用户的id
        """
        pass 

    def _get_news_id_list(self):
        """获取所有新闻id
        """
        # 获取所有数据的news_id,
        # 暴力获取，直接遍历整个数据库，得到所有新闻的id
        # TODO 应该存在优化方法可以通过查询的方式只返回new_id字段
        news_id_list = []
        for item in self.redis_mongo_collection.find():
            news_id_list.append(item["news_id"])
        return news_id_list 

    def test(self):
        """给redis中加入一个倒排索引用于测试
        """
        news_id_list = self._get_news_id_list()
        value_list = [i for i in range(len(news_id_list))]

        for news_id, val in zip(news_id_list, value_list):
            # print({news_id: val})
            self.reclist_redis.zadd("rec_list", {news_id: val}, nx=True)
    
        print("a sorted news_ids are saved into redis.") 


if __name__ == "__main__":
    # 生成统一的，用于测试的倒排索引
    # TODO 待测试
    offline_server = OfflineServer()
    # offline_server.test()
    offline_server.hot_list_to_redis()
    offline_server.cold_start_template_to_redis()

