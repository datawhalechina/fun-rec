import sys
sys.path.append("../../")
import time
from sqlalchemy import Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

from dao.mysql_server import MysqlServer
 
# # 定义基类
Base = declarative_base()

# 定义映射关系
class ContestLogItem(Base):
    """log日志数据抽象类
    """
    # 声明是一个抽象类
    __abstract__ = True
    index = Column(Integer(), primary_key=True)
    user_id = Column(String(30))
    article_id = Column(String(100))
    net_status = Column(String(100))
    flush_nums = Column(String(100))
    expo_position = Column(String(100))
    click = Column(String(100))
    duration = Column(String(100))

    def __init__(self):
        engine = MysqlServer().get_contest_loginfo_engine()
        Base.metadata.create_all(engine)
    
    def __repr__(self):
        return "<ContestLogItem(user_id='%s', article_id='%s', net_status='%s', flush_nums='%s', \
                expo_position='%s', click='%s', duration='%s')>" % (
                self.user_id, self.article_id, self.net_status, self.flush_nums, self.expo_position, self.click, self.duration)


# 通过元类实现一个新的类，因为sqlalchemy中一个类只能对应一个表
def get_new_class(table_name):
    # 使用type创建一个新的类，类是type的实例，type称为是元类
    cls_name = 'ContestLogItem{}'.format(table_name)
    cls = type(cls_name, (ContestLogItem, ), {'__tablename__': table_name})
    return cls
