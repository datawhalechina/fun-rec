## ***Redis* 基础**

### 简介：

Redis（**Re**mote **Di**ctionary **S**erver )，即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库。由于是内存数据库，读写非常高速，可达10w/s的评率，所以一般应用于数据变化快、实时通讯、缓存等。但内存数据库通常要考虑机器的内存大小。Redis 是完全开源免费的，遵守 BSD 协议，是一个灵活的高性能 key-value 数据结构存储，可以用来作为数据库、缓存和消息队列。相比于其他的 key-value 缓存产品有以下三个特点：

- Redis 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载到内存使用。
- Redis 不仅支持简单的 key-value 类型的数据，同时还提供 list，set，zset，hash 等数据结构的存储。
- Redis 支持主从复制，即 master-slave 模式的数据备份。

###  安装：

本项目是基于Ubuntu环境进行开发，因此接下来都以Ubuntu的环境为基础，对于其他开发环境，大家可以参考相关的[资料](https://www.redis.com.cn/redis-installation.html)进行学习。

**安装Redis服务器：**

```shell
sudo apt-get install redis-server
```

下载完成的结果

![image-20211030164414594](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211030164414594.png)

**启动Redis服务：**

一般来说，当安装完成后，Redis服务器会自动启动，可以通过以下命令检查是否启动成功。（ps：如果Active显示为 active(running) 状态：表示redis已在运行，启动成功）

```shell
service redis-server status
```

![image-20211030164432589](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211030164432589.png)

检查当前进程，查看redis是否启动。（ps: 可以看到redis服务正在监听6379端口）

```shell
ps -aux|grep redis-server
```

![image-20211030164448713](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211030164448713.png)

或者进入redis客户端，与服务器进行通信，当输入ping命令，如果返回 PONG 表示Redis已成功安装。

```shell
redis-cli 
```

![image-20211030164455928](http://ryluo.oss-cn-chengdu.aliyuncs.com/图片image-20211030164455928.png)

上面的127.0.0.1 是redis服务器的 IP 地址，6379 是 Redis 服务器运行的端口。



### 命令：

下面简单介绍一些常用的Redis命令：

**1、基本操作命令：**

- **启动Redis**

  ```shell
  redis-server [--daemonize yes][--port 6379]
  ```

  可以通过带参数方式来启动，如果参数过多，可以使用/etc/redis/redis.conf下面的配置文件来启动Redis。

  ```shell
  redis-server /etc/redis/redis.conf
  ```

- **连接Redis**

  ```shell
  redis-cli [-h host -p port -a password]
  ```

  其中上面参数默认的是redis-server的默认地址和端口号，password可以在服务启动时采用参数的方式或者配置文件方式都可进行设置。因此可以通过redis-cli，可以连上我们服务器端的redis服务。

- **停止Redis**

  停止Redis有两种方法，一种是通过 redis-cli 停止，另一种是通过杀掉redis服务进程

  ```shell
  > redis-cli shutdown
  
  > kill redis-pid
  ```

- **切换库指令**

  redis.conf配置中默认16个库，下标从0~15。进入客服端默认选中第0个库，可以通过select命令进行切换，index表示库的小标。

  ```shell
  127.0.0.1:6379> SELECT index
  ```

- **删除当前库的数据**

  删除当前选择的数据库中的所有数据，这个命令永远不会出现失败。

  ```shell
  127.0.0.1:6379[1]> FLUSHDB 
  ```

- **删除所有库的数据**

  删除所有数据库里面的数据，注意是所有数据库，这个命令永远不会出现失败。

  ```shell
  127.0.0.1:6379[1]> FLUSHALL
  ```

- **查看key的数量**

  查看当前选择的库中key的数量

  ```shell
  127.0.0.1:6379> DBSIZE
  ```
  
  测试以上命令
  
  ```shell
  neu@neu:~$ redis-server --daemonize yes --port 6378 --requirepass 123456
  28518:C 26 Oct 20:52:56.389 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
  28518:C 26 Oct 20:52:56.389 # Redis version=4.0.9, bits=64, commit=00000000, modified=0, pid=28518, just started
  28518:C 26 Oct 20:52:56.389 # Configuration loaded
  neu@neu:~$ redis-cli -p 6378 -a 123456
  127.0.0.1:6378> set name jiangyou  # 在第0个数据库插入一个值
  OK
  127.0.0.1:6378> select 1  # 选择第1个数据库
  OK
  127.0.0.1:6378[1]> set age 26    # 在第1个数据库插入一个值
  OK
  127.0.0.1:6378[1]> DBSIZE     # 第1个数据库当前的key值数量
  (integer) 1
  127.0.0.1:6378[1]> FLUSHDB    # 删除第1个数据库的所有值
  OK
  127.0.0.1:6378[1]> DBSIZE     # 删除后数据库中没有值
  (integer) 0
  127.0.0.1:6378[1]> SELECT 0     # 切换到第0个数据库
  OK
  127.0.0.1:6378> DBSIZE      # 第1个数据库的值存在，因此FLUSHDB只删除第1个数据库的所有值
  (integer) 1
  127.0.0.1:6378> SELECT 1    
  OK
  127.0.0.1:6378[1]> FLUSHALL   # 切换到第1个数据库，使用FLUSHALL删除所有数据库的值
  OK
  127.0.0.1:6378[1]> SELECT 0
  OK
  127.0.0.1:6378> DBSIZE    # 切换到第0个数据库，发现所有的值已被删除
  (integer) 0
  ```
  
  

**2、Key的操作命令：**

​		该部分指令主要是为了对数据库中的key进行增删改查等一些列操作，下面主要介绍几个常用的命令。

- **查找符合模板的Key**

  ```shell
  KEYS pattern
  ```

  该指令查找数据库所有符合pattern的key，其中pattern可以为？、*  、[abc...]、[a-d]等方式。其中？代表一个任意一个字符，*代表任意0个或多个字符，[abc...]代表只能是[]中的值，[a-d]代表a到d范围内总的值。

  ```shell
  127.0.0.1:6378> keys *
  1) "age"
  2) "school"
  3) "home"
  4) "name"
  127.0.0.1:6378> keys *e
  1) "age"
  2) "home"
  3) "name"
  127.0.0.1:6378> keys a?e
  1) "age"
  127.0.0.1:6378> keys [a-n][ao]me
  1) "home"
  2) "name"
  127.0.0.1:6378> keys [a-n][a]me
  1) "name"
  ```

- **查找存在key的数量**

  ```shell
  EXISTS key or [key…]
  ```

  该指令为了查找一个或多个key，返回存在key值的数量。

  ```shell
  127.0.0.1:6378> exists name
  (integer) 1
  127.0.0.1:6378> exists name home id
  (integer) 2
  ```

- **设置过期时间**

  ```shell
  EXPIRE key seconds
  ```

  expire 设置 key 的过期时间，时间过期后，key 会被自动删除，设置成功返回1，key不存在返回0。 

  ```shell
   TTL key
  ```

  ttl 命令以秒为单位返回key的剩余过期时间，如果key不存在返回 -2  key 存在但没有关联超时时间则返回 -1 。

  ```shell
  127.0.0.1:6378> expire name 30
  (integer) 1
  127.0.0.1:6378> ttl name
  (integer) 26
  127.0.0.1:6378> ttl name
  (integer) -2
  127.0.0.1:6378> ttl age
  (integer) -1
  127.0.0.1:6378> ttl id
  (integer) -2
  ```

- **Key所属类型**

  ```shell
  TYPE key
  ```

  type命令以字符串的形式返回存储在 `key` 中的值的类型，可返回的类型有：`string`, `list`, `set`, `zset`,`hash` 和 `stream`，如果key值不存在返回`none`。

  ```shell
  127.0.0.1:6378> set key1 "value"
  OK
  127.0.0.1:6378> lpush key2 "value"
  (integer) 1
  127.0.0.1:6378> SADD key3 "value"
  (integer) 1
  127.0.0.1:6378> type key1
  string
  127.0.0.1:6378> type key2
  list
  127.0.0.1:6378> type key3
  set
  127.0.0.1:6378> type key
  none
  ```

- **删除Key**

  ```shell
  DEL key or [key…]
  ```
  
  del命令删除指定的key，不存在的key忽略，返回0，如果key存在，返回删除的key的个数。
  
  ```shell
  127.0.0.1:6378> del key
  (integer) 0
  127.0.0.1:6378> del key1 key2
  (integer) 2
  ```

**3、字符串类型—string命令：**

​	字符串是Redis中最常见的数据类型，它能够存储任何形式的字符串，其中包括二进制格式，JSON格式，序列化格式等数据。而string相关的命令则是用于管理redis字符串值，下面介绍一些常见命令。

**基础命令**

- **SET**

  set命令将key是定为指定的字符串，如果key存在，则会覆盖原来的值。

  ```shell
  SET key value [EX seconds] [PX milliseconds] [NX|XX]
  ```

  其中set可以为设定的值设置过期时间，EX表示秒数，PX表示毫秒。参数NX表示只有键key不存在的时候才会设置key的值，XX表示只有键key存在的时候才会设置key的值。

- **GET**

  get命令返回与键 `key` 相关联的字符串值。

  ```shell
  GET key
  ```

  如果key不存在，返回nil，如果key的值是非字符串类型，那么返回一个错误。

- **APPEND**

  append命令将指定的key追加值。如果key存在，并且是字符串，则会将value追加到key原值的末尾，如果key值是非字符串则会报错，当key不存在时候，改命令类似于set，简单将key设定为value。

  ```shell
  APPEND KEY_NAME NEW_VALUE
  ```

- **INCR**

  incr 命令将 key 中储存的数字值增一。如果key不存在，key值会被初始化为0，在进行incr操作。如果字符串类型的值不能表示为数字，则会报错。

  ```shell
  INCR KEY_NAME 
  ```

- **DECR**

  decr命令将 key 中储存的数字值减一，和incr命令相似。

  ```shell
  DECR KEY_NAME
  ```
  
  

**常用命令**

- **STRLEN**

  Strlen 命令将获取指定 key 所储存的字符串值的长度，如果key存储的不是字符串类型或不存在时，返回错误。

  ```shell
  STRLEN KEY_NAME
  ```

- **SETRANG**

  Setrange命令是将从偏移量 `offset` 开始， 用 `value` 参数覆盖键 `key` 储存的字符串值。

  ```shell
  SETRANGE key offset value
  ```

  不存在的键 `key` 当作空白字符串处理，如果键 `key` 原来储存的字符串长度比偏移量小，那么原字符和偏移量之间的空白将用零字节("\x00" )进行填充。

- **GETRANG**

  Getrange命令返回存储在 key 中的字符串的子串，由 `start` 和 `end` 偏移决定(都包括在内)。负数偏移提供相对字符串结尾的偏移。并且该命令会通过将结果范围限制为字符串的实际长度来处理超出范围的请求。

  ```shell
   GETRANGE key start end
  ```

  当key不存在返回空字符串。

- **MSET**

  命令设置多个 `key` 的值为各自对应的 value。如果key存在，则会用新值替换旧值，如果key不存在，会重新创建，该命令总是返回“OK”，因为 MSET不会失败。

  ```shell
  MSET key value [key value ...]
  ```

- **MGET**

  命令返回所有(一个或多个)给定 key 的值，值的类型是字符串。 如果给定的 key 里面有某个 key 不存在或者值不是字符串，那么这个 key 返回特殊值 `nil` 。

  ```shell
   MGET key [key ...]
  ```

测试以上命令

```shell
127.0.0.1:6379> set name jiang XX   #  XX表示只有键key存在的时候才会设置key的值
(nil)
127.0.0.1:6379> set name jiang NX   #  NX表示只有键key不存在的时候才会设置key的值
OK
127.0.0.1:6379> get name   #  返回与键 `key` 相关联的字符串值。
"jiangyou"
127.0.0.1:6379> get age    #  键key不存在的时候返回nil
(nil)
127.0.0.1:6379> APPEND name     #  将value追加到key原值的末尾，返回值的总长度
(integer) 14
127.0.0.1:6379> get name 
"jiangyou"
127.0.0.1:6379> set age 24 EX 30   #  设置age 的值，并设置了过期时间  EX表示秒
OK
127.0.0.1:6379> incr age       #  在age上进行增 1
(integer) 25
127.0.0.1:6379> get age
"25"
127.0.0.1:6379> decr age       #  在age上进行减 1
(integer) 24
127.0.0.1:6379> get age
"24"
127.0.0.1:6379> incr name      #  由于name值不能表示数字，无法增1
(error) ERR value is not an integer or out of range
127.0.0.1:6379> STRLEN name    #  name对应的string的长度
(integer) 8
127.0.0.1:6379> SETRANGE name 10 hahaha     # 从偏移量为10 的位置开始加入hahaha
(integer) 16
127.0.0.1:6379> get name              # 不足的用\x00 补充
"jiangyou\x00\x00hahaha"
127.0.0.1:6379> GETRANGE name 0 -1    # 获取name的值，改方式类似于python的数组查找
"jiangyou\x00\x00hahaha"
127.0.0.1:6379> MSET age 26 home liaoning   #  为多个key赋值
OK
127.0.0.1:6379> MGET age  home addr    #   查找多个key对应的值，不存在的key返回nil。
1) "26"
2) "liaoning"
3) (nil)
```



**4、列表—list命令：**

**基本命令**

- **LPUSH**

  Lpush 将一个或多个值插入到列表`key` 的头部。如果 key 不存在，那么在进行 push 操作前会创建一个空列表。如果 key 对应的值不是 list 类型，那么会返回一个错误。可以使用一个命令把多个元素 push 进入列表。

  ```shell
  LPUSH key value [value ...]
  ```

  

- **RPUSH**

  Rpush 将向存储在 key 中的列表的尾部插入所有指定的值。如果 key 不存在，那么会创建一个空的列表然后再进行 push 操作。 当 key 保存的不是列表，那么会返回一个错误。

  ```shell
  RPUSH key value [value ...]
  ```

  

- **LRANGE**

  Lrange将返回列表中指定区间内的元素(闭区间)，区间以偏移量 START 和 END 指定。 其中 0 表示列表的第一个元素， 1 表示列表的第二个元素，以此类推。 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。如果start大于最大小标，那么叫返回空列表。

  ```shell
  LRANGE key start end
  ```

- **LINDEX**

  Lindex 将返回列表 key 里索引 index 位置存储的元素。 index 下标是从 0 开始索引的，所以 0 是表示第一个元素， 1 表示第二个元素，并以此类推。 负数索引用于指定从列表尾部开始索引的元素，在这种方法下，-1 表示最后一个元素，-2 表示倒数第二个元素，并以此往前推。当 key 值不是列表的时候，会返回错误。

  ```shell
  LINDEX key index
  ```

- **LLEN**

  Llen 将用于返回存储在 `key` 中的列表长度。 如果 `key` 不存在，则 `key` 被解释为一个空列表，返回 `0` 。 如果 `key` 不是列表类型，返回一个错误。

  ```shell
  LLEN key
  ```

  

**常用命令**

- **LREM**

  Lrem将用于从列表 key 中删除前 count 个值等于 `element` 的元素。 这个 count 参数通过下面几种方式影响这个操作，如果count > 0， 从头到尾删除值为 value 的元素；如果count < 0，将从尾到头删除值为 value 的元素；如果 count = 0 将移除所有值为 value 的元素

  ```shell
  LREM key count value
  ```

  

- **LSET**

  Lset 将用于设置列表 key 中 index 位置的元素值为 `element`。

  ```shell
  LSET key index value
  ```

- **LINSERT**

  Linsert 将用于把 `element` 插入到列表 `key` 的前面或后面。当 `key` 不存在时，这个list会被看作是空list，什么都不执行；当 `key` 存在，值不是列表类型时，返回错误。

  ```shell
  LINSERT key BEFORE|AFTER pivot value
  ```

测试上面命令：

```shell
127.0.0.1:6379> RPUSH myarrs 1 1 1 1 2 2   #  从list的右边开始往myarrs里面添加值
(integer) 6
127.0.0.1:6379> LRANGE myarrs 0 -1       # 返回myarrs的List中所有值
1) "1"
2) "1"
3) "1"
4) "1"
5) "2"
6) "2"
127.0.0.1:6379> LPUSH myarrs 0 0 -1   # 从list的左边开始往myarrs里面添加值
(integer) 9
127.0.0.1:6379> LRANGE myarrs 0 -1
1) "-1"
2) "0"
3) "0"
4) "1"
5) "1"
6) "1"
7) "1"
8) "2"
9) "2"
127.0.0.1:6379> LINDEX myarrs -2    # 根据索引返回List中的值
"2"
127.0.0.1:6379> LLEN myarrs         # 返回List中元素个数
(integer) 9
127.0.0.1:6379> LREM myarrs 2 1     # 删除myarrs中的1  count为2  所以从头往尾删除两个1
(integer) 2
127.0.0.1:6379> LRANGE myarrs 0 -1
1) "-1"
2) "0"
3) "0"
4) "1"
5) "1"
6) "2"
7) "2"
127.0.0.1:6379> LREM myarrs -1 1    # 删除myarrs中的1  count为-1  所以从尾往头删除1个1
(integer) 1
127.0.0.1:6379> LRANGE myarrs 0 -1  
1) "-1"
2) "0"
3) "0"
4) "1"
5) "2"
6) "2"
127.0.0.1:6379> LREM myarrs 0 2   # 删除myarrs中的2  count为0  删除所有等于2的元素
(integer) 2
127.0.0.1:6379> LRANGE myarrs 0 -1
1) "-1"
2) "0"
3) "0"
4) "1"
127.0.0.1:6379> LSET myarrs 2 5    # 根据索引设置myarrs的值，将索引为2 的位置赋值为5
OK
127.0.0.1:6379> LRANGE myarrs 0 -1  
1) "-1"
2) "0"
3) "5"
4) "1"
127.0.0.1:6379> LINSERT myarrs before 5 4  # 在第一个值为5的位置的前面插入一个4
(integer) 5
127.0.0.1:6379> LRANGE myarrs 0 -1
1) "-1"
2) "0"
3) "4"
4) "5"
5) "1"
```



**5、哈希类型—hash命令：**

hash类似于java中的HashMap，在Reids中做了更多的优化。此外hash是一个sytring类型的field和value的映射表，特别适合用于存储对象。例如我们可以借用hash数据结构来存储用户信息，商品信息等。

**基本命令**

- HSET

   Hset 命令用于为存储在 `key` 中的哈希表的 `field` 字段赋值 `value` 。如果哈希表不存在，一个新的哈希表被创建并进行 HSET 操作。如果字段（`field`）已经存在于哈希表中，旧值将被覆盖。

  ```shell
  HSET key field value
  ```

- HGET

  Hget 命令用于返回哈希表中指定字段 `field` 的值。如果给定的字段或 key 不存在时，返回 nil 。

  ```shell
  HGET key field
  ```

- HMSET

   Hmset 命令用于同时将多个 field-value (字段-值)对设置到哈希表中。此命令会覆盖哈希表中已存在的字段，如果哈希表不存在，会创建一个空哈希表，并执行 HMSET 操作。

  ```shell
  HMSET key field value [field value ...]
  ```

- HGETALL

  Hgetall 命令用于返回存储在 `key` 中的哈希表中所有的域和值。返回值以列表形式返回哈希表的字段及字段值，若 key 不存在，返回空列表。

  ```shell
  HGETALL key
  ```

- HDEL

  Hdel 命令用于删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略。 如果 `key` 不存在，会被当作空哈希表处理并返回 `0` 。

  ```shell
  HDEL key field [field ...]
  ```

**常用命令**

- HEXISTS

  Hexists 命令用于查看哈希表的指定字段`field` 是否存在。如果表含有给定字段`field`会返回1，否则返回0。

  ```shell
  HEXISTS key field
  ```

- HKEYS

  Hkeys返回存储在 `key` 中哈希表的所有域。当 key 不存在时，返回空表。

  ```shell
  HKEYS key
  ```

- HVALS

  Hvals 命令返回哈希表所有域(field)的值。当 key 不存在时，返回空表。

  ```shell
  HVALS key
  ```

测试以上命令

```shell
127.0.0.1:6379> HSET userinfo name jiangyou     #  创建新的hash表，并存入对象userinfo的name属性
(integer) 1                                     #  返回赋值成功域的个数
127.0.0.1:6379> HSET userinfo age 26 home liaoming school neu    #  设置userinfo对象的多个域的值
(integer) 3                                     #  返回赋值成功域的个数
127.0.0.1:6379> HKEYS userinfo                  #  查看userinfo的所有域的名
1) "name"
2) "age"
3) "home"
4) "school"
127.0.0.1:6379> HKEYS users                     #  当key不存在时，返回空
(empty list or set)
127.0.0.1:6379> HVALS userinfo                  #  返回key值的所有域的值
1) "jiangyou"
2) "26"
3) "liaoming"
4) "neu"
127.0.0.1:6379> HEXISTS userinfo name           #  查看哈希表的指定字段`name` 该字段存在，返回1
(integer) 1
127.0.0.1:6379> HEXISTS userinfo addr           #  查看哈希表的指定字段`addr` 该字段存在，返回0
(integer) 0
127.0.0.1:6379> HGETALL userinfo                #  查看哈希表中存储在 `key` 中的所有的域和值
1) "name"
2) "jiangyou"
3) "age"
4) "26"
5) "home"
6) "liaoming"
7) "school"
8) "neu"
127.0.0.1:6379> HGETALL users                   #  `key` 不存在，会被当作空哈希表处理并返回。
(empty list or set)
127.0.0.1:6379> HDEL userinfo school home       #   删除哈希表 key 中的一个或多个指定域，返回的为成功删除的域的个数。
(integer) 2
127.0.0.1:6379> HGETALL userinfo
1) "name"
2) "jiangyou"
3) "age"
4) "26"
```



**6、集合类型—set命令：**

**基本命令**

- **SADD**

  Sadd 将命令将一个或多个成员元素加入到集合中，已经存在于集合的成员元素将被忽略。假如集合 key 不存在，则创建一个只包含被添加的元素作为成员的集合。当集合 key 不是集合类型时，返回一个错误。

  ```shell
   SADD key member [member ...]
  ```

- **SMEMBERS**

  Smembers 将返回存储在 `key` 中的集合的所有的成员。 不存在的集合被视为空集合。

  ```shell
   SMEMBERS key  
  ```

- **SISMEMBER**

  Sismember 将用于判断元素 `member` 是否集合 `key` 的成员。如果成员元素是集合的成员，返回 1 ；如果成员元素不是集合的成员，或 `key` 不存在，返回0。

  ```shell
   SISMEMBER key member
  ```

- **SCARD**

  Scard 将返回集合中元素的数量。

  ```shell
   SCARD key 
  ```

- **SREM**

  Srem将在集合中删除指定的元素。如果指定的元素不是集合成员则被忽略。如果集合 `key` 不存在则被视为一个空的集合，该命令返回0。如果key的类型不是一个集合，则返回错误。

  ```shell
   SCARD key member [member ...]
  ```
  

**常用命令**

- **SRANDMEMBER**

  Srandmember 将仅使用`key` 参数，那么随机返回集合`key` 中的一个随机元素。如果count是整数且小于元素的个数，返回含有 count 个不同的元素的数组，如果count是个整数且大于集合中元素的个数时，返回整个集合的所有元素，当count是负数，则会返回一个包含count的绝对值的个数元素的数组，如果count的绝对值大于元素的个数，则返回的结果集里会出现一个元素出现多次的情况。

  ```shell
   SRANDMEMBER key [count]
  ```

- **SPOP**

  Spop 将从集合 `key`中删除并返回一个或多个随机元素。这个命令和 SRANDMEMBER相似， SRANDMEMBER 只返回随机成员但是不删除这些返回的成员。

  ```shell
   SPOP key [count]
  ```


测试以上命令

```shell
127.0.0.1:6379> SADD name zhangsan lisi wangwu   #  赋值key为name的set集合，返回赋值成功的个数
(integer) 3
127.0.0.1:6379> SMEMBERS name                    #  查看存储在name中的集合的所有的成员。
1) "zhangsan"
2) "lisi"
3) "wangwu"
127.0.0.1:6379> SISMEMBER name zhangsan          #  判断元素 zhangsan 是否集合 name 的成员，如果是  返回1
(integer) 1
127.0.0.1:6379> SISMEMBER name xuliu             #  判断元素 xuliu 是否集合 name 的成员，如果不是  返回0
(integer) 0
127.0.0.1:6379> SCARD name
(integer) 3
127.0.0.1:6379> SREM name zhangsan xuliu       #  删除 name 的成员，如果存在直接删除，否则忽略。返回删除成功的元素个数
(integer) 1
127.0.0.1:6379> SMEMBERS name
1) "lisi"
2) "wangwu"
127.0.0.1:6379> SRANDMEMBER name 5  # 随机返回集合name中的一个随机元素,count为5 大于集合个数，返回整个集合元素 
1) "lisi"
2) "wangwu"
127.0.0.1:6379> SRANDMEMBER name 1  # 随机返回集合name中的一个随机元素,count为1 随机返回集合中任意一个元素
1) "wangwu"
127.0.0.1:6379> SRANDMEMBER name -5  # 随机返回集合name中的一个随机元素,count为-5 返回的结果集里会出现一个元素出现多次
1) "wangwu"
2) "lisi"
3) "lisi"
4) "lisi"
5) "wangwu"
127.0.0.1:6379> SPOP name 0  # 随机删除并返回集合name中的一个或多个随机元素,count为0 返回的结果集里不会出现任何元素
(empty array)
127.0.0.1:6379> SPOP name 1  # 随机删除并返回集合name中的一个或多个随机元素,count为1 返回的结果集里会出现一个元素出现多次
1) "lisi"
127.0.0.1:6379> SPOP name -5 # 随机删除并返回集合name中的一个或多个随机元素,count 不能为负数。
(error) ERR value is out of range, must be positive
```



**7、有序集合类型—sortedset命令：**

**基本命令**

- **ZADD**

  Zadd 将一个或多个 `member` 元素及其 `score` 值加入到有序集 `key` 当中。如果某个 `member` 已经是有序集的成员，那么更新这个 `member` 的 `score` 值，并通过重新插入这个 `member` 元素，来保证该 `member` 在正确的位置上。如果有序集合 `key` 不存在，则创建一个空的有序集并执行 ZADD操作。当 `key` 存在但不是有序集类型时，返回一个错误。`score` 值可以是整数值或双精度浮点数，`score` 可为正也可以为负。

  ```shell
  ZADD key [NX|XX] [CH] [INCR] score member [score member ...]
  ```

  - **XX**: 仅更新存在的成员，不添加新成员。
  - **NX**: 不更新存在的成员。只添加新成员。
  - **LT**: 更新新的分值比当前分值小的成员，不存在则新增。
  - **GT**: 更新新的分值比当前分值大的成员，不存在则新增。
  - **CH**: 返回变更成员的数量。变更的成员是指 **新增成员** 和 **score值更新**的成员，命令指明的和之前score值相同的成员不计在内。 注意: 在通常情况下，ZADD返回值只计算新添加成员的数量。
  - **INCR**: [ZADD](https://www.redis.com.cn/commands/zadd.html) 使用该参数与 [ZINCRBY](https://www.redis.com.cn/commands/zincrby.html) 功能一样。一次只能操作一个score-element对。

  举例子：

  ```shell
  ```

  

- **ZRANG**

  Zrange将返回有序集中，指定区间内(闭区间)的成员，其中成员的按分数值递增(从小到大)来排序，具有相同分数值的成员按字典序(lexicographical order )来排列。如果你需要成员按值递减(从大到小)来排列，可以使用 `ZREVRANGE`命令。下标参数 `start` 和 `stop` 都以 `0` 为底，也就是说，以 `0` 表示有序集第一个成员，以 `1` 表示有序集第二个成员，以此类推。其中 start和stop参数的细节同 `ZRANG`命令。

  ```shell
  ZRANGE key start stop [WITHSCORES]
  ```

  

- **ZREVRANGE**

  Zervrange 将返回有序集`key`中，指定区间内的成员。其中成员的位置按score值递减(从高到低)来排列。具有相同score值的成员按字典序的反序排列。 除了成员排序相反外，`ZREVRANGE`命令的其他方面和`ZRANGE`命令一样。

  ```shell
  ZREVRANGE key start stop [WITHSCORES]
  ```

  

- **ZREM**

  Zrem 将从有序集合`key`中删除指定的成员`member`。如果`member`不存在则被忽略。当key存在，但是不是有序集合类型时，返回类型错误。返回的是从有序集合中删除的成员个数，不包括不存在的成员。

  ```shell
  ZREM key member [member ...]
  ```

  

- **ZCARD**

  Zcard 将返回有序集的成员个数。 当 `key` 不存在时，返回 `0` 。

  ```shell
  ZCARD key
  ```

  

**常用命令**

- **ZRANGEBYSCORE**

  该指令将返回有序集 `key` 中，所有 `score` 值介于 `min` 和 `max` 之间(包括等于 `min` 或 `max` )的成员。有序集成员按 `score` 值递增(从小到大)次序排列。具有相同 `score` 值的成员按字典序来排列(该属性是有序集提供的，不需要额外的计算)。可选的 `LIMIT` 参数指定返回结果的数量及区间(就像SQL中的 `SELECT LIMIT offset, count` )，注意当 `offset` 很大时，定位 `offset` 的操作可能需要遍历整个有序集，此过程最坏复杂度为 O(N) 时间。可选的 `WITHSCORES` 参数决定结果集是单单返回有序集的成员，还是将有序集成员及其 `score` 值一起返回。 

  ```shell
  ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
  ```

  

- **ZREVRANGEBYSCORE**

  该指令将返回有序集合中指定分数区间的成员列表。有序集成员按分数值递增(从小到大)次序排列。具有相同分数值的成员按字典序来排列(该属性是有序集提供的，不需要额外的计算)。默认情况下，区间的取值使用闭区间 (小于等于或大于等于)，你也可以通过给参数前增加 ( 符号来使用可选的开区间 (小于或大于)。可选的LIMIT参数指定返回结果的数量及区间（类似SQL中SELECT LIMIT offset, count）。注意，如果offset太大，定位offset就可能遍历整个有序集合，这会增加O(N)的复杂度。可选参数WITHSCORES会返回元素和其分数，而不只是元素。

  ```shell
  ZREVRANGEBYSCORE  key min max [WITHSCORES] [LIMIT offset count]
  ```

  

- **ZCOUNT**

  Zcount 将返回有序集 `key` 中， `score` 值在 `min` 和 `max` 之间(默认包括 `score` 值等于 `min` 或 `max` )的成员的数量。

  ```shell
  ZCOUNT key min max
  ```

  

## Python调用Redis

在Python中，目前可以通过一个redis模块来实现操控Redis，下面我们简单的介绍一下关于使用redis模块。

### 安装Redis模块

如果是在Windows 系统，安装 redis 模块可以使用以下命令：

```shell
python -m pip install redis
```

如果是 Linux 系统，需要执行以下命令来安装：

```shell
sudo pip3 install redis
```

如果是使用Anaconda管理环境，也可以使用以下命令安装：

```shell
conda install redis
```



### Python连接Redis

Redis模块提供了两种连接的模式：直连模式和连接词模式。

**直连模式**

直连模式的方式简单方便，适合少量长期连接的场景。其中host参数是ip地址，如果Redis服务存在于本地，可以使用127.0.0.1，或者换成Redis服务所在的ip地址。db表示当前选择的库，其参数值可以是 0-15；如果设置连接数据库的密码，那么就需要使用password进行验证。

```python
import redis

r = redis.Redis(host='127.0.0.1',port=6379,db=0,password='')
r.set('name':'jiangyou')
print(r.get('name'))
```

**连接池模式**

连接池模式是使用 connection pool（连接池）来管理 redis server 的所有连接，每个Redis实例会维护自己的连接池来管理管理对一个 redis server 所有的连接，避免每次建立，释放连接的开销。

```python
import redis

pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,password="",decode_responses=True, max_connections=10)
r1 = redis.Redis(connection_pool=pool)   #  第一个客户端访问
r2 = redis.Redis(connection_pool=pool)   #  第二个客户端访问
```

上面的参数，decode_responses=True 可以使得redis取出的结果改成字符串，其默认的是字节, max_connections参数可以设置最大连接数量，这样当有新的客户端请求连接时，只需要去连接池获取即可，这样就可以把一个连接共享给多个客服端，减少每次连接所消耗的时间以及资源。



**基本操作**

在Redis模块中，提供了**Redis**和**StrictRedis**来支持Redis访问和操作。其中 **StrictRedis** 使用python基于Redis协议实现了所有官方的Redis操作命令，也就是说其实对于python操作redis的API接口和上面提到的Redis官方接口一样。因此下面我们就简单介绍一些常用的方法。

1. **String操作**

   ```python
   import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,password="",decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   r.set('name','jiang')
   r.append("name","you") # 在redis name对应的值后面追加内容
   
   r.mset({'age':'26','home':'liaoning'})
   print(r.mget('name','age','home'))
   print("name 长度：%d"%r.strlen('name'))   #查看ame对应值的长度
   
   r.incrby('age',5)   #数值操作  将age对应的值 加5
   print(r.get('age'))
   r.decrby('age',5)   #数值操作  将age对应的值 减5
   print(r.get('age'))
   r.incrbyfloat('age',5.2)  #将age对应的值 加5.2
   print(r.get('age'))
   r.incrbyfloat('age',-10.5)  #将age对应的值 减10.5
   print(r.get('age'))
   
   r.setrange('name',5,'hahaha')  # 修改字符串内容，从指定字符串索引开始向后替换。
   print(r.getrange('name',0,6))   #  获取子序列（根据字节获取，非字符）,闭区间
   
   r.delete('name')  #删除key
   ```

   运行结果

   ```python
   ['jiangyou', '26', 'liaoning']
   name 长度：8
   31
   26
   31.2
   20.7
   jiangha
   ```

2. **Hash操作**

   ```python
   import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,password="",decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   r.hset('user1','name','zhangsan')   # user1对应的hash中设置一个键值对（不存在，则创建；否则，修改）
   r.hset('user1','age','22')          # user1对应的hash中设置一个键值对（不存在，则创建；否则，修改）
   r.hincrbyfloat('user1','age',0.5)   # 自增user1对应的hash中的指定key的值，不存在则创建key=amount
   print(r.hmget('user1','name','age'))  # 在user1对应的hash中获取多个key的值
   
   # 一次性设置多个field和value
   user_dict = {
     'password':'123',
     'gender':'M',
     'home':'辽宁'
   }
   r.hmset('user1',user_dict)        #  在user1对应的hash中批量设置键值对 
   
   print("user1中存在键值对的个数：%d "%r.hlen('user1')) #  获取所有数据,字典类型
   print("user1中存在键值对的具体信息：%s"%r.hgetall('user1')) #  获取所有数据,字典类型
   print(r.hkeys("user1"))  # 获取所有fields字段
   print(r.hvals("user1"))  # 获取所有fields字段的values值
   
   if r.hexists("user1","home"):            #  检查user1对应的hash是否存在当前传入的home
       r.hdel("user1",'home')               #  将user1对应的hash中指定key的键值对删除
       print("已删除该键！！！")
   else:
       print("不存在该键！！！")
   ```

   运行结果

   ```python
   ['zhangsan', '22.5']
   user1中存在键值对的个数：5 
   user1中存在键值对的具体信息：{'name': 'zhangsan', 'age': '22.5', 'password': '123', 'gender': 'M', 'home': '辽宁'}
   ['name', 'age', 'password', 'gender', 'home']
   ['zhangsan', '22.5', '123', 'M', '辽宁']
   已删除该键！！
   ```

   

3. **List操作**

   ```python
   import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,password="",decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   r.lpush('database','sql','mysql','redis')     #   在database对应的list中添加元素，每个新的元素都添加到列表的最左边
   print(r.lrange('database',0,-1)) 
   
   r.linsert('database','before','mysql','mongodb')   #   在database对应的列表的某一个值前或后插入一个新值,其含义为在第三个参数的前(before)或后(after) 插入参数四
   
   print(r.lrange('database',0,-1))        #  在database对应的列表分片获取数据
   
   print("database中元素个数：%d"%r.llen('database'))  #  database对应的list元素的个数
   
   print("database中第2个元素：%s"%r.lindex('database',2))  #在database对应的列表中根据索引获取列表元素
   
   r.lset('database', 0, 'redisdb')   #  对database对应的list中的某一个索引位置重新赋值     
   print(r.lrange('database',0,-1))   
   
   print(r.rpop('database'))     #  在database对应的列表的右侧获取第一个元素并在列表中移除，返回值则是第一个元素
   
   print(r.ltrim('database',0,1))   # 在database对应的列表中移除没有在start-end索引之间的值
   
   while True:
     result = r.brpop('database',1)     # 从一个列表的右侧移除一个元素并将其添加到另一个列表的左侧  [如果列表中为空时,则返回None]
     if result:
         print(result)
     else:
         break
   r.delete('database')
   ```

   运行结果

   ```python
   ['redis', 'mysql', 'sql']
   ['redis', 'mongodb', 'mysql', 'sql']
   database中元素个数：4
   database中第2个元素：mysql
   ['redisdb', 'mongodb', 'mysql', 'sql']
   sql
   True
   ('database', 'mongodb')
   ('database', 'redisdb')
   ```

   

4. **Set操作**

   ```python
   import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,password="",decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   
   r.sadd("name","zhangsan")        #  给name对应的集合中添加元素
   r.sadd("name","zhangsan","lisi","wangwu")
   
   
   print(r.smembers('name'))         #  获取name对应的集合的所有成员
   
   print(r.scard("name") )               #  获取name对应的集合中的元素个数
   
   print(r.sismember('name','zhangsan'))   #  检查value是否是name对应的集合内的元素，返回值为True或False
   
   print(r.spop('name'))     #  随机删除并返回指定集合的一个元素
   print(r.smembers('name')) 
   
   # srem(name, value)
   print(r.srem("name", "zhangsan"))          #  删除集合中的某个元素
   print(r.smembers('name')) 
               
   r.sadd("name","a","b")
   r.sadd("name1","b","c")
   r.sadd("name2","b","c","d")
   
   print(r.sinter("name","name1","name2"))  #  获取多个name对应集合的交集
   
   print(r.sunion("name","name1","name2"))   #  获取多个name对应的集合的并集
   
   print(r.sdiff("name","name1","name2"))   #  在第一个name对应的集合中且不在其他name对应的集合的元素集合
   
   r.flushall()
   ```

   运行结果

   ```python
   {'zhangsan', 'lisi', 'wangwu'}
   3
   True
   lisi
   {'zhangsan', 'wangwu'}
   1
   {'wangwu'}
   {'b'}
   {'d', 'c', 'b', 'wangwu', 'a'}
   {'wangwu', 'a'}
   ```

   

5. **SortedSet操作**

   ```python
   import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   mapping = {
       'zhangsan':85,
       'lisi':92, 
       'wangwu':76
   }
   r.zadd('C++',mapping,nx=True)       #  在C++对应的有序集合中添加元素
   print(r.zrange('C++',0,-1,withscores=True))   #  获取C++对应的有序集合的所有元素
   
   print(r.zcard("C++"))               # 获取C++对应的有序集合元素的数量
   print(r.zcount('C++',min=0,max=90)) # 获取C++对应的有序集合中分数 在 [min,max] 之间的个数
   
   r.zincrby(name='C++',value='lisi',amount=3)   # 增加C++对应的有序集合的lisi对应的分数
   print(r.zrange('C++',0,-1,desc=False,withscores=True))  # 按照索引范围获取C++对应的有序集合的元素，排序规则，默认按照分数从小到大排序
   print(r.zrevrange('C++',0,-1,withscores=True))  # 按照索引范围获取C++对应的有序集合的元素，排序规则，默认按照分数从大到小排序
   
   print(r.zrangebyscore('C++',70,90))  # 按照分数范围获取C++对应的有序集合的元素，排序规则，默认按照分数从小到大排序
   print(r.zrevrangebyscore('C++',90,70))  # 按照分数范围获取C++对应的有序集合的元素，排序规则，默认按照分数从大到小排序
   
   print(r.zrank('C++','lisi'))   #  Zrank 返回有序集中指定成员的排名,有序集成员按分数值递增(从小到大)顺序排列。
   print(r.zrevrank('C++','lisi'))   #  Zrevrank 返回有序集中指定成员的排名,有序集成员按分数值递增(从大到小)顺序排列。
   
   mapping = {
       'xuliu':74,
       'lisi':82, 
       'wangwu':87
   }
   r.zadd('python',mapping,nx=True)
   r.zinterstore('sum_score_i',['C++','python'],aggregate='sum')   # 获取两个有序集合的交集，如果遇到相同值不同分数，则按照aggregate进行操作
   print(r.zrange('sum_score_i',0,-1,withscores=True))
   print(r.zunionstore('sum_score_u',['C++','python'],'min'))  # 获取两个有序集合的并集，如果遇到相同值不同分数，则按照aggregate进行操作
   print(r.zrange('sum_score_u',0,-1,withscores=True))
   
   r.zrem('C++', 'zhangsan')                 #  删除C++对应的有序集合中值是zhangsan的成员
   print(r.zrange('C++',0,-1,withscores=True))
   
   r.zremrangebyscore('C++', min=80, max=100)      # 删除C++对应的有序集合中值是zhangsan的成员
   print(r.zrange('C++',0,-1,withscores=True))
   
   r.zremrangebyrank('python', min=1, max=3)       # 根据排行范围删除
   print(r.zrange('python',0,-1,withscores=True))
   ```

   运行结果

   ```python
   [('wangwu', 76.0), ('zhangsan', 85.0), ('lisi', 92.0)]
   3
   2
   [('wangwu', 76.0), ('zhangsan', 85.0), ('lisi', 95.0)]
   [('lisi', 95.0), ('zhangsan', 85.0), ('wangwu', 76.0)]
   ['wangwu', 'zhangsan']
   ['zhangsan', 'wangwu']
   2
   0
   [('wangwu', 163.0), ('lisi', 177.0)]
   4
   [('xuliu', 74.0), ('wangwu', 76.0), ('lisi', 82.0), ('zhangsan', 85.0)]
   [('wangwu', 76.0), ('lisi', 95.0)]
   [('wangwu', 76.0)]
   [('xuliu', 74.0)]
   ```

6. **管道操作**

   Redis 模块默认在执行每次请求都会向连接池请求创建连接和断开申请操作，如果想要在一次请求中指定多个命令，则可以使用pipline实现一次请求指定多个命令，并且默认情况下一次pipline 是原子性操作(即为一次操作)。

   ```python
    import redis
   
   pool = redis.ConnectionPool(host="127.0.0.1",port=6379,db=0,decode_responses=True,max_connections=10)
   r = redis.StrictRedis(connection_pool=pool)
   
   pipe = r.pipeline(transaction=True)
   
   pipe.set('name', 'jiangyou')
   pipe.set('age', 'age')
   pipe.execute()
   
   print(r.mget("name","age"))
   ```

   运行结果

   ```python
   ['jiangyou', 'age']
   ```

   
