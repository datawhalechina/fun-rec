from material_process.news_protrait import NewsProtraitServer
from material_process.news_to_redis import NewsRedisServer


def process_material():
    """物料处理函数
    """
    # 画像处理
    protrail_server = NewsProtraitServer()
    # 处理最新爬取新闻的画像，存入特征库
    protrail_server.update_new_items()
    # 更新新闻动态画像, 需要在redis数据库内容清空之前执行
    protrail_server.update_dynamic_feature_protrail()
    # 生成前端展示的新闻画像，并在mongodb中备份一份
    protrail_server.update_redis_mongo_protrail_data()


if __name__ == "__main__":
    process_material() 

