- [参考资料](#参考资料)
- [Memcached 分布式内存缓存系统](#memcached-分布式内存缓存系统)
  - [操作指令](#操作指令)
  - [管理和性能监控](#管理和性能监控)
  - [内存分配策略](#内存分配策略)
  - [缓存策略](#缓存策略)
  - [分布式算法](#分布式算法)
- [高可用](#高可用)
  - [memcached 本身没有提供高可用机制](#memcached-本身没有提供高可用机制)
  - [repcached 和 memagent 实现高可用](#repcached-和-memagent-实现高可用)
- [学习过程中的疑问](#学习过程中的疑问)

# 参考资料

- [菜鸟教程](https://www.runoob.com/Memcached/Memcached-tutorial.html)

- [Memcache 知识点梳理](https://blog.csdn.net/eric_sunah/article/details/51612316)

# Memcached 分布式内存缓存系统

并不负责，只有简单的设置获取命令，也没有复杂的数据类型

- 启动服务

  ```sh
  $Memcached -p 11211 -d -u root -P /tmp/Memcached.pid

  -l 后面跟监听IP地址，默认所有IP都在监听，即 0.0.0.0
  -p 指定端口，默认端口为 11211
  -d 表示后台启动一个守护进程(daemon)
  -u 表示指定root用户启动，默认不能用root用户启动
  -P 表示进程的pid存放地点

  -m 后面跟分配内存大小，以MB为单位，默认为64M
  -c 最大运行并发连接数，默认为1024
  -f 块大小增长因子，默认是1.25
  -M 内存耗尽时返回错误，而不是删除项，即不用LRU算法

  # 相比没有没有patch过的memcached，带有复制功能的memcached只多了-x、-X两个参数，具体信息
  -x 设置从哪个IP上进行数据同步，也就是设置 Master 的IP
  -X 设置数据同步的端口号，默认11212.如11212已经被使用的话，
     需要通过这个参数来设置，否则 memcached 无法启动
  ```

- 连接服务端

  不像 redis 有客户端，这里直接通过 telnet

  ```sh
  telnet 127.0.0.1 11211
  ```

- 设置数据

  ```sh
  ##### 设置
  # key：键值 key-value 结构中的 key，用于查找缓存值。
  # flags：可以包括键值对的整型参数，客户机使用它存储关于键值对的额外信息
  # exptime：在缓存中保存键值对的时间长度（以秒为单位，0 表示永远）
  # bytes：在缓存中存储的字节数
  # noreply（可选）： 该参数告知服务器不需要返回数据
  # value：存储的值（始终位于第二行）（可直接理解为key-value结构中的value）
  # set key flags exptime bytes [noreply]
  # value

  set foo 0 0 3
  bar
  ```

- 读取数据

  ```sh
  ##### 取数据
  get foo

  ```

## 操作指令

| 命令        | 作用                                                                                                                                                          |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `set`       | 添加一个新条目到 Memcached 或是用新的数据替换替换掉已存在的条目                                                                                               |
| `add`       | 当 KEY 不存在的情况下，它向 Memcached 存数据，否则，返回 NOT_STORED 响应                                                                                      |
| `replace`   | 当 KEY 存在的情况下，它才会向 Memcached 存数据，否则返回 NOT_STORED 响应                                                                                      |
| `cas`       | 改变一个存在的 KEY 值 ，但它还带了检查的功能                                                                                                                  |
| `append`    | 在这个值后面插入新值                                                                                                                                          |
| `prepend`   | 在这个值前面插入新值                                                                                                                                          |
| `get`       | 取单个值 ，从缓存中返回数据时，将在第一行得到 KEY 的名字，flag 的值和返回的 value 长度，真正的数据在第二行，最后返回 END，如 KEY 不存在，第一行就直接返回 END |
| `get_multi` | 一次性取多个值                                                                                                                                                |
| `delete`    | 删除                                                                                                                                                          |

## 管理和性能监控

| 命令                  | 作用                                               |
| :-------------------- | :------------------------------------------------- |
| `stats`               | 统计 Memcached 的各种信息                          |
| `stats reset`         | 重新统计数据                                       |
| `stats slabs`         | 显示 slabs 信息，可以详细看到数据的分段存储情况    |
| `stats items`         | 显示 slab 中的 item 数目                           |
| `stats cachedump 1 0` | 列出 slabs 第一段里存的 KEY 值                     |
| `set get`             | 保存或获取数据                                     |
| `STAT evictions 0`    | 表示要腾出新空间给新的 item 而移动的合法 item 数目 |

## 内存分配策略

![alt](https://img-blog.csdn.net/20160608124613469?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

**预分配策略**

Memcached 利用 slab allocation 机制来分配和管理内存，它按照预先规定的大小，将分配的内存分割成特定长度的内存块，再把尺寸相同的内存块分成组，数据在存放时，根据键值 大小去匹配 slab 大小，找就近的 slab 存放，所以存在空间浪费现象。

**缺点：存在内存碎片导致空间浪费**

传统的内存管理方式是，使用完通过 malloc 分配的内存后通过 free 来回收内存，这种方式容易产生内存碎片并降低操作系统对内存的管理效率。Memcached 的内存管理制效率高，而且不会造成内存碎片，但是它最大的缺点就是会导致空间浪费。因为每个 Chunk 都分配了特定长度的内存空间，所以变长数据无法充分利用这些空间。如图 4 所示，将 100 个字节的数据缓存到 128 个字节的 Chunk 中，剩余的 28 个字节就浪费掉了。

## 缓存策略

**LRU（最近最少使用）加上到期失效策略**

当你在 Memcached 内存储数据项时，你有可能会指定它在缓存的失效时间，默认为永久。当 Memcached 服务器用完分配的内时，失效的数据被首先替换，然后也是最近未使用的数据。

**惰性删除**

在 LRU 中，Memcached 使用的是一种 Lazy Expiration 策略，自己不会监控存入的 key/vlue 对是否过期，而是在获取 key 值时查看记录的时间戳，检查 key/value 对空间是否过期，这样可减轻服务器的负载。

## 分布式算法

**有点像 Redis 集群模式，自己算一下数据应该存放到哪个服务器**

当向 Memcached 集群存入 / 取出 key/value 时，Memcached 客户端程序根据一定的算法计算存入哪台服务器，然后再把 key/value 值存到此服务器中。也就是说，存取数据分二步走，第一步，选择服务器，第二步存取数据。

![alt](https://img-blog.csdn.net/20160608124638737?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

**负载均衡算法**

选择服务器算法有两种，一种是根据余数来计算分布，另一种是根据散列算法来计算分布。（可以回顾一下为什么 Reids 的集群模式不用一致性哈希，而用哈希槽（预分配））

**余数算法（固定取模）**

先求得键的整数散列值，再除以服务器台数，根据余数确定存取服务器，这种方法计算简单，高效，但在 Memcached 服务器增加或减少时，几乎所有的缓存都会失效。

**一致性哈希算法**

![alt](http://img1.51cto.com/attachment/201204/152344672.jpg)

先算出 Memcached 服务器的散列值，并将其分布到 0 到 2 的 32 次方的圆上，然后用同样的方法算出存储数据的键的散列值并映射至圆上，最后从数据映射到的位置开始顺时针查找，将数据保存到查找到的第一个服务器上，如果超过 2 的 32 次方，依然找不到服务器，就将数据保存到第一台 Memcached 服务器上。如果添加了一台 Memcached 服务器，只在圆上增加服务器的逆时针方向的第一台服务器上的键会受到影响。

# 高可用

## memcached 本身没有提供高可用机制

Memcached 尽管是 “分布式” 缓存服务器，但服务器端并没有分布式功能。各个 Memcached 不会互相通信以共享信息。那么，怎样进行分布式呢？**这完全取决于客户端的实现。**

![alt](http://s2.51cto.com/wyfs02/M01/86/0A/wKiom1ezHnfz3kJ3AAEgJSaYpQ0412.png)

Memcached 服务器与服务器之间没有任何通讯，并且不进行任何数据复制备份，所以当任何服务器节点出现故障时，会出现单点故障，如果需要实现高可用，则需要通过另外的方式来解决。

## repcached 和 memagent 实现高可用

memcached 实现高可用常用的两个工具：

- magent：连接多个 memcached，请求转发

- repcached：单 master 单 slave，互为主辅

![alt](http://images.cnitblog.com/blog/22948/201312/06114220-a67e2631144246dabbeaf2acce1c6ef2.jpg)

[部署 Memcached 高可用记录](https://segmentfault.com/a/1190000017363555)

- [Memcached-Repcached](https://blog.csdn.net/flyfish778/article/details/38758477)

  repcached 由日本人开发，可以说是 Memcached 的一个 patch, 为了实现 Memcached 的复制功能，可以支持多个 Memcached 之间相互复制，解决了 Memcached 的容灾问题。

  Repcached 是一个单 master 单 slave 的方案，它的 master/slave 都是可读写的，而且可以同步，如果 master 挂掉，slave 侦测到连接断了，就会自动 listen 而成为 master，如果 slave 挂掉，master 也会侦测到连接已经断开，并且重新侦听，等待 slave 加入。

# 学习过程中的疑问

- **有了 Redis，为什么还要选择 Memcached**

  Memcached 是为简单而设计的，而 Redis 提供了一组丰富的功能，使其适用于广泛的用例。

- **Memcached 和 Redis 一起使用的时候，哪些数据存在 Memcached，哪些数据存在 Redis 更合理？**
