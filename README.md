<div align=center>
  <h1>FunRec 推荐系统</h1>
</div>
<div align="center">

中文 | [English](./README_en.md)

</div>

本教程是一本全面系统的推荐系统学习指南，主要面向具有机器学习基础并希望深入推荐算法领域的同学。教程内容涵盖推荐系统的理论基础、核心算法、工程实践和面试准备四个维度，为初学者构建了从理论学习到实战应用再到求职面试的完整学习闭环。

## 📚 教程内容概览

### 🎯 **推荐系统概述**
从推荐系统的基本概念出发，全面介绍推荐系统的意义、应用场景、技术架构和相关技术栈，帮助初学者建立对推荐系统的整体认知和理解。

### 🔍 **召回模型**
深入讲解推荐系统中的召回算法，包括：
- **协同过滤**：经典的用户协同过滤和物品协同过滤算法
- **向量召回**：基于embedding的召回方法
- **序列召回**：考虑用户行为序列的召回策略

### 🎯 **精排模型**
系统介绍推荐系统中的排序算法核心技术：
- **记忆与泛化**：Wide & Deep等经典模型
- **特征交叉**：自动化特征交叉方法
- **序列建模**：用户行为序列建模技术
- **多目标建模**：多任务学习在推荐中的应用
- **多场景建模**：跨域推荐和场景适配

### 🔄 **重排模型**
探讨推荐系统的重排序技术：
- **基于贪心的重排**：简单高效的重排策略
- **基于个性化的重排**：考虑用户个性化的重排方法

### 🚀 **难点及热点研究**
关注推荐系统的前沿技术和挑战：
- **模型去偏**：解决推荐系统中的偏差问题
- **冷启动问题**：新用户和新物品的推荐策略
- **生成式推荐**：基于生成模型的推荐方法

### 💼 **项目实践**
结合真实竞赛案例，提供完整的推荐系统实战经验：
- 赛题理解与数据分析
- Baseline构建与优化
- 多路召回策略设计
- 特征工程与排序模型

### 🎤 **面试经验**
整理推荐算法工程师面试中的核心知识点：
- 机器学习基础理论
- 推荐模型核心算法
- 热门技术发展趋势
- 业务场景实际应用
- HR面试技巧

## 🎯 **学习目标**

通过本教程的学习，您将能够：
- 🔧 **掌握核心算法**：深入理解推荐系统各个环节的核心算法原理
- 💻 **具备实战能力**：通过项目实践获得端到端的推荐系统开发经验
- 📈 **跟上技术前沿**：了解推荐系统的最新发展趋势和热点技术
- 🎯 **通过技术面试**：具备推荐算法工程师岗位的面试竞争力


为了方便学习和交流，**我们建立了FunRec学习社区（微信群+知识星球）**，微信群方便大家平时日常交流和讨论，知识星球方便沉淀内容，B站上还有一些早期录制的相关视频[跟技术相关的分享内容都放在了B站](https://space.bilibili.com/431850986/channel/collectiondetail?sid=339597)。由于微信群的二维码只有7天内有效，所以直接加下面这个微信，备注：**Fun-Rec**，会被拉到Fun-Rec交流群，如果觉得微信群比较吵建议直接加知识星球！。

<div align=center> 
<img src="book/img/join_community.png" alt="image-20220408193745249" width="400px";" />
</div>


## 致谢
**核心贡献者**

<table border="0">
  <tbody>
    <tr align="center" >
      <td>
         <a href="https://github.com/ruyiluo"><img width="70" height="70" src="https://github.com/ruyiluo.png?s=40" alt="pic"></a><br>
         <a href="https://github.com/ruyiluo">Ruyi Luo</a> 
        <p><br> 西安电子科技大学硕士 <br> 推荐算法工程师 </p>
      </td>
      <td>
         <a href="https://github.com/bokang-ugent"><img width="70" height="70" src="https://github.com/bokang-ugent.png?s=40" alt="pic"></a><br>
         <a href="https://bokang.io">Bo Kang</a> 
        <p><br> 比利时根特大学博士 <br> <a href="https://nobl.ai/">nobl.ai</a> 联合创始人 </p>
      </td>
    </tr>
  </tbody>
</table>

特别感谢[kenken-xr](https://github.com/kenken-xr)、[swallown1](https://github.com/swallown1)、、[Lyons-T](https://github.com/Lyons-T)、[zhongqiangwu960812](https://github.com/zhongqiangwu960812)、[@wangych6](https://github.com/wangych6)、[@morningsky](https://github.com/morningsky)、[@hilbert-yaa](https://github.com/hilbert-yaa)、[@maxxbaba](https://github.com/maxxbaba)、[@pearfl](https://github.com/pearfl)、[@ChungKingExpress](https://github.com/ChungKingExpress)、[@storyandwine](https://github.com/storyandwine)、[@SYC1123](https://github.com/SYC1123)、[@luzixiao](https://github.com/luzixiao)、[@Evan-wyl](https://github.com/Evan-wyl)、[@Sm1les](https://github.com/Sm1les)、[@LSGOMYP](https://github.com/LSGOMYP)等人早期对本项目的帮助与支持。


## 关注我们
<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="book/img/datawhale_qrcode.jpg" width = "180" height = "180">
</div>

Datawhale，一个专注于AI领域的学习圈子。初衷是for the learner，和学习者一起成长。目前加入学习社群的人数已经数千人，组织了机器学习，深度学习，数据分析，数据挖掘，爬虫，编程，统计学，Mysql，数据竞赛等多个领域的内容学习，微信搜索公众号Datawhale可以加入我们。


## LICENSE
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>
本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。
