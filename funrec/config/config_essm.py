"""
配置文件: ESSM_CONFIG

使用方式:
    from funrec.config.config_essm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_essm.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "task_names": [
            "is_click",
            "is_like",
        ],
        "features": [
            {
                "name": "user_id",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "dnn",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.essm.build_essm_model",
        "model_params": {
            "task_names": [
                "is_click",
                "is_like",
            ],
            "task_tower_dnn_units": [
                128,
                64,
            ],
            "dropout_rate": 0.1,
        },
        "optimizer": "adam",
        "loss": [
            "binary_crossentropy",
            "binary_crossentropy",
        ],
        "metrics": [
            "binary_accuracy",
        ],
        "batch_size": 1024,
        "epochs": 1,
        "validation_split": 0.2,
        "verbose": 0,
        "subsample_size": 300000,
    },
    "evaluation": {
        "model_type": "ranking",
        "task_names": [
            "is_click",
            "is_like",
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "video_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
ESSM_CONFIG = CONFIG


__all__ = ["CONFIG", "ESSM_CONFIG"]