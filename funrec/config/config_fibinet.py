"""
配置文件: FIBINET_CONFIG

使用方式:
    from funrec.config.config_fibinet import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_fibinet.yaml
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
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "fibinet",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.fibinet.build_fibinet_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "senet_reduction_ratio": 3,
            "bilinear_type": "interaction",
            "use_bn": False,
            "dropout_rate": 0.0,
            "linear_logits": True,
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
FIBINET_CONFIG = CONFIG


__all__ = ["CONFIG", "FIBINET_CONFIG"]