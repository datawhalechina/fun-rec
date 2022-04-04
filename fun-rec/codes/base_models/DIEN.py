import warnings
warnings.filterwarnings("ignore")
import itertools
import pandas as pd
import numpy as np
from tqdm import tqdm
from collections import namedtuple

import tensorflow as tf
from tensorflow.keras.layers import *
from tensorflow.keras.models import *

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import  MinMaxScaler, LabelEncoder
from random import sample

from utils import SparseFeat, DenseFeat, VarLenSparseFeat

from contrib.rnn_v2 import dynamic_rnn
from contrib.utils import QAAttGRUCell, VecAttGRUCell

tf.compat.v1.disable_eager_execution()   # 这句要加上


# 构建输入层
# 将输入的数据转换成字典的形式，定义输入层的时候让输入层的name和字典中特征的key一致，就可以使得输入的数据和对应的Input层对应
def build_input_layers(feature_columns):
    input_layer_dict = {}

    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            input_layer_dict[fc.name] = Input(shape=(1,), name=fc.name)
        elif isinstance(fc, DenseFeat):
            input_layer_dict[fc.name] = Input(shape=(fc.dimension, ), name=fc.name)
        elif isinstance(fc, VarLenSparseFeat):
            input_layer_dict[fc.name] = Input(shape=(fc.maxlen, ), name=fc.name)
    
    return input_layer_dict


# 构建embedding层
def build_embedding_layers(feature_columns, input_layer_dict):
    embedding_layer_dict = {}

    for fc in feature_columns:
        if isinstance(fc, SparseFeat):
            embedding_layer_dict[fc.name] = Embedding(fc.vocabulary_size, fc.embedding_dim, name='emb_' + fc.name)
        elif isinstance(fc, VarLenSparseFeat):
            embedding_layer_dict[fc.name] = Embedding(fc.vocabulary_size + 1, fc.embedding_dim, name='emb_' + fc.name, mask_zero=True)

    return embedding_layer_dict

def embedding_lookup(feature_columns, input_layer_dict, embedding_layer_dict):
    embedding_list = []
    
    for fc in feature_columns:
        _input = input_layer_dict[fc]
        _embed = embedding_layer_dict[fc]
        embed = _embed(_input)
        embedding_list.append(embed)

    return embedding_list

# 输入层拼接成列表
def concat_input_list(input_list):
    feature_nums = len(input_list)
    if feature_nums > 1:
        return Concatenate(axis=1)(input_list)
    elif feature_nums == 1:
        return input_list[0]
    else:
        return None

# 将所有的sparse特征embedding拼接
def concat_embedding_list(feature_columns, input_layer_dict, embedding_layer_dict, flatten=False):
    embedding_list = []
    for fc in feature_columns:
        _input = input_layer_dict[fc.name] # 获取输入层 
        _embed = embedding_layer_dict[fc.name] # B x 1 x dim  获取对应的embedding层
        embed = _embed(_input) # B x dim  将input层输入到embedding层中

        # 是否需要flatten, 如果embedding列表最终是直接输入到Dense层中，需要进行Flatten，否则不需要
        if flatten:
            embed = Flatten()(embed)
        
        embedding_list.append(embed)
    
    return embedding_list 


"""Attention NetWork"""
class LocalActivationUnit(Layer):

    def __init__(self, hidden_units=(256, 128, 64), activation='prelu'):
        super(LocalActivationUnit, self).__init__()
        self.hidden_units = hidden_units
        self.linear = Dense(1)
        self.dnn = [Dense(unit, activation=PReLU() if activation == 'prelu' else Dice()) for unit in hidden_units]

    def call(self, inputs):
        # query: B x 1 x emb_dim  keys: B x len x emb_dim
        query, keys = inputs 

        # 获取序列长度
        keys_len, keys_dim = keys.get_shape()[1], keys.get_shape()[2]

        queries = tf.tile(query, multiples=[1, keys_len, 1])   # (None, len * emb_dim)  
        queries = tf.reshape(queries, shape=[-1, keys_len, keys_dim])

        # 将特征进行拼接
        att_input = tf.concat([queries, keys, queries - keys, queries * keys], axis=-1) # B x len x 4*emb_dim

        # 将原始向量与外积结果拼接后输入到一个dnn中
        att_out = att_input
        for fc in self.dnn:
            att_out = fc(att_out) # B x len x att_out

        att_out = self.linear(att_out) # B x len x 1
        att_out = tf.squeeze(att_out, -1) # B x len

        return att_out


class AttentionPoolingLayer(Layer):
    def __init__(self, user_behavior_length, att_hidden_units=(256, 128, 64), return_score=False):
        super(AttentionPoolingLayer, self).__init__()
        self.att_hidden_units = att_hidden_units
        self.local_att = LocalActivationUnit(self.att_hidden_units)
        self.user_behavior_length = user_behavior_length
        self.return_score = return_score

    def call(self, inputs):
        # keys: B x len x emb_dim, queries: B x 1 x emb_dim
        queries, keys = inputs 

        # 获取行为序列embedding的mask矩阵，将Embedding矩阵中的非零元素设置成True，
        key_masks = tf.sequence_mask(self.user_behavior_length, keys.shape[1])  # (None, 1, max_len)  这里注意user_behavior_length是(None,1)
        key_masks = key_masks[:, 0, :]     # 所以上面会多出个1维度来， 这里去掉才行，(None, max_len)

        # 获取行为序列中每个商品对应的注意力权重
        attention_score = self.local_att([queries, keys])   # (None, max_len)

        # 创建一个padding的tensor, 目的是为了标记出行为序列embedding中无效的位置
        paddings = tf.zeros_like(attention_score) # B x len

        # outputs 表示的是padding之后的attention_score
        outputs = tf.where(key_masks, attention_score, paddings) # B x len

        # 将注意力分数与序列对应位置加权求和，这一步可以在
        outputs = tf.expand_dims(outputs, axis=1) # B x 1 x len
        
        if not self.return_score:
            # keys : B x len x emb_dim
            outputs = tf.matmul(outputs, keys) # B x 1 x dim
            outputs = tf.squeeze(outputs, axis=1)

        return outputs


"""兴趣进化网络"""
class DynamicGRU(Layer):
    def __init__(self, num_units=None, gru_type='GRU', return_sequence=True):
        super(DynamicGRU, self).__init__()
        self.num_units = num_units
        self.return_sequence = return_sequence
        self.gru_type = gru_type
        self.return_sequence = return_sequence
    
    def build(self, input_shape):
        # 创建一个可训练的权重变量
        input_seq_shape = input_shape[0]
        if self.num_units is None:
            self.num_units = input_seq_shape.as_list()[-1]   # 如果GRU的隐藏单元个数不指定，就取embedding维度
        if self.gru_type == 'AGRU':
            self.gru_cell = QAAttGRUCell(self.num_units)
        elif self.gru_type == 'AUGRU':
            self.gru_cell = VecAttGRUCell(self.num_units)
        else:
            self.gru_cell = tf.compat.v1.nn.rnn_cell.GRUCell(self.num_units)
        
        super(DynamicGRU, self).build(input_shape)
        
    def call(self, input_list):
        """
        :param concated_embeds_value: None * field_size * embedding_size
        :return: None*1
        """
        # 兴趣抽取层的运算
        if self.gru_type == "GRU" or self.gru_type == "AIGRU":
            rnn_input, sequence_length = input_list
            att_score = None
        else:        # 这个是兴趣进化层，这个中间会有个注意力机制
            rnn_input, sequence_length, att_score = input_list       
        
        rnn_output, hidden_state = dynamic_rnn(self.gru_cell, inputs=rnn_input, att_scores=att_score, 
                                              sequence_length=tf.squeeze(sequence_length),
                                               dtype = tf.float32)
        
        if not self.return_sequence:  # 只返回最后一个时间步的结果
            return hidden_state
        else:    # 返回所有时间步的结果
            return rnn_output


class DNN(Layer):
    """
    FC network
    """
    def __init__(self, hidden_units, activation='relu', dropout=0.):
        """
        :param hidden_units: A list.  the number of the hidden layer neural units
        :param activation: A string. Activation function of dnn.
        :param dropout: A scalar. Dropout rate
        """
        super(DNN, self).__init__()
        self.dnn_net = [Dense(units=unit, activation=activation) for unit in hidden_units]
        self.dropout = Dropout(dropout)
    
    def call(self, inputs):
        x = inputs
        for dnn in self.dnn_net:
            x = dnn(x)
        x = self.dropout(x)
        
        outputs = Dense(1, activation='sigmoid')(x)
        return outputs


def auxiliary_loss(h_states, click_seq, noclick_seq, mask):
    """
    计算auxiliary_loss
    :param h_states: 兴趣提取层的隐藏状态的输出h_states  (None, T-1, embed_dim)
    :param click_seq: 下一个时刻用户点击的embedding向量  (None, T-1, embed_dim)
    :param noclick_seq:下一个时刻用户未点击的embedding向量 (None, T-1, embed_dim)
    :param mask: 用户历史行为序列的长度， 注意这里是原seq_length-1，因为最后一个时间步的输出就没法计算了  (None, 1) 
        
    :return:  根据论文的公式，计算出损失，返回回来
    """
    hist_len, _ = click_seq.get_shape().as_list()[1:]    # (T-1, embed_dim) 元组解包的操作， hist_len=T-1
    mask = tf.sequence_mask(mask, hist_len)   # 这是遮盖的操作  (None, 1, T-1)   每一行是bool类型的值， 为FALSE的为填充
    mask = mask[:, 0, :]    # (None, T-1)    
    
    mask = tf.cast(mask, tf.float32)
    
    click_input = tf.concat([h_states, click_seq], -1)    # (None, T-1, 2*embed_dim)
    noclick_input = tf.concat([h_states, noclick_seq], -1)  # (None, T-1, 2*embed_dim)
    
    auxiliary_nn = DNN([100, 50], activation='sigmoid')
    click_prop = auxiliary_nn(click_input)[:, :, 0]            # (None, T-1)
    noclick_prop = auxiliary_nn(noclick_input)[:, :, 0]      # (None, T-1)
    
    click_loss = -tf.reshape(tf.compat.v1.log(click_prop), [-1, tf.shape(click_seq)[1]]) * mask
    noclick_loss = -tf.reshape(tf.compat.v1.log(1.0-noclick_prop), [-1, tf.shape(noclick_seq)[1]]) * mask
    
    aux_loss = tf.reduce_mean(click_loss + noclick_loss)
    
    return aux_loss  


def interest_evolution(concat_behavior, query_input_item, user_behavior_length, neg_concat_behavior, gru_type="GRU", use_neg=True):
    
    aux_loss = None
    use_aux_loss = None
    embedding_size = None
    
    # 兴趣提取层  
    rnn_outputs = DynamicGRU(embedding_size, return_sequence=True)([concat_behavior, user_behavior_length])  # (None, max_len, embed_dim)
    # "AUGRU"并且采用负采样序列方式，这时候要先计算auxiliary_loss
    if gru_type == "AUGRU" and use_neg:
        aux_loss = auxiliary_loss(rnn_outputs[:, :-1, :], 
                                    concat_behavior[:, 1:, :], 
                                    neg_concat_behavior[:, 1:, :],
                                    tf.subtract(user_behavior_length, 1))

    # 兴趣演化层用的GRU， 这时候先得到输出， 然后把Attention的结果直接加权上去
    if gru_type == "GRU":
        rnn_outputs2 = DynamicGRU(embedding_size, return_sequence=True)([rnn_outputs, user_behavior_length])  # (None, max_len, embed_dim)
        hist = AttentionPoolingLayer(user_behavior_length, return_score=False)([query_input_item, rnn_outputs2])
    else:   
        scores = AttentionPoolingLayer(user_behavior_length, return_score=True)([query_input_item, rnn_outputs])
        # 兴趣演化层如果是AIGRU， 把Attention的结果先乘到输入上去，然后再过GRU
        if gru_type == "AIGRU":
            hist = multiply([rnn_outputs, Permute[2, 1](scores)])
            final_state2 = DynamicGRU(embedding_size, gru_type="GRU", return_sequence=False)([hist, user_behavior_length])
        else:  # 兴趣演化层是AUGRU或者AGRU, 这时候， 需要用相应的cell去进行计算了
            final_state2 = DynamicGRU(embedding_size, gru_type=gru_type, return_sequence=False)([rnn_outputs, user_behavior_length, Permute([2, 1])(scores)])
        hist = final_state2
    return hist, aux_loss


"""DNN Network"""
class Dice(Layer):
    def __init__(self):
        super(Dice, self).__init__()
        self.bn = BatchNormalization(center=False, scale=False)
        
    def build(self, input_shape):
        self.alpha = self.add_weight(shape=(input_shape[-1],), dtype=tf.float32, name='alpha')

    def call(self, x):
        x_normed = self.bn(x)
        x_p = tf.sigmoid(x_normed)
        
        return self.alpha * (1.0-x_p) * x + x_p * x

def get_dnn_logits(dnn_input, hidden_units=(200, 80), activation='prelu'):
    dnns = [Dense(unit, activation=PReLU() if activation == 'prelu' else Dice()) for unit in hidden_units]

    dnn_out = dnn_input
    for dnn in dnns:
        dnn_out = dnn(dnn_out)
    
    # 获取logits
    dnn_logits = Dense(1, activation='sigmoid')(dnn_out)

    return dnn_logits


"""DIEN NetWork"""
def DIEN(feature_columns, behavior_feature_list, behavior_seq_feature_list, neg_seq_feature_list, use_neg_sample=False, alpha=1.0):
    # 构建输入层
    input_layer_dict = build_input_layers(feature_columns)
    
    # 将Input层转化为列表的形式作为model的输入
    input_layers = list(input_layer_dict.values())       # 各个输入层
    user_behavior_length = input_layer_dict["hist_len"]
    
    # 筛选出特征中的sparse_fea, dense_fea, varlen_fea
    sparse_feature_columns = list(filter(lambda x: isinstance(x, SparseFeat), feature_columns)) if feature_columns else []
    dense_feature_columns = list(filter(lambda x: isinstance(x, DenseFeat), feature_columns)) if feature_columns else []
    varlen_sparse_feature_columns = list(filter(lambda x: isinstance(x, VarLenSparseFeat), feature_columns)) if feature_columns else []
    
    # 获取dense
    dnn_dense_input = []
    for fc in dense_feature_columns:
        dnn_dense_input.append(input_layer_dict[fc.name])

    # 将所有的dense特征拼接
    dnn_dense_input = concat_input_list(dnn_dense_input)

    # 构建embedding字典
    embedding_layer_dict = build_embedding_layers(feature_columns, input_layer_dict)
    
    # 因为这里最终需要将embedding拼接后直接输入到全连接层(Dense)中, 所以需要Flatten
    dnn_sparse_embed_input = concat_embedding_list(sparse_feature_columns, input_layer_dict, embedding_layer_dict, flatten=True)
    # 将所有sparse特征的embedding进行拼接
    dnn_sparse_input = concat_input_list(dnn_sparse_embed_input)
    
    # 获取当前的行为特征(movie)的embedding，这里有可能有多个行为产生了行为序列，所以需要使用列表将其放在一起
    query_embed_list = embedding_lookup(behavior_feature_list, input_layer_dict, embedding_layer_dict)
    # 获取行为序列(movie_id序列, hist_movie_id) 对应的embedding，这里有可能有多个行为产生了行为序列，所以需要使用列表将其放在一起
    keys_embed_list = embedding_lookup(behavior_seq_feature_list, input_layer_dict, embedding_layer_dict)
    # 把q,k的embedding拼在一块
    query_emb, keys_emb = concat_input_list(query_embed_list), concat_input_list(keys_embed_list)
    
    # 采样的负行为
    neg_uiseq_embed_list = embedding_lookup(neg_seq_feature_list, input_layer_dict, embedding_layer_dict)
    neg_concat_behavior = concat_input_list(neg_uiseq_embed_list)
    
    # 兴趣进化层的计算过程
    dnn_seq_input, aux_loss = interest_evolution(keys_emb, query_emb, user_behavior_length, neg_concat_behavior, gru_type="AUGRU")
    
    # 后面的全连接层
    deep_input_embed = Concatenate()([dnn_dense_input, dnn_sparse_input, dnn_seq_input])
    
    # 获取最终dnn的logits
    dnn_logits = get_dnn_logits(deep_input_embed, activation='prelu')
    model = Model(input_layers, dnn_logits)
    
    # 加兴趣提取层的损失  这个比例可调
    if use_neg_sample:
        model.add_loss(alpha * aux_loss)
        
    # 所有变量需要初始化
    tf.compat.v1.keras.backend.get_session().run(tf.compat.v1.global_variables_initializer())
    return model


def get_neg_click(data_df, neg_num=10):
    movies_np = data_df['hist_movie_id'].values
    
    movie_list = []
    for movies in movies_np:
        movie_list.extend([x for x in movies.split(',') if x != '0'])

    movies_set = set(movie_list) 

    neg_movies_list = []
    for movies in movies_np:
        hist_movies = set([x for x in movies.split(',') if x != '0'])
        neg_movies_set = movies_set - hist_movies # 集合求差集
        neg_movies = sample(neg_movies_set, neg_num) # 返回的是一个列表
        neg_movies_list.append(','.join(neg_movies))

    return pd.Series(neg_movies_list)


if __name__ == "__main__":
    """读取数据"""
    samples_data = pd.read_csv("data/movie_sample.txt", sep="\t", header = None)
    samples_data.columns = ["user_id", "gender", "age", "hist_movie_id", "hist_len", "movie_id", "movie_type_id", "label"]

    """数据集"""
    X = samples_data[["user_id", "gender", "age", "hist_movie_id", "hist_len", "movie_id", "movie_type_id"]]
    y = samples_data["label"]

    # 负采样，负采样的时候序列的长度和设置的行为序列长度一样长
    # 不用担心会多计算损失，其实在计算损失的时候使用mask，无效的值不会参与计算
    X['neg_hist_movie_id'] = get_neg_click(X, neg_num=50)

    """构建DIEN模型的输入格式"""
    # 这里和DIN相比， 会多出负采样的一列历史行为
    X_train = {"user_id": np.array(X["user_id"]), \
            "gender": np.array(X["gender"]), \
            "age": np.array(X["age"]), \
            "hist_movie_id": np.array([[int(i) for i in l.split(',')] for l in X["hist_movie_id"]]), \
            "neg_hist_movie_id": np.array([[int(i) for i in l.split(',')] for l in X["neg_hist_movie_id"]]), \
            "hist_len": np.array(X["hist_len"]), \
            "movie_id": np.array(X["movie_id"]), \
            "movie_type_id": np.array(X["movie_type_id"])}

    y_train = np.array(y)

    """特征封装"""
    feature_columns = [SparseFeat('user_id', max(samples_data["user_id"])+1, embedding_dim=8), 
                        SparseFeat('gender', max(samples_data["gender"])+1, embedding_dim=8), 
                        SparseFeat('age', max(samples_data["age"])+1, embedding_dim=8), 
                        SparseFeat('movie_id', max(samples_data["movie_id"])+1, embedding_dim=8),
                        SparseFeat('movie_type_id', max(samples_data["movie_type_id"])+1, embedding_dim=8),
                        DenseFeat('hist_len', 1)]

    feature_columns += [VarLenSparseFeat('hist_movie_id', vocabulary_size=max(samples_data["movie_id"])+1, embedding_dim=8, maxlen=50)]
    feature_columns += [VarLenSparseFeat('neg_hist_movie_id', vocabulary_size=max(samples_data["movie_id"])+1, embedding_dim=8, maxlen=50)]

    # 行为特征列表，表示的是基础特征
    behavior_feature_list = ['movie_id']
    # 行为序列特征
    behavior_seq_feature_list = ['hist_movie_id']
    # 负采样序列特征
    neg_seq_feature_list = ['neg_hist_movie_id']

    """构建DIN模型"""
    history = DIEN(feature_columns, behavior_feature_list, behavior_seq_feature_list, neg_seq_feature_list, use_neg_sample=True)
    
    history.compile('adam', 'binary_crossentropy')

    history.fit(X_train, y_train, batch_size=64, epochs=5, validation_split=0.2, )