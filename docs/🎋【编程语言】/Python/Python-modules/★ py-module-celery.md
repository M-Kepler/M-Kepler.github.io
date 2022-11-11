- [celery](#celery)
  - [参考资料](#参考资料)
  - [基本使用](#基本使用)
  - [celery 架构](#celery-架构)
  - [配置](#配置)
  - [记录](#记录)
    - [task.apply_async 和 task.delay](#taskapply_async-和-taskdelay)
  - [问题记录](#问题记录)
    - [怎么把结果返回给调用方](#怎么把结果返回给调用方)
  - [最佳实践](#最佳实践)
    - [消息队列选择](#消息队列选择)
- [其他](#其他)

# celery

- `Python` 实现的一个`分布式任务队列框架`，主要用于管理分布式任务队列、处理耗时的任务；支持使用任务队列的方式在分布的 机器 / 进程 / 线程上 执行任务调度。可以让任务的执行完全脱离主程序，甚至可以被分配到其他主机上运行, 通常使用它实现异步任务 & 定时任务

- 项目开发中遇到过一些问题，发送请求后服务器要进行一系列`耗时非常长的操作，用户要等待很久的时间。可不可以立刻对用户返回响应`，然后在后台运行那些操作呢？ `crontab` 定时任务很难达到这样的要求 ，异步任务是很好的解决方法，有一个使用 `python` 写的非常好用的异步任务工具 `Celery`

## 参考资料

- [官方文档](http://docs.jinkan.org/docs/celery/)

- [工程级别Celery应用](https://mp.weixin.qq.com/s?search_click_id=4097273415185413837-1651106841564-351520&__biz=MzI0MTU5MzA3MA==&mid=2247483711&idx=1&sn=7e362e8c1ba492faf7c0ba7ed6732f9c&chksm=e9087ebede7ff7a83db8d71014e966553cdb06f77025d4641f3852d32be3c012b262263b1d22&scene=0&subscene=10000&clicktime=1651106841&enterid=1651106841#rd)

## 基本使用

**启动**

```sh
$cd modules
$celery -A celery_test worker -l debug -c 4
```

**运行状况**

```log
[2022-05-01 20:37:40,868: DEBUG/MainProcess] | Worker: Preparing bootsteps.
[2022-05-01 20:37:40,872: DEBUG/MainProcess] | Worker: Building graph...
[2022-05-01 20:37:40,872: DEBUG/MainProcess] | Worker: New boot order: {StateDB, Beat, Timer, Hub, Pool, Autoscaler, Consumer}
[2022-05-01 20:37:40,885: DEBUG/MainProcess] | Consumer: Preparing bootsteps.
[2022-05-01 20:37:40,885: DEBUG/MainProcess] | Consumer: Building graph...
[2022-05-01 20:37:40,929: DEBUG/MainProcess] | Consumer: New boot order: {Connection, Events, Mingle, Tasks, Control, Heart, Gossip, Agent, event loop}

 -------------- celery@DESKTOP-HSENS6B v5.2.6 (dawn-chorus)
--- ***** -----
-- ******* ---- Linux-4.4.0-22000-Microsoft-x86_64-with-glibc2.29 2022-05-01 20:37:40
- *** --- * ---
- ** ---------- [config]
- ** ---------- .> app:         celery_test:0x7f1e5e7abfa0
- ** ---------- .> transport:   redis://127.0.0.1:6379/0
- ** ---------- .> results:     disabled://
- *** --- * --- .> concurrency: 4 (prefork)
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** -----
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery


[tasks]
  . celery.accumulate
  . celery.backend_cleanup
  . celery.chain
  . celery.chord
  . celery.chord_unlock
  . celery.chunks
  . celery.group
  . celery.map
  . celery.starmap

[2022-05-01 20:37:40,997: DEBUG/MainProcess] | Worker: Starting Hub
[2022-05-01 20:37:40,997: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:40,998: DEBUG/MainProcess] | Worker: Starting Pool
[2022-05-01 20:37:41,564: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:41,565: DEBUG/MainProcess] | Worker: Starting Consumer
[2022-05-01 20:37:41,567: DEBUG/MainProcess] | Consumer: Starting Connection
[2022-05-01 20:37:41,607: INFO/MainProcess] Connected to redis://127.0.0.1:6379/0
[2022-05-01 20:37:41,607: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:41,608: DEBUG/MainProcess] | Consumer: Starting Events
[2022-05-01 20:37:41,611: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:41,611: DEBUG/MainProcess] | Consumer: Starting Mingle
[2022-05-01 20:37:41,611: INFO/MainProcess] mingle: searching for neighbors
[2022-05-01 20:37:42,624: INFO/MainProcess] mingle: all alone
[2022-05-01 20:37:42,624: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:42,624: DEBUG/MainProcess] | Consumer: Starting Tasks
[2022-05-01 20:37:42,663: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:42,664: DEBUG/MainProcess] | Consumer: Starting Control
[2022-05-01 20:37:42,670: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:42,671: DEBUG/MainProcess] | Consumer: Starting Heart
[2022-05-01 20:37:42,673: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:42,674: DEBUG/MainProcess] | Consumer: Starting Gossip
[2022-05-01 20:37:42,680: DEBUG/MainProcess] ^-- substep ok
[2022-05-01 20:37:42,681: DEBUG/MainProcess] | Consumer: Starting event loop
[2022-05-01 20:37:42,681: DEBUG/MainProcess] | Worker: Hub.register Pool...
[2022-05-01 20:37:42,684: INFO/MainProcess] celery@DESKTOP-HSENS6B ready.
[2022-05-01 20:37:42,684: DEBUG/MainProcess] basic.qos: prefetch_count->16
```

## celery 架构

![alt](https://ask.qcloudimg.com/http-save/yehe-6799667/2f28m2f58r.png)

- 任务调用提交任务执行请求给 Broker 队列

- 如果是异步任务，worker 会立即从队列中取出任务并执行，`执行结果保存在 Backend` 中

- 如果是定时任务，任务由 Celery Beat 进程周期性地将任务发往 Broker 队列，Worker 实时监视消息队列获取队列中的任务执行

![alt](https://ask.qcloudimg.com/http-save/yehe-6799667/wvxxoisf54.png)

celery 作为分布式的任务队列框架，worker 是可以执行在不同的服务器上的。部署过程和单机上启动是一样。只要把项目代码 copy 到其他服务器，使用相同命令就可以了。可以思考下，这个是怎么实现的？对了，就是`通过共享 Broker 队列`。使用合适的队列，如 redis，单进程单线程的方式可以有效的避免同个任务被不同 worker 同时执行

- `celery` 为分布式队列，**通过消息队列连接任务提交和执行者**，松耦合模式，可扩展

- celery 消息队列建议为 redis

- celery 通过 `@app.task` 装饰把普通任务变成 celery 任务

- celery worker 通过不同 queue 支持特定的 worker 消费特定的任务

- `@app.task` 中可以同步 base 和 bind 参数获取更过的控制任务生命周期

- `flower` 监控 celery 全过程

## 配置

## 记录

### task.apply_async 和 task.delay

## 问题记录

### 怎么把结果返回给调用方

那么问题来了，如何告知生产者？因为生产者生产完消息之后就结束了。
那么这个时候就使用到了 backend 这个参数了：

当我们像指明 broker 一样指明了 backend 之后，当 worker 运行完结果之后就会把他返回给生产者的唯一 id 作为键，将结果作为值传递给你设置的 worker(backend 测试环境为 redis). 这个时候你无论在什么时候只要拿着这个值去 redis 里面查找到结果就行了。比如你在执行一个任务，你可以设置一个周期性轮询，去查看这个结果是否已经被生产出来，如果生产出来便取到该值做相应的操作即可

## 最佳实践

- [工程级别 Celery 应用](https://mp.weixin.qq.com/s?search_click_id=4097273415185413837-1651106841564-351520&__biz=MzI0MTU5MzA3MA==&mid=2247483711&idx=1&sn=7e362e8c1ba492faf7c0ba7ed6732f9c&chksm=e9087ebede7ff7a83db8d71014e966553cdb06f77025d4641f3852d32be3c012b262263b1d22&scene=0&subscene=10000&clicktime=1651106841&enterid=1651106841#rd)

- [Celery 最佳实践](https://www.cnblogs.com/ajianbeyourself/p/3889017.html)

### 消息队列选择

| 服务           | redis                                                                                  | rabbitmq                                                                                                 |
| :------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| 可靠消费       | 没有相应的机制保证消息的消费，当消费者消费失败的时候，消息体丢失，需要手动处理（list） | 具有消息消费确认，即使消费者消费失败，也会自动使消息体返回原队列，同时可全程持久化，保证消息体被正确消费 |
| 可靠发布       | 不提供                                                                                 | 具有发布确认功能，保证消息被发布到服务器                                                                 |
| 高可用         | 可以采用主从模式，读写分离，但是故障转移尚未完善                                       | 集群采用磁盘、内存节点，任意单点故障都不会影响整个队列的操作                                             |
| 持久化         | 需要将整个 Redis 实例持久化到磁盘 队列，消息，都可以选择是否持久化                     |
| 消费者负载均衡 | 不提供                                                                                 | 根据消费者情况，进行消息的均衡分发                                                                       |
| 队列监控       | 不提供                                                                                 | 后台可以监控某个队列的所有信息，（内存，磁盘，消费者，生产者，速率等）                                   |
| 流量控制       | 不提供                                                                                 | 服务器过载的情况，对生产者速率会进行限制，保证服务可靠性                                                 |

# 其他
