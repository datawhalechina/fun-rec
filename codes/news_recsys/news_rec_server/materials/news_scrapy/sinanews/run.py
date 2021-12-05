from scrapy import cmdline

# 注意这里pages需要进行调整
cmdline.execute('scrapy crawl sina_spider --nolog -a pages=50'.split())