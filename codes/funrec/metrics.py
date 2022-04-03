# TODO 将召回排序常用的指标汇总

# 依次评估召回的前10, 20, 30, 40, 50个文章中的击中率
def H_Rate(user_recall_items_dict, trn_last_click_df, topk=100):
    last_click_item_dict = dict(zip(trn_last_click_df['user_id'], trn_last_click_df['article_id']))
    user_num = len(user_recall_items_dict)

    for k in range(50, topk + 1, 50):
        hit_num = 0
        for user, item_list in user_recall_items_dict.items():
            if user in last_click_item_dict:
                # 获取前k个召回的结果
                tmp_recall_items = [x[0] for x in user_recall_items_dict[user][:k]]
                if last_click_item_dict[user] in set(tmp_recall_items):
                    hit_num += 1

        hit_rate = round(hit_num * 1.0 / user_num, 5)
        print(' topk: ', k, ' : ', 'hit_num: ', hit_num, 'hit_rate: ', hit_rate, 'user_num : ', user_num)