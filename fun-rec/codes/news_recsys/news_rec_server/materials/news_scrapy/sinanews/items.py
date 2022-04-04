# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy import Item, Field

# 定义新闻数据的字段
class SinanewsItem(scrapy.Item):
    """数据格式化，数据不同字段的定义
    """
    title = Field() # 新闻标题
    ctime = Field() # 新闻发布时间
    url = Field() # 新闻原始url
    raw_key_words = Field() # 新闻关键词（爬取的关键词）
    content = Field() # 新闻的具体内容
    cate = Field() # 新闻类别
    news_id = Field() # 新闻id