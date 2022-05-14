# FM 模型结构

FM 模型用于排序时，模型的公式定义如下：
$$
\hat{y}(\mathbf{x}):=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n} \sum_{j=i+1}^{n}\left\langle\mathbf{v}_{i}, \mathbf{v}_{j}\right\rangle x_{i} x_{j}
$$
+ 其中，$i$ 表示特征的序号，$n$ 表示特征的数量；$x_i \in \mathbb{R}$ 表示第 $i$ 个特征的值。
+ $v_i,v_j \in \mathbb{R}^{k} $ 分别表示特征 $x_i,x_j$ 对应的隐语义向量（Embedding向量）， $\left\langle\mathbf{v}_{i}, \mathbf{v}_{j}\right\rangle:=\sum_{f=1}^{k} v_{i, f} \cdot v_{j, f}$ 。
+ $w_0,w_i\in \mathbb{R}$ 均表示需要学习的参数。

**FM 的一阶特征交互** 

在 FM 的表达式中，前两项为特征的一阶交互项。将其拆分为用户特征和物品特征的一阶特征交互项，如下：
$$
\begin{aligned}
& w_{0}+\sum_{i=1}^{n} w_{i} x_{i} \\
&= w_{0} + \sum_{t \in I}w_{t} x_{t} + \sum_{u\in U}w_{u} x_{u} \\
\end{aligned}
$$

+ 其中，$U$ 表示用户相关特征集合，$I$ 表示物品相关特征集合。

**FM 的二阶特征交互**

观察 FM 的二阶特征交互项，可知其计算复杂度为 $O\left(k n^{2}\right)$ 。为了降低计算复杂度，按照如下公式进行变换。
$$
\begin{aligned}
& \sum_{i=1}^{n} \sum_{j=i+1}^{n}\left\langle\mathbf{v}_{i}, \mathbf{v}_{j}\right\rangle x_{i} x_{j} \\
=& \frac{1}{2} \sum_{i=1}^{n} \sum_{j=1}^{n}\left\langle\mathbf{v}_{i}, \mathbf{v}_{j}\right\rangle x_{i} x_{j}-\frac{1}{2} \sum_{i=1}^{n}\left\langle\mathbf{v}_{i}, \mathbf{v}_{i}\right\rangle x_{i} x_{i} \\
=& \frac{1}{2}\left(\sum_{i=1}^{n} \sum_{j=1}^{n} \sum_{f=1}^{k} v_{i, f} v_{j, f} x_{i} x_{j}-\sum_{i=1}^{n} \sum_{f=1}^{k} v_{i, f} v_{i, f} x_{i} x_{i}\right) \\
=& \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{i=1}^{n} v_{i, f} x_{i}\right)^{}\left(\sum_{j=1}^{n} v_{j, f} x_{j}\right)-\sum_{i=1}^{n} v_{i, f}^{2} x_{i}^{2}\right) \\
=& \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{i=1}^{n} v_{i, f} x_{i}\right)^{2}-\sum_{i=1}^{n} v_{i, f}^{2} x_{i}^{2}\right)
\end{aligned}
$$
+ 公式变换后，计算复杂度由 $O\left(k n^{2}\right)$ 降到 $O\left(k n\right)$。

由于本文章需要将 FM 模型用在召回，故将二阶特征交互项拆分为用户和物品项。有：
$$
\begin{aligned}
& \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{i=1}^{n} v_{i, f} x_{i}\right)^{2}-\sum_{i=1}^{n} v_{i, f}^{2} x_{i}^{2}\right) \\
=& \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{u \in U} v_{u, f} x_{u} + \sum_{t \in I} v_{t, f} x_{t}\right)^{2}-\sum_{u \in U} v_{u, f}^{2} x_{u}^{2} - \sum_{t\in I} v_{t, f}^{2} x_{t}^{2}\right) \\
=& \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{u \in U} v_{u, f} x_{u}\right)^{2} + \left(\sum_{t \in I} v_{t, f} x_{t}\right)^{2} + 2{\sum_{u \in U} v_{u, f} x_{u}}{\sum_{t \in I} v_{t, f} x_{t}} - \sum_{u \in U} v_{u, f}^{2} x_{u}^{2} - \sum_{t \in I} v_{t, f}^{2} x_{t}^{2}\right)  
\end{aligned}
$$

+ 其中，$U$ 表示用户相关特征集合，$I$ 表示物品相关特征集合。



# FM 用于召回

基于 FM 召回，我们可以将 $\hat{y}(\mathbf{x}):=w_{0}+\sum_{i=1}^{n} w_{i} x_{i}+\sum_{i=1}^{n} \sum_{j=i+1}^{n}\left\langle\mathbf{v}_{i}, \mathbf{v}_{j}\right\rangle x_{i} x_{j}$ 作为用户和物品之间的匹配分。

+ 在上一小节中，对于 FM 的一阶、二阶特征交互项，已将其拆分为用户项和物品项。
+ 对于同一用户，即便其与不同物品进行交互，但用户特征内部之间的一阶、二阶交互项得分都是相同的。
+ 这就意味着，在比较用户与不同物品之间的匹配分时，只需要比较：（1）物品内部之间的特征交互得分；（2）用户和物品之间的特征交互得分。

**FM 的一阶特征交互** 

+ 将全局偏置和用户一阶特征交互项进行丢弃，有：
  $$
  FM_{一阶} = \sum_{t \in I} w_{t} x_{t}
  $$

**FM 的二阶特征交互**

+ 将用户特征内部的特征交互项进行丢弃，有：
  $$
  \begin{aligned}
  & FM_{二阶} = \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{t \in I} v_{t, f} x_{t}\right)^{2} + 2{\sum_{u \in U} v_{u, f} x_{u}}{\sum_{t \in I} v_{t, f} x_{t}} - \sum_{t \in I} v_{t, f}^{2} x_{t}^{2}\right)  \\
  &= \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{t \in I} v_{t, f} x_{t}\right)^{2}  - \sum_{t \in I} v_{t, f}^{2} x_{t}^{2}\right)  + \sum_{f=1}^{k}\left( {\sum_{u \in U} v_{u, f} x_{u}}{\sum_{t \in I} v_{t, f} x_{t}} \right) 
  
  
  \end{aligned}
  $$

合并 FM 的一阶、二阶特征交互项，得到基于 FM 召回的匹配分计算公式：
$$
\text{MatchScore}_{FM} = \sum_{t \in I} w_{t} x_{t} + \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{t \in I} v_{t, f} x_{t}\right)^{2}  - \sum_{t \in I} v_{t, f}^{2} x_{t}^{2}\right)  + \sum_{f=1}^{k}\left( {\sum_{u \in U} v_{u, f} x_{u}}{\sum_{t \in I} v_{t, f} x_{t}} \right)
$$
在基于向量的召回模型中，为了 ANN（近似最近邻算法） 或 Faiss 加速查找与用户兴趣度匹配的物品。基于向量的召回模型，一般最后都会得到用户和物品的特征向量表示，然后通过向量之间的内积或者余弦相似度表示用户对物品的兴趣程度。

基于 FM 模型的召回算法，也是向量召回算法的一种。所以下面，将 $\text{MatchScore}_{FM}$ 化简为用户向量和物品向量的内积形式，如下：
$$
\text{MatchScore}_{FM} = V_{item} V_{user}^T
$$

+ 用户向量：
  $$
  V_{user} = [1; \quad {\sum_{u \in U} v_{u} x_{u}}]
  $$

  + 用户向量由两项表达式拼接得到。
  + 第一项为常数 $1$，第二项是将用户相关的特征向量进行 sum pooling 。

+ 物品向量：
  $$
  V_{item} = [\sum_{t \in I} w_{t} x_{t} + \frac{1}{2} \sum_{f=1}^{k}\left(\left(\sum_{t \in I} v_{t, f} x_{t}\right)^{2}  - \sum_{t \in I} v_{t, f}^{2} x_{t}^{2}\right); \quad
  {\sum_{t \in I} v_{t} x_{t}} ]
  $$
  
  + 第一项表示物品相关特征向量的一阶、二阶特征交互。
  + 第二项是将物品相关的特征向量进行 sum pooling 。



# 思考题

1. 为什么不直接将 FM 中学习到的 User Embedding： ${\sum_{u \in U} v_{u} x_{u}}$ 和 Item Embedding： $\sum_{t \in I} v_{t} x_{t}$ 的内积做召回呢？

   答：这样做，也不是不行，但是效果不是特别好。**因为用户喜欢的，未必一定是与自身最匹配的，也包括一些自身性质极佳的item（e.g.,热门item）**，所以，**非常有必要将"所有Item特征一阶权重之和"和“所有Item特征隐向量两两点积之和”考虑进去**，但是也还必须写成点积的形式。



# 代码实战

正在完善...



# 参考链接

+ [paper.dvi (ntu.edu.tw)](https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf)
+ [FM：推荐算法中的瑞士军刀 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/343174108)
