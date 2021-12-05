from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger

from conf.dao_config import register_user_table_name
from dao.mysql_server import MysqlServer

Base = declarative_base()

class RegisterUser(Base):
    """用户注册数据
    """
    __tablename__ = register_user_table_name 
    index = Column(Integer(), primary_key=True)
    userid = Column(BigInteger())
    username = Column(String(30))
    passwd = Column(String(500))
    gender = Column(String(30))
    age = Column(String(5))
    city = Column(String(10))

    def __init__(self):
        # 与数据库绑定映射关系
        engine = MysqlServer().get_register_user_engine()
        Base.metadata.create_all(engine)