"""
配置文件: DEEPFM_CONFIG

使用方式:
    from funrec.config.config_deepfm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_deepfm.yaml
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
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "deepfm",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.deepfm.build_deepfm_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "dropout_rate": 0.1,
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
DEEPFM_CONFIG = CONFIG


__all__ = ["CONFIG", "DEEPFM_CONFIG"]