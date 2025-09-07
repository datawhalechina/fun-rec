"""
数据配置
"""

import os
from dotenv import load_dotenv

load_dotenv()
PROCESSED_DATA_PATH = os.getenv('PROCESSED_DATA_PATH')


DATASET_CONFIG = {
    "ml_latest_small_youtubednn": {
        "dataset_name": "ml_latest_small",
        "links": PROCESSED_DATA_PATH + "/ml-latest-small/links.csv",
        "movies": PROCESSED_DATA_PATH + "/ml-latest-small/movies.csv",
        "ratings": PROCESSED_DATA_PATH + "/ml-latest-small/ratings.csv",
        "tags": PROCESSED_DATA_PATH + "/ml-latest-small/tags.csv",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml_latest_small_youtubednn.pkl",
        "raw_log_data": PROCESSED_DATA_PATH + "/feature_dict/ml_latest_small_youtubednn.csv",
        "train_eval_sample_raw": PROCESSED_DATA_PATH + "/train_eval_sample_raw/ml_latest_small_youtubednn_raw.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml_latest_small_youtubednn_final.pkl"
    },
    "e_commerce_rerank_data": {
        "dataset_name": "e_commerce_rerank_data",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/rerank_feature_dict.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/rerank_data.pkl"
    },
    "kuairand_data": {
        "dataset_name": "kuairand_data",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/kuairand_feature_dict.pkl",
        "train_sample_raw": PROCESSED_DATA_PATH + "/train_eval_sample_raw/kuairand_1k_train.csv",
        "test_sample_raw": PROCESSED_DATA_PATH + "/train_eval_sample_raw/kuairand_1k_test.csv",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/kuairand_train_eval.pkl"
    }, 
    "ml-1m_sasrec": {
        "dataset_name": "ml-1m_sasrec",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml-1m_sequence_feature_dict.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml-1m_sequence_data_dict.pkl"
    },
    "ml-1m_recall_data": {
        "dataset_name": "ml-1m_recall_data",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml-1m_recall_feature_dict.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml-1m_recall_train_eval.pkl"
    },
    "ml-1m_recall_pos_neg_data": {
        "dataset_name": "ml-1m_recall_pos_neg_data",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml-1m_recall_pos_neg_feature_dict.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml-1m_recall_pos_neg_train_eval.pkl"
    },
    "ml-1m_tiger": {
        "dataset_name": "ml-1m_tiger",        
        "dense_feature_path": PROCESSED_DATA_PATH + "/dense_feature/ml-1m_dense_feature.pkl",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml-1m_sequence_feature_dict.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml-1m_sequence_data_dict.pkl"
    },
    "ml_latest_small_classical": {
        "dataset_name": "ml_latest_small_classical",
        "dict_path": PROCESSED_DATA_PATH + "/feature_dict/ml_latest_small_classical.pkl",
        "train_eval_sample_final": PROCESSED_DATA_PATH + "/train_eval_sample_final/ml_latest_small_classical.pkl"
    }
}
