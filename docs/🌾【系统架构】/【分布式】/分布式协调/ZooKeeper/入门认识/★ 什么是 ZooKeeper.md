- [前言](#前言)
- [什么是 ZooKeeper](#什么是-zookeeper)
- [为什么 ZooKeeper 能干这么多](#为什么-zookeeper-能干这么多)
  - [2.1 监听器](#21-监听器)
- [ZooKeeper 是怎么做到的](#zookeeper-是怎么做到的)
  - [3.1 统一配置管理](#31-统一配置管理)
  - [3.2 统一命名服务](#32-统一命名服务)
  - [3.3 分布式锁](#33-分布式锁)
  - [3.4 集群状态](#34-集群状态)
- [最后](#最后)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/62526102#%E5%89%8D%E8%A8%80)

## 前言

> 文本已收录至我的 GitHub 仓库，欢迎 Star：[https://github.com/ZhongFuCheng3y/3y](https://link.zhihu.com/?target=https%3A//github.com/ZhongFuCheng3y/3y)

上次写了一篇 [什么是消息队列？](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247485080%26idx%3D1%26sn%3Df223feb9256727bde4387d918519766b%26chksm%3Debd74799dca0ce8fa46223a33042a79fc16ae6ac246cb8f07e63a4a2bdce33d8c6dc74e8bd20%26token%3D1439272449%26lang%3Dzh_CN%23rd)以后，本来想入门一下 Kafka 的 (装一下环境、看看 Kafka 一些概念啥的)。后来发现 Kafka 用到了 ZooKeeper，而我又对 ZooKeeper 不了解，所以想先来学学什么是 ZooKeeper，再去看看什么是 Kafka。

ZooKeeper 相信大家已经听过这个词了，不知道大家对他了解多少呢？我第一次听到 ZooKeeper 的时候是在学 Eureka 的时候），同样 ZooKeeper 也可以作为**注册中心**。

后面听到 ZooKeeper 的时候，是因为 ZooKeeper 可以作为**分布式锁**的一种实现。

直至在了解 Kafka 的时候，发现 Kafka 也需要依赖 ZooKeeper。Kafka 使用 ZooKeeper **管理自己的元数据配置**。

这篇文章来写写我学习 ZooKeeper 的笔记，如果有错的地方希望大家可以在评论区指出。

## 什么是 ZooKeeper

从上面我们也可以发现，好像哪都有 ZooKeeper 的身影，那什么是 ZooKeeper 呢？我们先去**官网**看看介绍：

![alt](https://pic3.zhimg.com/v2-f5d41d37cd87759337b656a9e7f2cf66_r.jpg)

官网还有另一段话：

> ZooKeeper: A Distributed Coordination Service for Distributed Applications

相比于官网的介绍，我其实更喜欢 **Wiki** 中对 ZooKeeper 的介绍：

![alt](https://pic3.zhimg.com/v2-ac7c4e9e8cfee87d3c9cada72ed317de_r.jpg)

(留下不懂英语的泪水)

我简单概括一下：

- ZooKeeper 主要**服务于分布式系统**，可以用 ZooKeeper 来做：统一配置管理、统一命名服务、分布式锁、集群管理。

- 使用分布式系统就无法避免对节点管理的问题 (需要实时感知节点的状态、对节点进行统一管理等等)，而由于这些问题处理起来可能相对麻烦和提高了系统的复杂性，ZooKeeper 作为一个能够**通用**解决这些问题的中间件就应运而生了。

## 为什么 ZooKeeper 能干这么多

从上面我们可以知道，可以用 ZooKeeper 来做：统一配置管理、统一命名服务、分布式锁、集群管理。

那为什么 ZooKeeper 可以干那么多事？来看看 ZooKeeper 究竟是何方神物，在 Wiki 中其实也有提到：

> ZooKeeper nodes store their data in a hierarchical name space, much like a file system or a [tree](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Tree_%28data_structure%29) data structure

ZooKeeper 的数据结构，跟 Unix 文件系统非常类似，可以看做是一颗**树**，每个节点叫做 **ZNode**。每一个节点可以通过**路径**来标识，结构图如下：

![alt](https://pic4.zhimg.com/v2-787d82f1f9b7a9a1db8f08aa932058fb_r.jpg)

那 ZooKeeper 这颗 "树" 有什么特点呢？？ZooKeeper 的节点我们称之为 **Znode**，Znode 分为**两种**类型：

- **短暂 / 临时 (Ephemeral)**：当客户端和服务端断开连接后，所创建的 Znode(节点) **会自动删除**

- **持久 (Persistent)**：当客户端和服务端断开连接后，所创建的 Znode(节点) **不会删除**

> ZooKeeper 和 Redis 一样，也是 C/S 结构 (分成客户端和服务端)

![alt](https://pic3.zhimg.com/v2-ddc7da9fd715c0906f38c5989e11118e_r.jpg)

### 2.1 监听器

在上面我们已经简单知道了 ZooKeeper 的数据结构了，ZooKeeper 还配合了**监听器**才能够做那么多事的。

**常见**的监听场景有以下两项：

- 监听 Znode 节点的**数据变化**

- 监听子节点的**增减变化**

![alt](https://pic3.zhimg.com/v2-d88bb8f393873725519b40f2f1e53246_r.jpg)![alt](https://pic1.zhimg.com/v2-8250e2c7d6873378a8780d9c03f46e9c_r.jpg)

==没错，通过 **监听 + Znode 节点 (持久 / 短暂)** ，ZooKeeper 就可以玩出这么多花样了。==

## ZooKeeper 是怎么做到的

下面我们来看看用 ZooKeeper 怎么来做：统一配置管理、统一命名服务、分布式锁、集群管理。

### 3.1 统一配置管理

比如我们现在有三个系统 A、B、C，他们有三份配置，分别是`ASystem.yml、BSystem.yml、CSystem.yml`，然后，这三份配置又非常类似，很多的配置项几乎都一样。

此时，如果我们要改变其中一份配置项的信息，很可能其他两份都要改。并且，改变了配置项的信息**很可能就要重启系统**

于是，我们希望把`ASystem.yml、BSystem.yml、CSystem.yml`相同的配置项抽取出来成一份**公用**的配置`common.yml`，并且即便`common.yml`改了，也不需要系统 A、B、C 重启。

![alt](https://pic1.zhimg.com/v2-2dfe4bb28b448c3a623deeda2cabecd8_r.jpg)

做法：我们可以将`common.yml`这份配置放在 ZooKeeper 的 Znode 节点中，系统 A、B、C 监听着这个 Znode 节点有无变更，如果变更了，**及时**响应。

![alt](https://pic4.zhimg.com/v2-40a7b398992105e1b278fca39ba1338b_r.jpg)

参考资料：

- 基于 zookeeper 实现统一配置管理

- [https://blog.csdn.net/u011320740/article/details/78742625](https://link.zhihu.com/?target=https%3A//blog.csdn.net/u011320740/article/details/78742625)

### 3.2 统一命名服务

统一命名服务的理解其实跟**域名**一样，是我们为这某一部分的资源给它**取一个名字**，别人通过这个名字就可以拿到对应的资源。

比如说，现在我有一个域名`www.java3y.com`，但我这个域名下有多台机器：

- 192.168.1.1
- 192.168.1.2
- 192.168.1.3
- 192.168.1.4

别人访问`www.java3y.com`即可访问到我的机器，而不是通过 IP 去访问。

![alt](https://pic3.zhimg.com/v2-4b86e886479dc91b9527f46fe125e45a_r.jpg)

### 3.3 分布式锁

锁的概念在这我就不说了，如果对锁概念还不太了解的同学，可参考下面的文章

- [Java 锁？分布式锁？乐观锁？行锁？](https://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/s%3F__biz%3DMzI4Njg5MDA5NA%3D%3D%26mid%3D2247484989%26idx%3D1%26sn%3D7beaa0db8b29cc8758c7846fe04dfbd2%26chksm%3Debd7473cdca0ce2a7aea8e6e2a22a5c183b8be3f1cdc93f8d7c3842a560eb5668071cebe5e37%26token%3D948022247%26lang%3Dzh_CN%23rd)

我们可以使用 ZooKeeper 来实现分布式锁，那是怎么做的呢？？下面来看看：

系统 A、B、C 都去访问`/locks`节点

![alt](https://pic4.zhimg.com/v2-4d762a6ece13303b72f33b46a15f0097_r.jpg)

访问的时候会创建**带顺序号的临时 / 短暂** (`EPHEMERAL_SEQUENTIAL`) 节点，比如，系统 A 创建了`id_000000`节点，系统 B 创建了`id_000002`节点，系统 C 创建了`id_000001`节点。

![alt](https://pic3.zhimg.com/v2-338b221850de334723018c9164804576_r.jpg)

接着，拿到`/locks`节点下的所有子节点 (id_000000,id_000001,id_000002)，**判断自己创建的是不是最小的那个节点**

- 如果是，则拿到锁。

- 释放锁：执行完操作后，把创建的节点给删掉

- 如果不是，则监听比自己要小 1 的节点变化

举个例子：

- 系统 A 拿到`/locks`节点下的所有子节点，经过比较，发现自己 (`id_000000`)，是所有子节点最小的。所以得到锁
- 系统 B 拿到`/locks`节点下的所有子节点，经过比较，发现自己 (`id_000002`)，不是所有子节点最小的。所以监听比自己小 1 的节点`id_000001`的状态
- 系统 C 拿到`/locks`节点下的所有子节点，经过比较，发现自己 (`id_000001`)，不是所有子节点最小的。所以监听比自己小 1 的节点`id_000000`的状态

- …...

- 等到系统 A 执行完操作以后，将自己创建的节点删除 (`id_000000`)。通过监听，系统 C 发现`id_000000`节点已经删除了，发现自己已经是最小的节点了，于是顺利拿到锁
- …. 系统 B 如上

### 3.4 集群状态

经过上面几个例子，我相信大家也很容易想到 ZooKeeper 是怎么 " **感知** " 节点的动态新增或者删除的了。

还是以我们三个系统 A、B、C 为例，在 ZooKeeper 中创建**临时节点**即可：

![alt](https://pic1.zhimg.com/v2-64f633e7f829b5daeedf5e4d116972bc_r.jpg)

只要系统 A 挂了，那`/groupMember/A`这个节点就会删除，通过**监听**`groupMember`下的子节点，系统 B 和 C 就能够感知到系统 A 已经挂了。(新增也是同理)

除了能够感知节点的上下线变化，ZooKeeper 还可以实现**动态选举 Master** 的功能。(如果集群是主从架构模式下)

原理也很简单，如果想要实现动态选举 Master 的功能，Znode 节点的类型是带**顺序号的临时节点** (`EPHEMERAL_SEQUENTIAL`) 就好了。

Zookeeper 会每次选举最小编号的作为 Master，如果 Master 挂了，自然对应的 Znode 节点就会删除。然后让**新的最小编号作为 Master**，这样就可以实现动态选举的功能了。

## 最后

这篇文章主要讲解了 ZooKeeper 的入门相关的知识，ZooKeeper 通过 **Znode 的节点类型 + 监听机制**就实现那么多好用的功能了！

当然了，ZooKeeper 要考虑的事没那么简单的，后面有机会深入的话，我还会继续分享，希望这篇文章对大家有所帮助~

参考资料：

- [分布式服务框架 Zookeeper](https://www.ibm.com/developerworks/cn/opensource/os-cn-zookeeper/index.html)

- [ZooKeeper 初识整理 (老酒装新瓶)](https://link.zhihu.com/?target=https%3A//lxkaka.wang/2017/12/21/zookeeper/)

- [ZooKeeper](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/sunshine-long/p/9057191.html)

- [ZooKeeper 的应用场景](https://zhuanlan.zhihu.com/p/59669985)
