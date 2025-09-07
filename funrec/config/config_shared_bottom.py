"""
配置文件: SHARED_BOTTOM_CONFIG

使用方式:
    from funrec.config.config_shared_bottom import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_shared_bottom.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "task_names": [
            "is_click",
            "long_view",
            "is_like",
        ],
        "features": [
            {
                "name": "user_id",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "shared_bottom",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.shared_bottom.build_shared_bottom_model",
        "model_params": {
            "task_names": [
                "is_click",
                "long_view",
                "is_like",
            ],
            "share_dnn_units": [
                128,
                64,
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
            "long_view",
            "is_like",
        ],
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "video_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
SHARED_BOTTOM_CONFIG = CONFIG


__all__ = ["CONFIG", "SHARED_BOTTOM_CONFIG"]