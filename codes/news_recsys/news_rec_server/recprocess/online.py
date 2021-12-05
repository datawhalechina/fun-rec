import sys
sys.path.append("../../")
sys.path.append("../")
import json
import time
import threading

from dao.redis_server import RedisServer
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from controller.user_action_controller import UserAction

redis_server = RedisServer()

class OnlineServer(object):
    """单例模式推荐服务类
    """
    _instance_lock = threading.Lock()
 
    def __init__(self,):
        self.reclist_redis_db = redis_server.get_reclist_redis()
        self.static_news_info_redis_db = redis_server.get_static_news_info_redis()
        self.dynamic_news_info_redis_db = redis_server.get_dynamic_news_info_redis()
        self.exposure_redis_db = redis_server.get_exposure_redis()
        self.register_sql_sess = MysqlServer().get_register_user_session()

    def __new__(cls, *args, **kwargs):
        if not hasattr(OnlineServer, "_instance"):
            with OnlineServer._instance_lock:
                if not hasattr(OnlineServer, "_instance"):
                    OnlineServer._instance = object.__new__(cls)  
        return OnlineServer._instance
    
    def _get_register_user_cold_start_redis_key(self):
        """通过查sql表得到用户的redis key进而确定当前新用户使用哪一个新的模板
        """
        user_info = self.register_sql_sess.query(RegisterUser).find_one()
        if int(user_info.age) < 23 and user_info.gender == "female":
            redis_key = "cold_start_group:{}".format(str(1))
        elif int(user_info.age) >= 23 and user_info.gender == "female":
            redis_key = "cold_start_group:{}".format(str(2))
        elif int(user_info.age) < 23 and user_info.gender == "male":
            redis_key = "cold_start_group:{}".format(str(3))
        elif int(user_info.age) >= 23 and user_info.gender == "male":
            redis_key = "cold_start_group:{}".format(str(4))
        else:
            pass 
        return redis_key

    def get_cold_start_rec_list(self, userid):
        """获取冷启动用户的推荐列表
        """
        cold_start_user_key = "cold_start:{}".format(userid)
        if self.reclist_redis_db.exists(cold_start_user_key) == 0:
            # 如果当前redis中没有该用户的推荐列表直接从冷启动模板中拷贝一份
            user_key = "cold_start:{}".format(userid)
            redis_key = self._get_register_user_cold_start_redis_key(userid)
            self.reclist_redis.zunionstore(user_key, [redis_key])

        user_exposure_prefix = "user_exposure:"
        user_exposure_key = user_exposure_prefix + str(userid)

        # 一页默认10个item, 但这里候选20条，因为有可能有的在推荐页曝光过
        article_num = 200

        # 返回的是一个news_id列表   zrevrange排序分值从大到小
        candiate_id_list = self.reclist_redis_db.zrevrange(cold_start_user_key, 0, article_num-1)

        # print("candiate_id_list", candiate_id_list)

        if len(candiate_id_list) > 0:
            # 根据news_id获取新闻的具体内容，并返回一个列表，列表中的元素是按照顺序展示的新闻信息字典
            news_info_list = []
            selected_news = []   # 记录真正被选了的
            cou = 0

            # 曝光列表
            print("self.reclist_redis_db.exists(key)",self.exposure_redis_db.exists(user_exposure_key))
            if self.exposure_redis_db.exists(user_exposure_key) > 0:
                exposure_list = self.exposure_redis_db.smembers(user_exposure_key)
                news_expose_list = set(map(lambda x: x.split(':')[0], exposure_list))
            else:
                news_expose_list = set()

            for i in range(len(candiate_id_list)):
                candiate = candiate_id_list[i]
                news_id = candiate.split('_')[1]

                # 去重曝光过的，包括在推荐页以及hot页
                if news_id in news_expose_list:
                    continue

                # TODO 有些新闻可能获取不到静态的信息，这里应该有什么bug
                # bug 原因是，json.loads() redis中的数据会报错，需要对redis中的数据进行处理
                # 可以在物料处理的时候过滤一遍，json无法load的新闻
                try:
                    news_info_dict = self.get_news_detail(news_id)
                except Exception as e:
                    with open("/home/recsys/news_rec_server/logs/news_bad_cases.log", "a+") as f:
                        f.write(news_id + "\n")
                        print("there are not news detail info for {}".format(news_id))
                    continue
                # news_info_str = news_info_str.replace("'", '"' ) # 将单引号都替换成双引号
                # news_info_dict = json.loads(news_info_str)
                # 需要确认一下前端接收的json，key需要是单引号还是双引号
                news_info_list.append(news_info_dict)
                news_expose_list.add(news_id)
                # 注意，原数的key中是包含了类别信息的
                selected_news.append(candiate)
                cou += 1
                if cou == 10:
                    break
            
            if len(selected_news) > 0:
                # 手动删除读取出来的缓存结果, 这个很关键, 返回被删除的元素数量，用来检测是否被真的被删除了
                removed_num = self.reclist_redis_db.zrem(cold_start_user_key, *selected_news)
                print("the numbers of be removed:", removed_num)

            # 曝光重新落表
            self._save_user_exposure(userid,news_expose_list)
            #print(news_expose_list, len(news_expose_list))
            # print(news_info_list)
            return news_info_list 
        else:
            #TODO 临时这么做，这么做不太好
            self.reclist_redis_db.zunionstore(cold_start_user_key, ["hot_list"])
            print("copy a hot_list for {}".format(cold_start_user_key))
            # 如果是把所有内容都刷完了再重新拷贝的数据，还得记得把今天的曝光数据给清除了
            self.exposure_redis_db.delete(user_exposure_key)
            return  self.get_cold_start_rec_list(userid)


    def get_rec_list(self, user_id, page_id):
        """给定页面的展示范围进行展示
        user_id 后面做个性化推荐的时候需要用到
        """
        # 根据page id计算需要获取redis中哪些范围的news_id, 假设每一页展示10个新闻
        s = (int(page_id) - 1) * 10
        e = s + 9

        # 返回的是一个news_id列表
        news_id_list = self.reclist_redis_db.zrange("rec_list", start=s, end=e) 
        # print(news_id_list)

        # 根据news_id获取新闻的具体内容，并返回一个列表，列表中的元素是按照顺序展示的新闻信息字典
        news_info_list = []
        news_expose_list = []
        for news_id in news_id_list:
            news_info_dict = self._get_news_simple(news_id)
            # news_info_str = news_info_str.replace("'", '"' ) # 将单引号都替换成双引号
            # news_info_dict = json.loads(news_info_str)
            # 需要确认一下前端接收的json，key需要是单引号还是双引号
            news_info_list.append(news_info_dict)
            news_expose_list.append(news_info_dict["news_id"])  # 记录在用户曝光表上[user_exposure]

        # UserAction().save_user_exposure(user_id,news_expose_list)  # 曝光落表
        self._save_user_exposure(user_id,news_expose_list)

        return news_info_list

    def _get_news_simple(self, news_id):
        """获取新闻的简略信息,用于刚进来时的展示
        """
        news_info_str = self.static_news_info_redis_db.get("static_news_detail:" + news_id)
        news_info_str = news_info_str.replace("'", '"' ) # 将单引号都替换成双引号
        news_info_str = json.loads(news_info_str)

        news_dynamic_info_str = self.dynamic_news_info_redis_db.get("dynamic_news_detail:" + news_id)
        news_dynamic_info_str = news_dynamic_info_str.replace("'", '"' ) # 将单引号都替换成双引号
        news_dynamic_info_str = json.loads(news_dynamic_info_str)

        simple = ["news_id","title","ctime","cate"]
        for k in simple:
            news_dynamic_info_str[k] = news_info_str[k]

        return news_dynamic_info_str

    def get_hot_list(self, user_id):
        """热门页列表结果"""
        hot_list_key_prefix = "user_id_hot_list:"
        hot_list_user_key = hot_list_key_prefix + str(user_id)

        user_exposure_prefix = "user_exposure:"
        user_exposure_key = user_exposure_prefix + str(user_id)

        # 当数据库中没有这个用户的数据，就从热门列表中拷贝一份 
        if self.reclist_redis_db.exists(hot_list_user_key) == 0: # 存在返回1，不存在返回0
            print("copy a hot_list for {}".format(hot_list_user_key))
            # 给当前用户重新生成一个hot页推荐列表， 也就是把hot_list里面的列表复制一份给当前user， key换成user_id
            self.reclist_redis_db.zunionstore(hot_list_user_key, ["hot_list"])

        # 一页默认10个item, 但这里候选20条，因为有可能有的在推荐页曝光过
        article_num = 200

        # 返回的是一个news_id列表   zrevrange排序分值从大到小
        candiate_id_list = self.reclist_redis_db.zrevrange(hot_list_user_key, 0, article_num-1)

        if len(candiate_id_list) > 0:
            # 根据news_id获取新闻的具体内容，并返回一个列表，列表中的元素是按照顺序展示的新闻信息字典
            news_info_list = []
            selected_news = []   # 记录真正被选了的
            cou = 0

            # 曝光列表
            print("self.reclist_redis_db.exists(key)",self.exposure_redis_db.exists(user_exposure_key))
            if self.exposure_redis_db.exists(user_exposure_key) > 0:
                exposure_list = self.exposure_redis_db.smembers(user_exposure_key)
                news_expose_list = set(map(lambda x: x.split(':')[0], exposure_list))
            else:
                news_expose_list = set()

            for i in range(len(candiate_id_list)):
                candiate = candiate_id_list[i]
                news_id = candiate.split('_')[1]

                # 去重曝光过的，包括在推荐页以及hot页
                if news_id in news_expose_list:
                    continue

                # TODO 有些新闻可能获取不到静态的信息，这里应该有什么bug
                # bug 原因是，json.loads() redis中的数据会报错，需要对redis中的数据进行处理
                # 可以在物料处理的时候过滤一遍，json无法load的新闻
                try:
                    news_info_dict = self.get_news_detail(news_id)
                except Exception as e:
                    with open("/home/recsys/news_rec_server/logs/news_bad_cases.log", "a+") as f:
                        f.write(news_id + "\n")
                        print("there are not news detail info for {}".format(news_id))
                    continue
                # 需要确认一下前端接收的json，key需要是单引号还是双引号
                news_info_list.append(news_info_dict)
                news_expose_list.add(news_id)
                # 注意，原数的key中是包含了类别信息的
                selected_news.append(candiate)
                cou += 1
                if cou == 10:
                    break
            
            if len(selected_news) > 0:
                # 手动删除读取出来的缓存结果, 这个很关键, 返回被删除的元素数量，用来检测是否被真的被删除了
                removed_num = self.reclist_redis_db.zrem(hot_list_user_key, *selected_news)
                print("the numbers of be removed:", removed_num)

            # 曝光重新落表
            self._save_user_exposure(user_id,news_expose_list)
            return news_info_list 
        else:
            #TODO 临时这么做，这么做不太好
            self.reclist_redis_db.zunionstore(hot_list_user_key, ["hot_list"])
            print("copy a hot_list for {}".format(hot_list_user_key))
            # 如果是把所有内容都刷完了再重新拷贝的数据，还得记得把今天的曝光数据给清除了
            self.exposure_redis_db.delete(user_exposure_key)
            return  self.get_hot_list(user_id)


    def get_news_detail(self, news_id):
        """获取新闻展示的详细信息
        """
        news_info_str = self.static_news_info_redis_db.get("static_news_detail:" + news_id)
        news_info_str = news_info_str.replace('\'', '\"' ) # 将单引号都替换成双引号
        news_info_dit = json.loads(news_info_str)

        news_dynamic_info_str = self.dynamic_news_info_redis_db.get("dynamic_news_detail:" + news_id)
        news_dynamic_info_str = news_dynamic_info_str.replace("'", '"' ) # 将单引号都替换成双引号
        news_dynamic_info_dit = json.loads(news_dynamic_info_str)


        for k in news_dynamic_info_dit.keys():
            news_info_dit[k] = news_dynamic_info_dit[k]

        return news_info_dit

    def update_news_dynamic_info(self, news_id,action_type):
        """更新新闻展示的详细信息
        """
        news_dynamic_info_str = self.dynamic_news_info_redis_db.get("dynamic_news_detail:" + news_id)
        news_dynamic_info_str = news_dynamic_info_str.replace("'", '"' ) # 将单引号都替换成双引号
        news_dynamic_info_dict = json.loads(news_dynamic_info_str)
        # print("update",news_id,action_type)
        if len(action_type) == 2:
            if action_type[1] == "true":
                news_dynamic_info_dict[action_type[0]] +=1
            elif action_type[1] == "false":
                news_dynamic_info_dict[action_type[0]] -=1
        else:
            news_dynamic_info_dict["read_num"] +=1
        news_dynamic_info_str = json.dumps(news_dynamic_info_dict)
        news_dynamic_info_str = news_dynamic_info_str.replace('"', "'" )
        res = self.dynamic_news_info_redis_db.set("dynamic_news_detail:" + news_id, news_dynamic_info_str)
        return res

    def _save_user_exposure(self, user_id, newslist):
        """记录用户曝光到redis"""
        if len(newslist) == 0: return False   # 无曝光数目

        ctime = str(round(time.time()*1000))  # 曝光时间戳

        key = "user_exposure:" + str(user_id)    # 为key拼接

        # 将历史曝光记录与newlist(最新曝光)的交集新闻提出来  并将该部分删除，防止重复存储曝光新闻
        exposure_news_set = self.exposure_redis_db.smembers(key)  # 历史曝光记录

        del_exposure_news = []   # 历史曝光记录与newlist(最新曝光)的交集新闻,需要删除
        if exposure_news_set.__len__() != 0:
            del_exposure_news = [item for item in exposure_news_set if item.split(":")[0] in newslist]  

        # 为曝光过的新闻拼接时间
        news_save = []
        for news_id in newslist:
            val = news_id+":"+ctime
            val = val.replace('"', "'" )  # 将双引号都替换成单引号
            news_save.append(val)
        
        # 存储redis
        try:
            if del_exposure_news.__len__() != 0:
                self.exposure_redis_db.srem(key,*del_exposure_news)
            self.exposure_redis_db.sadd(key,*news_save)
        except Exception as e:
            print(str(e))
            return False
        return True


    # def save_user_consume(self, user_id, new_id):
    #     """
    #     记录用户消费过的新闻
    #     """
    #     key = "user_consume:" + str(user_id)
    #     new_id = new_id.replace('"', "'" ) # 将双引号都替换成单引号
    #     try:
    #         self.consume_redis_db.sadd(key,new_id)
    #     except Exception as e:
    #         print(str(e))
    #         return False
    #     return True


if __name__ == "__main__":
    # 测试单例模式
    oneline_server = OnlineServer()

    oneline_server.get_hot_list("4563333734895456257")

    # print(oneline_server.get_hot_list("4563333734895456257"))
    # print("***********************")
    # print(oneline_server.get_hot_list("4563333734895456257"))
