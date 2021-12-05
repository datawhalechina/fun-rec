import sys
sys.path.append("../")
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from conf.dao_config import loginfo_db_name, user_info_db_name
 

class MysqlServer(object):
    def __init__(self, username="root", passwd="123456", hostname="localhost", port="3306", 
        user_info_db_name=user_info_db_name, loginfo_db_name=loginfo_db_name):

        self.username = username
        self.passwd = passwd
        self.hostname = hostname
        self.port = port
        self.user_info_db_name = user_info_db_name
        self.loginfo_db_name = loginfo_db_name

    def session(self, db_name):
        """链接数据库，绑定映射关系
        """
        # 创建引擎
        engine = create_engine("mysql+pymysql://{}:{}@{}:{}/{}".format(
            self.username, self.passwd, self.hostname, self.port, db_name
        ), encoding="utf-8", echo=False)
        # 创建会话
        session = sessionmaker(bind=engine)
        # 返回engine 和 session, 前者用来绑定本地数据，后者用来本地操作数据库
        return engine, session()

    def get_register_user_session(self):
        """获取注册用户session
        """
        _, sess = self.session(self.user_info_db_name) 
        return sess

    def get_loginfo_session(self):
        """获取log日志的session
        """
        _, sess = self.session(self.loginfo_db_name) 
        return sess 
    
    def get_user_like_session(self):
        """获取用户喜欢新闻的session
        """
        _, sess = self.session(self.user_info_db_name) 
        return sess   

    def get_user_collection_session(self):
        """获取用户收藏新闻的session
        """
        _, sess = self.session(self.user_info_db_name) 
        return sess 

    def get_user_exposure_session(self):
        """获取用户曝光的session
        """
        _, sess = self.session(self.user_info_db_name) 
        return sess 

    def get_user_read_session(self):
        """获取用户阅读的session
        """
        _, sess = self.session(self.user_info_db_name)
        return sess

    def get_register_user_engine(self):
        """
        """
        engine, _ = self.session(self.user_info_db_name) 
        return engine

    def get_loginfo_engine(self):
        """
        """
        engine, _ = self.session(self.loginfo_db_name) 
        return engine
        
    def get_user_like_engine(self):
        """获取用户喜欢新闻的engine
        """
        engine, _ = self.session(self.user_info_db_name) 
        return engine   

    def get_user_collection_engine(self):
        """获取用户收藏新闻的engine
        """
        engine, _ = self.session(self.user_info_db_name) 
        return engine

    def get_user_read_engine(self):
        """获取用户阅读新闻的engine
        """
        engine, _ = self.session(self.user_info_db_name)
        return engine   

    def get_user_exposure_engine(self):
        """获取用户曝光的engine
        """
        engine, _ = self.session(self.user_info_db_name) 
        return engine  

