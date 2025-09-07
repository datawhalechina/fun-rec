"""
配置文件: AUTOINT_CONFIG

使用方式:
    from funrec.config.config_autoint import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_autoint.yaml
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
                    "autoint1",
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "autoint1",
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "autoint1",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "autoint2",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.autoint.build_autoint_model",
        "model_params": {
            "num_interaction_layers": 2,
            "attention_factor": 8,
            "num_heads": 2,
            "use_residual": True,
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
AUTOINT_CONFIG = CONFIG


__all__ = ["CONFIG", "AUTOINT_CONFIG"]