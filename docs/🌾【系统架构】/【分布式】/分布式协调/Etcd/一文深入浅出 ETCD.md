- [一、概述](#一概述)
- [**1.1 etcd 简介**](#11-etcd-简介)
  - [**1.2 发展历史**](#12-发展历史)
  - [**1.3 etcd 的特点**](#13-etcd-的特点)
  - [**1.4 概念术语**](#14-概念术语)
  - [**1.5 数据读写顺序**](#15-数据读写顺序)
  - [**1.6 Leader 选举**](#16-leader-选举)
  - [**1.7 判断数据是否写入**](#17-判断数据是否写入)
- [二 etcd 架构及解析](#二-etcd-架构及解析)
  - [**2.1 架构图**](#21-架构图)
  - [**2.2 架构解析**](#22-架构解析)
- [三 应用场景](#三-应用场景)
  - [**3.1 服务注册与发现**](#31-服务注册与发现)
  - [**3.2 消息发布与订阅**](#32-消息发布与订阅)
  - [**3.3 负载均衡**](#33-负载均衡)
  - [**3.4 分部署通知与协调**](#34-分部署通知与协调)
  - [**3.5 分布式锁**](#35-分布式锁)
  - [**3.6 分布式队列**](#36-分布式队列)
  - [**3.7 集群与监控与 Leader 选举**](#37-集群与监控与-leader-选举)
- [四 安装部署](#四-安装部署)
  - [**4.1 单机部署**](#41-单机部署)
  - [**4.2.1 主机信息**](#421-主机信息)
  - [**4.2.2 host 配置**](#422-host-配置)
  - [**4.2.3 etcd 安装**](#423-etcd-安装)
- [五 简单使用](#五-简单使用)
  - [**5.1 增加**](#51-增加)
  - [**5.5 watch**](#55-watch)
  - [**5.6 备份**](#56-备份)
- [六 总结](#六-总结)
- [参考链接](#参考链接)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/d_usTF2hxEilXIv9fIgURg?utm_source=tuicool&utm_medium=referral)

# 一、概述

> 背景：近期 k8s 应用中 etcd 的功能存在一些困惑，对其进行来单独的学习，能更深入理解 k8s 中的的一些特性。

# **1.1 etcd 简介**

etcd 是 CoreOS 团队于 2013 年 6 月发起的开源项目，它的目标是构建一个高可用的分布式键值 (key-value) 数据库。etcd 内部采用`raft`协议作为一致性算法，etcd 基于 Go 语言实现。

## **1.2 发展历史**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKVah0skGdAQCZpFXODzd6Y1Jt4QQD9nqrxqFXFiaQeTCuCykSrAV0RSQ/640?wx_fmt=jpeg)

## **1.3 etcd 的特点**

- 简单：安装配置简单，而且提供了 HTTP API 进行交互，使用也很简单

- 安全：支持 SSL 证书验证

- 快速：根据官方提供的 benchmark 数据，单实例支持每秒 2k + 读操作

- 可靠：采用 raft 算法，实现分布式系统数据的可用性和一致性

## **1.4 概念术语**

- Raft：etcd 所采用的保证分布式系统强一致性的算法。

- Node：一个 Raft 状态机实例。

- Member：一个 etcd 实例。它管理着一个 Node，并且可以为客户端请求提供服务。

- Cluster：由多个 Member 构成可以协同工作的 etcd 集群。

- Peer：对同一个 etcd 集群中另外一个 Member 的称呼。

- Client：向 etcd 集群发送 HTTP 请求的客户端。

- WAL：预写式日志，etcd 用于持久化存储的日志格式。

- snapshot：etcd 防止 WAL 文件过多而设置的快照，存储 etcd 数据状态。

- Proxy：etcd 的一种模式，为 etcd 集群提供反向代理服务。

- Leader：Raft 算法中通过竞选而产生的处理所有数据提交的节点。

- Follower：竞选失败的节点作为 Raft 中的从属节点，为算法提供强一致性保证。

- Candidate：当 Follower 超过一定时间接收不到 Leader 的心跳时转变为 Candidate 开始竞选。

- Term：某个节点成为 Leader 到下一次竞选时间，称为一个 Term。

- Index：数据项编号。Raft 中通过 Term 和 Index 来定位数据。

## **1.5 数据读写顺序**

为了保证数据的强一致性，etcd 集群中所有的数据流向都是一个方向，从 Leader （主节点）流向 Follower，也就是所有 Follower 的数据必须与 Leader 保持一致，如果不一致会被覆盖。

用户对于 etcd 集群所有节点进行读写

- 读取：由于集群所有节点数据是强一致性的，读取可以从集群中随便哪个节点进行读取数据

- 写入：etcd 集群有 leader，如果写入往 leader 写入，可以直接写入，然后然后 Leader 节点会把写入分发给所有 Follower，如果往 follower 写入，然后 Leader 节点会把写入分发给所有 Follower

## **1.6 Leader 选举**

假设三个节点的集群，三个节点上均运行 Timer（每个 Timer 持续时间是随机的），Raft 算法使用随机 Timer 来初始化 Leader 选举流程，第一个节点率先完成了 Timer，随后它就会向其他两个节点发送成为 Leader 的请求，其他节点接收到请求后会以投票回应然后第一个节点被选举为 Leader。

成为 Leader 后，该节点会以固定时间间隔向其他节点发送通知，确保自己仍是 Leader。有些情况下当 Follower 们收不到 Leader 的通知后，比如说 Leader 节点宕机或者失去了连接，其他节点会重复之前选举过程选举出新的 Leader。

## **1.7 判断数据是否写入**

etcd 认为写入请求被 Leader 节点处理并分发给了多数节点后，就是一个成功的写入。那么多少节点如何判定呢，假设总结点数是 N，那么多数节点 `Quorum=N/2+1`。关于如何确定 etcd 集群应该有多少个节点的问题，上图的左侧的图表给出了集群中节点总数 (Instances) 对应的 Quorum 数量，用 Instances 减去 Quorom 就是集群中容错节点（允许出故障的节点）的数量。

所以在集群中推荐的最少节点数量是 3 个，因为 1 和 2 个节点的容错节点数都是 0，一旦有一个节点宕掉整个集群就不能正常工作了。

# 二 etcd 架构及解析

## **2.1 架构图**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKP63uoz3GzaukXAxWbTp66d0ibVROOlHNn4HU8qxicThmdDgp7ntZtdicA/640?wx_fmt=jpeg)

## **2.2 架构解析**

从 etcd 的架构图中我们可以看到，etcd 主要分为四个部分。

- HTTP Server：用于处理用户发送的 API 请求以及其它 etcd 节点的同步与心跳信息请求。

- Store：用于处理 etcd 支持的各类功能的事务，包括数据索引、节点状态变更、监控与反馈、事件处理与执行等等，是 etcd 对用户提供的大多数 API 功能的具体实现。

- Raft：Raft 强一致性算法的具体实现，是 etcd 的核心。

- WAL：Write Ahead Log（预写式日志），是 etcd 的数据存储方式。除了在内存中存有所有数据的状态以及节点的索引以外，etcd 就通过 WAL 进行持久化存储。WAL 中，所有的数据提交前都会事先记录日志。

- Snapshot 是为了防止数据过多而进行的状态快照；

- Entry 表示存储的具体日志内容。

通常，一个用户的请求发送过来，会经由 HTTP Server 转发给 Store 进行具体的事务处理，如果涉及到节点的修改，则交给 Raft 模块进行状态的变更、日志的记录，然后再同步给别的 etcd 节点以确认数据提交，最后进行数据的提交，再次同步。

# 三 应用场景

## **3.1 服务注册与发现**

etcd 可以用于服务的注册与发现

- 前后端业务注册发现

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKgw55ayYicer2jMHYsb9nMpzwO3sODOjIibCD5zZciajgRic2xEG4ZLw8Uw/640?wx_fmt=jpeg)

中间价已经后端服务在 etcd 中注册，前端和中间价可以很轻松的从 etcd 中发现相关服务器然后服务器之间根据调用关系相关绑定调用

- 多组后端服务器注册发现

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKatbFlCtrEdeF8IUibdMXHiasKDibsn16qlR0riaL0LdCkyjpJQbcQfu60w/640?wx_fmt=jpeg)

后端多个无状态相同副本的 app 可以同事注册到 etcd 中，前端可以通过 haproxy 从 etcd 中获取到后端的 ip 和端口组，然后进行请求转发，可以用来故障转移屏蔽后端端口已经后端多组 app 实例。

## **3.2 消息发布与订阅**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKFJeDW0y8Wsic6zdNiaPRiaZFO58q7W7Vlx19W6ZWI3KRxAD96VnpRibicLQ/640?wx_fmt=jpeg)

etcd 可以充当消息中间件，生产者可以往 etcd 中注册 topic 并发送消息，消费者从 etcd 中订阅 topic，来获取生产者发送至 etcd 中的消息。

## **3.3 负载均衡**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKraePxicbdichngIguWBZtSZGHR1vCk9wc2icatflqIkr9TQqfWgQnic08g/640?wx_fmt=jpeg)

后端多组相同的服务提供者可以经自己服务注册到 etcd 中，etcd 并且会与注册的服务进行监控检查，服务请求这首先从 etcd 中获取到可用的服务提供者真正的 ip:port，然后对此多组服务发送请求，etcd 在其中充当了负载均衡的功能

## **3.4 分部署通知与协调**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKnibTibHnBicPianyhg0oEehAwQPcK91ciaSCQqcqImDesOYUvnU0YbAXsTw/640?wx_fmt=jpeg)

- 当 etcd watch 服务发现丢失，会通知服务检查

- 控制器向 etcd 发送启动服务，etcd 通知服务进行相应操作

- 当服务完成 work 会讲状态更新至 etcd，etcd 对应会通知用户

## **3.5 分布式锁**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgK63XrZKjOMCMBJthEcc2IctL0WhrIqkeHfMhfiacSic84Myia5SDj3IAgg/640?wx_fmt=jpeg)

当有多个竞争者 node 节点，etcd 作为总控，在分布式集群中与一个节点成功分配 lock

## **3.6 分布式队列**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKfxJ7VO6EuRn6oxnpZ9Nsz1Lia3AH06e6zlHjbzfYmKjl8R1U0pn5RBQ/640?wx_fmt=jpeg)

有对个 node，etcd 根据每个 node 来创建对应 node 的队列，根据不同的队列可以在 etcd 中找到对应的 competitor

## **3.7 集群与监控与 Leader 选举**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKO5pVNEdO4jvvlkibJQ6OVbgJsYkyKLibLrlrqweOIpz9fiaRoRjlTkRRg/640?wx_fmt=jpeg)

etcd 可以根据 raft 算法在多个 node 节点来选举出 leader

# 四 安装部署

## **4.1 单机部署**

可以使用二进制或源码下载安装，但是危害需要自己写配置文件，如何要启动需要自己写服务启动文件，推荐使用 yum 安装方式

```sh
hostnamectl set-hostname etcd-1

wget http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpmrpm -ivh epel-release-latest-7.noarch.rpm

# yum 仓库中的etcd版本为3.3.11，如果需要最新版本的etcd可以进行二进制安装yum -y install etcd

systemctl enable etcd

```

可以查看 yum 安装的 etcd 的有效配置文件，根据自己的需求来修改数据存储目录，已经监听端口 url/etcd 的名称等

- etcd 默认将数据存放到当前路径的 `default.etcd/` 目录下

- 在 `http://localhost:2380` 和集群中其他节点通信

- 在 `http://localhost:2379` 提供 HTTP API 服务，供客户端交互

- 该节点的名称默认为 `default`

- heartbeat 为 100ms，后面会说明这个配置的作用

- election 为 1000ms，后面会说明这个配置的作用

- snapshot count 为 10000，后面会说明这个配置的作用

- 集群和每个节点都会生成一个 uuid

- 启动的时候，会运行 raft，选举出 leader

```
[root@VM_0_8_centos tmp]# grep -Ev "^#|^$" /etc/etcd/etcd.confETCD_DATA_DIR="/var/lib/etcd/default.etcd"ETCD_LISTEN_CLIENT_URLS="http://localhost:2379"ETCD_[root@VM_0_8_centos tmp]# systemctl status etcd复制代码
```

```
cat >> /etc/hosts << EOF
172.16.0.8 etcd-0-8
172.16.0.14 etcd-0-14
172.16.0.17 etcd-0-17
EOF
```

```
wget http://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
rpm -ivh epel-release-latest-7.noarch.rpm
yum -y install etcd
systemctl enable etcdmkdir -p /data/app/etcd/chown etcd:etcd /data/app/etcd/复制代码
```

集群部署最好部署奇数位，此能达到最好的集群容错

## **4.2.1 主机信息**

![](https://mmbiz.qpic.cn/mmbiz/sXiaukvjR0RBRULlsyDzyTrC3hz2YxtgKMRS5ibHQCO2WibnOB6n0Tsht2v5NZNYlFOvibCF9QAccaPwSJ8DhluF3Q/640?wx_fmt=jpeg)<table><thead><tr><th>主机名称</th><th>系统</th><th>IP 地址</th><th>部署组件</th></tr></thead><tbody><tr><td>etcd-0-8</td><td>CentOS 7.3</td><td>172.16.0.8</td><td>etcd</td></tr><tr><td>etcd-0-17</td><td>CentOS 7.3</td><td>172.16.0.17</td><td>etcd</td></tr><tr><td>etcd-0-14</td><td>CentOS 7.3</td><td>172.16.0.14</td><td>etcd</td></tr></tbody></table>

## **4.2.2 host 配置**

在此示例用三个节点来部署 etcd 集群，各节点修改 hosts

```
[root@etcd-0-8 app]# cat /etc/etcd/etcd.conf
#[Member]
#ETCD_CORS=""ETCD_DATA_DIR="/data/app/etcd/" # etcd数据存储目录，建议存储在数据盘
#ETCD_WAL_DIR=""ETCD_LISTEN_PEER_URLS="http://172.16.0.8:2380" # 与同伴的通讯地址，和其他节点同伴的通讯地址
ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://172.16.0.8:2379" # 对外提供服务的地址
#ETCD_MAX_SNAPSHOTS="5" # etcd最大快照保存数
#ETCD_MAX_WALS="5" # etcd 最大walsETCD_ # etcd节点名称，集群内需要唯一
#ETCD_SNAPSHOT_COUNT="100000" # 指定有多少事务（transaction）被提交时，触发截取快照保存到磁盘
#ETCD_HEARTBEAT_INTERVAL="100" # leader 多久发送一次心跳到 followers。默认值是 100ms
#ETCD_ELECTION_TIMEOUT="1000" # 重新投票的超时时间，如果 follow 在该时间间隔没有收到心跳包，会触发重新投票，默认为 1000 ms
#ETCD_QUOTA_BACKEND_BYTES="0"
#ETCD_MAX_REQUEST_BYTES="1572864"
#ETCD_GRPC_KEEPALIVE_MIN_TIME="5s"
#ETCD_GRPC_KEEPALIVE_INTERVAL="2h0m0s"
#ETCD_GRPC_KEEPALIVE_TIMEOUT="20s"
##[Clustering]ETCD_INITIAL_ADVERTISE_PEER_URLS="http://172.16.0.8:2380" # 该节点同伴监听地址，这个值会告诉集群中其他节点
ETCD_ADVERTISE_CLIENT_URLS="http://127.0.0.1:2379,http://172.16.0.8:2379" # 对外公告的该节点客户端监听地址，这个值会告诉集群中其他节点
#ETCD_DISCOVERY=""
#ETCD_DISCOVERY_FALLBACK="proxy"
#ETCD_DISCOVERY_PROXY=""
#ETCD_DISCOVERY_SRV=""ETCD_INITIAL_CLUSTER="etcd-0-8=http://172.16.0.8:2380,etcd-0-17=http://172.16.0.17:2380,etcd-0-14=http://172.16.0.14:2380" # 集群中所有节点的信
ETCD_INITIAL_CLUSTER_TOKEN="etcd-token" # 创建集群的 token，这个值每个集群保持唯一。这样的话，如果你要重新创建集群，即使配置和之前一样，也会再次生成新的集群和节点 uuid；否则会导致多个集群之间的冲突，造成未知的错误
ETCD_INITIAL_CLUSTER_STATE="new"
#ETCD_STRICT_RECONFIG_CHECK="true"                   # 新建集群的时候，这个值为 new；假如已经存在的集群，这个值为 existing
#ETCD_ENABLE_V2="true"

##[Proxy]
#ETCD_PROXY="off"
#ETCD_PROXY_FAILURE_WAIT="5000"
#ETCD_PROXY_REFRESH_INTERVAL="30000"
#ETCD_PROXY_DIAL_TIMEOUT="1000"
#ETCD_PROXY_WRITE_TIMEOUT="5000"
#ETCD_PROXY_READ_TIMEOUT="0"

##[Security]
#ETCD_CERT_FILE=""
#ETCD_KEY_FILE=""
#ETCD_CLIENT_CERT_AUTH="false"
#ETCD_TRUSTED_CA_FILE=""
#ETCD_AUTO_TLS="false"
#ETCD_PEER_CERT_FILE=""
#ETCD_PEER_KEY_FILE=""
#ETCD_PEER_CLIENT_CERT_AUTH="false"
#ETCD_PEER_TRUSTED_CA_FILE=""
#ETCD_PEER_AUTO_TLS="false"

##[Logging]
#ETCD_DEBUG="false"
#ETCD_LOG_PACKAGE_LEVELS=""
#ETCD_LOG_OUTPUT="default"

##[Unsafe]
#ETCD_FORCE_NEW_CLUSTER="false"

##[Version]
#ETCD_VERSION="false"
#ETCD_AUTO_COMPACTION_RETENTION="0"

##[Profiling]
#ETCD_ENABLE_PPROF="false"
#ETCD_METRICS="basic"

##[Auth]
#ETCD_AUTH_TOKEN="simple"

etcd-0-8配置：

[root@etcd-server ~]# hostnamectl set-hostname etcd-0-8
[root@etcd-0-8 ~]# egrep "^#|^$" /etc/etcd/etcd.conf -vETCD_DATA_DIR="/data/app/etcd/"ETCD_LISTEN_PEER_URLS="http://172.16.0.8:2380"ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://172.16.0.8:2379"ETCD_复制代码

etcd-0-14配置：
[root@etcd-server ~]# hostnamectl set-hostname etcd-0-14
[root@etcd-server ~]# mkdir -p /data/app/etcd/[root@etcd-0.14 ~]# egrep "^#|^$" /etc/etcd/etcd.conf -vETCD_DATA_DIR="/data/app/etcd/"ETCD_LISTEN_PEER_URLS="http://172.16.0.14:2380"ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://172.16.0.14:2379"ETCD_复制代码

etcd-0-7配置:
[root@etcd-server ~]# hostnamectl set-hostname etcd-0-17
[root@etcd-server ~]# mkdir -p /data/app/etcd/[root@etcd-0-17 ~]# egrep "^#|^$" /etc/etcd/etcd.conf -vETCD_DATA_DIR="/data/app/etcd/"ETCD_LISTEN_PEER_URLS="http://172.16.0.17:2380"ETCD_LISTEN_CLIENT_URLS="http://127.0.0.1:2379,http://172.16.0.17:2379"ETCD_复制代码

```

```
systemctl start etcd
```

## **4.2.3 etcd 安装**

三个节点均安装 etcd

```sh
[root@etcd-0-8 default.etcd]# systemctl status etcd● etcd.service - Etcd Server
   Loaded: loaded (/usr/lib/systemd/system/etcd.service; enabled; vendor preset: disabled)   Active: active (running) since 二 2019-12-03 15:55:28 CST; 8s ago
 Main PID: 24510 (etcd)   CGroup: /system.slice/etcd.service
           └─24510 /usr/bin/etcd --name=etcd-0-8 --data-dir=/data/app/etcd/ --listen-client-urls=http://172.16.0.8:237912月 03 15:55:28 etcd-0-8 etcd[24510]: set the initial cluster version to 3.012月 03 15:55:28 etcd-0-8 etcd[24510]: enabled capabilities for version 3.012月 03 15:55:30 etcd-0-8 etcd[24510]: peer 56e0b6dad4c53d42 became active12月 03 15:55:30 etcd-0-8 etcd[24510]: established a TCP streaming connection with peer 56e0b6dad4c53d42 (stream Message reader)12月 03 15:55:30 etcd-0-8 etcd[24510]: established a TCP streaming connection with peer 56e0b6dad4c53d42 (stream Message writer)12月 03 15:55:30 etcd-0-8 etcd[24510]: established a TCP streaming connection with peer 56e0b6dad4c53d42 (stream MsgApp v2 reader)12月 03 15:55:30 etcd-0-8 etcd[24510]: established a TCP streaming connection with peer 56e0b6dad4c53d42 (stream MsgApp v2 writer)12月 03 15:55:32 etcd-0-8 etcd[24510]: updating the cluster version from 3.0 to 3.312月 03 15:55:32 etcd-0-8 etcd[24510]: updated the cluster version from 3.0 to 3.312月 03 15:55:32 etcd-0-8 etcd[24510]: enabled capabilities for version 3.3复制代码
```

```
[root@etcd-0-8 default.etcd]# netstat -lntup |grep etcdtcp        0      0 172.16.0.8:2379         0.0.0.0:*               LISTEN      25167/etcd
tcp        0      0 127.0.0.1:2379          0.0.0.0:*               LISTEN      25167/etcd
tcp        0      0 172.16.0.8:2380         0.0.0.0:*               LISTEN      25167/etcd复制代码
```

- etcd 默认配置文件

```
[root@etcd-0-8 default.etcd]# etcdctl member list2d2e457c6a1a76cb: name=etcd-0-8 peerURLs=http://172.16.0.8:2380 clientURLs=http://127.0.0.1:2379,http://172.16.0.8:2379 isLeader=false56e0b6dad4c53d42: name=etcd-0-14 peerURLs=http://172.16.0.14:2380 clientURLs=http://127.0.0.1:2379,http://172.16.0.14:2379 isLeader=trued2d2e9fc758e6790: name=etcd-0-17 peerURLs=http://172.16.0.17:2380 clientURLs=http://127.0.0.1:2379,http://172.16.0.17:2379 isLeader=false[root@etcd-0-8 ~]# etcdctl cluster-healthmember 2d2e457c6a1a76cb is healthy: got healthy result from http://127.0.0.1:2379member 56e0b6dad4c53d42 is healthy: got healthy result from http://127.0.0.1:2379member d2d2e9fc758e6790 is healthy: got healthy result from http://127.0.0.1:2379cluster is healthy复制代码
```

```
etcdctl set /testdir/testkey "Hello world"Hello world
```

```
etcdctl mk /testdir/testkey "Hello world"Hello world
```

```
etcdctl mk /testdir/testkey "Hello world"Error:  105: Key already exists (/testdir/testkey) [8]复制代码
```

```
etcdctl mkdir testdir2
```

```
$ etcdctl mkdir testdir2
Error:  105: Key already exists (/testdir2) [9]
```

- 查看 etcd 状态

```
etcdctl setdir testdir3
```

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为0)则永不超时。
```

```
etcdctl rm /testdir/testkeyPrevNode.Value: Hello
```

```
$ etcdctl rm /testdir/testkey
Error:  100: Key not found (/testdir/testkey) [7]
```

```
--dir 如果键是个空目录或者键值对则删除--recursive 删除目录和所有子键--with-value  检查现有的值是否匹配--with-index '0'检查现有的index是否匹配
```

```
etcdctl setdir dir1$ etcdctl rmdir dir1
```

```
etcdctl set /dir/testkey hihi$ etcdctl rmdir /dirError:  108: Directory not empty (/dir) [17]
```

```
etcdctl update /testdir/testkey "Hello"Hello
```

```
etcdctl update /testdir/testkey2 "Hello"Error:  100: Key not found (/testdir/testkey2) [6]
```

# 五 简单使用

## **5.1 增加**

- set

指定某个键的值。例如:

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为 0)则永不超时。
```

```
etcdctl updatedir testdir2
```

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为0)则永不超时。
```

```
etcdctl get /testdir/testkeyHello world
```

- mk

如果给定的键不存在，则创建一个新的键值。例如:

```
etcdctl get /testdir/testkey2Error:  100: Key not found (/testdir/testkey2) [5]复制代码
```

```
--sort 对结果进行排序--consistent 将请求发给主节点，保证获取内容的一致性。复制代码
```

```
$ etcdctl ls/testdir
/testdir2
/dir

$ etcdctl ls dir/dir/testkey
```

```
--sort 将输出结果排序--recursive 如果目录下有子目录，则递归输出其中的内容
-p 对于输出为目录，在最后添加/进行区分
```

```
etcdctl get /testdir/testkeyHello world$ etcdctl set /testdir/testkey "Hello watch"Hello watch$ etcdctl watch testdir/testkeyHello watch
```

```
--forever  一直监测直到用户按CTRL+C退出--after-index '0' 在指定index之前一直监测--recursive 返回所有的键值和子键值
```

```
etcdctl exec-watch testdir/testkey -- sh -c 'ls'config  Documentation  etcd  etcdctl  README-etcdctl.md  README.md  READMEv2-etcdctl.md复制代码
```

- mkdir

如果给定的键目录不存在，则创建一个新的键目录。例如：

```
--after-index '0' 在指定 index 之前一直监测
--recursive 返回所有的键值和子键值
```

```
etcdctl backup --data-dir /var/lib/etcd  --backup-dir /home/etcd_backup复制代码
```

```
--data-dir  etcd的数据目录
--backup-dir 备份到指定路径复制代码
```

```
$ etcdctl member list
8e9e05c52164694d: name=dev-master-01 peerURLs=http://localhost:2380 clientURLs=http://localhost:2379 isLeader=true
```

```
$ etcdctl member remove 8e9e05c52164694d
Removed member 8e9e05c52164694d from cluste
```

```
etcdctl member add etcd3 http://192.168.1.100:2380Added member named etcd3 with ID 8e9e05c52164694d to cluster
```

```
# 设置一个key值[root@etcd-0-8 ~]# etcdctl set /msg "hello k8s"hello k8s# 获取key的值[root@etcd-0-8 ~]# etcdctl get /msghello k8s# 获取key值的详细信息[root@etcd-0-8 ~]# etcdctl -o extended get /msgKey: /msg
Created-Index: 12
Modified-Index: 12
TTL: 0
Index: 12

hello k8s# 获取不存在的key回报错[root@etcd-0-8 ~]# etcdctl get /xxzxError:  100: Key not found (/xxzx) [12]# 设置key的ttl，过期后会被自动删除[root@etcd-0-8 ~]# etcdctl set /testkey "tmp key test" --ttl 5tmp key test[root@etcd-0-8 ~]# etcdctl get /testkeyError:  100: Key not found (/testkey) [14]# key 替换操作[root@etcd-0-8 ~]# etcdctl get /msghello k8s[root@etcd-0-8 ~]# etcdctl set --swap-with-value "hello k8s" /msg "goodbye"goodbye[root@etcd-0-8 ~]# etcdctl get /msggoodbye# mk 仅当key不存在时创建(set对同一个key会覆盖)[root@etcd-0-8 ~]# etcdctl get /msggoodbye[root@etcd-0-8 ~]# etcdctl mk /msg "mktest"Error:  105: Key already exists (/msg) [18][root@etcd-0-8 ~]# etcdctl mk /msg1 "mktest"mktest# 创建自排序的key[root@etcd-0-8 ~]# etcdctl mk --in-order /queue s1s1[root@etcd-0-8 ~]# etcdctl mk --in-order /queue s2s2[root@etcd-0-8 ~]# etcdctl ls --sort /queue/queue/00000000000000000021
/queue/00000000000000000022[root@etcd-0-8 ~]# etcdctl get /queue/00000000000000000021s1# 更新key值[root@etcd-0-8 ~]# etcdctl update /msg1 "update test"update test[root@etcd-0-8 ~]# etcdctl get /msg1update test# 更新key的ttl及值[root@etcd-0-8 ~]# etcdctl update --ttl 5 /msg "aaa"aaa# 创建目录[root@etcd-0-8 ~]# etcdctl mkdir /testdir# 删除空目录[root@etcd-0-8 ~]# etcdctl mkdir /test1[root@etcd-0-8 ~]# etcdctl rmdir /test1# 删除非空目录[root@etcd-0-8 ~]# etcdctl get /testdir/testdir: is a directory[root@etcd-0-8 ~]#[root@etcd-0-8 ~]# etcdctl rm --recursive /testdir# 列出目录内容[root@etcd-0-8 ~]# etcdctl ls //tmp
/msg1
/queue[root@etcd-0-8 ~]# etcdctl ls /tmp/tmp/a
/tmp/b# 递归列出目录的内容[root@etcd-0-8 ~]# etcdctl ls --recursive //msg1
/queue
/queue/00000000000000000021
/queue/00000000000000000022
/tmp
/tmp/b
/tmp/a# 监听key，当key发生改变的时候打印出变化[root@etcd-0-8 ~]# etcdctl watch /msg1xxx[root@VM_0_17_centos ~]# etcdctl update /msg1 "xxx"xxx# 监听某个目录，当目录中任何 node 改变的时候，都会打印出来[root@etcd-0-8 ~]# etcdctl watch --recursive /[update] /msg1
xxx[root@VM_0_17_centos ~]# etcdctl update /msg1 "xxx"xxx# 一直监听，除非 `CTL + C` 导致退出监听[root@etcd-0-8 ~]# etcdctl watch --forever /# 监听目录，当发生变化时执行一条命令[root@etcd-0-8 ~]# etcdctl exec-watch --recursive / -- sh -c "echo change"change# backup[root@etcd-0-14 ~]# etcdctl backup --data-dir /data/app/etcd --backup-dir /root/etcd_backup2019-12-04 10:25:16.113237 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113268 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113272 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113293 I | ignoring member attribute update on /0/members/2d2e457c6a1a76cb/attributes
2019-12-04 10:25:16.113299 I | ignoring member attribute update on /0/members/d2d2e9fc758e6790/attributes
2019-12-04 10:25:16.113305 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes
2019-12-04 10:25:16.113310 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes
2019-12-04 10:25:16.113314 I | ignoring member attribute update on /0/members/2d2e457c6a1a76cb/attributes
2019-12-04 10:25:16.113319 I | ignoring member attribute update on /0/members/d2d2e9fc758e6790/attributes
2019-12-04 10:25:16.113384 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes# 使用v3版本

# 使用v3版本
[root@etcd-0-14 ~]# export ETCDCTL_API=3
[root@etcd-0-14 ~]# etcdctl --endpoints="http://172.16.0.8:2379,http://172.16.0.14:2379,http://172.16.0.17:2379" snapshot save mysnapshot.db
Snapshot saved at mysnapshot.db
[root@etcd-0-14 ~]# etcdctl snapshot status mysnapshot.db -w json
{"hash":928285884,"revision":0,"totalKey":5,"totalSize":20480}
```

- setdir

创建一个键目录。如果目录不存在就创建，如果目录存在更新目录 TTL。

支持的选项为:

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为0)则永不超时。
```

```
5.2 删除
```

- rm

删除某个键值。例如:

```
etcdctl rm /testdir/testkeyPrevNode.Value: Hello
```

```
当键不存在时，则会报错。例如:
```

支持的选项为：

```
--dir 如果键是个空目录或者键值对则删除--recursive 删除目录和所有子键--with-value  检查现有的值是否匹配--with-index '0'检查现有的index是否匹配
```

```
rmdir
```

删除一个空目录，或者键值对。

```
etcdctl setdir dir1$ etcdctl rmdir dir1
```

```
若目录不空，会报错:
```

```
etcdctl set /dir/testkey hihi$ etcdctl rmdir /dirError:  108: Directory not empty (/dir) [17]
```

```
5.3 更新
```

- update

当键存在时，更新值内容。例如：

```
etcdctl update /testdir/testkey "Hello"Hello
```

```
当键不存在时，则会报错。例如:
```

```
etcdctl update /testdir/testkey2 "Hello"Error:  100: Key not found (/testdir/testkey2) [6]
```

```
支持的选项为:
```

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为 0)则永不超时。
```

```
updatedir
```

更新一个已经存在的目录。

```
etcdctl updatedir testdir2
```

```
支持的选项为:
```

```
--ttl '0' 超时时间(单位为秒)，不配置(默认为0)则永不超时。
```

```
5.4 查询
```

- get

获取指定键的值。例如：

```
etcdctl get /testdir/testkeyHello world
```

```
当键不存在时，则会报错。例如：
```

```
etcdctl get /testdir/testkey2Error:  100: Key not found (/testdir/testkey2) [5]复制代码
```

```
支持的选项为:
```

```
--sort 对结果进行排序--consistent 将请求发给主节点，保证获取内容的一致性。复制代码
```

```
ls
```

列出目录 (默认为根目录) 下的键或者子目录，默认不显示子目录中内容。

例如：

支持的选项包括:

## **5.5 watch**

- watch

监测一个键值的变化，一旦键值发生更新，就会输出最新的值并退出。

例如: 用户更新 testkey 键值为 Hello watch。

```
etcdctl get /testdir/testkeyHello world$ etcdctl set /testdir/testkey "Hello watch"Hello watch$ etcdctl watch testdir/testkeyHello watch
```

```
支持的选项包括:
```

```
--forever  一直监测直到用户按CTRL+C退出--after-index '0' 在指定index之前一直监测--recursive 返回所有的键值和子键值
```

```
exec-watch
```

监测一个键值的变化，一旦键值发生更新，就执行给定命令。

例如：用户更新 testkey 键值。

```
etcdctl exec-watch testdir/testkey -- sh -c 'ls'config  Documentation  etcd  etcdctl  README-etcdctl.md  README.md  READMEv2-etcdctl.md复制代码
```

```
支持的选项包括:
```

## **5.6 备份**

备份 etcd 的数据。

```
etcdctl backup --data-dir /var/lib/etcd  --backup-dir /home/etcd_backup复制代码
```

```
支持的选项包括:
```

```
--data-dir  etcd的数据目录
--backup-dir 备份到指定路径复制代码
```

```
5.7 member
```

通过`list`、`add`、`remove`命令列出、添加、删除 etcd 实例到 etcd 集群中。

查看集群中存在的节点

```
$ etcdctl member list
8e9e05c52164694d: name=dev-master-01 peerURLs=http://localhost:2380 clientURLs=http://localhost:2379 isLeader=true
```

```
删除集群中存在的节点
```

```
$ etcdctl member remove 8e9e05c52164694d
Removed member 8e9e05c52164694d from cluste
```

```
向集群中新加节点
```

```
etcdctl member add etcd3 http://192.168.1.100:2380Added member named etcd3 with ID 8e9e05c52164694d to cluster
```

```
示例
```

```
# 设置一个key值[root@etcd-0-8 ~]# etcdctl set /msg "hello k8s"hello k8s# 获取key的值[root@etcd-0-8 ~]# etcdctl get /msghello k8s# 获取key值的详细信息[root@etcd-0-8 ~]# etcdctl -o extended get /msgKey: /msg
Created-Index: 12
Modified-Index: 12
TTL: 0
Index: 12
hello k8s# 获取不存在的key回报错[root@etcd-0-8 ~]# etcdctl get /xxzxError:  100: Key not found (/xxzx) [12]# 设置key的ttl，过期后会被自动删除[root@etcd-0-8 ~]# etcdctl set /testkey "tmp key test" --ttl 5tmp key test[root@etcd-0-8 ~]# etcdctl get /testkeyError:  100: Key not found (/testkey) [14]# key 替换操作[root@etcd-0-8 ~]# etcdctl get /msghello k8s[root@etcd-0-8 ~]# etcdctl set --swap-with-value "hello k8s" /msg "goodbye"goodbye[root@etcd-0-8 ~]# etcdctl get /msggoodbye# mk 仅当key不存在时创建(set对同一个key会覆盖)[root@etcd-0-8 ~]# etcdctl get /msggoodbye[root@etcd-0-8 ~]# etcdctl mk /msg "mktest"Error:  105: Key already exists (/msg) [18][root@etcd-0-8 ~]# etcdctl mk /msg1 "mktest"mktest# 创建自排序的key[root@etcd-0-8 ~]# etcdctl mk --in-order /queue s1s1[root@etcd-0-8 ~]# etcdctl mk --in-order /queue s2s2[root@etcd-0-8 ~]# etcdctl ls --sort /queue/queue/00000000000000000021
/queue/00000000000000000022[root@etcd-0-8 ~]# etcdctl get /queue/00000000000000000021s1# 更新key值[root@etcd-0-8 ~]# etcdctl update /msg1 "update test"update test[root@etcd-0-8 ~]# etcdctl get /msg1update test# 更新key的ttl及值[root@etcd-0-8 ~]# etcdctl update --ttl 5 /msg "aaa"aaa# 创建目录[root@etcd-0-8 ~]# etcdctl mkdir /testdir# 删除空目录[root@etcd-0-8 ~]# etcdctl mkdir /test1[root@etcd-0-8 ~]# etcdctl rmdir /test1# 删除非空目录[root@etcd-0-8 ~]# etcdctl get /testdir/testdir: is a directory[root@etcd-0-8 ~]#[root@etcd-0-8 ~]# etcdctl rm --recursive /testdir# 列出目录内容[root@etcd-0-8 ~]# etcdctl ls //tmp
/msg1
/queue[root@etcd-0-8 ~]# etcdctl ls /tmp/tmp/a
/tmp/b# 递归列出目录的内容[root@etcd-0-8 ~]# etcdctl ls --recursive //msg1
/queue
/queue/00000000000000000021
/queue/00000000000000000022
/tmp
/tmp/b
/tmp/a# 监听key，当key发生改变的时候打印出变化[root@etcd-0-8 ~]# etcdctl watch /msg1xxx[root@VM_0_17_centos ~]# etcdctl update /msg1 "xxx"xxx# 监听某个目录，当目录中任何 node 改变的时候，都会打印出来[root@etcd-0-8 ~]# etcdctl watch --recursive /[update] /msg1
xxx[root@VM_0_17_centos ~]# etcdctl update /msg1 "xxx"xxx# 一直监听，除非 `CTL + C` 导致退出监听[root@etcd-0-8 ~]# etcdctl watch --forever /# 监听目录，当发生变化时执行一条命令[root@etcd-0-8 ~]# etcdctl exec-watch --recursive / -- sh -c "echo change"change# backup[root@etcd-0-14 ~]# etcdctl backup --data-dir /data/app/etcd --backup-dir /root/etcd_backup2019-12-04 10:25:16.113237 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113268 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113272 I | ignoring EntryConfChange raft entry
2019-12-04 10:25:16.113293 I | ignoring member attribute update on /0/members/2d2e457c6a1a76cb/attributes
2019-12-04 10:25:16.113299 I | ignoring member attribute update on /0/members/d2d2e9fc758e6790/attributes
2019-12-04 10:25:16.113305 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes
2019-12-04 10:25:16.113310 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes
2019-12-04 10:25:16.113314 I | ignoring member attribute update on /0/members/2d2e457c6a1a76cb/attributes
2019-12-04 10:25:16.113319 I | ignoring member attribute update on /0/members/d2d2e9fc758e6790/attributes
2019-12-04 10:25:16.113384 I | ignoring member attribute update on /0/members/56e0b6dad4c53d42/attributes# 使用v3版本
# 使用v3版本
[root@etcd-0-14 ~]# export ETCDCTL_API=3
[root@etcd-0-14 ~]# etcdctl --endpoints="http://172.16.0.8:2379,http://172.16.0.14:2379,http://172.16.0.17:2379" snapshot save mysnapshot.db
Snapshot saved at mysnapshot.db
[root@etcd-0-14 ~]# etcdctl snapshot status mysnapshot.db -w json
{"hash":928285884,"revision":0,"totalKey":5,"totalSize":20480}
```

# 六 总结

- etcd 默认只保存 1000 个历史事件，所以不适合有大量更新操作的场景，这样会导致数据的丢失。etcd 典型的应用场景是配置管理和服务发现，这些场景都是读多写少的。

- 相比于 zookeeper，etcd 使用起来要简单很多。不过要实现真正的服务发现功能，etcd 还需要和其他工具（比如 registrator、confd 等）一起使用来实现服务的自动注册和更新。

- 目前 etcd 还没有图形化的工具。

# 参考链接

- https://github.com/etcd-io/etcd

- https://www.hi-linux.com/posts/40915.html

- www.hi-linux.com/posts/40915…

- https://cizixs.com/2016/08/02/intro-to-etcd/

- Etcd Raft 使用入门及原理解析

- https://juejin.cn/post/6844903970461351944

- https://www.infoq.cn/article/coreos-analyse-etcd/

如喜欢本文，请点击右上角，把文章分享到朋友圈
如有想了解学习的技术点，请留言给若飞安排分享

**因公众号更改推送规则，请点 “在看” 并加“星标” 第一时间获取精彩技术分享**

**·END·**

```
相关阅读：

蚂蚁大规模 Sigma 集群 Etcd 拆分实践
基于etcd实现大规模服务治理应用实战
服务发现对比：Zookeeper vs etcd vs Consul
```

> 作者：kaliarch
>
> 来源：juejin.cn/post/6844904031186321416
>
> 版权申明：内容来源网络，仅供分享学习，版权归原创者所有。除非无法确认，我们都会标明作者及出处，如有侵权烦请告知，我们会立即删除并表示歉意。谢谢!

**架构师**

我们都是架构师！
