"""
配置文件: ITEM2VEC_CONFIG

使用方式:
    from funrec.config.config_item2vec import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_item2vec.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml_latest_small_youtubednn",
    },
    "features": {
        "dataset_name": "ml_latest_small_youtubednn",
    },
    "training": {
        "build_function": "funrec.models.item2vec.build_item2vec_model",
        "embedding_external": True,
        "model_params": {
            "EmbDim": 32,
            "Window": 5,
            "MinCount": 1,
            "Workers": 4,
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
    },
    "evaluation": {
        "embedding_external": True,
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
ITEM2VEC_CONFIG = CONFIG


__all__ = ["CONFIG", "ITEM2VEC_CONFIG"]