import pandas as pd
import numpy as np
import warnings
import random, math, os
from tqdm import tqdm

from tensorflow.keras import *
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
from tensorflow.keras.callbacks import *
import tensorflow.keras.backend as K

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import faiss
warnings.filterwarnings('ignore')

# 评价指标
# 推荐系统推荐正确的商品数量占用户实际点击的商品数量
def Recall(Rec_dict, Val_dict):
    '''
    Rec_dict: 推荐算法返回的推荐列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...} 
    Val_dict: 用户实际点击的商品列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...}
    '''
    hit_items = 0
    all_items = 0
    for uid, items in Val_dict.items():
        rel_set = items
        rec_set = Rec_dict[uid]
        for item in rec_set:
            if item in rel_set:
                hit_items += 1
        all_items += len(rel_set)

    return round(hit_items / all_items * 100, 2)

# 推荐系统推荐正确的商品数量占给用户实际推荐的商品数
def Precision(Rec_dict, Val_dict):
    '''
    Rec_dict: 推荐算法返回的推荐列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...} 
    Val_dict: 用户实际点击的商品列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...}
    '''
    hit_items = 0
    all_items = 0
    for uid, items in Val_dict.items():
        rel_set = items
        rec_set = Rec_dict[uid]
        for item in rec_set:
            if item in rel_set:
                hit_items += 1
        all_items += len(rec_set)

    return round(hit_items / all_items * 100, 2)

# 所有被推荐的用户中,推荐的商品数量占这些用户实际被点击的商品数量
def Coverage(Rec_dict, Trn_dict):
    '''
    Rec_dict: 推荐算法返回的推荐列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...} 
    Trn_dict: 训练集用户实际点击的商品列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...}
    '''
    rec_items = set()
    all_items = set()
    for uid in Rec_dict:
        for item in Trn_dict[uid]:
            all_items.add(item)
        for item in Rec_dict[uid]:
            rec_items.add(item)
    return round(len(rec_items) / len(all_items) * 100, 2)

# 使用平均流行度度量新颖度,如果平均流行度很高(即推荐的商品比较热门),说明推荐的新颖度比较低
def Popularity(Rec_dict, Trn_dict):
    '''
    Rec_dict: 推荐算法返回的推荐列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...} 
    Trn_dict: 训练集用户实际点击的商品列表, 形式:{uid: {item1, item2,...}, uid: {item1, item2,...}, ...}
    '''
    pop_items = {}
    for uid in Trn_dict:
        for item in Trn_dict[uid]:
            if item not in pop_items:
                pop_items[item] = 0
            pop_items[item] += 1
    
    pop, num = 0, 0
    for uid in Rec_dict:
        for item in Rec_dict[uid]:
            pop += math.log(pop_items[item] + 1) # 物品流行度分布满足长尾分布,取对数可以使得平均值更稳定
            num += 1  
    return round(pop / num, 3)

# 将几个评价指标指标函数一起调用
def rec_eval(val_rec_items, val_user_items, trn_user_items):
    print('recall:',Recall(val_rec_items, val_user_items))
    print('precision',Precision(val_rec_items, val_user_items))
    print('coverage',Coverage(val_rec_items, trn_user_items))
    print('Popularity',Popularity(val_rec_items, trn_user_items)) 


def get_data(root_path):
    # 读取数据时，定义的列名
    rnames = ['user_id','movie_id','rating','timestamp']
    data = pd.read_csv(os.path.join(root_path, 'ratings.dat'), sep='::', engine='python', names=rnames)

    lbe = LabelEncoder()
    data['user_id'] = lbe.fit_transform(data['user_id'])
    data['movie_id'] = lbe.fit_transform(data['movie_id']) 

    # 直接这么分是不是可能会存在验证集中的用户或者商品不在训练集合中呢？那这种的操作一半是怎么进行划分
    trn_data_, val_data_, _, _ = train_test_split(data, data, test_size=0.2)

    trn_data = trn_data_.groupby('user_id')['movie_id'].apply(list).reset_index()
    val_data = val_data_.groupby('user_id')['movie_id'].apply(list).reset_index()

    trn_user_items = {}
    val_user_items = {}
    
    # 将数组构造成字典的形式{user_id: [item_id1, item_id2,...,item_idn]}
    for user, movies in zip(*(list(trn_data['user_id']), list(trn_data['movie_id']))):
        trn_user_items[user] = set(movies)

    for user, movies in zip(*(list(val_data['user_id']), list(val_data['movie_id']))):
        val_user_items[user] = set(movies)

    return trn_user_items, val_user_items, trn_data_, val_data_, data

# 矩阵分解模型
def MF(n_users, n_items, embedding_dim=8):
    K.clear_session()
    input_users = Input(shape=[None, ])
    users_emb = Embedding(n_users, embedding_dim)(input_users)
    
    input_movies = Input(shape=[None, ])
    movies_emb = Embedding(n_items, embedding_dim)(input_movies)
    
    users = BatchNormalization()(users_emb)
    users = Reshape((embedding_dim, ))(users)
    
    movies = BatchNormalization()(movies_emb)
    movies = Reshape((embedding_dim, ))(movies)
    
    output = Dot(1)([users, movies])
    model = Model(inputs=[input_users, input_movies], outputs=output)
    model.compile(loss='mse', optimizer='adam')
    model.summary()
    
    # 为了方便获取模型中的某些层，进行如下属性设置
    model.__setattr__('user_input', input_users)
    model.__setattr__('user_embedding', users_emb)
    model.__setattr__('movie_input', input_movies)
    model.__setattr__('movie_embedding', movies_emb)

    return model


if __name__ == "__main__":
    # K表示最终给用户推荐的商品数量，N表示候选推荐商品为用户交互过的商品相似商品的数量
    k = 80
    N = 10

    # 读取数据
    root_path = './data/ml-1m/'
    trn_user_items, val_user_items, trn_data, val_data, data = get_data(root_path)

    # 模型保存的名称
    # 定义模型训练时监控的相关参数
    model_path = 'mf.h5'
    checkpoint = ModelCheckpoint(model_path, monitor='val_loss', verbose=1, save_best_only=True, 
                                 mode='min', save_weights_only=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=0.0001, verbose=1)
    earlystopping = EarlyStopping(monitor='val_loss', min_delta=0.0001, patience=5, verbose=1, mode='min')
    callbacks = [checkpoint, reduce_lr, earlystopping]

    # 计算user和item的数量
    n_users = trn_data['user_id'].max() + 1
    n_items = trn_data['movie_id'].max() + 1
    embedding_dim = 64 # 用户及商品的向量维度
    model = MF(n_users, n_items, embedding_dim) # 训练模型

    # 模型的输入是user_id和movie_id
    hist = model.fit([trn_data['user_id'].values, trn_data['movie_id'].values], 
                    trn_data['rating'].values, batch_size=256, epochs=1, validation_split=0.1,
                    callbacks=callbacks, verbose=1, shuffle=True)

    # 获取模型的Embedding层
    user_embedding_model = Model(inputs=model.user_input, outputs=model.user_embedding)
    item_embedding_model = Model(inputs=model.movie_input, outputs=model.movie_embedding)
    
    # 将验证集中的user_id进行排序,方便与faiss搜索的结果进行对应
    val_uids = sorted(val_data['user_id'].unique())
    trn_items = sorted(trn_data['movie_id'].unique())
    
    # 获取训练数据的实际索引与相对索引，
    # 实际索引指的是数据中原始的user_id
    # 相对索引指的是，排序后的位置索引，这个对应的是faiss库搜索得到的结果索引
    trn_items_dict = {}
    for i, item in enumerate(trn_items):
        trn_items_dict[i] = item

    # 获取训练集中的所有的商品，由于数据进行了训练和验证集的划分，所以实际的训练集中的商品可能不包含整个数据集中的所有商品
    # 但是为了在向量索引的时候方便与原始索引相对应
    items_dict = set(trn_data['movie_id'].unique())

    user_embs = user_embedding_model.predict([val_uids], batch_size=256).squeeze(axis=1)
    item_embs = item_embedding_model.predict([trn_items], batch_size=256).squeeze(axis=1)
    
    # 使用向量搜索库进行最近邻搜索
    index = faiss.IndexFlatIP(embedding_dim)
    index.add(item_embs)
    # ascontiguousarray函数将一个内存不连续存储的数组转换为内存连续存储的数组，使得运行速度更快。
    D, I = index.search(np.ascontiguousarray(user_embs), k)

    # 将推荐结果转换成可以计算评价指标的格式
    # 选择最相似的TopN个item
    val_rec = {}
    for i, u in enumerate(val_uids):
        items = list(map(lambda x: trn_items_dict[x], list(I[i]))) # 先将相对索引转换成原数据中的user_id
        items = list(filter(lambda x: x not in trn_user_items[u], items))[:N] # 过滤掉用户在训练集中交互过的商品id，并选择相似度最高的前N个
        val_rec[u] = set(items) # 将结果转换成统一的形式，便于计算模型的性能指标

    # 计算评价指标
    rec_eval(val_rec, val_user_items, trn_user_items)