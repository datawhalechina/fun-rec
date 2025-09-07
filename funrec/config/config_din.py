"""
配置文件: DIN_CONFIG

使用方式:
    from funrec.config.config_din import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_din.yaml
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
        "max_seq_len": 20,
        "features": [
            {
                "name": "user_id",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "linear",
                    "dnn",
                ],
            },
            {
                "name": "last_k_clicked_items",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "combiner": "mean,din",
                "att_key_name": "video_id",
                "max_len": 20,
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.din.build_din_model",
        "model_params": {
            "dnn_units": [
                128,
                64,
                1,
            ],
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
DIN_CONFIG = CONFIG


__all__ = ["CONFIG", "DIN_CONFIG"]