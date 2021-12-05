from dao.mysql_server import MysqlServer
from dao.entity.logitem import LogItem

import time



class LogController():
    def __init__(self) -> None:
        self.log_info_sql_session = MysqlServer().get_loginfo_session()

    def save_one_log(self,log):
        try:
            self.log_info_sql_session.add(log)
            self.log_info_sql_session.commit()
        except Exception as e:
            print(str(e))
            return False
        return True