from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger, DateTime

from conf.dao_config import user_collections_table_name
from dao.mysql_server import MysqlServer
from sqlalchemy.sql import func

Base = declarative_base()

class UserCollections(Base):
    """用户收藏新闻数据
    """
    __tablename__ = user_collections_table_name 
    index = Column(Integer(), primary_key=True,autoincrement=True)
    userid = Column(BigInteger())
    username = Column(String(30))
    newid = Column(String(100))
    curtime =  Column(DateTime(timezone=True), server_default=func.now())

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_user_collection_engine()
        Base.metadata.create_all(engine)

    def new(self,userid,username,newid):
        self.userid = userid  
        self.username = username  
        self.newid =  newid  
        # self.curtime = curtime