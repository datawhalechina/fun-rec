# Fun-Rec项目介绍

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

<div align=center> <img src="http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20210327163711753.png" width = 20%/> </div>

## 内容导航
### 推荐系统概述
- 推荐系统的意义
- 推荐系统的应用
- 推荐系统的架构
- 推荐系统技术栈

### 推荐算法基础  
#### 经典召回模型
- **基于协同过滤的召回**
    - UserCF
    - ItemCF
    - Swing(Graph-based)
    - 矩阵分解系列(ALS,SVD++)
- **基于向量的召回**
    - FM召回
    - word2vec召回
        - word2vec原理
        - Airbnb召回
    - YoutubeDNN召回
    - 双塔召回
        - DSSM
        - Youtube双塔
        - MOBIUS
    - 图召回
        - EGES
        - PinSAGE
    - 序列召回
        - MIND
        - SDM
- **树模型召回**
    - TDM

#### 经典排序模型
- **GBDT+LR**
- **特征交叉**
    - FM
    - PNN
    - DCN
    - AutoInt
    - FiBiNET
- **WideNDeep系列**
    - Wide&Deep
    - 改进Deep侧
        - NFM
        - AFM
    - 改进Wide侧
        - DeepFM
        - xDeepFM
- **序列模型**
    - DIN
    - DIEN
    - DISN
    - BST
- **多任务学习**
    - SharedBottom
    - ESSM
    - MMOE
    - PLE

### 推荐系统实战

#### 竞赛实践(天池入门赛-新闻推荐)
- 入门赛讲解视频
- 赛题理解&Baseline
- 数据分析
- 多路召回
- 特征工程
- 排序模型&模型融合

#### 新闻推荐系统实践
- 新闻推荐系统流程的构建视频讲解
- 离线物料系统的构建
    - Mysql基础
    - MongoDB基础
    - Redis基础
    - Scrapy基础及新闻爬取实战
    - 自动化构建用户及物料画像
- 前后端基础及交互
    - 前端基础及Vue实战
    - flask简介及基础
    - 前后端交互
- 推荐流程的构建
- 召回
    - 规则类召回
    - 热度召回
    - 地域召回
    - 模型类召回
    - YoutubeDNN召回
    - DSSM召回
- DeepFM排序模型
- 规则与重排
- 任务监控与调度    

### 第三章 推荐算法面经
  - ML与DL基础
  - 推荐模型相关
  - 热门技术相关
  - 业务场景相关

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