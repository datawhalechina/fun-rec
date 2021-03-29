# 赛题理解
赛题理解是切入一道赛题的基础，会影响后续特征工程和模型构建等各种工作，也影响着后续发展工作的方向，正确了解赛题背后的思想以及赛题业务逻辑的清晰，有利于花费更少时间构建更为有效的特征模型， 在各种比赛中， 赛题理解都是极其重要且必须走好的第一步， 今天我们就从赛题的理解出发， 首先了解一下这次赛题的概况和数据，从中分析赛题以及大致的处理方式， 其次我们了解模型评测的指标，最后对赛题的理解整理一些经验。

## 赛题简介
此次比赛是新闻推荐场景下的用户行为预测挑战赛， 该赛题是以新闻APP中的新闻推荐为背景， 目的是**要求我们根据用户历史浏览点击新闻文章的数据信息预测用户未来的点击行为， 即用户的最后一次点击的新闻文章**， 这道赛题的设计初衷是引导大家了解推荐系统中的一些业务背景， 解决实际问题。 

## 数据概况
该数据来自某新闻APP平台的用户交互数据，包括30万用户，近300万次点击，共36万多篇不同的新闻文章，同时每篇新闻文章有对应的embedding向量表示。为了保证比赛的公平性，从中抽取20万用户的点击日志数据作为训练集，5万用户的点击日志数据作为测试集A，5万用户的点击日志数据作为测试集B。具体数据表和参数， 大家可以参考赛题说明。下面说一下拿到这样的数据如何进行理解， 来有效的开展下一步的工作。
## 评价方式理解
理解评价方式， 我们需要结合着最后的提交文件来看， 根据sample.submit.csv， 我们最后提交的格式是针对每个用户， 我们都会给出五篇文章的推荐结果，按照点击概率从前往后排序。 而真实的每个用户最后一次点击的文章只会有一篇的真实答案， 所以我们就看我们推荐的这五篇里面是否有命中真实答案的。比如对于user1来说， 我们的提交会是：
>user1, article1, article2, article3, article4, article5.

评价指标的公式如下：
$$
score(user) = \sum_{k=1}^5 \frac{s(user, k)}{k}
$$

假如article1就是真实的用户点击文章，也就是article1命中， 则s(user1,1)=1, s(user1,2-4)都是0， 如果article2是用户点击的文章， 则s(user,2)=1/2,s(user,1,3,4,5)都是0。也就是score(user)=命中第几条的倒数。如果都没中， 则score(user1)=0。 这个是合理的， 因为我们希望的就是命中的结果尽量靠前， 而此时分数正好比较高。

## 赛题理解
根据赛题简介，我们首先要明确我们此次比赛的目标： 根据用户历史浏览点击新闻的数据信息预测用户最后一次点击的新闻文章。从这个目标上看， 会发现此次比赛和我们之前遇到的普通的结构化比赛不太一样， 主要有两点：
- 首先是目标上， 要预测最后一次点击的新闻文章，也就是我们给用户推荐的是新闻文章， 并不是像之前那种预测一个数或者预测数据哪一类那样的问题
- 数据上， 通过给出的数据我们会发现， 这种数据也不是我们之前遇到的那种特征+标签的数据，而是基于了真实的业务场景， 拿到的用户的点击日志

所以拿到这个题目，我们的思考方向就是结合我们的目标，**把该预测问题转成一个监督学习的问题(特征+标签)，然后我们才能进行ML，DL等建模预测**。那么我们自然而然的就应该在心里会有这么几个问题：如何转成一个监督学习问题呢？ 转成一个什么样的监督学习问题呢？ 我们能利用的特征又有哪些呢？ 又有哪些模型可以尝试呢？ 此次面对数万级别的文章推荐，我们又有哪些策略呢？ 

当然这些问题不会在我们刚看到赛题之后就一下出来答案， 但是只要有了问题之后， 我们就能想办法解决问题了， 比如上面的第二个问题，转成一个什么样的监督学习问题？  由于我们是预测用户最后一次点击的新闻文章，从36万篇文章中预测某一篇的话我们首先可能会想到这可能是一个多分类的问题(36万类里面选1)， 但是如此庞大的分类问题， 我们做起来可能比较困难， 那么能不能转化一下？ 既然是要预测最后一次点击的文章， 那么如果我们能预测出某个用户最后一次对于某一篇文章会进行点击的概率， 是不是就间接性的解决了这个问题呢？概率最大的那篇文章不就是用户最后一次可能点击的新闻文章吗？ 这样就把原问题变成了一个点击率预测的问题(用户, 文章) --> 点击的概率(软分类)， 而这个问题， 就是我们所熟悉的监督学习领域分类问题了， 这样我们后面建模的时候， 对于模型的选择就基本上有大致方向了，比如最简单的逻辑回归模型。

这样， 我们对于该赛题的解决方案应该有了一个大致的解决思路，要先转成一个分类问题来做， 而分类的标签就是用户是否会点击某篇文章，分类问题的特征中会有用户和文章，我们要训练一个分类模型， 对某用户最后一次点击某篇文章的概率进行预测。 那么又会有几个问题：如何转成监督学习问题？ 训练集和测试集怎么制作？ 我们又能利用哪些特征？ 我们又可以尝试哪些模型？ 面对36万篇文章， 20多万用户的推荐， 我们又有哪些策略来缩减问题的规模？如何进行最后的预测？  

# Baseline

## 导包


```python
# import packages
import time, math, os
from tqdm import tqdm
import gc
import pickle
import random
from datetime import datetime
from operator import itemgetter
import numpy as np
import pandas as pd
import warnings
from collections import defaultdict
warnings.filterwarnings('ignore')
```


```python
data_path = './data_raw/'
save_path = './tmp_results/'
```



## df节省内存函数


```python
# 节约内存的一个标配函数
def reduce_mem(df):
    starttime = time.time()
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    start_mem = df.memory_usage().sum() / 1024**2
    for col in df.columns:
        col_type = df[col].dtypes
        if col_type in numerics:
            c_min = df[col].min()
            c_max = df[col].max()
            if pd.isnull(c_min) or pd.isnull(c_max):
                continue
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
                elif c_min > np.iinfo(np.int64).min and c_max < np.iinfo(np.int64).max:
                    df[col] = df[col].astype(np.int64)
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
                else:
                    df[col] = df[col].astype(np.float64)
    end_mem = df.memory_usage().sum() / 1024**2
    print('-- Mem. usage decreased to {:5.2f} Mb ({:.1f}% reduction),time spend:{:2.2f} min'.format(end_mem,
                                                                                                           100*(start_mem-end_mem)/start_mem,
                                                                                                           (time.time()-starttime)/60))
    return df
```



## 读取采样或全量数据


```python
# debug模式：从训练集中划出一部分数据来调试代码
def get_all_click_sample(data_path, sample_nums=10000):
    """
        训练集中采样一部分数据调试
        data_path: 原数据的存储路径
        sample_nums: 采样数目（这里由于机器的内存限制，可以采样用户做）
    """
    all_click = pd.read_csv(data_path + 'train_click_log.csv')
    all_user_ids = all_click.user_id.unique()

    sample_user_ids = np.random.choice(all_user_ids, size=sample_nums, replace=False) 
    all_click = all_click[all_click['user_id'].isin(sample_user_ids)]
    
    all_click = all_click.drop_duplicates((['user_id', 'click_article_id', 'click_timestamp']))
    return all_click

# 读取点击数据，这里分成线上和线下，如果是为了获取线上提交结果应该讲测试集中的点击数据合并到总的数据中
# 如果是为了线下验证模型的有效性或者特征的有效性，可以只使用训练集
def get_all_click_df(data_path='./data_raw/', offline=True):
    if offline:
        all_click = pd.read_csv(data_path + 'train_click_log.csv')
    else:
        trn_click = pd.read_csv(data_path + 'train_click_log.csv')
        tst_click = pd.read_csv(data_path + 'testA_click_log.csv')

        all_click = trn_click.append(tst_click)
    
    all_click = all_click.drop_duplicates((['user_id', 'click_article_id', 'click_timestamp']))
    return all_click
```


```python
# 全量训练集
all_click_df = get_all_click_df(offline=False)
```



## 获取 用户 - 文章 - 点击时间字典


```python
# 根据点击时间获取用户的点击文章序列   {user1: {item1: time1, item2: time2..}...}
def get_user_item_time(click_df):
    
    click_df = click_df.sort_values('click_timestamp')
    
    def make_item_time_pair(df):
        return list(zip(df['click_article_id'], df['click_timestamp']))
    
    user_item_time_df = click_df.groupby('user_id')['click_article_id', 'click_timestamp'].apply(lambda x: make_item_time_pair(x))\
                                                            .reset_index().rename(columns={0: 'item_time_list'})
    user_item_time_dict = dict(zip(user_item_time_df['user_id'], user_item_time_df['item_time_list']))
    
    return user_item_time_dict
```



## 获取点击最多的Topk个文章


```python
# 获取近期点击最多的文章
def get_item_topk_click(click_df, k):
    topk_click = click_df['click_article_id'].value_counts().index[:k]
    return topk_click
```



## itemCF的物品相似度计算


```python
def itemcf_sim(df):
    """
        文章与文章之间的相似性矩阵计算
        :param df: 数据表
        :item_created_time_dict:  文章创建时间的字典
        return : 文章与文章的相似性矩阵
        思路: 基于物品的协同过滤(详细请参考上一期推荐系统基础的组队学习)， 在多路召回部分会加上关联规则的召回策略
    """
    
    user_item_time_dict = get_user_item_time(df)
    
    # 计算物品相似度
    i2i_sim = {}
    item_cnt = defaultdict(int)
    for user, item_time_list in tqdm(user_item_time_dict.items()):
        # 在基于商品的协同过滤优化的时候可以考虑时间因素
        for i, i_click_time in item_time_list:
            item_cnt[i] += 1
            i2i_sim.setdefault(i, {})
            for j, j_click_time in item_time_list:
                if(i == j):
                    continue
                i2i_sim[i].setdefault(j, 0)
                
                i2i_sim[i][j] += 1 / math.log(len(item_time_list) + 1)
                
    i2i_sim_ = i2i_sim.copy()
    for i, related_items in i2i_sim.items():
        for j, wij in related_items.items():
            i2i_sim_[i][j] = wij / math.sqrt(item_cnt[i] * item_cnt[j])
    
    # 将得到的相似性矩阵保存到本地
    pickle.dump(i2i_sim_, open(save_path + 'itemcf_i2i_sim.pkl', 'wb'))
    
    return i2i_sim_
```


```python
i2i_sim = itemcf_sim(all_click_df)
```



## itemCF 的文章推荐


```python
# 基于商品的召回i2i
def item_based_recommend(user_id, user_item_time_dict, i2i_sim, sim_item_topk, recall_item_num, item_topk_click):
    """
        基于文章协同过滤的召回
        :param user_id: 用户id
        :param user_item_time_dict: 字典, 根据点击时间获取用户的点击文章序列   {user1: {item1: time1, item2: time2..}...}
        :param i2i_sim: 字典，文章相似性矩阵
        :param sim_item_topk: 整数， 选择与当前文章最相似的前k篇文章
        :param recall_item_num: 整数， 最后的召回文章数量
        :param item_topk_click: 列表，点击次数最多的文章列表，用户召回补全        
        return: 召回的文章列表 {item1:score1, item2: score2...}
        注意: 基于物品的协同过滤(详细请参考上一期推荐系统基础的组队学习)， 在多路召回部分会加上关联规则的召回策略
    """
    
    # 获取用户历史交互的文章
    user_hist_items = user_item_time_dict[user_id]
    
    item_rank = {}
    for loc, (i, click_time) in enumerate(user_hist_items):
        for j, wij in sorted(i2i_sim[i].items(), key=lambda x: x[1], reverse=True)[:sim_item_topk]:
            if j in user_hist_items:
                continue
                
            item_rank.setdefault(j, 0)
            item_rank[j] +=  wij
    
    # 不足10个，用热门商品补全
    if len(item_rank) < recall_item_num:
        for i, item in enumerate(item_topk_click):
            if item in item_rank.items(): # 填充的item应该不在原来的列表中
                continue
            item_rank[item] = - i - 100 # 随便给个负数就行
            if len(item_rank) == recall_item_num:
                break
    
    item_rank = sorted(item_rank.items(), key=lambda x: x[1], reverse=True)[:recall_item_num]
        
    return item_rank
```



## 给每个用户根据物品的协同过滤推荐文章


```python
# 定义
user_recall_items_dict = collections.defaultdict(dict)

# 获取 用户 - 文章 - 点击时间的字典
user_item_time_dict = get_user_item_time(all_click_df)

# 去取文章相似度
i2i_sim = pickle.load(open(save_path + 'itemcf_i2i_sim.pkl', 'rb'))

# 相似文章的数量
sim_item_topk = 10

# 召回文章数量
recall_item_num = 10

# 用户热度补全
item_topk_click = get_item_topk_click(all_click_df, k=50)

for user in tqdm(all_click_df['user_id'].unique()):
    user_recall_items_dict[user] = item_based_recommend(user, user_item_time_dict, i2i_sim, 
                                                        sim_item_topk, recall_item_num, item_topk_click)
```



## 召回字典转换成df


```python
# 将字典的形式转换成df
user_item_score_list = []

for user, items in tqdm(user_recall_items_dict.items()):
    for item, score in items:
        user_item_score_list.append([user, item, score])

recall_df = pd.DataFrame(user_item_score_list, columns=['user_id', 'click_article_id', 'pred_score'])
```



## 生成提交文件


```python
# 生成提交文件
def submit(recall_df, topk=5, model_name=None):
    recall_df = recall_df.sort_values(by=['user_id', 'pred_score'])
    recall_df['rank'] = recall_df.groupby(['user_id'])['pred_score'].rank(ascending=False, method='first')
    
    # 判断是不是每个用户都有5篇文章及以上
    tmp = recall_df.groupby('user_id').apply(lambda x: x['rank'].max())
    assert tmp.min() >= topk
    
    del recall_df['pred_score']
    submit = recall_df[recall_df['rank'] <= topk].set_index(['user_id', 'rank']).unstack(-1).reset_index()
    
    submit.columns = [int(col) if isinstance(col, int) else col for col in submit.columns.droplevel(0)]
    # 按照提交格式定义列名
    submit = submit.rename(columns={'': 'user_id', 1: 'article_1', 2: 'article_2', 
                                                  3: 'article_3', 4: 'article_4', 5: 'article_5'})
    
    save_name = save_path + model_name + '_' + datetime.today().strftime('%m-%d') + '.csv'
    submit.to_csv(save_name, index=False, header=True)
```


```python
# 获取测试集
tst_click = pd.read_csv(data_path + 'testA_click_log.csv')
tst_users = tst_click['user_id'].unique()

# 从所有的召回数据中将测试集中的用户选出来
tst_recall = recall_df[recall_df['user_id'].isin(tst_users)]

# 生成提交文件
submit(tst_recall, topk=5, model_name='itemcf_baseline')
```

# 总结

本节内容主要包括赛题简介，数据概况，评价方式以及对该赛题进行了一个总体上的思路分析，作为竞赛前的预热，旨在帮助学习者们能够更好切入该赛题，为后面的学习内容打下一个良好的基础。最后我们给出了关于本赛题的一个简易Baseline， 帮助学习者们先了解一下新闻推荐比赛的一个整理流程， 接下来我们就对于流程中的每个步骤进行详细的介绍。

今天的学习比较简单，下面整理一下关于赛题理解的一些经验：
* 赛题理解究竟是在理解什么? 
	
>**理解赛题**：从直观上对问题进行梳理， 分析问题的目标，到底要让做什么事情, **这个非常重要**
>
>**理解数据**：对赛题数据有一个初步了解，知道和任务相关的数据字段和数据字段的类型， 数据之间的内在关联等，大体梳理一下哪些数据会对我们解决问题非常有用，方便后面我们的数据分析和特征工程。
>
>**理解评估指标**：评估指标是检验我们提出的方法，我们给出结果好坏的标准，只有正确的理解了评估指标，我们才能进行更好的训练模型，更好的进行预测。此外，很多情况下，线上验证是有一定的时间和次数限制的，**所以在比赛中构建一个合理的本地的验证集和验证的评价指标是很关键的步骤，能有效的节省很多时间**。 不同的指标对于同样的预测结果是具有误差敏感的差异性的所以不同的评价指标会影响后续一些预测的侧重点。

* 有了赛题理解之后，我们该做什么？
	
	>在对于赛题有了一定的了解后，分析清楚了问题的类型性质和对于数据理解 的这一基础上，我们可以梳理一个解决赛题的一个大题思路和框架
	>
	>我们至少要有一些相应的理解分析，比如**这题的难点可能在哪里，关键点可能在哪里，哪些地方可以挖掘更好的特征**.
	>
	>用什么样得线下验证方式更为稳定，**出现了过拟合或者其他问题，估摸可以用什么方法去解决这些问题**
	>
	
	这时是在一个宏观的大体下分析的，有助于摸清整个题的思路脉络，以及后续的分析方向

**关于Datawhale：** Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和人与未来的联结。 本次数据挖掘路径学习，专题知识将在天池分享，详情可关注Datawhale：

![image-20201119112159065](http://ryluo.oss-cn-chengdu.aliyuncs.com/abc/image-20201119112159065.png)





