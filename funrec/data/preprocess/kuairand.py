import pickle
from datetime import datetime
from pathlib import Path


import pandas as pd
import numpy as np
from tqdm import tqdm
from sklearn.preprocessing import LabelEncoder


def preprocess(input_path: Path, output_path: Path) -> dict:
    print("加载数据...")

    # 日志数据的选择：
    # 包同一用户在之前两周内的所有交互（2022.04.08 ~ 2022.04.21）
    log_df = pd.read_csv(input_path / "data" / "log_standard_4_22_to_5_08_1k.csv")

    # 用户基础特征
    user_features = pd.read_csv(input_path / "data" / "user_features_1k.csv")

    # 视频基础特征
    video_features_basic = pd.read_csv(
        input_path / "data" / "video_features_basic_1k.csv"
    )

    # 视频统计特征
    video_features_statistics = pd.read_csv(
        input_path / "data" / "video_features_statistic_1k.csv"
    )

    log_colmns = [
        "user_id",
        "video_id",
        "date",
        "hourmin",
        "time_ms",
        "is_click",
        "is_like",
        "is_follow",
        "is_comment",
        "is_forward",
        "is_hate",
        "long_view",
        "play_time_ms",
        "duration_ms",
        "profile_stay_time",
        "comment_stay_time",
        "is_profile_enter",
        "is_rand",
        "tab",
    ]

    select_log_columns = [
        "user_id",
        "video_id",
        "date",
        "time_ms",
        "is_click",
        "is_like",
        "is_follow",
        "is_comment",
        "is_forward",
        "is_hate",
        "long_view",
        "is_profile_enter",
        "tab",
    ]
    new_log_df = log_df[select_log_columns]

    print("处理用户特征...")
    user_feature_columns = [
        "user_id",
        "user_active_degree",
        "is_lowactive_period",
        "is_live_streamer",
        "is_video_author",
        "follow_user_num",
        "follow_user_num_range",
        "fans_user_num",
        "fans_user_num_range",
        "friend_user_num",
        "friend_user_num_range",
        "register_days",
        "register_days_range",
        "onehot_feat0",
        "onehot_feat1",
        "onehot_feat2",
        "onehot_feat3",
        "onehot_feat4",
        "onehot_feat5",
        "onehot_feat6",
        "onehot_feat7",
        "onehot_feat8",
        "onehot_feat9",
        "onehot_feat10",
        "onehot_feat11",
        "onehot_feat12",
        "onehot_feat13",
        "onehot_feat14",
        "onehot_feat15",
        "onehot_feat16",
        "onehot_feat17",
    ]

    # 当前数据集中is_lowactive_period特征取值都是相同的，该特征不考虑使用
    user_sparse_feature_columns = [
        "user_id",
        "user_active_degree",
        "is_live_streamer",
        "is_video_author",
        "follow_user_num_range",
        "fans_user_num_range",
        "friend_user_num_range",
        "register_days_range",
        "onehot_feat0",
        "onehot_feat1",
        "onehot_feat2",
        "onehot_feat3",
        "onehot_feat4",
        "onehot_feat5",
        "onehot_feat6",
        "onehot_feat7",
        "onehot_feat8",
        "onehot_feat9",
        "onehot_feat10",
        "onehot_feat11",
        "onehot_feat12",
        "onehot_feat13",
        "onehot_feat14",
        "onehot_feat15",
        "onehot_feat16",
        "onehot_feat17",
    ]
    # sparse_feature中已经有了对于dense特征的分桶，可以不考虑使用如下dense特征
    user_dense_feature_columns = [
        "follow_user_num",
        "fans_user_num",
        "friend_user_num",
        "register_days",
    ]
    new_user_feature_df = user_features[user_sparse_feature_columns]

    # is_live_streamer特征中的-124不确定是什么含义，和另一个特征1比较来看，暂时将其转换成0
    new_user_feature_df["is_live_streamer"] = new_user_feature_df[
        "is_live_streamer"
    ].apply(lambda x: 0 if x == -124 else x)

    # 字符串特征需要映射成词典
    user_label_encode_feature_columns = [
        "user_id",
        "user_active_degree",
        "follow_user_num_range",
        "fans_user_num_range",
        "friend_user_num_range",
        "register_days_range",
    ]

    # 创建 LabelEncoder 对象

    label_encoder = LabelEncoder()
    for feat_name in user_label_encode_feature_columns:
        label_encoder = LabelEncoder()
        new_user_feature_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(new_user_feature_df[feat_name]) + 1
        )
        if feat_name not in ("user_id"):
            new_user_feature_df[feat_name] = new_user_feature_df[feat_name + "_encode"]
            del new_user_feature_df[feat_name + "_encode"]

    # onehot_feat中对nan填充为这列特征的max值加1
    onehot_feat_columns = [x for x in user_sparse_feature_columns if "onehot_" in x]
    for feat_name in onehot_feat_columns:
        max_val = new_user_feature_df[feat_name].max()
        new_user_feature_df[feat_name].fillna(value=max_val + 1, inplace=True)
        new_user_feature_df[feat_name] = new_user_feature_df[feat_name].astype(int)

    print("处理视频基础特征...")
    video_basic_feature_columns = [
        "video_id",
        "author_id",
        "video_type",
        "upload_dt",
        "upload_type",
        "visible_status",
        "video_duration",
        "server_width",
        "server_height",
        "music_id",
        "music_type",
        "tag",
    ]

    # 为了特征工程方便，upload_dt， video_duration，server_width，server_height 这几个特征不做处理
    select_video_basic_feature_columns = [
        "video_id",
        "author_id",
        "video_type",
        "upload_type",
        "visible_status",
        "music_id",
        "music_type",
        "tag",
    ]

    new_video_features_basic_df = video_features_basic[
        select_video_basic_feature_columns
    ]

    # 将visible_status 和 music_type 从float类型转成int
    for feat_name in ["visible_status", "music_type"]:
        max_val = new_video_features_basic_df[feat_name].max()
        new_video_features_basic_df[feat_name].fillna(value=max_val + 1, inplace=True)
        new_video_features_basic_df[feat_name] = new_video_features_basic_df[
            feat_name
        ].astype(int)

    # 将sparse特征做类别编码,tag是一个list，需要单独处理
    video_sparse_feature_columns = [
        x for x in select_video_basic_feature_columns if x not in ("tag")
    ]

    # 创建 LabelEncoder 对象
    label_encoder = LabelEncoder()
    for feat_name in video_sparse_feature_columns:
        label_encoder = LabelEncoder()
        new_video_features_basic_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(new_video_features_basic_df[feat_name]) + 1
        )
        if feat_name not in ("video_id"):
            new_video_features_basic_df[feat_name] = new_video_features_basic_df[
                feat_name + "_encode"
            ]
            del new_video_features_basic_df[feat_name + "_encode"]

    # 先填充默认值
    new_video_features_basic_df["tag"].fillna(value="-1", inplace=True)
    tag_set = set([])
    for x in new_video_features_basic_df["tag"].values:
        tag_list = x.split(",")
        for tag in tag_list:
            tag_set.add(tag)
    tag_map_dict = {}
    for i, tag in zip(range(len(tag_set)), tag_set):
        tag_map_dict[tag] = i + 1
    new_video_features_basic_df["tag"] = new_video_features_basic_df["tag"].apply(
        lambda x: [tag_map_dict[tag] for tag in x.split(",")]
    )

    print("处理视频统计特征...")
    video_features_statistics_columns = [
        "video_id",
        "counts",
        "show_cnt",
        "show_user_num",
        "play_cnt",
        "play_user_num",
        "play_duration",
        "complete_play_cnt",
        "complete_play_user_num",
        "valid_play_cnt",
        "valid_play_user_num",
        "long_time_play_cnt",
        "long_time_play_user_num",
        "short_time_play_cnt",
        "short_time_play_user_num",
        "play_progress",
        "comment_stay_duration",
        "like_cnt",
        "like_user_num",
        "click_like_cnt",
        "double_click_cnt",
        "cancel_like_cnt",
        "cancel_like_user_num",
        "comment_cnt",
        "comment_user_num",
        "direct_comment_cnt",
        "reply_comment_cnt",
        "delete_comment_cnt",
        "delete_comment_user_num",
        "comment_like_cnt",
        "comment_like_user_num",
        "follow_cnt",
        "follow_user_num",
        "cancel_follow_cnt",
        "cancel_follow_user_num",
        "share_cnt",
        "share_user_num",
        "download_cnt",
        "download_user_num",
        "report_cnt",
        "report_user_num",
        "reduce_similar_cnt",
        "reduce_similar_user_num",
        "collect_cnt",
        "collect_user_num",
        "cancel_collect_cnt",
        "cancel_collect_user_num",
        "direct_comment_user_num",
        "reply_comment_user_num",
        "share_all_cnt",
        "share_all_user_num",
        "outsite_share_all_cnt",
    ]

    # 对于视频的统计特征，都统计和label表拼接后，做等频分桶，每个特征分为10个桶
    # counts不是很清楚什么意思，暂时不用
    video_dense_feature_columns = [
        x for x in video_features_statistics_columns if x not in ("video_id", "counts")
    ]
    new_video_features_statistics_df = video_features_statistics[
        ["video_id"] + video_dense_feature_columns
    ]

    # 缺失值都填充0
    for feat_name in video_dense_feature_columns:
        new_video_features_statistics_df[feat_name].fillna(value=0.0, inplace=True)

    print("合并特征...")
    df_merged = new_log_df.merge(new_user_feature_df, on="user_id", how="left")
    df_merged = df_merged.merge(new_video_features_basic_df, on="video_id", how="left")
    df_merged = df_merged.merge(
        new_video_features_statistics_df, on="video_id", how="left"
    )

    # 删除原始的user_id和video_id
    df_merged["user_id"] = df_merged["user_id_encode"]
    df_merged["video_id"] = df_merged["video_id_encode"]
    del df_merged["user_id_encode"]
    del df_merged["video_id_encode"]

    # 填充默认值为0
    df_merged["tag"] = df_merged["tag"].apply(lambda x: [0] if np.isnan(x).any() else x)
    # tag最多保留1个, 视频tag数量并不多，多数是1-2个
    df_merged["tag"] = df_merged["tag"].apply(lambda x: x[0])
    df_merged.fillna(value=0, inplace=True)

    # 数值特征分桶
    for feat_name in tqdm(video_dense_feature_columns):
        df_merged[feat_name + "_binned"] = pd.qcut(
            df_merged[feat_name], q=10, labels=False, duplicates="drop"
        )
        df_merged[feat_name] = df_merged[feat_name + "_binned"]
        del df_merged[feat_name + "_binned"]

    # 将所有的数据类型都转换成int
    columns = [x for x in df_merged.columns if x != "tag"]
    for feat_name in columns:
        df_merged[feat_name] = df_merged[feat_name].astype(int)

    # df_merged['tab'].value_counts()
    # 保留主场景的样本
    main_tab_set = set([1, 0, 4, 2, 6])
    df_merged = df_merged[df_merged["tab"].isin(main_tab_set)]

    # 将tab处理成连续的值，方便多场景代码遍历使用
    label_encoder = LabelEncoder()
    feat_name = "tab"
    df_merged[feat_name + "_encode"] = label_encoder.fit_transform(df_merged[feat_name])

    df_merged[feat_name] = df_merged[feat_name + "_encode"]
    del df_merged[feat_name + "_encode"]

    print("计算每个用户在每个日期点击的最后k个视频id，基于当前日期之前的点击...")

    def convert_date(date: int):
        date_str = str(date)
        year = date_str[:4]
        month = date_str[4:6]
        day = date_str[6:]
        return datetime(int(year), int(month), int(day))

    def compute_last_k_clicked_history(
        df: pd.DataFrame, k: int = 20, pad_value: int = 0
    ) -> pd.DataFrame:
        """
        计算每个用户在每个日期点击的最后k个视频id，基于当前日期之前的点击

        Args:
            df (pd.DataFrame): 输入的DataFrame，包含列['user_id', 'video_id', 'date', 'time_ms', 'is_click']
            k (int): 要获取的最后点击的个数
            pad_value (int): 用于填充较短序列的值

        Returns:
            pd.DataFrame: 包含'last_k_clicked_items'列的原始数据
        """
        if not all(
            col in df.columns
            for col in ["user_id", "video_id", "date", "time_ms", "is_click"]
        ):
            raise ValueError(
                "输入的DataFrame必须包含列: 'user_id', 'video_id', 'date', 'time_ms', 'is_click'"
            )

        if k <= 0:
            df["last_k_clicked_items"] = [[] for _ in range(len(df))]
            return df

        # 1. 准备数据
        df_processed = df.copy()
        # 确保'date'是datetime类型，并去除时间组件以便按天分组
        df_processed["date"] = df_processed["date"].apply(lambda x: convert_date(x))
        # 确保'is_click'是布尔类型
        df_processed["is_click"] = df_processed["is_click"].astype(bool)
        # 按用户、日期和时间排序，以便按顺序处理
        df_processed = df_processed.sort_values(
            by=["user_id", "date", "time_ms"], ascending=True
        )
        df_processed.reset_index(drop=True, inplace=True)  # 排序后重置索引

        # 2. 过滤点击数据
        clicked_df = df_processed[df_processed["is_click"]].copy()

        if clicked_df.empty:
            # 如果没有任何点击，返回一个包含pad_value的列表
            print("Warning: No click interactions found in the data.")
            df_processed["last_k_clicked_items"] = [[pad_value] * k] * len(df_processed)
            return df_processed

        # 3. 按用户和日期聚合点击数据
        # 将点击的video_ids聚合为每个用户在每个特定日期的列表
        daily_clicks = (
            clicked_df.groupby(["user_id", "date"])["video_id"]
            .apply(list)
            .reset_index()
        )
        daily_clicks = daily_clicks.sort_values(
            by=["user_id", "date"]
        )  # 确保按用户和日期排序以便cumsum/shift

        # 4. 计算累积历史（将每个用户的每日列表连接起来）
        # 结果是用户在当天结束时的完整点击列表
        daily_clicks["cumulative_history"] = daily_clicks.groupby("user_id")[
            "video_id"
        ].transform(lambda s: s.cumsum())

        # 5. 移动点击历史
        # 在每个用户组内移动历史，获取所有*前一天*的历史
        # 第一个用户点击的日期历史将变为NaN
        daily_clicks["prev_days_history"] = daily_clicks.groupby("user_id")[
            "cumulative_history"
        ].shift(1)

        # 替换可能的NaN（对于第一天）为空列表
        daily_clicks["prev_days_history"] = daily_clicks["prev_days_history"].apply(
            lambda x: x if isinstance(x, list) else []
        )

        # --- 将点击历史回传到原始数据 ---

        # 6. 创建一个点击历史映射（选择相关列）
        history_map = daily_clicks[["user_id", "date", "prev_days_history"]]

        # 7. 将历史合并到原始数据（使用处理后的df）
        # 基于用户和日期合并计算的*前一天*历史。
        # 这仅将历史分配给点击发生时的用户/日期行。
        df_processed = pd.merge(
            df_processed, history_map, on=["user_id", "date"], how="left"
        )

        # 8. 传播历史（向前填充）
        # 再次排序以确保在用户组内按顺序工作
        df_processed = df_processed.sort_values(
            by=["user_id", "date", "time_ms"], ascending=True
        )

        # 在每个用户组内向前填充历史。这传播了最后一个已知的前一天的历史到后续交互（包括非点击）
        # 这避免了用户第一天点击后，第二天不点击后，第三天last_k_clicked_items将为空的情况
        df_processed["propagated_history"] = df_processed.groupby("user_id")[
            "prev_days_history"
        ].ffill()

        # 填充任何剩余的NaN（从未有过点击的用户）
        # 使用空列表填充
        df_processed["propagated_history"] = df_processed["propagated_history"].apply(
            lambda x: x if isinstance(x, list) else []
        )

        # 9. 填充和截断
        def pad_and_truncate(history_list: list, target_k: int, pad_val: int) -> list:
            """
            取一个列表，保留最后k个元素，左填充到长度k
            """
            # 取列表的最后k个元素
            last_k = history_list[-target_k:]
            # 计算需要填充的长度
            len_last_k = len(last_k)
            pad_len = target_k - len_last_k
            # 返回填充后的列表
            return ([pad_val] * pad_len) + last_k

        df_processed["last_k_clicked_items"] = df_processed["propagated_history"].apply(
            lambda hist: pad_and_truncate(hist, k, pad_value)
        )

        # 清理不需要的列并返回
        return df_processed.drop(columns=["prev_days_history", "propagated_history"])

    max_video_id = df_merged["video_id"].max()
    df_merged_with_last_k_clicked_items = compute_last_k_clicked_history(
        df_merged[["user_id", "video_id", "date", "time_ms", "is_click"]],
        pad_value=0,  # 填充的值为0
    )

    # assert user video pairs on the same date have the same last_k_clicked_items, note that the last_k_clicked_items is a list
    # 检查每个用户和日期下的last_k_clicked_items列表是否相同
    def check_identical_sequences(group):
        # 将第一个序列转换为集合用于比较
        first_sequence = set(group.iloc[0])
        # 检查其他序列是否与第一个序列相同
        return all(set(seq) == first_sequence for seq in group)

    # 按用户和日期分组，然后检查每个组内的序列是否相同
    group_results = df_merged_with_last_k_clicked_items.groupby(["user_id", "date"])[
        "last_k_clicked_items"
    ].apply(check_identical_sequences)

    # 找到不匹配的组
    mismatched_groups = group_results[~group_results].index.tolist()

    # 断言并提供详细的错误信息，如果存在不匹配的序列
    assert (
        len(mismatched_groups) == 0
    ), f"Found mismatched sequences for the following user-date pairs: {mismatched_groups}"

    # 将last_k_clicked_items添加到df_merged
    df_merged["last_k_clicked_items"] = list(
        df_merged_with_last_k_clicked_items["last_k_clicked_items"].values
    )

    print("计算会话id...")

    def compute_session_id(
        df: pd.DataFrame, time_threshold_minutes: int = 30
    ) -> pd.DataFrame:
        """
        根据用户活动间隙计算每个交互的会话ID。

        如果用户连续两次交互的时间间隔超过`time_threshold_minutes`，则认为一个新的会话开始。

        Args:
            df (pd.DataFrame): 输入的DataFrame，包含列['user_id', 'time_ms', ...]。必须包含至少
                            user_id 和 time_ms.
            time_threshold_minutes (int): 会话开始前的最大空闲时间，以分钟为单位。默认30分钟

        Returns:
            pd.DataFrame: 原始的DataFrame，包含一个添加的列'session_id'。
        """
        if not all(col in df.columns for col in ["user_id", "time_ms"]):
            raise ValueError("输入的DataFrame必须包含列: 'user_id', 'time_ms'")
        if df.empty:
            df["session_id"] = pd.Series(dtype="str")  # 如果df为空，添加一个空列
            return df

        df_processed = df.copy()

        # 确保time_ms是数值类型
        df_processed["time_ms"] = pd.to_numeric(df_processed["time_ms"])

        # 1. 按用户和时间排序
        df_processed = df_processed.sort_values(
            by=["user_id", "time_ms"], ascending=True
        )
        df_processed.reset_index(drop=True, inplace=True)  # 排序后重置索引

        # 将阈值转换为毫秒
        time_threshold_ms = time_threshold_minutes * 60 * 1000

        # 2. 计算前一个交互的时间差
        # Shift time_ms 和 user_id 以便与前一行比较
        prev_time_ms = df_processed.groupby("user_id")["time_ms"].shift(1)
        time_diff_ms = df_processed["time_ms"] - prev_time_ms

        # 3. 识别会话断开
        # 如果：
        # a) 它是用户的第一个交互（prev_time_ms是NaN）
        # b) 时间差超过阈值
        # groupby().shift()正确处理用户边界（第一个交互得到NaN）
        is_new_session = (time_diff_ms > time_threshold_ms) | (prev_time_ms.isna())

        # 4. 使用cumsum()分配数值会话ID
        # cumsum()在'is_new_session'为True时递增
        session_numeric_id = is_new_session.cumsum()

        # 5. 创建一个唯一的会话标识符字符串（推荐）
        # 结合user_id和数值会话ID确保全局唯一性
        session_ids = (
            df_processed["user_id"].astype(str) + "_" + session_numeric_id.astype(str)
        )

        return session_ids

    df_merged = df_merged.reset_index(drop=True)
    df_merged["session_id"] = compute_session_id(df_merged[["user_id", "time_ms"]])

    print("生成特征词典...")
    not_feat_dict_columns = [
        "date",
        "time_ms",
        "is_click",
        "is_like",
        "is_follow",
        "is_comment",
        "is_forward",
        "is_hate",
        "long_view",
        "is_profile_enter",
        "session_id",
        "last_k_clicked_items",
    ]
    total_columns = [
        x for x in list(df_merged.columns) if x not in not_feat_dict_columns
    ]

    # 生成每个特征的词典大小
    final_feature_dict = {}
    for feat_name in total_columns:
        final_feature_dict[feat_name] = df_merged[feat_name].max() + 1

    save_path = output_path / "feature_dict" / "kuairand_feature_dict.pkl"
    if not save_path.parent.exists():
        save_path.parent.mkdir(parents=True)

    with open(save_path, "wb") as f:
        pickle.dump(final_feature_dict, f)

    print("划分训练和测试集...")
    test_df = df_merged[df_merged["date"] == 20220508]
    train_df = df_merged[df_merged["date"] != 20220508]
    del train_df["date"]
    del test_df["date"]
    del train_df["time_ms"]
    del test_df["time_ms"]

    print("保存训练和测试集...")
    # # 保存一份csv
    # train_df.to_csv("../src/tmp/train_eval_sample_raw/kuairand_1k_train.csv", index=False, header=True)
    # test_df.to_csv("../src/tmp/train_eval_sample_raw/kuairand_1k_test.csv", index=False, header=True)

    # 将csv转成字典的形式
    train_eval_dict = {}
    for data_type, data_df in zip(["train", "test"], [train_df, test_df]):
        train_eval_dict[data_type] = {}
        for feat_name in data_df.columns:
            if feat_name not in ("last_k_clicked_items"):
                train_eval_dict[data_type][feat_name] = np.array(
                    data_df[feat_name].values
                )
            else:
                # last_k_clicked_items是一个list，需要转换成numpy array
                train_eval_dict[data_type][feat_name] = np.array(
                    [np.array(x) for x in data_df[feat_name].values]
                )

    save_path = output_path / "train_eval_sample_final" / "kuairand_train_eval.pkl"
    if not save_path.parent.exists():
        save_path.parent.mkdir(parents=True)

    with open(save_path, "wb") as f:
        pickle.dump(train_eval_dict, f)
