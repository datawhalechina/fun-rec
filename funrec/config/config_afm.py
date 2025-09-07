"""
配置文件: AFM_CONFIG

使用方式:
    from funrec.config.config_afm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_afm.yaml
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
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "afm",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "afm",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.afm.build_afm_model",
        "model_params": {
            "attention_factor": 4,
            "dropout_rate": 0.1,
            "l2_reg": 0.0001,
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
AFM_CONFIG = CONFIG


__all__ = ["CONFIG", "AFM_CONFIG"]