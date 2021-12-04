from material_process.news_protrait import NewsProtraitServer
from material_process.news_to_redis import NewsRedisServer


def update():
    """物料处理函数
    """
    # 新闻数据写入redis, 注意这里处理redis数据的时候是会将前一天的数据全部清空
    news_redis_server = NewsRedisServer()
    # 将最新的前端展示的画像传到redis
    news_redis_server.news_detail_to_redis()


if __name__ == "__main__":
    update() 

