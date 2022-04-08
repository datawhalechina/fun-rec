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
- [推荐系统的意义](/推荐系统概述/推荐系统的意义)
- 推荐系统的应用【未完成】
- 推荐系统的架构【未完成】
- 推荐系统技术栈【未完成】

### 推荐系统算法基础  
#### 经典召回模型
- **基于协同过滤的召回**
    - UserCF【已完成，待优化】
    - ItemCF【已完成，待优化】
    - Swing(Graph-based)【未完成】
    - 矩阵分解系列(ALS,SVD++)【已完成，待优化】
- **基于向量的召回**
    - FM召回【未完成】
    - word2vec召回
        - word2vec原理【未完成】
        - Airbnb召回【未完成】
    - YoutubeDNN召回【完成一半，待优化】
    - 双塔召回
        - 经典双塔【未完成】
        - Youtube双塔【未完成】
        - MOBIUS【未完成】
    - 图召回
        - EGES【完成一半，待优化】
        - PinSAGE【未完成】
    - 序列召回
        - MIND【已完成，待优化】
        - SDM【完成一半，待优化】
- **树模型召回**
    - TDM【未完成】

#### 经典排序模型
- **[GBDT+LR](/推荐算法基础/经典排序模型/GBDT+LR)**
- **特征交叉**
    - [FM](/推荐算法基础/经典排序模型/特征交叉/FM)
    - [PNN](/推荐算法基础/经典排序模型/特征交叉/PNN)
    - [DCN](/推荐算法基础/经典排序模型/特征交叉/DCN)
    - AutoInt【完成一半，待优化】
    - FiBiNET【完成一半，待优化】
- **WideNDeep系列**
    - **[Wide&Deep](/推荐算法基础/经典排序模型/Wide&Deep系列/Wide&Deep)**
    - **改进Deep侧**
        - [NFM](/推荐算法基础/经典排序模型/Wide&Deep系列/NFM)
        - [AFM](/推荐算法基础/经典排序模型/Wide&Deep系列/AFM)
    - **改进Wide侧**
        - [DeepFM](/推荐算法基础/经典排序模型/Wide&Deep系列/DeepFM)
        - xDeepFM【未完成】
- **序列模型**
    - [DIN](/推荐算法基础/经典排序模型/序列模型/DIN)
    - [DIEN](/推荐算法基础/经典排序模型/序列模型/DIEN)
    - DISN【未完成】
    - BST【未完成】
- **多任务学习**
    - SharedBottom【已完成，待优化】
    - ESSM【已完成，待优化】
    - MMOE【已完成，待优化】
    - PLE【已完成，待优化】

### 推荐系统实战

#### 竞赛实践(天池入门赛-新闻推荐)
- **视频**
  - [赛题理解](https://www.bilibili.com/video/BV1do4y1d7FP?p=1)
  - [多路召回](https://www.bilibili.com/video/BV1do4y1d7FP?p=4)
  - [特征工程](https://www.bilibili.com/video/BV1do4y1d7FP?p=2)
  - [上分技巧](https://www.bilibili.com/video/BV1do4y1d7FP?p=3)
- **文档**
  - [赛题理解&Baseline](/推荐系统实战/竞赛实践/markdown/赛题理解+Baseline)
  - [数据分析](/推荐系统实战/竞赛实践/markdown/数据分析)
  - [多路召回](/推荐系统实战/竞赛实践/markdown/多路召回)
  - [特征工程](/推荐系统实战/竞赛实践/markdown/特征工程)
  - [排序模型&模型融合](/推荐系统实战/竞赛实践/markdown/排序模型+模型融合)

#### 新闻推荐系统实践
- 新闻推荐系统流程的构建视频讲解【已完成】
- 离线物料系统的构建
    - Mysql基础【已完成】
    - MongoDB基础【已完成】
    - Redis基础【已完成】
    - Scrapy基础及新闻爬取实战【已完成】
    - 自动化构建用户及物料画像【已完成】
- 前后端基础及交互
    - 前端基础及Vue实战【已完成】
    - flask简介及基础【已完成】
    - 前后端交互【已完成】
- 推荐流程的构建【已完成】
- 召回
    - 规则类召回
      - 热度召回【完成一半，待优化】
      - 地域召回【完成一半，待优化】
    - 模型类召回
      - YoutubeDNN召回【已完成，待优化】
      - DSSM召回【已完成，待优化】
- DeepFM排序模型【已完成，待优化】
- 规则与重排【完成一半，待优化】
- 任务监控与调度【完成一半，待优化】

### 推荐系统算法面经
  - [ML与DL基础](/推荐算法面经/ML与DL基础)
  - [推荐模型相关](/推荐算法面经/推荐模型相关)
  - [热门技术相关](/推荐算法面经/热门技术相关)
  - [业务场景相关](/推荐算法面经/业务场景相关)
  - [HR及其他](/推荐算法面经/HR及其他)


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