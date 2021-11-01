﻿# Fun-Rec

本教程主要是针对具有机器学习基础并想找推荐算法岗位的同学，由推荐算法基础、推荐算法入门赛、新闻推荐项目及推荐算法面经组成，形成了一个完整的从基础到实战再到面试的闭环。主要分为三个阶段，分别是推荐系统基础、推荐系统进阶和推荐算法面经，每个阶段的具体内容如下：

- **推荐系统基础**，这部分内容包括机器学习基础（建议系统学习机器学习基础，这里只是简单介绍）、经典推荐算法及深度推荐模型（深度推荐模型也会不定时更新一些比较新的模型）。这部分内容使用tensorflow实现了所有模型。
- **推荐系统实战**，这部分内容主要是推荐系统的实战内容，包含推荐系统竞赛实战和新闻推荐系统的实践。其中推荐系统竞赛实战是结合阿里天池上的新闻推荐入门赛做的相关内容。新闻推荐系统实践是实现一个具有前后端交互及整个推荐链路的项目，该项目是一个新闻推荐系统的demo没有实际的商业化价值，也就是使用现有的一些技术实现了推荐的整个流程，具体细节可以参考下面的目录。
- **推荐系统面经**，这里会将推荐算法工程师面试过程中常考的一些基础知识、热门技术等面经进行整理，方便同学在有了一定推荐算法基础之后去面试，因为对于初学者来说只有在公司实习学到的东西才是最有价值的。

项目在Datawhale的组队学习过程中不断的迭代和优化，通过大家的反馈来修正或者补充相关的内容，如果对项目内容设计有更好的意见欢迎给我们反馈。为了方便学习和交流，建了一个fun-rec微信交流群，由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群

<div align=center> <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20210327163711753.png" width = 25%/> </div>

## 内容导航

- **第一章 推荐系统基础**

  - **1.0 机器学习基础**
    - 1.0.1 机器学习基本流程
    - 1.0.2 逻辑回归
    - 1.0.3 神经网络
    - 1.0.4 常用优化算法
    - [1.0.5 深度学习模型搭建基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.0%20%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E6%A8%A1%E5%9E%8B%E6%90%AD%E5%BB%BA%E5%9F%BA%E7%A1%80.md)

  - **1.1 基础推荐算法**
      - [1.1.1 推荐系统概述](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.1%20%E6%A6%82%E8%BF%B0.md)
      - [1.1.2 协同过滤](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.2%20%E5%8D%8F%E5%90%8C%E8%BF%87%E6%BB%A4.md)
      - [1.1.3 矩阵分解](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.3%20%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3.md)
      - [1.1.4 FM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.4%20FM.md)
      - [1.1.5 GBDT+LR](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.6%20GBDT%2BLR.md)

  - **1.2 深度推荐模型**
      - [1.2.1 NeuralCF](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.1%20NeuralCF.md)
      - [1.2.2 Deep Crossing](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.2%20DeepCrossing.md)
      - [1.2.3 PNN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.3%20PNN.md)
      - [1.2.4 Wide&Deep](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.4%20Wide%26Deep.md)
      - [1.2.5 DeepFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.5%20DeepFM.md)
      - [1.2.6 Deep&Cross](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.7%20DCN.md)
      - [1.2.7 NFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%E5%9F%BA%E4%BA%8E%E6%B7%B1%E5%BA%A6%E7%BB%84%E5%90%88%E7%9A%84%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.6%20NFM.md)
      - [1.2.8 AFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.1%20AFM.md)
      - [1.2.9 DIN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.2%20DIN.md)
      - [1.2.10 DIEN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.3%20DIEN.mdhttps://github.com/datawhalechina/team-learning-rs/blob/master/DeepRecommendationModel/DIEN.md)
      -  [1.2.11 多任务学习](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.3%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E5%89%8D%E6%B2%BF/1.3.4%20%E5%A4%9A%E4%BB%BB%E5%8A%A1%E5%AD%A6%E4%B9%A0.md)
      -  ......

- **第二章 推荐系统实战**
    - **2.1 竞赛实践(天池入门赛-新闻推荐)**
        - [2.1.0 入门赛讲解视频](https://www.bilibili.com/video/BV1do4y1d7FP?from=search&seid=17030616569563190806&spm_id_from=333.337.0.0)
        - [2.1.1 赛题理解&Baseline](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.1%20%E8%B5%9B%E9%A2%98%E7%90%86%E8%A7%A3%2BBaseline.ipynb)
        - [2.1.2 数据分析](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.2%20%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90.ipynb)
        - [2.1.3 多路召回](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.3%20%E5%A4%9A%E8%B7%AF%E5%8F%AC%E5%9B%9E.ipynb)
        - [2.1.4 特征工程](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.4%20%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B.ipynb)
        - [2.1.5 排序模型&模型融合](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E8%BF%9B%E9%98%B6/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.5%20%E6%8E%92%E5%BA%8F%E6%A8%A1%E5%9E%8B%2B%E6%A8%A1%E5%9E%8B%E8%9E%8D%E5%90%88.ipynb)
        
    - **2.2 新闻推荐系统实践**
    
      - **2.2.1 构建物料池**
        - 2.2.1.1 Mysql基础
        - 2.2.1.2 MongoDB基础
        - 2.2.1.3 Redis基础
        - 2.2.1.4 scrapy框架基础
        - 2.2.1.5 scrapy新闻爬取
        - 2.2.1.6 新闻画像的构建
    
      - **2.2.2 前后端交互**
        - 2.2.2.1 Vue简介及基础
        - 2.2.2.2 flask简介及基础
        - 2.2.2.3 前后端交互
    
      - **2.2.3 数据收集及冷启动**
    
      - **2.2.4 特征工程**
    
      - **2.2.5 召回**
        - 2.2.5.1 规则类召回
        - 2.2.5.2 模型类召回
        - 2.2.5.3 召回评估
    
      - **2.2.6 排序**
        - 2.2.6.1 DeepFM排序模型
        - 2.2.6.2 排序模型评估
    
      - **2.2.7 规则与重排**
    
      - **2.2.8 任务监控与调度**
    
- **第三章 推荐算法面经**

  - 3.1 机器学习相关
  - 3.2 推荐模型相关
  - 3.3 热门技术相关
  - 3.4 业务场景相关



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
田雨：    Datawhale成员，武汉大学  
赖敏材：Datawhale成员，上海科技大学  

**组队学习贡献者：**

刘雯静：Datawhale成员  
吕豪杰：Datawhale成员  
张汉隆：华北电力大学  
吴丹飞：华北电力大学  
王云川：山东农业大学    

## 关于Datawhale

> Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和人与未来的联结。 本次数据挖掘路径学习，专题知识将在天池分享，详情可关注Datawhale(二维码在上面)

<div align=center> <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/abc/image-20201214105807029.png" width = 25%/> </div>