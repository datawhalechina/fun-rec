import os
from pathlib import Path

from dotenv import load_dotenv

# TODO: 这不是一个好的实践方式
load_dotenv("../.env")

class Config:
    # 路径配置    
    TEMP_DIR = Path(os.getenv("FUNREC_PROCESSED_DATA_PATH")) / "web_project"
    DATASET_DIR = Path(os.getenv("FUNREC_RAW_DATA_PATH"))
    
    # 确保临时目录存在
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    SAVED_MODELS_DIR = TEMP_DIR / "saved_models"
    SAVED_MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 特征工程配置
    MAX_SEQ_LEN = 10       # 最大序列长度
    EMB_DIM = 16           # 嵌入维度
    NEG_SAMPLE_SIZE = 20   # 负采样大小
    
    # 训练配置
    BATCH_SIZE = 128
    EPOCHS = 3
    LEARNING_RATE = 0.001
    
    # 模型部署目录（用于在线服务加载模型）
    DEPLOY_DIR = TEMP_DIR / "deployed_models"
    DEPLOY_DIR.mkdir(parents=True, exist_ok=True)
    
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # 特征存储键名
    USER_PROFILE_PREFIX = "user:{}:profile"
    USER_HISTORY_PREFIX = "user:{}:history"
    
    # 文件路径 - 召回模型 (YoutubeDNN)
    TRAIN_DATA_PATH = TEMP_DIR / "train_eval_sample_final.pkl"
    FEATURE_DICT_PATH = TEMP_DIR / "feature_dict.pkl"
    VOCAB_DICT_PATH = TEMP_DIR / "vocab_dict.pkl"
    ITEM_EMB_PATH = TEMP_DIR / "item_embeddings.npy"
    MOVIE_IDS_PATH = TEMP_DIR / "movie_ids.npy"
    
    # 文件路径 - 精排模型 (DeepFM)
    RANKING_TRAIN_DATA_PATH = TEMP_DIR / "ranking_train_eval_sample.pkl"
    RANKING_FEATURE_DICT_PATH = TEMP_DIR / "ranking_feature_dict.pkl"
    RANKING_VOCAB_DICT_PATH = TEMP_DIR / "ranking_vocab_dict.pkl"
    RANKING_MODEL_PATH = SAVED_MODELS_DIR / "ranking_model"

config = Config()
