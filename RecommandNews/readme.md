






# 推荐系统实践（新闻推荐）



## 基本信息

- 学习周期：15天
- 学习形式：理论学习+练习
- 人群定位：有一定的数据分析基础，了解推荐系统基本算法，了解机器学习算法流程
- 先修内容：[Python编程语言](https://github.com/datawhalechina/team-learning-program/tree/master/PythonLanguage)；[编程实践（Pandas）](https://github.com/datawhalechina/team-learning-program/tree/master/IntroductionToPandas)；[编程实践（Numpy）](https://github.com/datawhalechina/team-learning-program/tree/master/IntroductionToNumpy)；[推荐系统基础](https://github.com/datawhalechina/team-learning-rs/tree/master/RecommendationSystemFundamentals)。
- 难度系数：中

## 学习目标

### 熟悉推荐系统竞赛的基本流程

- 掌握数据分析方法
- 了解多路召回策略
- 了解冷启动策略
- 了解排序特征的构造方法
- 了解常见的排序模型
- 了解模型融合


### 新闻推荐入门赛学习内容汇总：

![](https://img-blog.csdnimg.cn/20201117153943695.png)


## 任务安排

### Task00：熟悉规则（1天）

- 组队、修改群昵称
- 熟悉打开规则

### Task01：赛题理解+Baseline（3天）

- 理解赛题数据和目标，理解评分指标，了解赛题的解题思路
- 完成赛题报名和数据下载，跑通Baseline并成功提交结果

### Task02：数据分析（2天）

- 了解数据中不同文件所包含的信息，不同数据文件之间的关系
- 分析点击数据中用户的点击环境、点击偏好，点击的文章属性等分布
- 分析点击数据中文章的基本属性，文章的热门程度，文章的共现情况等
- 分析文章属性文件中(embedding文件和属性特征文件)，文章的基本信息


### Task03：多路召回（3天）

- 熟悉常见的召回策略，如：itemcf, usercf以及深度模型召回等
- 了解当前场景下的冷启动问题，及常见解决策略，了解如何将多路召回的结果进行合并
- 完成多种策略的召回，冷启动及多路召回合并
- 完成召回策略的调参和召回效果的评估


### Task04：特征工程（3天）

- 了解排序数据标签的构建，训练数据的负采样，排序特征的常用构造思路
- 完成用户召回文章与历史文章相关性的特征构造
- 完成用户历史兴趣的相关特征的提取，文章本身属性特征的提取

### Task05：排序模型+模型融合（3天）

- 了解基本的排序模型，模型的训练和测试，常用的模型融合策略
- 完成LGB分类模型，LGB排序模型，及深度模型中的DIN模型的训练、验证及调参
- 完成加权融合与Staking融合两种融合策略




---
# 贡献人员


姓名 | 博客|备注
---|---|---
王贺|[知乎](https://www.zhihu.com/people/wang-he-13-93)|武汉大学计算机硕士，DCIC2019冠军，2019和2020腾讯广告算法冠军，京东算法工程师
罗如意|[个人网站](https://ruyiluo.github.io/)|西安电子科技大学研究生
吴忠强|[CSDN](https://blog.csdn.net/wuzhongqiang)|东北大学研究生
李万业|[知乎](https://www.zhihu.com/people/mei-chang-su-70-91)|同济大学研究生
陈琰钰|[CSDN](https://blog.csdn.net/weixin_44154393)|清华大学研究生
张汉隆||华北电力大学
