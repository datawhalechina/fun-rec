# FunRec

FunRec推荐系统项目主要分为三个阶段，分别是推荐系统基础、推荐系统进阶和推荐系统应用，每个阶段的具体内容如下：

- 推荐系统基础，这部分内容旨在让初学者了解推荐系统是什么，有哪些经典的推荐算法以及经典算法的实现，这一部分也是推荐系统非常核心的部分。对于基础部分，已经完成了基础推荐算法，接下来是完成深度学习推荐相关的算法模型。
- 推荐系统进阶，这部分内容是在了解了推荐系统基础之后，在架构层面去了解推荐系统如何实现的，这里的内容会参考王喆老师的[《深度学习推荐系统》](https://book.douban.com/subject/35013197/)这本书及[SparrowRecSys](https://github.com/wzhe06/SparrowRecSys)开源项目，搭建一个完整的推荐系统框架。目前打算是基于最新的MIND数据集搭建一个新闻推荐的项目，在进阶部分除了推荐系统框架以外还有一个关于竞赛的实践内容，这部分内容是一个比较完整的推荐系竞赛入门的教程，将推荐系统中的召回和排序连在一起可以作为进阶部门的基础。
- 推荐系统应用，这一部分是基于基础和进阶之上，在推荐系统细分领域上做的内容，例如信息流推荐、视频推荐、音乐推荐等。这一部分需要一些对这些细分领域比较熟悉的人来协助共同完成，如果对这部分内容的贡献感兴趣的可以联系我们，一起来完善这个项目。

项目在Datawhale的组队学习过程中不断的迭代和优化，通过大家的反馈来修正或者补充相关的内容，如果项目对项目内容设计有更好的意见欢迎给我们反馈。

由于微信群的二维码只有7天有效，为了方便大家进群直接扫下面的二维码，备注：FunRec，会被拉到交流群

<img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20210327163711753.png" alt="image-20210327163711753" style="zoom:50%;" />

## 内容目录

- [第一章 推荐系统基础](https://github.com/datawhalechina/team-learning-rs/tree/master/RecommendationSystemFundamentals)

  - **1.1 基础推荐算法**
    - [x] [1.1.1 推荐系统概述](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/01%20%E6%A6%82%E8%BF%B0.md)
    - [x] [1.1.2 协同过滤](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/02%20%E5%8D%8F%E5%90%8C%E8%BF%87%E6%BB%A4.md)
    - [x] [1.1.3 矩阵分解](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/03%20%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3.md)
    - [x] [1.1.4 FM](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/04%20FM.md)
    - [x] [1.1.5 GBDT+LR](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/06%20GBDT%2BLR.md)
  - **1.2 基于深度组合的深度推荐算法**
    - [x] [深度学习模型搭建基础](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E6%A8%A1%E5%9E%8B%E6%90%AD%E5%BB%BA%E5%9F%BA%E7%A1%80.md)
    - [x] [1.2.1 NeuralCF](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/NeuralCF.md)
    - [x] [1.2.2 Deep Crossing](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DeepCrossing.md)
    - [x] [1.2.3 PNN](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/PNN.md)
    - [x] [1.2.3 Wide&Deep](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommendationSystemFundamentals/05%20Wide%26Deep.md)
    - [x] [1.2.4 DeepFM](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DeepFM.md)
    - [x] [1.2.5 Deep&Cross](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DeepCrossing.md)
    - [x] [1.2.6 NFM](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/NFM.md)
  - **1.3 深度推荐算法前沿**
    - [x] [1.3.1 AFM](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/AFM.md)
    - [x] [1.3.2 DIN](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DIN.md)
    - [x] [1.3.3 DIEN](https://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DIEN.md)
    - [ ] ...

- **第二章 推荐系统进阶**

  - **2.1 [竞赛实践(天池入门赛-新闻推荐)](https://github.com/datawhalechina/team-learning-rs/tree/master/RecommandNews)**
    - [x] [2.1.1 赛题理解](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E8%B5%9B%E9%A2%98%E7%90%86%E8%A7%A3%2BBaseline.ipynb)
    - [x] [2.1.2 Baseline](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E8%B5%9B%E9%A2%98%E7%90%86%E8%A7%A3%2BBaseline.ipynb)
    - [x] [2.1.3 数据分析](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90.ipynb)
    - [x] [2.1.4 多路召回](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E5%A4%9A%E8%B7%AF%E5%8F%AC%E5%9B%9E.ipynb)
    - [x] [2.1.5 特征工程](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B.ipynb)
    - [x] [2.1.6 排序模型](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E6%8E%92%E5%BA%8F%E6%A8%A1%E5%9E%8B%2B%E6%A8%A1%E5%9E%8B%E8%9E%8D%E5%90%88.ipynb)
    - [x] [2.1.7 模型集成](https://github.com/datawhalechina/team-learning-rs/blob/master/RecommandNews/%E6%8E%92%E5%BA%8F%E6%A8%A1%E5%9E%8B%2B%E6%A8%A1%E5%9E%8B%E8%9E%8D%E5%90%88.ipynb)
  - **2.2推荐系统架构**
    - [ ] 2.2.1 基础架构
    - [ ] 2.2.2 数据处理
    - [ ] 2.2.3 特征工程
    - [ ] 2.2.4 多路召回
    - [ ] 2.2.5 排序模型
    - [ ] 2.2.6 模型评估
    - [ ] 2.2.7 线上服务
  - **2.3 新闻推荐架构实践**
    - [ ] 计划中...

- **第三章 推荐系统应用**

  - [ ] 信息流推荐
  
  - [ ] 视频推荐
  
  - [ ] 音乐推荐
    
  - [ ] 广告推荐
    
    ......
    



## 致谢(贡献者)

### 内容设计

| 成员   | 个人简介及贡献                                               | 备注           |
| ------ | ------------------------------------------------------------ | -------------- |
| 罗如意 | 西安电子科技大学研究生，Datawhale成员，项目负责人；1.1.2-1.1.5代码编写，参与1.1.1、1.1.3、1.1.5内容编写，参与2.2.1-2.2.7内容编写 | 第18、19期助教 |
| 吴忠强 | 东北大学研究生，Datawhale成员，核心贡献者；1.1.2、1.1.4内容编写，参与2.2.2、2.2.5、2.2.6、2.2.7内容编写 | 第18、19期助教 |
| 李万业 | 同济大学研究生，Datawhale成员；参与2.2.4内容编写             | 第19期助教     |
| 陈琰钰 | 清华大学研究生，Datawhale成员；参与2.2.3内容编写             | 第19期助教     |
| 陈锴   | 中山大学本科生，Datawhale成员；参与1.1.3、1.1.5内容编写      | 第18期助教     |
| 梁家晖 | Datawhale成员，公众号：可能好玩；参与1.1.1内容编写           | 第18期助教     |
| 王贺   | 算法工程师，Datawhale成员，公众号：Coggle数据科学；推荐系统实践之新闻推荐赛题设计 |                |

### 内容审核

| 成员   | 个人简介及贡献                                      | 备注       |
| ------ | --------------------------------------------------- | ---------- |
| 何世福 | 推荐算法工程师，Datawhale成员，项目负责人；内容审核 | 第18期助教 |
| 徐何军 | 推荐算法工程师，Datawhale成员；内容审核             | 第18期助教 |

### 组队运营

| 成员   | 个人简介及贡献                               | 备注 |
| ------ | -------------------------------------------- | ---- |
| 刘雯静 | 第18期组队学习推荐系统基础助教               |      |
| 张汉隆 | 华北电力大学，第19期组队学习推荐系统实践助教 |      |
| 吴丹飞 | 华北电力大学，第19期组队学习推荐系统实践助教 |      |

### 电子书排版、证书制作

| 成员   | 个人简介及贡献                                          | 备注 |
| ------ | ------------------------------------------------------- | ---- |
| 吕豪杰 | Datawhale成员，第18、19期内容电子书排版，证书制作与发放 |      |



## 如何加入我们

由于本项目还处于比较初期的阶段，目前主要是Datawhale推荐小组中的成员在推进这个项目，为了提高项目的质量，也非常希望对该项目感兴趣的小伙伴加入我们一起完善这个项目，如果对这个项目感兴趣的可以通过Datawhale公众号联系到我们。

![image-20201214105807029](http://ryluo.oss-cn-chengdu.aliyuncs.com/abc/image-20201214105807029.png)

## 关于Datawhale

> Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和人与未来的联结。 本次数据挖掘路径学习，专题知识将在天池分享，详情可关注Datawhale(二维码在上面)


