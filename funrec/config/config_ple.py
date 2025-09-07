"""
配置文件: PLE_CONFIG


使用方式:
    from funrec.config.config_ple import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_ple.yaml
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
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "ple",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "ple",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.ple.build_ple_model",
        "model_params": {
            "task_names": [
                "is_click",
                "long_view",
                "is_like",
            ],
            "ple_level_nums": 1,
            "task_expert_num": 4,
            "shared_expert_num": 2,
            "task_expert_dnn_units": [
                128,
                64,
            ],
            "shared_expert_dnn_units": [
                128,
                64,
            ],
            "task_gate_dnn_units": [
                128,
                64,
            ],
            "shared_gate_dnn_units": [
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
PLE_CONFIG = CONFIG


__all__ = ["CONFIG", "PLE_CONFIG"]