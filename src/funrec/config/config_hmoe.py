"""
配置文件: HMOE_CONFIG

使用方式:
    from funrec.config.config_hmoe import CONFIG
    config = CONFIG
"""

from typing import Dict, Any


# 配置来源: config_hmoe.yaml
CONFIG: Dict[str, Any] = {
    "data": {
        "dataset_type": "neural",
        "dataset_name": "kuairand_data",
    },
    "features": {
        "dataset_name": "kuairand_data",
        "emb_dim": 8,
        "task_names": [
            "is_click",
        ],
        "pre_subsample_size_train": 100000,
        "pre_subsample_size_test": 100000,
        "features": [
            {
                "name": "tab",
                "type": "dense",
                "dimension": 1,
                "group": [
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
        "build_function": "funrec.models.hmoe.build_hmoe_model",
        "model_params": {
            "num_domains": 5,
            "domain_feature_name": "tab",
            "share_gate": False,
            "share_domain_w": False,
            "shared_expert_nums": 5,
            "shared_expert_dnn_units": [
                256,
                128,
            ],
            "gate_dnn_units": [
                256,
                128,
            ],
            "domain_tower_units": [
                128,
                64,
            ],
            "domain_weight_units": [
                128,
                64,
            ],
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
        "subsample_size": 100000,
    },
    "evaluation": {
        "model_type": "ranking",
    },
}


# 为了向后兼容，也提供原始变量名
HMOE_CONFIG = CONFIG


__all__ = ["CONFIG", "HMOE_CONFIG"]