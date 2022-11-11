- [序言](#序言)
- [sentinel 的分布式特性](#sentinel-的分布式特性)
- [关于 sentinel 的稳定版本](#关于-sentinel-的稳定版本)
- [运行 sentinel](#运行-sentinel)
- [部署哨兵之前需要了解的基本事情](#部署哨兵之前需要了解的基本事情)
- [Sentinel 的配置](#sentinel-的配置)
- [Sentinel 的 “仲裁会”](#sentinel-的-仲裁会)
- [配置版本号](#配置版本号)
- [配置传播](#配置传播)
- [SDOWN 和 ODOWN 的更多细节](#sdown-和-odown-的更多细节)
- [Sentinel 之间和 Slaves 之间的自动发现机制](#sentinel-之间和-slaves-之间的自动发现机制)
- [网络隔离时的一致性](#网络隔离时的一致性)
- [Sentinel 状态持久化](#sentinel-状态持久化)
- [无 failover 时的配置纠正](#无-failover-时的配置纠正)
- [Slave 选举与优先级](#slave-选举与优先级)
- [Sentinel 和 Redis 身份验证](#sentinel-和-redis-身份验证)
- [Sentinel API](#sentinel-api)
  - [Sentinel 命令](#sentinel-命令)
- [动态修改 Sentinel 配置](#动态修改-sentinel-配置)
- [增加或删除 Sentinel](#增加或删除-sentinel)
- [删除旧 master 或者不可达 slave](#删除旧-master-或者不可达-slave)
- [发布 / 订阅](#发布--订阅)
- [TILT 模式](#tilt-模式)
- [BUSY 状态](#busy-状态)
- [Sentinel 部署示例](#sentinel-部署示例)
- [实例 1，只有两个 Sentinel，不要这样做](#实例-1只有两个-sentinel不要这样做)
- [例 2：使用三个盒子的基本设置](#例-2使用三个盒子的基本设置)
- [例三：Sentinel 在客户端盒子里](#例三sentinel-在客户端盒子里)
- [例 4：少于 3 个客户端的 Sentinel 客户端](#例-4少于-3-个客户端的-sentinel-客户端)
- [总结](#总结)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.cnblogs.com](https://www.cnblogs.com/knowledgesea/p/6567718.html)

# 序言

Redis-Sentinel 是 Redis 官方推荐的高可用性 (HA) 解决方案。实际上这意味着你可以使用 Sentinel 模式创建一个可以不用人为干预而应对各种故障的 Redis 部署。

它的主要功能有以下几点

- 监控：Sentinel 不断的检查 master 和 slave 是否正常的运行。

- 通知：如果发现某个 redis 节点运行出现问题，可以通过 API 通知系统管理员和其他的应用程序。

- 自动故障转移：能够进行自动切换。当一个 master 节点不可用时，能够选举出 master 的多个 slave 中的一个来作为新的 master, 其它的 slave 节点会将它所追随的 master 的地址改为被提升为 master 的 slave 的新地址。

- 配置提供者：哨兵作为 Redis 客户端发现的权威来源：客户端连接到哨兵请求当前可靠的 master 的地址。如果发生故障，哨兵将报告新地址。

# sentinel 的分布式特性

很显然，只使用单个 sentinel 进程来监控 redis 集群是不可靠的，当 sentinel 进程宕掉后 (sentinel 本身也有单点问题，single-point-of-failure) 整个集群系统将无法按照预期的方式运行。所以有必要将 sentinel 集群，这样有几个好处：

- 即使有一些 sentinel 进程宕掉了，依然可以进行 redis 集群的主备切换；

- 如果只有一个 sentinel 进程，如果这个进程运行出错，或者是网络堵塞，那么将无法实现 redis 集群的主备切换（单点问题）;

- 如果有多个 sentinel，redis 的客户端可以随意地连接任意一个 sentinel 来获得关于 redis 集群中的信息。

# 关于 sentinel 的稳定版本

当前的哨兵版本是 sentinel 2。它是基于最初哨兵的实现，使用更健壮的和更简单的预算算法 (在这个文档里有解释) 重写的。

Redis2.8 和 Redis3.0 附带稳定的哨兵版本。他们是 Redis 的两个最新稳定版本。

在不稳定版本的分支上执行新的改进，且有时一些新特性一旦被认为是稳定的就会被移植到 Redis2.8 和 Redis3.0 分支中。

Redis2.6 附带 Redis sentinel 1，它是弃用的不建议使用。

# 运行 sentinel

运行 Sentinel 有两种方式，如下：

```sh
redis-sentinel /path/to/sentinel.conf
```

```sh
redis-server /path/to/sentinel.conf --sentinel
```

两种方式效果都是一样的。

然而在启动哨兵时必须使用一个配置文件，因为这个配置文件将用于系统保存当前状态和在重启时重新加载。哨兵会在没有指定配置文件或指定的配置文件不可写的时候拒绝启动。

Redis 哨兵默认监听 26379 TCP 端口，所以为了哨兵的正常工作，你的 26379 端口必须开放接收其他哨兵实例的 IP 地址的连接。否则哨兵不能通信和商定做什么，故障转移将永不会执行。

# 部署哨兵之前需要了解的基本事情

1. 一个健壮的部署至少需要三个哨兵实例。

2. 三个哨兵实例应该放置在客户使用独立方式确认故障的计算机或虚拟机中。例如不同的物理机或不同可用区域的虚拟机。

3. sentinel + Redis 实例不保证在故障期间保留确认的写入，因为 Redis 使用异步复制。然而有方式部署哨兵使丢失数据限制在特定时刻，虽然有更安全的方式部署它。

4. 你的客户端要支持哨兵，流行的客户端都支持哨兵，但不是全部。

5. 没有 HA 设置是安全的，如果你不经常的在开发环境测试，在生产环境他们会更好。你可能会有一个明显的错误配置只是当太晚的时候。

6. Sentinel，Docker，或者其他形式的网络地址交换或端口映射需要加倍小心：Docker 执行端口重新映射，破坏 Sentinel 自动发现其他的哨兵进程和 master 的 slave 列表。稍后在这个文档里检查关于 Sentinel 和 Docker 的部分，了解更多信息。

# Sentinel 的配置

Redis 源码发布包包含一个 sentinel.conf 的文件，默认的配置文件中有关于各个配置项的详细解释，一个典型的最小的配置文件就像下面的配置：

```sh
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 60000
sentinel failover-timeout mymaster 180000
sentinel parallel-syncs mymaster 1

sentinel monitor resque 192.168.1.3 6380 4
sentinel down-after-milliseconds resque 10000
sentinel failover-timeout resque 180000
sentinel parallel-syncs resque 5
```

上面的配置项配置了两个名字分别为 mymaster 和 resque 的 master，配置文件只需要配置 master 的信息就好啦，不用配置 slave 的信息，因为 slave 能够被自动检测到 (master 节点中有关于 slave 的消息)。

为了更清晰，我们逐行的解释每个选项的含义：

第一行的格式如下：

```sh
sentinel monitor [master-group-name] [ip] [port] [quorum]
```

master-group-name：master 名称

quorun：本文叫做票数，Sentinel 需要协商同意 master 是否可到达的数量。

```sh
sentinel monitor mymaster 127.0.0.1 6379 2
```

这一行用于告诉 Redis 监控一个 master 叫做 mymaster，它的地址在 127.0.0.1，端口为 6379，票数是 2。

这里的票数需要解释下：举个栗子，redis 集群中有 5 个 sentinel 实例，其中 master 挂掉啦，如果这里的票数是 2，表示有 2 个 sentinel 认为 master 挂掉啦，才能被认为是正真的挂掉啦。其中 sentinel 集群中各个 sentinel 也有互相通信，通过 gossip 协议。

除啦第一行其他的格式如下：

```sh
sentinel [option_name] [master_name] [option_value]
```

- **down-after-milliseconds**

  sentinel 会向 master 发送心跳 PING 来确认 master 是否存活，如果 master 在 “一定时间范围” 内不回应 PONG  或者是回复了一个错误消息，那么这个 sentinel 会主观地认为这个 master 已经不可用了。而这个 down-after-milliseconds 就是用来指定这个 “一定时间范围” 的，单位是毫秒。

- **parallel-syncs**

  在发生 failover 主从切换时，这个选项指定了最多可以有多少个 slave 同时对新的 master 进行同步，这个数字越小，完成主从故障转移所需的时间就越长，但是如果这个数字越大，就意味着越多的 slave 因为主从同步而不可用。可以通过将这个值设为 1 来保证每次只有一个 slave 处于不能处理命令请求的状态。

# Sentinel 的 “仲裁会”

前面我们谈到，主从故障转移时，需要的 sentinel 认可的票数达到设置的值才可以。

不过，当 failover 主备切换真正被触发后，failover 并不会马上进行，还需要 sentinel 中的大多数 sentinel 授权后才可以进行 failover。
当 sentinel 认可不可用的票数达到时（ODOWN），failover 被触发。failover 一旦被触发，尝试去进行 failover 的 sentinel 会去获得 “大多数”sentinel 的授权（如果票数比大多数还要大的时候，则询问更多的 sentinel)
这个区别看起来很微妙，但是很容易理解和使用。例如，集群中有 5 个 sentinel，票数被设置为 2，当 2 个 sentinel 认为一个 master 已经不可用了以后，将会触发 failover，但是，进行 failover 的那个 sentinel 必须先获得至少 3 个 sentinel 的授权才可以实行 failover。
如果票数被设置为 5，要达到 ODOWN 状态，必须所有 5 个 sentinel 都主观认为 master 为不可用，要进行 failover，那么得获得所有 5 个 sentinel 的授权。

# 配置版本号

为什么要先获得大多数 sentinel 的认可时才能真正去执行 failover 呢？

当一个 sentinel 被授权后，它将会获得宕掉的 master 的一份最新配置版本号，当 failover 执行结束以后，这个版本号将会被用于最新的配置。因为大多数 sentinel 都已经知道该版本号已经被要执行 failover 的 sentinel 拿走了，所以其他的 sentinel 都不能再去使用这个版本号。这意味着，每次 failover 都会附带有一个独一无二的版本号。我们将会看到这样做的重要性。

而且，sentinel 集群都遵守一个规则：如果 sentinel A 推荐 sentinel B 去执行 failover，B 会等待一段时间后，自行再次去对同一个 master 执行 failover，这个等待的时间是通过`failover-timeout`配置项去配置的。从这个规则可以看出，sentinel 集群中的 sentinel 不会再同一时刻并发去 failover 同一个 master，第一个进行 failover 的 sentinel 如果失败了，另外一个将会在一定时间内进行重新进行 failover，以此类推。

redis sentinel 保证了活跃性：如果大多数 sentinel 能够互相通信，最终将会有一个被授权去进行 failover.
redis sentinel 也保证了安全性：每个试图去 failover 同一个 master 的 sentinel 都会得到一个独一无二的版本号。

# 配置传播

一旦一个 sentinel 成功地对一个 master 进行了 failover，它将会把关于 master 的最新配置通过广播形式通知其它 sentinel，其它的 sentinel 则更新对应 master 的配置。

一个 faiover 要想被成功实行，sentinel 必须能够向选为 master 的 slave 发送`SLAVE OF NO ONE`命令，然后能够通过`INFO`命令看到新 master 的配置信息。

当将一个 slave 选举为 master 并发送`SLAVE OF NO ONE`` 后，即使其它的 slave 还没针对新 master 重新配置自己，failover 也被认为是成功了的，然后所有 sentinels 将会发布新的配置信息。

新配在集群中相互传播的方式，就是为什么我们需要当一个 sentinel 进行 failover 时必须被授权一个版本号的原因。

每个 sentinel 使用 **发布 / 订阅** 的方式持续地传播 master 的配置版本信息，配置传播的 **发布 / 订阅** 管道是：`__sentinel__:hello`。

因为每一个配置都有一个版本号，所以以版本号最大的那个为标准。

举个栗子：假设有一个名为 mymaster 的地址为 192.168.1.50:6379。一开始，集群中所有的 sentinel 都知道这个地址，于是为 mymaster 的配置打上版本号 1。一段时候后 mymaster 死了，有一个 sentinel 被授权用版本号 2 对其进行 failover。如果 failover 成功了，假设地址改为了 192.168.1.50:9000，此时配置的版本号为 2，进行 failover 的 sentinel 会将新配置广播给其他的 sentinel，由于其他 sentinel 维护的版本号为 1，发现新配置的版本号为 2 时，版本号变大了，说明配置更新了，于是就会采用最新的版本号为 2 的配置。

这意味着 sentinel 集群保证了第二种活跃性：一个能够互相通信的 sentinel 集群最终会采用版本号最高且相同的配置。

# SDOWN 和 ODOWN 的更多细节

sentinel 对于不可用有两种不同的看法，一个叫主观不可用 (SDOWN), 另外一个叫客观不可用 (ODOWN)。

SDOWN 是 sentinel 自己主观上检测到的关于 master 的状态。

ODOWN 需要一定数量的 sentinel 达成一致意见才能认为一个 master 客观上已经宕掉，各个 sentinel 之间通过命令  **`SENTINEL is_master_down_by_addr`** 来获得其它 sentinel 对 master 的检测结果。

从 sentinel 的角度来看，如果发送了 PING 心跳后，在一定时间内没有收到合法的回复，就达到了 SDOWN 的条件。这个时间在配置中通过  `**is-master-down-after-milliseconds**` 参数配置。

当 sentinel 发送 PING 后，以下回复都被认为是合法的, 除此之外，其它任何回复（或者根本没有回复）都是不合法的。

```sh
PING replied with +PONG.
PING replied with -LOADING error.
PING replied with -MASTERDOWN error.
```

从 SDOWN 切换到 ODOWN 不需要任何一致性算法，只需要一个 gossip 协议：如果一个 sentinel 收到了足够多的 sentinel 发来消息告诉它某个 master 已经 down 掉了，SDOWN 状态就会变成 ODOWN 状态。如果之后 master 可用了，这个状态就会相应地被清理掉。

正如之前已经解释过了，真正进行 failover 需要一个授权的过程，但是所有的 failover 都开始于一个 ODOWN 状态。

ODOWN 状态只适用于 master，对于不是 master 的 redis 节点 sentinel 之间不需要任何协商，slaves 和 sentinel 不会有 ODOWN 状态。

# Sentinel 之间和 Slaves 之间的自动发现机制

虽然 sentinel 集群中各个 sentinel 都互相连接彼此来检查对方的可用性以及互相发送消息。但是你不用在任何一个 sentinel 配置任何其它的 sentinel 的节点。因为 sentinel 利用了 master 的发布 / 订阅机制去自动发现其它也监控了统一 master 的 sentinel 节点。

通过向名为`__sentinel__:hello`的管道中发送消息来实现。

同样，你也不需要在 sentinel 中配置某个 master 的所有 slave 的地址，sentinel 会通过询问 master 来得到这些 slave 的地址的。

- 每个 sentinel 通过向每个 master 和 slave 的发布 / 订阅频道`__sentinel__:hello`每秒发送一次消息，来宣布它的存在。

- 每个 sentinel 也订阅了每个 master 和 slave 的频道`__sentinel__:hello`的内容，来发现未知的 sentinel，当检测到了新的 sentinel，则将其加入到自身维护的 master 监控列表中。

- 每个 sentinel 发送的消息中也包含了其当前维护的最新的 master 配置。如果某个 sentinel 发现

自己的配置版本低于接收到的配置版本，则会用新的配置更新自己的 master 配置。

在为一个 master 添加一个新的 sentinel 前，sentinel 总是检查是否已经有 sentinel 与新的 sentinel 的进程号或者是地址是一样的。如果是那样，这个 sentinel 将会被删除，而把新的 sentinel 添加上去。

# 网络隔离时的一致性

redis sentinel 集群的配置的一致性模型为最终一致性，集群中每个 sentinel 最终都会采用最高版本的配置。然而，在实际的应用环境中，有三个不同的角色会与 sentinel 打交道：

- Redis 实例.

- Sentinel 实例.

- 客户端.

为了考察整个系统的行为我们必须同时考虑到这三个角色。

下面有个简单的例子，有三个主机，每个主机分别运行一个 redis 和一个 sentinel:

```log
             +-------------+
             | Sentinel 1  | <--- Client A
             | Redis 1 (M) |
             +-------------+
                     |
                     |
 +-------------+     |                     +------------+
 | Sentinel 2  |-----+-- / partition / ----| Sentinel 3 | <--- Client B
 | Redis 2 (S) |                           | Redis 3 (M)|
 +-------------+                           +------------+
```

在这个系统中，初始状态下 redis3 是 master, redis1 和 redis2 是 slave。之后 redis3 所在的主机网络不可用了，sentinel1 和 sentinel2 启动了 failover 并把 redis1 选举为 master。

Sentinel 集群的特性保证了 sentinel1 和 sentinel2 得到了关于 master 的最新配置。但是 sentinel3 依然持着的是就的配置，因为它与外界隔离了。

当网络恢复以后，我们知道 sentinel3 将会更新它的配置。但是，如果客户端所连接的 master 被网络隔离，会发生什么呢？

客户端将依然可以向 redis3 写数据，但是当网络恢复后，redis3 就会变成 redis 的一个 slave，那么，在网络隔离期间，客户端向 redis3 写的数据将会丢失。

也许你不会希望这个场景发生：

- 如果你把 redis 当做缓存来使用，那么你也许能容忍这部分数据的丢失。

- 但如果你把 redis 当做一个存储系统来使用，你也许就无法容忍这部分数据的丢失了。

因为 redis 采用的是异步复制，在这样的场景下，没有办法避免数据的丢失。然而，你可以通过以下配置来配置 redis3 和 redis1，使得数据不会丢失。

```sh
min-slaves-to-write 1
min-slaves-max-lag 10
```

通过上面的配置，当一个 redis 是 master 时，如果它不能向至少一个 slave 写数据 (上面的 min-slaves-to-write 指定了 slave 的数量)，它将会拒绝接受客户端的写请求。由于复制是异步的，master 无法向 slave 写数据意味着 slave 要么断开连接了，要么不在指定时间内向 master 发送同步数据的请求了 (上面的 min-slaves-max-lag 指定了这个时间)。

# Sentinel 状态持久化

snetinel 的状态会被持久化地写入 sentinel 的配置文件中。每次当收到一个新的配置时，或者新创建一个配置时，配置会被持久化到硬盘中，并带上配置的版本戳。这意味着，可以安全的停止和重启 sentinel 进程。

# 无 failover 时的配置纠正

即使当前没有 failover 正在进行，sentinel 依然会使用当前配置去设置监控的 master。特别是：

- 根据最新配置确认为 slaves 的节点却声称自己是 master(参考上文例子中被网络隔离后的的 redis3)，这时它们会被重新配置为当前 master 的 slave。

- 如果 slaves 连接了一个错误的 master，将会被改正过来，连接到正确的 master。

# Slave 选举与优先级

当一个 sentinel 准备好了要进行 failover，并且收到了其他 sentinel 的授权，那么就需要选举出一个合适的 slave 来做为新的 master。

slave 的选举主要会评估 slave 的以下几个方面：

- 与 master 断开连接的次数

- Slave 的优先级

- 数据复制的下标 (用来评估 slave 当前拥有多少 master 的数据)

- 进程 ID

如果一个 slave 与 master 失去联系超过 10 次，并且每次都超过了配置的最大失联时间 (`down-after-milliseconds option`)，并且，如果 sentinel 在进行 failover 时发现 slave 失联，那么这个 slave 就会被 sentinel 认为不适合用来做新 master 的。

更严格的定义是，如果一个 slave 持续断开连接的时间超过

```log
(down-after-milliseconds * 10) + milliseconds_since_master_is_in_SDOWN_state
```

就会被认为失去选举资格。符合上述条件的 slave 才会被列入 master 候选人列表，并根据以下顺序来进行排序：

1. sentinel 首先会根据 slaves 的优先级来进行排序，优先级越小排名越靠前（？）。

2. 如果优先级相同，则查看复制的下标，哪个从 master 接收的复制数据多，哪个就靠前。

3. 如果优先级和下标都相同，就选择进程 ID 较小的那个。

一个 redis 无论是 master 还是 slave，都必须在配置中指定一个 slave 优先级。要注意到 master 也是有可能通过 failover 变成 slave 的。

如果一个 redis 的 slave 优先级配置为 0，那么它将永远不会被选为 master。但是它依然会从 master 哪里复制数据。

# Sentinel 和 Redis 身份验证

当一个 master 配置为需要密码才能连接时，客户端和 slave 在连接时都需要提供密码。

master 通过`requirepass`设置自身的密码，不提供密码无法连接到这个 master。
slave 通过`masterauth`来设置访问 master 时的密码。

但是当使用了 sentinel 时，由于一个 master 可能会变成一个 slave，一个 slave 也可能会变成 master，所以需要同时设置上述两个配置项。

# Sentinel API

Sentinel 默认运行在 26379 端口上，sentinel 支持 redis 协议，所以可以使用 redis-cli 客户端或者其他可用的客户端来与 sentinel 通信。

有两种方式能够与 sentinel 通信：

- 一种是直接使用客户端向它发消息

- 另外一种是使用发布 / 订阅模式来订阅 sentinel 事件，比如说 failover，或者某个 redis 实例运行出错，等等。

## Sentinel 命令

sentinel 支持的合法命令如下：

- `PING` sentinel 回复`PONG`.

- `SENTINEL masters`  显示被监控的所有 master 以及它们的状态.

- `SENTINEL master <master name>`  显示指定 master 的信息和状态；

- `SENTINEL slaves <master name>`  显示指定 master 的所有 slave 以及它们的状态；

- `SENTINEL get-master-addr-by-name <master name>`  返回指定 master 的 ip 和端口，如果正在进行 failover 或者 failover 已经完成，将会显示被提升为 master 的 slave 的 ip 和端口。

- `SENTINEL reset <pattern>`  重置名字匹配该正则表达式的所有的 master 的状态信息，清楚其之前的状态信息，以及 slaves 信息。

- `SENTINEL failover <master name>`  强制 sentinel 执行 failover，并且不需要得到其他 sentinel 的同意。但是 failover 后会将最新

# 动态修改 Sentinel 配置

从 redis2.8.4 开始，sentinel 提供了一组 API 用来添加，删除，修改 master 的配置。

> 需要注意的是，如果你通过 API 修改了一个 sentinel 的配置，sentinel 不会把修改的配置告诉其他 sentinel。你需要自己手动地对多个 sentinel 发送修改配置的命令。

以下是一些修改 sentinel 配置的命令：

- `SENTINEL MONITOR <name> <ip> <port> <quorum>` 这个命令告诉 sentinel 去监听一个新的 master

- `SENTINEL REMOVE <name>`  命令 sentinel 放弃对某个 master 的监听

- `SENTINEL SET <name> <option> <value>`  这个命令很像 Redis 的`CONFIG SET`命令，用来改变指定 master 的配置。支持多个 <option><value>。例如以下实例：

- `SENTINEL SET objects-cache-master down-after-milliseconds 1000`

只要是配置文件中存在的配置项，都可以用`SENTINEL SET`命令来设置。这个还可以用来设置 master 的属性，比如说 quorum(票数)，而不需要先删除 master，再重新添加 master。例如：

```sh
SENTINEL SET objects-cache-master quorum 5
```

# 增加或删除 Sentinel

由于有 sentinel 自动发现机制，所以添加一个 sentinel 到你的集群中非常容易，你所需要做的只是监控到某个 Master 上，然后新添加的 sentinel 就能获得其他 sentinel 的信息以及 masterd 所有的 slave。

如果你需要添加多个 sentinel，建议你一个接着一个添加，这样可以预防网络隔离带来的问题。你可以每个 30 秒添加一个 sentinel。最后你可以用`SENTINEL MASTER mastername`来检查一下是否所有的 sentinel 都已经监控到了 master。

删除一个 sentinel 显得有点复杂：因为 sentinel 永远不会删除一个已经存在过的 sentinel，即使它已经与组织失去联系很久了。要想删除一个 sentinel，应该遵循如下步骤：

1. 停止所要删除的 sentinel

2. 发送一个`SENTINEL RESET *` 命令给所有其它的 sentinel 实例，如果你想要重置指定 master 上面的 sentinel，只需要把 \* 号改为特定的名字，注意，需要一个接一个发，每次发送的间隔不低于 30 秒。

3. 检查一下所有的 sentinels 是否都有一致的当前 sentinel 数。使用`SENTINEL MASTER mastername`  来查询。

# 删除旧 master 或者不可达 slave

sentinel 永远会记录好一个 Master 的 slaves，即使 slave 已经与组织失联好久了。这是很有用的，因为 sentinel 集群必须有能力把一个恢复可用的 slave 进行重新配置。

并且，failover 后，失效的 master 将会被标记为新 master 的一个 slave，这样的话，当它变得可用时，就会从新 master 上复制数据。

然后，有时候你想要永久地删除掉一个 slave(有可能它曾经是个 master)，你只需要发送一个`SENTINEL RESET master`命令给所有的 sentinels，它们将会更新列表里能够正确地复制 master 数据的 slave。

# 发布 / 订阅

客户端可以向一个 sentinel 发送订阅某个频道的事件的命令，当有特定的事件发生时，sentinel 会通知所有订阅的客户端。需要注意的是客户端只能订阅，不能发布。

订阅频道的名字与事件的名字一致。例如，频道名为 sdown  将会发布所有与 SDOWN 相关的消息给订阅者。

如果想要订阅所有消息，只需简单地使用`PSUBSCRIBE *`

以下是所有你可以收到的消息的消息格式，如果你订阅了所有消息的话。第一个单词是频道的名字，其它是数据的格式。

注意：以下的 instance details 的格式是：

<instance-type> <name> <ip> <port> @ <master-name> <master-ip> <master-port>

如果这个 redis 实例是一个 master，那么 @之后的消息就不会显示。

```log
+reset-master <instance details> -- 当master被重置时.

+slave <instance details> -- 当检测到一个slave并添加进slave列表时.

+failover-state-reconf-slaves <instance details> -- Failover状态变为reconf-slaves状态时

+failover-detected <instance details> -- 当failover发生时

+slave-reconf-sent <instance details> -- sentinel发送SLAVEOF命令把它重新配置时

+slave-reconf-inprog <instance details> -- slave被重新配置为另外一个master的slave，但数据复制还未发生时。

+slave-reconf-done <instance details> -- slave被重新配置为另外一个master的slave并且数据复制已经与master同步时。

-dup-sentinel <instance details> -- 删除指定master上的冗余sentinel时 (当一个sentinel重新启动时，可能会发生这个事件).

+sentinel <instance details> -- 当master增加了一个sentinel时。

+sdown <instance details> -- 进入SDOWN状态时;

-sdown <instance details> -- 离开SDOWN状态时。

+odown <instance details> -- 进入ODOWN状态时。

-odown <instance details> -- 离开ODOWN状态时。

+new-epoch <instance details> -- 当前配置版本被更新时。

+try-failover <instance details> -- 达到failover条件，正等待其他sentinel的选举。

+elected-leader <instance details> -- 被选举为去执行failover的时候。

+failover-state-select-slave <instance details> -- 开始要选择一个slave当选新master时。

no-good-slave <instance details> -- 没有合适的slave来担当新master

selected-slave <instance details> -- 找到了一个适合的slave来担当新master

failover-state-send-slaveof-noone <instance details> -- 当把选择为新master的slave的身份进行切换的时候。

failover-end-for-timeout <instance details> -- failover由于超时而失败时。

failover-end <instance details> -- failover成功完成时。

switch-master <master name> <oldip> <oldport> <newip> <newport> -- 当master的地址发生变化时。通常这是客户端最感兴趣的消息了。

+tilt -- 进入Tilt模式。

-tilt -- 退出Tilt模式。
```

# TILT 模式

redis sentinel 非常依赖系统时间，例如它会使用系统时间来判断一个 PING 回复用了多久的时间。
然而，假如系统时间被修改了，或者是系统十分繁忙，或者是进程堵塞了，sentinel 可能会出现运行不正常的情况。
当系统的稳定性下降时，TILT 模式是 sentinel 可以进入的一种的保护模式。当进入 TILT 模式时，sentinel 会继续监控工作，但是它不会有任何其他动作，它也不会去回应`is-master-down-by-addr`这样的命令了，因为它在 TILT 模式下，检测失效节点的能力已经变得让人不可信任了。
如果系统恢复正常，持续 30 秒钟，sentinel 就会退出 TITL 模式。

# BUSY 状态

注意：该功能还未实现。

当一个脚本的运行时间超过配置的运行时间时，sentinel 会返回一个 - BUSY 错误信号。如果这件事发生在触发一个 failover 之前，sentinel 将会发送一个 SCRIPT KILL 命令，如果 script 是只读的话，就能成功执行。

# Sentinel 部署示例

既然你知道了 sentinel 的基本信息，你可以很想知道应该将 Sentinel 放置在哪里，需要多少 Sentinel 进程等等。这个章节展示了几个部署示例。

我们为了图像化展示配置示例使用字符艺术，这是不同符号的意思：

```log
+--------------------+
| This is a computer |
| or VM that fails   |
| independently. We  |
| call it a "box"    |
+--------------------+
```

我们写在盒子里表示他们正在运行什么：

```log
+-------------------+
| Redis master M1   |
| Redis Sentinel S1 |
+-------------------+
```

不同的盒子之间通过线条连接，表示他们可以相互通信：

```log
+-------------+               +-------------+
| Sentinel S1 |---------------| Sentinel S2 |
+-------------+               +-------------+
```

使用斜杠展示网络断开：

```log
+-------------+                +-------------+
| Sentinel S1 |------ // ------| Sentinel S2 |
+-------------+                +-------------+
```

还要注意：

- Master 被叫做 M1,M2,M3 ... Mn。

- Slave 被叫做 R1,R2,R3 ... Rn(replica 的首字母)

- Sentinels 被叫做 S1,S2,S3 ... Sn

- Clients 被叫做 C1,C2,C3 ... Cn

- 当一个实例因为 Sentinel 的行为改变了角色，我们把它放在方括号里，所以 [M1] 表示因为 Sentinel 的介入，M1 现在是一个 master。

注意永远不会显示的设置只是使用了两个哨兵，因为为了启动故障转移，Sentinel 总是需要和其他大多数的 Sentinel 通信。

# 实例 1，只有两个 Sentinel，不要这样做

```log
+----+         +----+
| M1 |---------| R1 |
| S1 |         | S2 |
+----+         +----+

Configuration: quorum = 1
```

- 在这个设置中，如果 master M1 故障，R1 将被晋升因为两个 Sentinel 可以达成协议并且还可以授权一个故障转移因为多数就是两个。所以他表面上看起来是可以工作的，然而检查下一个点了解为什么这个设置是不行的。

- 如果运行 M1 的盒子停止工作了，S1 也停止工作。运行在其他盒子上的 S2 将不能授权故障转移，所以系统将变成不可用。

注意为了排列不同的故障转移需要少数服从多数，并且稍后向所有的 Sentinel 传播最新的配置。还要注意上面配置的故障转移的能力，没有任何协定，非常危险：

```log
+----+           +------+
| M1 |----//-----| [M1] |
| S1 |           | S2   |
+----+           +------+
```

在上面的配置中我们使用完美的对称方式创建了两个 master(假定 S2 可以在未授权的情况下进行故障转移)。客户端可能会不确定往哪边写，并且没有途径知道什么时候分区配置是正确的，为了预防一个永久的断裂状态。

所有请永远部署至少三个 Sentinel 在三个不同的盒子里。

# 例 2：使用三个盒子的基本设置

这是个非常简单的设置，它有简单调整安全的优势。它基于三个盒子，每个盒子同时运行一个 Redis 实例和一个 Sentinel 实例。

```log
       +----+
       | M1 |
       | S1 |
       +----+
          |
+----+    |    +----+
| R2 |----+----| R3 |
| S2 |         | S3 |
+----+         +----+

Configuration: quorum = 2
```

如果 M1 故障，S2 和 S3 将会商定故障并授权故障转移，使客户端可以继续。

在每个 Sentinel 设置里，Redis 是异步主从复制，总会有丢失数据的风险，因为有可能当它成为 master 的时候，一个确认的写入操作还没有同步到 slave。然后在上面的设置中有一个更高的风险由于客户端分区一直是老的 master，就像下面的图像所示：

```log
         +----+
         | M1 |
         | S1 | [- C1 (writes will be lost)
         +----+
            |
            /
            /
+------+    |    +----+
| [M2] |----+----| R3 |
| S2   |         | S3 |
+------+         +----+
```

在这个案例中网络分区隔离老的 master M1，所以 slave R2 晋升为 master。然而客户端，比如 C1，还在原来的老的 master 的分区，可能继续往老 master 写数据。这个数据将会永久丢失，因为分区恢复时，master 将会重新配置为新 master 的 slave，丢弃它的数据集。

这个问题可以使用下面的 Redis 主从复制特性减轻，它可在 master 检查到它不再能传输它的写入操作到指定数量的 slave 的时候停止接收写入操作。

```sh
min-slaves-to-write 1
min-slaves-max-lag 10
```

使用上面的配置 (请查看自带的 redis.conf 示例了解更多信息) 一个 Redis 实例，当作为一个 master，如果它不能写入至少 1 个 slave 将停止接收写入操作。（N 个 Slave 以上不通就停止接收）

由于主从复制是异步的不能真实的写入，意味着 slave 断开连接，或者不再向我们发送异步确认的指定的 max-lag 秒数。（判定连接不通的超时时间）

在上面的示例中使用这个配置，老 master M1 将会在 10 秒钟后变为不可用。当分区恢复时，Sentinel 配置将指向新的一个，客户端 C1 将能够获取到有效的配置并且将使用新 master 继续工作。

然而天下没有免费的午餐，这种改进，如果两个 slave 挂掉，master 将会停止接收写入操作。这是个权衡。

# 例三：Sentinel 在客户端盒子里

有时我们只有两个 Redis 盒子可用，一个 master 和一个 slave。在例二中的配置在那样的情况下是不可行的，所谓我们可以借助下面的，Sentinel 放置在客户端：

```log
            +----+         +----+
            | M1 |----+----| R1 |
            | S1 |    |    | S2 |
            +----+    |    +----+
                      |
         +------------+------------+
         |            |            |
         |            |            |
      +----+        +----+      +----+
      | C1 |        | C2 |      | C3 |
      | S1 |        | S2 |      | S3 |
      +----+        +----+      +----+

      Configuration: quorum = 2
```

在这个设置里，Sentinel 的视角和客户端的视角相同：如果大多数的客户端认为 master 是可以到达的，它就是好的。C1,C2,C3 是一般的客户端，这不意味着 C1 识别单独的客户端连接到 Redis。它更像一些如应用服务，Rails 应用之类的。

如果运行 M1 和 S1 的盒子故障，故障转移将会发生，然而很容看到不同的网络分区将导致不同的行为。例如如果客户端和 Redis 服务之间的断开连接，Sentinel 将不能设置，因为 master 和 slave 将都不可用。

注意如果使用 M1 获取分区，我们有一个和例二中描述的相似的问题，不同的是这里我们没有办法打破对称，由于只有一个 slave 和 master，所以当它的 master 断开连接时 master 不能停止接收查询，否则在 slave 故障期间 master 将永不可用。

所以这是个有效的设置但是在例二中的设置有像更容易管理 HA 系统的优点， 并有能力限制 master 接收写入的时间。

# 例 4：少于 3 个客户端的 Sentinel 客户端

在例 3 中如果客户端少于 3 个就不能使用。在这个案例中我们使用一个混合的设置：

```log
            +----+         +----+
            | M1 |----+----| R1 |
            | S1 |    |    | S2 |
            +----+    |    +----+
                      |
               +------+-----+
               |            |
               |            |
            +----+        +----+
            | C1 |        | C2 |
            | S3 |        | S4 |
            +----+        +----+

      Configuration: quorum = 3
```

这里和例 3 非常类似，但是这里我们在 4 个盒子里运行四个哨兵。如果 M1 故障其他的三个哨兵可以执行故障转移。

本文参考文档：

[https://redis.io/topics/sentinel](https://redis.io/topics/sentinel "https://redis.io/topics/sentinel")

[http://redis.majunwei.com/topics/sentinel.html](http://redis.majunwei.com/topics/sentinel.html "http://redis.majunwei.com/topics/sentinel.html")

[https://segmentfault.com/a/1190000002680804](https://segmentfault.com/a/1190000002680804 "https://segmentfault.com/a/1190000002680804")

[https://segmentfault.com/a/1190000002685515](https://segmentfault.com/a/1190000002685515 "https://segmentfault.com/a/1190000002685515")

# 总结

接下来是大家最喜欢的总结内容啦，内容有二，如下：

1、希望能关注我其他的文章。

2、博客里面有没有很清楚的说明白，或者你有更好的方式，那么欢迎加入左上方的 2 个交流群，我们一起学习探讨。
