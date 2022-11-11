- [参考资料](#参考资料)
- [RPC](#rpc)
  - [`HTTP` 和 `Rpc` 的区别](#http-和-rpc-的区别)
- [其他](#其他)

# 参考资料

[RPC 框架实现原理](http://dwz.date/dpwP)

[有了 HTTP，为什么还要 RPC](https://mp.weixin.qq.com/s/AHDnTg0BYT8lHGXH1lO6LQ)

[既然有 HTTP 协议，为什么还要有 RPC](https://mp.weixin.qq.com/s/_pPY58hDvSNqL62-ZGBG9g)

[知乎 - 既然有 HTTP 协议，为什么还要有 RPC](https://www.zhihu.com/question/41609070)

[⭐ 请说一下 Rpc 和 HTTP 的区别？](https://mp.weixin.qq.com/s/DnSoBy5b5n8yWSXERseA6A)

# RPC

`RPC(Remote Process Call Protocol)`，远程过程调用协议，是一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络技术的协议。RPC 协议假定某些传输协议的存在，如 TCP 或 UDP，为通信程序之间携带信息数据

- 协议、序列化反序列化

## `HTTP` 和 `Rpc` 的区别

HTTP 和 rpc 区别：这两个**不是一个层面的概念**。http 是一种协议，rpc 是远程过程调用方式，其中包含协议、序列化等等

**1、传输协议**

- RPC，可以基于 TCP 协议，也可以基于 HTTP 协议

- HTTP，基于 HTTP 协议

**2、传输效率**

- RPC，使⽤用⾃自定义的 TCP 协议，可以让请求报⽂文体积更更⼩小，或者使⽤用 HTTP2 协议，也可以很好的减少报⽂文的体积，提⾼高传输效率

- HTTP，如果是基于 HTTP1.1 的协议，请求中会包含很多⽆无⽤用的内容，如果是基于 HTTP2.0，那么简单的封装以下是可以作为⼀一个 RPC 来使⽤用的，这时标准 RPC 框架更更多的是服务治理理

**3、性能消耗，主要在于序列列化和反序列列化的耗时**

- RPC，可以基于 thrift 实现⾼高效的⼆二进制传输

- HTTP，⼤大部分是通过 json 来实现的，字节⼤大⼩小和序列列化耗时都⽐比 thrift 要更更消耗性能

**4、负载均衡**

- RPC，基本都⾃自带了了负载均衡策略略

- HTTP，需要配置 Nginx，HAProxy 来实现

**5、服务治理（下游服务新增，重启，下线时如何不不影响上游调⽤用者）**

- RPC，能做到⾃自动通知，不不影响上游

- HTTP，需要事先通知，修改 Nginx/HAProxy 配置

# 其他
