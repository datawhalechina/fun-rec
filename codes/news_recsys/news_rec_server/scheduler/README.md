## 物料构建脚本
1. 

## 离线物料自动化构建

**每天0点爬取前一天的内容，爬取完数据再更新特征库，更新完特征库之后再更新用户的画像，然后将redis中所有数据都清空，将特征库中的前端展示信息存入redis**
配置crontab命令，命令行输入crontab -e，然后将下面命令的输入到crontab命令行中
> 0 0 * * * $HOME/fun-rec/codes/news_recsys/news_rec_server/scheduler/crawl_news.sh >>  $HOME/fun-rec/codes/news_recsys/news_rec_server/logs/offline_material_process.log && $HOME/fun-rec/codes/news_recsys/news_rec_server/scheduler/offline_material_and_user_process.sh >> $HOME/fun-rec/codes/news_recsys/news_rec_server/logs/material_and_user_process.log && $HOME/fun-rec/codes/news_recsys/news_rec_server/scheduler/run_offline.sh >> $HOME/fun-rec/codes/news_recsys/news_rec_server/logs/offline_rec_list_to_redis.log