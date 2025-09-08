"""
配置文件: XDEEPFM_CONFIG

使用方式:
    from funrec.config.config_xdeepfm import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_xdeepfm.yaml
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
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "xdeepfm",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.xdeepfm.build_xdeepfm_model",
        "model_params": {
            "dnn_units": [
                64,
                32,
            ],
            "dnn_dropout_rate": 0.1,
            "cin_layer_sizes": [
                32,
                16,
            ],
            "l2_reg": 1e-05,
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
XDEEPFM_CONFIG = CONFIG


__all__ = ["CONFIG", "XDEEPFM_CONFIG"]