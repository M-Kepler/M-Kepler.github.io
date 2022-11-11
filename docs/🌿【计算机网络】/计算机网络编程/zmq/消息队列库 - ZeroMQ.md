- [消息队列库 - ZeroMQ](#消息队列库---zeromq)
  - [主线程与 I/O 线程](#主线程与-io-线程)
  - [四种通信模型](#四种通信模型)
  - [ZMQ API](#zmq-api)
    - [Context](#context)
    - [Sockets](#sockets)
    - [Messages](#messages)
    - [代理](#代理)
    - [错误处理](#错误处理)
    - [加密传输](#加密传输)
  - [总结](#总结)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.cnblogs.com](https://www.cnblogs.com/chenny7/p/6245236.html)

# 消息队列库 - ZeroMQ

[ZeroMQ](http://zguide.zeromq.org/page:all)（简称 ZMQ）是一个基于消息队列的多线程网络库，其对套接字类型、连接处理、帧、甚至路由的底层细节进行抽象，提供跨越多种传输协议的套接字。

ZMQ 是网络通信中新的一层，**介于应用层和传输层之间**（按照 TCP/IP 划分），其是一个可伸缩层，可并行运行，分散在分布式系统间。

ZMQ 不是单独的服务，而是一个嵌入式库，**它封装了网络通信、消息队列、线程调度等功能，向上层提供简洁的 API**，应用程序通过加载库文件，调用 API 函数来实现高性能网络通信。

![alt](https://images2015.cnblogs.com/blog/603001/201701/603001-20170103151243753-98408217.png)

## 主线程与 I/O 线程

**I/O 线程**

- ZMQ 根据用户调用 `zmq_init` 函数时传入的参数，创建对应数量的 I/O 线程。每个 I/O 线程都有与之绑定的 Poller，Poller 采用经典的 Reactor 模式实现。

- Poller 根据不同操作系统平台使用不同的网络 I/O 模型（select、poll、epoll、devpoll、kequeue 等），所有的 I/O 操作都是异步的，线程不会被阻塞。。

- **主线程**与 I/O 线程通过 Mail Box 传递消息来进行通信。

![alt](https://images2015.cnblogs.com/blog/603001/201701/603001-20170103151902284-503605450.png)

- Server，在主线程创建 `zmq_listener`，通过 Mail Box 发消息的形式将其绑定到 I/O 线程，I/O 线程把 `zmq_listener` 添加到 Poller 中用以侦听读事件。

- Client，在主线程中创建 `zmq_connecter`，通过 Mail Box 发消息的形式将其绑定到 I/O 线程，I/O 线程把 `zmq_connecter` 添加到 Poller 中用以侦听写事件。

- Client 与 Server 第一次通信时，会创建 `zmq_init` 来发送 `identity`，用以进行认证。认证结束后，双方会为此次连接创建 Session，以后双方就通过 Session 进行通信。

- 每个 Session 都会关联到相应的读 / 写管道， 主线程收发消息只是分别从管道中读 / 写数据。Session 并不实际跟 kernel 交换 I/O 数据，而是通过 plugin 到 Session 中的 Engine 来与 kernel 交换 I/O 数据。

## 四种通信模型

- **一对一结对模型（Exclusive-Pair）**

  可以认为是一个 TCP Connection，但是 TCP Server 只能接受一个连接。数据可以双向流动，这点不同于后面的请求回应模型。

- **请求回应模型（Request-Reply）**

  由 Client 发起请求，并由 Server 响应，跟一对一结对模型的区别在于可以有多个 Client。

- **发布订阅模型（Publish-Subscribe）**

  Publish 端单向分发数据，且不关心是否把全部信息发送给 Subscribe 端。

  如果 Publish 端开始发布信息时，Subscribe 端尚未连接进来，则这些信息会被直接丢弃。

  Subscribe 端只能接收，不能反馈，且在 Subscribe 端消费速度慢于 Publish 端的情况下，会在 Subscribe 端堆积数据。

- **管道模型（Push-Pull）**

  从 PUSH 端单向的向 PULL 端单向的推送数据流。如果有多个 PULL 端同时连接到 PUSH 端，则 PUSH 端会在内部做一个负载均衡，采用平均分配的算法，**将所有消息均衡发布到 PULL 端上**。

  与发布订阅模型相比，管道模型在没有消费者的情况下，发布的消息不会被消耗掉；在消费者能力不够的情况下，能够提供多消费者并行消费解决方案。该模型主要用于多任务并行。

这 4 种模型总结出了通用的网络通信模型，在实际中可以根据应用需要，组合其中的 2 种或多种模型来形成自己的解决方案。

ZMQ 提供进程内（`inproc://`）、进程间（`ipc://`）、机器间（`tcp://`）、广播（`pgm://`）等四种通信协议。

## [ZMQ API](http://api.zeromq.org/)

ZMQ 提供的所有 API 均以 `zmq_` 开头

```cpp
#include <zmq.h>

gcc [flags] files -lzmq [libraries]
```

例如，返回当前 ZMQ 库的版本信息

```cpp
void zmq_version (int *major, int *minor, int *patch);

```

### Context

在使用任何 ZQM 库函数之前，必须首先创建 ZMQ context（上下文），程序终止时，也需要销毁 context。

**创建 context**

```cpp
void *zmq_ctx_new ();

```

ZMQ context 是**线程安全**的，可以在多线程环境使用，而不需要程序员对其加 / 解锁。

在一个进程中，可以有多个 ZMQ context 并存。

**设置 context 选项**

```cpp
int zmq_ctx_set (void *context, int option_name, int option_value);
int zmq_ctx_get (void *context, int option_name);

```

**销毁 context**

```cpp
int zmq_ctx_term (void *context);

```

### Sockets

ZMQ Sockets 是代表异步消息队列的一个抽象，注意，这里的 ZMQ socket 和 POSIX 套接字的 socket 不是一回事，ZMQ 封装了物理连接的底层细节，对用户不透明。

传统的 POSIX 套接字只能支持 1 对 1 的连接，而 ZMQ socket 支持多个 Client 的并发连接，甚至在没有任何对端（peer）的情况下，ZMQ sockets 上也能放入消息；

ZMQ sockets 不是线程安全的，因此，不要在多个线程中并行操作同一个 sockets。

**创建 ZMQ  Sockets**

```cpp
void *zmq_socket (void *context, int type);

```

注意，ZMQ socket 在 bind 之前还不能使用。

<table border="1" cellspacing="0" cellpadding="0"><caption>type 参数含义</caption><tbody><tr><td valign="top" width="130"><p><strong><em>pattern</em></strong></p></td><td valign="top" width="113"><p><strong><em>type</em></strong></p></td><td valign="top" width="325"><p><strong><em>description</em></strong></p></td></tr><tr><td valign="top" width="130"><p>一对一结对模型</p></td><td valign="top" width="113"><p>ZMQ_PAIR</p></td><td valign="top" width="325"></td></tr><tr><td rowspan="4" valign="top" width="130"><p>请求回应模型</p></td><td valign="top" width="113"><p>ZMQ_REQ</p></td><td valign="top" width="325"><p>client 端使用</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_REP</p></td><td valign="top" width="325"><p>server 端使用</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_DEALER</p></td><td valign="top" width="325"><p>将消息以轮询的方式分发给所有对端（peers）</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_ROUTER</p></td><td valign="top" width="325"></td></tr><tr><td rowspan="4" valign="top" width="130"><p>发布订阅模型</p></td><td valign="top" width="113"><p>ZMQ_PUB</p></td><td valign="top" width="325"><p>publisher 端使用</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_XPUB</p></td><td valign="top" width="325"></td></tr><tr><td valign="top" width="113"><p>ZMQ_SUB</p></td><td valign="top" width="325"><p>subscriber 端使用</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_XSUB</p></td><td valign="top" width="325"></td></tr><tr><td rowspan="2" valign="top" width="130"><p>管道模型</p></td><td valign="top" width="113"><p>ZMQ_PUSH</p></td><td valign="top" width="325"><p>push 端使用</p></td></tr><tr><td valign="top" width="113"><p>ZMQ_PULL</p></td><td valign="top" width="325"><p>pull 端使用</p></td></tr><tr><td valign="top" width="130"><p>原生模型</p></td><td valign="top" width="113"><p>ZMQ_STREAM</p></td><td valign="top" width="325"></td></tr></tbody></table>

**设置 socket 选项**

```cpp
int zmq_getsockopt (void *socket, int option_name, void *option_value, size_t *option_len);

int zmq_setsockopt (void *socket, int option_name, const void *option_value, size_t option_len);

```

**关闭 socket**

```cpp
int zmq_close (void *socket);

```

**创建一个消息流**

```cpp
int zmq_bind (void *socket, const char *endpoint);

int zmq_connect (void *socket, const char *endpoint);

```

bind 函数是将 socket 绑定到本地的端点（endpoint），而 connect 函数连接到指定的 peer 端点。

endpoint 支持的类型：

<table border="1" cellspacing="0" cellpadding="0"><tbody><tr><td valign="top" width="111"><p><strong><em>transports</em></strong></p></td><td valign="top" width="132"><p><strong><em>description</em></strong></p></td><td valign="top" width="173"><p><strong><em>uri example</em></strong></p></td></tr><tr><td valign="top" width="111"><p>zmp_tcp</p></td><td valign="top" width="132"><p>TCP 的单播通信</p></td><td valign="top" width="173"><p>tcp://*:8080</p></td></tr><tr><td valign="top" width="111"><p>zmp_ipc</p></td><td valign="top" width="132"><p>本地进程间通信</p></td><td valign="top" width="173"><p>ipc://</p></td></tr><tr><td valign="top" width="111"><p>zmp_inproc</p></td><td valign="top" width="132"><p>本地线程间通信</p></td><td valign="top" width="173"><p>inproc://</p></td></tr><tr><td valign="top" width="111"><p>zmp_pgm</p></td><td valign="top" width="132"><p>PGM 广播通信</p></td><td valign="top" width="173"><p>pgm://</p></td></tr></tbody></table>

**收发消息**

```cpp
int zmq_send (void *socket, void *buf, size_t len, int flags);

int zmq_recv (void *socket, void *buf, size_t len, int flags);

int zmq_send_const (void *socket, void *buf, size_t len, int flags);

```

- `zmq_recv()` 函数的 len 参数指定接收 buf 的最大长度，超出部分会被截断，函数返回的值是接收到的字节数，返回 - 1 表示出错；

- `zmq_send()` 函数将指定 buf 的指定长度 len 的字节写入队列，函数返回值是发送的字节数，返回 - 1 表示出错；

- `zmq_send_const()` 函数表示发送的 buf 是一个常量内存区（constant-memory），这块内存不需要复制、释放。

**socket 事件监控**

```cpp
int zmq_socket_monitor (void *socket, char * *addr, int events);

```

`zmq_socket_monitor()` 函数会生成一对 sockets，publishers 端通过 inproc:// 协议发布 sockets 状态改变的 events；

消息包含 2 帧，第 1 帧包含 events id 和关联值，第 2 帧表示受影响的 endpoint。

监控支持的 events：

- `ZMQ_EVENT_CONNECTED`: 建立连接

- `ZMQ_EVENT_CONNECT_DELAYED`: 连接失败

- `ZMQ_EVENT_CONNECT_RETRIED`: 异步连接 / 重连

- `ZMQ_EVENT_LISTENING`: bind 到端点

- `ZMQ_EVENT_BIND_FAILED`: bind 失败

- `ZMQ_EVENT_ACCEPTED`: 接收请求

- `ZMQ_EVENT_ACCEPT_FAILED`: 接收请求失败

- `ZMQ_EVENT_CLOSED`: 关闭连接

- `ZMQ_EVENT_CLOSE_FAILED`: 关闭连接失败

- `ZMQ_EVENT_DISCONNECTED`: 会话（tcp/ipc）中断

**I/O 多路复用**

```cpp
int zmq_poll (zmq_pollitem_t *items, int nitems, long timeout);

```

对 sockets 集合的 I/O 多路复用，使用水平触发。

与 epoll 类似，items 参数指定一个结构体数组（结构体定义如下），nitems 指定数组的元素个数，timeout 参数是超时时间（单位：ms，0 表示不等待立即返回，-1 表示阻塞等待）。

```cpp
typedef struct
{
    void *socket;
    int fd;
    short events;
    short revents;
} zmq_pollitem_t;

```

对于每个 `zmq_pollitem_t` 元素，ZMQ 会同时检查其 socket（ZMQ 套接字）和 fd（原生套接字）上是否有指定的 events 发生，且 ZMQ 套接字优先。

events 指定该 sockets 需要关注的事件，revents 返回该 sockets 已发生的事件，它们的取值为：

- `ZMQ_POLLIN`，可读；

- `ZMQ_POLLOUT`，可写；

- `ZMQ_POLLERR`，出错；

### Messages

一个 ZMQ 消息就是一个用于在消息队列（进程内部或跨进程）中进行传输的数据单元，ZMQ 消息本身没有数据结构，因此支持任意类型的数据，这完全依赖于程序员如何定义消息的数据结构。

一条 ZMQ 消息可以包含多个消息片（multi-part messages），每个消息片都是一个独立 zmq_msg_t 结构。

ZMQ 保证以原子方式传递消息，要么所有消息片都发送成功，要么都不成功。

**初始化消息**

```cpp
typedef void (zmq_free_fn) (void *data, void *hint);
int zmq_msg_init (zmq_msg_t *msg);
int zmq_msg_init_data (zmq_msg_t *msg, void *data, size_t size, zmq_free_fn *ffn, void *hint);
int zmq_msg_init_size (zmq_msg_t *msg, size_t size);

```

- `zmq_msg_init()` 函数初始化一个消息对象 `zmq_msg_t` ，不要直接访问 `zmq_msg_t` 对象，可以通过 `zmq_msg_*` 函数来访问它。

- `zmq_msg_init()、zmq_msg_init_data()、zmq_msg_init_size()` 三个函数是互斥的，每次使用其中一个即可。

**设置消息属性**

```cpp
int zmq_msg_get (zmq_msg_t *message, int property);

int zmq_msg_set (zmq_msg_t *message, int property, int value);

```

**释放消息**

```cpp
int zmq_msg_close (zmq_msg_t *msg);

```

**收发消息**

```cpp
int zmq_msg_send (zmq_msg_t *msg, void *socket, int flags);

int zmq_msg_recv (zmq_msg_t *msg, void *socket, int flags);

```

 其中，flags 参数如下：

- `ZMQ_DONTWAIT`，非阻塞模式，如果没有可用的消息，将 errno 设置为 EAGAIN；

- `ZMQ_SNDMORE`，发送 `multi-part messages` 时，除了最后一个消息片外，其它每个消息片都必须使用 `ZMQ_SNDMORE` 标记位。

**获取消息内容**

```cpp
void *zmq_msg_data (zmq_msg_t *msg);

int zmq_msg_more (zmq_msg_t *message);

size_t zmq_msg_size (zmq_msg_t *msg);

```

- `zmq_msg_data()` 返回指向消息对象所带内容的指针；

- `zmq_msg_size()` 返回消息的字节数；

- `zmq_msg_more()` 标识该消息片是否是整个消息的一部分，是否还有更多的消息片待接收；

**控制消息**

```cpp
int zmq_msg_copy (zmq_msg_t *dest, zmq_msg_t *src);

int zmq_msg_move (zmq_msg_t *dest, zmq_msg_t *src);

```

- `zmq_msg_copy()` 函数实现的是浅拷贝；

- `zmq_msg_move()` 函数中，将 dst 指向 src 消息，然后 src 被置空。

```cpp
zmq_msg_t part;
while (true) {
    //  Create an empty ØMQ message to hold the message part
    int rc = zmq_msg_init (&part);
    assert (rc == 0);

    //  Block until a message is available to be received from socket
    rc = zmq_msg_recv (socket, &part, 0);
    assert (rc != -1);

    if (zmq_msg_more (&part))
        fprintf (stderr, "more\n");
    else {
        fprintf (stderr, "end\n");
        break;
    }
    zmq_msg_close (&part);
}

```

### 代理

ZMQ 提供代理功能，代理可以在前端 socket 和后端 socket 之间转发消息。

```cpp
int zmq_proxy (const void *frontend, const void *backend, const void *capture);
int zmq_proxy_steerable (const void *frontend, const void *backend, const void *capture, const void *control);

```

- **共享队列（shared queue）**

  前端是 `ZMQ_ROUTER` socket，后端是 `ZMQ_DEALER` socket，proxy 会把 clients 发来的请求，公平地分发给 services；

- **转发队列（forwarded）**

  前端是 `ZMQ_XSUB` socket, 后端是 `ZMQ_XPUB` socket, proxy 会把从 publishers 收到的消息转发给所有的 subscribers；

- **流（streamer）**

  前端是 ZMQ_PULL socket, 后端是 ZMQ_PUSH socket.

proxy 使用的一个示例：

```cpp
//  Create frontend and backend sockets
void *frontend = zmq_socket (context, ZMQ_ROUTER);
assert (backend);

void *backend = zmq_socket (context, ZMQ_DEALER);
assert (frontend);

//  Bind both sockets to TCP ports
assert (zmq_bind (frontend, "tcp://*:5555") == 0);
assert (zmq_bind (backend, "tcp://*:5556") == 0);

//  Start the queue proxy, which runs until ETERM zmq_proxy frontend, backend, NULL);

```

### 错误处理

ZMQ 库使用 POSIX 处理函数错误，返回 NULL 指针或者负数时表示调用出错。

```cpp
int zmq_errno (void);

const char *zmq_strerror (int errnum);

```

- `zmq_errno()` 函数返回当前线程的错误码 errno 变量的值；

- `zmq_strerror()` 函数将错误映射成错误字符串。

### 加密传输

ZQM 可以为 IPC 和 TCP 连接提供安全机制：

- 不加密，`zmq_null`

- 使用用户名 / 密码授权，`zmq_plain`

- 椭圆加密，`zmq_curve`

这些通过 `zmq_setsockopt()` 函数设置 socket 选项的时候配置。

## 总结

1、仅仅提供 `24` 个 API 接口，风格类似于 BSD Socket。

2、处理了网络异常，包括连接异常中断、重连等。

3、改变 TCP 基于字节流收发数据的方式，处理了粘包、半包等问题，以 msg 为单位收发数据，结合 Protocol Buffers，可以对应用层彻底屏蔽网络通信层。

4、对大数据通过 `SENDMORE/RECVMORE` 提供分包收发机制。

5、通过线程间数据流动来保证同一时刻任何数据都只会被一个线程持有，以此实现多线程的 “去锁化”。

6、通过高水位 HWM 来控制流量，用交换 SWAP 来转储内存数据，弥补 HWM 丢失数据的缺陷。

7、服务器端和客户端的启动没有先后顺序。
