- [现象](#现象)
- [原因及解决](#原因及解决)
- [TCP keepalive](#tcp-keepalive)
- [检测对端状态](#检测对端状态)
- [防止空闲连接断开](#防止空闲连接断开)
- [使用举例](#使用举例)
- [参考资料](#参考资料)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/guotianqing/article/details/102961474)

## 现象

使用 Zmq pub/sub 模式，多个 sub 订阅一个 pub 的数据。pub 会不定期推送数据，有时很多，有时 2 个小时也没有数据。

pub 端和 sub 端部署在互联网环境中，sub 端可能是分散到各地的服务器。

最近发现，当 pub 长时间没有发送数据时，sub 之后就再也接收不到数据了。而且这种现象也不是 100%，测试了几天，有个 80% 的样子吧。

在 pub 端，netstat 查看时，连接已经没有了，而在 sub 端连接仍然存在。好奇怪！

## 原因及解决

由于一段时间没有发现原因，为了测试，我在 pub 端同一机器上部署了 sub 端，而这个 sub 端一点问题也没有，哈哈。

以前以为，只要连接断开，Zmq 的 connect 就会自动重连，所以不需要关心连接的问题。

根据文档和测试，也确实是这样。**但是请注意，这里说的连接断开是正常的断开，有 4 次挥手的断开，也就是说通信双方都知道连接断开了。**

但有时，并非如此。在复杂的网络环境中，通信双方大概率会经过 NAT 等网络设备，它们会悄无声息地关闭连接。并且，在长连接长时间无数据时，通信双方根本无法知晓。

下面开始验证猜想。很简单，为了保持网络连接，增加心跳即可。应用层的心跳也简单，但根据 ZMQ 文档，最好使用 TCP 的 keepalive。

> If we use a TCP connection that stays silent for a long while, it will, in some networks, just die. Sending something (technically, a “keep-alive” more than a heartbeat), will keep the network alive.

查看 zmq_setsockopt API 文档，发现了好东西 (以下说明是我查资料后自己的理解，详情请参考下文链接)：

- `ZMQ_TCP_KEEPALIVE`

    设置 SO_KEEPALIVE 属性，是否开启 keepalive 特性。默认为 - 1，使用操作系统默认值，即不开启。

- `ZMQ_TCP_KEEPALIVE_CNT`

    设置 TCP_KEEPCNT 属性，如果保活包没有收到响应，连接重试的次数。在达到这个次数仍然无响应的，标记该连接不可用。Windoes 好象默认是 10。

- `ZMQ_TCP_KEEPALIVE_IDLE`

    设置 TCP_KEEPALIVE 属性，如果连接在该段时间内持续空闲，将发送第一个保活包。Windows 默认为 2 小时。

- `ZMQ_TCP_KEEPALIVE_INTVL`

    设置 TCP_KEEPINTVL 属性，如果发送的保活包没有应答，则间隔该时长继续发送保活包，直到连接标识连接断开。Windows 默认为 1s。

于是，我修改了程序，设置启用 keepalive，且 `ZMQ_TCP_KEEPALIVE_IDLE` 为 120s，其他保持默认就好。

如下代码片断：

c/c++:

```cpp
// 开启TCP保活机制，防止网络连接因长时间无数据而被中断
int tcp_keep_alive = 1;
zmq_setsockopt(fd, ZMQ_TCP_KEEPALIVE, &tcp_keep_alive, sizeof(tcp_keep_alive));

// 网络连接空闲2min即发送保活包
int tcp_keep_idle = 120;
zmq_setsockopt(fd, ZMQ_TCP_KEEPALIVE_IDLE, &tcp_keep_idle, sizeof(tcp_keep_idle));

```

python:

```py
# self.client is my socket here
self.client.setsockopt(zmq.TCP_KEEPALIVE, 1)
self.client.setsockopt(zmq.TCP_KEEPALIVE_IDLE, 120)
self.client.setsockopt(zmq.TCP_KEEPALIVE_INTVL, 1) # 随意

```

这样，连接就不再断开了。即使断开了，2min 后，keepalive 属性会检测到连接不可用，zmq 的重连机制就生效喽！

如果想了解更加详细信息，可以继续阅读。

## TCP keepalive

顾名思义，TCP keepalive 属性就是要保持 TCP 连接的活动性（可用性）；该属性主要用来检测 TCP sockets 的连接状态，是可用的还是已经断开。

- 原理

    当建立 TCP 连接的时候，会关联到一些定时器，其中一些定时器用来处理 keepalive 事务。

    当该定时器到 0 时，发送到对端一个 keepalive 探测包（下称保活包），保活包没有真实的数据，并且需要对端响应 ACK。

    由于 TCP/IP 协议的支持，不管对端是否设置了 keepalive 属性，它收到保活包后，都会响应 ACK。

    如果接收到了 ACK，那么该连接是可用的。如果没有收到，那么在该连接上的应用数据可能会出现异常。

- 使用场景

    不使用 keepalive 依然可以安全地使用 TCP 通信。不过，既然你读到了这里，很可能是因为你遇到了问题，很可能，读完这篇短文后你会尝试使用 keepalive 解决问题。

    当然，也可能是你没有找到比读这些东西更有趣的事情了，哈哈。

    keepalive 默认是关闭的。打开它也很方便，不会造成问题，不过会产生一些额外的流量，可能会对路由器或者防火墙产生影响。

- 总而言之，keepalive 主要用于以下 2 个场景：

    检测对端是否已死

    防止由于网络空闲导致的连接断开

下面阐述。

## 检测对端状态

TCP 的连接和断开都是有握手的。为什么还需要检测呢？如果对端断开了，我的 socket 会进行 4 次挥手的啊。正常情况下，上述语句正确。但是，以下情况呢：

- 内核崩溃

- 进程异常终止退出

- 对端正常，但是网络断了，如网线掉了或者被路由器 / 防火墙断了

以上情况下，对端会在不跟你说 byebye 的情况下挂掉，你的 socket 就不会得到通知了。这里，tcp 连接状态看起来没有什么异常，但应用数据会发送失败。

典型的情况是，A 和 B 通过三次握手建立了连接，并进行通信。在连接空闲期间，突然，B 断电了，而且没有跟 A 进行 4 次挥手。B 来电重启后，这时，A 知道自己有一个已经建立好的连接可以跟 B 通信，但 B 什么也不知道。

当 A 给 B 发送数据时，因为对于 B 来说，在没有建立连接的情况下收到数据是异常的，会响应 RST，此时，A 才会明白，并关闭自己并不可用的连接。

Keepalive 能解决这个问题，它会在连接上定期发送保活包，当一端不可用时，会标识连接的不可用状态。

## 防止空闲连接断开

我是因为这个问题才写的这篇文章。通信双方会建立连接，通信，然后中间有 1.5 小时连接会空闲。再然后，我的客户端就收不到数据了。这就是空闲连接断开的案例。

这是一个很普遍的问题。网络环境较为复杂，中间可能会经过 NAT 代理、防火墙等网络设备。

取决于这些网络设备对连接跟踪的具体实现，由于设备本身的物理限制，如内存等，它们只能跟踪有限的连接。它们通常会保持新近活动的连接而把最先不活跃的连接删除。

回到 AB 通信的例子，AB 保持长连接是它们自身所需，但是网络代理并不知道，所以当 AB 再次通信时，代理已经没有该连接的记录，自然无法正常处理数据包，连接断开。

这些网络设备通常使用所谓的 LRU 机制删除内存中的连接，所以，定期在连接上发送数据可以保持连接不会被删除，因为它总是很活跃的！

示意图如下：

```log
    _____           _____                                     _____
   |     |         |     |                                   |     |
   |  A  |         | NAT |                                   |  B  |
   |_____|         |_____|                                   |_____|
      ^               ^                                         ^
      |--->--->--->---|----------- SYN ------------->--->--->---|
      |---<---<---<---|--------- SYN/ACK -----------<---<---<---|
      |--->--->--->---|----------- ACK ------------->--->--->---|
      |               |                                         |
      |               | <--- connection deleted from table      |
      |               |                                         |
      |--->- PSH ->---| <--- invalid connection                 |
      |               |                                         |

```

## 使用举例

函数 SetSockOpt 用来设置 socket 的属性。1 ~ 2147460 之间的秒数都是合法的值，设置为 0 时，关闭该选项，设置值超过最大值时，按最大值生效。GetSockOpt 用来获取已经设备的值。单位是秒。

参考代码片断如下：

```c++
//---------------------------------------
// Initialize variables and call setsockopt. 
// The SO_KEEPALIVE parameter is a socket option 
// that makes the socket send keepalive messages
// on the session. The SO_KEEPALIVE socket option
// requires a boolean value to be passed to the
// setsockopt function. If TRUE, the socket is
// configured to send keepalive messages, if FALSE
// the socket configured to NOT send keepalive messages.
// This section of code tests the setsockopt function
// by checking the status of SO_KEEPALIVE on the socket
// using the getsockopt function.

bOptVal = TRUE;

iResult = getsockopt(ListenSocket, SOL_SOCKET, SO_KEEPALIVE,
                     (char *) &iOptVal, &iOptLen);

if (iResult == SOCKET_ERROR) {
    wprintf(L"getsockopt for SO_KEEPALIVE failed with error: %u\n", WSAGetLastError());
} else {
    wprintf(L"SO_KEEPALIVE Value: %ld\n", iOptVal);
}

iResult = setsockopt(ListenSocket, SOL_SOCKET, SO_KEEPALIVE,
                     (char *) &bOptVal, bOptLen);
if (iResult == SOCKET_ERROR) {
    wprintf(L"setsockopt for SO_KEEPALIVE failed with error: %u\n", WSAGetLastError());
} else {
    wprintf(L"Set SO_KEEPALIVE: ON\n");
}

iResult = getsockopt(ListenSocket, SOL_SOCKET, SO_KEEPALIVE,
                     (char *) &iOptVal, &iOptLen);
if (iResult == SOCKET_ERROR) {
    wprintf(L"getsockopt for SO_KEEPALIVE failed with error: %u\n", WSAGetLastError());
} else {
    wprintf(L"SO_KEEPALIVE Value: %ld\n", iOptVal);
}

```

代码片断来源于参考资料，有兴趣可以详细阅读。

## 参考资料

- [ZeroMQ Client Lose Connection](https://stackoverflow.com/questions/12778299/zeromq-client-lose-connection)  

- [zmq_setsockopt(3)](http://api.zeromq.org/4-2:zmq-setsockopt)  

- [Things that you may want to know about TCP Keepalives](https://blogs.technet.microsoft.com/nettracer/2010/06/03/things-that-you-may-want-to-know-about-tcp-keepalives/)  

- [SO_KEEPALIVE socket option](https://docs.microsoft.com/en-us/windows/win32/winsock/so-keepalive)  

- [TCP Keepalive HOWTO](http://www.tldp.org/HOWTO/TCP-Keepalive-HOWTO/overview.html)  

- [setsockopt function](https://docs.microsoft.com/en-us/windows/win32/api/winsock/nf-winsock-setsockopt)
