DAO层主要是做数据持久层的工作，主要与数据库进行交互。DAO层首先会创建DAO接口，然后会在配置文件中定义该接口的实现类，
接着就可以在模块中就可以调用DAO 的接口进行数据业务的而处理，并且不用关注此接口的具体实现类是哪一个类。DAO 层的数据源和数据库连接的参数数都是在配置文件中进行配置的。


TODO: 设置开机自启动
启动mongodb（服务器断电之后就会断开链接）：
sudo ./mongod --dbpath=/usr/local/mongodb/data/ --fork --logpath=/usr/local/mongodb/log

TODO: 设置开机自启动 
启动redis
redis-server --daemonize yes --port 6378 --requirepass 123456
redis-cli --raw


# TODO
MySQL 使用SQLAlchemy 插入中文会报错
