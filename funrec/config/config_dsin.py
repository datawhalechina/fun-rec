"""
配置文件: DSIN_CONFIG

使用方式:
    from funrec.config.config_dsin import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_dsin.yaml
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
        "pre_subsample_size": 50000,
        "dsin_session": {
            "sess_max_count": 5,
            "sess_max_len": 10,
            "session_feature_list": [
                "video_id",
            ],
        },
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
                "combiner": "mean",
                "max_len": 20,
            },
            {
                "name": "sess_0_video_id",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "max_len": 10,
            },
            {
                "name": "sess_1_video_id",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "max_len": 10,
            },
            {
                "name": "sess_2_video_id",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "max_len": 10,
            },
            {
                "name": "sess_3_video_id",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "max_len": 10,
            },
            {
                "name": "sess_4_video_id",
                "type": "varlen_sparse",
                "emb_name": "video_id",
                "group": [
                    "dnn",
                ],
                "max_len": 10,
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.dsin.build_dsin_model",
        "model_params": {
            "session_feature_list": [
                "video_id",
            ],
            "sess_max_count": 5,
            "sess_max_len": 10,
            "bias_encoding": True,
            "att_embedding_size": 8,
            "att_head_num": 2,
            "dnn_units": [
                128,
                64,
                1,
            ],
            "dropout_rate": 0.2,
            "l2_reg": "1e-6",
        },
        "optimizer": "adam",
        "loss": [
            "binary_crossentropy",
        ],
        "metrics": [
            "binary_accuracy",
        ],
        "batch_size": 512,
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
DSIN_CONFIG = CONFIG


__all__ = ["CONFIG", "DSIN_CONFIG"]