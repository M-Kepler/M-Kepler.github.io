- [`cotyledon`](#cotyledon)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
  - [利用 cotyledon 创建一个后台服务](#利用-cotyledon-创建一个后台服务)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `cotyledon`

> - OpenStack 中的一个 **多进程框架**， 网上资料贼少，看 `github` 说明吧
> - 看简介这是一个在 OpenStack Telemetry 版本出现的用来替换掉原有 oslo.service 来编写后台服务。
> - oslo_service 使用 eventlet 库通过多线程实现并发，而 **cotyledon 则使用了 multiprocess 库通过多进程实现并发**
> - 因此使用 cotyledon 实现的 daemon 服务不能通过 pdb 直接进行调试

### 参考资料

- [源码地址](https://github.com/sileht/cotyledon)

- [python 64 式: 第 32 式、多进程框架 cotyledon 探究与性能测试](https://blog.csdn.net/qingyuanluofeng/article/details/95533476)

### 使用记录

> 模块使用记录

### 利用 cotyledon 创建一个后台服务

> [详见](https://github.com/M-Kepler/Python/tree/master/kepler_os/src/lib/kepler/service)

### 模块学习

- cotyledon 的性能

  cotyledon 本质上是 python 的多进程库，如果开启 n 个 worker，其性能一般是开启 1 个 worker 的 n 倍。不过也要考虑如果开启太多 worker，可能会占据较多资源。 建议 n 个 cpu 可以开启 n 个 worker。注意: 确保自己的项目是进程安全的。

- cotyledon 是否共享内存

  cotyledon 一般来说不共享内存的，这就表明如果在 cotyledon 中开启多个 worker， 如果基于以下的需求: 计算速率型的结果，需要在 worker 中缓存前一次的结果，然后用当前结果和缓存的上一次结果计算数据 则原生不支持，因为会随机分发给任意一个 worker，则两次数据可能分别落到不同 worker 中，则不能支持上述业务场景。

- 两种主要的解决思路:

  - 不要在并发的业务场景中实现基于缓存的处理，即在消息过来之前，消息本身就已经是速率型的结果。

  - 需要自己实现负载划分，根据消息的某个属性，路由到和上次相同的 worker，才可以使用。

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方
