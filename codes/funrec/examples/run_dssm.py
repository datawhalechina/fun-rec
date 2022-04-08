import sys
sys.path.append("..")
import random
import numpy as np
from tqdm import tqdm
import pandas as pd 
from sklearn.preprocessing import LabelEncoder
from features import DenseFeat, SparseFeat, VarLenSparseFeat
from models import DSSM
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

def process_data(data_path, max_len=50, neg_sample=0, type='random'):
    """读取数据
    """
    data_df = pd.read_csv(data_path, sep=',')

    """
    print(data_df.head())
    user_id  movie_id  rating  timestamp                                   title                        genres gender  age  occupation    zip
    0        1      1193       5  978300760  One Flew Over the Cuckoo's Nest (1975)                         Drama      F    1          10  48067
    1        1       661       3  978302109        James and the Giant Peach (1996)  Animation|Children's|Musical      F    1          10  48067
    2        1       914       3  978301968                     My Fair Lady (1964)               Musical|Romance      F    1          10  48067
    3        1      3408       4  978300275                  Erin Brockovich (2000)                         Drama      F    1          10  48067
    4        1      2355       5  978824291                    Bug's Life, A (1998)   Animation|Children's|Comedy      F    1          10  48067
    """    
    use_features = ['user_id', 'movie_id', 'gender', 'age', 'occupation', 'zip']

    # 特征转换, 类别编码
    feature_max_index_dict = {}
    for feat in use_features:
        lbe = LabelEncoder()
        data_df[feat] = lbe.fit_transform(data_df[feat]) + 1 # 让id从1开始，0可能会被做掩码
        feature_max_index_dict[feat] = data_df[feat].max() + 1 
    
    user_profile = data_df[["user_id", "gender", "age", "occupation", "zip"]].drop_duplicates('user_id')
    item_profile = data_df[["movie_id"]].drop_duplicates('movie_id')

    print(user_profile.head())

    # 构建数据标签
    # 将数据按照时间进行排序, 默认是升序
    data_df.sort_values("timestamp", inplace=True)

    unique_item_ids = data_df['movie_id'].unique()
    
    train_data_list = []
    test_data_list = []
    # 设置最短历史序列长度
    min_seq_len = 1
    # 遍历每个用户构建正负样本
    for user_id, hist_df in data_df.groupby('user_id'):
        pos_list = hist_df['movie_id'].to_list()
        rating_list = hist_df['rating'].to_list()

        if neg_sample > 0:
            candidate_list = list(set(unique_item_ids) - set(pos_list))
            # 每个正样本对应多个负样本
            neg_list = np.random.choice(candidate_list, size=len(pos_list) * neg_sample, 
                replace=True) # 设置为True表示可以取相同的元素
        
        # 历史序列长度最少为1，这里也可以设置为更长
        for i in range(min_seq_len, len(pos_list)):
            hist = pos_list[:i] 
            if i != len(pos_list) - min_seq_len:
                # 构造样本
                # 样本的数据格式：user_id, hist_movid_id, pos_movie_id, label, hist_len
                train_data_list.append((user_id, hist[::-1], pos_list[i], 1, len(hist[::-1]), rating_list[i]))
                for negi in range(neg_sample):
                    train_data_list.append((user_id, hist[::-1], neg_list[i*neg_sample + i], 0, len(hist[::-1]), rating_list[i]))
            else:
                test_data_list.append((user_id, hist[::-1], pos_list[i], 1, len(hist[::-1]), rating_list[i]))

    random.shuffle(train_data_list)
    random.shuffle(test_data_list)

    # 将输入的特征转换成字典的形式
    train_data_dict = {}
    test_data_dict = {}

    # 构建训练集数据
    train_data_dict['user_id'] = np.array([line[0] for line in train_data_list])
    # 由于这个是不定长，所以不能直接转np，需要先对其进行padding
    # train_hist_movie_id = [line[1] for line in train_data_list]
    # train_data_dict['hist_movie_ids'] = pad_sequences(train_hist_movie_id, 
    #     maxlen=max_len, padding='post', truncating='post', value=0)
    train_data_dict['movie_id'] = np.array([line[2] for line in train_data_list])
    train_data_dict['label'] = np.array([line[3] for line in train_data_list])
    # train_data_dict['hist_len'] = np.array([line[4] for line in train_data_list])
    # train_data_dict['rating'] = np.array([line[5] for line in train_data_list])
    for key in ["gender", "age", "occupation", "zip"]:
        # 将样本中所有user_id对应的其他的特征都索引到
        tmp_list = []
        for i in range(len(train_data_dict['user_id'])):
            tmp_list.append(user_profile[user_profile['user_id'] == 
                train_data_dict['user_id'][i]][key])
        train_data_dict[key] = np.array(tmp_list)

    # 构建测试集数据
    test_data_dict['user_id'] = np.array([line[0] for line in test_data_list])
    # 由于这个是不定长，所以不能直接转np，需要先对其进行padding
    # train_hist_movie_id = [line[1] for line in test_data_list]
    # test_data_dict['hist_movie_ids'] = pad_sequences(train_hist_movie_id, 
    #     maxlen=max_len, padding='post', truncating='post', value=0)
    test_data_dict['movie_id'] = np.array([line[2] for line in test_data_list])
    test_data_dict['label'] = np.array([line[3] for line in test_data_list])
    # test_data_dict['hist_len'] = np.array([line[4] for line in test_data_list])
    # test_data_dict['rating'] = np.array([line[5] for line in test_data_list])

    for key in ["gender", "age", "occupation", "zip"]:
        # 将样本中所有user_id对应的其他的特征都索引到
        tmp_list = []
        for i in range(len(test_data_dict['user_id'])):
            tmp_list.append(user_profile[user_profile['user_id'] == 
                test_data_dict['user_id'][i]][key])
        test_data_dict[key] = np.array(tmp_list)


    return feature_max_index_dict, train_data_dict, test_data_dict


if __name__ == "__main__":
    data_path = '/home/ryluo/recsys/data/movielens_sample.txt'
   
    feature_max_index_dict, train_data_dict, test_data_dict = process_data(data_path)
    train_label = train_data_dict['label']
    print(train_data_dict.keys())
    train_data_dict.pop("label")
    embedding_dim = 4
    user_feature_columns = [SparseFeat('user_id', feature_max_index_dict['user_id'], embedding_dim),
                        SparseFeat("gender", feature_max_index_dict['gender'], embedding_dim),
                        SparseFeat("age", feature_max_index_dict['age'], embedding_dim),
                        SparseFeat("occupation", feature_max_index_dict['occupation'], embedding_dim),
                        SparseFeat("zip", feature_max_index_dict['zip'], embedding_dim),
                        # VarLenSparseFeat(SparseFeat('hist_movie_id', feature_max_idx['movie_id'], embedding_dim,
                        #                             embedding_name="movie_id"), SEQ_LEN, 'mean', 'hist_len'),
                        ]

    item_feature_columns = [SparseFeat('movie_id', feature_max_index_dict['movie_id'], embedding_dim)]
    print(user_feature_columns + item_feature_columns)

    model = DSSM(user_feature_columns, item_feature_columns)
    
    model.compile(optimizer="adam", loss='binary_crossentropy', metrics=[tf.keras.metrics.AUC])

    model.fit(train_data_dict, train_label,  # train_label,
                batch_size=256, epochs=1, verbose=1, validation_split=0.1, )