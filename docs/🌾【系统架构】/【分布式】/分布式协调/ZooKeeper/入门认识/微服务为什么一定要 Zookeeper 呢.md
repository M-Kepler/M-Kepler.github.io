- [一、背景](#一背景)
- [二、Zookeeper 的特性](#二zookeeper-的特性)
  - [1. 树状目录结构](#1-树状目录结构)
  - [2. 持久节点 (Persistent)](#2-持久节点-persistent)
  - [3. 持久有序节点 (Persistent_sequential)](#3-持久有序节点-persistent_sequential)
  - [4. 临时节点 (Ephemeral)](#4-临时节点-ephemeral)
  - [5. 临时有序节点 (Ephemeral_sequential)](#5-临时有序节点-ephemeral_sequential)
  - [6. 节点监听 (Wacher)](#6-节点监听-wacher)
- [三、微服务中应用场景](#三微服务中应用场景)
  - [1. 分布式锁](#1-分布式锁)
  - [2. 服务注册与发现](#2-服务注册与发现)
  - [2.1 背景](#21-背景)
  - [2.2 服务注册原理](#22-服务注册原理)
  - [2.3 服务动态发现原理](#23-服务动态发现原理)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/102762433)

## 一、背景

了解微服务的小伙伴都应该知道 Zookeeper，ZooKeeper 是一个分布式的, 开源的分布式应用程序协调服务。现在比较流行的微服务框架 Dubbo、Spring Cloud 都可以使用 Zookeeper 作为服务发现与组册中心。但是，为什么 Zookeeper 就能实现服务发现与注册呢？

## 二、Zookeeper 的特性

我们先来了解一下 Zookeeper 的特性吧，因为它的特性决定了它的使用场景。

### 1. 树状目录结构

![](https://pic4.zhimg.com/v2-5cd8da2d38b6a67384ee7856dcb66d37_r.jpg)

如上图，Zookeeper 是一个树状的文件目录结构，有点像 Linux 系统中的文件系统的概念。每个子目录（如 App）被称为 znode，我们可以对每个 znode 进行增删改查。

是否持久、是否有序 这两个属性进行排列组合可以得到四种节点类型：

### 2. 持久节点 (Persistent)

![](https://pic1.zhimg.com/v2-7bf7e4e06914c75f91d30e7c6f034f90_r.jpg)

客户端与 zookeeper 服务端断开连接后，该节点仍然存在。

### 3. 持久有序节点 (Persistent_sequential)

在持久节点基础上，由 zookeeper 给该节点名称进行有序编号，如 0000001，0000002。

### 4. 临时节点 (Ephemeral)

![](https://pic4.zhimg.com/v2-c884c2f8c6c246dc8b37502422d27903_r.jpg)

客户端与 zookeeper 服务端断开连接后，该节点被删除。临时节点下，不存在子节点。

### 5. 临时有序节点 (Ephemeral_sequential)

在临时节点基础上，由 zookeeper 给该节点名称进行有序编号，如 0000001，0000002。

### 6. 节点监听 (Wacher)

![](https://pic4.zhimg.com/v2-9f78aa11ab737fdb7ab9aaa410d0939b_r.jpg)

客户端 2 注册监听它关心的临时节点 SubApp1 的变化，

当临时节点 SubApp1 发生变化时（如图中被删除的时候），zookeeper 会通知客户端 2。

该机制是 zookeeper 实现分布式协调的重要特性。

我们可以通过 get，exists，getchildren 三种方式对某个节点进行监听。但是该事件只会通知一次。

## 三、微服务中应用场景

### 1. 分布式锁

分布式锁主要解决不同进程中的资源同步问题。大家可以联想一下单进程中的多线程共享资源的情况，线程需要访问共享资源，首先要获得锁，操作完共享资源后便释放锁。分布式中，上述的锁就变成了分布式锁了。那这个分布式锁又是如何实现呢？

> 感觉就像排队一样，谁在队头谁就拿到锁

![](https://pic4.zhimg.com/v2-fd72c2832307e3ef1d24ac4da20ed11f_r.jpg)

步骤 1:

如图，根据 zookeeper 有序临时节点的特性，每个进程对应连接一个有序临时节点（进程 1 对应节点 /znode/00000001，进程 2 对应节点 /znode/00000002… 如此类推）。

**每个进程监听对应的上一个节点的变化。编号最小的节点对应的进程获得锁，可以操作资源。**

![](https://pic3.zhimg.com/v2-4d25785b34fbddebf1a225962f88c232_r.jpg)

步骤 2:

**当进程 1 完成业务后，删除对应的子节点 /znode/00000001，释放锁。**

此时，编号最小的锁便获得锁（即 /znode/00000002 对应进程）。

重复以上步骤，保证了多个进程获取的是同一个锁，且只有一个进程能获得锁，就是 zookeeper 分布式锁的实现原理。

### 2. 服务注册与发现

### 2.1 背景

![](https://pic1.zhimg.com/v2-d3f3ed201c52ee0d2ddb1f74329356a4_r.jpg)

在微服务中，服务提供方把服务注册到 zookeeper 中心；

如图中的 Member 服务向 zookeeper 注册自己的服务信息，信息变动时会推送给订阅了该信息的 order 服务，order 服务根据最新的服务信息，向 member 服务发起调用。你可以把 zookeeper 当成一个 order 和 member 服务都可以访问的配置文件就清楚了。

但是每个应用可能拆分成多个服务对应不同的 Ip 地址，zookeeper 注册中心可以动态感知到服务节点的变化。

服务消费方（Order 服务）需要调用提供方（Member 服务）提供的服务时，从 zookeeper 中获取提供方的调用地址列表，然后进行调用。这个过程称为服务的订阅。

### 2.2 服务注册原理

![](https://pic4.zhimg.com/v2-fa03bea8f706ed151cc4786b56d86df3_r.jpg)

rpc 框架会在 zookeeper 的注册目录下，为每个应用创建一个持久节点，如 order 应用创建 order 持久节点，member 应用创建 member 持久节点。然后在对应的持久节点下，为每个微服务创建一个临时节点，记录每个服务的 URL 等信息。

### 2.3 服务动态发现原理

![](https://pic2.zhimg.com/v2-a653c18c4f661f995c38b61041a014c5_r.jpg)

由于服务消费方向 zookeeper 订阅了（监听）服务提供方，一旦服务提供方有变动的时候（增加服务或者减少服务），zookeeper 就会把最新的服务提供方列表（member list）推送给服务消费方，这就是服务动态发现的原理。
