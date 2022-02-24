# 数据库相关的配置文件
user_info_db_name = "userinfo" # 用户数据相关的数据库
register_user_table_name = "register_user" # 注册用户数据表
user_likes_table_name = "user_likes" # 用户喜欢数据表
user_collections_table_name = "user_collections" # 用户收藏数据表
user_read_table_name = "user_read"   # 用户阅读数据表
exposure_table_name_prefix = "exposure" # 用户曝光数据表的前缀

# log数据，每天都会落一个盘，并由时间信息进行命名
loginfo_db_name = "loginfo" # log数据库
loginfo_table_name_prefix = "log" # log数据表的前缀

contest_loginfo_db_name = "contest_loginfo"
contest_loginfo_table_name_prefix = "contest_log"

# 默认配置
mysql_username = "root"
mysql_passwd = "123456"
mysql_hostname = "localhost"
mysql_port = "3306"

# MongoDB
mongo_hostname = "127.0.0.1"
mongo_port = 27017
# Sina原始数据
sina_db_name= "SinaNews"
sina_collection_name_prefix= "news"
# 物料池db name 
material_db_name = "NewsRecSys"

# 特征画像 集合名称
feature_protrail_collection_name = "FeatureProtrail"
redis_mongo_collection_name = "RedisProtrail"
user_protrail_collection_name = "UserProtrail"
contest_user_protrail_collection_name = "ContestUserProtrail"
contest_feature_protrail_collection_name = "ContestFeatureProtrail"

# Redis
redis_hostname = "127.0.0.1"
redis_port = 6379

reclist_redis_db_num = 0
static_news_info_db_num = 1
dynamic_news_info_db_num = 2
user_exposure_db_num = 3

# 类别映射字典
cate_dict = {
    '2510':  '国内',
    '2511':  '国际',
    '2669':  '社会',
    '2512':  '体育',
    '2513':  '娱乐',
    '2514':  '军事',
    '2515':  '科技',
    '2516':  '财经',
    '2517':  '股市',
    '2518':  '美股'
}