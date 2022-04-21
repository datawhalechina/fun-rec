本文属于新闻推荐实战-召回阶段-DSSM召回模型。区别于策略召回，基于向量召回也是目前工业界常用的一种召回方法。这里我们将介绍一个比较经典的召回模型DSSM，希望读者可以快速的掌握模型原理以及细节，同时可以了解具体的实践过程。

## **DSSM模型结构及原理**

召回阶段不同于精排部分，召回模型会棉铃巨大的候选item，像淘宝、抖音等场景中召回候选item通常是千万乃至亿级别，对于精排模型显然是无法招架的。这不仅仅是因为召回模型相比精排模型更加简单，其中更重要的是不需要线上对所有候选item进行计算，一般都是会在离线为item计算embeding建索引。这是因为无论对于用户A还是用户B，面对的item embedding都不会有区别，所以可以离线对所有的物料提前通过模型计算得到item embedding，当用户上线时，只需要在线计算用户embedding即可，然后通过ANN（Approximate Nearest Neighbor Search）对构建好的item embeding索引的进行检索便可以快速召回相似的topK个item。    

### **原理**

DSSM(Deep Structured Semantic Model)是由微软研究院于CIKM在2013年提出的一篇工作，该模型主要用来解决NLP领域语义相似度任务，利用深度神经网络将文本表示为低维度的向量，用来提升搜索场景下文档和query匹配的问题。DSSM 模型的原理主要是：通过用户搜索行为中query 和 doc 的日志数据，通过深度学习网络将query和doc映射到到共同维度的语义空间中，通过最大化query和doc语义向量之间的余弦相似度，从而训练得到隐含语义模型，即 query 侧特征的 embedding 和 doc 侧特征的 embedding，进而可以获取语句的低维语义向量表达 sentence embedding，可以预测两句话的语义相似度。

而在推荐系统中，最为关键的是如何做好用户与item的匹配问题，因此对于推荐系统中DSSM模型的则是为 user 和 item 分别构建独立的子网络塔式结构，利用user和item的曝光或点击日期进行训练，最终得到user侧的embedding和item侧的embedding。

### **DSSM 模型结构**

![image-20220224100424897](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20220224100424897.png)

上图是DSSM模型的结构，该网络结构比较简单，是一个由几层DNN组成网络，我们将要搜索文本(Query)和要匹配的文本(Document)的 embedding 输入到网络，网络输出为 128 维的向量，然后通过向量之间计算余弦相似度来计算向量之间距离，可以看作每一个 query 和 document 之间相似分数，然后在做 softmax。 

对于模型的输入术语向量（term vector）(可以被视为信息检索中的原始词袋特性)的大小与用于索引Web文档集合的词汇表的大小相同。在真实的Web搜索任务中，词汇量通常非常大。因此，当使用term vector作为输入时，神经网络的输入层的大小对于推理和模型训练是无法控制的。为了解决这个问题，我们为DNN的第一层开发了一种叫做单词哈希的方法，具体是Word Hashing的方法(由于这主要是NLP中的内容，与本内容不是很相关，具体的可以查看[论文](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/cikm2013_DSSM_fullversion.pdf))。

以上主要是DSSM的大致内容，将其用到推荐的召回中会存在着一些区别以及需要注意的地方。

### **推荐领域中的双塔模型**

下面将简单的介绍一下各大厂在双塔部分的实际应用，具体内容如下：

#### **朴素的 DSSM 双塔模型**

该模型主要是将上述模型中的两个“塔”改为独立的 user 和 item 两个子网络，大概结构如下：

![img](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片v2-f7ecbf1faf7899c6e2999182055470fb_720w.jpg)

其结构非常简单，如上图所示，左侧是用户塔，右侧是Item塔。在用户侧结构中，其输入为用户侧特征（用户画像信息、统计属性以及历史行为序列等）；在用户侧结构中，其输入为Item相关特征（Item基本信息、属性信息等）。对于这两个塔本身，则是经典的DNN模型，在训练过程中，其输入由特征OneHot到特征Embedding，再经过几层DNN隐层，两个塔分别输出user embedding和item embedding，最后这两个embedding做内积或者Cosine相似度计算，使得user和item在embedding映射到共同维度的语义空间中。



### **SENet 双塔模型**

该模型主要的改进是在user塔和Item塔的特征Embedding层上，各自加入一个SENet模块，借助SENet网络用来动态地学习特征的重要性，根据得到的特征权重与对应特征的embedding相乘，进而达到放大重要特征或抑制无效特征的目的，模型大致结构如下所示：

![img](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片v2-8766fee1b442ed17111d5822033f960f_720w.jpg)

其模型和朴素DSSM模型的区别在于多加了一个SENet网络，该网络主要是将特征的 embedding 通过 Squeeze 和Excitation 两个阶段得到一个权重向量，在用该向量与特征的embeding对应为相乘，挑选出最要特征之后在进入到朴素的DSSM网络中。 而 SENet 之所以起作用的原因，张俊林老师的解释是 SENet 可以突出那些对高层 User embedding 和 Item embedding 的特征交叉起重要作用的特征，更有利于表达两侧的特征交互，避免单侧无效特征经过DNN双塔非线性融合时带来的噪声，同时又带有非线性的作用。关于SENet网络详细内容可以查看[原文](https://arxiv.org/abs/1709.01507)



### **Youtube的双塔模型**

该模型是Youtube于2019年在RecSys发表的一篇工作，这个模型从结构上来看是最普通的双塔。左边是user塔，输入包括两部分，第一部分是user当前正在观看的视频的特征，第二部分user的特征是用户历史行为的统计量，例如用户最近观看的N条视频的id embedding均值，这两部分融合起来一起输入user侧的输入。右边是item塔，将候选视频的特征作为输入，计算item的 embedding。之后也是再计算两侧embedding的相似度，进行学习。 模型的大致结构如下所示：

![image-20220224100307472](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20220224100307472.png)

对于该模型，重点并不在于结构上的改变，而是对于负采样问题。因为召回的过程可以被视为是一个多分类问题，模型的输出层选择softmax计算后再计算交叉熵损失。但问题是当候选item特别多的时候，无法对所有的item进行softmax，因此通常的做法是随机从全量item中采样出一个batch的item进行softmax。但是使用batch内的样本作为彼此负样本会带来非常大的偏置问题，即对于热门的样本，被当作负样本的概率更高，因此该模型的贡献在于如何减小batch内负采样所带来的偏置问题？ 关于paper的详细内容可以查看[原文](https://dl.acm.org/doi/10.1145/3298689.3346996)

### **召回模型的负样本**

相比于排序模型而言，召回阶段的模型除了在结构上的不同，在样本选择方面也存在着很大的差异，可以说样本的选择很大程度上会影响召回模型的效果。对于召回模型而言，其负样本并不能和排序模型一样只使用展现未点击样本，因为召回模型在线上面临的数据分布是全部的item，而不仅仅是展现未点击样本。因此在离线训练时，需要让其保证和线上分布尽可能一致，所以在负样本的选择样要尽可能的增加很多未被曝光的item。

下面简单的介绍一些常见的采样方法。

#### **全局随机采样**

全局随机采样指：从全局候选item里面随机抽取一定数量item做为召回模型的负样本。这样的方式实现简单，也可以让模型尽可能的和线上保持一致的分布，尽可能的多的让模型对于全局item有区分的能力。例如YoutubeDNN算法。

但这样的方式也会存在一定的问题，由于候选的item属于长尾数据，即“八二定律”，也就是说少数热门物料占据了绝大多数的曝光与点击。因此存随机的方式只能让模型在学到粗粒度上差异，对一些尾部item并不友好。



#### **全局随机采样 + 热门打压**

针对于全局随机采样的不足，一个直观的方法是针对于item的热度item进行打压，即对于热门的item很多用户可能会点击，需要进行一定程度的欠采样，使得模型更加关注一些非热门的item。  此外在进行负样本采样时，应该对一些热门item进行适当的过采样，这可以尽可能的让模型对于负样本有更加细粒度的区分。例如在word2vec中，负采样方法是根据word的频率，对 negative words进行随机抽样，降低 negative words 量级。

之所以热门item做负样本时，要适当过采样，增加负样本难度。因为对于全量的item，模型可以轻易的区分一些和用户兴趣差异性很大的item，难点在于很难区分一些和用户兴趣相似的item。因此在训练模型时，需要适当的增加一些难以区分的负样本来提升模型面对相似item的分区能力。



#### **Hard Negative增强样本**

Hard Negative指的是选取一部分匹配度适中的item，能够增加模型在训练时的难度，提升模型能学习到item之间细粒度上的差异。至于如何选取在工业界也有很多的解决方案。

例如Airbnb根据业务逻辑来采样一些hard negative （增加与正样本同城的房间作为负样本，增强了正负样本在地域上的相似性；增加与正样本同城的房间作为负样本，增强了正负样本在地域上的相似性，），详细内容可以查看[原文](https://www.kdd.org/kdd2018/accepted-papers/view/real-time-personalization-using-embeddings-for-search-ranking-at-airbnb)

例如百度和facebook依靠模型自己来挖掘Hard Negative，都是用上一版本的召回模型筛选出"没那么相似"的<user,item>对，作为额外负样本，用于训练下一版本召回模型。 详细可以查看[Mobius](http://research.baidu.com/Public/uploads/5d12eca098d40.pdf) 和 [EBR](https://arxiv.org/pdf/2006.11632.pdf)



## **基于Deepmatch的DSSM使用方法**

这次实验使用的数据集是采样的一个数据集，利用Deepmatch库来使用一下DSSM召回模型。该模型的实现主要参考：DeepCtr和DeepMatch模块。

### **模型训练数据**

1、数据预处理

  用户侧主要包含一些用户画像属性（用户性别，年龄，所在省市，使用设备及系统）；新闻侧主要包括新闻的创建时间，题目，所属一级、二级类别，题片个数以及关键词。下面主要是对着两部分数据的简单处理：

```python

  def proccess(file):

   if file=="user_info_data_5w.csv":

     data = pd.read_csv(file_path + file, sep="\t",index_col=0)

     data["age"] = data["age"].map(lambda x: get_pro_age(x))

     data["gender"] = data["gender"].map(lambda x: get_pro_age(x))



     data["province"]=data["province"].fillna(method='ffill')

     data["city"]=data["city"].fillna(method='ffill')



     data["device"] = data["device"].fillna(method='ffill')

     data["os"] = data["os"].fillna(method='ffill')

     return data

   elif file=="doc_info.txt": 

     data = pd.read_csv(file_path + file, sep="\t")

     data.columns = ["article_id", "title", "ctime", "img_num","cate","sub_cate", "key_words"]

     select_column = ["article_id", "title_len", "ctime", "img_num","cate","sub_cate", "key_words"]

    

     # 去除时间为nan的新闻以及除脏数据

     data= data[(data["ctime"].notna()) & (data["ctime"] != 'Android')]

     data['ctime'] = data['ctime'].astype('str')

     data['ctime'] = data['ctime'].apply(lambda x: int(x[:10])) 

     data['ctime'] = pd.to_datetime(data['ctime'], unit='s', errors='coerce')



    # 这里存在nan字符串和异常数据

     data["sub_cate"] = data["sub_cate"].astype(str) 

     data["sub_cate"] = data["sub_cate"].apply(lambda x: pro_sub_cate(x))  

     data["img_num"] = data["img_num"].astype(str)  

     data["img_num"] = data["img_num"].apply(photoNums)

     data["title_len"] = data["title"].apply(lambda x: len(x) if isinstance(x, str) else 0)

     data["cate"] = data["cate"].fillna('其他')  

     return data[select_column]

```



2、构造训练样本

  该部分主要是根据用户的交互日志中前6天的数据作为训练集，第7天的数据作为测试集，来构造模型的训练测试样本。

```python

  def dealsample(file, doc_data, user_data, s_data_str = "2021-06-24 00:00:00", e_data_str="2021-06-30 23:59:59", neg_num=5):

    # 先处理时间问题 

    data = pd.read_csv(file_path + file, sep="\t",index_col=0)

    data['expo_time'] = data['expo_time'].astype('str')

    data['expo_time'] = data['expo_time'].apply(lambda x: int(x[:10])) 

    data['expo_time'] = pd.to_datetime(data['expo_time'], unit='s', errors='coerce')



    s_date = datetime.datetime.strptime(s_data_str,"%Y-%m-%d %H:%M:%S")

    e_date = datetime.datetime.strptime(e_data_str,"%Y-%m-%d %H:%M:%S") + datetime.timedelta(days=-1)

    t_date = datetime.datetime.strptime(e_data_str,"%Y-%m-%d %H:%M:%S")



  # 选取训练和测试所需的数据

    all_data_tmp = data[(data["expo_time"]>=s_date) & (data["expo_time"]<=t_date)]



  # 处理训练数据集  防止穿越样本

  # 1. merge 新闻信息，得到曝光时间和新闻创建时间； inner join 去除doc_data之外的新闻

   all_data_tmp = all_data_tmp.join(doc_data.set_index("article_id"),on="article_id",how='inner')



  # 发现还存在 ctime大于expo_time的交互存在  去除这部分错误数据

   all_data_tmp = all_data_tmp[(all_data_tmp["ctime"]<=all_data_tmp["expo_time"])]



  # 2. 去除与新闻的创建时间在测试数据时间内的交互  ()

   train_data = all_data_tmp[(all_data_tmp["expo_time"]>=s_date) & (all_data_tmp["expo_time"]<=e_date)]

   train_data = train_data[(train_data["ctime"]<=e_date)]

  

   print("有效的样本数：",train_data["expo_time"].count())



  # 负采样

   if os.path.exists(file_path + "neg_sample.pkl") and os.path.getsize(file_path + "neg_sample.pkl"):

     neg_samples = pd.read_pickle(file_path + "neg_sample.pkl")

    # train_neg_samples.insert(loc=2, column="click", value=[0] * train_neg_samples["user_id"].count())

   else:

    # 进行负采样的时候对于样本进行限制，只对一定时间范围之内的样本进行负采样

    doc_data_tmp = doc_data[(doc_data["ctime"]>=datetime.datetime.strptime("2021-06-01 00:00:00","%Y-%m-%d %H:%M:%S"))]

    neg_samples = negSample_like_word2vec(train_data, doc_data_tmp[["article_id"]].values, user_data[["user_id"]].values, neg_num=neg_num)

    neg_samples = pd.DataFrame(neg_samples, columns= ["user_id","article_id","click"]) 

    neg_samples.to_pickle(file_path + "neg_sample.pkl")



   train_pos_samples = train_data[train_data["click"] == 1][["user_id","article_id", "expo_time", "click"]]   # 取正样本 

   neg_samples_df = train_data[train_data["click"] == 0][["user_id","article_id", "click"]]

   train_neg_samples = pd.concat([neg_samples_df.sample(n=train_pos_samples["click"].count()) ,neg_samples],axis=0)  # 取负样本  

   print("训练集正样本数：",train_pos_samples["click"].count())

   print("训练集负样本数：",train_neg_samples["click"].count())



   train_data_df = pd.concat([train_neg_samples,train_pos_samples],axis=0) 

   train_data_df = train_data_df.sample(frac=1)  # shuffle

   print("训练集总样本数：",train_data_df["click"].count())

   test_data_df =  all_data_tmp[(all_data_tmp["expo_time"]>e_date) & (all_data_tmp["expo_time"]<=t_date)][["user_id","article_id", "expo_time", "click"]]

   print("测试集总样本数：",test_data_df["click"].count())

   print("测试集总样本数：",test_data_df["click"].count())

   all_data_df =  pd.concat([train_data_df, test_data_df],axis=0) 

   print("总样本数：",all_data_df["click"].count())

   return all_data_df

```



3、负样本采样

  该部分主要采用基于item的展现次数对全局item进行负采样。

```python

  def negSample_like_word2vec(train_data, all_items, all_users, neg_num=10):

  """

  为所有item计算一个采样概率，根据概率为每个用户采样neg_num个负样本，返回所有负样本对

1. 统计所有item在交互中的出现频次

2. 根据频次进行排序，并计算item采样概率（频次出现越多，采样概率越低，打压热门item）

3. 根据采样概率，利用多线程为每个用户采样 neg_num 个负样本

  """  

  pos_samples = train_data[train_data["click"] == 1][["user_id","article_id"]]

  pos_samples_dic = {}

  for idx,u in enumerate(pos_samples["user_id"].unique().tolist()):

    pos_list = list(pos_samples[pos_samples["user_id"] == u]["article_id"].unique().tolist())

    if len(pos_list) >= 30:  # 30是拍的  需要数据统计的支持确定

      pos_samples_dic[u] = pos_list[30:]

    else:

      pos_samples_dic[u] = pos_list

      

  # 统计出现频次

  article_counts = train_data["article_id"].value_counts()

  df_article_counts = pd.DataFrame(article_counts)

  dic_article_counts = dict(zip(df_article_counts.index.values.tolist(),df_article_counts.article_id.tolist()))



  for item in all_items: 

    if item[0] not in dic_article_counts.keys():

      dic_article_counts[item[0]] = 0



  # 根据频次排序, 并计算每个item的采样概率

  tmp = sorted(list(dic_article_counts.items()), key=lambda x:x[1], reverse=True)  # 降序

  n_articles = len(tmp)

  article_prob = {}

  for idx, item in enumerate(tmp):

    article_prob[item[0]] = cal_pos(idx, n_articles) 



  # 为每个用户进行负采样

  article_id_list = [a[0] for a in article_prob.items()]

  article_pro_list = [a[1] for a in article_prob.items()]

  pos_sample_users = list(pos_samples_dic.keys()) 



  all_users_list = [u[0] for u in all_users]



  print("start negative sampling !!!!!!")

  pool = multiprocessing.Pool(core_size)

  res = pool.map(SampleOneProb((pos_sample_users,article_id_list,article_pro_list,pos_samples_dic,neg_num)), tqdm(all_users_list))

  pool.close()

  pool.join() 



  neg_sample_dic = {}

  for idx, u in tqdm(enumerate(all_users_list)):

    neg_sample_dic[u] = res[idx] 

 

  return [[k,i,0] for k,v in neg_sample_dic.items() for i in v]

```



### **模型训练**



1、稀疏特征编码

  该部分主要是针对于用户侧和新闻侧的稀疏特征进行编码，并将训练样本join上两侧的特征。



```python

  # 数据和测试数据 

  data, user_data, doc_data = get_all_data()  



  # 1.Label Encoding for sparse features,and process sequence features with `gen_date_set` and `gen_model_input`

  feature_max_idx = {} 

  feature_encoder = {}  



  user_sparse_features = ["user_id", "device", "os", "province", "city", "age", "gender"]

  for feature in user_sparse_features:

    lbe = LabelEncoder()

    user_data[feature] = lbe.fit_transform(user_data[feature]) + 1

    feature_max_idx[feature] = user_data[feature].max() + 1

    feature_encoder[feature] = lbe

  



  doc_sparse_features = ["article_id", "cate", "sub_cate"]

  doc_dense_features = ["title_len", "img_num"]



  for feature in doc_sparse_features:

    lbe = LabelEncoder()

    if feature in ["cate","sub_cate"]:

      # 这里面会出现一些float的数据，导致无法编码

      doc_data[feature] = lbe.fit_transform(doc_data[feature].astype(str)) + 1

    else:

      doc_data[feature] = lbe.fit_transform(doc_data[feature]) + 1

    feature_max_idx[feature] = doc_data[feature].max() + 1

    feature_encoder[feature] = lbe

  data["article_id"] = feature_encoder["article_id"].transform(data["article_id"].tolist())

  data["user_id"] = feature_encoder["user_id"].transform(data["user_id"].tolist())

  # join 用户侧和新闻侧的特征

  data = data.join(user_data.set_index("user_id"), on="user_id", how="inner")

  data = data.join(doc_data.set_index("article_id"), on="article_id", how="inner")



  sparse_features = user_sparse_features + doc_sparse_features

  dense_features = doc_dense_features



  features = sparse_features + dense_features



  mms = MinMaxScaler(feature_range=(0, 1))

  data[dense_features] = mms.fit_transform(data[dense_features])

```



2、配置特征以及模型训练

  基于DeepMatch库，构建模型所需的输入特征，同时构建DSSM模型及训练。

```python

  embedding_dim = 8

  user_feature_columns = [SparseFeat('user_id', feature_max_idx['user_id'], embedding_dim),

              SparseFeat("gender", feature_max_idx['gender'], embedding_dim),

              SparseFeat("age", feature_max_idx['age'], embedding_dim),

              SparseFeat("device", feature_max_idx['device'], embedding_dim),

              SparseFeat("os", feature_max_idx['os'], embedding_dim),

              SparseFeat("province", feature_max_idx['province'], embedding_dim),

              SparseFeat("city", feature_max_idx['city'], embedding_dim),  ]



  item_feature_columns = [SparseFeat('article_id', feature_max_idx['article_id'], embedding_dim),

              DenseFeat('img_num', 1),

              DenseFeat('title_len', 1),

​              SparseFeat('cate', feature_max_idx['cate'], embedding_dim),

​              SparseFeat('sub_cate', feature_max_idx['sub_cate'], embedding_dim)]



  model = DSSM(user_feature_columns, item_feature_columns,

​          user_dnn_hidden_units=(32, 16, embedding_dim), item_dnn_hidden_units=(32, 16, embedding_dim))  # FM(user_feature_columns,item_feature_columns)



  model.compile(optimizer="adagrad", loss = "binary_crossentropy", metrics=[tf.keras.metrics.Recall(), tf.keras.metrics.Precision()] ) # 



  history = model.fit(train_model_input, train_label, batch_size=256, epochs=4, verbose=1, validation_split=0.2, )

```



3、生成embedding用于召回

  利用训练过的模型获取所有item的embeddings，同时获取所有测试集的user embedding，保存之后用于之后的召回工作。

```python

  all_item_model_input = {"article_id": item_profile['article_id'].values,

              "img_num": item_profile['img_num'].values,

              "title_len": item_profile['title_len'].values,

              "cate": item_profile['cate'].values,

              "sub_cate": item_profile['sub_cate'].values,}



  user_embedding_model = Model(inputs=model.user_input, outputs=model.user_embedding)

  item_embedding_model = Model(inputs=model.item_input, outputs=model.item_embedding)

  user_embs = user_embedding_model.predict(test_user_model_input, batch_size=2 ** 12)

  item_embs = item_embedding_model.predict(all_item_model_input, batch_size=2 ** 12)



  user_idx_2_rawid, doc_idx_2_rawid = {}, {}



  for i in range(len(user_embs)):

    user_idx_2_rawid[i] = test_user_model_input["user_id"][i]

  for i in range(len(item_embs)):

    doc_idx_2_rawid[i] = all_item_model_input["article_id"][i]

  # 保存一份

  pickle.dump((user_embs, user_idx_2_rawid, feature_encoder["user_id"]), open(file_path + 'user_embs.pkl', 'wb'))

  pickle.dump((item_embs, doc_idx_2_rawid, feature_encoder["article_id"]), open(file_path + 'item_embs.pkl', 'wb'))

```

### **ANN召回**

1、为测试集用户召回

  通过annoy tree为所有的item构建索引，并通过测试集中所有的user embedding为每个用户召回一定数量的item。



```python

def get_DSSM_recall_res(user_embs, doc_embs, user_idx_2_rawid, doc_idx_2_rawid, topk):

  """近邻检索，这里用annoy tree"""

  # 把doc_embs构建成索引树

  f = user_embs.shape[1]

  t = AnnoyIndex(f, 'angular')

  for i, v in enumerate(doc_embs):

    t.add_item(i, v)

  t.build(10) 

  

  # 每个用户向量， 返回最近的TopK个item

  user_recall_items_dict = collections.defaultdict(dict)

  for i, u in enumerate(user_embs):

    recall_doc_scores = t.get_nns_by_vector(u, topk, include_distances=True)

    # recall_doc_scores是(([doc_idx], [scores]))， 这里需要转成原始doc的id

    raw_doc_scores = list(recall_doc_scores)

    raw_doc_scores[0] = [doc_idx_2_rawid[i] for i in raw_doc_scores[0]]

    # 转换成实际用户id

    user_recall_items_dict[user_idx_2_rawid[i]] = dict(zip(*raw_doc_scores))

  user_recall_items_dict = {k: sorted(v.items(), key=lambda x: x[1], reverse=True) for k, v in user_recall_items_dict.items()}

  pickle.dump(user_recall_items_dict, open(file_path + 'DSSM_u2i_dict.pkl', 'wb'))

  return user_recall_items_dict 

```



2、测试召回结果

  为测试集用户的召回结果进行测试。

```python

  user_recall_items_dict = get_DSSM_recall_res(user_embs, item_embs, user_idx_2_rawid, doc_idx_2_rawid, topk=TOP_NUM)

  test_true_items = {line[0]:line[1] for line in test_set}

  s = []

  precision = []

  for i, uid in tqdm(enumerate(list(user_recall_items_dict.keys()))):

    # try:

    pred = [x for x, _ in user_recall_items_dict[uid]]

    filter_item = None

    recall_score = recall_N(test_true_items[uid], pred, N=TOP_NUM)

    s.append(recall_score)

    precision_score = precision_N(test_true_items[uid], pred, N=TOP_NUM)

    precision.append(precision_score) 

  print("recall", np.mean(s))

  print("precision", np.mean(precision))

```

以上就是整个DSSM使用的整体流程，这里我用了简单的recall@N和precision@N来评估，下面是top 200的结果：

![image-20220224112507543](C:\Users\18502\AppData\Roaming\Typora\typora-user-images\image-20220224112507543.png)

上述的结果不好，主要的原因在于数据量太少，样本不充足导致模型本身训练的不好，进而不能得到更好的向量表示。

### **参考**

- [Mobius](http://research.baidu.com/Public/uploads/5d12eca098d40.pdf)

- [EBR](https://arxiv.org/pdf/2006.11632.pdf)

- [负样本为王：评Facebook的向量化召回算法](https://zhuanlan.zhihu.com/p/165064102)

- [airbnb](https://www.kdd.org/kdd2018/accepted-papers/view/real-time-personalization-using-embeddings-for-search-ranking-at-airbnb)

- [召回模型中的负样本构造](https://zhuanlan.zhihu.com/p/358450850)

- [Youtube双塔模型](https://dl.acm.org/doi/10.1145/3298689.3346996) 

- [DSSM](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/cikm2013_DSSM_fullversion.pdf)

- [SENet双塔模型：在推荐领域召回粗排的应用及其它](https://zhuanlan.zhihu.com/p/358779957)
