import sys
sys.path.append('../../')
from conf.dao_config import cate_dict
from dao.mongo_server import MongoServer
from dao.redis_server import RedisServer
from datetime import datetime


# 这里需要从物料库中获取物料的信息，然后更新物料当天最新的热度信息
# 最终将计算好的物料热度，对物料进行排序

class HotRecall(object):
    def __init__(self):
        self.feature_protrail_collection = MongoServer().get_feature_protrail_collection()
        self.reclist_redis = RedisServer().get_reclist_redis()
        self.cate_dict = cate_dict

    def update_hot_value(self):
        """更新物料库中所有新闻的热度值
        """
        # 遍历物料池里面的所有文章
        for item in self.feature_protrail_collection.find():
            news_id = item['news_id']
            news_cate = item['cate']
            news_ctime = item['ctime']
            news_likes_num = item['likes']
            news_collections_num = item['collections']
            news_read_num = item['read_num']
            news_hot_value = item['hot_value']

            # 时间转换与计算时间差   前提要保证当前时间大于新闻创建时间，目前没有捕捉异常
            news_ctime_standard = datetime.strptime(news_ctime, "%Y-%m-%d %H:%M")
            cur_time_standard = datetime.now()
            time_day_diff = (cur_time_standard - news_ctime_standard).days
            time_hour_diff = (cur_time_standard - news_ctime_standard).seconds / 3600

            # 只要最近3天的内容
            if time_day_diff > 3:
                continue

            # 72 表示的是3天，
            news_hot_value = (news_likes_num * 0.6 + news_collections_num * 0.3 + news_read_num * 0.1) * 10 / (1 + time_hour_diff / 72) 

            # 更新物料池的文章hot_value
            item['hot_value'] = news_hot_value
            self.feature_protrail_collection.update({'news_id':news_id}, item)

    def get_hot_rec_list(self):
        """获取物料的点赞，收藏和创建时间等信息，计算热度并生成热度推荐列表存入redis
        """
        # 遍历物料池里面的所有文章
        for item in self.feature_protrail_collection.find():
            news_id = item['news_id']
            news_cate = item['cate']
            news_ctime = item['ctime']
            news_likes_num = item['likes']
            news_collections_num = item['collections']
            news_read_num = item['read_num']
            news_hot_value = item['hot_value']

            #print(news_id, news_cate, news_ctime, news_likes_num, news_collections_num, news_read_num, news_hot_value)

            # 时间转换与计算时间差   前提要保证当前时间大于新闻创建时间，目前没有捕捉异常
            news_ctime_standard = datetime.strptime(news_ctime, "%Y-%m-%d %H:%M")
            cur_time_standard = datetime.now()
            time_day_diff = (cur_time_standard - news_ctime_standard).days
            time_hour_diff = (cur_time_standard - news_ctime_standard).seconds / 3600

            # 只要最近3天的内容
            if time_day_diff > 3:
                continue
            
            # 计算热度分，这里使用魔方秀热度公式， 可以进行调整, read_num 上一次的 hot_value  上一次的hot_value用加？  因为like_num这些也都是累加上来的， 所以这里计算的并不是增值，而是实时热度吧
            # news_hot_value = (news_likes_num * 6 + news_collections_num * 3 + news_read_num * 1) * 10 / (time_hour_diff+1)**1.2
            # 72 表示的是3天，
            news_hot_value = (news_likes_num * 0.6 + news_collections_num * 0.3 + news_read_num * 0.1) * 10 / (1 + time_hour_diff / 72) 

            #print(news_likes_num, news_collections_num, time_hour_diff)

            # 更新物料池的文章hot_value
            item['hot_value'] = news_hot_value
            self.feature_protrail_collection.update({'news_id':news_id}, item)

            #print("news_hot_value: ", news_hot_value)

            # 保存到redis中
            self.reclist_redis.zadd('hot_list', {'{}_{}'.format(news_cate, news_id): news_hot_value}, nx=True)


    def group_cate_for_news_list_to_redis(self, ):
        """将每个用户的推荐列表按照类别分开，方便后续打散策略的实现
        对于热门页来说，只需要提前将所有的类别新闻都分组聚合就行，后面单独取就可以
        注意：运行当前脚本的时候需要需要先更新新闻的热度值
        """
        # 1. 按照类别先将所有的新闻都分开存储
        for cate_id, cate_name in self.cate_dict.items():
            redis_key = "news_cate:{}".format(cate_id)
            for item in self.feature_protrail_collection.find({"cate": cate_name}):
                self.reclist_redis.zadd(redis_key, {'{}_{}'.format(item['cate'], item['news_id']): item['hot_value']})
        

if __name__ == "__main__":
    hot_recall = HotRecall()
    # 更新物料的热度值
    hot_recall.update_hot_value()
    # 将新闻的热度模板添加到redis中
    hot_recall.group_cate_for_news_list_to_redis()


