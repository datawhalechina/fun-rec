import os
import numpy as np
import pickle
from sklearn.preprocessing import LabelEncoder

# 从utils里面导入函数
from examples.preprocess import gen_data_set, gen_model_input, gen_sdm_model_input, gen_sdm_data_set
from examples.utils import train_mind_model, get_embeddings, get_recall_res, train_sdm_model


def sdm_recall(data, topk=200, embedding_dim=32, SEQ_LEN_short=5, SEQ_LEN_prefer=50,
               batch_size=64, epochs=1, verbose=1, validation_split=0.0):
    """通过SDM模型，计算用户向量和文章向量
    param: data: 用户日志数据
    topk: 对于每个用户，召回多少篇文章
    """
    user_id_raw = data[['user_id']].drop_duplicates('user_id')
    doc_id_raw = data[['article_id']].drop_duplicates('article_id')

    # 类别数据编码
    base_features = ['user_id', 'article_id', 'city', 'age', 'gender', 'cat_1', 'cat_2']
    feature_max_idx = {}
    for f in base_features:
        lbe = LabelEncoder()
        data[f] = lbe.fit_transform(data[f]) + 1
        feature_max_idx[f] = data[f].max() + 1

    # 构建用户id词典和doc的id词典，方便从用户idx找到原始的id
    user_id_enc = data[['user_id']].drop_duplicates('user_id')
    doc_id_enc = data[['article_id']].drop_duplicates('article_id')
    user_idx_2_rawid = dict(zip(user_id_enc['user_id'], user_id_raw['user_id']))
    doc_idx_2_rawid = dict(zip(doc_id_enc['article_id'], doc_id_raw['article_id']))

    user_profile = data[['user_id', 'gender', 'age', 'city']].drop_duplicates('user_id')
    item_profile = data[['article_id']].drop_duplicates('article_id')
    user_profile.set_index('user_id', inplace=True)

    train_set, test_set = gen_sdm_data_set(data, seq_short_len=SEQ_LEN_short, seq_prefer_len=SEQ_LEN_prefer)

    train_model_input, train_label = gen_sdm_model_input(train_set, user_profile, SEQ_LEN_short, SEQ_LEN_prefer)
    test_model_input, test_label = gen_sdm_model_input(test_set, user_profile, SEQ_LEN_short, SEQ_LEN_prefer)

    # 构建模型并完成训练
    model = train_sdm_model(train_model_input, train_label, embedding_dim, feature_max_idx, SEQ_LEN_short,
                            SEQ_LEN_prefer, batch_size, epochs, verbose, validation_split)

    # 获得用户embedding和doc的embedding， 并进行保存
    user_embs, doc_embs = get_embeddings(model, test_model_input, user_idx_2_rawid, doc_idx_2_rawid)

    # 对每个用户，拿到召回结果并返回回来
    user_recall_items_dict = get_recall_res(user_embs, doc_embs, user_idx_2_rawid, doc_idx_2_rawid, topk)

    return user_recall_items_dict


def mind_recall(data, topk=200, embedding_dim=8, his_seq_maxlen=50, negsample=0,
                batch_size=64, epochs=1, verbose=1, validation_split=0.0):
    """通过MIND模型，计算用户向量和文章向量
    param: data: 用户日志数据
    topk: 对于每个用户，召回多少篇文章
    """
    user_id_raw = data[['user_id']].drop_duplicates('user_id')
    doc_id_raw = data[['article_id']].drop_duplicates('article_id')

    # 类别数据编码
    base_features = ['user_id', 'article_id', 'city', 'age', 'gender']
    feature_max_idx = {}
    for f in base_features:
        lbe = LabelEncoder()
        data[f] = lbe.fit_transform(data[f])
        feature_max_idx[f] = data[f].max() + 1

    # 构建用户id词典和doc的id词典，方便从用户idx找到原始的id
    user_id_enc = data[['user_id']].drop_duplicates('user_id')
    doc_id_enc = data[['article_id']].drop_duplicates('article_id')
    user_idx_2_rawid = dict(zip(user_id_enc['user_id'], user_id_raw['user_id']))
    doc_idx_2_rawid = dict(zip(doc_id_enc['article_id'], doc_id_raw['article_id']))

    # 保存下每篇文章的被点击数量， 方便后面高热文章的打压
    doc_clicked_count_df = data.groupby('article_id')['click'].apply(lambda x: x.count()).reset_index()
    doc_clicked_count_dict = dict(zip(doc_clicked_count_df['article_id'], doc_clicked_count_df['click']))

    if os.path.exists('data/train_model_input.pkl'):
        train_model_input = pickle.load(open('data/train_model_input.pkl', 'rb'))
        train_label = np.load('data/train_label.npy')
        test_model_input = pickle.load(open('data/test_model_input.pkl', 'rb'))
        test_label = np.load('data/test_label.npy')
    else:
        train_set, test_set = gen_data_set(data, doc_clicked_count_dict, negsample, control_users=False)

        # 构造MIND模型的输入
        train_model_input, train_label = gen_model_input(train_set, his_seq_maxlen)
        test_model_input, test_label = gen_model_input(test_set, his_seq_maxlen)

        # 保存一份输入直接，要不然每次都得这么构造输入太慢了
        pickle.dump(train_model_input, open('data/train_model_input.pkl', 'wb'))
        pickle.dump(test_model_input, open('data/test_model_input.pkl', 'wb'))
        np.save('data/train_label.npy', train_label)
        np.save('data/test_label.npy', test_label)

    # 构建模型并完成训练
    model = train_mind_model(train_model_input, train_label, embedding_dim, feature_max_idx, his_seq_maxlen, batch_size,
                             epochs, verbose, validation_split)

    # 获得用户embedding和doc的embedding， 并进行保存
    user_embs, doc_embs = get_embeddings(model, test_model_input, user_idx_2_rawid, doc_idx_2_rawid)

    # MIND模型这里有k个兴趣向量，所以要分开进行召回
    user_embs1 = user_embs[:, 0, :]
    user_embs2 = user_embs[:, 1, :]

    # 对每个用户，拿到召回结果并返回回来
    user_recall_items_dict1 = get_recall_res(user_embs1, doc_embs, user_idx_2_rawid, doc_idx_2_rawid, topk)
    user_recall_items_dict2 = get_recall_res(user_embs2, doc_embs, user_idx_2_rawid, doc_idx_2_rawid, topk)

    # 合并，当然我这里没有去重
    #     user_recall_items_dict = defaultdict(list)
    #     for user in user_recall_items_dict1:
    #         user_recall_items_dict[user] = user_recall_items_dict1[user] + user_recall_items_dict2[user]

    return user_recall_items_dict1, user_recall_items_dict2
