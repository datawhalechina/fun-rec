import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm


def preprocess(input_path: Path, output_path: Path) -> dict:
    # 论文数据集的简单归类
    FEATURE_INFO_MAP = {
        "icf": ["icf1", "icf2", "icf3", "icf4", "icf5"],
        "ucf": ["ucf1", "ufc2", "ucf3"],
        "iv": [
            "iv1",
            "iv2",
            "iv3",
            "iv4",
            "iv5",
            "iv6",
            "iv7",
            "iv8",
            "iv9",
            "iv10",
            "iv11",
            "iv12",
        ],
        "pv": ["pv1", "pv2", "pv3", "pv4", "pv5", "pv6", "pv7"],
        "iv+pv": [
            "iv1",
            "iv2",
            "iv3",
            "iv4",
            "iv5",
            "iv6",
            "iv7",
            "iv8",
            "iv9",
            "iv10",
            "iv11",
            "iv12",
            "pv1",
            "pv2",
            "pv3",
            "pv4",
            "pv5",
            "pv6",
            "pv7",
        ],
    }
    if not input_path.exists():
        raise FileNotFoundError(f"Input path {input_path} does not exist")

    print("加载数据...")
    train_path = input_path / "rec_train_set.sample.txt"
    valid_path = input_path / "rec_validation_set.sample.txt"
    test_path = input_path / "rec_test_set.sample.txt"

    print("将上述特征进行简单的猜测...")
    name_list = ["uid", "user_feats", "item_feats", "pv_emb", "item_emb", "label"]
    train_data_df = pd.read_csv(train_path, sep="|", names=name_list)
    train_data_df["type"] = ["train"] * len(train_data_df)
    valid_data_df = pd.read_csv(valid_path, sep="|", names=name_list)
    valid_data_df["type"] = ["valid"] * len(valid_data_df)
    test_data_df = pd.read_csv(test_path, sep="|", names=name_list)
    test_data_df["type"] = ["test"] * len(test_data_df)

    print("合并数据集...")
    data_df = pd.concat([train_data_df, valid_data_df, test_data_df], ignore_index=True)

    print("处理null...")
    for col_name in ["user_feats", "item_feats", "pv_emb", "item_emb", "label"]:
        data_df[col_name] = data_df[col_name].apply(
            lambda x: eval(x.replace("null", "0"))
        )

    data_df["label"] = data_df["label"].apply(lambda x: [int(a) for a in x])

    data_df["pv_emb"] = data_df["pv_emb"].apply(
        lambda x: [[float(val) for val in item] for item in x]
    )
    data_df["item_emb"] = data_df["item_emb"].apply(
        lambda x: [[float(val) for val in item] for item in x]
    )

    # 数据集中的特征除了uid和user_feats以外都是item 粒度的特征，由于是list-wise，所以特征都是序列的形式
    # list-wise的序列长度为：
    max_len = len(eval(test_data_df["label"].values[0]))
    # print(max_len)

    print("特征拆分...")
    user_features = data_df["user_feats"].values.tolist()
    user_feature_cnt = len(user_features[0])
    user_feature_name = [f"user_feat_{i}" for i in range(user_feature_cnt)]
    user_feature_dict = {}
    for i in range(user_feature_cnt):
        temp_user_feature = []
        for user_feat in user_features:
            temp_user_feature.append(user_feat[i])
        user_feature_dict[user_feature_name[i]] = temp_user_feature

    item_features = data_df["item_feats"].values.tolist()
    item_feature_cnt = len(item_features[0][0])
    item_feature_name = [f"item_feat_{i}" for i in range(item_feature_cnt)]
    item_feature_dict = {name: [] for name in item_feature_name}

    for one_item_features in item_features:
        for i in range(item_feature_cnt):
            temp_item_feature = [item_feat[i] for item_feat in one_item_features]
            item_feature_dict[item_feature_name[i]].append(temp_item_feature)

    for user_feat_name in user_feature_name:
        data_df[user_feat_name] = user_feature_dict[user_feat_name]
    for item_feat_name in item_feature_name:
        data_df[item_feat_name] = item_feature_dict[item_feat_name]

    del data_df["user_feats"]
    del data_df["item_feats"]

    feature_vocab_sizes = {}

    print("用户特征编码...")
    user_feature_columns = ["uid", "user_feat_0", "user_feat_1", "user_feat_2"]
    for feat_name in user_feature_columns:
        label_encoder = LabelEncoder()
        data_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(data_df[feat_name]) + 1
        )
        data_df[feat_name] = data_df[feat_name + "_encode"]
        del data_df[feat_name + "_encode"]
        feature_vocab_sizes[feat_name] = data_df[feat_name].max() + 1

    # item序列特征编码并计算max index
    item_feature_columns = [
        "item_feat_0",
        "item_feat_1",
        "item_feat_2",
        "item_feat_3",
        "item_feat_4",
    ]

    print("存储每个特征的词汇表大小（最大索引 + 1）的字典...")
    for feat_name in tqdm(
        item_feature_columns,
        total=len(item_feature_columns),
        desc="item序列特征编码并计算max index",
    ):
        label_encoder = LabelEncoder()
        # 展平列表以适应编码器
        all_values = []
        for value_list in data_df[feat_name]:
            all_values.extend(value_list)

        print(f"feat_name: {feat_name}, len of all_values: {len(all_values)}")

        # 对所有值拟合编码器
        label_encoder.fit(all_values)

        # 对列表中的每个元素应用编码
        data_df[feat_name] = data_df[feat_name].apply(
            lambda x: [label_encoder.transform([val])[0] + 1 for val in x]
        )

        # 计算词汇表大小（最大索引 + 1，再 +1 用于填充/未知标记）
        max_index = max(label_encoder.transform(label_encoder.classes_)) + 1
        feature_vocab_sizes[feat_name] = max_index + 1

        print(f"特征: {feat_name}, 词汇表大小: {feature_vocab_sizes[feat_name]}")

    # 可以在创建嵌入时使用feature_vocab_sizes字典
    print("\n特征词汇表大小:")
    for feat_name, vocab_size in feature_vocab_sizes.items():
        print(f"{feat_name}: {vocab_size}")

    print("保存特征词典...")
    save_path = output_path / "feature_dict" / "rerank_feature_dict.pkl"
    if not save_path.parent.exists():
        save_path.parent.mkdir(parents=True)

    with open(save_path, "wb") as f:
        pickle.dump(feature_vocab_sizes, f)

    # 将DataFrame转换为TF-适配的格式
    def prepare_for_tf(df):
        result = {}

        # 处理用户特征
        for feat in user_feature_columns:
            result[feat] = np.array(df[feat].tolist())

        # 处理物品特征
        for feat in item_feature_columns:
            result[feat] = np.array(df[feat].tolist(), dtype=np.int32)

        # 处理embedding
        pv_embs = np.array(
            [np.array(emb, dtype=np.float32) for emb in df["pv_emb"].tolist()]
        )
        item_embs = np.array(
            [np.array(emb, dtype=np.float32) for emb in df["item_emb"].tolist()]
        )
        result["pv_emb"] = pv_embs
        result["item_emb"] = item_embs

        # 处理label
        labels = np.array([np.array(l, dtype=np.float32) for l in df["label"].tolist()])
        result["label"] = labels

        return result

    # 按类型分割数据并转换
    train_df = data_df[data_df["type"] == "train"]
    valid_df = data_df[data_df["type"] == "valid"]
    test_df = data_df[data_df["type"] == "test"]

    train_data = prepare_for_tf(train_df)
    valid_data = prepare_for_tf(valid_df)
    test_data = prepare_for_tf(test_df)

    final_data_dict = {"train": train_data, "valid": valid_data, "test": test_data}

    save_path = output_path / "train_eval_sample_final" / "rerank_data.pkl"
    if not save_path.parent.exists():
        save_path.parent.mkdir(parents=True)

    with open(save_path, "wb") as f:
        pickle.dump(final_data_dict, f)
