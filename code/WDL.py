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
from tensorflow.keras.regularizers import l2, l1_l2

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler, StandardScaler, LabelEncoder

# 读取数据，并将标签做简单的转换
def get_data():
    COLUMNS = ["age", "workclass", "fnlwgt", "education", "education_num",
               "marital_status", "occupation", "relationship", "race", "gender",
               "capital_gain", "capital_loss", "hours_per_week", "native_country",
               "income_bracket"]

    df_train = pd.read_csv("./data/adult_train.csv", names=COLUMNS)
    df_test = pd.read_csv("./data/adult_test.csv", names=COLUMNS)

    df_train['income_label'] = (df_train["income_bracket"].apply(lambda x: ">50K" in x)).astype(int)
    df_test['income_label'] = (df_test["income_bracket"].apply(lambda x: ">50K" in x)).astype(int)

    return df_train, df_test


# 特征处理分为wide部分的特征处理和deep部分的特征处理
def data_process(df_train, df_test):
    # 年龄特征离散化
    age_groups = [0, 25, 65, 90]
    age_labels = range(len(age_groups) - 1)
    df_train['age_group'] = pd.cut(df_train['age'], age_groups, labels=age_labels)
    df_test['age_group'] = pd.cut(df_test['age'], age_groups, labels=age_labels)

    # wide部分的原始特征及交叉特征
    wide_cols = ['workclass', 'education', 'marital_status', 'occupation', \
                 'relationship', 'race', 'gender', 'native_country', 'age_group']
    x_cols = (['education', 'occupation'], ['native_country', 'occupation'])

    # deep部分的特征分为两大类，一类是数值特征(可以直接输入到网络中进行训练)，
    # 一类是类别特征(只能在embedding之后才能输入到模型中进行训练）
    embedding_cols = ['workclass', 'education', 'marital_status', 'occupation', \
                      'relationship', 'race', 'gender', 'native_country']
    cont_cols = ['age', 'capital_gain', 'capital_loss', 'hours_per_week']

    # 类别标签
    target = 'income_label'

    return df_train, df_test, wide_cols, x_cols, embedding_cols, cont_cols, target


def process_wide_feats(df_train, df_test, wide_cols, x_cols, target):
    # 合并训练和测试数据，后续一起编码
    df_train['IS_TRAIN'] = 1
    df_test['IS_TRAIN'] = 0
    df_wide = pd.concat([df_train, df_test])

    # 选出wide部分特征中的类别特征, 类别特征在DataFrame中是object类型
    categorical_columns = list(df_wide.select_dtypes(include=['object']).columns) 

    # 构造交叉特征
    crossed_columns_d = []
    for f1, f2 in x_cols:
        col_name = f1 + '_' + f2
        crossed_columns_d.append(col_name)
        df_wide[col_name] = df_wide[[f1, f2]].apply(lambda x: '-'.join(x), axis=1)

    # wide部分的所有特征
    wide_cols += crossed_columns_d
    df_wide = df_wide[wide_cols + [target] + ['IS_TRAIN']]

    # 将wide部分类别特征进行onehot编码
    dummy_cols = [c for c in wide_cols if c in categorical_columns + crossed_columns_d]
    df_wide = pd.get_dummies(df_wide, columns=[x for x in dummy_cols])

    # 将训练数据和测试数据分离
    train = df_wide[df_wide.IS_TRAIN == 1].drop('IS_TRAIN', axis=1)
    test = df_wide[df_wide.IS_TRAIN == 0].drop('IS_TRAIN', axis=1)

    cols = [c for c in train.columns if c != target]
    X_train = train[cols].values
    y_train = train[target].values.reshape(-1, 1)
    X_test = test[cols].values
    y_test = test[target].values.reshape(-1, 1)

    return X_train, y_train, X_test, y_test


def process_deep_feats(df_train, df_test, embedding_cols, cont_cols, target, emb_dim=8, emb_reg=1e-3):
    # 标记训练和测试集，方便特征处理完之后进行训练和测试集的分离
    df_train['IS_TRAIN'] = 1
    df_test['IS_TRAIN'] = 0
    df_deep = pd.concat([df_train, df_test])

    # 拼接数值特征和embedding特征
    deep_cols = embedding_cols + cont_cols
    df_deep = df_deep[deep_cols + [target,'IS_TRAIN']]

    # 数值类特征进行标准化
    scaler = StandardScaler()
    df_deep[cont_cols] = pd.DataFrame(scaler.fit_transform(df_train[cont_cols]), columns=cont_cols)

    # 类边特征编码
    unique_vals = dict()
    lbe = LabelEncoder()
    for feats in embedding_cols:
        df_deep[feats] = lbe.fit_transform(df_deep[feats])
        unique_vals[feats] = df_deep[feats].nunique()

    # 构造模型的输入层，和embedding层，虽然对于连续的特征没有embedding层，但是为了统一，将Reshape层
    # 当成是连续特征的embedding层
    inp_layer = []
    emb_layer = []
    for ec in embedding_cols:
        layer_name = ec + '_inp'
        inp = Input(shape=(1,), dtype='int64', name=layer_name)
        emb = Embedding(unique_vals[ec], emb_dim, input_length=1, embeddings_regularizer=l2(emb_reg))(inp)
        inp_layer.append(inp)
        emb_layer.append(inp)

    for cc in cont_cols:
        layer_name = cc + '_inp'
        inp = Input(shape=(1,), dtype='int64', name=layer_name)
        emb = Reshape((1, 1))(inp)
        inp_layer.append(inp)
        emb_layer.append(inp)

    # 训练和测试集分离
    train = df_deep[df_deep.IS_TRAIN == 1].drop('IS_TRAIN', axis=1)
    test = df_deep[df_deep.IS_TRAIN == 0].drop('IS_TRAIN', axis=1)

    # 提取训练和测试集中的特征
    X_train = [train[c] for c in deep_cols]
    y_train = np.array(train[target].values).reshape(-1, 1)
    X_test = [test[c] for c in deep_cols]
    y_test = np.array(test[target].values).reshape(-1, 1)

    return X_train, y_train, X_test, y_test, emb_layer, inp_layer


def wide_deep(df_train, df_test, wide_cols, x_cols, embedding_cols, cont_cols):
    # wide部分特征处理
    X_train_wide, y_train_wide, X_test_wide, y_test_wide = \
        process_wide_feats(df_train, df_test, wide_cols, x_cols, target)

    # deep部分特征处理
    X_train_deep, y_train_deep, X_test_deep, y_test_deep, deep_inp_embed, deep_inp_layer = \
        process_deep_feats(df_train, df_test, embedding_cols,cont_cols, target)

    # wide特征与deep特征拼接
    X_tr_wd = [X_train_wide] + X_train_deep
    Y_tr_wd = y_train_deep  # wide部分和deep部分的label是一样的
    X_te_wd = [X_test_wide] + X_test_deep
    Y_te_wd = y_test_deep  # wide部分和deep部分的label是一样的

    # wide部分的输入
    w = Input(shape=(X_train_wide.shape[1],), dtype='float32', name='wide')

    # deep部分的NN结构
    d = concatenate(deep_inp_embed)
    d = Flatten()(d)
    d = Dense(50, activation='relu', kernel_regularizer=l1_l2(l1=0.01, l2=0.01))(d)
    d = Dropout(0.5)(d)
    d = Dense(20, activation='relu', name='deep')(d)
    d = Dropout(0.5)(d)

    # 将wide部分与deep部分的输入进行拼接, 然后输入一个线性层
    wd_inp = concatenate([w, d])
    wd_out = Dense(Y_tr_wd.shape[1], activation='sigmoid', name='wide_deep')(wd_inp) 
    
    # 构建模型，这里需要注意模型的输入部分是由wide和deep部分组成的
    wide_deep = Model(inputs=[w] + deep_inp_layer, outputs=wd_out)
    wide_deep.compile(optimizer='Adam', loss='binary_crossentropy', metrics=['AUC'])

    # 设置模型学习率，不设置学习率keras默认的学习率是0.01
    wide_deep.optimizer.lr = 0.001

    # 模型训练
    wide_deep.fit(X_tr_wd, Y_tr_wd, epochs=5, batch_size=128)

    # 模型预测及验证
    results = wide_deep.evaluate(X_te_wd, Y_te_wd)

    print("\n", results)


if __name__ == '__main__':
    # 读取数据
    df_train, df_test = get_data()

    # 特征处理
    df_train, df_test, wide_cols, x_cols, embedding_cols, cont_cols, target = data_process(df_train, df_test)

    # 模型训练
    wide_deep(df_train, df_test, wide_cols, x_cols, embedding_cols, cont_cols)