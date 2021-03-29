### 1. FM模型的引入

#### 1.1 逻辑回归模型及其缺点

FM模型其实是一种思路，具体的应用稍少。一般来说做推荐CTR预估时最简单的思路就是将特征做线性组合（逻辑回归LR），传入sigmoid中得到一个概率值，本质上这就是一个线性模型，因为sigmoid是单调增函数不会改变里面的线性模型的CTR预测顺序，因此逻辑回归模型效果会比较差。也就是LR的缺点有：

* 是一个线性模型
* 每个特征对最终输出结果独立，需要手动特征交叉（$x_i*x_j$），比较麻烦

<br>

#### 1.2 二阶交叉项的考虑及改进

由于LR模型的上述缺陷（主要是手动做特征交叉比较麻烦），干脆就考虑所有的二阶交叉项，也就是将目标函数由原来的

$$
y = w_0+\sum_{i=1}^nw_ix_i
$$
变为

$$
y = w_0+\sum_{i=1}^nw_ix_i+\sum_{i=1}^{n-1}\sum_{i+1}^nw_{ij}x_ix_j
$$
但这个式子有一个问题，**只有当$x_i$与$x_j$均不为0时这个二阶交叉项才会生效**，后面这个特征交叉项本质是和多项式核SVM等价的，为了解决这个问题，我们的FM登场了！

FM模型使用了如下的优化函数：

$$
y = w_0+\sum_{i=1}^nw_ix_i+\sum_{i=1}^{n}\sum_{i+1}^n\lt v_i,v_j\gt x_ix_j
$$
事实上做的唯一改动就是把$w_{ij}$替换成了$\lt v_i,v_j\gt$，大家应该就看出来了，这实际上就有深度学习的意味在里面了，实质上就是给每个$x_i$计算一个embedding，然后将两个向量之间的embedding做内积得到之前所谓的$w_{ij}$好处就是这个模型泛化能力强 ，即使两个特征之前从未在训练集中**同时**出现，我们也不至于像之前一样训练不出$w_{ij}$，事实上只需要$x_i$和其他的$x_k$同时出现过就可以计算出$x_i$的embedding！

<br>

### 2. FM公式的理解

从公式来看，模型前半部分就是普通的LR线性组合，后半部分的交叉项：特征组合。首先，单从模型表达能力上来看，FM是要强于LR的，至少它不会比LR弱，当交叉项参数$w_{ij}$全为0的时候，整个模型就退化为普通的LR模型。对于有$n$个特征的模型，特征组合的参数数量共有$1+2+3+\cdots  + n-1=\frac{n(n-1)}{2}$个，并且任意两个参数之间是独立的。所以说特征数量比较多的时候，特征组合之后，维度自然而然就高了。

> 定理：任意一个实对称矩阵（正定矩阵）$W$都存在一个矩阵$V$，使得 $W=V.V^{T}$成立。

类似地，所有二次项参数$\omega_{ij}$可以组成一个对称阵$W$（为了方便说明FM的由来，对角元素可以设置为正实数），那么这个矩阵就可以分解为$W=V^TV$，$V$ 的第$j$列($v_{j}$)便是第$j$维特征($x_{j}$)的隐向量。

$$
\hat{y}(X) = \omega_{0}+\sum_{i=1}^{n}{\omega_{i}x_{i}}+\sum_{i=1}^{n-1}{\sum_{j=i+1}^{n} \color{red}{<v_{i},v_{j}>x_{i}x_{j}}}
$$

需要估计的参数有$\omega_{0}∈ R$，$\omega_{i}∈ R$，$V∈ R$，$< \cdot, \cdot>$是长度为$k$的两个向量的点乘，公式如下：

$$
<v_{i},v_{j}> = \sum_{f=1}^{k}{v_{i,f}\cdot v_{j,f}}
$$

上面的公式中： 

- $\omega_{0}$为全局偏置；
- $\omega_{i}$是模型第$i$个变量的权重;
- $\omega_{ij} = < v_{i}, v_{j}>$特征$i$和$j$的交叉权重;
- $v_{i} $是第$i$维特征的隐向量;
- $<\cdot, \cdot>$代表向量点积;
- $k(k<<n)$为隐向量的长度，包含 $k$ 个描述特征的因子。

FM模型中二次项的参数数量减少为 $kn $个，远少于多项式模型的参数数量。另外，参数因子化使得 $x_{h}x_{i}$ 的参数和 $x_{i}x_{j}$ 的参数不再是相互独立的，因此我们可以在样本稀疏的情况下相对合理地估计FM的二次项参数。具体来说，$x_{h}x_{i}$ 和 $x_{i}x_{j}$的系数分别为 $\lt v_{h},v_{i}\gt$ 和 $\lt v_{i},v_{j}\gt$ ，它们之间有共同项 $v_{i}$ 。也就是说，所有包含“ $x_{i}$ 的非零组合特征”（存在某个 $j \ne i$ ，使得 $x_{i}x_{j}\neq 0$ ）的样本都可以用来学习隐向量$v_{i}$，这很大程度上避免了数据稀疏性造成的影响。而在多项式模型中,$w_{hi}$ 和 $w_{ij}$ 是相互独立的。

显而易见，FM的公式是一个通用的拟合方程，可以采用不同的损失函数用于解决regression、classification等问题，比如可以采用MSE（Mean Square Error）loss function来求解回归问题，也可以采用Hinge/Cross-Entropy loss来求解分类问题。当然，在进行二元分类时，FM的输出需要使用sigmoid函数进行变换，该原理与LR是一样的。直观上看，FM的复杂度是 $O(kn^2)$ 。但是FM的二次项可以化简，其复杂度可以优化到 $O(kn)$ 。由此可见，FM可以在线性时间对新样本作出预测。

**证明**：
$$
\begin{align} \sum_{i=1}^{n-1}{\sum_{j=i+1}^{n}{<v_i,v_j>x_ix_j}}
&= \frac{1}{2}\sum_{i=1}^{n}{\sum_{j=1}^{n}{<v_i,v_j>x_ix_j}} - \frac{1}{2} {\sum_{i=1}^{n}{<v_i,v_i>x_ix_i}} \\
&= \frac{1}{2} \left( \sum_{i=1}^{n}{\sum_{j=1}^{n}{\sum_{f=1}^{k}{v_{i,f}v_{j,f}x_ix_j}}} - \sum_{i=1}^{n}{\sum_{f=1}^{k}{v_{i,f}v_{i,f}x_ix_i}} \right) \\
&= \frac{1}{2}\sum_{f=1}^{k}{\left[ \left( \sum_{i=1}^{n}{v_{i,f}x_i} \right) \cdot \left( \sum_{j=1}^{n}{v_{j,f}x_j} \right) - \sum_{i=1}^{n}{v_{i,f}^2 x_i^2} \right]} \\
&= \frac{1}{2}\sum_{f=1}^{k}{\left[ \left( \sum_{i=1}^{n}{v_{i,f}x_i} \right)^2 - \sum_{i=1}^{n}{v_{i,f}^2 x_i^2} \right]} \end{align}
$$
**解释**：

- $v_{i,f}$ 是一个具体的值；
- 第1个等号：对称矩阵 $W$ 对角线上半部分；
- 第2个等号：把向量内积 $v_{i}$,$v_{j}$ 展开成累加和的形式；
- 第3个等号：提出公共部分；
- 第4个等号： $i$ 和 $j$ 相当于是一样的，表示成平方过程。

<br>

### 3. FM模型的应用

最直接的想法就是直接把FM得到的结果放进sigmoid中输出一个概率值，由此做CTR预估，事实上我们也可以做召回。

由于FM模型是利用两个特征的Embedding做内积得到二阶特征交叉的权重，那么我们可以将训练好的FM特征取出离线存好，之后用来做KNN向量检索。

工业应用的具体操作步骤：

* 离线训练好FM模型（学习目标可以是CTR）
* 将训练好的FM模型Embedding取出
* 将每个uid对应的Embedding做avg pooling（平均）形成该用户最终的Embedding，item也做同样的操作
* 将所有的Embedding向量放入Faiss等
* 线上uid发出请求，取出对应的user embedding，进行检索召回

<br>

### 4. 代码实践

#### 4.1 调包实现

**调包版**

直接看Github官方仓库：https://github.com/coreylynch/pyFM，里面有介绍如何安装以及使用，下面搬运一遍：

**安装**

**方法一：直接pip install**

```
pip install git+https://github.com/coreylynch/pyFM
```

**方法二：手动安装**

输入上面这行代码应能下载这个包并安装，如果安装失败可能是网络原因，这时可以考虑手动下载这个包然后手动`python setup.py install`安装，这时候通常会报错，去掉setup.py文件里面的`libraries=[“m”]`一行再重新安装即可

具体操作是：

* 在https://github.com/coreylynch/pyFM中手动下载包
* 将包解压，更改里面的setup.py文件，去掉setup.py文件里面的`libraries=[“m”]`一行
* cd到当前文件夹下`python setup.py install`

**测试**

这部分主要作为简单上手让读者了解如何使用这个包~

**第一步：导包**

```python
from pyfm import pylibfm
from sklearn.feature_extraction import DictVectorizer
import numpy as np
```

**第二步：创建训练集并转换成one-hot编码的特征形式** 

```python
train = [
    {"user": "1", "item": "5", "age": 19},
    {"user": "2", "item": "43", "age": 33},
    {"user": "3", "item": "20", "age": 55},
    {"user": "4", "item": "10", "age": 20},
]
v = DictVectorizer()
X = v.fit_transform(train)
print(X.toarray())
```

看看结果，对比一下维度是否符合预期：

```
[[19.  0.  0.  0.  1.  1.  0.  0.  0.]
 [33.  0.  0.  1.  0.  0.  1.  0.  0.]
 [55.  0.  1.  0.  0.  0.  0.  1.  0.]
 [20.  1.  0.  0.  0.  0.  0.  0.  1.]]
```

**第三步：创建标签**

这里简单创建了一个全1的标签：

```python
y = np.repeat(1.0,X.shape[0])
y
```

```
array([1., 1., 1., 1.])
```

**第四步：训练并预测**

就和调用`sklearn`的包是一样的用法：

```python
fm = pylibfm.FM()
fm.fit(X,y)
fm.predict(v.transform({"user": "1", "item": "10", "age": 24}))
```

<br>

##### **电影评分数据集实战**

数据集在这里下载，数据集本地具体保存路径读者自行阅读代码找找： http://www.grouplens.org/system/files/ml-100k.zip

**导包，并定义一个导入指定格式数据集的函数**

```python
import numpy as np
from sklearn.feature_extraction import DictVectorizer
from pyfm import pylibfm

# Read in data
def loadData(filename,path="ml-100k/"):
    data = []
    y = []
    users=set()
    items=set()
    with open(path+filename) as f:
        for line in f:
            (user,movieid,rating,ts)=line.split('\t')
            data.append({ "user_id": str(user), "movie_id": str(movieid)})
            y.append(float(rating))
            users.add(user)
            items.add(movieid)

    return (data, np.array(y), users, items)
```

**导入训练集和测试集，并转换格式**

```python
(train_data, y_train, train_users, train_items) = loadData("ua.base")
(test_data, y_test, test_users, test_items) = loadData("ua.test")
v = DictVectorizer()
X_train = v.fit_transform(train_data)
X_test = v.transform(test_data)
```

**训练模型并测试**

```python
# Build and train a Factorization Machine
fm = pylibfm.FM(num_factors=10, num_iter=100, verbose=True, task="regression", initial_learning_rate=0.001, learning_rate_schedule="optimal")
fm.fit(X_train,y_train)
```

**预测结果打印误差**

```python
preds = fm.predict(X_test)
from sklearn.metrics import mean_squared_error
print("FM MSE: %.4f" % mean_squared_error(y_test,preds))
```

```
FM MSE: 0.8873
```

<br>

##### 分类任务实战

**搞数据**

```python
import numpy as np
from sklearn.feature_extraction import DictVectorizer
from sklearn.cross_validation import train_test_split
from pyfm import pylibfm

from sklearn.datasets import make_classification

X, y = make_classification(n_samples=1000,n_features=100, n_clusters_per_class=1)
data = [ {v: k for k, v in dict(zip(i, range(len(i)))).items()}  for i in X]

X_train, X_test, y_train, y_test = train_test_split(data, y, test_size=0.1, random_state=42)

v = DictVectorizer()
X_train = v.fit_transform(X_train)
X_test = v.transform(X_test)
```

**建模型**

我们可以看到主要改变的参数是`num_factors`和`tasks`，读者可以想想为什么

```python
fm = pylibfm.FM(num_factors=50, num_iter=10, verbose=True, task="classification", initial_learning_rate=0.0001, learning_rate_schedule="optimal")
fm.fit(X_train,y_train)
```

由于是分类任务，误差函数肯定不一样

```python
from sklearn.metrics import log_loss
print("Validation log loss: %.4f" % log_loss(y_test,fm.predict(X_test)))
```

```
Validation log loss: 1.3678
```

<br>

#### 4.2 从零实现

**数据集介绍**

**criteo**：criteo是非常经典的点击率预估数据集，其中连续特征有13个，类别型特征有26个，没有提供特征的具体名称，特征分别如下：

```
dense_feats：'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10','I11', 'I12', 'I13'

sparse_feats:  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25', 'C26'
```

<br>

**代码参考源代码文档中的FM.py**



<br>

### 5. 课后思考

**请大家思考一下FM存在的问题， 以及可以从哪些地方再进行改进？**



### 6. 参考资料

* [FM算法解析](https://zhuanlan.zhihu.com/p/37963267)
* [推荐系统遇上深度学习(一)--FM模型理论和实践](https://www.jianshu.com/p/152ae633fb00)
* [FM论文原文]([https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf](https://www.csie.ntu.edu.tw/~b97053/paper/Rendle2010FM.pdf))
* [FM算法原理分析与实践](https://www.csuldw.com/2019/02/08/2019-02-08-fm-algorithm-theory/)
* [AI上推荐 之 FM和FFM](https://blog.csdn.net/wuzhongqiang/article/details/108719417)