import pandas as pd
import numpy as np
import warnings
import random, math, os
from tqdm import tqdm
from sklearn.model_selection import train_test_split
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
    # 读取数据
    rnames = ['user_id','movie_id','rating','timestamp']
    ratings = pd.read_csv(os.path.join(root_path, 'ratings.dat'), sep='::', engine='python', names=rnames)
    
    # 分割训练和验证集
    trn_data, val_data, _, _ = train_test_split(ratings, ratings, test_size=0.2)
    
    trn_data = trn_data.groupby('user_id')['movie_id'].apply(list).reset_index()
    val_data = val_data.groupby('user_id')['movie_id'].apply(list).reset_index()

    trn_user_items = {}
    val_user_items = {}
    
    # 将数组构造成字典的形式{user_id: [item_id1, item_id2,...,item_idn]}
    for user, movies in zip(*(list(trn_data['user_id']), list(trn_data['movie_id']))):
        trn_user_items[user] = set(movies)

    for user, movies in zip(*(list(val_data['user_id']), list(val_data['movie_id']))):
        val_user_items[user] = set(movies)
    
    return trn_user_items, val_user_items

def Item_CF(trn_user_items, val_user_items, K, N):
    '''
    trn_user_items: 表示训练数据，格式为：{user_id1: [item_id1, item_id2,...,item_idn], user_id2...}
    val_user_items: 表示验证数据，格式为：{user_id1: [item_id1, item_id2,...,item_idn], user_id2...}
    K: Ｋ表示的是相似商品的数量，为每个用户交互的每个商品都选择其最相思的K个商品
    N: N表示的是给用户推荐的商品数量，给每个用户推荐相似度最大的N个商品
    '''

    # 建立user->item的倒排表
    # 倒排表的格式为: {user_id1: [item_id1, item_id2,...,item_idn], user_id2: ...} 也就是每个用户交互过的所有商品集合
    # 由于输入的训练数据trn_user_items,本身就是这中格式的，所以这里不需要进行额外的计算
    

    # 计算商品协同过滤矩阵
    # 即利用user-items倒排表统计商品与商品之间被共同的用户交互的次数
    # 商品协同过滤矩阵的表示形式为：sim = {item_id1: {item_id２: num1}, item_id３: {item_id４: num２}, ...}
    # 商品协同过滤矩阵是一个双层的字典，用来表示商品之间共同交互的用户数量
    # 在计算商品协同过滤矩阵的同时还需要记录每个商品被多少不同用户交互的次数，其表示形式为: num = {item_id1：num1, item_id２:num2, ...}
    sim = {}
    num = {}
    print('构建相似性矩阵．．．')
    for uid, items in tqdm(trn_user_items.items()):
        for i in items:    
            if i not in num:
                num[i] = 0
            num[i] += 1
            if i not in sim:
                sim[i] = {}
            for j in items:
                if j not in sim[i]:
                    sim[i][j] = 0
                if i != j:
                    sim[i][j] += 1
    
    # 计算物品的相似度矩阵
    # 商品协同过滤矩阵其实相当于是余弦相似度的分子部分,还需要除以分母,即两个商品被交互的用户数量的乘积
    # 两个商品被交互的用户数量就是上面统计的num字典
    print('计算协同过滤矩阵．．．')
    for i, items in tqdm(sim.items()):
        for j, score in items.items():
            if i != j:
                sim[i][j] = score / math.sqrt(num[i] * num[j])
    

    # 对验证数据中的每个用户进行TopN推荐
    # 在对用户进行推荐之前需要先通过商品相似度矩阵得到当前用户交互过的商品最相思的前K个商品，
    # 然后对这K个用户交互的商品中除当前测试用户训练集中交互过的商品以外的商品计算最终的相似度分数
    # 最终推荐的候选商品的相似度分数是由多个相似商品对该商品分数的一个累加和
    items_rank = {}
    print('给用户进行推荐．．．')
    for uid, _ in tqdm(val_user_items.items()):
        items_rank[uid] = {} # 存储用户候选的推荐商品
        for hist_item in trn_user_items[uid]: # 遍历该用户历史喜欢的商品，用来下面寻找其相似的商品
            for item, score in sorted(sim[hist_item].items(), key=lambda x: x[1], reverse=True)[:K]:
                if item not in trn_user_items[uid]: # 进行推荐的商品一定不能在历史喜欢商品中出现
                    if item not in items_rank[uid]:
                        items_rank[uid][item] = 0
                    items_rank[uid][item] += score
    
    print('为每个用户筛选出相似度分数最高的Ｎ个商品...')
    items_rank = {k: sorted(v.items(), key=lambda x: x[1], reverse=True)[:N] for k, v in items_rank.items()}
    items_rank = {k: set([x[0] for x in v]) for k, v in items_rank.items()}
    return items_rank


if __name__ == "__main__":
    root_path = './data/ml-1m/'
    trn_user_items, val_user_items = get_data(root_path)
    rec_items = Item_CF(trn_user_items, val_user_items, 80, 10)
    rec_eval(rec_items, val_user_items, trn_user_items)
