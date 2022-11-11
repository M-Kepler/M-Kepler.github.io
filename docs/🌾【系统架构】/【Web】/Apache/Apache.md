- [参考资料](#参考资料)
- [Apache](#apache)
  - [Apache 是如何处理 CGI 的](#apache-是如何处理-cgi-的)
  - [工作模式](#工作模式)
    - [`mpm_prefork` 多进程模型](#mpm_prefork-多进程模型)
    - [`mpm_worker` 多进程 + 多线程模型](#mpm_worker-多进程--多线程模型)
    - [`mpm_event` 事件驱动模型](#mpm_event-事件驱动模型)
  - [防 DDOS 插件 `mod_evasive`](#防-ddos-插件-mod_evasive)
- [SSL](#ssl)
- [配置](#配置)
- [其他](#其他)

# 参考资料

# Apache

## Apache 是如何处理 CGI 的

## 工作模式

[处理高并发、高访问之 Apache 优化](https://blog.csdn.net/tai532439904/article/details/78484342)

- 目前一共有三种稳定的 MPM（Multi-Processing Module，多进程处理模块）模式：Prefork（进程模式）、Worker（线程模式）、Event（事件模式，2.4 版本后开始稳定）

### `mpm_prefork` 多进程模型

![alt](https://img2018.cnblogs.com/blog/949069/201908/949069-20190807110446555-699877081.png)

`mpm_prefork` 模块会预先创建多个子进程 (默认为 5 个)，当接收到客户端的请求后，再将请求转交给子进程处理，并且每个子进程同时只能用于处理单个请求。

如果当前的请求数将超过预先创建的子进程数时，就会创建新的子进程来处理额外的请求。Apache 总是试图保持一些备用的或者是空闲的子进程用于迎接即将到来的请求。这样客户端的请求就不需要在接收后等候子进程的产生。

- **优点：**

  可以兼容新老模块；每个进程使用单独的内存空间，较安全，一个进程坏了不会影响其他进程

- **缺点：**

  占用较大内存，不擅长处理高并发

### `mpm_worker` 多进程 + 多线程模型

![alt](https://img2018.cnblogs.com/blog/949069/201908/949069-20190807110454728-296543382.png)

- **优点：**

  可以处理海量请求，而系统资源的开销小。

- **缺点：**

  不太安全。如果一个线程坏了。 整个进程都要坏了。另外存在 keep-alive 长连接占用资源时间过长。

### `mpm_event` 事件驱动模型

![alt](https://img2018.cnblogs.com/blog/949069/201908/949069-20190807112145010-636444941.png)

- **优点：**

- **缺点：**

## 防 DDOS 插件 `mod_evasive`

[Apache 设置防 DDOS 模块 mod_evasive](https://www.cnblogs.com/duanxz/p/4123065.html)

# SSL

- [SSL 与 TLS 区别 以及介绍](https://blog.csdn.net/adrian169/article/details/9164385)

- [如何在 Apache 中启用 TLS 1.3/1.2](https://www.onitroad.com/jc/archive/enable-tls-in-modssl-and-apache.html)

# 配置

- `RequestHeader unset`

# 其他
