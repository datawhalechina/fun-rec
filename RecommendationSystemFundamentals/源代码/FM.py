import pandas as pd
import numpy as np 

from tensorflow.keras import *
from tensorflow.keras.layers import *
from tensorflow.keras.models import *
from tensorflow.keras.callbacks import *
import tensorflow.keras.backend as K

from sklearn.model_selection import train_test_split
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm

# dense特征取对数　　sparse特征进行类别编码
def process_feat(data, dense_feats, sparse_feats):
    df = data.copy()
    # dense
    df_dense = df[dense_feats].fillna(0.0)
    for f in tqdm(dense_feats):
        df_dense[f] = df_dense[f].apply(lambda x: np.log(1 + x) if x > -1 else -1)
    
    # sparse
    df_sparse = df[sparse_feats].fillna('-1')
    for f in tqdm(sparse_feats):
        lbe = LabelEncoder()
        df_sparse[f] = lbe.fit_transform(df_sparse[f])
    
    df_new = pd.concat([df_dense, df_sparse], axis=1)
    return df_new

# FM 特征组合层
class crossLayer(layers.Layer):
    def __init__(self,input_dim, output_dim=10, **kwargs):
        super(crossLayer, self).__init__(**kwargs)

        self.input_dim = input_dim
        self.output_dim = output_dim
        # 定义交叉特征的权重
        self.kernel = self.add_weight(name='kernel', 
                                     shape=(self.input_dim, self.output_dim),
                                     initializer='glorot_uniform',
                                     trainable=True)
        
    def call(self, x): # 对照上述公式中的二次项优化公式一起理解
        a = K.pow(K.dot(x, self.kernel), 2)
        b = K.dot(K.pow(x, 2), K.pow(self.kernel, 2))
        return 0.5 * K.mean(a-b, 1, keepdims=True)

# 定义FM模型
def FM(feature_dim):
    inputs = Input(shape=(feature_dim, ))
    
    # 一阶特征
    linear = Dense(units=1, 
                   kernel_regularizer=regularizers.l2(0.01), 
                   bias_regularizer=regularizers.l2(0.01))(inputs)
    
    # 二阶特征
    cross = crossLayer(feature_dim)(inputs)
    add = Add()([linear, cross])  # 将一阶特征与二阶特征相加构建FM模型
    
    pred = Activation('sigmoid')(add)
    model = Model(inputs=inputs, outputs=pred)
    
    model.summary()    
    model.compile(loss='binary_crossentropy',
                  optimizer=optimizers.Adam(),
                  metrics=['binary_accuracy'])
    
    return model    


# 读取数据
print('loading data...')
data = pd.read_csv('./data/kaggle_train.csv')

# dense 特征开头是I，sparse特征开头是C，Label是标签
cols = data.columns.values
dense_feats = [f for f in cols if f[0] == 'I']
sparse_feats = [f for f in cols if f[0] == 'C']

# 对dense数据和sparse数据分别处理
print('processing features')
feats = process_feat(data, dense_feats, sparse_feats)

# 划分训练和验证数据
x_trn, x_tst, y_trn, y_tst = train_test_split(feats, data['Label'], test_size=0.2, random_state=2020)

# 定义模型
model = FM(feats.shape[1])

# 训练模型
model.fit(x_trn, y_trn, epochs=10, batch_size=128, validation_data=(x_tst, y_tst))