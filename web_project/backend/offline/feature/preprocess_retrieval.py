"""
召回模型数据预处理 (YoutubeDNN)

本模块为召回模型生成序列训练样本。
使用滑动窗口方式构建用户历史序列。
"""

import sys
import pickle
import numpy as np
import pandas as pd
import itertools
from collections import defaultdict
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm
from offline.config import config

def load_raw_data():
    """加载原始 MovieLens 数据文件"""
    print("加载原始数据...")
    try:
        df_movies = pd.read_pickle(config.DATASET_DIR / "movies.pkl")
        df_ratings = pd.read_pickle(config.DATASET_DIR / "ratings.pkl")
        df_users = pd.read_pickle(config.DATASET_DIR / "users.pkl")
        return df_movies, df_ratings, df_users
    except FileNotFoundError:
        print(f"数据文件不存在: {config.DATASET_DIR}")
        sys.exit(1)

def process_features(df_movies, df_ratings, df_users):
    """
    处理特征
    
    Returns:
        df_merged: 合并后的特征 DataFrame
        user_vocab: 用户特征词表
        movie_vocab: 电影特征词表
        df_users: 处理后的用户 DataFrame
        df_movies: 处理后的电影 DataFrame
    """
    print("提取特征...")
    
    # 选择列
    user_columns = ["user_id", "gender", "age", "occupation", "zip_code"]
    movie_columns = ["movie_id", "originalTitle", "description", "genres", "isAdult", "startYear", "runtimeMinutes", "averageRating", "numVotes"]
    ratings_columns = ["user_id", "movie_id", "rating", "timestamp"]

    df_users = df_users[user_columns]
    df_movies = df_movies[movie_columns].rename(columns={"originalTitle": "title"})
    df_movies['genres'] = df_movies['genres'].str.split("|")
    df_movies['runtimeMinutes'] = df_movies['runtimeMinutes'].replace('\\N', float('nan'))
    df_ratings = df_ratings[ratings_columns]

    # 2. 特征提取
    print("提取特征...")

    # 稀疏特征编码
    user_sparse_feature_columns = ["user_id", "gender", "age", "occupation", "zip_code"]
    new_user_feature_df = df_users[user_sparse_feature_columns].copy()

    user_vocab = {}
    for feat_name in user_sparse_feature_columns:
        label_encoder = LabelEncoder()
        new_user_feature_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(new_user_feature_df[feat_name]) + 1  # 0 用于未知
        )
        if feat_name != "user_id":
            new_user_feature_df[feat_name] = new_user_feature_df[feat_name + "_encode"]
            del new_user_feature_df[feat_name + "_encode"]
        user_vocab[feat_name] = label_encoder.classes_

    movie_encode_feature_columns = ["movie_id", "genres", "isAdult","startYear"]
    new_movie_sparse_feature_df = df_movies[movie_encode_feature_columns].copy()
    new_movie_sparse_feature_df["isAdult"] = new_movie_sparse_feature_df["isAdult"].fillna(False)

    movie_vocab = {}
    for feat_name in movie_encode_feature_columns:
        label_encoder = LabelEncoder()
        # explode 展开列表（类型字段）以进行拟合
        label_encoder.fit(new_movie_sparse_feature_df[feat_name].explode()) 
        if feat_name == "genres":
            new_movie_sparse_feature_df[feat_name + "_encode"] = new_movie_sparse_feature_df[feat_name].apply(lambda x: label_encoder.transform(x) + 1)
        else:
            new_movie_sparse_feature_df[feat_name + "_encode"] = label_encoder.transform(new_movie_sparse_feature_df[feat_name]) + 1
        
        if feat_name != "movie_id":
            new_movie_sparse_feature_df[feat_name] = new_movie_sparse_feature_df[feat_name + "_encode"]
            del new_movie_sparse_feature_df[feat_name + "_encode"]
        movie_vocab[feat_name] = label_encoder.classes_

    new_movie_feature_df = new_movie_sparse_feature_df

    # 评分特征
    new_ratings_feature_df = df_ratings.merge(
        df_ratings.groupby("user_id")['rating'].mean().reset_index().rename(columns={"rating": "user_avg_rating"}), 
        on="user_id"
    )
    # 转化/点击掩码（此处召回模型不严格使用，但保留以保持一致性）
    # 计算转化、点击、曝光
    conversion_mask = new_ratings_feature_df['rating'] >= new_ratings_feature_df['user_avg_rating']
    click_mask = new_ratings_feature_df['rating'] >= new_ratings_feature_df['user_avg_rating'] - 1
    exposure_mask = np.ones(len(new_ratings_feature_df), dtype=bool)
    new_ratings_feature_df['conversion'] = conversion_mask
    new_ratings_feature_df['click'] = click_mask
    new_ratings_feature_df['exposure'] = exposure_mask

    # 3. 构建训练数据
    print("构建训练数据...")
    df_merged = new_ratings_feature_df.merge(new_user_feature_df, on="user_id", how="left")
    df_merged = df_merged.merge(new_movie_feature_df, on="movie_id", how="left")

    # 使用编码后的 ID
    df_merged["user_id"] = df_merged["user_id_encode"]
    df_merged["movie_id"] = df_merged["movie_id_encode"]
    del df_merged["user_id_encode"]
    del df_merged["movie_id_encode"]

    for col in df_merged.columns:
        if col != "genres":
            try:
                df_merged[col] = df_merged[col].astype(int)
            except:
                pass
    
    return df_merged, user_vocab, movie_vocab, df_users, df_movies


def add_padding(val, padding_value, max_seq_len):
    """为序列添加填充以达到固定长度"""
    if isinstance(val, (list, tuple, np.ndarray)):
        if len(val) > 0 and isinstance(val[0], (list, tuple, np.ndarray)):        
            val = list(itertools.chain(*val))[:max_seq_len]
        else:
            val = list(val)[:max_seq_len]
        return [padding_value] * (max_seq_len - len(val)) + val
    else:
        return val

def generate_train_eval_samples(
        data_df, user_columns, item_columns, max_hist_seq_len=10, max_feat_seq_len=10, padding_value=0
    ):
    """
    生成训练和评估样本
    
    使用滑动窗口方式构建序列样本：
    - 测试数据：每个用户的最后一个物品
    - 训练数据：滑动窗口生成的历史序列
    
    Args:
        data_df: 包含特征的 DataFrame
        user_columns: 用户特征列
        item_columns: 物品特征列
        max_hist_seq_len: 历史序列最大长度
        max_feat_seq_len: 特征序列最大长度
        padding_value: 填充值
    
    Returns:
        包含 train 和 test 数据的字典
    """
    data_df.sort_values("timestamp", inplace=True)
    train_data_dict = defaultdict(list)
    test_data_dict = defaultdict(list)
    
    print("生成训练和评估样本...")
    for user_id, grouped_feats in tqdm(data_df.groupby("user_id")):            
        if len(grouped_feats["movie_id"]) < 2:
            continue

        # --- 测试数据（最后一个物品）---
        # 测试集用户特征
        test_data_dict["user_id"].append(user_id)
        for col in user_columns:
            test_data_dict[col].append(grouped_feats[col].iloc[0])
        
        len_hist_seq = len(grouped_feats["movie_id"])
        
        # 测试集物品特征
        for col in item_columns:
            test_data_dict["hist_" + col].append(add_padding(grouped_feats[col].tolist()[:-1], padding_value, max_hist_seq_len))
            test_data_dict[col].append(add_padding(grouped_feats[col].tolist()[-1], padding_value, max_feat_seq_len))

        # --- 训练数据（滑动窗口）---
        for i in range(1, len_hist_seq - 1):
            # 修复：为每个训练样本添加用户特征
            train_data_dict["user_id"].append(user_id)
            for col in user_columns:
                train_data_dict[col].append(grouped_feats[col].iloc[0])

            # 训练集物品特征
            for col in item_columns:
                train_data_dict["hist_" + col].append(add_padding(grouped_feats[col].tolist()[:i], padding_value, max_hist_seq_len))
                train_data_dict[col].append(add_padding(grouped_feats[col].tolist()[i], padding_value, max_hist_seq_len))

    # 转换为 numpy 数组
    print("转换为 numpy 数组...")
    final_train = {}
    for k, v in train_data_dict.items():
        final_train[k] = np.array(v)
        
    final_test = {}
    for k, v in test_data_dict.items():
        final_test[k] = np.array(v)

    return {"train": final_train, "test": final_test}

def run_retrieval_preprocessing():
    """召回模型预处理主流程"""
    # 1. 加载数据
    df_movies, df_ratings, df_users = load_raw_data()
    
    # 2. 处理特征
    df_merged, user_vocab, movie_vocab, df_users_processed, df_movies_processed = process_features(df_movies, df_ratings, df_users)
    
    # 3. 生成样本
    user_columns = ["gender", "age", "occupation", "zip_code"]
    item_columns = ["movie_id", "genres", "isAdult", "startYear"]
    samples  = generate_train_eval_samples(
        df_merged, user_columns, item_columns, max_hist_seq_len=config.MAX_SEQ_LEN, max_feat_seq_len=config.MAX_SEQ_LEN
    )

    # 4. 保存
    print("保存处理后的数据...")
    pickle.dump(samples, open(config.TRAIN_DATA_PATH, "wb"))
    
    vocab_dict = {**user_vocab, **movie_vocab}
    pickle.dump(vocab_dict, open(config.VOCAB_DICT_PATH, "wb"))
    
    # 模型配置的特征字典（词表大小 + 1 用于填充）
    feature_dict = {k: len(v) + 1 for k, v in vocab_dict.items()}
    pickle.dump(feature_dict, open(config.FEATURE_DICT_PATH, "wb"))
    
    print("预处理完成.")
    return df_users_processed, df_movies_processed

if __name__ == "__main__":
    run_retrieval_preprocessing()
