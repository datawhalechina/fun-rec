# Fun-Rec

本教程主要分为三个阶段，分别是推荐系统基础、推荐系统进阶和推荐系统应用，每个阶段的具体内容如下：

- **推荐系统基础**，这部分内容旨在让初学者了解推荐系统是什么，有哪些经典的推荐算法以及经典算法的实现，这一部分是入门推荐系统过程中非常重要的基础内容。
- **推荐系统进阶**，这部分内容主要是推荐系统的实战内容，包含推荐系统竞赛实战和推荐系统经典架构的实现。其中推荐系统竞赛实战是结合阿里天池上的新闻推荐入门赛做的相关内容。推荐系统经典架构实现会参考[SparrowRecSys](https://github.com/wzhe06/SparrowRecSys)开源项目搭建一个完整的推荐系统的框架，内容可能跟新闻推荐相关。
- **推荐系统应用**，这一部分是基于基础和进阶之上，在推荐系统细分领域上做的内容，例如信息流推荐、视频推荐、音乐推荐等。这一部分需要一些对这些细分领域比较熟悉的人来协助共同完成，如果对这部分内容的贡献感兴趣的可以联系我们，一起来完善这个项目。

项目在Datawhale的组队学习过程中不断的迭代和优化，通过大家的反馈来修正或者补充相关的内容，如果对项目内容设计有更好的意见欢迎给我们反馈。为了方便学习和交流，建了一个fun-rec微信交流群，由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群

<div align=center> <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20210327163711753.png" width = 25%/> </div>

## 内容目录

- [第一章 推荐系统基础](https://github.com/datawhalechina/team-learning-rs/tree/master/RecommendationSystemFundamentals)

    - **1.1 基础推荐算法**
        - [1.1.1 推荐系统概述](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.1%20%E6%A6%82%E8%BF%B0.md)
        - [1.1.2 协同过滤](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.2%20%E5%8D%8F%E5%90%8C%E8%BF%87%E6%BB%A4.md)
        - [1.1.3 矩阵分解](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.3%20%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3.md)
        - [1.1.4 FM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.4%20FM.md)
        - [1.1.5 GBDT+LR](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.6%20GBDT%2BLR.md)
 
    - **1.2 基于深度组合的深度推荐算法**
        - [深度学习模型搭建基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.0%20%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E6%A8%A1%E5%9E%8B%E6%90%AD%E5%BB%BA%E5%9F%BA%E7%A1%80.md)
        - [1.2.1 NeuralCF](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.1%20NeuralCF.md)
        - [1.2.2 Deep Crossing](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.2%20DeepCrossing.md)
        - [1.2.3 PNN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.3%20PNN.md)
        - [1.2.4 Wide&Deep](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.4%20Wide%26Deep.md)
        - [1.2.5 DeepFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.5%20DeepFM.md)
        - [1.2.6 Deep&Cross](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.7%20DCN.md)
        - [1.2.7 NFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.6%20NFM.md)

     - **1.3 深度推荐算法前沿**
        - [1.3.1 AFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.1%20AFM.md)
        - [1.3.2 DIN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.2%20DIN.md)
        - [1.3.3 DIEN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.3%20DIEN.mdhttps://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DIEN.md)
        -  ...

- 第二章 推荐系统进阶
    - 2.1 [竞赛实践(天池入门赛-新闻推荐)](https://github.com/datawhalechina/team-learning-rs/tree/master/RecommandNews)
        - [2.1.1 赛题理解&Baseline](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.1%20%E8%B5%9B%E9%A2%98%E7%90%86%E8%A7%A3%2BBaseline.ipynb)
        - [2.1.2 数据分析](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.2%20%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90.ipynb)
        - [2.1.3 多路召回](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.3%20%E5%A4%9A%E8%B7%AF%E5%8F%AC%E5%9B%9E.ipynb)
        - [2.1.4 特征工程](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.4%20%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B.ipynb)
        - [2.1.5 排序模型&模型融合](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.5%20%E6%8E%92%E5%BA%8F%E6%A8%A1%E5%9E%8B%2B%E6%A8%A1%E5%9E%8B%E8%9E%8D%E5%90%88.ipynb)
       
    - 2.2推荐系统架构

      - 2.2.1 基础架构
      - 2.2.2 数据处理
      - 2.2.3 特征工程
      - 2.2.4 多路召回
      - 2.2.5 排序模型
      - 2.2.6 模型评估
      - 2.2.7 线上服务
     
    - **2.3 新闻推荐架构实践**
      - 计划中...

- **第三章 推荐系统应用**
  - **3.1 信息流推荐**
  - **3.2 视频推荐**
  - **3.3 音乐推荐**
  - **3.4 广告推荐**
    ......



## 贡献者

##### 核心贡献者：

罗如意：Datawhale成员，西安电子科技大学(项目负责人)  
吴忠强：Datawhale成员，东北大学

##### 贡献者：

何世福：Datawhale成员，推荐算法工程师(内容审核负责人)  
徐何军：Datawhale成员，推荐算法工程师(内容审核)  
李万业：Datawhale成员，同济大学  
陈琰钰：Datawhale成员，清华大学  
陈锴：    Datawhale成员，中山大学  
梁家晖：Datawhale成员， 公众号：可能好玩  
王贺：    Datawhale成员，算法工程师  
宁彦吉：Datawhale Contributor, 算法工程师  
田雨：   Datawhale成员，武汉大学  
赖敏材:  Datawhale成员，上海科技大学  

**组队学习贡献者：**

刘雯静：Datawhale成员
吕豪杰：Datawhale成员
张汉隆：华北电力大学
吴丹飞：华北电力大学
王云川：山东农业大学

## 关于Datawhale

> Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和人与未来的联结。 本次数据挖掘路径学习，专题知识将在天池分享，详情可关注Datawhale(二维码在上面)

<div align=center> <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/abc/image-20201214105807029.png" width = 25%/> </div>