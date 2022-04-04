
## Description：
# 这个笔记本要做一个GBDT+LR的demon， 基于kaggle上的一个比赛数据集, 下载链接：[http://labs.criteo.com/2014/02/kaggle-display-advertising-challenge-dataset/](http://labs.criteo.com/2014/02/kaggle-display-advertising-challenge-dataset/) 数据集介绍：
# 这是criteo-Display Advertising Challenge比赛的部分数据集， 里面有train.csv和test.csv两个文件：
# * train.csv： 训练集由Criteo 7天内的部分流量组成。每一行对应一个由Criteo提供的显示广告。为了减少数据集的大小，正(点击)和负(未点击)的例子都以不同的比例进行了抽样。示例是按时间顺序排列的
# * test.csv: 测试集的计算方法与训练集相同，只是针对训练期之后一天的事件

# 字段说明：
# * Label： 目标变量， 0表示未点击， 1表示点击
# * l1-l13: 13列的数值特征， 大部分是计数特征
# * C1-C26: 26列分类特征， 为了达到匿名的目的， 这些特征的值离散成了32位的数据表示

# 这个比赛的任务就是：开发预测广告点击率(CTR)的模型。给定一个用户和他正在访问的页面，预测他点击给定广告的概率是多少？比赛的地址链接：[https://www.kaggle.com/c/criteo-display-ad-challenge/overview](https://www.kaggle.com/c/criteo-display-ad-challenge/overview)
# <br><br>
# 下面基于GBDT+LR模型完后这个任务。

## 数据导入与简单处理
import numpy as np
import pandas as pd

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import lightgbm as lgb
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder, LabelEncoder
from sklearn.metrics import log_loss
import gc
from scipy import sparse
import warnings
warnings.filterwarnings('ignore')


"""数据读取与预处理"""
# 数据读取
path = 'data/'
df_train = pd.read_csv(path + 'kaggle_train.csv')
df_test = pd.read_csv(path + 'kaggle_test.csv')

# 简单的数据预处理
# 去掉id列， 把测试集和训练集合并， 填充缺失值
df_train.drop(['Id'], axis=1, inplace=True)
df_test.drop(['Id'], axis=1, inplace=True)

df_test['Label'] = -1

data = pd.concat([df_train, df_test])
data.fillna(-1, inplace=True)


"""下面把特征列分开处理"""
continuous_fea = ['I'+str(i+1) for i in range(13)]
category_fea = ['C'+str(i+1) for i in range(26)]


## 建模
# 下面训练三个模型对数据进行预测， 分别是LR模型， GBDT模型和两者的组合模型， 然后分别观察它们的预测效果， 对于不同的模型， 特征会有不同的处理方式如下：
# 1. 逻辑回归模型： 连续特征要归一化处理， 离散特征需要one-hot处理
# 2. GBDT模型： 树模型连续特征不需要归一化处理， 但是离散特征需要one-hot处理
# 3. LR+GBDT模型： 由于LR使用的特征是GBDT的输出， 原数据依然是GBDT进行处理交叉， 所以只需要离散特征one-hot处理


# 下面就通过函数的方式建立三个模型， 并进行训练
### 逻辑回归建模
def lr_model(data, category_fea, continuous_fea):
    # 连续特征归一化
    scaler = MinMaxScaler()
    for col in continuous_fea:
        data[col] = scaler.fit_transform(data[col].values.reshape(-1, 1))
    
    # 离散特征one-hot编码
    for col in category_fea:
        onehot_feats = pd.get_dummies(data[col], prefix=col)
        data.drop([col], axis=1, inplace=True)
        data = pd.concat([data, onehot_feats], axis=1)
    
    # 把训练集和测试集分开
    train = data[data['Label'] != -1]
    target = train.pop('Label')
    test = data[data['Label'] == -1]
    test.drop(['Label'], axis=1, inplace=True)
    
    # 划分数据集
    x_train, x_val, y_train, y_val = train_test_split(train, target, test_size=0.2, random_state=2020)
    
    # 建立模型
    lr = LogisticRegression()
    lr.fit(x_train, y_train)
    tr_logloss = log_loss(y_train, lr.predict_proba(x_train)[:, 1])   # −(ylog(p)+(1−y)log(1−p)) log_loss
    val_logloss = log_loss(y_val, lr.predict_proba(x_val)[:, 1])
    print('tr_logloss: ', tr_logloss)
    print('val_logloss: ', val_logloss)
    
    # 模型预测
    y_pred = lr.predict_proba(test)[:, 1]  # predict_proba 返回n行k列的矩阵，第i行第j列上的数值是模型预测第i个预测样本为某个标签的概率, 这里的1表示点击的概率
    print('predict: ', y_pred[:10]) # 这里看前10个， 预测为点击的概率


### GBDT 建模
def gbdt_model(data, category_fea, continuous_fea):
    
    # 离散特征one-hot编码
    for col in category_fea:
        onehot_feats = pd.get_dummies(data[col], prefix=col)
        data.drop([col], axis=1, inplace=True)
        data = pd.concat([data, onehot_feats], axis=1)
    
    # 训练集和测试集分开
    train = data[data['Label'] != -1]
    target = train.pop('Label')
    test = data[data['Label'] == -1]
    test.drop(['Label'], axis=1, inplace=True)
    
    # 划分数据集
    x_train, x_val, y_train, y_val = train_test_split(train, target, test_size=0.2, random_state=2020)
    
    # 建模
    gbm = lgb.LGBMClassifier(boosting_type='gbdt',  # 这里用gbdt
                             objective='binary', 
                             subsample=0.8,
                             min_child_weight=0.5, 
                             colsample_bytree=0.7,
                             num_leaves=100,
                             max_depth=12,
                             learning_rate=0.01,
                             n_estimators=10000
                            )
    gbm.fit(x_train, y_train, 
            eval_set=[(x_train, y_train), (x_val, y_val)], 
            eval_names=['train', 'val'],
            eval_metric='binary_logloss',
            early_stopping_rounds=100,
           )
    
    tr_logloss = log_loss(y_train, gbm.predict_proba(x_train)[:, 1])   # −(ylog(p)+(1−y)log(1−p)) log_loss
    val_logloss = log_loss(y_val, gbm.predict_proba(x_val)[:, 1])
    print('tr_logloss: ', tr_logloss)
    print('val_logloss: ', val_logloss)
    
    # 模型预测
    y_pred = gbm.predict_proba(test)[:, 1]  # predict_proba 返回n行k列的矩阵，第i行第j列上的数值是模型预测第i个预测样本为某个标签的概率, 这里的1表示点击的概率
    print('predict: ', y_pred[:10]) # 这里看前10个， 预测为点击的概率


### LR + GBDT建模
# 下面就是把上面两个模型进行组合， GBDT负责对各个特征进行交叉和组合， 把原始特征向量转换为新的离散型特征向量， 然后在使用逻辑回归模型
def gbdt_lr_model(data, category_feature, continuous_feature): # 0.43616
    # 离散特征one-hot编码
    for col in category_feature:
        onehot_feats = pd.get_dummies(data[col], prefix = col)
        data.drop([col], axis = 1, inplace = True)
        data = pd.concat([data, onehot_feats], axis = 1)

    train = data[data['Label'] != -1]
    target = train.pop('Label')
    test = data[data['Label'] == -1]
    test.drop(['Label'], axis = 1, inplace = True)

    # 划分数据集
    x_train, x_val, y_train, y_val = train_test_split(train, target, test_size = 0.2, random_state = 2020)

    gbm = lgb.LGBMClassifier(objective='binary',
                            subsample= 0.8,
                            min_child_weight= 0.5,
                            colsample_bytree= 0.7,
                            num_leaves=100,
                            max_depth = 12,
                            learning_rate=0.01,
                            n_estimators=1000,
                            )

    gbm.fit(x_train, y_train,
            eval_set = [(x_train, y_train), (x_val, y_val)],
            eval_names = ['train', 'val'],
            eval_metric = 'binary_logloss',
            early_stopping_rounds = 100,
            )
    
    model = gbm.booster_

    gbdt_feats_train = model.predict(train, pred_leaf = True)
    gbdt_feats_test = model.predict(test, pred_leaf = True)
    gbdt_feats_name = ['gbdt_leaf_' + str(i) for i in range(gbdt_feats_train.shape[1])]
    df_train_gbdt_feats = pd.DataFrame(gbdt_feats_train, columns = gbdt_feats_name) 
    df_test_gbdt_feats = pd.DataFrame(gbdt_feats_test, columns = gbdt_feats_name)

    train = pd.concat([train, df_train_gbdt_feats], axis = 1)
    test = pd.concat([test, df_test_gbdt_feats], axis = 1)
    train_len = train.shape[0]
    data = pd.concat([train, test])
    del train
    del test
    gc.collect()

    # # 连续特征归一化
    scaler = MinMaxScaler()
    for col in continuous_feature:
        data[col] = scaler.fit_transform(data[col].values.reshape(-1, 1))

    for col in gbdt_feats_name:
        onehot_feats = pd.get_dummies(data[col], prefix = col)
        data.drop([col], axis = 1, inplace = True)
        data = pd.concat([data, onehot_feats], axis = 1)

    train = data[: train_len]
    test = data[train_len:]
    del data
    gc.collect()

    x_train, x_val, y_train, y_val = train_test_split(train, target, test_size = 0.3, random_state = 2018)

    
    lr = LogisticRegression()
    lr.fit(x_train, y_train)
    tr_logloss = log_loss(y_train, lr.predict_proba(x_train)[:, 1])
    print('tr-logloss: ', tr_logloss)
    val_logloss = log_loss(y_val, lr.predict_proba(x_val)[:, 1])
    print('val-logloss: ', val_logloss)
    y_pred = lr.predict_proba(test)[:, 1]
    print(y_pred[:10])


# 训练和预测lr模型
lr_model(data.copy(), category_fea, continuous_fea)

# 模型训练和预测GBDT模型
gbdt_model(data.copy(), category_fea, continuous_fea)

# 训练和预测GBDT+LR模型
gbdt_lr_model(data.copy(), category_fea, continuous_fea)