- [参考资料](#参考资料)
- [ZMQ](#zmq)
- [`API`](#api)
  - [`context`](#context)
  - [`socket`](#socket)
  - [`setsockopt`](#setsockopt)
  - [`zmq.proxy`](#zmqproxy)
  - [`zmq_poll`](#zmq_poll)
  - [`zmq.poller`](#zmqpoller)
- [事件](#事件)
- [其他](#其他)
  - [`POSIX socket` 和 `zmq` 对比](#posix-socket-和-zmq-对比)
    - [`socket`](#socket-1)
    - [`zmq`](#zmq-1)
- [常见问题](#常见问题)

# 参考资料

- [C/C++使用 ZeroMQ 的 Router/Dealer 模式搭建高性能后台服务框架](https://hottaro.com/index.php?mid=Framework&document_srl=256)

- [ZeroMQ 合集](https://blog.csdn.net/fjslovejhl/category_1756171.html)

- [★ ZMQ 指南](https://wizardforcel.gitbooks.io/zmq-guide/content/)

# ZMQ

说是一个消息中间件，但并没有解决消息的可靠性等问题，反而更像是一个 **网络通信框架**，是 socket 封装的一个库，可以帮助实现更强大、便捷的网络通信程序

# `API`

- [ZeroMQ API 官方接口文档](http://api.zeromq.org/)

- [消息队列库 - ZeroMQ](https://www.cnblogs.com/chenny7/p/6245236.html)

- [ZMQ 接口函数](https://www.cnblogs.com/fengbohello/tag/zeromq/)

## `context`

## `socket`

## `setsockopt`

- `IDENTIFY`

- `LINGER`

- `SNDHWM`

- `ROUTER_MANDATORY`

- `RCVTIMEO`

- `SNDTIMEO`

## `zmq.proxy`

## `zmq_poll`

[ZeroMQ 接口函数之：zmq_poll](https://www.cnblogs.com/fengbohello/p/4257438.html)

```cpp

/**
 * events 和 revents 成员是由以下标志进行位操作组成
 * ZMQ_POLLIN
 * ZMQ_POLLOUT
 * ZMQ_POLLERR
 */
typedef struct
{
    void *socket;
    int fd;
    short events;
    short revents;
}zmq_pollitem_t;


/**
 * 
 * `zmq_poll()` 函数为应用程序提供了一种对一组 `socket` 进行多路 I/O 事件水平触发的机制。
 *
 * @param zmq_pollitem_t* 结构体指针数组
 * @param int 结构体指针数组元素个数
 * @param int 超时
 * @return int
 */
int zmq_poll (zmq_pollitem_t *items, int nitems, long timeout);

```

## `zmq.poller`

# 事件

[ZeroMQ 接口函数之 ：zmq_socket_monitor - 注册一个监控回调函数](https://www.bbsmax.com/A/6pdDooO5w3/)

# 其他

## `POSIX socket` 和 `zmq` 对比

### `socket`

- 普通的 `socket` 是端到端`（1:1）`的关系，`ZMQ` 是 `N:M` 的关系

- `socket` 的连接需要显式地建立连接，销毁连接，选择协议`（TCP/UDP）`和错误处理，`ZMQ` 屏蔽了这些细节，他像是一个封装了的 `socket` 库，他让网络编程变得更加简单。

### `zmq`

- `ZMQ` 不光用于主机与主机间的 `socket` 通信，还可以是线程和进程间的通信。

- `ZMQ` 提供的套接字可以再多种协议中传输消息，线程间、进程间、`TCP` 等。可以使用套接字创建多种消息模型。

- `ZMQ` 提供进程内`（inproc://）`、进程间`（ipc://）`、机器间`（tcp://）`、广播`（pgm://）`等四种通信协议。

- `zmq` 的缺点

  **只是一个网络并发库而已，不能充当消息队列的角色，消息是缓存在 socket 缓冲区，也就是说最大只能装 `8 * 1024` 字节**

- 处理了网络异常，包括连接异常中断、重连等。

- 改变 TCP 基于字节流收发数据的方式，处理了粘包、半包等问题，以 msg 为单位收发数据，结合 Protocol Buffers，可以对应用层彻底屏蔽网络通信层。

- 对大数据通过 SENDMORE/RECVMORE 提供分包收发机制。

- 通过线程间数据流动来保证同一时刻任何数据都只会被一个线程持有，以此实现多线程的 “去锁化”。

- 通过高水位 HWM 来控制流量，用交换 SWAP 来转储内存数据，弥补 HWM 丢失数据的缺陷。

- 服务器端和客户端的启动没有先后顺序。

- `zmq` 的 `socket` 是代表异步消息队列的一个抽象，和 `POSIX` 的 `socket` 不是一回事，`zmq` 封装了物理连接的底层细节。

# 常见问题

- `raise Again(errno) Again: Resource temporarily unavailable`

- 可不可以设置优先级

  在 `ROUTER-DEALER` 模型中，所有的 worker 都是公平地消费消息，没有优先级之分；不过可以通过多起一个这样的模型，把高低优先级的数据分开跑

- 有没有办法监控 zmq 的队列情况

  [在 Python 中使用 ZMQ 在客户端/服务器配置中进行嗅探器/监视](https://www.pythonheidong.com/blog/article/158447/d3308c278d0a265976d7)

- [Zmq pub/sub 无故连接中断解决之 —— TCP keepalive](https://blog.csdn.net/guotianqing/article/details/102961474)
