# Fun-Rec

<p align="left">
  <img src='https://img.shields.io/badge/python-3.8+-blue'>
  <img src='https://img.shields.io/badge/Tensorflow-2.2+-blue'>
  <img src='https://img.shields.io/badge/NumPy-1.22.3-brightgreen'>
  <img src='https://img.shields.io/badge/pandas-1.4.1-brightgreen'>
  <img src='https://img.shields.io/badge/sklearn-1.0.2-brightgreen'>
</p> 

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
    - [1.0.2 逻辑回归](https://github.com/datawhalechina/fun-rec/blob/131bcee1f2d677041a4ec1c3f767c20d2d818780/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.0%20%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80/1.0.2%20%E9%80%BB%E8%BE%91%E5%9B%9E%E5%BD%92.md)
    - [1.0.3 神经网络](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.0%20%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80/1.0.3%20%E7%A5%9E%E7%BB%8F%E7%BD%91%E7%BB%9C.md)
    - [1.0.4 常用优化算法](https://github.com/datawhalechina/fun-rec/blob/131bcee1f2/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.0%20%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80/1.0.4%20%E5%B8%B8%E7%94%A8%E4%BC%98%E5%8C%96%E7%AE%97%E6%B3%95.md)
    - [1.0.5 深度学习模型搭建基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.0%20%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0%E5%9F%BA%E7%A1%80/1.0.5%20%E6%B7%B1%E5%BA%A6%E5%AD%A6%E4%B9%A0%E6%A8%A1%E5%9E%8B%E6%90%AD%E5%BB%BA%E5%9F%BA%E7%A1%80.md)

  - **1.1 基础推荐算法**
      - [1.1.1 推荐系统概述](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%20%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.1%20%E6%A6%82%E8%BF%B0.md)
      - [1.1.2 协同过滤](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%20%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.2%20%E5%8D%8F%E5%90%8C%E8%BF%87%E6%BB%A4.md)
      - [1.1.3 矩阵分解](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%20%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.3%20%E7%9F%A9%E9%98%B5%E5%88%86%E8%A7%A3.md)
      - [1.1.4 FM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%20%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.4%20FM.md)
      - [1.1.5 GBDT+LR](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.1%20%E5%9F%BA%E7%A1%80%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95/1.1.5%20GBDT%2BLR.md)

  - **1.2 深度推荐模型**
      - [1.2.1 NeuralCF](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.1%20NeuralCF.md)
      - [1.2.2 Deep Crossing](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.2%20DeepCrossing.md)
      - [1.2.3 PNN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.3%20PNN.md)
      - [1.2.4 Wide&Deep](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.4%20Wide%26Deep.md)
      - [1.2.5 DeepFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.5%20DeepFM.md)
      - [1.2.6 Deep&Cross](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.7%20DCN.md)
      - [1.2.7 NFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.6%20NFM.md)
      - [1.2.8 AFM](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.8%20AFM.md)
      - [1.2.9 DIN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.9%20DIN.md)
      - [1.2.10 DIEN](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.10%20DIEN.md)
      - [1.2.11 多任务学习](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%80%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%9F%BA%E7%A1%80/1.2%20%E6%B7%B1%E5%BA%A6%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B/1.2.11%20%E5%A4%9A%E4%BB%BB%E5%8A%A1%E5%AD%A6%E4%B9%A0.md)
- **第二章 推荐系统实战**

    - **2.1 竞赛实践(天池入门赛-新闻推荐)**
        - [2.1.0 入门赛讲解视频](https://www.bilibili.com/video/BV1do4y1d7FP?from=search&seid=17030616569563190806&spm_id_from=333.337.0.0)
        - [2.1.1 赛题理解&Baseline](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.1%20%E8%B5%9B%E9%A2%98%E7%90%86%E8%A7%A3%2BBaseline.ipynb)
        - [2.1.2 数据分析](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.2%20%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90.ipynb)
        - [2.1.3 多路召回](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.3%20%E5%A4%9A%E8%B7%AF%E5%8F%AC%E5%9B%9E.ipynb)
        - [2.1.4 特征工程](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.4%20%E7%89%B9%E5%BE%81%E5%B7%A5%E7%A8%8B.ipynb)
        - [2.1.5 排序模型&模型融合](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.1%E7%AB%9E%E8%B5%9B%E5%AE%9E%E8%B7%B5/jupyter/2.5%20%E6%8E%92%E5%BA%8F%E6%A8%A1%E5%9E%8B%2B%E6%A8%A1%E5%9E%8B%E8%9E%8D%E5%90%88.ipynb)
    - **2.2 新闻推荐系统实践**

      - **[2.2.0 新闻推荐系统流程的构建视频讲解](https://datawhale.feishu.cn/minutes/obcnzns778b725r5l535j32o)**
      - **2.2.1 离线物料系统的构建** 
      
        - [2.2.1.1 Mysql基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.1.1%20Mysql%E5%9F%BA%E7%A1%80.md)
        - [2.2.1.2 MongoDB基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.1.2%20MongoDB%E5%9F%BA%E7%A1%80.md)
        - [2.2.1.3 Redis基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.1.3%20Redis%E5%9F%BA%E7%A1%80.md)
        - [2.2.1.4 Scrapy基础及新闻爬取实战](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.1.4%20scrapy%E5%9F%BA%E7%A1%80%E5%8F%8A%E6%96%B0%E9%97%BB%E7%88%AC%E5%8F%96%E5%AE%9E%E6%88%98.md)
        - [2.2.1.5 自动化构建用户及物料画像](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.1.5%20%E8%87%AA%E5%8A%A8%E5%8C%96%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%E5%8F%8A%E7%89%A9%E6%96%99%E7%94%BB%E5%83%8F.md)
      - **2.2.2 前后端基础及交互**
      
        - [2.2.2.1 前端基础及Vue实战](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.2.1%20%E5%89%8D%E7%AB%AF%E5%9F%BA%E7%A1%80%E5%8F%8AVue%E5%AE%9E%E6%88%98.md)
        - [2.2.2.2 flask简介及基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.2.2%20flask%E7%AE%80%E4%BB%8B%E5%8F%8A%E5%9F%BA%E7%A1%80.md)
        - [2.2.2.3 前后端交互](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.2.3%20%E5%89%8D%E5%90%8E%E7%AB%AF%E4%BA%A4%E4%BA%92.md)
      - **[2.2.3 推荐流程的构建](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.3.1%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E6%B5%81%E7%A8%8B%E7%9A%84%E6%9E%84%E5%BB%BA.md)**

      - **2.2.5 召回**

        - 2.2.5.1 规则类召回
        - 2.2.5.2 模型类召回
          - [YoutubeDNN召回](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.5.2%20YouTubeDNN%E5%8F%AC%E5%9B%9E.md)
          - [DSSM召回](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/2.2%E6%96%B0%E9%97%BB%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F%E5%AE%9E%E6%88%98/docs/2.2.5.1%20DSSM%E5%8F%AC%E5%9B%9E.md)
      - **[2.2.6 DeepFM排序模型](https://github.com/datawhalechina/fun-rec/blob/master/codes/news_recsys/news_rec_server/recprocess/rank/readme.md)**

      - **2.2.7 规则与重排**

      - **2.2.8 任务监控与调度**

- **第三章 推荐算法面经**

  - [3.1 ML与DL基础](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%89%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95%E9%9D%A2%E7%BB%8F/3.1%20ML%E4%B8%8EDL%E5%9F%BA%E7%A1%80.md)
  - [3.2 推荐模型相关](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%89%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95%E9%9D%A2%E7%BB%8F/3.2%20%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9E%8B%E7%9B%B8%E5%85%B3.md)
  - [3.3 热门技术相关](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%89%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95%E9%9D%A2%E7%BB%8F/3.3%20%E7%83%AD%E9%97%A8%E6%8A%80%E6%9C%AF%E7%9B%B8%E5%85%B3.md)
  - [3.4 业务场景相关](https://github.com/datawhalechina/fun-rec/blob/master/docs/%E7%AC%AC%E4%B8%89%E7%AB%A0%20%E6%8E%A8%E8%8D%90%E7%AE%97%E6%B3%95%E9%9D%A2%E7%BB%8F/3.4%20%E4%B8%9A%E5%8A%A1%E5%9C%BA%E6%99%AF%E7%9B%B8%E5%85%B3.md)



### 备注

[2.1 竞赛实践(天池入门赛-新闻推荐)](https://tianchi.aliyun.com/competition/entrance/531842/forum)

<div align=center>
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165802957.png" alt="image-20211213165802957" style="zoom:50%;" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165847593.png" alt="image-20211213165847593" style="zoom:50%;" />
</div>

**2.2 新闻推荐系统实践前端展示和后端逻辑(项目没有任何商用价值仅供入门者学习)**

<div align=center> 
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211205142026937.png" alt="image-20211205142026937" style="zoom:57%;" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片Fun-Rec新闻推荐系统.png" alt="Fun-Rec新闻推荐系统" style="zoom:50%;" />
</div>




## 致谢

<table align="center" style="width:80%;">
<thead>
  <tr>
    <th>成员</th>
    <th>个人简介及贡献</th>
    <th>个人主页</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">罗如意</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，西安电子科技大学硕士，项目负责人, 核心贡献者</td>
    <td><a href="https://github.com/ruyiluo">Github</a></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">吴忠强</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，东北大学硕士，CSDN博客专家，核心贡献者</td>
    <td><a href="https://blog.csdn.net/wuzhongqiang">CSDN</a></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">何世福</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，算法工程师，课程设计及内容审核</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">徐何军</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，算法工程师，内容审核</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">李万业</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，同济大学硕士，新闻推荐入门赛贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">陈琰钰</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，清华大学硕士，新闻推荐入门赛贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">陈锴</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，中山大学本科，推荐算法基础贡献部分内容</td>
    <td></td>
  </tr>
   <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">梁家晖</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，公众号：可能好玩，基础推荐算法贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">王贺</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，算法工程师，新闻推荐入门赛赛题设计者</td>
    <td><a href="https://www.zhihu.com/people/wang-he-13-93">鱼遇雨欲语与余</a></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">宁彦吉</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，算法工程师，深度推荐模型章节贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">田雨</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，武汉大学硕士，深度推荐模型章节贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">赖敏材</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale成员，上海科技大学硕士，深度模型及面经贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">汪志鸿</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale意向成员，东北大学硕士，新闻推荐系统实践贡献部分内容</td>
    <td></td>
  </tr>
   <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">王辰玥</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale意向成员，中国地质大学，新闻推荐系统实践前端负责人</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">唐鑫</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale意向成员，西安电子科技大学硕士，机器学习基础贡献部分内容</td>
    <td></td>
  </tr>
  <tr>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">宋禹成</span></td>
    <td><span style="font-weight:normal;font-style:normal;text-decoration:none">Datawhale意向成员，东北大学硕士，新闻推荐系统贡献部分内容</td>
    <td></td>
  </tr>
</tbody>
</table> 



<font color='red'>感谢Datawhale成员刘雯静、吕豪杰及意向成员张汉隆、吴丹飞、王云川、肖桐、管柯琴、陈雨龙和宋禹成等人在开源项目组队学习中担任助教时的辛苦付出！</font>



## 关注我们

<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="https://raw.githubusercontent.com/datawhalechina/pumpkin-book/master/res/qrcode.jpeg" width = "180" height = "180">
</div>

## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>

本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
