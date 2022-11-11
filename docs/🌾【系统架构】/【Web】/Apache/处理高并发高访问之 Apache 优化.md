- [前言](#前言)
  - [多路处理模块 MPM（Multi-Processing Module）介绍](#多路处理模块-mpmmulti-processing-module介绍)
  - [mpm_prefork 模块](#mpm_prefork-模块)
  - [mpm_worker 模块](#mpm_worker-模块)
  - [mpm_winnt 模块](#mpm_winnt-模块)
- [修改 MPM 模块配置](#修改-mpm-模块配置)
  - [mpm_winnt 模块](#mpm_winnt-模块-1)
  - [mpm_perfork 模块](#mpm_perfork-模块)
  - [mpm_worker 模块](#mpm_worker-模块-1)
- [mpm_prefork](#mpm_prefork)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/tai532439904/article/details/78484342)

### 前言

项目 100 人同时访问，导致访问速度变慢，作为一个没有遇到过这种情况下的辕，在各种查阅资料后，先用删除日志更改日志输出的方法处理后（处理方法：[修改 Apache 日志输出相关配置方法](http://blog.csdn.net/tai532439904/article/details/78476560)），暂时好缓，后来又出现变慢，在查阅各种博客后，发现一个处理并发的方法，小试身手，发现有所好转。总结一下，加深记忆。

#### 多路处理模块 MPM（Multi-Processing Module）介绍

作为 Apache 的核心模块它针对不同的操作系统提供了多个不同的 MPM 模块，例如：`mpm_beos`、`mpm_event`、`mpm_netware`、`mpmt_os2`、`mpm_prefork`、`mpm_winnt`、`mpm_worker`。 如果条件允许，我们可以根据实际需求将指定的 MPM 模块编译进我们自己的 Apache 中 (Apache 的源码是开放的，允许用户自行编译)。不过，如果在编译时我们没有选择，Apache 将按照如下表格根据不同的操作系统自行选择对应的 MPM 模块，这也是 Apache 针对不同平台推荐使用的 MPM 模块。

- 不同操作系统上默认的 MPM 模块

| 操作系统     | MPM 模块      | 描述                                                                                         |
| ------------ | ------------- | -------------------------------------------------------------------------------------------- |
| `Windows`    | `mpm_winnt`   | Windows 系统                                                                                 |
| `Unix/Linux` | `mpm_winnt`   | Unix/Linux 系统                                                                              |
| `BeOS`       | `mpm_beos`    | 由 Be 公司开发的一种多媒体操作系统，官方版已停止更新。                                       |
| `Netware`    | `mpm_netware` | 由 NOVELL 公司推出的一种网络操作系统                                                         |
| `OS/2`       | `mpmt_os2`    | 一种最初由微软和 IBM 共同开发的操作系统，现由 IBM 单独开发 (微软放弃 OS/2，转而开发 Windows) |

`mpm_event`模块可以看作是`mpm_worker`模块的一个变种，不过其具有实验性质，一般不推荐使用。
当然，Apache 在其官方网站上也提供了根据不同操作系统已经编译好对应 MPM 模块的成品 Apache。你可以[点击此处](http://httpd.apache.org/download.cgi)进入 Apache 官方网站下载。

> 此外，如果我们想要知道某个 Apache 内部使用的是何种 MPM 模块，我们可以以命令行的方式进入 Apache 安装目录 \ bin，然后键入命令 httpd -l，即可查看到当前 Apache 内部使用的何种 MPM 模块。

由于在平常的开发工作中，BeOS、NetWare、OS/2 等操作系统并不常见，这里我们主要针对 Windows 和 Unix/[Linux](https://so.csdn.net/so/search?from=pc_blog_highlight&q=Linux) 操作系统上的 MPM 模块进行讲解。在 Windows 和 Unix/Linux 操作系统上，MPM 模块主要有`mpm_winnt`、`mpm_prefork`、`mpm_worker`三种。

#### mpm_prefork 模块

> mpm_prefork 模块主要应用于 Unix/Linux 平台的 Apache 服务器，其主要工作方式是：当 Apache 服务器启动后，mpm_prefork 模块会预先创建多个子进程 (默认为 5 个)，当接收到客户端的请求后，mpm_prefork 模块再将请求转交给子进程处理，并且每个子进程同时只能用于处理单个请求。如果当前的请求数将超过预先创建的子进程数时，mpm_prefork 模块就会创建新的子进程来处理额外的请求。Apache 总是试图保持一些备用的或者是空闲的子进程用于迎接即将到来的请求。这样客户端的请求就不需要在接收后等候子进程的产生。
>
> 由于在 mpm_prefork 模块中，每个请求对应一个子进程，因此其占用的系统资源相对其他两种模块而言较多。不过 mpm_prefork 模块的优点在于它的每个子进程都会独立处理对应的单个请求，这样，如果其中一个请求出现问题就不会影响到其他请求。同时，mpm_prefork 模块可以应用于不具备线程安全的第三方模块 (比如 PHP 的非线程安全版本)，且在不支持线程调试的平台上易于调试。此外，mpm_prefork 模块还具有比 mpm_worker 模块更高的稳定性。

#### mpm_worker 模块

> mpm_worker 模块也主要应用于 Unix/Linux 平台的 Apache 服务器，它可以看作是 mpm_prefork 模块的改进版。mpm_worker 模块的工作方式与 mpm_prefork 模块类似。不过，由于处理相同请求的情况下，基于进程 (例如 mpm_prefork) 比基于线程的处理方式占用的系统资源要多。因此，与 mpm_prefork 模块不同的是，mpm_worker 模块会让每个子进程创建固定数量的服务线程和一个监听线程，并让每个服务线程来处理客户端的请求，监听线程用于监听接入请求并将其传递给服务线程处理和应答。Apache 总是试图维持一个备用或是空闲的服务线程池。这样，客户端无须等待新线程或新进程的建立即可得到处理。
>
> 与 mpm_prefork 模块相比，mpm_worker 模块可以进一步减少系统资源的开销。再加上它也使用了多进程，每个进程又有多个线程，因此它与完全基于线程的处理方式相比，又增加了一定的稳定性。

#### mpm_winnt 模块

> mpm_winnt 模块是专门针对 Windows 操作系统而优化设计的 MPM 模块。它只创建一个单独的子进程，并在这个子进程中轮流产生多个线程来处理请求。

### 修改 MPM 模块配置

> 在对 Apache 的 MPM 模块具备一定了解后，我们就可以针对不同的 MPM 模块来修改 Apache 的最大并发连接数配置了。

- 启用 MPM 模块配置文件

  在 Apace 安装目录 / conf/extra 目录中有一个名为 httpd-mpm.conf 的配置文件。该文件主要用于进行 MPM 模块的相关配置。不过，在默认情况下，Apache 的 MPM 模块配置文件并没有启用。因此，我们需要在 httpd.conf 文件中启用该配置文件，如下所示：

  ```
  # Server-pool management (MPM specific)


  # Include conf/extra/httpd-mpm.conf (去掉该行前面的注释符号"#")

  ```

- 修改 MPM 模块配置文件中的相关配置

  在启动 MPM 模块配置文件后，我们就可以使用文本编辑器打开该配置文件，我们可以看到，在该配置文件中有许多`<IfModule>`配置节点，如下图所示：
   ![alt](https://img-blog.csdn.net/20171108223149092?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdGFpNTMyNDM5OTA0/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

此时，我们就需要根据当前 Apache 服务器所使用的 MPM 模块，来修改对应节点下的参数配置。首先，我们来看看 mpm_winnt 模块下的默认配置：

#### mpm_winnt 模块

```conf
# 由于mpm_winnt模块只会创建1个子进程，因此这里对单个子进程的参数设置就相当于对整个Apache的参数设置。

<IfModule mpm_winnt_module>
ThreadsPerChild      150 #推荐设置：小型网站=1000 中型网站=1000~2000 大型网站=2000~3500
MaxRequestsPerChild    0 #推荐设置：小=10000 中或大=20000~100000
</IfModule>
```

对应的配置参数作用如下：

> ThreadsPerChild：每个子进程的最大并发线程数。
> MaxRequestsPerChild：每个子进程允许处理的请求总数。如果累计处理的请求数超过该值，该子进程将会结束 (然后根据需要确定是否创建新的子进程)，该值设为 0 表示不限制请求总数 (子进程永不结束)。
> 该参数建议设为非零的值，可以带来以下两个好处：
>
> 1. 可以防止程序中可能存在的内存泄漏无限进行下去，从而耗尽内存。
> 2. 给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。
>
> 注意：在以上涉及到统计请求数量的参数中，对于 KeepAlive 的连接，只有第一个请求会被计数。

接着，我们再来看看 mpm_perfork 模块和 mpm_worker 模块下的默认配置:

#### mpm_perfork 模块

```
<IfModule mpm_prefork_module>
StartServers          5 #推荐设置：小=默认 中=20~50 大=50~100
MinSpareServers       5 #推荐设置：与StartServers保持一致
MaxSpareServers      10 #推荐设置：小=20 中=30~80 大=80~120
MaxClients          150 #推荐设置：小=500 中=500~1500 大型=1500~3000
MaxRequestsPerChild   0 #推荐设置：小=10000 中或大=10000~500000
</IfModule>
```

> 此外，还需额外设置 ServerLimit 参数，该参数最好与 MaxClients 的值保持一致。

```
# StartServers:　　数量的服务器进程开始

# MinSpareServers:　　最小数量的服务器进程,保存备用

# MaxSpareServers:　　最大数量的服务器进程,保存备用

# MaxRequestWorkers:　　最大数量的服务器进程允许开始

# MaxConnectionsPerChild:　　最大连接数的一个服务器进程服务
```

prefork 控制进程在最初建立 “StartServers” 个子进程后，为了满足 MinSpareServers 设置的需要创建一个进程，等待一秒钟，继续创建两 个，再等待一秒钟， 继续创建四个…… 如此按指数级增加创建的进程数，最多达到每秒 32 个，直到满足 MinSpareServers 设置的值为止。这种模式 可以不必在请求到 来时再产生新的进程，从而减小了系统开销以增加性能。MaxSpareServers 设置了最大的空闲进程数，如果空闲进程数大于这个 值，Apache 会自动 kill 掉一些多余进程。这个值不要设得过大，但如果设的值比 MinSpareServers 小，Apache 会自动把其调整 为 MinSpareServers+1。如果站点负载较大，可考虑同时加大 MinSpareServers 和 MaxSpareServers。

MaxRequestsPerChild 设置的是每个 子进程可处理的请求数。每个子进程在处理了 “MaxRequestsPerChild” 个请求后将自 动销毁。0 意味着无限，即子进程永不销毁。虽然缺省 设为 0 可以使每个子进程处理更多的请求，但如果设成非零值也有两点重要的好处：

- 可防止意外的内存泄 漏。
- 在服务器负载下降的时侯会自动减少子进程数。

因此，可根据服务器的负载来调整这个值。

MaxRequestWorkers 指令集同时将服务请求的数量上的限制。任何连接尝试在 MaxRequestWorkerslimit 将通常被排队，最多若干基于上 ListenBacklog 指令。

> - 在 apache2.3.13 以前的版本 MaxRequestWorkers 被称为 MaxClients 。
> - MaxClients 是这些指令中最为重要的一个，设定的是 Apache 可以同 时处理的请求，是对 Apache 性能影响最大的参数。其缺省值 150 是远远不够的，如果请求总数已达到这个值（可通过 ps -ef|grep http|wc -l 来确认），那么后面的请求就要排队，直到某个已处理请求完毕。这就是系统资源还剩下很多而 HTTP 访问却很 慢的主要原因。虽然理论上这个值越大，可以 处理的请求就越多，但 Apache 默认的限制不能大于 256。

#### mpm_worker 模块

```
<IfModule mpm_worker_module>
StartServers          2 #推荐设置：小=默认 中=3~5 大=5~10
MaxClients          150 #推荐设置：小=500 中=500~1500 大型=1500~3000
MinSpareThreads      25 #推荐设置：小=默认 中=50~100 大=100~200
MaxSpareThreads      75 #推荐设置：小=默认 中=80~160 大=200~400
ThreadsPerChild      25 #推荐设置：小=默认 中=50~100 大型=100~200
MaxRequestsPerChild   0 #推荐设置：小=10000 中或大=10000~50000
(此外，如果MaxClients/ThreadsPerChild大于16，还需额外设置ServerLimit参数，ServerLimit必须大于等于 MaxClients/ThreadsPerChild 的值。)
</IfModule>
```

对应的配置参数作用如下：

> StartServers 启动 Apache 时创建的子进程数。
>
> MinSpareServers 处于空闲状态的最小子进程数。
> 所谓空闲子进程是指没有正在处理请求的子进程。如果当前空闲子进程数少于 MinSpareServers，那么 Apache 将以最大每秒一个的速度产生新的子进程。只有在非常繁忙机器上才需要调整这个参数。此值不宜过大。
>
> MaxSpareServers 处于空闲状态的最大子进程数。
> 只有在非常繁忙机器上才需要调整这个参数。此值不宜过大。如果你将该指令的值设置为比 MinSpareServers 小，Apache 将会自动将其修改成 MinSpareServers+1。
>
> MaxClients 允许同时连接的最大请求数量。
> 任何超过 MaxClients 限制的请求都将进入等待队列，直到达到 ListenBacklog 指令限制的最大值为止。

### mpm_prefork

> MaxClients 表示可以用于处理客户端请求的最大子进程数量，默认值是 256。要增大这个值，你必须同时增大 ServerLimit。
>
> 对于线程型或者混合型的 MPM(也就是`mpm_beos`或`mpm_worker`)，MaxClients 表示可以用于处理客户端请求的最大线程数量。线程型的 mpm_beos 的默认值是 50。对于混合型的 MPM 默认值是 16(ServerLimit) 乘以 25(ThreadsPerChild) 的结果。因此要将 MaxClients 增加到超过 16 个进程才能提供的时候，你必须同时增加 ServerLimit 的值。
>
> MinSpareThreads 处于空闲状态的最小线程数。 不同的 MPM 对这个指令的处理是不一样的：
>
> mpm_worker 的默认值是 75。这个 MPM 将基于整个服务器监视空闲线程数。如果服务器中总的空闲线程数太少，子进程将产生新的空闲线程。mpm_netware 的默认值是 10。既然这个 MPM 只运行单独一个子进程，此 MPM 当然亦基于整个服务器监视空闲线程数。mpm_beos 和 mpmt_os2 的工作方式与 mpm_netware 差不多，mpm_beos 的默认值是 1；mpmt_os2 的默认值是 5。
>
> MaxSpareThreads 处于空闲状态的最大线程数。 不同的 MPM 对这个指令的处理是不一样的：

注： mpm_worker 的默认值是 250。这个 MPM 将基于整个服务器监视空闲线程数。如果服务器中总的空闲线程数太多，子进程将杀死多余的空闲线程。mpm_netware 的默认值是 100。既然这个 MPM 只运行单独一个子进程，此 MPM 当然亦基于整个服务器监视空闲线程数。mpm_beos 和 mpmt_os2 的工作方式与 mpm_netware 差不多，mpm_beos 的默认值是 50；mpmt_os2 的默认值是 10。

备注：ServerLimit 表示 Apache 允许创建的最大进程数。 值得注意的是，Apache 在编译时内部有一个硬限制 ServerLimit 20000(对于 mpm_prefork 模块为 ServerLimit 200000)。你不能超越这个限制。
使用这个指令时要特别当心。如果将 ServerLimit 设置成一个高出实际需要许多的值，将会有过多的共享内存被分配。如果将 ServerLimit 和 MaxClients 设置成超过系统的处理能力，Apache 可能无法启动，或者系统将变得不稳定。

注意：在配置相关参数时，请先保证服务器具备足够的硬件性能 (例如：CPU、内存等)。 如果发现自启动后，随着服务器的运行时间增加，服务器的内存占用也随之增加，可能是程序中出现内存泄露，请向下调整参数 MaxRequestsPerChild 的值以降低内存泄露带来的影响，然后尽快找出程序中的问题之所在。

本文转载：[Apache 优化：修改最大并发连接数](https://www.cnblogs.com/fazo/p/5588644.html)
