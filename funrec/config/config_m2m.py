"""
配置文件: M2M_CONFIG

使用方式:
    from funrec.config.config_m2m import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_m2m.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_type": "neural",
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "pre_subsample_size_train": 100000,
        "pre_subsample_size_test": 100000,
        "task_names": [
            "is_click",
            "long_view",
            "is_like",
        ],
        "max_seq_len": 20,
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
                    "dnn",
                ],
            },
            {
                "name": "video_id",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "author_id",
                "group": [
                    "dnn",
                    "user",
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
                "name": "onehot_feat5",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat6",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat7",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat8",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat9",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat10",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat11",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat12",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat13",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat14",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat15",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat16",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "onehot_feat17",
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
            {
                "name": "show_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "show_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "play_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "play_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "play_duration",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "complete_play_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "complete_play_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "valid_play_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "valid_play_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "long_time_play_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "long_time_play_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "short_time_play_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "short_time_play_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "play_progress",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "comment_stay_duration",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "like_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "like_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "click_like_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "double_click_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_like_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_like_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "comment_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "comment_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "direct_comment_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "reply_comment_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "delete_comment_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "delete_comment_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "comment_like_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "comment_like_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "follow_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "follow_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_follow_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_follow_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "share_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "share_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "download_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "download_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "report_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "report_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "reduce_similar_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "reduce_similar_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "collect_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "collect_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_collect_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "cancel_collect_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "direct_comment_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "reply_comment_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "share_all_cnt",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "share_all_user_num",
                "group": [
                    "dnn",
                ],
            },
            {
                "name": "outsite_share_all_cnt",
                "group": [
                    "dnn",
                ],
            },
        ],
    },
    "training": {
        "build_function": "funrec.models.m2m.build_m2m_model",
        "model_params": {
            "task_names": [
                "is_click",
                "long_view",
                "is_like",
            ],
            "domain_group_name": "domain",
            "num_experts": 4,
            "view_dim": 32,
            "scenario_dim": 16,
            "meta_tower_depth": 3,
            "meta_unit_depth": 3,
            "meta_unit_shared": True,
            "activation": "leaky_relu",
            "dropout": 0.2,
            "l2_reg": 1e-05,
            "positon_agg_func": "concat",
            "pos_emb_trainable": True,
            "pos_initializer": "glorot_uniform",
            "sequence_pooling": "mean",
            "linear_logits": True,
        },
        "optimizer": "adam",
        "loss": [
            "binary_crossentropy",
            "binary_crossentropy",
            "binary_crossentropy",
        ],
        "metrics": [
            "binary_accuracy",
        ],
        "batch_size": 1024,
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
M2M_CONFIG = CONFIG


__all__ = ["CONFIG", "M2M_CONFIG"]