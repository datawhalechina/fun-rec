"""
精排模型训练脚本 (DeepFM)

本脚本使用预处理的精排数据训练 DeepFM 模型进行 CTR 预估。
DeepFM 结合了因子分解机（FM）用于特征交叉，
以及深度神经网络（DNN）用于学习高阶特征组合。

使用方法:
    uv run python -m offline.training.train_ranking
"""

import pickle
import sys
from pathlib import Path

import numpy as np
import tensorflow as tf

# 将 src 添加到路径以导入 funrec
sys.path.append(str(Path(__file__).resolve().parent.parent.parent.parent.parent / "src"))

from funrec.config import Config as FunRecConfig
from funrec.features.processors import prepare_features
from funrec.training.trainer import train_model
from funrec.evaluation import evaluate_model
from funrec.utils import build_metrics_table

from offline.config import config


def run_ranking_training():
    """训练 DeepFM 精排模型"""
    print("=" * 60)
    print("DeepFM 精排模型训练")
    print("=" * 60)
    
    # 检查预处理的精排数据
    ranking_data_path = config.RANKING_TRAIN_DATA_PATH
    ranking_feature_dict_path = config.RANKING_FEATURE_DICT_PATH
    
    if not ranking_data_path.exists():
        print(f"精排训练数据不存在: {ranking_data_path}")
        print("请先运行精排预处理:")
        print("  uv run python -m offline.feature.preprocess_ranking")
        return
    
    # 加载数据
    print("\n加载预处理后的精排数据...")
    train_eval_samples = pickle.load(open(ranking_data_path, "rb"))
    feature_dict = pickle.load(open(ranking_feature_dict_path, "rb"))
    
    train_data = train_eval_samples["train"]
    test_data = train_eval_samples["test"]
    
    print(f"  训练集样本: {len(train_data['user_id'])}")
    print(f"  测试集样本: {len(test_data['user_id'])}")
    print(f"  特征词汇表大小: {feature_dict}")
    
    # funrec 的 prepare_features 所需的数据集配置
    dataset_name = "ml-1m_ranking"
    data_config = {
        dataset_name: {
            "dataset_name": dataset_name,
            "dict_path": ranking_feature_dict_path,
            "train_eval_sample_final": ranking_data_path
        }
    }
    
    # DeepFM 模型配置
    # 所有特征同时进入 'deepfm'（FM 组件）和 'linear'（线性组件）组
    model_config_dict = {
        "data": {
            "dataset_name": dataset_name,
        },
        "features": {
            "dataset_name": dataset_name,
            "emb_dim": config.EMB_DIM,
            "task_names": ["is_click"],  # 二分类标签
            "features": [
                # User Features
                {"name": "user_id", "group": ["deepfm", "linear"], "vocab_size": feature_dict["user_id"]},
                {"name": "gender", "group": ["deepfm", "linear"], "vocab_size": feature_dict["gender"]},
                {"name": "age", "group": ["deepfm", "linear"], "vocab_size": feature_dict["age"]},
                {"name": "occupation", "group": ["deepfm", "linear"], "vocab_size": feature_dict["occupation"]},
                {"name": "zip_code", "group": ["deepfm", "linear"], "vocab_size": feature_dict["zip_code"]},
                
                # Item Features
                {"name": "movie_id", "group": ["deepfm", "linear"], "vocab_size": feature_dict["movie_id"]},
                {"name": "genres", "group": ["deepfm", "linear"], "vocab_size": feature_dict["genres"]},
                {"name": "isAdult", "group": ["deepfm", "linear"], "vocab_size": feature_dict["isAdult"]},
                {"name": "startYear", "group": ["deepfm", "linear"], "vocab_size": feature_dict["startYear"]},
            ]
        },
        "training": {
            "build_function": "funrec.models.deepfm.build_deepfm_model",
            "model_params": {
                "dnn_units": [128, 64, 32],  # DNN 隐藏层
                "dropout_rate": 0.1,
                "linear_logits": True,  # 包含线性 (一阶) 项
            },
            "optimizer": "adam",
            "optimizer_params": {"learning_rate": config.LEARNING_RATE},
            "loss": ["binary_crossentropy"],
            "metrics": ["binary_accuracy", "AUC"],
            "batch_size": config.BATCH_SIZE,
            "epochs": config.EPOCHS,
            "validation_split": 0.1,
            "verbose": 1,
        },
        "evaluation": {
            "model_type": "ranking",  # 触发 AUC/gAUC 评估
            "model_config": {
                "user_id_col": "user_id",
                "item_id_col": "movie_id"
            }
        }
    }
    
    # 初始化 FunRec 配置
    cfg = FunRecConfig(
        data=model_config_dict["data"],
        features=model_config_dict["features"],
        training=model_config_dict["training"],
        evaluation=model_config_dict["evaluation"]
    )
    
    # 准备特征
    print("\n准备特征...")
    feature_columns, processed_data = prepare_features(
        cfg.features, 
        train_data, 
        test_data, 
        dataset_config=data_config[dataset_name]
    )
    
    print(f"  特征列: {len(feature_columns)}")
    for fc in feature_columns:
        print(f"    - {fc.name}: vocab_size={fc.vocab_size}, emb_dim={fc.emb_dim}")
    
    # 训练模型
    print("\n训练 DeepFM 模型...")
    models = train_model(cfg.training, feature_columns, processed_data)
    
    # DeepFM 返回 (main_model, None, None)，因为它不是双塔模型
    main_model = models[0]
    
    # 评估模型
    print("\n评估模型...")
    metrics = evaluate_model(models, processed_data, cfg.evaluation, feature_columns)
    
    print("\n" + "=" * 60)
    print("评估结果")
    print("=" * 60)
    print(build_metrics_table(metrics))
    
    # 保存模型
    print("\n保存模型...")
    model_save_path = config.RANKING_MODEL_PATH
    main_model.save(model_save_path)
    print(f"  模型保存到: {model_save_path}")
    
    # 保存模型配置用于推理
    model_config_save_path = config.TEMP_DIR / "ranking_model_config.pkl"
    pickle.dump({
        "feature_dict": feature_dict,
        "feature_columns": [fc.name for fc in feature_columns],
        "model_config": model_config_dict
    }, open(model_config_save_path, "wb"))
    print(f"  配置保存到: {model_config_save_path}")
    
    print("\n" + "=" * 60)
    print("训练完成!")
    print("=" * 60)
    
    return main_model, metrics


if __name__ == "__main__":
    run_ranking_training()

