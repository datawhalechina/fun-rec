import sys
sys.path.append("../../")
sys.path.append("../")
import json
import time
import threading
from conf.dao_config import cate_dict
from conf.proj_path import bad_case_news_log_path
from dao.redis_server import RedisServer
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from controller.user_action_controller import UserAction
from collections import defaultdict
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
        self.cate_dict = cate_dict
        self.cate_id_list = list(self.cate_dict.keys())
        self.bad_case_news_log_path = bad_case_news_log_path
        self.name2id_cate_dict = {v: k for k, v in self.cate_dict.items()}
        self._set_user_group() 

    def __new__(cls, *args, **kwargs):
        if not hasattr(OnlineServer, "_instance"):
            with OnlineServer._instance_lock:
                if not hasattr(OnlineServer, "_instance"):
                    OnlineServer._instance = object.__new__(cls)  
        return OnlineServer._instance
    
    def _get_register_user_cold_start_redis_key(self, userid):
        """通过查sql表得到用户的redis key进而确定当前新用户使用哪一个新的模板
        """
        user_info = self.register_sql_sess.query(RegisterUser).filter(RegisterUser.userid == userid).first()
        print(user_info)
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
            self.reclist_redis_db.zunionstore(user_key, [redis_key])

        user_exposure_prefix = "user_exposure:"
        user_exposure_key = user_exposure_prefix + str(userid)

        # 一页默认10个item, 但这里候选200条，因为有可能有的在推荐页曝光过
        article_num = 500

        # 返回的是一个news_id列表   zrevrange排序分值从大到小
        candiate_id_list = self.reclist_redis_db.zrevrange(cold_start_user_key, 0, article_num-1)

        # print("candiate_id_list", candiate_id_list)

        if len(candiate_id_list) > 0:
            # 根据news_id获取新闻的具体内容，并返回一个列表，列表中的元素是按照顺序展示的新闻信息字典
            news_info_list = []
            selected_news = []   # 记录真正被选了的
            cou = 0

            # 曝光列表
            # print("self.reclist_redis_db.exists(key)",self.exposure_redis_db.exists(user_exposure_key))
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
            # print("copy a hot_list for {}".format(cold_start_user_key))
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
        article_num = 500

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
    
    def _set_user_group(self):
        """将用户进行分组
        1. age < 23 && gender == female  
        2. age >= 23 && gender == female 
        3. age < 23 && gender == male 
        4. age >= 23 && gender == male  
        """
        self.user_group = {
            "1": ["国内","娱乐","体育","科技"],
            "2": ["国内","社会","美股","财经","股市"],
            "3": ["国内","股市","体育","科技"],
            "4": ["国际", "国内","军事","社会","美股","财经","股市"]
        }
        self.group_to_cate_id_dict = defaultdict(list)
        for k, cate_list in self.user_group.items():
            for cate in cate_list:
                self.group_to_cate_id_dict[k].append(self.name2id_cate_dict[cate])

    def _get_register_user_group_id(self, userid):
        """获取注册用户的分组
        """
        while self.register_sql_sess.query(RegisterUser).filter(RegisterUser.userid == userid).count() > 0:
            user_info = self.register_sql_sess.query(RegisterUser).filter(RegisterUser.userid == userid).first()
            print("user_info", user_info)
            if int(user_info.age) < 23 and user_info.gender == "female":
                return "1"
            elif int(user_info.age) >= 23 and user_info.gender == "female":
                return "2"
            elif int(user_info.age) < 23 and user_info.gender == "male":
                return "3"
            elif int(user_info.age) >= 23 and user_info.gender == "male":
                return "4"
            else:
                return "error" 


    def _copy_cold_start_list_to_redis(self, user_id, group_id):
        """将确定分组后的用户的物料添加到redis中，并记录当前用户的所有新闻类别id
        """
        # 遍历当前分组的新闻类别
        for cate_id in self.group_to_cate_id_dict[group_id]:
            group_redis_key = "cold_start_group:{}:{}".format(group_id, cate_id)
            user_redis_key = "cold_start_user:{}:{}".format(user_id, cate_id)
            self.reclist_redis_db.zunionstore(user_redis_key, [group_redis_key])
        # 将用户的类别集合添加到redis中
        cate_id_set_redis_key = "cold_start_user_cate_set:{}".format(user_id)
        self.reclist_redis_db.sadd(cate_id_set_redis_key, *self.group_to_cate_id_dict[group_id])

    def _judge_and_get_user_reverse_index(self, user_id, rec_type):
        """判断当前用户是否存在倒排索引, 如果没有的话拷贝一份
        """
        if rec_type == 'hot_list':
            # 判断用户是否存在热门列表
            cate_id = self.cate_id_list[0] # 随机选择一个就行
            hot_list_user_key = "user_id_hot_list:{}_{}".format(str(user_id), cate_id)
            if self.reclist_redis_db.exists(hot_list_user_key) == 0:
                # 给用户拷贝一份每个类别的倒排索引
                for cate_id in self.cate_id_list:
                    cate_id_news_templete_key = "news_cate:{}".format(cate_id)
                    hot_list_user_key = "user_id_hot_list:{}_{}".format(str(user_id), cate_id)
                    self.reclist_redis_db.zunionstore(hot_list_user_key, [cate_id_news_templete_key])
        elif rec_type == "cold_start":
             # 判断用户是否在冷启动列表中
             cate_id_set_redis_key = "cold_start_user_cate_set:{}".format(user_id)
             print("判断用户是否在冷启动列表中 {}".format(self.reclist_redis_db.exists(cate_id_set_redis_key)))
             if self.reclist_redis_db.exists(cate_id_set_redis_key) == 0:
                # 如果系统中没有当前用户的冷启动倒排索引, 那么就需要从冷启动模板中复制一份
                # 确定用户分组
                group_id = self._get_register_user_group_id(user_id)
                print("group_id : {}".format(group_id))
                self._copy_cold_start_list_to_redis(user_id, group_id)
        else:
            pass 

    def _get_user_expose_set(self, user_id):
        """获取用户曝光列表
        """
        user_exposure_prefix = "user_exposure:"
        user_exposure_key = user_exposure_prefix + str(user_id)
        # 获取用户当前曝光列表
        if self.exposure_redis_db.exists(user_exposure_key) > 0:
            exposure_list = self.exposure_redis_db.smembers(user_exposure_key)
            news_expose_set = set(map(lambda x: x.split(':')[0], exposure_list))
        else:
            news_expose_set = set()
        return news_expose_set

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

    def _get_polling_rec_list(self, user_id, news_expose_set, cate_id_list, rec_type, one_page_news_cnt=10):
        """获取轮询的打散新闻列表
        """
        # 候选曝光列表
        exposure_news_list = []
        # 用户展示新闻列表
        user_news_list = []
        iter_cnt = 0
        # 给每个用户轮询每个类别的新闻，获取打散之后的新闻列表
        while len(user_news_list) != one_page_news_cnt:
            cate_id_index = iter_cnt % len(cate_id_list)
            cate_id = cate_id_list[cate_id_index]
            if rec_type == "hot_list":
                user_redis_key = "user_id_hot_list:{}_{}".format(str(user_id), cate_id) 
            elif rec_type == "cold_start":
                user_redis_key = "cold_start_user:{}:{}".format(str(user_id), cate_id)
            else:
                pass 
            cur_cate_cnt = 0
            while self.reclist_redis_db.zcard(user_redis_key) > 0:
                # 摘取排名第一的新闻
                news_id_and_cate = self.reclist_redis_db.zrevrange(user_redis_key, 0, 0)[0]
                news_id = news_id_and_cate.split('_')[1] # 将新闻id切分出来
                if news_id in news_expose_set:
                    # 将当前新闻id添加到待删除的新闻列表中
                    self.reclist_redis_db.zrem(user_redis_key, news_id_and_cate) 
                    continue
                # TODO 在数据入库的时候离线处理无法成功加载json的问题
                # 获取新闻详细信息, 由于爬取的新闻没有做清理，导致有些新闻无法转化成json的形式
                # 所以这里如果转化失败的内容也直接删除掉
                try:
                    news_info_dict = self.get_news_detail(news_id)
                    cur_cate_cnt += 1
                except Exception as e:  
                    # 删除无效的新闻
                    self.reclist_redis_db.zrem(user_redis_key, news_id_and_cate)                   
                    # 记录无效的新闻的id
                    with open(self.bad_case_news_log_path, "a+") as f:
                        f.write(news_id + "\n")
                        print("there are not news detail info for {}".format(news_id))
                    continue
                # 删除当前key
                self.reclist_redis_db.zrem(user_redis_key, news_id_and_cate) 
                # 判断当前类别的新闻是否摘取成功, 摘取成功的话就推出当前循环
                if cur_cate_cnt == 1:
                    # 将摘取成功的新闻信息添加到用户新闻列表中
                    user_news_list.append(news_info_dict)
                    exposure_news_list.append(news_id)
                    break
            iter_cnt += 1
        return user_news_list, exposure_news_list

    def get_cold_start_rec_list_v2(self, user_id):
        """推荐页展示列表，使用轮询的方式进行打散
        """
        # 获取用户曝光列表
        news_expose_set = self._get_user_expose_set(user_id)
        
        # 判断用户是否存在热门列表
        self._judge_and_get_user_reverse_index(user_id, "cold_start")

        # 获取用户的cate id列表
        cate_id_set_redis_key = "cold_start_user_cate_set:{}".format(user_id)
        cate_id_list = list(self.reclist_redis_db.smembers(cate_id_set_redis_key))

        # 通过轮询的方式
        user_news_list, exposure_news_list = self._get_polling_rec_list(user_id, news_expose_set, cate_id_list, rec_type="cold_start")
        
        # 添加曝光内容
        self._save_user_exposure(user_id, exposure_news_list)
        return user_news_list

    def get_hot_list_v2(self, user_id):
        """热门页展示列表，使用轮询的方式进行打散
        """
        # 用户曝光列表
        user_exposure_prefix = "user_exposure:"
        user_exposure_key = user_exposure_prefix + str(user_id)
        
        # 判断用户是否存在热门列表
        self._judge_and_get_user_reverse_index(user_id, "hot_list")

        # 获取用户当前曝光列表
        if self.exposure_redis_db.exists(user_exposure_key) > 0:
            exposure_list = self.exposure_redis_db.smembers(user_exposure_key)
            news_expose_set = set(map(lambda x: x.split(':')[0], exposure_list))
        else:
            news_expose_set = set()

        # 通过轮询的方式获取用户的展示列表
        user_news_list, exposure_news_list = self._get_polling_rec_list(user_id, news_expose_set, self.cate_id_list, rec_type="hot_list")

        # 添加曝光内容
        self._save_user_exposure(user_id, exposure_news_list)
        return user_news_list

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

    def test(self):
        user_info = self.register_sql_sess.query(RegisterUser).filter(RegisterUser.userid == "4566566568405766145").first()
        print(user_info.age)


if __name__ == "__main__":
    # 测试单例模式
    oneline_server = OnlineServer()
    # oneline_server.get_hot_list("4563333734895456257")
    oneline_server.test()