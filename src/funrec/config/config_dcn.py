"""
配置文件: DCN_CONFIG


使用方式:
    from funrec.config.config_dcn import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_dcn.yaml
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
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "user_active_degree",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "is_live_streamer",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "is_video_author",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "follow_user_num_range",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "fans_user_num_range",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "friend_user_num_range",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "register_days_range",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "video_type",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "upload_type",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "visible_status",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "music_id",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "music_type",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
            {
                "name": "tag",
                "group": [
                    "dcn",
                    "dnn",
                    "linear",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.dcn.build_dcn_model",
        "model_params": {
            "num_cross_layers": 3,
            "dnn_units": [
                64,
                32,
            ],
            "dropout_rate": 0.1,
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
DCN_CONFIG = CONFIG


__all__ = ["CONFIG", "DCN_CONFIG"]