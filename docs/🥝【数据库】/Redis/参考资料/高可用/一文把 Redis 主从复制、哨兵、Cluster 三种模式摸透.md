- [概述](#概述)
- [单机](#单机)
  - [优点](#优点)
  - [缺点](#缺点)
  - [实操搭建](#实操搭建)
- [主从模式](#主从模式)
  - [原理](#原理)
  - [优点](#优点-1)
  - [缺点](#缺点-1)
  - [实操搭建](#实操搭建-1)
  - [测试](#测试)
- [哨兵模式](#哨兵模式)
  - [原理](#原理-1)
  - [节点通信](#节点通信)
  - [上线和下线](#上线和下线)
  - [选举算法](#选举算法)
  - [优点](#优点-2)
  - [缺点](#缺点-2)
  - [实操搭建](#实操搭建-2)
- [Cluster 模式](#cluster-模式)
  - [数据分区原理](#数据分区原理)
  - [节点通信](#节点通信-1)
  - [数据请求](#数据请求)
  - [扩容和收缩](#扩容和收缩)
  - [优点](#优点-3)
  - [缺点](#缺点-3)
  - [实操搭建](#实操搭建-3)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/GlqoafdmC4Xjf7DACN3srQ)

## 概述

Redis 作为缓存的高效中间件，在我们日常的开发中被频繁的使用，今天就来说一说 Redis 的四种模式，分别是**「单机版、主从复制、哨兵、以及集群模式」**。

可能，在一般公司的程序员使用单机版基本都能解决问题，在 Redis 的官网给出的数据是`10W QPS`，这对于应付一般的公司绰绰有余了，再不行就来个主从模式，实现读写分离，性能又大大提高。

但是，我们作为有抱负的程序员，仅限于单机版和主从模式的 crud 是不行的，至少也要了解**「哨兵」**和**「集群模式」**的原理，这样面试的时候才能和面试官扯皮啊。

之前对于 Redis 方面也是写了比较多的文章，如：**「Redis 的基本数据类型和底层的实现原理、事务、持久化、分布式锁、订阅预发布」**等，可以说是比较全面的教程了，这篇讲完基本就全了，我会把文章系统的整理成 pdf，分享给大家。

先来个整理的 Redis 大纲，可能还有不完整的地方，若是有不完整的，可以在留言区补充，我后续会加进去。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmBewB624XiaeDUhW8Ig0yrSdrwuS9r2QPCrNKIxxs1ia35a7Idl3B8WaQ/640?wx_fmt=png)

## 单机

单机版的 Redis 就比较简单了，基本 90% 的程序员都是用过，官网推荐操作 Redis 的第三方依赖库是 Jedis，在 SpringBoot 项目中，引入下面依赖就可以直接使用了：

```
<dependency>   <groupId>redis.clients</groupId>   <artifactId>jedis</artifactId>   <version>${jedis.version}</version></dependency>
```

### 优点

单机版的 Redis 也有很多优点，比如实现实现简单、维护简单、部署简单、维护成本非常低，不需要其它额外的开支。

### 缺点

但是，因为是单机版的 Redis 所以也存在很多的问题，比如最明显的单点故障问题，一个 Redis 挂了，所有的请求就会直接打在了 DB 上。

并且一个 Redis 抗并发数量也是有限的，同时要兼顾读写两种请求，只要访问量一上来，Redis 就受不了了，另一方面单机版的 Redis 数据量存储也是有限的，数据量一大，再重启 Redis 的时候，就会非常的慢，所以局限性也是比较大的。

### 实操搭建

单机版的搭建教程，在网上有非常多的全面的教程，基本就是傻瓜式操作，特别是在本地搭建的话，基本使用 yum 快捷方便，几句命令就搞定了，这里推荐一个搭建教程：https://www.cnblogs.com/ zuidongfeng/p/8032505.html。

上面这个教程讲的非常的详细，环境的搭建本来是运维的工作，但是作为程序员尝试自己去搭建环境还是有必要的，而且搭建环境这种东西，基本就是一劳永逸，搭建一次，可能下次换电脑或者重装虚拟机才会再次搭建。

这里也放出 redis 常用的`redis.conf`的配置项，并且附带注释，看我是不是很暖男：

```sh
# 设置后台启动，一般设置yes
daemonize yes
# edis以守护进程方式运行时,redis默认会把pid写入/var/run/redis.pid文件
pidfile /var/run/redis.pid
# 默认端口为6379
port 6379
# 主机地址，设置0.0.0.0表示都可以访问。127.0.0.1表示只允许本机访问
bind 127.0.0.1
# 客户端闲置多长时间后关闭连接，如果指定为0，表示关闭该功能
timeout 900
# 日志记录方式，默认为标准输出
logfile stdout
# 指明日志文件名
logfile "./redis7001.log"
# 设置数据库的数量，默认数据库为0
databases 16
# 有多少次更新操作，就将数据同步到数据文件

# Redis默认配置文件中提供了三个条件：
# 900秒（15分钟）内有1个更改
save 900 1
# 300秒（5分钟）内有10个更改
save 300 10
# 60秒内有10000个更改
save 60 10000

# 指定存储至本地数据库时是否压缩数据
rdbcompression yes
# 指定本地数据库文件名
dbfilename dump.rdb
# 指定本地数据库存放目录
dir ./
# 主从同步设置，设置主数据库的ip和端口
slaveof
# 如果非零，则设置SO_KEEPALIVE选项来向空闲连接的客户端发送ACK
tcp-keepalive 60
# 默认如果开启RDB快照(至少一条save指令)并且最新的后台保存失败，Redis将会停止接受写操作
# 这将使用户知道数据没有正确的持久化到硬盘，否则可能没人注意到并且造成一些灾难
stop-writes-on-bgsave-error yes
# 默认如果开启RDB快照(至少一条save指令)并且最新的后台保存失败，Redis将会停止接受写操作。
stop-writes-on-bgsave-error yes
# 当导出到 .rdb 数据库时是否用LZF压缩字符串对象
rdbcompression yes
# 版本5的RDB有一个CRC64算法的校验和放在了文件的最后。这将使文件格式更加可靠。
rdbchecksum yes
# 持久化数据库的文件名
dbfilename dump-master.rdb
# 工作目录
dir /usr/local/redis-4.0.8/redis_master/
# slav服务连接master的密码
masterauth testmaster123
# 当一个slave失去和master的连接，或者同步正在进行中，slave的行为可以有两种：
#1) 如果 slave-serve-stale-data 设置为 "yes" (默认值)，slave会继续响应客户端请求，可能是正常数据，或者是过时了的数据，也可能是还没获得值的空数据。
# 2) 如果 slave-serve-stale-data 设置为 "no"，slave会回复"正在从master同步
# （SYNC with master in progress）"来处理各种请求，除了 INFO 和 SLAVEOF 命令。
slave-serve-stale-data yes
# 配置是否仅读
slave-read-only yes
# 如果你选择“yes”Redis将使用更少的TCP包和带宽来向slaves发送数据。但是这将使数据传输到slave上有延迟，Linux内核的默认配置会达到40毫秒
# 如果你选择了 "no" 数据传输到salve的延迟将会减少但要使用更多的带宽
repl-disable-tcp-nodelay no
# slave的优先级，优先级数字小的salve会优先考虑提升为master
slave-priority 100
# 密码验证
requirepass testmaster123
# redis实例最大占用内存，一旦内存使用达到上限，Redis会根据选定的回收策略（参见：
# maxmemmory-policy）删除key
maxmemory 3gb
# 最大内存策略：如果达到内存限制了，Redis如何选择删除key。
# volatile-lru -> 根据LRU算法删除带有过期时间的key。
# allkeys-lru -> 根据LRU算法删除任何key。
# volatile-random -> 根据过期设置来随机删除key, 具备过期时间的key。
# allkeys->random -> 无差别随机删, 任何一个key。
# volatile-ttl -> 根据最近过期时间来删除（辅以TTL）, 这是对于有过期时间的key
# noeviction -> 谁也不删，直接在写操作时返回错误。
maxmemory-policy volatile-lru
# AOF开启
appendonly no
# aof文件名
appendfilename "appendonly.aof"
# fsync() 系统调用告诉操作系统把数据写到磁盘上，而不是等更多的数据进入输出缓冲区。
# 有些操作系统会真的把数据马上刷到磁盘上；有些则会尽快去尝试这么做。
# Redis支持三种不同的模式：
# no：不要立刻刷，只有在操作系统需要刷的时候再刷。比较快。
# always：每次写操作都立刻写入到aof文件。慢，但是最安全。
# everysec：每秒写一次。折中方案。
appendfsync everysec
# 如果AOF的同步策略设置成 "always" 或者 "everysec"，并且后台的存储进程（后台存储或写入AOF
# 日志）会产生很多磁盘I/O开销。某些Linux的配置下会使Redis因为 fsync()系统调用而阻塞很久。
# 注意，目前对这个情况还没有完美修正，甚至不同线程的 fsync() 会阻塞我们同步的write(2)调用。
# 为了缓解这个问题，可以用下面这个选项。它可以在 BGSAVE 或 BGREWRITEAOF 处理时阻止主进程进行fsync()。
# 这就意味着如果有子进程在进行保存操作，那么Redis就处于"不可同步"的状态。
# 这实际上是说，在最差的情况下可能会丢掉30秒钟的日志数据。（默认Linux设定）
# 如果你有延时问题把这个设置成"yes"，否则就保持"no"，这是保存持久数据的最安全的方式。
no-appendfsync-on-rewrite yes
# 自动重写AOF文件
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
# AOF文件可能在尾部是不完整的（这跟system关闭有问题，尤其是mount ext4文件系统时
# 没有加上data=ordered选项。只会发生在os死时，redis自己死不会不完整）。
# 那redis重启时load进内存的时候就有问题了。
# 发生的时候，可以选择redis启动报错，并且通知用户和写日志，或者load尽量多正常的数据。
# 如果aof-load-truncated是yes，会自动发布一个log给客户端然后load（默认）。
# 如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
# 注意，如果在读取的过程中，发现这个aof是损坏的，服务器也是会退出的，
# 这个选项仅仅用于当服务器尝试读取更多的数据但又找不到相应的数据时。
aof-load-truncated yes
# Lua 脚本的最大执行时间，毫秒为单位
lua-time-limit 5000
# Redis慢查询日志可以记录超过指定时间的查询
slowlog-log-slower-than 10000
# 这个长度没有限制。只是要主要会消耗内存。你可以通过 SLOWLOG RESET 来回收内存。
slowlog-max-len 128
# 客户端的输出缓冲区的限制，可用于强制断开那些因为某种原因从服务器读取数据的速度不够快的客户端
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit slave 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60
# 当一个子进程重写AOF文件时，文件每生成32M数据会被同步
aof-rewrite-incremental-fsync yes

```

由于，单机版的 Redis 在并发量比较大的时候，并且需要较高性能和可靠性的时候，单机版基本就不适合了，于是就出现了 **「主从模式」**。

## 主从模式

### 原理

主从的原理还算是比较简单的，一主多从，**「主数据库（master）可以读也可以写（read/write），从数据库仅读（only read）」**。

但是，主从模式一般实现**「读写分离」**，**「主数据库仅写（only write）」**，减轻主数据库的压力，下面一张图搞懂主从模式的原理：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmibicTkz79hyfzfIpcN0klA0TtZaugwiaibfyQEX5wVyRxgz3IIsaSKJlZQ/640?wx_fmt=png)

主从模式原理就是那么简单，那他执行的过程（工作机制）又是怎么样的呢？再来一张图：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmqM2BgDFyyVibwZ08k0qG4icdUH3678zySOsev0LrFaEaBXmGVdIjpCmA/640?wx_fmt=png)当开启主从模式的时候，他的具体工作机制如下：

1. 当 slave 启动后会向 master 发送`SYNC`命令，master 节点收到从数据库的命令后通过`bgsave`保存快照（**「RDB 持久化」**），并且期间的执行的些命令会被缓存起来。

2. 然后 master 会将保存的快照发送给 slave，并且继续缓存期间的写命令。

3. slave 收到主数据库发送过来的快照就会加载到自己的数据库中。

4. 最后 master 讲缓存的命令同步给 slave，slave 收到命令后执行一遍，这样 master 与 slave 数据就保持一致了。

### 优点

之所以运用主从，是因为主从一定程度上解决了单机版并发量大，导致请求延迟或者 redis 宕机服务停止的问题。

从数据库分担主数据库的读压力，若是主数据库是只写模式，那么实现读写分离，主数据库就没有了读压力了。

另一方面解决了单机版单点故障的问题，若是主数据库挂了，那么从数据库可以随时顶上来，综上来说，主从模式一定程度上提高了系统的可用性和性能，是实现哨兵和集群的基础。

主从同步以异步方式进行同步，期间 Redis 仍然可以响应客户端提交的查询和更新的请求。

### 缺点

主从模式好是好，他也有自己的缺点，比如数据的一致性问题，假如主数据库写操作完成，那么他的数据会被复制到从数据库，若是还没有即使复制到从数据库，读请求又来了，此时读取的数据就不是最新的数据。

若是从主同步的过程网络出故障了，导致主从同步失败，也会出现问题数据一致性的问题。

主从模式不具备自动容错和恢复的功能，一旦主数据库，从节点晋升为主数据库的过程需要人为操作，维护的成本就会升高，并且主节点的写能力、存储能力都会受到限制。

### 实操搭建

下面的我们来实操搭建一下主从模式，主从模式的搭建还是比较简单的，我这里一台 centos 7 虚拟机，使用开启 redis 多实例的方法搭建主从。

redis 中开启多实例的方法，首先创建一个文件夹，用于存放 redis 集群的配置文件：

```
mkdir redis
```

然后粘贴复制`redis.conf`配置文件：

```
cp /root/redis-4.0.6/redis.conf /root/redis/redis-6379.conf
cp /root/redis-4.0.6/redis.conf /root/redis/redis-6380.conf
cp /root/redis-4.0.6/redis.conf /root/redis/redis-6381.conf
```

复制三份配置文件，一主两从，6379 端口作为主数据库（master），6380、6381 作为从数据库（slave）。

首先是配置主数据库的配置文件：`vi redis-6379.conf`：

```
bind 0.0.0.0 # 注释掉或配置成0.0.0.0表示任意IP均可访问。protected-mode no # 关闭保护模式，使用密码访问。port 6379  # 设置端口，6380、6381依次为6380、6381。timeout 30 # 客户端连接空闲多久后断开连接，单位秒，0表示禁用daemonize yes # 在后台运行pidfile /var/run/redis_6379.pid  # pid进程文件名，6380、6381依次为redis_6380.pid、redis_6381.pidlogfile /root/reids/log/6379.log # 日志文件，6380、6381依次为6380.log、6381.logsave 900 1 # 900s内至少一次写操作则执行bgsave进行RDB持久化save 300 10save 60 10000 rdbcompression yes #是否对RDB文件进行压缩，建议设置为no，以（磁盘）空间换（CPU）时间dbfilename dump.rdb # RDB文件名称dir /root/redis/datas # RDB文件保存路径，AOF文件也保存在这里appendonly yes # 表示使用AOF增量持久化的方式appendfsync everysec # 可选值 always， everysec，no，建议设置为everysecrequirepass 123456 # 设置密码
```

然后，就是修改从数据库的配置文件，在从数据库的配置文件中加入以下的配置信息：

```
slaveof 127.0.0.1 6379 # 配置master的ip，portmasterauth 123456 # 配置访问master的密码slaveof-serve-stale-data no
```

接下来就是启动三个 redis 实例，启动的命令，先 cd 到 redis 的 src 目录下，然后执行：

```
./redis-server /root/redis/6379.conf
./redis-server /root/redis/6380.conf
./redis-server /root/redis/6381.conf
```

通过命令`ps -aux | grep redis`，查看启动的 redis 进程：![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmiajFauoM7VGH6dJpXu4icUxfODSDFSWKNFqoYsBZrIq1zWUFx2nUw1xQ/640?wx_fmt=png)如上图所示，表示启动成功，下面就开始进入测试阶段。

### 测试

我这里使用 SecureCRT 作为 redis 连接的客户端，同时启动三个 SecureCRT，分别连接 redis1 的三个实例，启动时指定端口以及密码：

```
./redis-cli -p 6379 -a 123456
```

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmlNbiacKxRibVvrClzez4fqe0Ajs6icOicZo9UkpQV1fXvAUYTzC4awfLyQ/640?wx_fmt=png)启动后，在 master（6379），输入：set name 'ldc'，在 slave 中通过 get name，可以查看：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmBkAWDicrtm0BZlzM2OA5ot1tL5SuVibFibLbyApibrFZgVF1tChGm7uysQ/640?wx_fmt=png)数据同步成功，这有几个坑一个是 redis.conf 中没有设置对 bind，会导致非本机的 ip 被过滤掉，一般配置 0.0.0.0 就可以了。

另一个是没有配置密码 requirepass 123456，会导致 IO 一直连接异常，这个是我遇到的坑，后面配置密码后就成功了。

还有，就是查看 redis 的启动日志可以发现有两个 warning，虽然不影响搭建主从同步，看着挺烦人的，但是有些人会遇到，有些人不会遇到。

但是，我这个人比较有强迫症，百度也是有解决方案的，这里就不讲了，交给你们自己解决，这里只是告诉你有这个问题，有些人看都不看日志的，看到启动成功就认为万事大吉了，也不看日志，这习惯并不好。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmcbRYIOIN5BEgeCiadMnQhUGggnMULAzpFnia7dRyicFVG7U9EU2ZAqLYA/640?wx_fmt=png)

## 哨兵模式

### 原理

哨兵模式是主从的升级版，因为主从的出现故障后，不会自动恢复，需要人为干预，这就很蛋疼啊。

在主从的基础上，实现哨兵模式就是为了监控主从的运行状况，对主从的健壮进行监控，就好像哨兵一样，只要有异常就发出警告，对异常状况进行处理。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmWAXa85icYwiazVty2zGdsA2iaJGorK5Ydd4V1lNZjeKn9c1Hntz9tbFcg/640?wx_fmt=png)所以，总的概括来说，哨兵模式有以下的优点（功能点）：

1. **「监控」**：监控 master 和 slave 是否正常运行，以及哨兵之间也会相互监控

2. **「自动故障恢复」**：当 master 出现故障的时候，会自动选举一个 slave 作为 master 顶上去。

哨兵模式的监控配置信息，是通过配置从数据库的`sentinel monitor <master-name> <ip> <redis-port> <quorum>` 来指定的，比如：

```sh
# mymaster 表示给master数据库定义了一个名字，后面的是master的ip和端口，1 表示至少需要一个Sentinel进程同意才能将master判断为失效
# 如果不满足这个条件，则自动故障转移（failover）不会执行
sentinel monitor mymaster 127.0.0.1 6379 1
```

### 节点通信

当然还有其它的配置信息，其它配置信息，在环境搭建的时候再说。当哨兵启动后，会与 master 建立一条连接，用于订阅 master 的`_sentinel_:hello`频道。

该频道用于获取监控该 master 的其它哨兵的信息。并且还会建立一条定时向 master 发送 INFO 命令获取 master 信息的连接。

**「当哨兵与 master 建立连接后，定期会向（10 秒一次）master 和 slave 发送 INFO 命令，若是 master 被标记为主观下线，频率就会变为 1 秒一次。」**

并且，定期向`_sentinel_:hello`频道发送自己的信息，以便其它的哨兵能够订阅获取自己的信息，发送的内容包含**「哨兵的 ip 和端口、运行 id、配置版本、master 名字、master 的 ip 端口还有 master 的配置版本」**等信息。

以及，**「定期的向 master、slave 和其它哨兵发送 PING 命令（每秒一次），以便检测对象是否存活」**，若是对方接收到了 PING 命令，无故障情况下，会回复 PONG 命令。

所以，哨兵通过建立这两条连接、通过定期发送 INFO、PING 命令来实现哨兵与哨兵、哨兵与 master 之间的通信。

这里涉及到一些概念需要理解，INFO、PING、PONG 等命令，后面还会有 MEET、FAIL 命令，以及主观下线，当然还会有客观下线，这里主要说一下这几个概念的理解：

1. INFO：该命令可以获取主从数据库的最新信息，可以实现新结点的发现

2. PING：该命令被使用最频繁，该命令封装了自身节点和其它节点的状态数据。

3. PONG：当节点收到 MEET 和 PING，会回复 PONG 命令，也把自己的状态发送给对方。

4. MEET：该命令在新结点加入集群的时候，会向老节点发送该命令，表示自己是个新人

5. FAIL：当节点下线，会向集群中广播该消息。

### 上线和下线

当哨兵与 master 相同之后就会定期一直保持联系，若是某一时刻哨兵发送的 PING 在指定时间内没有收到回复（`sentinel down-after-milliseconds master-name milliseconds` 配置），那么发送 PING 命令的哨兵就会认为该 master**「主观下线」**（`Subjectively Down`）。

因为有可能是哨兵与该 master 之间的网络问题造成的，而不是 master 本身的原因，所以哨兵同时会询问其它的哨兵是否也认为该 master 下线，若是认为该节点下线的哨兵达到一定的数量（**「前面的 quorum 字段配置」**），就会认为该节点**「客观下线」**（`Objectively Down`）。

若是没有足够数量的 sentinel 同意该 master 下线，则该 master 客观下线的标识会被移除；若是 master 重新向哨兵的 PING 命令回复了客观下线的标识也会被移除。

### 选举算法

当 master 被认为客观下线后，又是怎么进行故障恢复的呢？原来哨兵中首先选举出一个老大哨兵来进行故障恢复，选举老大哨兵的算法叫做**「Raft 算法」**：

1. 发现 master 下线的哨兵（sentinelA）会向其它的哨兵发送命令进行拉票，要求选择自己为哨兵大佬。

2. 若是目标哨兵没有选择其它的哨兵，就会选择该哨兵（sentinelA）为大佬。

3. 若是选择 sentinelA 的哨兵超过半数（半数原则），该大佬非 sentinelA 莫属。

4. 如果有多个哨兵同时竞选，并且可能存在票数一致的情况，就会等待下次的一个随机时间再次发起竞选请求，进行新的一轮投票，直到大佬被选出来。

选出大佬哨兵后，大佬哨兵就会对故障进行自动回复，从 slave 中选出一名 slave 作为主数据库，选举的规则如下所示：

1. 所有的 slave 中`slave-priority`优先级最高的会被选中。

2. 若是优先级相同，会选择偏移量最大的，因为偏移量记录着数据的复制的增量，越大表示数据越完整。

3. 若是以上两者都相同，选择 ID 最小的。

通过以上的层层筛选最终实现故障恢复，当选的 slave 晋升为 master，其它的 slave 会向新的 master 复制数据，若是 down 掉的 master 重新上线，会被当作 slave 角色运行。

### 优点

哨兵模式是主从模式的升级版，所以在系统层面提高了系统的可用性和性能、稳定性。当 master 宕机的时候，能够自动进行故障恢复，需不要人为的干预。

哨兵与哨兵之间、哨兵与 master 之间能够进行及时的监控，心跳检测，及时发现系统的问题，这都是弥补了主从的缺点。

### 缺点

哨兵一主多从的模式同样也会遇到写的瓶颈，已经存储瓶颈，若是 master 宕机了，故障恢复的时间比较长，写的业务就会受到影响。

增加了哨兵也增加了系统的复杂度，需要同时维护哨兵模式。

### 实操搭建

最后，我们进行一下哨兵模式的搭建，配置哨兵模式还是比较简单的，在上面配置的主从模式的基础上，同时创建一个文件夹用于存放三个哨兵的配置文件：

```
mkdir /root/redis-4.0.6/sentinel.conf  /root/redis/sentinel/sentinel1.conf 
mkdir /root/redis-4.0.6/sentinel.conf  /root/redis/sentinel/sentinel2.conf 
mkdir /root/redis-4.0.6/sentinel.conf  /root/redis/sentinel/sentinel3.conf 
```

分别在这三个文件中添加如下配置：

```
daemonize yes # 在后台运行sentinel monitor mymaster 127.0.0.1 6379 1 # 给master起一个名字mymaster，并且配置master的ip和端口sentinel auth-pass mymaster 123456 # master的密码port 26379 #另外两个配置36379,46379端口sentinel down-after-milliseconds mymaster 3000 # 3s未回复PING就认为master主观下线sentinel parallel-syncs mymaster 2  # 执行故障转移时，最多可以有2个slave实例在同步新的master实例sentinel failover-timeout mymaster 100000 # 如果在10s内未能完成故障转移操作认为故障转移失败
```

配置完后分别启动三台哨兵：

```
./redis-server sentinel1.conf --sentinel
./redis-server sentinel2.conf --sentinel
./redis-server sentinel3.conf --sentinel
```

然后通过：`ps -aux|grep redis`进行查看：![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmnoWJE7JcyAorI4kc7drFUspvDBVqG81zvMdFPgveInbqTT6DY7EVxg/640?wx_fmt=png)可以看到三台 redis 实例以及三个哨兵都已经正常启动，现登陆 6379，通过 INFO Repliaction 查看 master 信息：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmnoB9CmeE0MNvGYic50qmp5YX2IxmDBYkaAQgS0X11qbzIDA7MXfFZ5A/640?wx_fmt=png)当前 master 为 6379，然后我们来测试一下哨兵的自动故障恢复，直接 kill 掉 6379 进程，然后通过登陆 6380 再次查看 master 的信息：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmt57vbd5ASV2x61F2wsNeia5aSs6EXCjibk8ibYhvVWPHG2NONXsJcIyGA/640?wx_fmt=png)可以看到当前的 6380 角色是 master，并且 6380 可读可写，而不是只读模式，这说明我们的哨兵是起作用了，搭建成功，感兴趣的可以自行搭建，也有可能你会踩一堆的坑。

## Cluster 模式

最后，Cluster 是真正的集群模式了，哨兵解决和主从不能自动故障恢复的问题，但是同时也存在难以扩容以及单机存储、读写能力受限的问题，并且集群之前都是一台 redis 都是全量的数据，这样所有的 redis 都冗余一份，就会大大消耗内存空间。

集群模式实现了 Redis 数据的分布式存储，实现数据的分片，每个 redis 节点存储不同的内容，并且解决了在线的节点收缩（下线）和扩容（上线）问题。

集群模式真正意义上实现了系统的高可用和高性能，但是集群同时进一步使系统变得越来越复杂，接下来我们来详细的了解集群的运作原理。

### 数据分区原理

集群的原理图还是很好理解的，在 Redis 集群中采用的是虚拟槽分区算法，会把 redis 集群分成 16384 个槽（0 -16383）。

比如：下图所示三个 master，会把 0 -16383 范围的槽可能分成三部分（0-5000）、（5001-11000）、（11001-16383）分别数据三个缓存节点的槽范围。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmJsMmN5z6UZaT5YBCd6vVTKugUMeoh7Lnic8yTsicicvBokoeJU7aYBUNA/640?wx_fmt=png)当客户端请求过来，会首先通过对 key 进行 CRC16 校验并对 16384 取模（CRC16(key)%16383）计算出 key 所在的槽，然后再到对应的槽上进行取数据或者存数据，这样就实现了数据的访问更新。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmtKMWhNIVpjvSCvr0FH0TrxY6hBrqtqrNz8p7WILLicbKaoPSYKPxZ7w/640?wx_fmt=png)

之所以进行分槽存储，是将一整堆的数据进行分片，防止单台的 redis 数据量过大，影响性能的问题。

### 节点通信

节点之间实现了将数据进行分片存储，那么节点之间又是怎么通信的呢？这个和前面哨兵模式讲的命令基本一样。

首先新上线的节点，会通过 Gossip 协议向老成员发送 Meet 消息，表示自己是新加入的成员。

老成员收到 Meet 消息后，在没有故障的情况下会恢复 PONG 消息，表示欢迎新结点的加入，除了第一次发送 Meet 消息后，之后都会发送定期 PING 消息，实现节点之间的通信。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmm47l9D0s7d31OPcYR1hZxrxOHUtUYia1voLwlkIghILUJwNg7zUaVibcA/640?wx_fmt=png)

通信的过程中会为每一个通信的节点开通一条 tcp 通道，之后就是定时任务，不断的向其它节点发送 PING 消息，这样做的目的就是为了了解节点之间的元数据存储情况，以及健康状况，以便即使发现问题。

### 数据请求

上面说到了槽信息，在 Redis 的底层维护了`unsigned char myslots[CLUSTER_SLOTS/8]` 一个数组存放每个节点的槽信息。

因为他是一个二进制数组，只有存储 0 和 1 值，如下图所示：

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmmELqNDLeqDAmcXoq4cZq53EHIEaKt0icgSGlTyHm3Pjn6HgcSBzpZBVg/640?wx_fmt=png)

这样数组只表示自己是否存储对应的槽数据，若是 1 表示存在该数据，0 表示不存在该数据，这样查询的效率就会非常的高，类似于布隆过滤器，二进制存储。

比如：集群节点 1 负责存储 0-5000 的槽数据，但是此时只有 0、1、2 存储有数据，其它的槽还没有存数据，所以 0、1、2 对应的值为 1。

并且，每个 redis 底层还维护了一个 clusterNode 数组，大小也是 16384，用于储存负责对应槽的节点的 ip、端口等信息，这样每一个节点就维护了其它节点的元数据信息，便于及时的找到对应的节点。

当新结点加入或者节点收缩，通过 PING 命令通信，及时的更新自己 clusterNode 数组中的元数据信息，这样有请求过来也就能及时的找到对应的节点。

![alt](https://mmbiz.qpic.cn/mmbiz_png/IJUXwBNpKlgRctTenvgHvQOc5sGoMkmm4hDb9klU2RH84QYlXMtAUm2OcJD6hXBpou4sGOkLER5lJN5RicSQWjw/640?wx_fmt=png)有两种其它的情况就是，若是请求过来发现，数据发生了迁移，比如新节点加入，会使旧的缓存节点数据迁移到新结点。

请求过来发现旧节点已经发生了数据迁移并且数据被迁移到新结点，由于每个节点都有 clusterNode 信息，通过该信息的 ip 和端口。此时旧节点就会向客户端发一个 MOVED 的重定向请求，表示数据已经迁移到新结点上，你要访问这个新结点的 ip 和端口就能拿到数据，这样就能重新获取到数据。

倘若正在发正数据迁移呢？旧节点就会向客户端发送一个 ASK 重定向请求，并返回给客户端迁移的目标节点的 ip 和端口，这样也能获取到数据。

### 扩容和收缩

扩容和收缩也就是节点的上线和下线，可能节点发生故障了，故障自动回复的过程（节点收缩）。

节点的收缩和扩容时，会重新计算每一个节点负责的槽范围，并发根据虚拟槽算法，将对应的数据更新到对应的节点。

还有前面的讲的新加入的节点会首先发送 Meet 消息，详细可以查看前面讲的内容，基本一样的模式。

以及发生故障后，哨兵老大节点的选举，master 节点的重新选举，slave 怎样晋升为 master 节点，可以查看前面哨兵模式选举过程。

### 优点

集群模式是一个无中心的架构模式，将数据进行分片，分布到对应的槽中，每个节点存储不同的数据内容，通过路由能够找到对应的节点负责存储的槽，能够实现高效率的查询。

并且集群模式增加了横向和纵向的扩展能力，实现节点加入和收缩，集群模式是哨兵的升级版，哨兵的优点集群都有。

### 缺点

缓存的最大问题就是带来数据一致性问题，在平衡数据一致性的问题时，兼顾性能与业务要求，大多数都是以最终一致性的方案进行解决，而不是强一致性。

并且集群模式带来节点数量的剧增，一个集群模式最少要 6 台机，因为要满足半数原则的选举方式，所以也带来了架构的复杂性。

slave 只充当冷备，并不能缓解 master 的读的压力。

### 实操搭建

集群模式的部署比较简单，只要在 redis.conf 加入下面的配置信息即可：

```
port 6379# 本示例6个节点端口分别为6379、6380、6381、6382、6383、6384daemonize yes # r后台运行 pidfile /var/run/redis_6379.pid # 分别对应6379、6380、6381、6382、6383、6384cluster-enabled yes # 开启集群模式 masterauth 123456# 如果设置了密码，需要指定master密码cluster-config-file nodes_6379.conf # 集群的配置文件，同样对应6379、6380、6381、6382、6383、6384六个节点cluster-node-timeout 10000 # 请求超时时间
```

同时开启这六个实例，通过下面的命令将这六个实例以集群的方式运行

```
./redis-cli --cluster create --cluster-replicas 1 127.0.0.1:6379 127.0.0.1:6380 127.0.0.1:6381  127.0.0.1:6382  127.0.0.1:6383  127.0.0.1:6384  -a 123456
```

![alt](https://mmbiz.qpic.cn/mmbiz_gif/QibA2SO3ic9YoicBW8g1KwUreUeQIWR7ajtYCucpWLraY9X9ibf0VRzmjsFualeNDKYHmVTm4PWRB99icdicRenkOfwA/640?wx_fmt=gif)

```
程序员专栏
 扫码关注填加客服 
长按识别下方二维码进群


```

**![alt](https://mmbiz.qpic.cn/mmbiz_png/2HyIlGuO02ZLdHsibQ61DBbGP99YE4FGuJTXia2eiabCj2XmtKddLBPiba4IzibDsGfFSjsb7hYEQw3gbJajhnLos2w/640?wx_fmt=png)**

\***\*近期精彩内容推荐：\*\***

![alt](https://mmbiz.qpic.cn/mmbiz/p6Vlqvia1Uicxyf6VB5RmPzHZYaSS8CCOrAotUV9epyXBKkuvYXD1Lce3T7dwSEdOL15LGQlaLkGTz2XnkhtAJ2w/640?wx_fmt=jpeg) [看电影前一定要检查一下域名是不是 HTTPS 的](https://mp.weixin.qq.com/s?__biz=MzUyODg4Nzk2MQ==&mid=2247511000&idx=1&sn=811e9cd5a3aeea954dafd412cb84d79b&scene=21#wechat_redirect)

**![alt](https://mmbiz.qpic.cn/mmbiz/p6Vlqvia1Uicxyf6VB5RmPzHZYaSS8CCOrAotUV9epyXBKkuvYXD1Lce3T7dwSEdOL15LGQlaLkGTz2XnkhtAJ2w/640?wx_fmt=jpeg)** [有个大神级女朋友是什么体验](https://mp.weixin.qq.com/s?__biz=MzI1OTQwOTg2Mg==&mid=2247501016&idx=2&sn=5c9d75e046e0e64b100d25cf5aede744&scene=21#wechat_redirect)

**![alt](https://mmbiz.qpic.cn/mmbiz/p6Vlqvia1Uicxyf6VB5RmPzHZYaSS8CCOrAotUV9epyXBKkuvYXD1Lce3T7dwSEdOL15LGQlaLkGTz2XnkhtAJ2w/640?wx_fmt=jpeg)** [世界上五个最不务正业的科学家！](https://mp.weixin.qq.com/s?__biz=MzU2NDY5ODc3NQ==&mid=2247487881&idx=2&sn=2d0af8c8486ad17a62e8378a895ee3f2&scene=21#wechat_redirect)

![alt](https://mmbiz.qpic.cn/mmbiz/p6Vlqvia1Uicxyf6VB5RmPzHZYaSS8CCOrAotUV9epyXBKkuvYXD1Lce3T7dwSEdOL15LGQlaLkGTz2XnkhtAJ2w/640?wx_fmt=jpeg) [魂斗罗只有 128KB 为何可以实现那么长的剧情](https://mp.weixin.qq.com/s?__biz=MzUzMDk2MjA0MA==&mid=2247488772&idx=1&sn=a0c410294dd92f5bca1718a5b92d79c0&scene=21#wechat_redirect)

![alt](https://mmbiz.qpic.cn/mmbiz_png/2HyIlGuO02ZLdHsibQ61DBbGP99YE4FGue9kyfreibEIoX0bIicw2xnOhERicRZW0ibVsEYrZf4tJCK8CZtIe9RnXWQ/640?wx_fmt=jpeg)

![alt](https://mmbiz.qpic.cn/mmbiz_png/QibA2SO3ic9Yo6Uhr5y4TDEK4I8SwKnpMcAerI5AFaC6tp1z0nSYh1XoXUA8rCFW2nOBstfgRdYL5rx7bePgxkiag/640?wx_fmt=png)

**在看点这里\*\***![alt](https://mmbiz.qpic.cn/mmbiz_gif/4ayehI9YRZibnhd42ayd5FKAM6RMVqI3re6Syd1k04NZATReagsE1HvDdoZ0Hzg1JWEUoRuJE7IVQzFicfOGdSCA/640?wx_fmt=gif)好文分享给更多人 ↓↓\*\*
