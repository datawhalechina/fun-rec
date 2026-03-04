"""
Redis 数据导入脚本

将用户画像、历史行为和偏好数据导入 Redis，用于在线推荐服务。

使用方法:
    uv run python -m offline.storage.redis_ingest
    uv run python -m offline.storage.redis_ingest --flush  # 清空后重新导入
"""

import redis
import pickle
import pandas as pd
import logging
from tqdm import tqdm
from offline.config import config
from offline.feature.preprocess_retrieval import load_raw_data

logger = logging.getLogger(__name__)

def ingest_to_redis(flush: bool = False):
    """
    将用户数据导入 Redis
    
    Args:
        flush: 是否在导入前清空 Redis 数据库
    """
    print("开始将数据导入 Redis...")
    
    try:
        r = redis.Redis.from_url(config.REDIS_URL, decode_responses=True)
        r.ping()
    except Exception as e:
        print(f"连接 Redis 失败: {e}")
        return

    if flush:
        print("清空 Redis 数据库...")
        r.flushdb()

    # 1. 加载处理后的数据
    # 由于预处理保存的是样本而非完整的带历史记录的 DataFrame，
    # 我们可能需要重新构建或在预处理时保存它。
    # 目前，我们调用预处理中的逻辑来获取 DataFrame。
    # 这可能较慢但确保数据最新。
    
    df_movies, df_ratings, df_users = load_raw_data()
    # 我们不需要完整的特征矩阵处理，只需要画像的原始值
    
    # --- 导入用户画像 ---
    print("导入用户画像...")
    # df_users: user_id, gender, age, occupation, zip_code
    # 转换为字典
    pipeline = r.pipeline()
    for _, row in tqdm(df_users.iterrows(), total=len(df_users)):
        user_id = row['user_id']
        key = config.USER_PROFILE_PREFIX.format(user_id)
        
        profile_data = {
            "gender": row["gender"],
            "age": row["age"],
            "occupation": row["occupation"],
            "zip_code": row["zip_code"]
        }
        pipeline.hset(key, mapping=profile_data)
        
        if _ % 1000 == 0:
            pipeline.execute()
    pipeline.execute()
    
    # --- 导入用户历史和偏好 ---
    print("导入用户历史和偏好...")
    # 按用户分组评分
    # 按时间排序
    df_ratings.sort_values("timestamp", inplace=True)
    
    # 确保类型是列表
    if isinstance(df_movies.iloc[0]['genres'], str):
        df_movies['genres'] = df_movies['genres'].str.split("|")
        
    grouped = df_ratings.groupby("user_id")
    
    for user_id, group in tqdm(grouped):
        # 1. 历史（movie_id 列表）
        history_key = config.USER_HISTORY_PREFIX.format(user_id)
        movie_ids = group["movie_id"].tolist()
        
        # Redis 列表：全部推入（先删除旧的以清理）
        pipeline.delete(history_key)
        if movie_ids:
            # RPUSH 添加到尾部。历史通常以"最近的在最后"方式访问
            # pipeline.rpush(history_key, *movie_ids)
            # 如果太大则分块
            # 大多数用户 < 1000 条评分
            
            # 使用 1000 条一块
            for i in range(0, len(movie_ids), 1000):
                chunk = movie_ids[i:i+1000]
                pipeline.rpush(history_key, *chunk)
        
        # 2. 偏好（热门类型）
        # 需要电影元数据。与 df_movies 连接。
        # df_movies 的 'genres' 为列表
        # 计算热门类型
        
        # 获取该用户的电影
        user_movies = df_movies[df_movies["movie_id"].isin(movie_ids)]
        all_genres = []
        for genres in user_movies["genres"]:
            all_genres.extend(genres)
            
        if all_genres:
            from collections import Counter
            counts = Counter(all_genres)
            # 最常见的前 3 个类型
            top_3 = [g for g, c in counts.most_common(3)]
            
            # 存储为字符串还是集合？
            # 理想情况下存储在画像哈希或单独的键中
            # 为简化检索，我们添加到画像哈希中
            pipeline.hset(config.USER_PROFILE_PREFIX.format(user_id), "frequent_genres", ",".join(top_3))
            
        if _ % 100 == 0:
            pipeline.execute()
            
    pipeline.execute()
    print("导入完成.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--flush", action="store_true", help="Flush Redis before ingestion")
    args = parser.parse_args()
    
    ingest_to_redis(flush=args.flush)
