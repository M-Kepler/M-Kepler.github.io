- [前言](#前言)
  - [1. Redis 主从](#1-redis-主从)
    - [1.1 Redsi 主从概念](#11-redsi-主从概念)
    - [1.2 Redis 主从同步过程](#12-redis-主从同步过程)
    - [1.3 Redis 主从的一些注意点](#13-redis-主从的一些注意点)
      - [1.3.1 主从数据不一致](#131-主从数据不一致)
      - [1.3.2 读取过期数据](#132-读取过期数据)
      - [1.3.3 一主多从，全量复制时主库压力问题](#133-一主多从全量复制时主库压力问题)
      - [1.3.4 主从网络断了怎么办呢？](#134-主从网络断了怎么办呢)
  - [2. Redis 哨兵](#2-redis-哨兵)
    - [2.1 哨兵作用](#21-哨兵作用)
    - [2.2 哨兵模式](#22-哨兵模式)
    - [2.3 哨兵如何判定主库下线](#23-哨兵如何判定主库下线)
    - [2.4 哨兵的工作模式](#24-哨兵的工作模式)
    - [2.5 哨兵是如何选主的？](#25-哨兵是如何选主的)
    - [2.6 由哪个哨兵执行主从切换呢？](#26-由哪个哨兵执行主从切换呢)
    - [2.7 故障转移](#27-故障转移)
  - [3. Redis Cluster 集群](#3-redis-cluster-集群)
    - [3.1 哈希槽（Hash Slot）](#31-哈希槽hash-slot)
    - [3.2  MOVED 重定向和 ASK 重定向](#32-moved-重定向和-ask-重定向)
      - [3.2.1 Moved 重定向](#321-moved-重定向)
      - [3.2.2 ASK 重定向](#322-ask-重定向)
    - [3.3 Cluster 集群节点的通讯协议：Gossip](#33-cluster-集群节点的通讯协议gossip)
    - [3.4 故障转移](#34-故障转移)
    - [3.5 加餐：为什么 Redis Cluster 的 Hash Slot 是 16384？](#35-加餐为什么-redis-cluster-的-hash-slot-是-16384)
  - [巨人的肩膀（参考与感谢）](#巨人的肩膀参考与感谢)
    - [参考资料](#参考资料)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzI3NDA4OTk1OQ==&mid=2649917994&idx=1&sn=033c66dc60e7a6c8a438563b00cf18f1&chksm=f31f78a2c468f1b49073ccc413c6cfe0193929ac732b844fd1438784093be618efd54645849a&scene=90&subscene=93&sessionid=1649398239&clicktime=1649398291&enterid=1649398291&ascene=56&devicetype=android-31&version=2800153b&nettype=WIFI&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&exportkey=AyH0C%2FLaEGJFsIv5pdwegs4%3D&pass_ticket=LicXTuZYpkiacAKU0nW1HAg66ogcWJn94N1Azro0aBb8F9qKDR9nQbK9bkpCYSMm&wx_header=3)

# 前言

大家好，我是**捡田螺的小男孩**。今天跟小伙伴们一起学习 Redis 的主从、哨兵、Redis Cluster 集群。

- Redis 主从

- Redis 哨兵

- Redis Cluster 集群

## 1. Redis 主从

面试官经常会问到 Redis 的高可用。Redis 高可用回答包括两个层面，一个就是**数据不能丢失，或者说尽量减少丢失**; 另外一个就是保证 **Redis 服务不中断**。

- 对于尽量减少数据丢失，可以通过 AOF 和 RDB 保证。

- 对于保证服务不中断的话，Redis 就不能单点部署，这时候我们先看下 Redis 主从。

### 1.1 Redsi 主从概念

- Redis 主从模式，就是部署多台 Redis 服务器，有主库和从库，它们之间通过主从复制，以保证数据副本的一致。

- 主从库之间采用的是**读写分离**的方式，其中主库负责读操作和写操作，从库则负责读操作。

- 如果 Redis 主库挂了，切换其中的从库成为主库。

### 1.2 Redis 主从同步过程

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39MquWpqBsElhTNJia6PeN9ic0a2TbFxBdaeKWMcg1SVSicXfiaCz2pmZ9fw/640?wx_fmt=png)

Redis 主从同步包括三个阶段。

第一阶段：主从库间建立连接、协商同步。

> - 从库向主库发送`psync`  命令，告诉它要进行数据同步。
>
> - 主库收到  `psync`  命令后, 响应`FULLRESYNC`命令（它表示第一次复制采用的是**全量复制**），并带上主库`runID`和主库目前的复制进度`offset`。

第二阶段：主库把数据同步到从库，从库收到数据后，完成本地加载。

> - 主库执行`bgsave`命令，生成`RDB`文件，接着将文件发给从库。从库接收到`RDB` 文件后，会先清空当前数据库，然后加载 RDB 文件。
>
> - 主库把数据同步到从库的过程中，新来的写操作，会记录到`replication buffer`。

第三阶段，主库把新写的命令，发送到从库。

> - 主库完成 RDB 发送后，会把`replication buffer`中的修改操作发给从库，从库再重新执行这些操作。这样主从库就实现同步啦。

### 1.3 Redis 主从的一些注意点

#### 1.3.1 主从数据不一致

因为主从复制是异步进行的，如果从库滞后执行，则会**导致主从数据不一致**。

主从数据不一致一般有两个原因：

- 主从库网路延迟。

- 从库收到了主从命令，但是它正在执行阻塞性的命令（如`hgetall`等）。

如何解决主从数据不一致问题呢？

1. 可以换更好的硬件配置，保证网络畅通。

2. 监控主从库间的复制进度

#### 1.3.2 读取过期数据

Redis 删除数据有这几种策略：

- 惰性删除：只有当访问一个 key 时，才会判断该 key 是否已过期，过期则清除。

- 定期删除：每隔一定的时间，会扫描一定数量的数据库的 expires 字典中一定数量的 key，并清除其中已过期的 key。

- 主动删除：当前已用内存超过最大限定时，触发主动清理策略。

如果使用 Redis 版本低于 3.2，读从库时，并不会判断数据是否过期，而是会**返回过期数据**。而 3.2 版本后，Redis 做了改进，如果读到的数据已经过期了，从库不会删除，却会返回空值，**避免了客户端读到过期数据**。

因此，在主从 Redis 模式下，尽量使用  **Redis 3.2** 以上的版本。

#### 1.3.3 一主多从，全量复制时主库压力问题

如果是一主多从模式，从库很多的时候，如果每个从库都要和主库进行全量复制的话，主库的压力是很大的。因为主库 fork 进程生成 RDB，这个 fork 的过程是会阻塞主线程处理正常请求的。同时，传输大的 RDB 文件也会占用主库的网络宽带。

可以使用**主 - 从 - 从**模式解决。什么是主从从模式呢？其实就是部署主从集群时，选择硬件网络配置比较好的一个从库，让它跟**部分从库再建立主从**关系。如图：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39aPMMBicb4qRiczaVFgV3hFG8HJvx0Ch9viaCK1rmyAW0IL1qoNnM2wyqA/640?wx_fmt=png)

#### 1.3.4 主从网络断了怎么办呢？

主从库完成了全量复制后，它们之间会维护一个网络长连接，用于主库后续收到写命令传输到从库，它可以避免频繁建立连接的开销。但是，如果网络断开重连后，是否还需要进行一次全量复制呢？

如果是 Redis 2.8 之前，从库和主库重连后，确实会再进行一次全量复制，但是这样开销就很大。而 Redis 2.8 之后做了优化，重连后采用增量复制方式，即把主从库网络断连期间主库收到的写命令，同步给从库。

主从库重连后，就是利用 **repl_backlog_buffer** 实现增量复制。

> 当主从库断开连接后，主库会把断连期间收到的写操作命令，写入 **replication buffer**，同时也会把这些操作命令写入 **repl_backlog_buffer** 这个缓冲区。repl_backlog_buffer 是一个环形缓冲区，主库会记录自己写到的位置，从库则会记录自己已经读到的位置。

## 2. Redis 哨兵

主从模式中，一旦主节点由于故障不能提供服务，需要人工将从节点晋升为主节点，同时还要通知应用方更新主节点地址。显然，多数业务场景都不能接受这种故障处理方式。Redis 从 2.8 开始正式提供了 **Redis 哨兵机制**来解决这个问题。

- 哨兵作用

- 哨兵模式简介

- 哨兵如何判定主库下线

- 哨兵模式如何工作

- 哨兵是如何选主的

- 由哪个哨兵执行主从切换呢？

- 哨兵下的故障转移

### 2.1 哨兵作用

哨兵其实是一个运行在特殊模式下的 Redis 进程。它有三个作用，分别是：**监控、自动选主切换（简称选主）、通知**。

哨兵进程在运行期间，监视所有的 Redis 主节点和从节点。它通过周期性给**主从库**发送`PING`命令，检测主从库是否挂了。如果**从库**没有在规定时间内响应哨兵的`PING`命令，哨兵就会把它标记为**下线状态**；如果主库没有在规定时间内响应哨兵的`PING`命令，哨兵则会判定主库下线，然后开始切换到**选主**任务。

所谓**选主**，其实就是从多个从库中，按照一定规则，选出一个当做主库。至于**通知**呢，就是选出主库后，哨兵把新主库的连接信息发给其他从库，让它们和新主库建立主从关系。同时，哨兵也会把新主库的连接信息通知给客户端，让它们把请求操作发到新主库上。

### 2.2 哨兵模式

因为 Redis 哨兵也是一个 Redis 进程，如果它自己挂了呢，那是不是就起不了监控的作用啦。我们一起来看下 Redis 哨兵模式

哨兵模式，就是由一个或多个哨兵实例组成的哨兵系统，它可以监视所有的 Redis 主节点和从节点，并在被监视的主节点进入下线状态时，自动将下线主服务器属下的某个从节点升级为新的主节点。，一个哨兵进程对 Redis 节点进行监控，就可能会出现问题（单点问题）。因此，一般使用多个哨兵来进行监控 Redis 节点，并且各个哨兵之间还会进行监控。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39dx7p7FgfZKH7DwDTfoicq4uU7rKxz13ibbMMxySXwK7K61d96G8VMqHQ/640?wx_fmt=png)

其实哨兵之间是通过**发布订阅机制**组成集群的，同时，哨兵又通过`INFO`命令，获得了从库连接信息，也能和从库建立连接，从而进行监控。

### 2.3 哨兵如何判定主库下线

哨兵是如何判断主库是否下线的呢？我们先来了解两个基础概念哈：**主观下线和客观下线**。

- 哨兵进程向**主库、从库**发送 PING 命令，如果主库或者从库没有在规定的时间内响应 PING 命令，哨兵就把它标记为**主观下线**。

- 如果是主库被标记为**主观下线**，则正在监视这个主库的**所有哨兵**要以每秒一次的频率，以确认主库是否真的进入了**主观下线**。当有**多数**的哨兵（**一般少数服从多数，由 Redis 管理员自行设定的一个值**）在指定的时间范围内确认主库的确进入了主观下线状态，则主库会被标记为**客观下线**。这样做的目的就是**避免对主库的误判**，以减少没有必要的主从切换，减少不必要的开销。

> 假设我们有`N`个哨兵实例，如果有`N/2+1`个实例判断主库**主观下线**，此时就可以把节点标记为**客观下线**，就可以做主从切换了。

### 2.4 哨兵的工作模式

1. 每个哨兵以每秒钟一次的频率向它所知的主库、从库以及其他哨兵实例发送一个`PING`命令。

2. 如果一个实例节点距离最后一次有效回复`PING`命令的时间超过`down-after-milliseconds`选项所指定的值， 则这个实例会被哨兵标记为主观下线。

3. 如果**主库**被标记为主观下线，则正在监视这个主库的所有哨兵要以每秒一次的频率确认主库的确进入了主观下线状态。

4. 当有足够数量的哨兵（**大于等于配置文件指定的值**）在指定的时间范围内确认主库的确进入了主观下线状态， 则主库会被标记为**客观下线**。

5. 当主库被哨兵标记为**客观下线**时，就会进入**选主模式**。

6. 若没有足够数量的哨兵同意主库已经进入主观下线， 主库的**主观下线状态就会被移除**；若主库重新向哨兵的`PING`命令返回有效回复，主库的主观下线状态就会被移除。

### 2.5 哨兵是如何选主的？

如果明确主库已经客观下线了，哨兵就开始了选主模式。

哨兵选主包括两大过程，分别是：**过滤和打分**。其实就是在多个从库中，先按照一定的筛选条件，把不符合条件的从库**过滤**掉。然后再按照一定的规则，给剩下的从库逐个打分，将得分最高的从库选为新主库

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39ELI22RI0AQcQE4xZicicJv2C0Y6Q7ERNV8qkYntYZohqmticqaYS2tZbQ/640?wx_fmt=png)

- 选主时，会判断从库的状态，如果已经下线，就**直接过滤**。

- 如果从库网络不好，老是超时，也会被过滤掉。看这个参数`down-after-milliseconds`，它表示我们认定主从库断连的最大连接超时时间。

- 过滤掉了不适合做主库的从库后，就可以给剩下的从库打分，按这三个规则打分：**从库优先级、从库复制进度以及从库 ID 号**。

- 从库优先级最高的话，打分就越高，优先级可以通过`slave-priority`配置。如果优先级一样，就选与旧的主库复制进度最快的从库。如果优先级和从库进度都一样，从库 ID 号小的打分高。

### 2.6 由哪个哨兵执行主从切换呢？

一个哨兵标记主库为**主观下线**后，它会征求其他哨兵的意见，确认主库是否的确进入了主观下线状态。它向其他实例哨兵发送`is-master-down-by-addr`命令。其他哨兵会根据自己和主库的连接情况，回应`Y`或`N`（Y 表示赞成，N 表示反对票）。如果这个哨兵获取得足够多的赞成票数（`quorum`配置），主库会被标记为**客观下线**。

标记主库客观下线的这个哨兵，紧接着向其他哨兵发送命令，再发起**投票**，希望它可以来执行主从切换。这个投票过程称为 **Leader 选举**。因为最终执行主从切换的哨兵称为 Leader，投票过程就是确定 Leader。一个哨兵想成为 Leader 需要满足两个条件：

- 需要拿到`num(sentinels)/2+1`的赞成票。

- 并且拿到的票数需要大于等于哨兵配置文件中的`quorum`值。

举个例子，假设有 3 个哨兵。配置的 quorum 值为 2。即一个一个哨兵想成为 Leader 至少需要拿到 2 张票。为了更好理解，大家可以看下

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39Z7KzUT85xQbKjHeCmTrNYYvR8pXeMARPmJWyfVpYbX0qWHJOXOEb8A/640?wx_fmt=png)

- 在 t1 时刻，哨兵 A1 判断主库为**客观下线**，它想成为主从切换的 Leader，于是先给自己投一张赞成票，然后分别向哨兵 A2 和 A3 发起投票命令，表示想成为 Leader。

- 在 t2 时刻，A3 判断主库为**客观下线**，它也想成为 Leader，所以也先给自己投一张赞成票，再分别向 A1 和 A2 发起投票命令，表示也要成为 Leader。

- 在 t3 时刻，哨兵 A1 收到了 A3 的 Leader 投票请求。因为 A1 已经把票 Y 投给自己了，所以它不能再给其他哨兵投赞成票了，所以 A1 投票`N`给 A3。

- 在 t4 时刻，哨兵 A2 收到 A3 的 Leader 投票请求，因为哨兵 A2 之前没有投过票，它会给第一个向它发送投票请求的哨兵回复赞成票`Y`。

- 在 t5 时刻，哨兵 A2 收到 A1 的 Leader 投票请求，因为哨兵 A2 之前已经投过赞成票给 A3 了，所以它只能给 A1 投反对票`N`。

- 最后 t6 时刻，哨兵 A1 只收到自己的一票`Y`赞成票，而哨兵 A3 得到两张赞成票（A2 和 A3 投的），因此**哨兵 A3 成为了 Leader**。

假设网络故障等原因，哨兵 A3 也**没有收到两张票**，那么这轮投票就不会产生 Leader。哨兵集群会等待一段时间（一般是哨兵故障转移超时时间的 2 倍），再进行重新选举。

### 2.7 故障转移

假设哨兵模式架构如下，有三个哨兵，一个主库 M，两个从库 S1 和 S2。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39yWD7PHrxrYTt8PuZcrwicA08tkSJDPGc5GOgKUOZg3kEy4hOcKK5QSg/640?wx_fmt=png)

当哨兵检测到 Redis 主库 M1 出现故障，那么哨兵需要对集群进行故障转移。假设选出了**哨兵 3** 作为 Leader。故障转移流程如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39S4lAiaKdVBdMpicVHWg53aaaaRHnibI6sV5Ca5yXGzUicyzSkqUfVEtfuw/640?wx_fmt=png)

1. 从库 S1 解除从节点身份，升级为新主库

2. 从库 S2 成为新主库的从库

3. 原主节点恢复也变成新主库的从节点

4. 通知客户端应用程序新主节点的地址。

故障转移后：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39WNa2A9LDGUiaBqjUpGMGsuORVp1c99nHMSxLHaFApar030G8k3o5xrA/640?wx_fmt=png)

## 3. Redis Cluster 集群

哨兵模式基于主从模式，实现读写分离，它还可以自动切换，系统可用性更高。但是它每个节点存储的数据是一样的，浪费内存，并且**不好在线扩容**。因此，**Reids Cluster 集群（切片集群的实现方案）**应运而生，它在 Redis3.0 加入的，实现了 Redis 的**分布式存储**。对数据进行分片，也就是说每台 Redis 节点上存储不同的内容，来解决在线扩容的问题。并且，它可以**保存大量数据**，即分散数据到各个 Redis 实例，还提供复制和故障转移的功能。

> 比如你一个 Redis 实例保存 15G 甚至更大的数据，响应就会很慢，这是因为 Redis RDB 持久化机制导致的，Redis 会 fork 子进程完成 RDB 持久化操作，fork 执行的耗时与 Redis 数据量成正相关。

这时候你很容易想到，把 15G 数据分散来存储就好了嘛。这就是 **Redis 切片集群**的初衷。切片集群是啥呢？来看个例子，如果你要用 Redis 保存 15G 的数据，可以用单实例 Redis，或者 3 台 Redis 实例组成**切片集群**，对比如下：

> **切片集群和 Redis Cluster**  的区别：Redis Cluster 是从 Redis3.0 版本开始，官方提供的一种实现**切片集群**的方案。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe399CQic6iaEMOOu4DkcRPoR005xm1J6rgPRpicqmMZUY82Siahj0ZguLCYtw/640?wx_fmt=png)

既然数据是分片分布到不同 Redis 实例的，那客户端到底是怎么确定想要访问的数据在哪个实例上呢？我们一起来看下 **Reids Cluster** 是怎么做的哈。

### 3.1 哈希槽（Hash Slot）

Redis Cluster 方案采用哈希槽（`Hash Slot`），来处理数据和实例之间的映射关系。

一个切片集群被分为`16384`个 slot（槽），每个进入 Redis 的键值对，根据 key 进行散列，分配到这 16384 插槽中的一个。使用的哈希映射也比较简单，用`CRC16`算法计算出一个`16bit`的值，再对`16384`取模。数据库中的每个键都属于这 16384 个槽的其中一个，集群中的每个节点都可以处理这 16384 个槽。

集群中的每个节点负责一部分的哈希槽，假设当前集群有 A、B、C3 个节点，每个节点上负责的哈希槽数 =16384/3，那么可能存在的一种分配：

- 节点 A 负责 0~5460 号哈希槽

- 节点 B 负责 5461~10922 号哈希槽

- 节点 C 负责 10923~16383 号哈希槽

客户端给一个 Redis 实例发送数据读写操作时，如果这个实例上并没有相应的数据，会怎么样呢？MOVED 重定向和 ASK 重定向了解一下哈

### 3.2  MOVED 重定向和 ASK 重定向

在 Redis cluster 模式下，节点对请求的处理过程如下：

1. 通过哈希槽映射，检查当前 Redis key 是否存在当前节点

2. 若哈希槽不是由自身节点负责，就返回 MOVED 重定向

3. 若哈希槽确实由自身负责，且 key 在 slot 中，则返回该 key 对应结果

4. 若 Redis key 不存在此哈希槽中，检查该哈希槽是否正在迁出（MIGRATING）？

5. 若 Redis key 正在迁出，返回 ASK 错误重定向客户端到迁移的目的服务器上

6. 若哈希槽未迁出，检查哈希槽是否导入中？

7. 若哈希槽导入中且有 ASKING 标记，则直接操作，否则返回 MOVED 重定向

#### 3.2.1 Moved 重定向

客户端给一个 Redis 实例发送数据读写操作时，如果计算出来的槽不是在该节点上，这时候它会返回 MOVED 重定向错误，MOVED 重定向错误中，会将哈希槽所在的新实例的 IP 和 port 端口带回去。这就是 Redis Cluster 的 MOVED 重定向机制。流程图如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39XickcicL1jdBfLkWseQP1hKg281WvtqsicohAmeBJmZtkxqFc1Crvpycw/640?wx_fmt=png)

#### 3.2.2 ASK 重定向

Ask 重定向一般发生于集群伸缩的时候。集群伸缩会导致槽迁移，当我们去源节点访问时，此时数据已经可能已经迁移到了目标节点，使用 **Ask 重定向**可以解决此种情况。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39WLA3vcdRKsZyKqVL258l869aBApvXBIrXMJ9zhULT1fsnzdCQEAuYw/640?wx_fmt=png)

### 3.3 Cluster 集群节点的通讯协议：Gossip

一个 Redis 集群由多个节点组成，各个节点之间是怎么通信的呢？通过 **Gossip 协议**！Gossip 是一种谣言传播协议，每个节点周期性地从节点列表中选择 k 个节点，将本节点存储的信息传播出去，直到所有节点信息一致，即算法收敛了。

> Gossip 协议基本思想：一个节点想要分享一些信息给网络中的其他的一些节点。于是，它周期性的随机选择一些节点，并把信息传递给这些节点。这些收到信息的节点接下来会做同样的事情，即把这些信息传递给其他一些随机选择的节点。一般而言，信息会周期性的传递给 N 个目标节点，而不只是一个。这个 N 被称为 fanout

Redis Cluster 集群通过 Gossip 协议进行通信，节点之前不断交换信息，交换的信息内容包括**节点出现故障、新节点加入、主从节点变更信息、slot 信息**等等。gossip 协议包含多种消息类型，包括 ping，pong，meet，fail，等等

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39W4maTjbiaBvuAl8YyE4CExcIJoicW7DUnDKTSd2yvXlKzQpZT5ZxvZow/640?wx_fmt=png)

- meet 消息：通知新节点加入。消息发送者通知接收者加入到当前集群，meet 消息通信正常完成后，接收节点会加入到集群中并进行周期性的 ping、pong 消息交换。

- ping 消息：节点每秒会向集群中其他节点发送 ping 消息，消息中带有自己已知的两个节点的地址、槽、状态信息、最后一次通信时间等

- pong 消息：当接收到 ping、meet 消息时，作为响应消息回复给发送方确认消息正常通信。消息中同样带有自己已知的两个节点信息。

- fail 消息：当节点判定集群内另一个节点下线时，会向集群内广播一个 fail 消息，其他节点接收到 fail 消息之后把对应节点更新为下线状态。

特别的，每个节点是通过集群总线 (cluster bus) 与其他的节点进行通信的。通讯时，使用特殊的端口号，即对外服务端口号加 10000。例如如果某个 node 的端口号是 6379，那么它与其它 nodes 通信的端口号是 16379。nodes 之间的通信采用特殊的二进制协议。

### 3.4 故障转移

Redis 集群实现了高可用，当集群内节点出现故障时，通过**故障转移**，以保证集群正常对外提供服务。

redis 集群通过 ping/pong 消息，实现故障发现。这个环境包括**主观下线和客观下线**。

**主观下线：**  某个节点认为另一个节点不可用，即下线状态，这个状态并不是最终的故障判定，只能代表一个节点的意见，可能存在误判情况。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39UKTojSWHg95Eic5a0gyicqap39q3jf0RlVhcicXZFFVqjsmkkddDDhKQg/640?wx_fmt=png)主观下线

**客观下线：**  指标记一个节点真正的下线，集群内多个节点都认为该节点不可用，从而达成共识的结果。如果是持有槽的主节点故障，需要为该节点进行故障转移。

- 假如节点 A 标记节点 B 为主观下线，一段时间后，节点 A 通过消息把节点 B 的状态发到其它节点，当节点 C 接受到消息并解析出消息体时，如果发现节点 B 的 pfail 状态时，会触发客观下线流程；

- 当下线为主节点时，此时 Redis Cluster 集群为统计持有槽的主节点投票，看投票数是否达到一半，当下线报告统计数大于一半时，被标记为**客观下线**状态。

流程如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39LBWWxek9Kvfj0LZDlCAzMdyx2aUIpFXnNQ5aBXWTic4RxaLhspD5kNA/640?wx_fmt=png)客观下线

**故障恢复**：故障发现后，如果下线节点的是主节点，则需要在它的从节点中选一个替换它，以保证集群的高可用。流程如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39iaz6FYypcaunoNt9hTSDRP45wic3ASMMCmQJmmxe24krZsib4QgLPSEicA/640?wx_fmt=png)

- 资格检查：检查从节点是否具备替换故障主节点的条件。

- 准备选举时间：资格检查通过后，更新触发故障选举时间。

- 发起选举：到了故障选举时间，进行选举。

- 选举投票：只有持有槽的**主节点**才有票，从节点收集到足够的选票（大于一半），触发**替换主节点操作**

### 3.5 加餐：为什么 Redis Cluster 的 Hash Slot 是 16384？

对于客户端请求过来的键值 key，哈希槽 =`CRC16(key) % 16384`，CRC16 算法产生的哈希值是 16bit 的，按道理该算法是可以产生 2^16=65536 个值，为什么不用 65536，用的是`16384（2^14）`呢？

大家可以看下作者的原始回答：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39JtMaxSgu6PkGE4BjuytA2JicnJ8AJ6ibMj7ML3MFCrKpNdchPtUg9yZg/640?wx_fmt=png)

Redis 每个实例节点上都保存对应有哪些 slots，它是一个 `unsigned char slots[REDIS_CLUSTER_SLOTS/8]`  类型![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpxyrTpuwdz4tSicKTmBicDe39xvYEXmRicjZvE6nppFmd3l7eEprlod1cboW6ufw8iaaxdqhdMtnwiaOmw/640?wx_fmt=png)

- 在 redis 节点发送心跳包时需要把所有的槽放到这个心跳包里，如果 slots 数量是  `65536` ，占空间 =  `65536 / 8(一个字节8bit) / 1024(1024个字节1kB) =8kB` ，如果使用 slots 数量是  `16384` ，所占空间 = `16384 / 8(每个字节8bit) / 1024(1024个字节1kB) = 2kB` ，可见 16384 个 slots 比 65536 省 6kB 内存左右，假如一个集群有 100 个节点, 那每个实例里就省了 600kB 啦

- 一般情况下 Redis cluster 集群主节点数量基本不可能超过 1000 个，超过 1000 会导致网络拥堵。对于节点数在 1000 以内的 Redis cluster 集群，16384 个槽位其实够用了。

既然为了节省内存网络开销，为什么 slots 不选择用 **8192（即 16384/2）**  呢?

`8192 / 8(每个字节8bit) / 1024(1024个字节1kB) = 1kB` , 只需要 1KB！可以先看下 Redis 把 Key 换算成所属 slots 的方法

```
unsigned int keyHashSlot(char *key, int keylen) {
    int s, e; /* start-end indexes of { and } */

    for (s = 0; s < keylen; s++)
        if (key[s] == '{') break;

    /* No '{' ? Hash the whole key. This is the base case. */
    if (s == keylen) return crc16(key,keylen) & 0x3FFF;

    /* '{' found? Check if we have the corresponding '}'. */
    for (e = s+1; e < keylen; e++)
        if (key[e] == '}') break;

    /* No '}' or nothing betweeen {} ? Hash the whole key. */
    if (e == keylen || e == s+1) return crc16(key,keylen) & 0x3FFF;

    /* If we are here there is both a { and a } on its right. Hash
     * what is in the middle between { and }. */
    return crc16(key+s+1,e-s-1) & 0x3FFF;
}


```

Redis 将 key 换算成 slots 的方法：其实就是是将 crc16(key) 之后再和 slots 的数量进行与计算

这里为什么用`0x3FFF(16383)` 来计算, 而不是`16384`呢？因为在不产生溢出的情况下  `x % (2^n)`等价于`x & (2^n - 1)`即  `x % 16384 == x & 16383`

那到底为什么不用 8192 呢？

> crc16 出来结果, 理论上出现重复的概率为 1⁄65536, 但实际结果重复概率可能比这个大不少, 就像 crc32 结果 理论上 1/40 亿 分之一, 但实际有人测下来 10 万碰撞的概率就比较大了。假如 slots 设置成 8192, 200 个实例的节点情况下, 理论值是 每 40 个不同 key 请求, 命中就会失效一次, 假如节点数增加到 400, 那就是 20 个请求。并且 1kb 并不会比 2k 省太多, 性价比不是特别高, 所以可能 选 16384 会更为通用一点

## 巨人的肩膀（参考与感谢）

- 极客时间的《Redis 核心技术与实战》[1]

- Redis 进阶 - 高可拓展：分片技术（Redis Cluster）详解 [2]

- Redis slots 槽的数量为什么是 16384[3]

### 参考资料

[1] 极客时间的《Redis 核心技术与实战》: _https://time.geekbang.org/column/intro/100056701?tab=catalog_

[2] Redis 进阶 - 高可拓展：分片技术（Redis Cluster）详解: _https://pdai.tech/md/db/nosql-redis/db-redis-x-cluster.html_

[3] Redis slots 槽的数量为什么是 16384: _https://jc3wish.github.io/post/redis_slots_request_1/_
