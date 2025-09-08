"""
配置文件: FM_RECALL_CONFIG

使用方式:
    from funrec.config.config_fm_recall import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_fm_recall.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml-1m_recall_pos_neg_data",
    },
    "features": {
        "dataset_name": "ml-1m_recall_pos_neg_data",
        "emb_dim": 8,
        "task_names": [
            "label",
        ],
        "features": [
            {
                "name": "user_id",
                "group": [
                    "user",
                ],
            },
            {
                "name": "age",
                "group": [
                    "user",
                ],
            },
            {
                "name": "occupation",
                "group": [
                    "user",
                ],
            },
            {
                "name": "zip",
                "group": [
                    "user",
                ],
            },
            {
                "name": "movie_id",
                "group": [
                    "item",
                ],
            },
            {
                "name": "genres",
                "group": [
                    "item",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.fm_recall.build_fm_recall_model",
        "model_params": {
            "embedding_dim": 8,
        },
        "optimizer": "adam",
        "loss": [
            "binary_crossentropy",
        ],
        "metrics": [
            "binary_accuracy",
        ],
        "batch_size": 1024,
        "epochs": 1,
        "validation_split": 0.2,
        "verbose": 0,
    },
    "evaluation": {
        "k_list": [
            5,
            10,
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "movie_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
FM_RECALL_CONFIG = CONFIG


__all__ = ["CONFIG", "FM_RECALL_CONFIG"]