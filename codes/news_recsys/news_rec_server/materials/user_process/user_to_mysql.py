import sys
sys.path.append("./../")
from dao.redis_server import RedisServer
from dao.mysql_server import MysqlServer
from dao.entity.user_exposure import UserExposure


class UserMysqlServer(object):
    def __init__(self):
        self.user_exposure_redis = RedisServer().get_exposure_redis()
        self.user_exposure_sql_session = MysqlServer().get_user_exposure_session()

    def user_exposure_to_mysql(self):
        exposure = UserExposure()   #  为了通过__init__()函数构建表
        vals = []
        keys = self.user_exposure_redis.keys()
        for key in keys:
            news_list = self.user_exposure_redis.smembers(key)
            user_id = key.split(":")[1]  
            val = self._transfor_json_for_user(user_id,news_list)
            vals +=val

        self.user_exposure_sql_session.bulk_insert_mappings(UserExposure,vals)
        self.user_exposure_sql_session.commit()

    def _transfor_json_for_user(self,user_id,news_list):
        """针对每个用户转换成批量存储的形式
        """
        # 对用户的每一个曝光进行存储
        vals = []
        for item in news_list:
            item = item.split(":")
            vals.append({
                "userid":user_id,
                "newid":item[0],
                "curtime":item[1]})
        return vals
 

if __name__ == "__main__":
    user_mysql_server = UserMysqlServer()
    user_mysql_server.user_exposure_to_mysql()
    