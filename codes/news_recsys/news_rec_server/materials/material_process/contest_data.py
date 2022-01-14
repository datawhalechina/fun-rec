"""
由于系统很难收集到大量用户的行为数据，为了后面的召回和排序可以正常进行下去
这里将某个中文新闻推荐竞赛的数据集添加到数据库中用于后续的环节，这个脚本主
要就是将竞赛数据集导入数据库
"""
import os 
import sys
sys.path.append("../../")
import numpy as np
import pandas as pd
from tqdm import tqdm
import random
import math

from dao.mongo_server import MongoServer
from dao.mysql_server import MysqlServer
from dao.entity.contest_logitem import ContestLogItem, get_new_class
from conf.dao_config import contest_loginfo_table_name_prefix

"""
'user_id': 用户id
'article_id': 文章id
'expo_time': 展现时间
'net_status': 网络状态
'flush_nums': 刷新次数
'expo_position': 展示的位置
'click': 是否点击
'duration': 消费时长，单位是秒
"""


ROOT_PATH = '/home/recsys/news_data/5w_data/'

# 路径可能需要换一下
trn_data_path = '/home/recsys/news_data/off_data/train_data.txt'
tst_data_path = '/home/recsys/news_data//off_data/test_data.txt'
user_info_data_path = '/home/recsys/news_data/off_data/user_info.txt'
doc_info_data_path = '/home/recsys/news_data/off_data/doc_info.txt'

# 竞赛数据 采样
def sample_train_data(trn_data_path, user_info_data_path, sample_num=100000, save_path=None, post_fix=None):
    trn_df = pd.read_csv(trn_data_path, names=['user_id', 'article_id', 'expo_time', \
                        'net_status', 'flush_nums', 'expo_position', 'click', 'duration'], sep='\t')

    # 'province':省 'city'：市
    user_info_df = pd.read_csv(user_info_data_path, names=['user_id', 'device', 'os', 'province', 'city', 'age', 'gender'], sep='\t')
                    
    user_ids = set(trn_df['user_id'].unique())
    sample_user_ids = random.sample(user_ids, sample_num)
    sample_trn_df = trn_df[trn_df['user_id'].isin(sample_user_ids)]

    sample_user_info_df = user_info_df[user_info_df['user_id'].isin(sample_user_ids)]

    print("采样 {} 用户的行为日志的条数为: {} ".format(sample_num, sample_trn_df.shape[0]))
    
    # 将上面采样的数据保存下来
    sample_trn_data_path = os.path.join(save_path, 'train_data_{}w.csv'.format(post_fix))
    sample_user_data_path = os.path.join(save_path, 'user_info_data_{}w.csv'.format(post_fix))

    sample_trn_df.to_csv(sample_trn_data_path, header=True, sep='\t')
    sample_user_info_df.to_csv(sample_user_data_path, header=True, sep='\t')

    return sample_trn_df, sample_user_info_df


def load_user_info_data():
    """导入用户画像数据
    原始的数据是存在NewsRecSys db中的 UserProtrail collection中
    现将竞赛数据的用户画像存到 NewsRecSys db中的 ContestUserProtrail collection中
    """
    user_info_path = ROOT_PATH + 'user_info_data_5w.csv' 
    columns = ['user_id', 'device', 'os', 'province', 'city', 'age','gender']
    user_info_df = pd.read_csv(user_info_path, usecols=columns, sep='\t')
    contest_user_protrail_collection = MongoServer().get_contest_user_potrial_collection()

    user_num = user_info_df.shape[0]

    for _, row in tqdm(user_info_df.iterrows()):
        user_info_dict = {}
        for col in columns:
            user_info_dict[col] = row[col]
        contest_user_protrail_collection.insert_one(user_info_dict)

    print("load_user_info_data success, user nums: {}".format(user_num))


def load_doc_info_data():
    """导入文章画像数据
    原始的数据是存在NewsRecSys db中的 FeatureProtrail collection中
    现将竞赛数据的文章画像存到 NewsRecSys db中的 ContestFeatureProtrail collection中
    """
    doc_info_path = ROOT_PATH + 'doc_info.txt'    
    columns = ['article_id', 'title', 'ctime', 'img_num', 'cate','sub_cate', 'key_words']
    doc_info_df = pd.read_csv(doc_info_path, names=columns, sep='\t')
    print(doc_info_df.head())
    print(doc_info_df.shape)

    feature_user_protrail_collection = MongoServer().get_contest_feature_potrial_collection()

    doc_num = doc_info_df.shape[0]

    for _, row in tqdm(doc_info_df.iterrows()):
        user_info_dict = {}
        for col in columns:
            user_info_dict[col] = row[col]
        try: 
            feature_user_protrail_collection.insert_one(user_info_dict)
        except:
            # 有些异常数据，比如标题太长了，导致无法存入mongodb
            print(row)

    print("load_doc_info_data success, doc nums: {}".format(doc_num))
    

def load_user_behavior_data():
    """导入用户行为数据
    原始的用户行为 存储在mysql中loginfo db中的 类似 log_2021_12_09 的表中
    现将竞赛数据的日志数据存储到mysql中loginfo db 中 类似 contest_log_2021_12_09 表中
    """
    user_behavior_path = ROOT_PATH + 'train_data_5w.csv' 
    columns = ['user_id', 'article_id', 'expo_time', 'net_status', 'flush_nums', 'expo_position', 'click', 'duration']
    user_behavior_df = pd.read_csv(user_behavior_path, usecols=columns, sep='\t')

    # '%Y-%m-%d %H:%M:%S'
    user_behavior_df['expo_time_date_day'] = pd.to_datetime(user_behavior_df['expo_time'], unit='ms').dt.strftime('%Y_%m_%d')
    
    sql_sess = MysqlServer().get_contest_loginfo_session()    
    
    for _, df in user_behavior_df.groupby('expo_time_date_day'):
        table_name = contest_loginfo_table_name_prefix + '_' + df['expo_time_date_day'].iloc[0]
        # 通过元类创建一个新的类
        # 因为SqlAlchemy中一个类只能对应一个表，但是现在的场景下的所有表的结构都是一样的，所以这里可以使用type来动态的构造表
        NewContestLogItem = get_new_class(table_name)
        print("当前分组的数据量为: {}".format(df.shape[0]))
        for _, row in tqdm(df.iterrows()):
            contest_user_log_item = NewContestLogItem()
            contest_user_log_item.user_id = row['user_id']
            contest_user_log_item.article_id = row['article_id']
            contest_user_log_item.net_status = row['net_status']
            contest_user_log_item.flush_nums = row['flush_nums']
            contest_user_log_item.expo_position = row['expo_position']
            contest_user_log_item.click = row['click']
            contest_user_log_item.duration = row['duration']

            sql_sess.add(contest_user_log_item)
            sql_sess.commit()
        print('save {} success!'.format(table_name))
        

if __name__ == "__main__":
    # load_user_info_data()
    # load_doc_info_data() 
    load_user_behavior_data()
