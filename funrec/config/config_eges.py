"""
配置文件: EGES_CONFIG

使用方式:
    from funrec.config.config_eges import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_eges.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml-1m_recall_data",
    },
    "features": {
        "dataset_name": "ml-1m_recall_data",
    },
    "training": {
        "build_function": "funrec.models.eges.build_eges_model",
        "model_params": {
            "dataset_name": "ml-1m_recall_data",
            "item_feature_list": [
                "movie_id",
                "genre_id",
            ],
            "emb_dim": 16,
            "l2_reg": "1e-5",
            "use_attention": True,
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
        "validation_split": 0.0,
        "verbose": 0,
        "data_preprocessing": [
            {
                "type": "eges_generate_walk_pairs",
                "num_walks": 10,
                "walk_length": 10,
                "window_size": 5,
                "neg_samples": 2,
            },
        ],
    },
    "evaluation": {
        "model_type": "eges",
        "k_list": [
            5,
            10,
            20,
            50,
            100,
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "movie_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
EGES_CONFIG = CONFIG


__all__ = ["CONFIG", "EGES_CONFIG"]