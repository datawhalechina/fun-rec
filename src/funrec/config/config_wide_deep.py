"""
配置文件: WIDE_DEEP_CONFIG

使用方式:
    from funrec.config.config_wide_deep import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_wide_deep.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "task_names": [
            "is_click",
        ],
        "features": [
            {
                "name": "user_id",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "wide_deep",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.wide_deep.build_wide_deep_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "dnn_dropout_rate": 0.1,
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
        "subsample_size": 300000,
    },
    "evaluation": {
        "model_type": "ranking",
        "model_config": {
            "user_id_col": "user_id",
            "item_id_col": "video_id",
        },
    },
}


# 为了向后兼容，也提供原始变量名
WIDE_DEEP_CONFIG = CONFIG


__all__ = ["CONFIG", "WIDE_DEEP_CONFIG"]