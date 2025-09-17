import random
import pickle
import itertools
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


def movielens_youtubednn_preprocess(input_path: Path, output_path: Path) -> dict:

    def build_youtubednn_feature_dict(raw_log_data_path: Path, dict_path: Path):
        """
        构建 YouTubeDNN 模型的特征字典。

        参数：
        config - 包含数据路径和配置信息的字典

        返回：
        无，直接将特征字典保存为 pickle 文件
        """

        # 读取原始日志数据
        data_df = pd.read_csv(raw_log_data_path)

        # 初始化特征字典
        feature_dict = {}

        # 构建 movieId 特征字典
        movie_id_counts = data_df["movieId"].value_counts()
        sorted_movie_ids = sorted(
            movie_id_counts.items(), key=lambda x: x[1], reverse=True
        )
        feature_dict["movieId"] = {
            k: i + 1 for i, (k, _) in enumerate(sorted_movie_ids)
        }

        # 构建 genres 特征字典
        genres_set = set()
        for genres in data_df["genres"]:
            genres_set.update(genres.split("|"))
        feature_dict["genres"] = {
            genre: i + 1 for i, genre in enumerate(sorted(genres_set))
        }

        # 构建 userId 特征字典
        feature_dict["userId"] = {
            uid: i + 1 for i, uid in enumerate(data_df["userId"].unique())
        }

        # 保存特征字典
        with open(dict_path, "wb") as f:
            pickle.dump(feature_dict, f)

        print(f"特征字典已成功保存至: {dict_path}")

    def merge_raw_data(ratings_path: Path, movies_path: Path, raw_log_data_path: Path):
        """拼接原始样本（用户日志+user和item的基础特征+其他特征）"""
        # 加载评分数据和电影数据
        ratings = pd.read_csv(ratings_path)
        movies = pd.read_csv(movies_path)
        # 合并数据，提取电影 ID 和类型
        data_df = ratings.merge(movies[["movieId", "genres"]], on="movieId", how="left")
        data_df.to_csv(raw_log_data_path, header=True, index=False)

    def generate_train_eval_samples(
        raw_log_data_path: Path, train_eval_sample_raw_path: Path
    ):
        """构造YouTubednn训练测试样本"""

        # 读取特征拼接后的日志表
        data_df = pd.read_csv(raw_log_data_path)
        data_df.sort_values("timestamp", inplace=True)
        train_data_list = []
        test_data_list = []
        for user_id, hist in tqdm(data_df.groupby("userId")):
            pos_list = hist["movieId"].tolist()
            genres_list = hist["genres"].tolist()
            if len(pos_list) < 2:
                continue

            # 最长的行为序列作为测试集
            # user_id, hist_movie_id_list, hist_genre_list, target_id, genres
            test_data_list.append(
                [
                    user_id,
                    pos_list[:-2],
                    genres_list[:-1],
                    pos_list[-1],
                    genres_list[-1],
                ]
            )

            # 因为样本量比较小，这里通过滑窗的形式构造训练集
            for i in range(1, len(pos_list) - 1):
                train_data_list.append(
                    [
                        user_id,
                        pos_list[:i],
                        genres_list[:i],
                        pos_list[i],
                        genres_list[i],
                    ]
                )

        train_sample_raw_dict = {"train": train_data_list, "test": test_data_list}
        with open(train_eval_sample_raw_path, "wb") as f:
            pickle.dump(train_sample_raw_dict, f)

    def preprocess_samples(
        train_eval_sample_raw_path: Path,
        train_eval_sample_final_path: Path,
        dict_path: Path,
        max_seq_len=50,
        max_genres_num=10,
        padding_value=0,
    ):
        """将样本中的特征都映射成索引，有数值特征的可以在这个阶段进行分桶"""
        # 读取特征映射辞典
        with open(dict_path, "rb") as f:
            feature_dict = pickle.load(f)

        # 读取原始训练样本
        with open(train_eval_sample_raw_path, "rb") as f:
            sample_dict = pickle.load(f)

        final_sample_dict = {}
        for name in ["train", "test"]:
            final_sample_dict[name] = {
                "user_id": [],
                "hist_movie_id_list": [],
                "hist_genre_id_list": [],
                "movie_id": [],
                "genre_id_list": [],  # genres 取top3
            }
            # TODO padding可以用现成的tf函数
            for (
                user_id,
                hist_movie_id_list,
                hist_genres,
                movie_id,
                genres_str,
            ) in sample_dict[name]:

                final_sample_dict[name]["user_id"].append(
                    feature_dict["userId"][user_id]
                )
                hist_movie_id_list = [
                    feature_dict["movieId"][x] for x in hist_movie_id_list
                ][:max_seq_len]
                # 改成padding左边
                # hist_movie_id_list += [padding_value] * (max_seq_len - len(hist_movie_id_list))
                hist_movie_id_list = [padding_value] * (
                    max_seq_len - len(hist_movie_id_list)
                ) + hist_movie_id_list
                final_sample_dict[name]["hist_movie_id_list"].append(hist_movie_id_list)
                hist_genres = [x.split("|") for x in hist_genres]
                hist_genres = list(itertools.chain(*hist_genres))[:max_seq_len]
                hist_genres = [feature_dict["genres"][x] for x in hist_genres]
                # hist_genres += [padding_value] * (max_seq_len - len(hist_genres))
                hist_genres = [padding_value] * (
                    max_seq_len - len(hist_genres)
                ) + hist_genres
                final_sample_dict[name]["hist_genre_id_list"].append(hist_genres)
                final_sample_dict[name]["movie_id"].append(
                    feature_dict["movieId"][movie_id]
                )
                genres = [feature_dict["genres"][x] for x in genres_str.split("|")][
                    :max_genres_num
                ]
                # genres += [padding_value] * (max_genres_num - len(genres))
                genres = [padding_value] * (max_genres_num - len(genres)) + genres
                final_sample_dict[name]["genre_id_list"].append(genres)

        # 将数据转换成np的格式
        final_sample_dict_ = {}
        for k, v in final_sample_dict.items():
            if k not in final_sample_dict_:
                final_sample_dict_[k] = {}
            for kk, vv in v.items():
                final_sample_dict_[k][kk] = np.array(vv)

        with open(train_eval_sample_final_path, "wb") as f:
            pickle.dump(final_sample_dict_, f)

    input_movie_path = input_path / "movies.csv"
    input_ratings_path = input_path / "ratings.csv"
    raw_log_data_path = output_path / "feature_dict" / "ml_latest_small_youtubednn.csv"
    train_eval_sample_raw_path = (
        output_path / "train_eval_sample_final" / "ml_latest_small_youtubednn.pkl"
    )
    train_eval_sample_final_path = (
        output_path / "train_eval_sample_final" / "ml_latest_small_youtubednn_final.pkl"
    )
    feature_dict_path = output_path / "feature_dict" / "ml_latest_small_youtubednn.pkl"

    if not raw_log_data_path.parent.exists():
        raw_log_data_path.parent.mkdir(parents=True)
    if not train_eval_sample_raw_path.parent.exists():
        train_eval_sample_raw_path.parent.mkdir(parents=True)
    if not feature_dict_path.parent.exists():
        feature_dict_path.parent.mkdir(parents=True)

    merge_raw_data(input_ratings_path, input_movie_path, raw_log_data_path)
    build_youtubednn_feature_dict(raw_log_data_path, feature_dict_path)
    generate_train_eval_samples(raw_log_data_path, train_eval_sample_raw_path)
    preprocess_samples(
        train_eval_sample_raw_path, train_eval_sample_final_path, feature_dict_path
    )

    # # 拼接基础日志表（日志数据+user+item+label）
    # print("日志表及原始特征拼接")
    # dataset.merge_raw_data()

    # # 特征工程（基于日志表构造user侧、item侧等特征）
    # print("构造原始训练样本")
    # dataset.generate_train_eval_samples()

    # # 生成特征词典 (id特征映射，数值特征分桶，注：item_id需要按照热度倒排)
    # print("生成特征辞典")
    # dataset.build_youtubednn_feature_dict()

    # # 特征映射，生成最终的训练样本
    # print("特征映射，生成最终用于模型训练的样本数据")
    # dataset.preprocess_samples(max_genres_num=10, padding_value=0)


def movielens_sequence_preprocess(input_path: Path, output_path: Path) -> dict:
    if not input_path.exists():
        # folder does not exist, throw error
        raise FileNotFoundError(f"Folder {input_path} not found")

    ratings_df = pd.read_csv(
        input_path / "ratings.dat",
        sep="::",
        names=["user_id", "movie_id", "rating", "unix_timestamp"],
    )
    ratings_df["unix_timestamp"] = ratings_df["unix_timestamp"].apply(lambda x: int(x))

    # 创建 LabelEncoder 对象

    label_encoder = LabelEncoder()
    ratings_df["movie_id_encode"] = (
        label_encoder.fit_transform(ratings_df["movie_id"]) + 1
    )
    ratings_df["movie_id"] = ratings_df["movie_id_encode"]
    ratings_df.drop(columns=["movie_id_encode"], inplace=True)

    # 字典
    feature_dict = {
        "user_id": ratings_df["user_id"].max() + 1,
        "item_id": ratings_df["movie_id"].max() + 1,
    }
    feature_dict_path = output_path / "feature_dict" / "ml-1m_sequence_feature_dict.pkl"
    if not feature_dict_path.parent.exists():
        feature_dict_path.parent.mkdir(parents=True)

    with open(feature_dict_path, "wb") as f:
        pickle.dump(feature_dict, f)

    def preprocess_data(movie_data_chunk):
        movie_info = []
        data = []

        for i in range(len(movie_data_chunk)):
            title = movie_data_chunk.iloc[i]["title"]
            genres = movie_data_chunk.iloc[i]["genres"]

            try:
                movies_text = ""
                genres_list = eval(genres)
                genre_names = ", ".join([genre["name"] for genre in genres_list])
                movies_text += "Genres: " + genre_names + "\n"
                movies_text += "Title: " + title + "\n"
                data.append(movies_text)
                movie_info.append((title, genre_names))

            except Exception as e:
                continue

        return data, movie_info

    # 序列按照时间降序排列
    ratings_group = ratings_df.sort_values(by=["unix_timestamp"]).groupby("user_id")

    user_ids = list(ratings_group.groups.keys())
    item_ids = list(ratings_group.movie_id.apply(list))
    ratings = list(ratings_group.rating.apply(list))
    timestamps = list(ratings_group.unix_timestamp.apply(list))

    # 生成训练和测试数据集
    train_data = {}
    test_data = {}
    for user_id, item_id_list, rating_list, timestamp_list in zip(
        user_ids, item_ids, ratings, timestamps
    ):
        # 长度小于3条全部用于训练
        if len(item_id_list) < 3:
            train_data[user_id] = {
                "item_ids": item_id_list,
                "ratings": rating_list,
                "timestamps": timestamp_list,
            }
        else:
            # 长度大于等于3条，取除最后一条外的所有数据作为训练集
            # 包含最后一条的样本作为测试样本
            train_data[user_id] = {
                "item_ids": item_id_list[:-1],
                "ratings": rating_list[:-1],
                "timestamps": timestamp_list[:-1],
            }
            test_data[user_id] = {
                "item_ids": item_id_list,
                "ratings": rating_list,
                "timestamps": timestamp_list,
            }

    def build_data_dict(
        data_df, total_item_id_set, max_seq_len=100, is_train=True, sample_num=100
    ):
        # 将数据集转换成模型需要的格式
        data_dict = {}
        user_ids = []
        seq_list = []
        pos_list = []
        rating_list = []
        timestamp_list = []
        label_list = []
        neg_sample_list = []

        for user_id, data in data_df.items():
            user_ids.append(user_id)
            item_ids = data["item_ids"]
            ratings = data["ratings"]
            timestamps = data["timestamps"]

            # 序列是按照时间从前到后排列，应该从后往前面取max_seq_len条数据
            pos = item_ids[-max_seq_len:]
            seq = item_ids[-max_seq_len - 1 : -1]
            rating = ratings[-max_seq_len - 1 : -1]
            timestamp = timestamps[-max_seq_len - 1 : -1]
            # 测试时的label, 训练时不要，随便填充一个值
            if is_train:
                label = 0
            else:
                # 测试时的label
                label = item_ids[-1]

            # padding左边
            pos = [0] * (max_seq_len - len(pos)) + pos
            seq = [0] * (max_seq_len - len(seq)) + seq
            rating = [0] * (max_seq_len - len(rating)) + rating
            timestamp = [0] * (max_seq_len - len(timestamp)) + timestamp

            # 模型评估时使用,测试时的pos_ids是随机采样100个没有交互的item_id
            neg_sample_set = total_item_id_set - set(item_ids)
            neg_sampling = np.random.choice(
                list(neg_sample_set), sample_num, replace=False
            ).tolist()
            # 第一个位置放label
            neg_sampling = [label] + neg_sampling

            # 训练数据
            seq_list.append(seq)
            pos_list.append(pos)
            rating_list.append(rating)
            timestamp_list.append(timestamp)
            # 测试时的label, 训练时不要
            label_list.append(label)
            neg_sample_list.append(neg_sampling)

        if is_train:
            data_dict = {
                "user_id": np.array(user_ids),
                "seq_ids": np.array(seq_list),
                "pos_ids": np.array(pos_list),
                "ratings": np.array(rating_list),
                "timestamps": np.array(timestamp_list),
                "neg_sample_ids": np.array(neg_sample_list),
            }
        else:
            # todo: 评估的时候需要随机采样100条用户没有交互的item_id，放到pos_ids中，推理出来计算指标
            data_dict = {
                "user_id": np.array(user_ids),
                "pos_ids": np.array(pos_list),
                "seq_ids": np.array(seq_list),
                "ratings": np.array(rating_list),
                "timestamps": np.array(timestamp_list),
                "neg_sample_ids": np.array(neg_sample_list),
                "label_list": np.array(label_list),
            }
        return data_dict

    max_seq_len = 200
    total_item_id_set = set(ratings_df["movie_id"].values)
    train_data_dict = build_data_dict(
        train_data, total_item_id_set, max_seq_len=max_seq_len
    )
    test_data_dict = build_data_dict(
        test_data, total_item_id_set, is_train=False, max_seq_len=max_seq_len
    )

    final_data_dict = {
        "train": train_data_dict,
        "test": test_data_dict,
    }

    final_data_dict_path = (
        output_path / "train_eval_sample_final" / "ml-1m_sequence_data_dict.pkl"
    )
    if not final_data_dict_path.parent.exists():
        final_data_dict_path.parent.mkdir(parents=True)

    with open(final_data_dict_path, "wb") as f:
        pickle.dump(final_data_dict, f)


from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.utils import simple_preprocess
from tqdm import tqdm
import logging

# 调整gensim日志输出
logging.getLogger("gensim").setLevel(logging.WARNING)


def movielens_dense_preprocess(input_path: Path, output_path: Path) -> dict:
    dim = 64
    if not input_path.exists():
        # 如果文件夹不存在，报错
        raise FileNotFoundError(f"Folder {input_path} not found")

    movie_df = pd.read_csv(
        input_path / "movies.dat",
        sep="::",
        names=["movie_id", "title", "genres"],
        encoding="ISO-8859-1",
    )
    movie_df["genres"] = movie_df["genres"].apply(lambda x: x.split("|"))
    movie_df["movie_text"] = (
        "Title: "
        + movie_df["title"].apply(lambda x: x.split("(")[0].strip()).values
        + "\nGenres: "
        + movie_df["genres"].apply(lambda x: ", ".join(x))
    )

    def train_doc2vec_model(tagged_data, num_epochs=10):
        doc2vec_model = Doc2Vec(vector_size=dim, min_count=2, epochs=num_epochs)
        doc2vec_model.build_vocab(tqdm(tagged_data, desc="Building Vocabulary"))
        for epoch in range(num_epochs):
            doc2vec_model.train(
                tqdm(tagged_data, desc=f"Epoch {epoch+1}"),
                total_examples=doc2vec_model.corpus_count,
                epochs=doc2vec_model.epochs,
            )

        return doc2vec_model

    complete_data = movie_df["movie_text"].values
    tagged_data = [
        TaggedDocument(words=simple_preprocess(doc), tags=[str(i)])
        for i, doc in enumerate(complete_data)
    ]
    doc2vec_model = train_doc2vec_model(tagged_data)

    document_vectors = np.array(
        [doc2vec_model.infer_vector(simple_preprocess(doc)) for doc in complete_data]
    )
    document_vectors = document_vectors / np.linalg.norm(
        document_vectors, axis=1, keepdims=True
    )

    dense_feature_df = movie_df[["movie_id"]].copy()
    dense_feature_df["dense_feature"] = list(document_vectors)

    # 如果文件夹不存在，创建文件夹
    dense_feature_path = output_path / "dense_feature" / "ml-1m_dense_feature.pkl"
    if not dense_feature_path.parent.exists():
        dense_feature_path.parent.mkdir(parents=True)
    pickle.dump(dense_feature_df, open(dense_feature_path, "wb"))


def movielens_recall_preprocess(input_path: Path, output_path: Path) -> dict:
    if not input_path.exists():
        # 如果文件夹不存在，报错
        raise FileNotFoundError(f"Folder {input_path} not found")

    ratings_df = pd.read_csv(
        input_path / "ratings.dat",
        sep="::",
        names=["user_id", "movie_id", "rating", "unix_timestamp"],
        encoding="ISO-8859-1",
    )
    user_df = pd.read_csv(
        input_path / "users.dat",
        sep="::",
        names=["user_id", "gender", "age", "occupation", "zip"],
        encoding="ISO-8859-1",
    )
    movie_df = pd.read_csv(
        input_path / "movies.dat",
        sep="::",
        names=["movie_id", "title", "genres"],
        encoding="ISO-8859-1",
    )

    sample_df = pd.merge(ratings_df, user_df, on="user_id", how="left")
    sample_df = pd.merge(sample_df, movie_df, on="movie_id", how="left")
    sample_df["rating"] = sample_df["rating"].apply(lambda x: int(x))
    sample_df["unix_timestamp"] = sample_df["unix_timestamp"].apply(lambda x: int(x))
    # 多个genres用|分隔，取第一个，方便后续处理序列特征
    sample_df["genres"] = sample_df["genres"].apply(lambda x: x.split("|")[0])
    del sample_df["title"]  # 删除title列，不太好处理

    feature_columns = [
        x for x in sample_df.columns.tolist() if x not in ["unix_timestamp", "rating"]
    ]
    # 创建 LabelEncoder 对象
    for feat_name in feature_columns:
        label_encoder = LabelEncoder()
        sample_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(sample_df[feat_name]) + 1
        )
        sample_df[feat_name] = sample_df[feat_name + "_encode"]
        del sample_df[feat_name + "_encode"]

    sample_df.reset_index(drop=True, inplace=True)

    feature_dict = {
        "user_id": sample_df["user_id"].max() + 1,
        "movie_id": sample_df["movie_id"].max() + 1,
        "gender": sample_df["gender"].max() + 1,
        "age": sample_df["age"].max() + 1,
        "occupation": sample_df["occupation"].max() + 1,
        "zip": sample_df["zip"].max() + 1,
        "genres": sample_df["genres"].max() + 1,
    }

    output_feature_dict_path = (
        output_path / "feature_dict" / "ml-1m_recall_feature_dict.pkl"
    )
    if not output_feature_dict_path.parent.exists():
        output_feature_dict_path.parent.mkdir(parents=True)

    with open(output_feature_dict_path, "wb") as f:
        pickle.dump(feature_dict, f)

    max_seq_len = 50
    user_min_sample = 10
    user_max_sample = 200

    user_id_name = "user_id"
    user_cols = ["age", "occupation", "zip"]
    item_cols = ["movie_id", "genres"]

    train_sample_list = []
    test_sample_list = []
    user_sample_cnt_dict = {}
    sample_feature_columns = (
        ["user_id", "age", "occupation", "zip"]
        + ["hist_movie_id", "hist_genres", "hist_len"]
        + ["movie_id", "genres"]
        + ["label"]
    )
    # 滑窗构造样本
    for user_id, hist_df in sample_df.groupby(user_id_name):
        # 过滤样本特别少的用户
        if len(hist_df) < user_min_sample:
            continue
        user_sample_list = []
        hist_df.reset_index(drop=True, inplace=True)
        first_row = hist_df.iloc[0]
        # 用户特征都是共享的
        user_feat_list = [first_row[col] for col in user_cols]
        item_seq_feature_list = [hist_df[col].values.tolist() for col in item_cols]
        # print(item_seq_feature_list)
        for i in range(1, len(hist_df)):
            i_item_feature_list = [seq[:i] for seq in item_seq_feature_list]
            pos_item_feature_list = [seq[i] for seq in item_seq_feature_list]
            # item侧每个特征都从后往前取max_seq_len条数据
            item_feature_sequence_list = [
                seq[::-1][:max_seq_len] for seq in i_item_feature_list
            ]
            hist_len = len(item_feature_sequence_list[0])

            # 对序列特征进行左侧padding至max_seq_len
            padded_item_feature_sequence_list = []
            for seq in item_feature_sequence_list:
                # 左侧padding 0至max_seq_len
                padded_seq = [0] * (max_seq_len - len(seq)) + seq
                padded_item_feature_sequence_list.append(padded_seq)

            sample = (
                [user_id]
                + user_feat_list
                + padded_item_feature_sequence_list
                + [hist_len]
                + pos_item_feature_list
                + [1]
            )
            user_sample_list.append(sample)
        test_sample_list.append(user_sample_list[-1])
        if user_max_sample > 0:
            user_sample_list = user_sample_list[:-1][::-1][
                :user_max_sample
            ]  # 限制每个用户最大样本数量
        user_sample_cnt_dict[user_id] = len(user_sample_list)
        train_sample_list.extend(user_sample_list[:-1])

    random.shuffle(train_sample_list)
    random.shuffle(test_sample_list)

    print(
        "每个用户平均样本量",
        sum(user_sample_cnt_dict.values()) / len(user_sample_cnt_dict),
    )
    print("用户最少样本量", min(user_sample_cnt_dict.values()))
    print("用户最多样本量", max(user_sample_cnt_dict.values()))

    print("train_sample_list:", len(train_sample_list))
    print("test_sample_list:", len(test_sample_list))

    train_sample_df = pd.DataFrame(train_sample_list, columns=sample_feature_columns)
    test_sample_df = pd.DataFrame(test_sample_list, columns=sample_feature_columns)

    total_sample_dict = {}
    for sample_type, sample_df in zip(
        ["train", "test"], [train_sample_df, test_sample_df]
    ):
        sample_dict = {}
        for col in sample_df.columns:
            sample_dict[col] = np.array(sample_df[col].values.tolist())
        total_sample_dict[sample_type] = sample_dict

    output_sample_path = (
        output_path / "train_eval_sample_final" / "ml-1m_recall_train_eval.pkl"
    )
    if not output_sample_path.parent.exists():
        output_sample_path.parent.mkdir(parents=True)

    with open(output_sample_path, "wb") as f:
        pickle.dump(total_sample_dict, f)


def movielens_recall_pos_neg_preprocess(input_path: Path, output_path: Path) -> dict:
    if not input_path.exists():
        # 如果文件夹不存在，报错
        raise FileNotFoundError(f"Folder {input_path} not found")

    ratings_df = pd.read_csv(
        input_path / "ratings.dat",
        sep="::",
        names=["user_id", "movie_id", "rating", "unix_timestamp"],
        encoding="ISO-8859-1",
    )
    user_df = pd.read_csv(
        input_path / "users.dat",
        sep="::",
        names=["user_id", "gender", "age", "occupation", "zip"],
        encoding="ISO-8859-1",
    )
    movie_df = pd.read_csv(
        input_path / "movies.dat",
        sep="::",
        names=["movie_id", "title", "genres"],
        encoding="ISO-8859-1",
    )

    sample_df = pd.merge(ratings_df, user_df, on="user_id", how="left")
    sample_df = pd.merge(sample_df, movie_df, on="movie_id", how="left")
    sample_df["rating"] = sample_df["rating"].apply(lambda x: int(x))
    sample_df["unix_timestamp"] = sample_df["unix_timestamp"].apply(lambda x: int(x))
    # 多个genres用|分隔，取第一个，方便后续处理序列特征
    sample_df["genres"] = sample_df["genres"].apply(lambda x: x.split("|")[0])
    del sample_df["title"]  # 删除title列，不太好处理

    feature_columns = [
        x for x in sample_df.columns.tolist() if x not in ["unix_timestamp", "rating"]
    ]
    # 创建 LabelEncoder 对象
    for feat_name in feature_columns:
        label_encoder = LabelEncoder()
        sample_df[feat_name + "_encode"] = (
            label_encoder.fit_transform(sample_df[feat_name]) + 1
        )
        sample_df[feat_name] = sample_df[feat_name + "_encode"]
        del sample_df[feat_name + "_encode"]

    sample_df.reset_index(drop=True, inplace=True)

    feature_dict = {
        "user_id": sample_df["user_id"].max() + 1,
        "movie_id": sample_df["movie_id"].max() + 1,
        "gender": sample_df["gender"].max() + 1,
        "age": sample_df["age"].max() + 1,
        "occupation": sample_df["occupation"].max() + 1,
        "zip": sample_df["zip"].max() + 1,
        "genres": sample_df["genres"].max() + 1,
    }
    output_feature_dict_path = (
        output_path / "feature_dict" / "ml-1m_recall_pos_neg_feature_dict.pkl"
    )
    if not output_feature_dict_path.parent.exists():
        output_feature_dict_path.parent.mkdir(parents=True)

    with open(output_feature_dict_path, "wb") as f:
        pickle.dump(feature_dict, f)

    max_seq_len = 50
    user_min_sample = 10
    user_max_sample = 200

    user_id_name = "user_id"
    user_cols = ["age", "occupation", "zip"]
    item_cols = ["movie_id", "genres"]

    train_sample_list = []
    test_sample_list = []
    user_sample_cnt_dict = {}
    sample_feature_columns = (
        ["user_id", "age", "occupation", "zip"]
        + ["hist_movie_id", "hist_genres", "hist_len"]
        + ["movie_id", "genres"]
        + ["label"]
    )
    # 滑窗构造样本
    for user_id, hist_df in sample_df.groupby(user_id_name):
        # 过滤样本特别少的用户
        if len(hist_df) < user_min_sample:
            continue
        user_sample_list = []
        hist_df.reset_index(drop=True, inplace=True)
        first_row = hist_df.iloc[0]
        # 用户特征都是共享的
        user_feat_list = [first_row[col] for col in user_cols]
        item_seq_feature_list = [hist_df[col].values.tolist() for col in item_cols]
        # print(item_seq_feature_list)
        for i in range(1, len(hist_df)):
            i_item_feature_list = [seq[:i] for seq in item_seq_feature_list]
            pos_item_feature_list = [seq[i] for seq in item_seq_feature_list]
            # item侧每个特征都从后往前取max_seq_len条数据
            item_feature_sequence_list = [
                seq[::-1][:max_seq_len] for seq in i_item_feature_list
            ]
            hist_len = len(item_feature_sequence_list[0])

            # 对序列特征进行左侧padding至max_seq_len
            padded_item_feature_sequence_list = []
            for seq in item_feature_sequence_list:
                # 左侧padding 0至max_seq_len
                padded_seq = [0] * (max_seq_len - len(seq)) + seq
                padded_item_feature_sequence_list.append(padded_seq)

            sample = (
                [user_id]
                + user_feat_list
                + padded_item_feature_sequence_list
                + [hist_len]
                + pos_item_feature_list
                + [1]
            )
            user_sample_list.append(sample)
        test_sample_list.append(user_sample_list[-1])
        if user_max_sample > 0:
            user_sample_list = user_sample_list[:-1][::-1][
                :user_max_sample
            ]  # 限制每个用户最大样本数量
        user_sample_cnt_dict[user_id] = len(user_sample_list)
        train_sample_list.extend(user_sample_list[:-1])

    random.shuffle(train_sample_list)
    random.shuffle(test_sample_list)

    print(
        "每个用户平均样本量",
        sum(user_sample_cnt_dict.values()) / len(user_sample_cnt_dict),
    )
    print("用户最少样本量", min(user_sample_cnt_dict.values()))
    print("用户最多样本量", max(user_sample_cnt_dict.values()))

    print("train_sample_list:", len(train_sample_list))
    print("test_sample_list:", len(test_sample_list))

    train_sample_df = pd.DataFrame(train_sample_list, columns=sample_feature_columns)
    test_sample_df = pd.DataFrame(test_sample_list, columns=sample_feature_columns)

    # 负采样

    # 正负样本比例
    neg_pos_ratio = 5

    # 构建movie_id 到 genre_id 的映射
    movie_id_to_genre_id_dict = {
        movie_id: genre_id
        for movie_id, genre_id in zip(sample_df["movie_id"], sample_df["genres"])
    }

    # repeat train_sample_df
    movie_id_set = set(train_sample_df["movie_id"])
    train_neg_sample_df = pd.concat([train_sample_df] * neg_pos_ratio)

    # sample from movie_id_set
    negative_movie_id_list = np.random.choice(
        list(movie_id_set), len(train_neg_sample_df), replace=True
    )
    train_neg_sample_df["movie_id"] = negative_movie_id_list
    train_neg_sample_df["label"] = 0
    train_neg_sample_df["genres"] = train_neg_sample_df["movie_id"].apply(
        lambda x: movie_id_to_genre_id_dict[x]
    )

    train_sample_df = pd.concat([train_sample_df, train_neg_sample_df]).reset_index(
        drop=True
    )

    total_sample_dict = {}
    for sample_type, sample_df in zip(
        ["train", "test"], [train_sample_df, test_sample_df]
    ):
        sample_dict = {}
        for col in sample_df.columns:
            sample_dict[col] = np.array(sample_df[col].values.tolist())
        total_sample_dict[sample_type] = sample_dict

    output_sample_path = (
        output_path / "train_eval_sample_final" / "ml-1m_recall_pos_neg_train_eval.pkl"
    )
    if not output_sample_path.parent.exists():
        output_sample_path.parent.mkdir(parents=True)

    with open(output_sample_path, "wb") as f:
        pickle.dump(total_sample_dict, f)


def movielens_classical_preprocess(
    input_path: Path, output_path: Path, rating_threshold: float = 4.0
) -> dict:
    """
    ml-latest-small数据预处理，用于经典推荐模型。

    Args:
        input_path: ml-latest-small目录路径，包含ratings.csv
        output_path: 输出目录路径
        rating_threshold: 正样本阈值

    Returns:
        包含train和test数据的字典
    """
    if not input_path.exists():
        raise FileNotFoundError(f"文件夹 {input_path} 不存在")

    ratings_file = input_path / "ratings.csv"
    if not ratings_file.exists():
        raise FileNotFoundError(f"ratings.csv 在 {input_path} 中未找到")

    # 加载ratings数据
    ratings = pd.read_csv(ratings_file, sep=",", encoding="utf-8")

    # 重命名列，保持一致
    if "userId" in ratings.columns:
        ratings = ratings.rename(columns={"userId": "user_id", "movieId": "item_id"})

    ratings = ratings[["user_id", "item_id", "rating"]]

    # 分割数据为训练和测试集
    train_data, test_data = train_test_split(ratings, test_size=0.2, random_state=42)

    # 根据评分阈值过滤 (转换为二元标签)
    train_data = train_data[train_data["rating"] >= rating_threshold].reset_index(
        drop=True
    )
    test_data = test_data[test_data["rating"] >= rating_threshold].reset_index(
        drop=True
    )

    # 添加二元标签用于经典模型
    train_data["label"] = 1
    test_data["label"] = 1

    # 格式化用于经典模型
    train_result = {
        "interactions": train_data,
        "features": [train_data["user_id"].values, train_data["item_id"].values],
        "labels": train_data["label"].values,
    }

    test_result = {
        "interactions": test_data,
        "features": [test_data["user_id"].values, test_data["item_id"].values],
        "labels": test_data["label"].values,
    }

    # 创建输出目录结构
    output_sample_path = (
        output_path / "train_eval_sample_final" / "ml_latest_small_classical.pkl"
    )
    if not output_sample_path.parent.exists():
        output_sample_path.parent.mkdir(parents=True)

    # 保存处理后的数据
    total_sample_dict = {"train": train_result, "test": test_result}

    with open(output_sample_path, "wb") as f:
        pickle.dump(total_sample_dict, f)

    return total_sample_dict
