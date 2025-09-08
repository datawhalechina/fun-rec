"""
数据加载
"""

import os
from pathlib import Path
from typing import Dict, Any, Tuple
from ..utils import load_env_with_fallback

# 自动加载环境变量
load_env_with_fallback()

RAW_DATA_PATH = os.getenv("FUNREC_RAW_DATA_PATH")
if not RAW_DATA_PATH:
    raise ValueError("FUNREC_RAW_DATA_PATH 未设置, 请在环境变量中设置")

from ..config.data_config import DATASET_CONFIG
from .data_utils import read_pkl_data
from .preprocess.movielens import (
    movielens_sequence_preprocess,
    movielens_dense_preprocess,
    movielens_recall_preprocess,
    movielens_recall_pos_neg_preprocess,
    movielens_youtubednn_preprocess,
    movielens_classical_preprocess,
)
from .preprocess.kuairand import preprocess as kuairand_preprocess
from .preprocess.e_commerce import preprocess as e_commerce_preprocess


def load_data(data_config: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """

    基于配置加载训练和测试数据。

    Args:
        data_config:
            - dataset_name: 数据集名称
            - data_dir: 数据目录
            - rating_threshold: 评分阈值(经典模型)

    Returns:
        (train_data, test_data) 训练和测试数据
    """

    # 处理经典模型, 设置适当的数据集名称
    dataset_name = data_config.get("dataset_name")
    if not dataset_name:
        raise ValueError("dataset_name 须在数据配置中指定")

    if not DATASET_CONFIG or dataset_name not in DATASET_CONFIG:
        raise ValueError(f"Dataset {dataset_name} 在 DATASET_CONFIG 中未找到")

    dataset_config = DATASET_CONFIG[dataset_name]

    # 如果处理后的数据不存在，则先处理数据
    # 处理后的数据不存在，则先处理数据
    output_data_key = "train_eval_sample_final"
    dict_path = Path(dataset_config[output_data_key])
    if not dict_path.exists():
        print(f"处理后的数据不存在，先处理数据...")
        raw_data_path = Path(RAW_DATA_PATH)
        preprocess_func = None
        if dataset_name == "ml-1m_sasrec":
            preprocess_func = movielens_sequence_preprocess
            input_path = raw_data_path / "ml-1m"
        elif dataset_name == "ml-1m_dense_feature":
            preprocess_func = movielens_dense_preprocess
            input_path = raw_data_path / "ml-1m"
        elif dataset_name == "ml-1m_recall_data":
            preprocess_func = movielens_recall_preprocess
            input_path = raw_data_path / "ml-1m"
        elif dataset_name == "ml-1m_recall_pos_neg_data":
            preprocess_func = movielens_recall_pos_neg_preprocess
            input_path = raw_data_path / "ml-1m"
        elif dataset_name == "kuairand_data":
            preprocess_func = kuairand_preprocess
            input_path = raw_data_path / "kuairand" / "KuaiRand-1K"
        elif dataset_name == "e_commerce_rerank_data":
            preprocess_func = e_commerce_preprocess
            input_path = raw_data_path / "e_commerce" / "sample_data"
        elif dataset_name == "ml_latest_small_youtubednn":
            preprocess_func = movielens_youtubednn_preprocess
            input_path = raw_data_path / "ml-latest-small"
        elif dataset_name == "ml_latest_small_classical":
            preprocess_func = movielens_classical_preprocess
            input_path = raw_data_path / "ml-latest-small"

        if preprocess_func:
            if dataset_name == "ml_latest_small_classical":
                # 处理经典模型, 需要传入评分阈值
                rating_threshold = data_config.get("rating_threshold", 4.0)
                preprocess_func(input_path, dict_path.parent.parent, rating_threshold)
            else:
                preprocess_func(input_path, dict_path.parent.parent)

    # 检查处理后的数据是否存在
    if output_data_key not in dataset_config:
        raise KeyError(f"{output_data_key} 在 DATASET_CONFIG 中未找到")
    total_sample_dict = read_pkl_data(dataset_config[output_data_key])

    # 检查处理后的数据是否存在
    if "train" in total_sample_dict and "test" in total_sample_dict:
        train_data = total_sample_dict["train"]
        test_data = total_sample_dict["test"]
    else:
        raise KeyError("train 和 test 在 total_sample_dict 中未找到")

    return train_data, test_data
