"""
配置文件: PNN_CONFIG

使用方式:
    from funrec.config.config_pnn import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_pnn.yaml
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
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "pnn",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.pnn.build_pnn_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "product_layer_units": 8,
            "use_inner": True,
            "use_outer": True,
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
PNN_CONFIG = CONFIG


__all__ = ["CONFIG", "PNN_CONFIG"]