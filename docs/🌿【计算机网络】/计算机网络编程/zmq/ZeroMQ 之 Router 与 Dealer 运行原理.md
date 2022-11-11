- [HWM 高水位](#hwm-高水位)
- [Envelope 信封](#envelope-信封)
- [`Request / Response` 消息格式](#request--response-消息格式)
  - [发送数据](#发送数据)
  - [接收数据](#接收数据)
  - [dealer](#dealer)
- [总结](#总结)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码，原文地址 [blog.csdn.net](https://blog.csdn.net/kobejayandy/article/details/20163783)

![alt](https://img-blog.csdnimg.cn/img_convert/ee5213e688e574a9a3cdcf96b5a9958c.png)

- `client` 对应ZMQ_REQ类型的zmq_socket

- `worker` 对应ZMQ_REP类型的zmq_socket

- `broker` 创建一个 `router` 和一个 `dealer`，`router` 接受 `client` 的消息并转发给 `worker`，`worker` 再把处理结果发送给 `dealer`，`dealer`再转发给 `client`

## HWM 高水位

在开始这部分的内容之前，先来看看 ZeroMQ 中 `HWM(Hith-Water Marks)`概念

- 当系统的数据量很大，而且发送频率很高的情况下，内存就很重要了，如果处理不好会出现很多问题，例如如下场景:

  A 很快速的向 B 发送数据，但是 B 处理起来却很慢，这样子的话，数据就可能会在 A 的发送缓冲区，或者 B 的接收缓冲区累计起来，如果双方速度差太多，就很容易出现问题.

- 在 ZeroMQ 中，建立了 pipe 的概念 (或者说数据缓冲)，那么实际情况下就会如下图:

  ![alt](https://img-blog.csdn.net/20131124184822718?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

  这个时候，HWM 就是指这个缓冲区的容量大小，现在 `v3.x` 的版本，都是默认为 1000.

- 而且不同类型的 socket 拥有的缓冲区类型也不一样，例如 Publish 与 Push 只有发送缓冲区，Subscribe 与 Pull 什么的就只有接受缓冲区，Router，Dealer 啥的就有两种类型的缓冲区。

  这里不同类型的 socket，当他们的缓冲区满了以后表现出来的行为也不一样，

  例如 Publish 与 Router 会丢弃 message，而其他的就表现为阻塞。

好了，打这里算是知道了在 ZeroMQ 中 HWM 这东西到底指的是神马意思了。

## Envelope 信封

接下来来看另外一个概念: `Envelope`(信封，封皮)

**说白了就是在不接触具体数据的情况下，在数据的外面套上一个外套**，在 ZeroMQ 中主要是指在数据的外面加上一个 Address，或者说`标志位`吧，其实到这里就基本上能够知道 router 以及 dealer 的运行原理了，其实就算不知道这个，猜也能猜到是 router 与 dealer 是怎么实现的。

## `Request / Response` 消息格式

接下来具体来说明 `Request/Response` 的消息格式：

- 在这种通信模式中，每一个 request 都会对应有一个 response，我们知道 ZeroMQ 有自己定义的帧格式，拿 Request 发送 hello 字符串为例子，数据如下：

  ![alt](https://img-blog.csdn.net/20131124191029250?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 后面两个固定的帧是肯定有的，前面的 address 帧不一定会有（按照我们前面的用法，其实都没有的）；那么`当 response 端收到这个数据之后，它会将前面的数据都先去掉，只将数据帧里面的数据提交给用户定义的代码`（前面将 hello 数据封装，到后来 response 对数据进行处理都是由 ZeroMQ 来做的）。

### 发送数据

- 其实对于我们简单的 Request/Response 通信，`发送和返回的数据`都是由两个帧构成的，先是一个空帧，作为分隔符，然后就是数据帧。

- 但是当我们在通信中加入了 Router 和 Dealer 之后，就变了，他们会对我们发送的数据做一些手脚。

  ![alt](https://img-blog.csdn.net/20131124191730375?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

  整个通信结构变成了上图，先来说一下 Router 的比较特殊的行为，`他将会跟踪每一个与其建立的连接，并且为每一个链接都分配一个标志，这个标志当然是唯一的咯，用于区分每一个建立的链接`；所以我们通过 Router 发送数据到 Request 的时候，我们要发送的数据首先得要包含一个标志帧，这样 Router 才能知道应该发送给哪一个 Request 的连接，然后再将标志帧后面的数据发送出去（将前面的标志帧移除）。也就是说我们通过 router 发送数据的时候，数据应该是如下的格式：

  ![alt](https://img-blog.csdn.net/20131124192218187?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

### 接收数据

`当 router 接收到数据之后，在将数据提交给用户代码之前，会在数据之前加上一个标志帧，用于指代这个数据是从哪一个链接接受过来的`，也就是将数据变成上图的格式交给用户代码，而不是取出纯净的数据交给用户代码。

例如如下如下图的数据格式：

![alt](https://img-blog.csdn.net/20131124192830125?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

前面一个帧，存有标志，用于指代 router 从哪一个连接接收到的数据，接着是一个分割帧，然后才是数据帧。

### dealer

好了，讲完 router 的行为，下面接下来说 Dealer 的行为：

Dealer 其实很简单，直接将前面的数据不做任何的改变，直接发送给 Response 端，`当 Response 端接收到数据以后，会将前面的地址帧，还有分隔帧去掉，然后将纯净的数据提交给用户代码`。

如果 Response 返回 world 字符串，那么 Response 会对这个数据包装，而且会将前面拆掉的标志帧又套上去，那么数据就变成了如下：

![alt](https://img-blog.csdn.net/20131124193347843?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

dealer 收到了上图格式的数据，再通过 router 发送回 request 端，这个时候就可以通过前面的标志帧来知道究竟应该将数据发送给哪一个连接了。最后数据会变成如下的格式发送给 request 端：

![alt](https://img-blog.csdn.net/20131124193522093?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvZmpzbG92ZWpobA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这样 request 端就能够接收到正确的数据。

## 总结

- 对于 Request 类型的 socket，它是同步的，它一个时刻只能对一个连接进行操作，在一个连接上发送了数据之后，必须接着在这个连接上执行 recv，也就是 send 与 recv 必须同时匹配出现。

- Response 类型的 socket 也是同步的，与 Request 的意思差不多，不过顺序是先 recv 再 send。

- Router 类型的 socket 是异步的，他可以在随时执行 recv 与 send，而不必在同一时刻必须要强制在某个连接上进行操作。它会根据标志帧来具体的区分应该在哪一个链接上进行操作

- Dealer 类型的 socket，这个更简单的，异步。它基本上就没做啥工作。。

到这里基本就已经清楚了 Router 以及 Dealer 的运行原理，其实跟自己以前猜的差不多。
