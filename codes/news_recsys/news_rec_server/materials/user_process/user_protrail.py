import sys
import datetime
from collections import Counter, defaultdict

from sqlalchemy.sql.expression import table
sys.path.append("../../")
from dao.mongo_server import MongoServer
from dao.mysql_server import MysqlServer
from dao.entity.register_user import RegisterUser
from dao.entity.user_read import UserRead
from dao.entity.user_likes import UserLikes
from dao.entity.user_collections import UserCollections


class UserProtrail(object):
    def __init__(self):
        self.user_protrail_collection = MongoServer().get_user_protrail_collection()
        self.material_collection = MongoServer().get_feature_protrail_collection()
        self.register_user_sess = MysqlServer().get_register_user_session()
        self.user_collection_sess = MysqlServer().get_user_collection_session()
        self.user_like_sess = MysqlServer().get_user_like_session()
        self.user_read_sess = MysqlServer().get_user_read_session()

    def _user_info_to_dict(self, user):
        """将mysql查询出来的结果转换成字典存储
        """
        info_dict = dict()
        
        # 基本属性特征
        info_dict["userid"] = user.userid
        info_dict["username"] = user.username
        info_dict["passwd"] = user.passwd
        info_dict["gender"] = user.gender
        info_dict["age"] = user.age
        info_dict["city"] = user.city

        # 兴趣爱好 
        behaviors=["like","collection"]
        time_range = 15
        _, feature_dict = self.get_statistical_feature_from_history_behavior(user.userid,time_range,behavior_types=behaviors)
        for type in feature_dict.keys():
            if feature_dict[type]:
                info_dict["{}_{}_intr_cate".format(type,time_range)] = feature_dict[type]["intr_cate"]  # 历史喜欢最多的Top3的新闻类别
                info_dict["{}_{}_intr_key_words".format(type,time_range)] = feature_dict[type]["intr_key_words"] # 历史喜欢新闻的Top3的关键词
                info_dict["{}_{}_avg_hot_value".format(type,time_range)] = feature_dict[type]["avg_hot_value"] # 用户喜欢新闻的平均热度
                info_dict["{}_{}_news_num".format(type,time_range)] = feature_dict[type]["news_num"] # 用户15天内喜欢的新闻数量
            else:
                info_dict["{}_{}_intr_cate".format(type,time_range)] = ""  # 历史喜欢最多的Top3的新闻类别
                info_dict["{}_{}_intr_key_words".format(type,time_range)] = "" # 历史喜欢新闻的Top3的关键词
                info_dict["{}_{}_avg_hot_value".format(type,time_range)] = 0 # 用户喜欢新闻的平均热度
                info_dict["{}_{}_news_num".format(type,time_range)] = 0 # 用户15天内喜欢的新闻数量

        return info_dict

    def update_user_protrail_from_register_table(self):
        """每天都需要将当天注册的用户添加到用户画像池中
        """
        # 遍历注册用户表
        for user in self.register_user_sess.query(RegisterUser).all():
            user_info_dict = self._user_info_to_dict(user)
            old_user_protrail_dict = self.user_protrail_collection.find_one({"username": user.username})
            if old_user_protrail_dict is None:
                self.user_protrail_collection.insert_one(user_info_dict)
            else:
                # 使用参数upsert设置为true对于没有的会创建一个
                # replace_one 如果遇到相同的_id 就会更新
                self.user_protrail_collection.replace_one(old_user_protrail_dict, user_info_dict, upsert=True)
            

    def get_statistical_feature_from_history_behavior(self, user_id, time_range, behavior_types):
        """获取用户历史行为的统计特征 ["read","like","collection"] """
        fail_type = []
        sess, table_obj, history = None, None, None
        feature_dict = defaultdict(dict)

        end = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        start = (datetime.datetime.now()+datetime.timedelta(days=-time_range)).strftime("%Y-%m-%d %H:%M:%S")

        for type in behavior_types:
            if type == "read":
                sess = getattr(self,"user_{}_sess".format(type))
                table_obj = UserRead
            elif type == "like":
                sess = getattr(self,"user_{}_sess".format(type))
                table_obj = UserLikes
            elif type == "collection":
                sess = getattr(self,"user_{}_sess".format(type))
                table_obj = UserCollections
            try:
                history = sess.query(table_obj).filter(table_obj.userid==user_id).filter(table_obj.curtime>=start).filter(table_obj.curtime<=end).all()
            except Exception as e:
                print(str(e))
                fail_type.append(type)
                continue
            
            feature_dict[type] = self._gen_statistical_feature(history)
            
        return fail_type, feature_dict
          
    def _gen_statistical_feature(self,history):
        """"""
        # 为history 获取特征
        if not len(history): return None
        history_new_id = []
        history_hot_value = []
        history_new_cate = []
        history_key_word = []
        for h in history:
            news_id = h.newid 
            newsquery = {"news_id":news_id}
            result = self.material_collection.find_one(newsquery)
            history_new_id.append(result["news_id"])
            history_hot_value.append(result["hot_value"])
            history_new_cate.append(result["cate"])
            history_key_word += result["manual_key_words"].split(",")
        
        feature_dict = dict()
        # 计算平均热度
        feature_dict["avg_hot_value"] = 0 if sum(history_hot_value) < 0.001 else sum(history_hot_value) / len(history_hot_value)

        # 计算Top3的类别
        cate_dict = Counter(history_new_cate)
        cate_list= sorted(cate_dict.items(),key = lambda d: d[1], reverse=True)
        cate_str = ",".join([item[0] for item in cate_list[:3]] if len(cate_list)>=3 else [item[0] for item in cate_list] )
        feature_dict["intr_cate"] = cate_str

        # 计算Top3的关键词
        word_dict = Counter(history_key_word)
        word_list= sorted(word_dict.items(),key = lambda d: d[1], reverse=True)
        # TODO 关键字属于长尾 如果关键字的次数都是一次 该怎么去前3
        word_str = ",".join([item[0] for item in word_list[:3]] if len(cate_list)>=3 else [item[0] for item in word_list] )
        feature_dict["intr_key_words"] = word_str

        # 新闻数目
        feature_dict["news_num"] = len(history_new_id)

        return feature_dict


if __name__ == "__main__":
    user_protrail = UserProtrail().update_user_protrail_from_register_table()
    # user_protrail = UserProtrail().get_statistical_feature_from_history_behavior(user_id="4563323680741920769")
