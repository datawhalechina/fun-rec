"""
配置文件: MMOE_CONFIG


使用方式:
    from funrec.config.config_mmoe import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_mmoe.yaml
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
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "mmoe",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.mmoe.build_mmoe_model",
        "model_params": {
            "task_names": [
                "is_click",
                "long_view",
                "is_like",
            ],
            "expert_nums": 4,
            "expert_dnn_units": [
                128,
                64,
            ],
            "gate_dnn_units": [
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
MMOE_CONFIG = CONFIG


__all__ = ["CONFIG", "MMOE_CONFIG"]