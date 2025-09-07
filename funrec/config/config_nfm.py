"""
配置文件: NFM_CONFIG

使用方式:
    from funrec.config.config_nfm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_nfm.yaml
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
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "nfm",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.nfm.build_nfm_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "use_bn": True,
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
NFM_CONFIG = CONFIG


__all__ = ["CONFIG", "NFM_CONFIG"]