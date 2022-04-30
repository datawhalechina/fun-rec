# 隐语义模型与矩阵分解

协同过滤算法的特点：

+ 协同过滤算法的特点就是完全没有利用到物品本身或者是用户自身的属性， 仅仅利用了用户与物品的交互信息就可以实现推荐，是一个可解释性很强， 非常直观的模型。
+ 但是也存在一些问题，处理稀疏矩阵的能力比较弱。

为了使得协同过滤更好处理稀疏矩阵问题， 增强泛化能力。从协同过滤中衍生出矩阵分解模型(Matrix Factorization, MF)或者叫隐语义模型：

+ 在协同过滤共现矩阵的基础上， 使用更稠密的隐向量表示用户和物品。
+ 通过挖掘用户和物品的隐含兴趣和隐含特征， 在一定程度上弥补协同过滤模型处理稀疏矩阵能力不足的问题。



# 隐语义模型

隐语义模型最早在文本领域被提出，用于找到文本的隐含语义。在2006年， 被用于推荐中， 它的核心思想是通过隐含特征（latent  factor）联系用户兴趣和物品（item）， 基于用户的行为找出潜在的主题和分类， 然后对物品进行自动聚类，划分到不同类别/主题(用户的兴趣)。

以项亮老师《推荐系统实践》书中的内容为例：

>如果我们知道了用户A和用户B两个用户在豆瓣的读书列表， 从他们的阅读列表可以看出，用户A的兴趣涉及侦探小说、科普图书以及一些计算机技术书， 而用户B的兴趣比较集中在数学和机器学习方面。 那么如何给A和B推荐图书呢？ 先说说协同过滤算法， 这样好对比不同：
>* 对于UserCF，首先需要找到和他们看了同样书的其他用户（兴趣相似的用户），然后给他们推荐那些用户喜欢的其他书。 
>* 对于ItemCF，需要给他们推荐和他们已经看的书相似的书，比如作者B看了很多关于数据挖掘的书，可以给他推荐机器学习或者模式识别方面的书。 
>
>而如果是隐语义模型的话，  它会先通过一些角度把用户兴趣和这些书归一下类， 当来了用户之后， 首先得到他的兴趣分类， 然后从这个分类中挑选他可能喜欢的书籍。 

隐语义模型和协同过滤的不同主要体现在隐含特征上， 比如书籍的话它的内容， 作者， 年份， 主题等都可以算隐含特征。

以王喆老师《深度学习推荐系统》中的一个原理图为例，看看是如何通过隐含特征来划分开用户兴趣和物品的。

<img src="https://img-blog.csdnimg.cn/20200822212051499.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:80%;" />

## 音乐评分实例

假设每个用户都有自己的听歌偏好， 比如用户 A 喜欢带有**小清新的**， **吉他伴奏的**， **王菲**的歌曲，如果一首歌正好**是王菲唱的， 并且是吉他伴奏的小清新**， 那么就可以将这首歌推荐给这个用户。 也就是说是**小清新， 吉他伴奏， 王菲**这些元素连接起了用户和歌曲。 

当然每个用户对不同的元素偏好不同， 每首歌包含的元素也不一样， 所以我们就希望找到下面的两个矩阵：

1. 潜在因子—— 用户矩阵Q
    这个矩阵表示不同用户对于不同元素的偏好程度， 1代表很喜欢， 0代表不喜欢， 比如下面这样：

  <div align=center>
  <img src="https://img-blog.csdnimg.cn/2020082222025968.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:70%;" />
  </div>
2. 潜在因子——音乐矩阵P
    表示每种音乐含有各种元素的成分， 比如下表中， 音乐A是一个偏小清新的音乐， 含有小清新的Latent Factor的成分是0.9， 重口味的成分是0.1， 优雅成分0.2...

  <div align=center>
  <img src="https://img-blog.csdnimg.cn/20200822220751394.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:70%;" />
  </div>
**计算张三对音乐A的喜爱程度**

利用上面的这两个矩阵，将对应向量进行内积计算，我们就能得出张三对音乐A的喜欢程度：

<div align=center>
<img src="https://img-blog.csdnimg.cn/20200822221627219.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:55%;" />
</div>

+ 张三对**小清新**的偏好 * 音乐A含有**小清新**的成分 + 张三对**重口味**的偏好 * 音乐A含有**重口味**的成分 + 张三对**优雅**的偏好 * 音乐A含有**优雅**的成分... 

+ 根据隐向量其实就可以得到张三对音乐A的打分，即： $$0.6 * 0.9 + 0.8 * 0.1 + 0.1 * 0.2 + 0.1 * 0.4 + 0.7 * 0 = 0.68$$。

**计算所有用户对不同音乐的喜爱程度**

按照这个计算方式， 每个用户对每首歌其实都可以得到这样的分数， 最后就得到了我们的评分矩阵：

<div align=center>
<img src="https://img-blog.csdnimg.cn/20200822222141231.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:60%;" />
</div>
+ 红色部分表示用户没有打分，可以通过隐向量计算得到的。 

**小结**

+ 上面例子中的小清晰， 重口味， 优雅这些就可以看做是隐含特征， 而通过这个隐含特征就可以把用户的兴趣和音乐的进行一个分类， 其实就是找到了每个用户每个音乐的一个隐向量表达形式（与深度学习中的embedding等价）
+ 这个隐向量就可以反映出用户的兴趣和物品的风格，并能将相似的物品推荐给相似的用户等。 **有没有感觉到是把协同过滤算法进行了一种延伸， 把用户的相似性和物品的相似性通过了一个叫做隐向量的方式进行表达**

+ 现实中，类似于上述的矩阵 $P,Q$ 一般很难获得。有的只是用户的评分矩阵，如下：

  <div align=center>
  <img src="https://img-blog.csdnimg.cn/20200822223313349.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:60%;" />
  </div>

  + 这种矩阵非常的稀疏，如果直接基于用户相似性或者物品相似性去填充这个矩阵是不太容易的。
  + 并且很容易出现长尾问题， 而矩阵分解就可以比较容易的解决这个问题。

+ 矩阵分解模型:

  + 基于评分矩阵，将其分解成Q和P两个矩阵乘积的形式，获取用户兴趣和物品的隐向量表达。
  + 然后，基于两个分解矩阵去预测某个用户对某个物品的评分了。 
  + 最后，基于预测评分去进行物品推荐。

  

# 矩阵分解算法

## 算法原理

在矩阵分解的算法框架下， **可以通过分解协同过滤的共现矩阵（评分矩阵）来得到用户和物品的隐向量**，原理如下：。

<div align=center>
<img src="https://img-blog.csdnimg.cn/20200823101513233.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3d1emhvbmdxaWFuZw==,size_1,color_FFFFFF,t_70#pic_center" alt="在这里插入图片描述" style="zoom:70%;" />
</div>
+ 矩阵分解算法将 $m\times n$ 维的共享矩阵 $R$ ，分解成 $m \times k$ 维的用户矩阵 $U$ 和 $k \times n$ 维的物品矩阵 $V$ 相乘的形式。
+ 其中，$m$ 是用户数量， $n$ 是物品数量， $k$ 是隐向量维度， 也就是隐含特征个数。
+ 这里的隐含特征没有太好的可解释性，需要模型自己去学习。
+ 一般而言， $k$ 越大隐向量能承载的信息内容越多，表达能力也会更强，但相应的学习难度也会增加。所以，我们需要根据训练集样本的数量去选择合适的数值，在保证信息学习相对完整的前提下，降低模型的学习难度。

## 评分预测

在分解得到用户矩阵和物品矩阵后，若要计算用户 $u$ 对物品 $i$ 的评分，公式如下：
$$
\operatorname{Preference}(u, i)=r_{u i}=p_{u}^{T} q_{i}=\sum_{k=1}^{K} p_{u, k} q_{i,k}
$$
+ 其中，向量 $p_u$ 表示用户 $u$ 的隐向量，向量  $q_i$ 表示物品 $i$ 的隐向量。
+ 用户向量和物品向量的内积 $p_{u}^{T} q_{i}$ 可以表示为用户 $u$ 对物品 $i$ 的预测评分。
+ $p_{u,k}$ 和 $q_{i,k}$ 是模型的参数， $p_{u,k}$ 度量的是用户 $u$ 的兴趣和第 $k$ 个隐类的关系，$q_{i,k}$ 度量了第 $k$ 个隐类和物品 $i$ 之间的关系。

## 矩阵分解求解

常用的矩阵分解方法有特征值分解(EVD)或者奇异值分解(SVD）， 具体原理可参考：

> [奇异值分解svd原理详解及推导](https://blog.csdn.net/wuzhongqiang/article/details/108168238)

+ 对于 EVD， 它要求分解的矩阵是方阵， 绝大部分场景下用户-物品矩阵不满足这个要求。
+ 传统的 SVD 分解， 会要求原始矩阵是稠密的。但现实中用户的评分矩阵是非常稀疏的。
  + 如果想用奇异值分解， 就必须对缺失的元素进行填充（比如填 0 ）。
  + 填充不但会导致空间复杂度增高，且补全内容不一定准确。 
  + 另外，SVD 分解计算复杂度非常高，而用户-物品的评分矩阵较大，不具备普适性。

## FunkSVD

2006年的Netflix Prize之后， Simon Funk公布了一个矩阵分解算法叫做**Funk-SVD**,  后来被 Netflix Prize 的冠军Koren称为**Latent Factor Model(LFM)**。

Funk-SVD的思想很简单： **把求解上面两个矩阵的参数问题转换成一个最优化问题， 可以通过训练集里面的观察值利用最小化来学习用户矩阵和物品矩阵**。

**算法过程**

1. 根据前面提到的，在有用户矩阵和物品矩阵的前提下，若要计算用户 $u$ 对物品 $i$ 的评分， 可以根据公式：
   $$
   \operatorname{Preference}(u, i)=r_{u i}=p_{u}^{T} q_{i}=\sum_{k=1}^{K} p_{u, k} q_{i,k}
   $$

   + 其中，向量 $p_u$ 表示用户 $u$ 的隐向量，向量  $q_i$ 表示物品 $i$ 的隐向量。

2. 随机初始化一个用户矩阵 $U$ 和一个物品矩阵 $V$，获取每个用户和物品的初始隐语义向量。

3. 将用户和物品的向量内积 $p_{u}^{T} q_{i}$， 作为用户对物品的预测评分 $\hat{r}_{u i}$。

   +  $\hat{r}_{u i}=p_{u}^{T} q_{i}$ 表示的是通过建模，求得的用户 $u$ 对物品的预测评分。
   + 在用户对物品的评分矩阵中，矩阵中的元素 $r_{u i}$ 才是用户对物品的真实评分。

4. 对于评分矩阵中的每个元素，计算预测误差 $e_{u i}=r_{u i}-\hat{r}_{u i}$，对所有训练样本的平方误差进行累加：
   $$
   \operatorname{SSE}=\sum_{u, i} e_{u i}^{2}=\sum_{u, i}\left(r_{u i}-\sum_{k=1}^{K} p_{u,k} q_{i,k}\right)^{2}
   $$

   + 从上述公式可以看出，$SSE$ 建立起了训练数据和预测模型之间的关系。
     
   + 如果我们希望模型预测的越准确，那么在训练集（已有的评分矩阵）上的预测误差应该仅可能小。
     
   + 为方便后续求解，给 $SSE$ 增加系数 $1/2$ ：
     $$
     \operatorname{SSE}=\frac{1}{2} \sum_{u, i} e_{u i}^{2}=\frac{1}{2} \sum_{u, i}\left(r_{u i}-\sum_{k=1}^{K} p_{u k} q_{i k}\right)^{2}
     $$

5.  前面提到，模型预测越准确等价于预测误差越小，那么优化的目标函数变为：
   $$
   \min _{\boldsymbol{q}^{*}, \boldsymbol{p}^{*}} \frac{1}{2} \sum_{(u, i) \in K}\left(\boldsymbol{r}_{\mathrm{ui}}-p_{u}^{T} q_{i}\right)^{2}
   $$

   + $K$ 表示所有用户评分样本的集合，**即评分矩阵中不为空的元素**，其他空缺值在测试时是要预测的。
   + 该目标函数需要优化的目标是用户矩阵 $U$ 和一个物品矩阵 $V$。

6. 对于给定的目标函数，可以通过梯度下降法对参数进行优化。

   + 求解目标函数 $SSE$ 关于用户矩阵中参数 $p_{u,k}$ 的梯度：
     $$
     \frac{\partial}{\partial p_{u,k}} S S E=\frac{\partial}{\partial p_{u,k}}\left(\frac{1}{2}e_{u i}^{2}\right) =e_{u i} \frac{\partial}{\partial p_{u,k}} e_{u i}=e_{u i} \frac{\partial}{\partial p_{u,k}}\left(r_{u i}-\sum_{k=1}^{K} p_{u,k} q_{i,k}\right)=-e_{u i} q_{i,k}
     $$

   + 求解目标函数 $SSE$ 关于 $q_{i,k}$ 的梯度：
     $$
     \frac{\partial}{\partial q_{i,k}} S S E=\frac{\partial}{\partial q_{i,k}}\left(\frac{1}{2}e_{u i}^{2}\right) =e_{u i} \frac{\partial}{\partial q_{i,k}} e_{u i}=e_{u i} \frac{\partial}{\partial q_{i,k}}\left(r_{u i}-\sum_{k=1}^{K} p_{u,k} q_{i,k}\right)=-e_{u i} p_{u,k}
     $$

7. 参数梯度更新
   $$
   p_{u, k}=p_{u,k}-\eta (-e_{ui}q_{i, k})=p_{u,k}+\eta e_{ui}q_{i, k} \\ 
   q_{i, k}=q_{i,k}-\eta (-e_{ui}p_{u,k})=q_{i, k}+\eta e_{ui}p_{u, k}
   $$

   + 其中，$\eta$ 表示学习率， 用于控制步长。
   + 但上面这个有个问题就是当参数很多的时候， 就是两个矩阵很大的时候， 往往容易陷入过拟合的困境， 这时候， 就需要在目标函数上面加上正则化的损失， 就变成了RSVD， 关于RSVD的详细内容， 可以参考下面给出的链接， 由于篇幅原因， 这里不再过多的赘述。

**加入正则项**

为了控制模型的复杂度。在原有模型的基础上，加入 $l2$ 正则项，来防止过拟合。

+ 当模型参数过大，而输入数据发生变化时，可能会造成输出的不稳定。

+ $l2$ 正则项等价于假设模型参数符合0均值的正态分布，从而使得模型的输出更加稳定。

$$
\min _{\boldsymbol{q}^{*}, \boldsymbol{p}^{*}} \frac{1}{2} \sum_{(u, i) \in K}\left(\boldsymbol{r}_{\mathrm{ui}}-p_{u}^{T} q_{i}\right)^{2}
+ \lambda\left(\left\|p_{u}\right\|^{2}+\left\|q_{i}\right\|^{2}\right)
$$

## BiasSVD

在推荐系统中，评分预测除了与用户的兴趣偏好、物品的特征属性相关外，与其他的因素也相关。例如：

+ 例如，对于乐观的用户来说，它的评分行为普遍偏高，而对批判性用户来说，他的评分记录普遍偏低，即使他们对同一物品的评分相同，但是他们对该物品的喜好程度却并不一样。
+ 对物品来说也是类似的。以电影为例，受大众欢迎的电影得到的评分普遍偏高，而一些烂片的评分普遍偏低，这些因素都是独立于用户或产品的因素，和用户对产品的的喜好无关。

因此， Netfix Prize中提出了另一种LFM， 在原来的基础上加了偏置项， 来消除用户和物品打分的偏差， 即预测公式如下：
$$
\hat{r}_{u i}=\mu+b_{u}+b_{i}+p_{u}^{T} \cdot q_{i}
$$
这个预测公式加入了3项偏置参数 $\mu,b_u,b_i$, 作用如下：

- $\mu$： 该参数反映的是推荐模型整体的平均评分，一般使用所有样本评分的均值。
- $b_u$：用户偏差系数。可以使用用户 $u$ 给出的所有评分的均值， 也可以当做训练参数。 
  - 这一项表示了用户的评分习惯中和物品没有关系的那种因素。 比如有些用户比较苛刻， 对什么东西要求很高， 那么他评分就会偏低， 而有些用户比较宽容， 对什么东西都觉得不错， 那么评分就偏高
- $b_i$：物品偏差系数。可以使用物品 $i$ 收到的所有评分的均值， 也可以当做训练参数。 
  - 这一项表示了物品接受的评分中和用户没有关系的因素。 比如有些物品本身质量就很高， 因此获得的评分相对比较高， 有的物品本身质量很差， 因此获得的评分相对较低。

加了用户和物品的打分偏差之后， 矩阵分解得到的隐向量更能反映不同用户对不同物品的“真实”态度差异， 也就更容易捕捉评价数据中有价值的信息， 从而避免推荐结果有偏。 

**优化函数**

在加入正则项的FunkSVD的基础上，BiasSVD 的目标函数如下：
$$
\begin{aligned}
\min _{q^{*}, p^{*}} \frac{1}{2} \sum_{(u, i) \in K} &\left(r_{u i}-\left(\mu+b_{u}+b_{i}+q_{i}^{T} p_{u}\right)\right)^{2} \\
&+\lambda\left(\left\|p_{u}\right\|^{2}+\left\|q_{i}\right\|^{2}+b_{u}^{2}+b_{i}^{2}\right)
\end{aligned}
$$
可得偏置项的梯度更新公式如下：

+ $\frac{\partial}{\partial b_{i}} S S E=-e_{u i}+\lambda b_{i}$
+ $ \frac{\partial}{\partial b_{u}} S S E=-e_{u i}+\lambda b_{u} \  $

# 编程实现

本小节，使用如下图表来预测Alice对物品5的评分：

<div align=center>
<img src="https://img-blog.csdnimg.cn/20200827150237921.png#pic_center" alt="在这里插入图片描述" style="zoom:80%;" />
</div>
基于矩阵分解算法的流程如下：

1.  首先， 它会先初始化用户矩阵 $P$ 和物品矩阵 $Q$ ， $P$ 的维度是`[users_num, K]`，$Q$ 的维度是`[items_num, K]`， 

   + 其中，`F`表示隐向量的维度。 也就是把通过隐向量的方式把用户的兴趣和`F`的特点关联了起来。  

   + 初始化这两个矩阵的方式很多， 但根据经验， 随机数需要和`1/sqrt(F)`成正比。 

2.  根据预测评分和真实评分的偏差，利用梯度下降法进行参数更新。

   + 遍历用户及其交互过的物品，对已交互过的物品进行评分预测。
   + 由于预测评分与真实评分存在偏差， 再根据第3节的梯度更新公式更新参数。

3. 训练完成后，利用用户向量与目标物品向量的内积进行评分预测。

**完整代码如下：**

```python
import random
import math


class BiasSVD():
    def __init__(self, rating_data, F=5, alpha=0.1, lmbda=0.1, max_iter=100):
        self.F = F          # 这个表示隐向量的维度
        self.P = dict()     # 用户矩阵P  大小是[users_num, F]
        self.Q = dict()     # 物品矩阵Q  大小是[item_nums, F]
        self.bu = dict()    # 用户偏置系数
        self.bi = dict()    # 物品偏置系数
        self.mu = 0         # 全局偏置系数
        self.alpha = alpha  # 学习率
        self.lmbda = lmbda  # 正则项系数
        self.max_iter = max_iter        # 最大迭代次数
        self.rating_data = rating_data  # 评分矩阵

        for user, items in self.rating_data.items():
            # 初始化矩阵P和Q, 随机数需要和1/sqrt(F)成正比
            self.P[user] = [random.random() / math.sqrt(self.F) for x in range(0, F)]
            self.bu[user] = 0
            for item, rating in items.items():
                if item not in self.Q:
                    self.Q[item] = [random.random() / math.sqrt(self.F) for x in range(0, F)]
                    self.bi[item] = 0

    # 采用随机梯度下降的方式训练模型参数
    def train(self):
        cnt, mu_sum = 0, 0
        for user, items in self.rating_data.items():
            for item, rui in items.items():
                mu_sum, cnt = mu_sum + rui, cnt + 1
        self.mu = mu_sum / cnt

        for step in range(self.max_iter):
            # 遍历所有的用户及历史交互物品
            for user, items in self.rating_data.items():
                # 遍历历史交互物品
                for item, rui in items.items():
                    rhat_ui = self.predict(user, item)  # 评分预测
                    e_ui = rui - rhat_ui  				# 评分预测偏差

                    # 参数更新
                    self.bu[user] += self.alpha * (e_ui - self.lmbda * self.bu[user])
                    self.bi[item] += self.alpha * (e_ui - self.lmbda * self.bi[item])
                    for k in range(0, self.F):
                        self.P[user][k] += self.alpha * (e_ui * self.Q[item][k] - self.lmbda * self.P[user][k])
                        self.Q[item][k] += self.alpha * (e_ui * self.P[user][k] - self.lmbda * self.Q[item][k])
            # 逐步降低学习率
            self.alpha *= 0.1


    # 评分预测
    def predict(self, user, item):
        return sum(self.P[user][f] * self.Q[item][f] for f in range(0, self.F)) + self.bu[user] + self.bi[
            item] + self.mu


# 通过字典初始化训练样本，分别表示不同用户（1-5）对不同物品（A-E)的真实评分
def loadData():
    rating_data={1: {'A': 5, 'B': 3, 'C': 4, 'D': 4},
           2: {'A': 3, 'B': 1, 'C': 2, 'D': 3, 'E': 3},
           3: {'A': 4, 'B': 3, 'C': 4, 'D': 3, 'E': 5},
           4: {'A': 3, 'B': 3, 'C': 1, 'D': 5, 'E': 4},
           5: {'A': 1, 'B': 5, 'C': 5, 'D': 2, 'E': 1}
          }
    return rating_data

# 加载数据
rating_data = loadData()
# 建立模型
basicsvd = BiasSVD(rating_data, F=10)
# 参数训练
basicsvd.train()
# 预测用户1对物品E的评分
for item in ['E']:
    print(item, basicsvd.predict(1, item))

# 预测结果：E 3.685084274454321
```
# 课后思考

1. 矩阵分解算法后续有哪些改进呢?针对这些改进，是为了解决什么的问题呢？请大家自行探索RSVD，消除用户和物品打分偏差等。

2. 矩阵分解的优缺点分析

   * 优点：
     * 泛化能力强： 一定程度上解决了稀疏问题
     * 空间复杂度低： 由于用户和物品都用隐向量的形式存放， 少了用户和物品相似度矩阵， 空间复杂度由$n^2$降到了$(n+m)*f$
     * 更好的扩展性和灵活性：矩阵分解的最终产物是用户和物品隐向量， 这个深度学习的embedding思想不谋而合， 因此矩阵分解的结果非常便于与其他特征进行组合和拼接， 并可以与深度学习无缝结合。

   + 缺点：
     + 矩阵分解算法依然是只用到了评分矩阵， 没有考虑到用户特征， 物品特征和上下文特征， 这使得矩阵分解丧失了利用很多有效信息的机会。
     + 同时在缺乏用户历史行为的时候， 无法进行有效的推荐。  
     + 为了解决这个问题， **逻辑回归模型及后续的因子分解机模型**， 凭借其天然的融合不同特征的能力， 逐渐在推荐系统领域得到了更广泛的应用。 

# 参考资料

* 王喆 - 《深度学习推荐系统》
* 项亮 - 《推荐系统实战》
* [奇异值分解(SVD)的原理详解及推导](https://blog.csdn.net/wuzhongqiang/article/details/108168238)
* [Matrix factorization techniques for recommender systems论文](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=5197422&tag=1)
* [隐语义模型(LFM)和矩阵分解(MF)](https://blog.csdn.net/wuzhongqiang/article/details/108173885)
