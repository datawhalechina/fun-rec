import os 
import sys 
sys.path.append("../../")
from conf.proj_path import log_data_path, user_info_path, doc_info_path
import pandas as pd


class RegionRecall(object):
    def __init__(self, log_data_path, user_info_path, doc_info_path):
        super().__init__()
        self.log_data_path = log_data_path
        self.user_info_path = user_info_path
        self.doc_info_path = doc_info_path
        self.read_and_process_data()

    def read_and_process_data(self):
        """读取并处理数据
        """
        log_columns = ['user_id', 'article_id', 'expo_time', 'net_status', 'flush_nums', 'expo_position', 'click', 'duration']
        user_columns = ['user_id', 'device', 'os', 'province', 'city', 'age','gender']
        doc_columns = ['article_id', 'title', 'ctime', 'img_num', 'cate','sub_cate', 'key_words']
        self.train_log_df = pd.read_csv(self.log_data_path, usecols=log_columns, sep='\t')
        self.doc_info_df = pd.read_csv(self.doc_info_path, names=doc_columns, sep='\t')
        self.user_info_df = pd.read_csv(self.user_info_path, usecols=user_columns, sep='\t')
        # 删除重复数据
        self.train_log_df = self.train_log_df.drop_duplicates(keep='last')
        self.doc_info_df = self.doc_info_df.drop_duplicates(keep='last')
        self.user_info_df = self.user_info_df.drop_duplicates(keep='last')
        # 转换成天的日期，可以用来筛选数据
        self.train_log_df['expo_time_day'] = pd.to_datetime(self.train_log_df['expo_time'], unit='ms').dt.strftime('%Y_%m_%d')
        print("read_and_process_data success...")

    def get_article_stat_data(self, train_df, doc_info_df):
        """统计所有文章的点击和曝光次数，以及点击率(点击次数 / 曝光次数)
        """
        # 日志数据去重, 保留最后一条记录
        train_df = train_df.drop_duplicates(keep='last')
        # 统计曝光
        expo_num_s = train_df.groupby('article_id')['user_id'].count()
        expo_num_df = pd.DataFrame({'article_id': expo_num_s.index, 'expo_num': expo_num_s.values})
        # 统计点击
        click_num_s = train_df.groupby('article_id')['click'].sum()
        click_num_df = pd.DataFrame({'article_id': click_num_s.index, 'click_num': click_num_s.values})
        article_df = pd.merge(expo_num_df, click_num_df, how='left', on='article_id')
        # 拼接文章信息
        article_df = pd.merge(article_df, doc_info_df[['article_id', 'ctime', 'cate']], how='left', on='article_id')
        article_df['click_rate'] = article_df['click_num'] / article_df['expo_num']
        return article_df

    def get_province_articles(self, df, topK, cur_time):
        """筛选和过滤规则, 里面的超参都可以根据业务数据的具体分布进行修改
        """
        df['ctime_date'] = pd.to_datetime(df['ctime'], unit='ms')
        # 时间差
        df['delta_time'] = pd.to_datetime([cur_time] * df.shape[0]) - df['ctime_date']  
        # 保留最近三天的新闻，保证新闻的时效性
        df = df[df['delta_time'].dt.days >= 3].reset_index(drop=True)
        # expo_num 过滤
        df = df[df['expo_num'] >= 1000].reset_index(drop=True)
        # 点击率
        df = df[df['click_rate'] >= 0.1].reset_index(drop=True)
        # 按照点击率倒排
        df = df.sort_values('click_rate', ascending=False).reset_index(drop=True)
        # 数据格式：article_id:cate:click_rate
        df['article_id_and_click_rate'] = df.apply(lambda x: str(\
            x['article_id']) + ':' + str(x['cate']) + ':' + str(round(x['click_rate'], 5)), axis=1)
        article_list = df['article_id_and_click_rate'].values[:topK]
        return article_list

    def province_recall(self, N, cur_time):
        article_df = self.get_article_stat_data(self.train_log_df, self.doc_info_df)
        region_articles_df = pd.merge(self.train_log_df, self.user_info_df, how='left', on='user_id')
        region_articles_df = region_articles_df[['user_id', 'article_id', 'province', 'city']]
        region_articles_df = pd.merge(region_articles_df, article_df, how='left', on='article_id')
        # 去除时间为空, 以及一些异常数据
        region_articles_df['ctime'] = region_articles_df['ctime'].astype(str)
        region_articles_df = region_articles_df[region_articles_df['ctime'].str.isnumeric()]
        # 分组
        province_df_dict = {}
        for name, df in region_articles_df.groupby('province'):
            if df.shape[0] < 5000:
                continue
            # 分完组之后可以取出重复数据
            df = df[['article_id', 'expo_num', 'click_num', 'click_rate', 'ctime', 'cate']].\
                drop_duplicates(subset='article_id').reset_index(drop=True)
            province_df_dict[name] = df
        # 给每个省份筛选一部分优质物料
        province_results_dict = {}
        for province, df in province_df_dict.items():
            province_results_dict[province] = self.get_province_articles(df, N, cur_time)
        print("province_recall success...")
        return province_results_dict


if __name__ == "__main__":
    root_path = '/data1/ryluo/5w_data/'
    region_recall = RegionRecall(log_data_path, user_info_path, doc_info_path)
    province_results_dict = region_recall.province_recall(N=300, cur_time='2021-07-03')
    # 这里的召回内容还没有落盘
    print(province_results_dict)
    # TODO 召回结果落盘逻辑