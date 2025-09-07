"""
配置文件: FM_CONFIG

使用方式:
    from funrec.config.config_fm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_fm.yaml
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
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "fm",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "fm",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.fm.build_fm_model",
        "model_params": {
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
FM_CONFIG = CONFIG


__all__ = ["CONFIG", "FM_CONFIG"]