# FunRec
<p align="left">
  <img src='https://img.shields.io/badge/python-3.8+-blue'>
  <img src='https://img.shields.io/badge/Tensorflow-2.2+-blue'>
  <img src='https://img.shields.io/badge/NumPy-1.22.3-brightgreen'>
  <img src='https://img.shields.io/badge/pandas-1.4.1-brightgreen'>
  <img src='https://img.shields.io/badge/sklearn-1.0.2-brightgreen'>
</p> 

本教程主要是针对具有机器学习基础并想找推荐算法岗位的同学。教程内容由推荐系统概述、推荐算法基础、推荐系统实战和推荐系统面经四个部分组成。本教程对于入门推荐算法的同学来说，可以从推荐算法的基础到实战再到面试，形成一个闭环。每个部分的详细内容如下：

- **推荐系统概述。** 这部分内容会从推荐系统的意义及应用，到架构及相关的技术栈做一个概述性的总结，目的是为了让初学者更加了解推荐系统。
- **推荐系统算法基础。** 这部分会介绍推荐系统中对于算法工程师来说基础并且重要的相关算法，如经典的召回、排序算法。随着项目的迭代，后续还会不断的总结其他的关键算法和技术，如重排、冷启动等。
- **推荐系统实战。** 这部分内容包含推荐系统竞赛实战和新闻推荐系统的实践。其中推荐系统竞赛实战是结合阿里天池上的新闻推荐入门赛做的相关内容。新闻推荐系统实践是实现一个具有前后端交互及整个推荐链路的项目，该项目是一个新闻推荐系统的demo没有实际的商业化价值。
- **推荐系统算法面经。** 这里会将推荐算法工程师面试过程中常考的一些基础知识、热门技术等面经进行整理，方便同学在有了一定推荐算法基础之后去面试，因为对于初学者来说只有在公司实习学到的东西才是最有价值的。

项目在Datawhale的组队学习过程中不断的迭代和优化，通过大家的反馈来修正或者补充相关的内容，如果对项目内容设计有更好的意见欢迎给我们反馈。为了方便学习和交流，建了一个fun-rec微信交流群，由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群。由于现在已经有了好几个微信群，为了更方便沉淀内容，我们创建了一个Fun-Rec学习小组知识星球，由于我们的内容面向的人群主要是学生，所以知识星球永久免费，感兴趣的可以加入星球讨论（加入星球的同学先看置定的必读帖）。
<div align=center> 
<img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20220408193745249.png" alt="image-20220408193745249" style="zoom:50%;" />
</div>

## 内容导航 
### 推荐系统概述
- [1.1 推荐系统的意义](/ch01/ch1.1)
- [1.2 推荐系统架构](ch01/ch1.2)
- [1.3 推荐系统技术栈](ch01/ch1.3)

### 推荐系统算法基础 
#### 经典召回模型 {docsify-ignore}
- **基于协同过滤的召回**
  - UserCF
  - ItemCF
  - [Swing](ch02/ch2.1/ch2.1.1/Swing)
  - 矩阵分解
- **基于向量的召回**
    - FM召回
    - **item2vec召回系列**
        - word2vec原理
        - item2vec召回
        - Airbnb召回
    - [YoutubeDNN召回](ch02/ch2.1/ch2.1.2/YoutubeDNN)
    - **双塔召回**
        - 经典双塔
        - Youtube双塔
        - MOBIUS
    - **图召回**
        - [EGES](ch02/ch2.1/ch2.1.3/EGES)
        - PinSAGE
    - **序列召回**
        - [MIND](ch02/ch2.1/ch2.1.4/MIND)
        - [SDM](ch02/ch2.1/ch2.1.4/SDM)
- **树模型召回**
    - [TDM](ch02/ch2.1/ch2.1.5/TDM)

#### 经典排序模型
- **[GBDT+LR](ch02/ch2.2/ch2.2.1)**
- **特征交叉**
    - [FM](ch02/ch2.2/ch2.2.2/FM)
    - [PNN](ch02/ch2.2/ch2.2.2/PNN)
    - [DCN](ch02/ch2.2/ch2.2.2/DCN)
    - [AutoInt](ch02/ch2.2/ch2.2.2/AutoInt)
    - [FiBiNET](ch02/ch2.2/ch2.2.2/FiBiNet)
- **WideNDeep系列**
    - **[Wide&Deep](ch02/ch2.2/ch2.2.3/WideNDeep)**
    - **改进Deep侧**
        - [NFM](ch02/ch2.2/ch2.2.3/NFM)
        - [AFM](ch02/ch2.2/ch2.2.3/AFM)
    - **改进Wide侧**
        - [DeepFM](ch02/ch2.2/ch2.2.3/DeepFM)
        - [xDeepFM](ch02/ch2.2/ch2.2.3/xDeepFM)
- **序列模型**
    - [DIN](ch02/ch2.2/ch2.2.4/DIN)
    - [DIEN](ch02/ch2.2/ch2.2.4/DIEN)
    - DISN
    - BST
- **多任务学习**
    - SharedBottom
    - ESSM
    - MMOE
    - PLE

### 推荐系统实战

#### 竞赛实践(天池入门赛-新闻推荐)
- **视频**
  - [赛题理解](https://www.bilibili.com/video/BV1do4y1d7FP?p=1)
  - [多路召回](https://www.bilibili.com/video/BV1do4y1d7FP?p=4)
  - [特征工程](https://www.bilibili.com/video/BV1do4y1d7FP?p=2)
  - [上分技巧](https://www.bilibili.com/video/BV1do4y1d7FP?p=3)
- **文档**
  - [赛题理解&Baseline](ch03/ch3.1/markdown/ch3.1.1)
  - [数据分析](ch03/ch3.1/markdown/ch3.1.2)
  - [多路召回](ch03/ch3.1/markdown/ch3.1.3)
  - [特征工程](ch03/ch3.1/markdown/ch3.1.4)
  - [排序模型&模型融合](ch03/ch3.1/markdown/ch3.1.5)

#### 新闻推荐系统实践
- **视频**
  - [新闻推荐系统流程的构建视频讲解](https://datawhale.feishu.cn/minutes/obcnzns778b725r5l535j32o)
- **文档**
  - **离线物料系统的构建**
      - [Mysql基础](ch03/ch3.2/3.2.1.1)
      - [MongoDB基础](ch03/ch3.2/3.2.1.2)
      - [Redis基础](ch03/ch3.2/3.2.1.3)
      - [Scrapy基础及新闻爬取实战](ch03/ch3.2/3.2.1.4)
      - [自动化构建用户及物料画像](ch03/ch3.2/3.2.1.5)
  - **前后端基础及交互**
      - [前端基础及Vue实战](ch03/ch3.2/3.2.2.1)
      - [flask简介及基础](ch03/ch3.2/3.2.2.2)
      - [前后端交互](ch03/ch3.2/3.2.2.3)
  - [推荐系统流程的构建](ch03/ch3.2/3.2.3)
  - **召回**
      - 热度召回
      - 地域召回
      - [YoutubeDNN召回](ch03/ch3.2/3.2.4.3)
      - [DSSM召回](ch03/ch3.2/3.2.4.4)
  - DeepFM排序模型
  - 规则与重排
  - 任务监控与调度
- **当前问题汇总**
  - [熟悉推荐系统基本流程问答整理](ch03/ch3.2/3.2.8.1)
  - [数据库的基本使用问答整理](ch03/ch3.2/3.2.8.2)
  - [离线物料系统的构建问答整理](ch03/ch3.2/3.2.8.3)

### 推荐系统算法面经
  - [ML与DL基础](ch04/ch4.1)
  - [推荐模型相关](ch04/ch4.2)
  - [热门技术相关](ch04/ch4.3)
  - [业务场景相关](ch04/ch4.4)
  - [HR及其他](ch04/ch4.5)


### 备注

[2.1 竞赛实践(天池入门赛-新闻推荐)](https://tianchi.aliyun.com/competition/entrance/531842/forum)

<div align=center>
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165802957.png" alt="image-20211213165802957" style="zoom:58%;" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165847593.png" alt="image-20211213165847593" style="zoom:58%;" />
</div>

**2.2 新闻推荐系统实践前端展示和后端逻辑(项目没有任何商用价值仅供入门者学习)**

<div align=center> 
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211205142026937.png" alt="image-20211205142026937" style="zoom:57%;" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片Fun-Rec新闻推荐系统.png" alt="Fun-Rec新闻推荐系统" style="zoom:50%;" />
</div>


## 致谢
**核心贡献者**
- 罗如意-项目负责人（Datawhale成员-西安电子科技大学-算法工程师）
- 何世福-项目发起者（Datawhale成员-大连理工大学-算法工程师）
- 吴忠强（Datawhale成员-东北大学-算法工程师-CSDN博客专家）
- 赖敏材（Datawhale成员-上海科技大学-算法工程师）
- 汪志鸿（Datawhale成员-东北大学-算法工程师）
- 王辰玥（Datawhale意向成员-中国地质大学(武汉)-在校生）

**其他** 

感谢徐何军，李万业，陈琰钰，陈锴，梁家晖，王贺，宁彦吉，田雨，唐鑫，宋禹成，刘雯静，吕豪杰，张汉隆，吴丹飞，王云川，肖桐，管柯琴，陈雨龙，宋禹成等在最早期的时候对fun-rec所做的贡献!

## 关注我们
<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="https://raw.githubusercontent.com/datawhalechina/pumpkin-book/master/res/qrcode.jpeg" width = "180" height = "180">
</div>

## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>
本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。