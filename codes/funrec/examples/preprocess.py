from random import sample, seed
import sys
sys.path.append("..")
import random
import numpy as np
import pandas as pd 
from datetime import date, datetime
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm
import tensorflow as tf
from tensorflow.python.keras.preprocessing.sequence import pad_sequences

def process_data(sample_num=5000000):
    train_data_path = "./data/train"
    print("read train data ...")
    train_data_df = pd.read_csv(train_data_path, sep=',', nrows=sample_num)

    all_df = train_data_df
    all_df['hour'] = all_df['hour'].astype(str)

    # 构造时间相关的特征
    def _convert_weekday(timestamp):
        dt = date(int('20' + timestamp[0:2]), int(timestamp[2:4]), int(timestamp[4:6]))
        return int(dt.strftime('%w'))

    def _convert_weekend(timestamp):
        dt = date(int('20' + timestamp[0:2]), int(timestamp[2:4]), int(timestamp[4:6]))
        return 1 if dt.strftime('%w') in ['6', '0'] else 0

    """
    is_weekend: 是否是周末
    weekday: 星期几
    hour: 几点
    """
    all_df['is_weekend'] = all_df['hour'].apply(lambda x: _convert_weekend(x))
    all_df['weekday'] = all_df['hour'].apply(lambda x: _convert_weekday(x))
    all_df['hour_v2'] = all_df['hour'].apply(lambda x: int(x[6:8]))
    del all_df['hour']

    sparse_features = ['id', 'C1', 'banner_pos', 'site_id', 'site_domain',
        'site_category', 'app_id', 'app_domain', 'app_category', 'device_id',
        'device_ip', 'device_model', 'device_type', 'device_conn_type', 'C14',
        'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'is_weekend',
        'weekday', 'hour_v2']

    print("start label encode ... ")
    feature_max_index_dict = {}
    for feat in sparse_features:
        lbe = LabelEncoder()
        all_df[feat] = lbe.fit_transform(all_df[feat]) + 1 # 让id从1开始，0可能会被做掩码
        feature_max_index_dict[feat] = all_df[feat].max() + 1 
    
    train_df = all_df
    feature_names = train_df.columns
    train_input_dict = {}
    for name in feature_names:
        train_input_dict[name] = np.array(train_df[name].values) 

    train_label = np.array(train_df['click'])
    train_df.pop('click')
    return feature_max_index_dict, train_input_dict, train_label


def gen_sdm_data_set(click_data, seq_short_len=5, seq_prefer_len=50):
    """
    :param: seq_short_len: 短期会话的长度
    :param: seq_prefer_len: 会话的最长长度
    """
    click_data.sort_values("expo_time", inplace=True)

    train_set, test_set = [], []
    for user_id, hist_click in tqdm(click_data.groupby('user_id')):
        pos_list = hist_click['article_id'].tolist()
        cat1_list = hist_click['cat_1'].tolist()
        cat2_list = hist_click['cat_2'].tolist()

        # 滑动窗口切分数据
        for i in range(1, len(pos_list)):
            hist = pos_list[:i]
            cat1_hist = cat1_list[:i]
            cat2_hist = cat2_list[:i]
            # 序列长度只够短期的
            if i <= seq_short_len and i != len(pos_list) - 1:
                train_set.append((
                    # 用户id, 用户短期历史行为序列， 用户长期历史行为序列， 当前行为文章， label，
                    user_id, hist[::-1], [0] * seq_prefer_len, pos_list[i], 1,
                    # 用户短期历史序列长度， 用户长期历史序列长度，
                    len(hist[::-1]), 0,
                    # 用户短期历史序列对应类别1， 用户长期历史行为序列对应类别1
                    cat1_hist[::-1], [0] * seq_prefer_len,
                    # 历史短期历史序列对应类别2， 用户长期历史行为序列对应类别2
                    cat2_hist[::-1], [0] * seq_prefer_len
                ))
            # 序列长度够长期的
            elif i != len(pos_list) - 1:
                train_set.append((
                    # 用户id, 用户短期历史行为序列，用户长期历史行为序列， 当前行为文章， label
                    user_id, hist[::-1][:seq_short_len], hist[::-1][seq_short_len:], pos_list[i], 1,
                    # 用户短期行为序列长度，用户长期行为序列长度，
                    seq_short_len, len(hist[::-1]) - seq_short_len,
                    # 用户短期历史行为序列对应类别1， 用户长期历史行为序列对应类别1
                    cat1_hist[::-1][:seq_short_len], cat1_hist[::-1][seq_short_len:],
                    # 用户短期历史行为序列对应类别2， 用户长期历史行为序列对应类别2
                    cat2_hist[::-1][:seq_short_len], cat2_hist[::-1][seq_short_len:]
                ))
            # 测试集保留最长的那一条
            elif i <= seq_short_len and i == len(pos_list) - 1:
                test_set.append((
                    user_id, hist[::-1], [0] * seq_prefer_len, pos_list[i], 1,
                    len(hist[::-1]), 0,
                    cat1_hist[::-1], [0] * seq_perfer_len,
                    cat2_hist[::-1], [0] * seq_prefer_len
                ))
            else:
                test_set.append((
                    user_id, hist[::-1][:seq_short_len], hist[::-1][seq_short_len:], pos_list[i], 1,
                    seq_short_len, len(hist[::-1]) - seq_short_len,
                    cat1_hist[::-1][:seq_short_len], cat1_hist[::-1][seq_short_len:],
                    cat2_list[::-1][:seq_short_len], cat2_hist[::-1][seq_short_len:]
                ))

    random.shuffle(train_set)
    random.shuffle(test_set)

    return train_set, test_set


def gen_sdm_model_input(train_set, user_profile, seq_short_len, seq_prefer_len):
    """构造模型输入"""
    # row: [user_id, short_train_seq, perfer_train_seq, item_id, label, short_len, perfer_len, cat_1_short, cat_1_perfer, cat_2_short, cat_2_prefer]
    train_uid = np.array([row[0] for row in train_set])
    short_train_seq = [row[1] for row in train_set]
    prefer_train_seq = [row[2] for row in train_set]
    train_iid = np.array([row[3] for row in train_set])
    train_label = np.array([row[4] for row in train_set])
    train_short_len = np.array([row[5] for row in train_set])
    train_prefer_len = np.array([row[6] for row in train_set])
    short_train_seq_cat1 = np.array([row[7] for row in train_set])
    prefer_train_seq_cat1 = np.array([row[8] for row in train_set])
    short_train_seq_cat2 = np.array([row[9] for row in train_set])
    prefer_train_seq_cat2 = np.array([row[10] for row in train_set])

    # padding操作
    train_short_item_pad = pad_sequences(short_train_seq, maxlen=seq_short_len, padding='post', truncating='post',
                                         value=0)
    train_prefer_item_pad = pad_sequences(prefer_train_seq, maxlen=seq_prefer_len, padding='post', truncating='post',
                                          value=0)
    train_short_cat1_pad = pad_sequences(short_train_seq_cat1, maxlen=seq_short_len, padding='post', truncating='post',
                                         value=0)
    train_prefer_cat1_pad = pad_sequences(prefer_train_seq_cat1, maxlen=seq_prefer_len, padding='post',
                                          truncating='post', value=0)
    train_short_cat2_pad = pad_sequences(short_train_seq_cat2, maxlen=seq_short_len, padding='post', truncating='post',
                                         value=0)
    train_prefer_cat2_pad = pad_sequences(prefer_train_seq_cat2, maxlen=seq_prefer_len, padding='post',
                                          truncating='post', value=0)

    # 形成输入词典
    train_model_input = {
        "user_id": train_uid,
        "doc_id": train_iid,
        "short_doc_id": train_short_item_pad,
        "prefer_doc_id": train_prefer_item_pad,
        "prefer_sess_length": train_prefer_len,
        "short_sess_length": train_short_len,
        "short_cat1": train_short_cat1_pad,
        "prefer_cat1": train_prefer_cat1_pad,
        "short_cat2": train_short_cat2_pad,
        "prefer_cat2": train_prefer_cat2_pad
    }

    # 其他的用户特征加入
    for key in ["gender", "age", "city"]:
        train_model_input[key] = user_profile.loc[train_model_input['user_id']][key].values

    return train_model_input, train_label

def gen_neg_sample_candiate(pos_list, item_ids, doc_clicked_count_dict, negsample, methods='multinomial'):
    # w2v的负样本采样， 增加高热item成为负样本的概率
    # 参考https://blog.csdn.net/weixin_42299244/article/details/112734531, 这里用tf相应函数替换
    # tf.random.categoral  非相关数据的降采样
    if methods == 'multinomial':
        # input表示每个item出现的次数
        items, item_counts = [], []
        # 用户未点击的item   这个遍历效率很低  后面看看能不能优化下
        #         for item_id in list(set(item_ids)-set(pos_list)):
        #             items.append(item_id)
        #             item_counts.append(doc_clicked_count_dict[item_id]*1.0)

        items = list(doc_clicked_count_dict.keys())
        item_counts = list(doc_clicked_count_dict.values())
        item_freqs = np.array(item_counts) / np.sum(item_counts)
        item_freqs = item_freqs ** 0.75
        item_freqs = item_freqs / np.sum(item_freqs)
        neg_item_index = tf.random.categorical(item_freqs.reshape(1, -1), len(pos_list) * negsample)
        neg_list = np.array([items[i] for i in neg_item_index.numpy().tolist()[0] if items[i] not in pos_list])
        random.shuffle(neg_list)
    # 曝光样本随机采
    else:
        candidate_set = list(set(item_ids) - set(pos_list))  # 热度采样
        neg_list = np.random.choice(candidate_set, size=len(pos_list) * negsample, replace=True)  # 对于每个正样本，选择n个负样本

    return neg_list

def gen_data_set(click_data, doc_clicked_count_dict, negsample, control_users=False):
    """构造youtubeDNN的数据集"""
    # 按照曝光时间排序
    click_data.sort_values("expo_time", inplace=True)
    item_ids = click_data['article_id'].unique()

    train_set, test_set = [], []
    for user_id, hist_click in tqdm(click_data.groupby('user_id')):
        # 这里按照expo_date分开，每一天用滑动窗口滑，可能相关性更高些,另外，这样序列不会太长，因为eda发现有点击1111个的
        # for expo_date, hist_click in hist_date_click.groupby('expo_date'):
        # 用户当天的点击历史id
        pos_list = hist_click['article_id'].tolist()
        user_control_flag = True

        if control_users:
            user_samples_cou = 0

        # 过长的序列截断
        if len(pos_list) > 50:
            pos_list = pos_list[-50:]

        if negsample > 0:
            neg_list = gen_neg_sample_candiate(pos_list, item_ids, doc_clicked_count_dict, negsample,
                                               methods='random')

        # 只有1个的也截断 去掉，当然我之前做了处理，这里没有这种情况了
        if len(pos_list) < 2:
            continue
        else:
            # 序列至少是2
            for i in range(1, len(pos_list)):
                hist = pos_list[:i]
                # 这里采用打压热门item策略，降低高展item成为正样本的概率
                #freq_i = doc_clicked_count_dict[pos_list[i]] / (np.sum(list(doc_clicked_count_dict.values())))
                #p_posi = (np.sqrt(freq_i / 0.001) + 1) * (0.001 / freq_i)

                # p_posi=0.3  表示该item_i成为正样本的概率是0.3，
                if user_control_flag and i != len(pos_list) - 1:
                    #if random.random() > (1 - p_posi):
                    if True:
                        row = [user_id, hist[::-1], pos_list[i], hist_click.iloc[0]['city'], hist_click.iloc[0]['age'],
                               hist_click.iloc[0]['gender'], 1, len(hist[::-1])]
                        train_set.append(row)

                        for negi in range(negsample):
                            row = [user_id, hist[::-1], neg_list[i * negsample + negi], hist_click.iloc[0]['city'],
                                   hist_click.iloc[0]['age'], hist_click.iloc[0]['gender'], 0, len(hist[::-1])]
                            train_set.append(row)

                        if control_users:
                            user_samples_cou += 1
                            # 每个用户序列最长是50， 即每个用户正样本个数最多是50个, 如果每个用户训练样本数量到了30个，训练集不能加这个用户了
                            if user_samples_cou > 30:
                                user_samples_cou = False

                # 整个序列加入到test_set， 注意，这里一定每个用户只有一个最长序列，相当于测试集数目等于用户个数
                elif i == len(pos_list) - 1:
                    row = [user_id, hist[::-1], pos_list[i], hist_click.iloc[0]['city'], hist_click.iloc[0]['age'],
                           hist_click.iloc[0]['gender'], 0, len(hist[::-1])]
                    test_set.append(row)

    random.shuffle(train_set)
    random.shuffle(test_set)
    return train_set, test_set

"""构造模型输入"""
def gen_model_input(train_set, his_seq_max_len):
    """构造模型的输入"""
    # row: [user_id, hist_list, cur_doc_id, city, age, gender, label, hist_len]
    train_uid = np.array([row[0] for row in train_set])
    train_hist_seq = [row[1] for row in train_set]
    train_iid = np.array([row[2] for row in train_set])
    train_u_city = np.array([row[3] for row in train_set])
    train_u_age = np.array([row[4] for row in train_set])
    train_u_gender = np.array([row[5] for row in train_set])
    train_label = np.array([row[6] for row in train_set])
    train_hist_len = np.array([row[7] for row in train_set])

    train_seq_pad = pad_sequences(train_hist_seq, maxlen=his_seq_max_len, padding='post', truncating='post', value=0)
    train_model_input = {
        "user_id": train_uid,
        "doc_id": train_iid,
        "hist_doc_id": train_seq_pad,
        "hist_len": train_hist_len,
        "u_city": train_u_city,
        "u_age": train_u_age,
        "u_gender": train_u_gender,
    }
    return train_model_input, train_label