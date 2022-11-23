# FunRec-[在线阅读](https://datawhalechina.github.io/fun-rec/#/)
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

**特别说明**：项目内容是由一群热爱分享的同学一起花时间整理而成，**大家的水平都非常有限，内容难免存在一些错误和问题，如果学习者发现问题，也欢迎及时反馈，避免让后学者踩坑！** 如果对该项目有改进或者优化的建议，还希望通过下面的二维码找到项目负责人或者在交流社区中提出，我们会参考大家的意见进一步对该项目进行修改和调整！如果想对该项目做一些贡献，也可以通过上述同样的方法找到我们！

为了方便学习和交流，**我们建立了FunRec学习社区（微信群+知识星球）**，微信群方便大家平时日常交流和讨论，知识星球方便沉淀内容。由于我们的内容面向的人群主要是学生，所以**知识星球永久免费**，感兴趣的可以加入星球讨论（加入星球的同学先看置定的必读帖）！**FunRec学习社区内部会不定期分享(FunRec社区中爱分享的同学)技术总结、个人管理等内容，[跟技术相关的分享内容都放在了B站](https://space.bilibili.com/431850986/channel/collectiondetail?sid=339597)上面**。由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群，如果觉得微信群比较吵建议直接加知识星球！。

<div align=center> 
<img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20220408193745249.png" alt="image-20220408193745249" width="500px";" />
</div>

**注意：不建议直接在github上面阅读（公式图片容易解析错误），推荐点击上面的在线阅读或者离线下载下来之后使用markdown工具（如typora）查看！**                                                                                                                               
## 内容导航 
### 推荐系统概述
- [推荐系统的意义](docs/ch01/ch1.1.md)
- [推荐系统架构](docs/ch01/ch1.2.md)
- [推荐系统技术栈](docs/ch01/ch1.3.md)

### 推荐系统算法基础 
#### **经典召回模型**
- **基于协同过滤的召回**
  - [UserCF](docs/ch02/ch2.1/ch2.1.1/usercf.md)
  - [ItemCF](docs/ch02/ch2.1/ch2.1.1/itemcf.md)
  - [Swing](docs/ch02/ch2.1/ch2.1.1/Swing.md)
  - [矩阵分解](docs/ch02/ch2.1/ch2.1.1/mf.md)
- **基于向量的召回**
    - [FM召回](docs/ch02/ch2.1/ch2.1.2/FM.md)
    - **item2vec召回系列**
        - [word2vec原理](docs/ch02/ch2.1/ch2.1.2/word2vec.md)
        - [item2vec召回](docs/ch02/ch2.1/ch2.1.2/item2vec.md)
        - [Airbnb召回](docs/ch02/ch2.1/ch2.1.2/Airbnb.md)
    - [YoutubeDNN召回](docs/ch02/ch2.1/ch2.1.2/YoutubeDNN.md)
    - **双塔召回**
        - [经典双塔](docs/ch02/ch2.1/ch2.1.2/DSSM.md)
        - [Youtube双塔](docs/ch02/ch2.1/ch2.1.2/YoutubeTwoTower.md)
    - **图召回**
        - [EGES](docs/ch02/ch2.1/ch2.1.3/EGES.md)
        - [PinSAGE](docs/ch02/ch2.1/ch2.1.3/PinSage.md)
    - **序列召回**
        - [MIND](docs/ch02/ch2.1/ch2.1.4/MIND.md)
        - [SDM](docs/ch02/ch2.1/ch2.1.4/SDM.md)
- **树模型召回**
    - [TDM](docs/ch02/ch2.1/ch2.1.5/TDM.md)

#### **经典排序模型**
- **[GBDT+LR](docs/ch02/ch2.2/ch2.2.1.md)**
- **特征交叉**
    - [FM](docs/ch02/ch2.2/ch2.2.2/FM.md)
    - [PNN](docs/ch02/ch2.2/ch2.2.2/PNN.md)
    - [DCN](docs/ch02/ch2.2/ch2.2.2/DCN.md)
    - [AutoInt](docs/ch02/ch2.2/ch2.2.2/AutoInt.md)
    - [FiBiNET](docs/ch02/ch2.2/ch2.2.2/FiBiNet.md)
- **WideNDeep系列**
    - **[Wide&Deep](docs/ch02/ch2.2/ch2.2.3/WideNDeep.md)**
    - **改进Deep侧**
        - [NFM](docs/ch02/ch2.2/ch2.2.3/NFM.md)
        - [AFM](docs/ch02/ch2.2/ch2.2.3/AFM.md)
    - **改进Wide侧**
        - [DeepFM](docs/ch02/ch2.2/ch2.2.3/DeepFM.md)
        - [xDeepFM](docs/ch02/ch2.2/ch2.2.3/xDeepFM.md)
- **序列模型**
    - [DIN](docs/ch02/ch2.2/ch2.2.4/DIN.md)
    - [DIEN](docs/ch02/ch2.2/ch2.2.4/DIEN.md)
    - [DSIN](docs/ch02/ch2.2/ch2.2.4/DSIN.md)
- **多任务学习**
    - [多任务学习概述](docs/ch02/ch2.2/ch2.2.5/2.2.5.0.md)
    - [ESMM](docs/ch02/ch2.2/ch2.2.5/ESMM.md)
    - [MMOE](docs/ch02/ch2.2/ch2.2.5/MMOE.md)
    - [PLE](docs/ch02/ch2.2/ch2.2.5/PLE.md)

### 推荐系统实战

#### **竞赛实践(天池入门赛-新闻推荐【建议使用tf1.14】)**
- **视频**
  - [赛题理解](https://www.bilibili.com/video/BV1do4y1d7FP?p=1)
  - [多路召回](https://www.bilibili.com/video/BV1do4y1d7FP?p=4)
  - [特征工程](https://www.bilibili.com/video/BV1do4y1d7FP?p=2)
  - [上分技巧](https://www.bilibili.com/video/BV1do4y1d7FP?p=3)
- **文档**
  - [赛题理解&Baseline](docs/ch03/ch3.1/markdown/ch3.1.1.md)
  - [数据分析](docs/ch03/ch3.1/markdown/ch3.1.2.md)
  - [多路召回](docs/ch03/ch3.1/markdown/ch3.1.3.md)
  - [特征工程](docs/ch03/ch3.1/markdown/ch3.1.4.md)
  - [排序模型&模型融合](docs/ch03/ch3.1/markdown/ch3.1.5.md)

#### **新闻推荐系统实践**
- [特别说明(必看)](docs/ch03/ch3.2/3.2.md)
- **视频**
  - [新闻推荐系统流程的构建视频讲解](https://datawhale.feishu.cn/minutes/obcnzns778b725r5l535j32o)
- **文档**
  - **离线物料系统的构建**
      - [Mysql基础](docs/ch03/ch3.2/3.2.1.1.md)
      - [MongoDB基础](docs/ch03/ch3.2/3.2.1.2.md)
      - [Redis基础](docs/ch03/ch3.2/3.2.1.3.md)
      - [Scrapy基础及新闻爬取实战](docs/ch03/ch3.2/3.2.1.4.md)
      - [自动化构建用户及物料画像](docs/ch03/ch3.2/3.2.1.5.md)
  - **前后端基础及交互**
      - [前端基础及Vue实战](docs/ch03/ch3.2/3.2.2.1.md)
      - [flask简介及基础](docs/ch03/ch3.2/3.2.2.2.md)
      - [前后端交互](docs/ch03/ch3.2/3.2.2.3.md)
  - [推荐系统流程的构建](docs/ch03/ch3.2/3.2.3.md)
  - **召回**
      - [规则类召回](docs/ch03/ch3.2/3.2.4.1.md)
      - [YoutubeDNN召回](docs/ch03/ch3.2/3.2.4.2.md)
      - [DSSM召回](docs/ch03/ch3.2/3.2.4.3.md)
  - [DeepFM排序模型](docs/ch03/ch3.2/3.2.5.md)
  - [重排(打散策略)](docs/ch03/ch3.2/3.2.6.md)
- **当前问题汇总**
  - [熟悉推荐系统基本流程问答整理](docs/ch03/ch3.2/3.2.8.1.md)
  - [数据库的基本使用问答整理](docs/ch03/ch3.2/3.2.8.2.md)
  - [离线物料系统的构建问答整理](docs/ch03/ch3.2/3.2.8.3.md)

### 推荐系统算法面经
  - [ML与DL基础](docs/ch04/ch4.1.md)
  - [推荐模型相关](docs/ch04/ch4.2.md)
  - [热门技术相关](docs/ch04/ch4.3.md)
  - [业务场景相关](docs/ch04/ch4.4.md)
  - [HR及其他](docs/ch04/ch4.5.md)


### 备注

[2.1 竞赛实践(天池入门赛-新闻推荐)](https://tianchi.aliyun.com/competition/entrance/531842/forum)

<div align=center>
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165802957.png" alt="image-20211213165802957" width="800px" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211213165847593.png" alt="image-20211213165847593" width="800px" />
</div>

**2.2 新闻推荐系统实践前端展示和后端逻辑(项目没有任何商用价值仅供入门者学习)**

<div align=center> 
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211205142026937.png" alt="image-20211205142026937" width="800px" />
    <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片Fun-Rec新闻推荐系统.png" alt="Fun-Rec新闻推荐系统" width="810px" />
</div>


## 致谢

**核心贡献者**

- 罗如意-项目负责人（Datawhale成员-西安电子科技大学-算法工程师）
- 何世福-项目发起者（Datawhale成员-大连理工大学-算法工程师）
- 吴忠强（Datawhale成员-东北大学-算法工程师-CSDN博客专家）
- 赖敏材（Datawhale成员-上海科技大学-算法工程师）
- 汪志鸿（Datawhale成员-东北大学-算法工程师）
- 王辰玥（Datawhale意向成员-中国地质大学(武汉)-在校生）

**重要贡献者（根据内容+社区贡献程度筛选）**

- 唐鑫（Datawhale意向成员-西安电子科技大学-在校生）
- 王宇宸（Datawhale意向成员-上海科技大学-在校生）

**其他**  

感谢徐何军，李万业，陈琰钰，陈锴，梁家晖，王贺，宁彦吉，田雨，宋禹成，刘雯静，吕豪杰，张汉隆，吴丹飞，王云川，肖桐，管柯琴，陈雨龙，宋禹成等在最早期的时候对fun-rec所做的贡献!

## 关注我们
<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="https://raw.githubusercontent.com/datawhalechina/pumpkin-book/master/res/qrcode.jpeg" width = "180" height = "180">
</div>

## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>
本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
