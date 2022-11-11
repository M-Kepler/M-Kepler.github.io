- [memcache 曾经是互联网分层架构中，使用最多的的 KV 缓存，如今却几乎被 redis 替代](#memcache-曾经是互联网分层架构中使用最多的的-kv-缓存如今却几乎被-redis-替代)
- [第一部分：知其然](#第一部分知其然)
- [第二部分：知其原理 (why, what)](#第二部分知其原理-why-what)
- [第三部分：知其所以然，知其内核 (how)](#第三部分知其所以然知其内核-how)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/U1ROIubjSsfapMa4YF-zVQ)

## memcache 曾经是互联网分层架构中，使用最多的的 KV 缓存，如今却几乎被 redis 替代

_画外音：你还在用 mc 吗，还是 redis？_

但 memcache 的内核设计，却值得每一个技术人学习和借鉴。

## 第一部分：知其然

关于 memcache 一些基础特性，使用过的小伙伴必须知道：

（1）mc 的**核心职能**是 KV 内存管理，**value 存储**最大为 1M，它不支持复杂数据结构（哈希、列表、集合、有序集合等）；

（2）mc 不支持持久化；

（3）mc 支持 key 过期；

（4）mc 持续运行很少会出现内存碎片，速度不会随着服务运行时间降低；

（5）mc 使用非阻塞 IO 复用网络模型，使用监听线程 / 工作线程的多线程模型；

memcache 的这些特性，成竹在胸了吗？

## 第二部分：知其原理 (why, what)

第一部分，只停留在使用层面，除此之外，还必须了解原理。

**memcache 为什么不支持复杂数据结构？为什么不支持持久化？**

业务决定技术方案，mc 的诞生，以 “以服务的方式，而不是库的方式管理 KV 内存” 为**设计目标**，它颠覆的是，KV 内存管理组件库，复杂数据结构与持久化并不是它的初衷。

当然，用 “颠覆” 这个词未必不合适，库和服务各有使用场景，只是在分布式的环境下，服务的使用范围更广。设计目标，诞生背景很重要，这一定程度上决定了实现方案，就如 redis 的出现，是为了有一个更好用，更多功能的缓存服务。

**memcache 是用什么技术实现 key 过期的？**

懒淘汰 (lazy expiration)。

**memcache 为什么能保证运行性能，且很少会出现内存碎片？**

提前分配内存。

**memcache 为什么要使用非阻塞 IO 复用网络模型，使用监听线程 / 工作线程的多线程模型，有什么优缺点？**

目的是提高吞吐量。多线程能够充分的利用多核，但会带来一些锁冲突。

## 第三部分：知其所以然，知其内核 (how)

一个对技术内核充满 “好奇心” 的工程师，必须了解细节，掌握内核。

_画外音：本文刚刚开始。_

**memcache 是什么实现内存管理，以减小内存碎片，是怎么实现分配内存的？**

开讲之前，先解释几个非常重要的概念：

**chunk**：它是将内存分配给用户使用的最小单元。

**item**：用户要存储的数据，包含 key 和 value，最终都存储在 chunk 里。

**slab**：它会管理一个固定 chunk size 的若干个 chunk，而 mc 的内存管理，由若干个 slab 组成。

_画外音：为了避免复杂性，本文先不引入 page 的概念了。_

![](https://mmbiz.qpic.cn/mmbiz_png/YrezxckhYOziah8wuTSoJjck4YRwtibCPS51u8bgBLIl12FLcWAKYRTEclTFt3mPzzzf26wH3YFnFDic6AiboY4QNQ/640?wx_fmt=png)

如上图所示，一系列 slab，分别管理 128B，256B，512B… 的 chunk 内存单元。

将上图中管理 128B 的 slab0 放大：

![](https://mmbiz.qpic.cn/mmbiz_png/YrezxckhYOziah8wuTSoJjck4YRwtibCPSU8jPZvfRoVeiaLnbia1ehPkrrICgpBpjz1NqMEYNQrMz0W1dKR4wYNxA/640?wx_fmt=png)

能够发现 slab 中的一些核心数据结构是：

**（1）chunk_size**：该 slab 管理的是 128B 的 chunk；

**（2）free_chunk_list**：用于快速找到空闲的 chunk；

**（3）chunk**[]：已经预分配好，用于存放用户 item 数据的实际 chunk 空间；

_画外音：其实还有 lru_list。_

**假如用户要存储一个 100B 的 item，是如何找到对应的可用 chunk 的呢？**

![](https://mmbiz.qpic.cn/mmbiz_png/YrezxckhYOziah8wuTSoJjck4YRwtibCPSD9ib9KRo7gMZHIY8DwhwIPKltPiaofqnE9NryeK08GFw5w1aWxTNGlTQ/640?wx_fmt=png)

会从最接近 item 大小的 slab 的 chunk[] 中，通过 free_chunk_list 快速找到对应的 chunk，如上图所示，与 item 大小最接近的 chunk 是 128B。

**为什么不会出现内存碎片呢？**

![](https://mmbiz.qpic.cn/mmbiz_png/YrezxckhYOziah8wuTSoJjck4YRwtibCPSt9KC3az2iatHibeZToQn0BjfbRmLutA9WRGTb6yhVCOB6wQuk2Nw5Ynw/640?wx_fmt=png)

拿到一个 128B 的 chunk，去存储一个 100B 的 item，余下的 28B 不会再被其他的 item 所使用，即：实际上浪费了存储空间，来减少内存碎片，保证访问的速度。

_画外音：理论上，内存碎片几乎不存在。_

memcache 通过 slab，chunk，free_chunk_list 来快速分配内存，**存储用户的 item，那它又是如何快速实现 key 的查找的呢？**

没有什么特别算法：

![](https://mmbiz.qpic.cn/mmbiz_png/YrezxckhYOziah8wuTSoJjck4YRwtibCPSbVuHdn5jA7VdPq8hm28JESJTmcGYpy1O7NPic43Tb0AmribvSeasAC3g/640?wx_fmt=png)

（1）通过 hash 表实现快速查找；

（2）通过链表来解决冲突；

用最朴素的方式，实现 key 的快速查找。

**随着 item 的个数不断增多，hash 冲突越来越大，hash 表如何保证查询效率呢？**

当 item 总数达到 hash 表长度的 1.5 倍时，hash 表会动态扩容，rehash 将数据重新分布，以保证查找效率不会不断降低。

扩展 hash 表之后，同一个 key 在新旧 hash 表内的位置会发生变化，**如何保证数据的一致性，以及如何保证迁移过程服务的可用性呢**（肯定不能加一把大锁，迁移完成数据，再重新服务吧）**？**

哈希表扩展，数据迁移是一个耗时的操作，会有一个专门的线程来实施，为了避免大锁，采用的是 “分段迁移” 的策略。

当 item 数量达到阈值时，迁移线程会分段迁移，对 hash 表中的一部分桶进行**加锁，迁移数据，解锁**：

（1）一来，保证不会有长时间的阻塞，影响服务的可用性；

（2）二来，保证 item 不会在新旧 hash 表里不一致；

新的问题来了，对于已经存在于旧 hash 表中的 item，可以通过上述方式迁移，那么**在 item 迁移的过程中，****如果有新的 item 插入，是应该插入旧 hash 表还是新 hash 表呢？**

memcache 的做法是，判断旧 hash 表中，item 应该插入的桶，是否已经迁移至新表中：

**（1）如果已经迁移**，则 item 直接插入新 hash 表；

**（2）如果还没有被迁移**，则直接插入旧 hash 表，未来等待迁移线程来迁移至新 hash 表；

为什么要这么做呢，**不能直接插入新 hash 表吗？**

memcache 没有给出官方的解释，楼主揣测，这种方法能够保证一个桶内的数据，只在一个 hash 表中（要么新表，要么旧表），任何场景下都不会出现，旧表新表查询两次，以提升查询速度。

**memcache 是怎么实现 key 过期的，懒淘汰 (lazy expiration) 具体是怎么玩的？**

实现 “超时” 和“过期”，最常见的两种方法是：

（1）启动一个超时线程，对所有 item 进行扫描，如果发现超时，则进行超时回调处理；

（2）每个 item 设定一个超时信号通知，通知触发超时回调处理；

这两种方法，都需要有额外的资源消耗。

mc 的查询业务非常简单，只会返回 cache hit 与 cache miss 两种结果，这种场景下，非常适合使用懒淘汰的方式。

**懒淘汰的核心**是：

（1）item 不会被主动淘汰，即没有超时线程，也没有信号通知来主动检查；

（2）item 每次会查询 (get) 时，检查一下时间戳，如果已经过期，被动淘汰，并返回 cache miss；

举个例子，假如 set 了一个 key，有效期 100s：

（1）在第 50s 的时候，有用户查询 (get) 了这个 key，判断未过期，返回对应的 value 值；

（2）在第 200s 的时候，又有用户查询 (get) 了这个 key，判断已过期，将 item 所在的 chunk 释放，返回 cache miss；

这种方式的实现代价很小，消耗资源非常低：

（1）在 item 里，加入一个过期时间属性；

（2）在 get 时，加入一个时间判断；

内存总是有限的，chunk 数量有限的情况下，能够存储的 item 个数是有限的，**假如 chunk 被用完了，该怎么办？**

仍然是上面的例子，假如 128B 的 chunk 都用完了，用户又 set 了一个 100B 的 item，**要不要挤掉已有的 item？**

要。

这里的**启示**是：

（1）即使 item 的有效期设置为 “永久”，也可能被淘汰；

（2）如果要做全量数据缓存，一定要仔细评估，cache 的内存大小，必须大于，全量数据的总大小，否则很容易踩坑；

**挤掉哪一个 item？怎么挤？**

这里涉及 LRU 淘汰机制。

如果操作系统的内存管理，最常见的淘汰算法是 FIFO 和 LRU：

**（1）FIFO**(first in first out)：最先被 set 的 item，最先被淘汰；

**（2）LRU**(least recently used)：最近最少被使用 (get/set) 的 item，最先被淘汰；

使用 LRU 算法挤掉 item，需要增加两个属性：

（1）最近 item 访问计数；

（2）最近 item 访问时间；

并增加一个 LRU 链表，就能够快速实现。

_画外音：所以，管理 chunk 的每个 slab，除了 free_chunk_list，还有 lru_list。_

memcache，你学会了吗？

思路比结论重要。
