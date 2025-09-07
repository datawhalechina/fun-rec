"""
配置文件: USER_CF_CONFIG

使用方式:
    from funrec.config.config_user_cf import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_user_cf.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml_latest_small_classical",
        "rating_threshold": 4.0,
        "batch_size": 1000,
    },
    "features": {
        "feature_columns": [
        ],
    },
    "training": {
        "build_function": "funrec.models.user_cf.build_user_cf_model",
        "model_params": {
            "k_neighbors": 20,
            "min_similarity": 0.1,
        },
        "classical_model": True,
    },
    "evaluation": {
        "metrics": [
            "hit_rate@5",
            "hit_rate@10",
            "precision@5",
            "precision@10",
        ],
        "k_values": [
            5,
            10,
            20,
        ],
        "exclude_train": True,
        "classical_model": True,
    },
}


# 为了向后兼容，也提供原始变量名
USER_CF_CONFIG = CONFIG


__all__ = ["CONFIG", "USER_CF_CONFIG"]