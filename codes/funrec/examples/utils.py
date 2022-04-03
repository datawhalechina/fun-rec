import pickle
import collections

import numpy as np
from tensorflow.python.keras.models import Model

from deepctr.feature_column import SparseFeat, VarLenSparseFeat, DenseFeat
from deepmatch.utils import sampledsoftmaxloss
from models.matching.MIND import MIND
from models.matching.SDM import SDM

from annoy import AnnoyIndex

def get_hist_and_last_click(all_click):
    all_click = all_click.sort_values(by=['user_id', 'expo_time'])
    click_last_df = all_click.groupby('user_id').tail(1)

    # 如果用户只有一个点击，hist为空了，会导致训练的时候这个用户不可见，此时默认泄露一下
    def hist_func(user_df):
        if len(user_df) == 1:
            return user_df
        else:
            return user_df[:-1]

    click_hist_df = all_click.groupby('user_id').apply(hist_func).reset_index(drop=True)

    return click_hist_df, click_last_df

def train_sdm_model(train_model_input, train_label, embedding_dim, feature_max_idx, SEQ_LEN_short, SEQ_LEN_prefer
                    ,batch_size, epochs, verbose, validation_split):
    """构建sdm并完成训练"""
    # 建立模型
    user_feature_columns = [
        SparseFeat('user_id', feature_max_idx['user_id'], 16),
        SparseFeat('gender', feature_max_idx['gender'], 16),
        SparseFeat('age', feature_max_idx['age'], 16),
        SparseFeat('city', feature_max_idx['city'], 16),

        VarLenSparseFeat
            (SparseFeat('short_doc_id', feature_max_idx['article_id'], embedding_dim, embedding_name="doc_id"), SEQ_LEN_short, 'mean', 'short_sess_length'),
        VarLenSparseFeat
            (SparseFeat('prefer_doc_id', feature_max_idx['article_id'], embedding_dim, embedding_name='doc_id'), SEQ_LEN_prefer, 'mean', 'prefer_sess_length'),
        VarLenSparseFeat(SparseFeat('short_cat1', feature_max_idx['cat_1'], embedding_dim, embedding_name='cat_1'), SEQ_LEN_short, 'mean', 'short_sess_length'),
        VarLenSparseFeat(SparseFeat('prefer_cat1', feature_max_idx['cat_1'], embedding_dim, embedding_name='cat_1'), SEQ_LEN_prefer, 'mean', 'prefer_sess_length'),
        VarLenSparseFeat(SparseFeat('short_cat2', feature_max_idx['cat_2'], embedding_dim, embedding_name='cat_2'), SEQ_LEN_short, 'mean', 'short_sess_length'),
        VarLenSparseFeat(SparseFeat('prefer_cat2', feature_max_idx['cat_2'], embedding_dim, embedding_name='cat_2'), SEQ_LEN_prefer, 'mean', 'prefer_sess_length'),
    ]

    item_feature_columns = [SparseFeat('doc_id', feature_max_idx['article_id'], embedding_dim)]

    # 定义模型
    model = SDM(user_feature_columns, item_feature_columns, history_feature_list=['doc_id', 'cat1', 'cat2'])

    # 模型编译
    model.compile(optimizer="adam", loss=sampledsoftmaxloss)

    # 模型训练，这里可以定义验证集的比例，如果设置为0的话就是全量数据直接进行训练
    history = model.fit(train_model_input, train_label, batch_size=batch_size, epochs=epochs, verbose=verbose, validation_split=validation_split)

    return model

def train_mind_model(train_model_input, train_label, embedding_dim, feature_max_idx, his_seq_maxlen, batch_size, epochs,
                     verbose, validation_split):
    """构建mind并完成训练"""
    # 建立模型
    user_feature_columns = [
        SparseFeat('user_id', feature_max_idx['user_id'], embedding_dim),
        VarLenSparseFeat(SparseFeat('hist_doc_id', feature_max_idx['article_id'], embedding_dim,
                                    embedding_name="click_doc_id"), his_seq_maxlen, 'mean', 'hist_len'),
        DenseFeat('hist_len', 1),
        SparseFeat('u_city', feature_max_idx['city'], embedding_dim),
        SparseFeat('u_age', feature_max_idx['age'], embedding_dim),
        SparseFeat('u_gender', feature_max_idx['gender'], embedding_dim),
    ]
    doc_feature_columns = [
        SparseFeat('doc_id', feature_max_idx['article_id'], embedding_dim)
        # 这里后面也可以把文章的类别画像特征加入
    ]

    # 定义模型
    model = MIND(user_feature_columns, doc_feature_columns, num_sampled=5, user_dnn_hidden_units=(64, embedding_dim))

    # 模型编译
    model.compile(optimizer="adam", loss=sampledsoftmaxloss)

    # 模型训练，这里可以定义验证集的比例，如果设置为0的话就是全量数据直接进行训练
    history = model.fit(train_model_input, train_label, batch_size=batch_size, epochs=epochs, verbose=verbose,
                        validation_split=validation_split)

    return model


"""获取用户embedding和文章embedding"""
def get_embeddings(model, test_model_input, user_idx_2_rawid, doc_idx_2_rawid, save_path='embedding/'):
    doc_model_input = {'doc_id' :np.array(list(doc_idx_2_rawid.keys()))}

    user_embedding_model = Model(inputs=model.user_input, outputs=model.user_embedding)
    doc_embedding_model = Model(inputs=model.item_input, outputs=model.item_embedding)

    # 保存当前的item_embedding 和 user_embedding 排序的时候可能能够用到，但是需要注意保存的时候需要和原始的id对应
    user_embs = user_embedding_model.predict(test_model_input, batch_size=2 ** 12)
    doc_embs = doc_embedding_model.predict(doc_model_input, batch_size=2 ** 12)
    # embedding保存之前归一化一下
    user_embs = user_embs / np.linalg.norm(user_embs, axis=1, keepdims=True)
    doc_embs = doc_embs / np.linalg.norm(doc_embs, axis=1, keepdims=True)

    # 将Embedding转换成字典的形式方便查询
    raw_user_id_emb_dict = {user_idx_2_rawid[k]: \
                                v for k, v in zip(user_idx_2_rawid.keys(), user_embs)}
    raw_doc_id_emb_dict = {doc_idx_2_rawid[k]: \
                               v for k, v in zip(doc_idx_2_rawid.keys(), doc_embs)}
    # 将Embedding保存到本地
    pickle.dump(raw_user_id_emb_dict, open(save_path + 'user_emb.pkl', 'wb'))
    pickle.dump(raw_doc_id_emb_dict, open(save_path + 'doc_emb.pkl', 'wb'))

    # 读取
    # user_embs_dict = pickle.load(open('embedding/user_youtube_emb.pkl', 'rb'))
    # doc_embs_dict = pickle.load(open('embedding/doc_youtube_emb.pkl', 'rb'))
    return user_embs, doc_embs

"""最近邻检索得到召回结果"""
def get_recall_res(user_embs, doc_embs, user_idx_2_rawid, doc_idx_2_rawid, topk):
    """近邻检索，这里用annoy tree"""
    # 把doc_embs构建成索引树
    f = user_embs.shape[1]
    t = AnnoyIndex(f, 'angular')
    for i, v in enumerate(doc_embs):
        t.add_item(i, v)
    t.build(10)
    # 可以保存该索引树 t.save('annoy.ann')

    # 每个用户向量， 返回最近的TopK个item
    user_recall_items_dict = collections.defaultdict(dict)
    for i, u in enumerate(user_embs):
        recall_doc_scores = t.get_nns_by_vector(u, topk, include_distances=True)
        # recall_doc_scores是(([doc_idx], [scores]))， 这里需要转成原始doc的id
        raw_doc_scores = list(recall_doc_scores)
        raw_doc_scores[0] = [doc_idx_2_rawid[i] for i in raw_doc_scores[0]]
        # 转换成实际用户id
        try:
            user_recall_items_dict[user_idx_2_rawid[i]] = dict(zip(*raw_doc_scores))
        except:
            continue

    # 默认是分数从小到大排的序， 这里要从大到小
    user_recall_items_dict = {k: sorted(v.items(), key=lambda x: x[1], reverse=True) for k, v in user_recall_items_dict.items()}

    # 保存一份
    pickle.dump(user_recall_items_dict, open('u2i_dict.pkl', 'wb'))

    return user_recall_items_dict