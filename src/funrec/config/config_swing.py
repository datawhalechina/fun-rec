"""
配置文件: SWING_CONFIG

使用方式:
    from funrec.config.config_swing import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_swing.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "ml_latest_small_classical",
        "rating_threshold": 5.0,
        "batch_size": 1000,
    },
    "features": {
        "feature_columns": [
        ],
    },
    "training": {
        "build_function": "funrec.models.swing.build_swing_model",
        "model_params": {
            "alpha": 1.0,
            "k_neighbors": 20,
            "min_similarity": 0.0,
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
        "k_list": [
            5,
            10,
        ],
        "exclude_train": True,
        "classical_model": True,
    },
}


# 为了向后兼容，也提供原始变量名
SWING_CONFIG = CONFIG


__all__ = ["CONFIG", "SWING_CONFIG"]