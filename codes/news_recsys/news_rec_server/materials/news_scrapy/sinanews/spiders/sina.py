# -*- coding: utf-8 -*-
import re
import uuid
import json
import random
import scrapy
from scrapy import Request
from ..items import SinanewsItem
from datetime import datetime


class SinaSpider(scrapy.Spider):
    # spider的名字
    name = 'sina_spider'

    def __init__(self, pages=None):
        super(SinaSpider).__init__()

        self.total_pages = int(pages)
        # base_url 对应的是新浪新闻的简洁版页面，方便爬虫，并且不同类别的新闻也很好区分
        self.base_url = 'https://feed.mix.sina.com.cn/api/roll/get?pageid=153&lid={}&k=&num=50&page={}&r={}'
        # lid和分类映射字典
        self.cate_dict = {
            "2510":  "国内",
            "2511":  "国际",
            "2669":  "社会",
            "2512":  "体育",
            "2513":  "娱乐",
            "2514":  "军事",
            "2515":  "科技",
            "2516":  "财经",
            "2517":  "股市",
            "2518":  "美股"
        }

    def start_requests(self):
        """返回一个Request迭代器
        """
        # 遍历所有类型的新闻
        for cate_id in self.cate_dict.keys():
            for page in range(1, self.total_pages + 1):
                lid = cate_id
                # 这里就是一个随机数，具体含义不是很清楚
                r = random.random()
                # cb_kwargs 是用来向解析函数parse中传递参数的
                yield Request(self.base_url.format(lid, page, r), callback=self.parse, cb_kwargs={"cate_id": lid})
    
    def parse(self, response, cate_id):
        """解析网页内容，并提取网页中需要的内容
        """
        
        json_result = json.loads(response.text) # 将请求回来的页面解析成json
        # 提取json中我们想要的字段
        # json使用get方法比直接通过字典的形式获取数据更方便，因为不需要处理异常
        data_list = json_result.get('result').get('data')
        for data in data_list:
            item = SinanewsItem()
            
            # 给当前文章生成一个唯一的id
            item['news_id'] = str(uuid.uuid4()) # 通过随机数来生成UUID. 使用的是伪随机数有一定的重复概率.
            item['cate'] = self.cate_dict[cate_id]
            item['title'] = data.get('title')
            item['url'] = data.get('url')
            item['raw_key_words'] = data.get('keywords')

            ctime = datetime.fromtimestamp(int(data.get('ctime')))
            ctime = datetime.strftime(ctime, '%Y-%m-%d %H:%M')

            # 保留格式化之后的时间戳
            item['ctime'] = ctime

            # meta参数传入的是一个字典，在下一层可以将当前层的item进行复制
            yield Request(url=item['url'], callback=self.parse_content, meta={'item': item})
    
    def parse_content(self, response):
        """解析文章内容
        """
        item = response.meta['item']
        content = ''.join(response.xpath('//*[@id="artibody" or @id="article"]//p/text()').extract())
        content = re.sub(r'\u3000', '', content)
        content = re.sub(r'[ \xa0?]+', ' ', content)
        content = re.sub(r'\s*\n\s*', '\n', content)
        content = re.sub(r'\s*(\s)', r'\1', content)
        content = ''.join([x.strip() for x in content])
        item['content'] = content
        yield item 

