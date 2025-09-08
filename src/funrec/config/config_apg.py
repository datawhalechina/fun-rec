"""
配置文件: APG_CONFIG

使用方式:
    from funrec.config.config_apg import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_apg.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "pre_subsample_size_train": 100000,
        "pre_subsample_size_test": 100000,
        "task_names": [
            "is_click",
        ],
        "features": [
            {
                "name": "tab",
                "group": [
                    "domain",
                ],
            },
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
                "name": "onehot_feat0",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat1",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat2",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat3",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat4",
                "group": [
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
        ],
    },
    "training": {
        "build_function": "funrec.models.apg.build_apg_model",
        "model_params": {
            "task_names": [
                "is_click",
            ],
            "scene_group_name": "domain",
            "apg_dnn_units": [
                256,
                128,
            ],
            "scene_emb_dim": 8,
            "activation": "relu",
            "dropout": 0.2,
            "l2_reg": 1e-05,
            "use_uv_shared": True,
            "use_mf_p": True,
            "mf_k": 4,
            "mf_p": 4,
            "linear_logits": False,
        },
        "optimizer": "adam",
        "loss": [
            "binary_crossentropy",
        ],
        "metrics": [
            "binary_accuracy",
        ],
        "batch_size": 2048,
        "epochs": 1,
        "validation_split": 0.2,
        "verbose": 0,
        "subsample_size": 100000,
    },
    "evaluation": {
        "model_type": "ranking",
    },
}


# 为了向后兼容，也提供原始变量名
APG_CONFIG = CONFIG


__all__ = ["CONFIG", "APG_CONFIG"]