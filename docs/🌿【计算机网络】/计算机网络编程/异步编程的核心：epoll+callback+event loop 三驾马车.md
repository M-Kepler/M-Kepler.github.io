- [异步编程的核心：epoll+Callback+Event loop](#异步编程的核心epollcallbackevent-loop)
  - [1. epoll](#1-epoll)
    - [1.1 常见的网络模式](#11-常见的网络模式)
    - [1.2 epoll 网络模式](#12-epoll-网络模式)
  - [2. CallBack](#2-callback)
  - [3. Event loop](#3-event-loop)
  - [4. 小结](#4-小结)
  - [5. 参考](#5-参考)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.modb.pro](https://www.modb.pro/db/125310)

## 异步编程的核心：epoll+Callback+Event loop

### 1. epoll

#### 1.1 常见的网络模式

以 ipv4 中 tcp 协议编程为例:

1. 首先创建一个 socket 套接字，即用于监听的文件描述符 listen_fd，

2. 将它与具体的 ip 和端口号绑定，

3. 开启监听，

4. 使用一个循环来接受客户端的请求，

5. 创建子进程或者线程来处理已经连接的请求

```cpp
// 创建监听的文件描述符
listen_fd = socket()

// 绑定ip和端口
bind(listen_fd, ip和端口)

// 监听
listen(listen_fd)

// 循环处理链接和读写操作
while(1) {
    // 主进程用来接收连接
    new_client_fd = accept()
    // 创建子进程或线程处理,处理新的客户端的请求
}

```

**缺点**

> 这种模式的问题在于创建子进程、线程都有系统调用，每来一个新的 TCP 连接都需要分配一个进程或者线程，如果达到 C10K，意味着一台机器要维护 1 万个进程 / 线程，应对高并发的场景存在一定的性能问题。

**能不能让一个进程 / 线程来维护多个 socket 呢？当然，就是 I/O 多路复用技术。**

#### 1.2 epoll 网络模式

> 一个进程虽然任一时刻只能处理一个请求，但是处理每个请求的事件时，耗时控制在 1 毫秒以内，这样 1 秒内就可以处理上千个请求，把时间拉长来看，多个请求复用了一个进程，这就是多路复用，这种思想很类似一个 CPU 并发多个进程，所以也叫做时分多路复用。我们熟悉的 select/poll/epoll 内核提供给用户态的多路复用系统调用，进程可以通过一个系统调用函数从内核中获取多个事件。

对比 select/poll/epoll 的文章很多，这里不再阐述。因为 epoll 在性能方面相比 select、poll 存在很大的优势，所以我们直接来看 epoll 编程。epoll 相关的函数只有 3 个：

```cpp
//创建epoll的句柄
int epoll_create(int __size)
//将普通的网络文件描述符添加到epoll描述符中
int epoll_ctl(int __epfd, int __op, int __fd, struct epoll_event *__event)
//等待网络事件
int epoll_wait(int __epfd, struct epoll_event *__events, int __maxevents, int __timeout)


```

1. epoll_create 是创建一个 epoll 的描述符 epoll_fd

2. epoll_ctl 函数将 epoll_fd （(int __epfd） 和 socket_fd (int__fd) ，添加 EPOLL_CTL_ADD (int __op) 或删除 EPOLL_CTL_DEL (int__op) 到 epoll 反应堆中，最后一个参数 struct epoll_event *__event 是一个结构体，里边有 2 个参数需要设置：①设置触发模式 ev.events = EPOLLIN | EPOLLET; ，epoll 的触发模式包括边缘触发和水平触发 ②设置 socket 对应的 fd：ev.data.fd = listen_fd;

3. epoll_wait 是获取触发的事件，第 1 个参数为 epoll_fd, 第 2 个参数用于接收触发了事件的数组，后续处理就是遍历这个数组，第 3 个参数为可以处理的事件的最大值，第 4 个参数为等待时间，-1 表示阻塞等待，0 表示立即返回不等待，大于 0 的值为等待的时间。

**epoll 编程示例**

```cpp
//创建监听的文件描述符
listen_fd = socket()
//绑定ip和端口
bind(listen_fd, ip和端口)
//监听
listen(listen_fd)

//创建epoll句柄
epoll_fd = epoll_create(MAXEPOLLSIZE);

//将监听的listen_fd添加到epoll中
//创建 ev 变量，在epoll_ctl函数中使用
struct epoll_event ev;
//设置触发模式
ev.events = EPOLLIN | EPOLLET;
//设置fd变量
ev.data.fd = listen_fd;
//将listen_fd添加到epoll集合中
epoll_ctl(epoll_fd, EPOLL_CTL_ADD, listen_fd, &ev)
//将监听的listen_fd添加到epoll中

//创建一个数组，用于接受所有触发的读写事件
struct epoll_event fired_events[MAXEPOLLSIZE];

//循环处理链接和读写操作
while(1) {
    //等待有事件发生，fired_events中存储已经触发的事件，-1表示没有超时时间，返回触发的事件数量
    epoll_event_nums = epoll_wait(epoll_fd, fired_events, curfds, -1);
    for(j = 0; j < epoll_event_nums; j++) {
        if(fired_events[j].data.fd == listen_fd) { //如果触发事件的描述符是 listen_fd)
            //1.执行 accept()函数
            new_client_fd = accept(listen_fd, xx, xx)
            //2.将新的客户端连接fd添加到epoll集合中
            ev.events = EPOLLIN | EPOLLET;
            ev.data.fd = new_client_fd;
            epoll_ctl(epoll_fd, EPOLL_CTL_ADD, new_client_fd, &ev)
        } else { //如果是已连接的客户端触发的事件，则进行读写操作
          if(fired_events[i].events&EPOLLIN) {//如果是已经连接的用户，并且收到数据，那么进行读入。
            //如果是读事件
            recv(fired_events[j].data.fd, buf, xx, xx)
            }
          if(fired_events[i].events&EPOLLOUT) {如果有数据发送
            //如果是写事件
            send()
          }
        }
    }
}

```

名词解释：

1. OS 将 I/O 状态的变化都封装成了事件，如可读事件、可写事件, 对应代码就是：**EPOLL_CTL_ADD 注册事件、EPOLL_CTL_MOD 修改事件、EPOLL_CTL_DEL 删除事件**

2. events 几个状态：EPOLLIN：表示对应的文件描述符可以读（包括对端 SOCKET 正常关闭）；EPOLLOUT：表示对应的文件描述符可以写；

### 2. CallBack

> 通过上面 epoll 示例我们可以看到把 I/O 事件的等待和监听任务交给了操作系统内核，内核在 I/O 状态发生改变后（例如 socket 连接已建立成功可发送数据），即发生了可读可写事件后 (EPOLLIN/EPOLLOUT)，回调我们注册的函数 (recv/send)，这样我们就收到了内核的通知完成收发数据操作。

Python 标准库提供的 selectors 模块是对底层 epoll 等的封装。DefaultSelector 类会根据内核环境自动选择最佳的模块，那在 Linux2.5.44 及更新的版本上都是 epoll 了。

**selectors 调用 register 注册在某个 socket fd 上的事件和事件回调函数，这就相当于调用 epoll 中 epoll_ctl 方法。详细对照看 epool 示例。**

### 3. Event loop

那如何从 selectors 里获取当前正发生的事件，并且得到对应的回调函数去执行呢？

为了解决上述问题，我们参照上述 epoll 模式，写一个循环，去访问 selectors 模块中的 select 方法，等待它告诉我们当前是哪个事件发生了，应该对应哪个回调。这个等待事件通知的循环，称之为事件循环。

```
def loop():
  while True:
    events = sel.select()
    for key, mask in events:
        callback = key.data
        callback(key.fileobj, mask)


```

**请详细看上面 epoll 示例的 while 循环逻辑**

**selector.select()** 是一个阻塞调用，因为如果事件不发生，那应用程序就没事件可处理，所以就干脆阻塞在这里等待事件发生。那可以推断，比如只下载一篇网页，一定要 connect() 之后才能 send() 继而 recv()，那它的效率和阻塞的方式是一样的。因为不在 connect()/recv() 上阻塞，也得在 select() 上阻塞。

所以，selectors 机制是用来解决大量并发连接的。当系统中有大量非阻塞调用，能随时产生事件的时候，selectors 机制才能发挥最大的威力。

### 4. 小结

epoll 网络模式 + Callback 回调 + Event loop 事件循环机制，这三者构成了异步编程的三驾马车，所有异步编程核心都几乎离不开它们，所以了解其原理与概念对学习其他语言的异步编程有很大的帮助。

### 5. 参考

https://docs.python.org/3/library/selectors.html

https://panqiincs.me/2015/08/01/io-multiplexing-with-epoll/
