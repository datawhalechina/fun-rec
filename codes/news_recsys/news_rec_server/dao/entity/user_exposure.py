from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger,DateTime

from conf.dao_config import exposure_table_name_prefix
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func

import time

Base = declarative_base()

class UserExposure(Base):
    """用户曝光数据
    """
    postfix = time.strftime("%Y_%m_%d", time.localtime())  

    # 每天都会创建一个新的表，带有时间信息
    __tablename__ = '{}_{}'.format(exposure_table_name_prefix, postfix) 

    index = Column(Integer(), primary_key=True,autoincrement=True)
    userid = Column(BigInteger())
    newid = Column(String(600))
    curtime = Column(String(50))
    # curtime =  Column(DateTime(timezone=True), server_default=func.now())

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_user_exposure_engine()
        Base.metadata.create_all(engine)

    def new(self,userid,newid,curtime):
        self.userid = userid  
        self.newid =  newid  
        self.curtime = curtime  