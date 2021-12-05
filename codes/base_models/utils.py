from collections import namedtuple

# 使用具名元组定义特征标记
SparseFeat = namedtuple('SparseFeat', ['name', 'vocabulary_size', 'embedding_dim'])
DenseFeat = namedtuple('DenseFeat', ['name', 'dimension'])
VarLenSparseFeat = namedtuple('VarLenSparseFeat', ['name', 'vocabulary_size', 'embedding_dim', 'maxlen'])

#产生多任务学习模型的数据 工具函数
def get_mtl_data():
    import pandas as pd
    from sklearn.preprocessing import  MinMaxScaler, LabelEncoder
    from deepctr.feature_column import SparseFeat, DenseFeat,get_feature_names

    CENSUS_COLUMNS = ['age','workclass','fnlwgt','education','education_num','marital_status','occupation','relationship','race','gender','capital_gain','capital_loss','hours_per_week','native_country','income_bracket']
    df_train = pd.read_csv('./data/adult_train.csv',header=None,names=CENSUS_COLUMNS)
    df_test = pd.read_csv('./data/adult_test.csv',header=None,names=CENSUS_COLUMNS)
    data = pd.concat([df_train, df_test], axis=0)
    #构造两个label
    data['label_income'] = data['income_bracket'].map({' >50K.':1, ' >50K':1, ' <=50K.':0, ' <=50K':0})
    data['label_marital'] = data['marital_status'].apply(lambda x: 1 if x==' Never-married' else 0)
    data.drop(labels=['marital_status', 'income_bracket'], axis=1, inplace=True)

    #构造dict输入
    #define dense and sparse features
    columns = data.columns.values.tolist()
    dense_features = ['fnlwgt', 'education_num', 'capital_gain', 'capital_loss', 'hours_per_week']
    sparse_features = [col for col in columns if col not in dense_features and col not in ['label_income', 'label_marital']]

    data[sparse_features] = data[sparse_features].fillna('-1', )
    data[dense_features] = data[dense_features].fillna(0, )
    mms = MinMaxScaler(feature_range=(0, 1))
    data[dense_features] = mms.fit_transform(data[dense_features])
        
    for feat in sparse_features:
        lbe = LabelEncoder()
        data[feat] = lbe.fit_transform(data[feat])
        
    fixlen_feature_columns = [SparseFeat(feat, data[feat].max()+1, embedding_dim=16)for feat in sparse_features] \
    + [DenseFeat(feat, 1,) for feat in dense_features]

    dnn_feature_columns = fixlen_feature_columns

    feature_names = get_feature_names(dnn_feature_columns)

    n_train = df_train.shape[0]
    train = data[:n_train]
    test = data[n_train:]
    train_model_input = {name: train[name] for name in feature_names}
    test_model_input = {name: test[name] for name in feature_names}
    y_list = [data['label_income'].values[:n_train], data['label_marital'].values[:n_train]]

    return dnn_feature_columns, train_model_input, test_model_input, y_list