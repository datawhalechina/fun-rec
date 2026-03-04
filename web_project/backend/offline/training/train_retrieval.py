"""
召回模型训练脚本 (YoutubeDNN)

本脚本使用预处理的召回数据训练 YoutubeDNN 模型。
YoutubeDNN 是一种双塔模型，分别学习用户和物品的嵌入表示，
通过负采样 softmax 损失进行训练。

使用方法:
    uv run python -m offline.training.train_retrieval
"""

import tensorflow as tf
import pickle
import numpy as np
import sys
from pathlib import Path

# 将 src 添加到路径以导入 funrec
# 注意：当作为模块 'offline.training.train' 运行时，相对导入对 'offline' 有效，
# 但 'funrec' 在 'src/' 中。我们假设 PYTHONPATH 处理了 'src/'。
# 如果没有，我们在这里添加以防万一。
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "src"))

from funrec.config import Config as FunRecConfig
from funrec.features.processors import prepare_features
from funrec.training.trainer import train_model
from funrec.evaluation import evaluate_model
from funrec.utils import build_metrics_table

from offline.config import config

def run_retrieval_training():
    """训练 YoutubeDNN 召回模型"""
    print("开始训练召回模型...")
    
    # 加载数据
    if not config.TRAIN_DATA_PATH.exists():
        print("训练数据不存在. 请先运行预处理.")
        return
        
    train_eval_samples = pickle.load(open(config.TRAIN_DATA_PATH, "rb"))
    feature_dict = pickle.load(open(config.FEATURE_DICT_PATH, "rb"))
    
    train_data = train_eval_samples["train"]
    test_data = train_eval_samples["test"]
    
    # 定义模型配置（基于 feature_dict 动态生成）

    data_config = {
        "ml-1m_web_project": {
            "dataset_name": "ml-1m_web_project",
            "dict_path": config.FEATURE_DICT_PATH,
            "train_eval_sample_final": config.TRAIN_DATA_PATH
        }
    }

    model_config_dict = {
        "data": {
            "dataset_name": "ml-1m_web_project",
        },
        "features": {
            "dataset_name": "ml-1m_web_project",
            "emb_dim": config.EMB_DIM,
            "max_seq_len": config.MAX_SEQ_LEN,
            "task_names": ["movie_id"],
            "features": [
                # 用户特征
                {"name": "user_id", "group": ["user_dnn"], "vocab_size": feature_dict["user_id"]},
                {"name": "age", "group": ["user_dnn"], "vocab_size": feature_dict["age"]},
                {"name": "gender", "group": ["user_dnn"], "vocab_size": feature_dict["gender"]},
                {"name": "occupation", "group": ["user_dnn"], "vocab_size": feature_dict["occupation"]},
                {"name": "zip_code", "group": ["user_dnn"], "vocab_size": feature_dict["zip_code"]},
                
                # 物品特征 (目标)
                {"name": "movie_id", "group": ["target_item"], "vocab_size": feature_dict["movie_id"]},
                
                # 历史特征
                {
                    "name": "hist_movie_id", 
                    "emb_name": "movie_id", 
                    "group": ["raw_hist_seq"], 
                    "combiner": "mean",
                    "vocab_size": feature_dict["movie_id"]
                },
                {
                    "name": "hist_genres", 
                    "emb_name": "genres", 
                    "group": ["raw_hist_seq"], 
                    "combiner": "mean",
                    "vocab_size": feature_dict["genres"]
                },
            ]
        },
        "training": {
            "build_function": "funrec.models.youtubednn.build_youtubednn_model",
            "data_preprocessing": [{"type": "positive_sampling_labels"}],
            "model_params": {
                "emb_dim": config.EMB_DIM,
                "neg_sample": config.NEG_SAMPLE_SIZE,
                "dnn_units": [64, 32],
                "label_name": "movie_id"
            },
            "optimizer": "adam",
            "optimizer_params": {"learning_rate": config.LEARNING_RATE},
            "loss": "sampledsoftmaxloss",
            "batch_size": config.BATCH_SIZE,
            "epochs": config.EPOCHS,
            "verbose": 1
        },
        "evaluation": {
            "k_list": [5, 10],
            "model_config": {"user_id_col": "user_id", "item_id_col": "movie_id"}
        }
    }
    
    # 初始化配置
    # 我们手动构建 FunRecConfig，因为字典结构可能与 YAML 略有不同
    # funrec.config.Config 期望字典格式
    cfg = FunRecConfig(
        data=model_config_dict["data"],
        features=model_config_dict["features"],
        training=model_config_dict["training"],
        evaluation=model_config_dict["evaluation"]
    )
    
    # 准备特征（将 numpy 字典转换为 TF 数据集或输入）
    # 注意：funrec 中的 prepare_features 实现可能依赖特定的 dataset_config 结构
    # 如果需要，我们传递一个虚拟的 dataset_config，或依赖默认值。
    # 查看 notebook：传递的 dataset_config 包含路径。
    
    feature_columns, processed_data = prepare_features(
        cfg.features, train_data, test_data, dataset_config=data_config[cfg.data["dataset_name"]]
    )
    
    # 训练
    models = train_model(cfg.training, feature_columns, processed_data)
    
    # 评估
    metrics = evaluate_model(models, processed_data, cfg.evaluation, feature_columns)
    print(build_metrics_table(metrics))
    
    # 保存模型
    user_model = models[1]  # 通常是 [full_model, user_model, item_model]
    item_model = models[2]
    
    user_model.save(config.SAVED_MODELS_DIR / "user_model")
    item_model.save(config.SAVED_MODELS_DIR / "item_model")
    
    # 生成物品嵌入向量
    print("生成物品嵌入向量...")
    vocab_dict = pickle.load(open(config.VOCAB_DICT_PATH, "rb"))
    all_movie_ids = sorted(list(vocab_dict["movie_id"]))
    
    # 基于1的编码 ID
    encoded_ids = np.arange(1, len(all_movie_ids) + 1)
    item_inputs = {"movie_id": encoded_ids}
    
    embeddings = item_model.predict(item_inputs, verbose=0)
    # 归一化
    embeddings = embeddings / np.linalg.norm(embeddings, axis=1, keepdims=True)
    
    np.save(config.ITEM_EMB_PATH, embeddings)
    np.save(config.MOVIE_IDS_PATH, np.array(all_movie_ids))
    
    print("训练和模型保存完成.")

if __name__ == "__main__":
    run_retrieval_training()
