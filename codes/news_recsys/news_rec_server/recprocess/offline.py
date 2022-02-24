
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
        
    def hot_list_template_to_redis(self):
        """热门页面，初始化的时候每个用户都是同样的内容
        """
        self.hot_recall.update_hot_value()
        # 将新闻的热度模板添加到redis中
        self.hot_recall.group_cate_for_news_list_to_redis()
        print("a hot rec list are saved into redis.....")
        
    def rec_list_to_redis(self):
        """个性化推荐列表，千人千面
        """
        pass 

    def cold_start_template_to_redis(self):
        """冷启动列表模板
        """
        # 生成冷启动模板
        self.cold_start.generate_cold_user_strategy_templete_to_redis_v2()
        # 初始化已有用户的冷启动列表
        self.cold_start.user_news_info_to_redis()


if __name__ == "__main__":
    # 生成统一的，用于测试的倒排索引
    offline_server = OfflineServer()
    offline_server.hot_list_template_to_redis()
    offline_server.cold_start_template_to_redis()

