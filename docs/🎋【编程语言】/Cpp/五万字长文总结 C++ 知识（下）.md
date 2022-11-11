- [网络编程](#网络编程)
  - [Socket](#socket)
    - [Socket 中的 read()、write() 函数](#socket-中的-readwrite-函数)
      - [read()](#read)
      - [write()](#write)
    - [Socket 中 TCP 的三次握手建立连接](#socket-中-tcp-的三次握手建立连接)
    - [Socket 中 TCP 的四次握手释放连接](#socket-中-tcp-的四次握手释放连接)
- [数据库](#数据库)
  - [范式](#范式)
- [设计模式](#设计模式)
  - [单例模式](#单例模式)
  - [抽象工厂模式](#抽象工厂模式)
  - [适配器模式](#适配器模式)
  - [桥接模式](#桥接模式)
  - [观察者模式](#观察者模式)
  - [设计模式的六大原则](#设计模式的六大原则)
- [链接装载库](#链接装载库)
  - [内存、栈、堆](#内存栈堆)
    - [栈](#栈)
    - [堆](#堆)
    - [“段错误（segment fault）” 或 “非法操作，该内存地址不能 read/write”](#段错误segment-fault-或-非法操作该内存地址不能-readwrite)
  - [编译链接](#编译链接)
    - [各平台文件格式](#各平台文件格式)
    - [编译链接过程](#编译链接过程)
    - [目标文件](#目标文件)
      - [目标文件格式](#目标文件格式)
      - [目标文件存储结构](#目标文件存储结构)
    - [链接的接口————符号](#链接的接口符号)
  - [Linux 的共享库（Shared Library）](#linux-的共享库shared-library)
    - [命名](#命名)
    - [路径](#路径)
    - [环境变量](#环境变量)
    - [so 共享库的编写](#so-共享库的编写)
    - [使用 CLion 编写共享库](#使用-clion-编写共享库)
    - [so 共享库的使用（被可执行项目调用）](#so-共享库的使用被可执行项目调用)
    - [使用 CLion 调用共享库](#使用-clion-调用共享库)
  - [Windows 应用程序入口函数](#windows-应用程序入口函数)
    - [_tWinMain 与_tmain 函数声明](#_twinmain-与_tmain-函数声明)
  - [Windows 的动态链接库（Dynamic-Link Library）](#windows-的动态链接库dynamic-link-library)
    - [用处](#用处)
    - [注意](#注意)
    - [加载 Windows 程序的搜索顺序](#加载-windows-程序的搜索顺序)
    - [DLL 入口函数](#dll-入口函数)
    - [DllMain 函数](#dllmain-函数)
    - [载入卸载库](#载入卸载库)
    - [FreeLibraryAndExitThread 函数声明](#freelibraryandexitthread-函数声明)
    - [显示地链接到导出符号](#显示地链接到导出符号)
    - [GetProcAddress 函数声明](#getprocaddress-函数声明)
    - [DumpBin.exe 查看 DLL 信息](#dumpbinexe-查看-dll-信息)
    - [DLL 库的使用（运行时动态链接 DLL）](#dll-库的使用运行时动态链接-dll)
    - [DLL 库的使用（运行时动态链接 DLL）](#dll-库的使用运行时动态链接-dll-1)
  - [运行库（Runtime Library）](#运行库runtime-library)
    - [典型程序运行步骤](#典型程序运行步骤)
    - [glibc 入口](#glibc-入口)
    - [MSVC CRT 入口](#msvc-crt-入口)
    - [C 语言运行库（CRT）](#c-语言运行库crt)
    - [C 语言标准库（ANSI C）](#c-语言标准库ansi-c)
- [海量数据处理](#海量数据处理)
- [音视频](#音视频)
- [其他](#其他)
- [书籍](#书籍)
  - [语言](#语言)
  - [算法](#算法)
  - [系统](#系统)
  - [网络](#网络)
  - [其他](#其他-1)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651171148&idx=1&sn=0cfafb1959af14ba1745274e8096c089&chksm=80647813b713f105881e579a332f482e60ae295c00c0ab9f9ab499a3e5075e5668bdeef82af5&scene=90&subscene=93&sessionid=1653105131&clicktime=1653105133&enterid=1653105133&ascene=56&fasttmpl_type=0&fasttmpl_fullversion=6159593-zh_CN-zip&fasttmpl_flag=0&realreporttime=1653105133179&devicetype=android-31&version=28001717&nettype=cmnet&abtest_cookie=AAACAA%3D%3D&lang=zh_CN&session_us=gh_e829fd9228a9&exportkey=AyWnJg5sj0usk1XUNSBy7Nw%3D&pass_ticket=EN61ezBLTx6V%2F6EMGH%2F3vpE%2FqrYNl%2Bq9iuLSpLFcvqesttKAR%2FDAnrY34X1NtWVC&wx_header=3)

[](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651171118&idx=1&sn=e3ce537eb3cee543a6a04932f2334c20&chksm=80647871b713f1679d1cc7c5e415e099d2396c9e8e9c6ab60573a13c0f9a38688834b62f0481&scene=21#wechat_redirect)↓推荐关注↓

干货推荐 ：[五万字长文总结 C/C++ 知识（上）](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651171118&idx=1&sn=e3ce537eb3cee543a6a04932f2334c20&chksm=80647871b713f1679d1cc7c5e415e099d2396c9e8e9c6ab60573a13c0f9a38688834b62f0481&scene=21#wechat_redirect)

### 网络层

- IP（Internet Protocol，网际协议）是为计算机网络相互连接进行通信而设计的协议。

- ARP（Address Resolution Protocol，地址解析协议）

- ICMP（Internet Control Message Protocol，网际控制报文协议）

- IGMP（Internet Group Management Protocol，网际组管理协议）

#### IP 网际协议

IP 地址分类：

- `IP 地址 ::= {<网络号>,<主机号>}`

<table><thead><tr><th>IP 地址类别</th><th>网络号</th><th>网络范围</th><th>主机号</th><th>IP 地址范围</th></tr></thead><tbody><tr><td>A 类</td><td>8bit，第一位固定为 0</td><td>0 —— 127</td><td>24bit</td><td>1.0.0.0 —— 127.255.255.255</td></tr><tr><td>B 类</td><td>16bit，前两位固定为 10</td><td>128.0 —— 191.255</td><td>16bit</td><td>128.0.0.0 —— 191.255.255.255</td></tr><tr><td>C 类</td><td>24bit，前三位固定为 110</td><td>192.0.0 —— 223.255.255</td><td>8bit</td><td>192.0.0.0 —— 223.255.255.255</td></tr><tr><td>D 类</td><td>前四位固定为 1110，后面为多播地址</td><td><br></td><td><br></td><td><br></td></tr><tr><td>E 类</td><td>前五位固定为 11110，后面保留为今后所用</td><td><br></td><td><br></td><td><br></td></tr></tbody></table>

应用：

- PING（Packet InterNet Groper，分组网间探测）测试两个主机之间的连通性

- TTL（Time To Live，生存时间）该字段指定 IP 包被路由器丢弃之前允许通过的最大网段数量

#### 内部网关协议

- RIP（Routing Information Protocol，路由信息协议）

- OSPF（Open Sortest Path First，开放最短路径优先）

#### 外部网关协议

- BGP（Border Gateway Protocol，边界网关协议）

#### IP 多播

- IGMP（Internet Group Management Protocol，网际组管理协议）

- 多播路由选择协议

#### VPN 和 NAT

- VPN（Virtual Private Network，虚拟专用网）

- NAT（Network Address Translation，网络地址转换）

#### 路由表包含什么？

1. 网络 ID（Network ID, Network number）：就是目标地址的网络 ID。

2. 子网掩码（subnet mask）：用来判断 IP 所属网络

3. 下一跳地址 / 接口（Next hop / interface）：就是数据在发送到目标地址的旅途中下一站的地址。其中 interface 指向 next hop（即为下一个 route）。一个自治系统（AS, Autonomous system）中的 route 应该包含区域内所有的子网络，而默认网关（Network id: `0.0.0.0`, Netmask: `0.0.0.0`）指向自治系统的出口。

根据应用和执行的不同，路由表可能含有如下附加信息：

1. 花费（Cost）：就是数据发送过程中通过路径所需要的花费。

2. 路由的服务质量

3. 路由中需要过滤的出 / 入连接列表

### 运输层

协议：

- TCP（Transmission Control Protocol，传输控制协议）

- UDP（User Datagram Protocol，用户数据报协议）

端口：

<table><thead><tr><th>应用程序</th><th>FTP</th><th>TELNET</th><th>SMTP</th><th>DNS</th><th>TFTP</th><th>HTTP</th><th>HTTPS</th><th>SNMP</th></tr></thead><tbody><tr><td>端口号</td><td>21</td><td>23</td><td>25</td><td>53</td><td>69</td><td>80</td><td>443</td><td>161</td></tr></tbody></table>

#### TCP

- TCP（Transmission Control Protocol，传输控制协议）是一种面向连接的、可靠的、基于字节流的传输层通信协议，其传输的单位是报文段。

特征：

- 面向连接

- 只能点对点（一对一）通信

- 可靠交互

- 全双工通信

- 面向字节流

TCP 如何保证可靠传输：

- 确认和超时重传

- 数据合理分片和排序

- 流量控制

- 拥塞控制

- 数据校验

TCP 首部

TCP：状态控制码（Code，Control Flag），占 6 比特，含义如下：

- URG：紧急比特（urgent），当 `URG＝1` 时，表明紧急指针字段有效，代表该封包为紧急封包。它告诉系统此报文段中有紧急数据，应尽快传送 (相当于高优先级的数据)， 且上图中的 Urgent Pointer 字段也会被启用。

- ACK：确认比特（Acknowledge）。只有当 `ACK＝1` 时确认号字段才有效，代表这个封包为确认封包。当 `ACK＝0` 时，确认号无效。

- PSH：（Push function）若为 1 时，代表要求对方立即传送缓冲区内的其他对应封包，而无需等缓冲满了才送。

- RST：复位比特 (Reset)，当 `RST＝1` 时，表明 TCP 连接中出现严重差错（如由于主机崩溃或其他原因），必须释放连接，然后再重新建立运输连接。

- SYN：同步比特 (Synchronous)，SYN 置为 1，就表示这是一个连接请求或连接接受报文，通常带有 SYN 标志的封包表示『主动』要连接到对方的意思。

- FIN：终止比特 (Final)，用来释放一个连接。当 `FIN＝1` 时，表明此报文段的发送端的数据已发送完毕，并要求释放运输连接。

#### UDP

- UDP（User Datagram Protocol，用户数据报协议）是 OSI（Open System Interconnection 开放式系统互联） 参考模型中一种无连接的传输层协议，提供面向事务的简单不可靠信息传送服务，其传输的单位是用户数据报。

特征：

- 无连接

- 尽最大努力交付

- 面向报文

- 没有拥塞控制

- 支持一对一、一对多、多对一、多对多的交互通信

- 首部开销小

#### TCP 与 UDP 的区别

1. TCP 面向连接，UDP 是无连接的；

2. TCP 提供可靠的服务，也就是说，通过 TCP 连接传送的数据，无差错，不丢失，不重复，且按序到达；UDP 尽最大努力交付，即不保证可靠交付

3. TCP 的逻辑通信信道是全双工的可靠信道；UDP 则是不可靠信道

4. 每一条 TCP 连接只能是点到点的；UDP 支持一对一，一对多，多对一和多对多的交互通信

5. TCP 面向字节流（可能出现黏包问题），实际上是 TCP 把数据看成一连串无结构的字节流；UDP 是面向报文的（不会出现黏包问题）

6. UDP 没有拥塞控制，因此网络出现拥塞不会使源主机的发送速率降低（对实时应用很有用，如 IP 电话，实时视频会议等）

7. TCP 首部开销 20 字节；UDP 的首部开销小，只有 8 个字节

#### TCP 黏包问题

##### 原因

TCP 是一个基于字节流的传输服务（UDP 基于报文的），“流” 意味着 TCP 所传输的数据是没有边界的。所以可能会出现两个数据包黏在一起的情况。

##### 解决

- 发送定长包。如果每个消息的大小都是一样的，那么在接收对等方只要累计接收数据，直到数据等于一个定长的数值就将它作为一个消息。

- 包头加上包体长度。包头是定长的 4 个字节，说明了包体的长度。接收对等方先接收包头长度，依据包头长度来接收包体。

- 在数据包之间设置边界，如添加特殊符号 `\r\n` 标记。FTP 协议正是这么做的。但问题在于如果数据正文中也含有 `\r\n`，则会误判为消息的边界。

- 使用更加复杂的应用层协议。

#### TCP 流量控制

##### 概念

流量控制（flow control）就是让发送方的发送速率不要太快，要让接收方来得及接收。

##### 方法

#### 利用可变窗口进行流量控制

#### TCP 拥塞控制

##### 概念

拥塞控制就是防止过多的数据注入到网络中，这样可以使网络中的路由器或链路不致过载。

##### 方法

- 慢开始 (slow-start)

- 拥塞避免 (congestion avoidance)

- 快重传 (fast retransmit)

- 快恢复 ( fast recovery

#### TCP 传输连接管理

> 因为 TCP 三次握手建立连接、四次挥手释放连接很重要，所以附上《计算机网络（第 7 版）- 谢希仁》书中对此章的详细描述：https://github.com/huihut/interview/blob/master/images/TCP-transport-connection-management.png

##### TCP 三次握手建立连接

![](https://mmbiz.qpic.cn/mmbiz_png/pldYwMfYJpjw0pkhKlWBkzVXkMbj1NS97uWKJU079EcjG0ElOgvAr83v7cJ7rU6rv21hTcAkbRD95kWzVMZT8g/640?wx_fmt=png)

【TCP 建立连接全过程解释】

1. 客户端发送 SYN 给服务器，说明客户端请求建立连接；

2. 服务端收到客户端发的 SYN，并回复 SYN+ACK 给客户端（同意建立连接）；

3. 客户端收到服务端的 SYN+ACK 后，回复 ACK 给服务端（表示客户端收到了服务端发的同意报文）；

4. 服务端收到客户端的 ACK，连接已建立，可以数据传输。

##### TCP 为什么要进行三次握手？

【答案一】因为信道不可靠，而 TCP 想在不可靠信道上建立可靠地传输，那么三次通信是理论上的最小值。（而 UDP 则不需建立可靠传输，因此 UDP 不需要三次握手。）

> Google Groups . TCP 建立连接为什么是三次握手？{技术}{网络通信}

【答案二】因为双方都需要确认对方收到了自己发送的序列号，确认过程最少要进行三次通信。

> 知乎 . TCP 为什么是三次握手，而不是两次或四次？

【答案三】为了防止已失效的连接请求报文段突然又传送到了服务端，因而产生错误。

> 《计算机网络（第 7 版）- 谢希仁》

【TCP 释放连接全过程解释】

1. 客户端发送 FIN 给服务器，说明客户端不必发送数据给服务器了（请求释放从客户端到服务器的连接）；

2. 服务器接收到客户端发的 FIN，并回复 ACK 给客户端（同意释放从客户端到服务器的连接）；

3. 客户端收到服务端回复的 ACK，此时从客户端到服务器的连接已释放（但服务端到客户端的连接还未释放，并且客户端还可以接收数据）；

4. 服务端继续发送之前没发完的数据给客户端；

5. 服务端发送 FIN+ACK 给客户端，说明服务端发送完了数据（请求释放从服务端到客户端的连接，就算没收到客户端的回复，过段时间也会自动释放）；

6. 客户端收到服务端的 FIN+ACK，并回复 ACK 给客户端（同意释放从服务端到客户端的连接）；

7. 服务端收到客户端的 ACK 后，释放从服务端到客户端的连接。

##### TCP 为什么要进行四次挥手？

【问题一】TCP 为什么要进行四次挥手？/ 为什么 TCP 建立连接需要三次，而释放连接则需要四次？

【答案一】因为 TCP 是全双工模式，客户端请求关闭连接后，客户端向服务端的连接关闭（一二次挥手），服务端继续传输之前没传完的数据给客户端（数据传输），服务端向客户端的连接关闭（三四次挥手）。所以 TCP 释放连接时服务器的 ACK 和 FIN 是分开发送的（中间隔着数据传输），而 TCP 建立连接时服务器的 ACK 和 SYN 是一起发送的（第二次握手），所以 TCP 建立连接需要三次，而释放连接则需要四次。

【问题二】为什么 TCP 连接时可以 ACK 和 SYN 一起发送，而释放时则 ACK 和 FIN 分开发送呢？（ACK 和 FIN 分开是指第二次和第三次挥手）

【答案二】因为客户端请求释放时，服务器可能还有数据需要传输给客户端，因此服务端要先响应客户端 FIN 请求（服务端发送 ACK），然后数据传输，传输完成后，服务端再提出 FIN 请求（服务端发送 FIN）；而连接时则没有中间的数据传输，因此连接时可以 ACK 和 SYN 一起发送。

【问题三】为什么客户端释放最后需要 TIME-WAIT 等待 2MSL 呢？

【答案三】

1. 为了保证客户端发送的最后一个 ACK 报文能够到达服务端。若未成功到达，则服务端超时重传 FIN+ACK 报文段，客户端再重传 ACK，并重新计时。

2. 防止已失效的连接请求报文段出现在本连接中。TIME-WAIT 持续 2MSL 可使本连接持续的时间内所产生的所有报文段都从网络中消失，这样可使下次连接中不会出现旧的连接报文段。

### 应用层

#### DNS

- DNS（Domain Name System，域名系统）是互联网的一项服务。它作为将域名和 IP 地址相互映射的一个分布式数据库，能够使人更方便地访问互联网。DNS 使用 TCP 和 UDP 端口 53。当前，对于每一级域名长度的限制是 63 个字符，域名总长度则不能超过 253 个字符。

域名：

- `域名 ::= {<三级域名>.<二级域名>.<顶级域名>}`，如：`blog.huihut.com`

#### FTP

- FTP（File Transfer Protocol，文件传输协议）是用于在网络上进行文件传输的一套标准协议，使用客户 / 服务器模式，使用 TCP 数据报，提供交互式访问，双向传输。

- TFTP（Trivial File Transfer Protocol，简单文件传输协议）一个小且易实现的文件传输协议，也使用客户 - 服务器方式，使用 UDP 数据报，只支持文件传输而不支持交互，没有列目录，不能对用户进行身份鉴定

#### TELNET

- TELNET 协议是 TCP/IP 协议族中的一员，是 Internet 远程登陆服务的标准协议和主要方式。它为用户提供了在本地计算机上完成远程主机工作的能力。

- HTTP（HyperText Transfer Protocol，超文本传输协议）是用于从 WWW（World Wide Web，万维网）服务器传输超文本到本地浏览器的传送协议。

- SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）是一组用于由源地址到目的地址传送邮件的规则，由它来控制信件的中转方式。SMTP 协议属于 TCP/IP 协议簇，它帮助每台计算机在发送或中转信件时找到下一个目的地。

- Socket 建立网络通信连接至少要一对端口号（Socket）。Socket 本质是编程接口（API），对 TCP/IP 的封装，TCP/IP 也要提供可供程序员做网络开发所用的接口，这就是 Socket 编程接口。

#### WWW

- WWW（World Wide Web，环球信息网，万维网）是一个由许多互相链接的超文本组成的系统，通过互联网访问

##### URL

- URL（Uniform Resource Locator，统一资源定位符）是因特网上标准的资源的地址（Address）

标准格式：

- `协议类型:[//服务器地址[:端口号]][/资源层级UNIX文件路径]文件名[?查询][#片段ID]`

完整格式：

- `协议类型:[//[访问资源需要的凭证信息@]服务器地址[:端口号]][/资源层级UNIX文件路径]文件名[?查询][#片段ID]`

> 其中【访问凭证信息 @；: 端口号；? 查询；# 片段 ID】都属于选填项  
> 如：`https://github.com/huihut/interview#cc`

##### HTTP

HTTP（HyperText Transfer Protocol，超文本传输协议）是一种用于分布式、协作式和超媒体信息系统的应用层协议。HTTP 是万维网的数据通信的基础。

请求方法

<table><thead><tr><th>方法</th><th>意义</th></tr></thead><tbody><tr><td>OPTIONS</td><td>请求一些选项信息，允许客户端查看服务器的性能</td></tr><tr><td>GET</td><td>请求指定的页面信息，并返回实体主体</td></tr><tr><td>HEAD</td><td>类似于 get 请求，只不过返回的响应中没有具体的内容，用于获取报头</td></tr><tr><td>POST</td><td>向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST 请求可能会导致新的资源的建立和 / 或已有资源的修改</td></tr><tr><td>PUT</td><td>从客户端向服务器传送的数据取代指定的文档的内容</td></tr><tr><td>DELETE</td><td>请求服务器删除指定的页面</td></tr><tr><td>TRACE</td><td>回显服务器收到的请求，主要用于测试或诊断</td></tr></tbody></table>

状态码（Status-Code）

- 1xx：表示通知信息，如请求收到了或正在进行处理

- 100 Continue：继续，客户端应继续其请求

- 101 Switching Protocols 切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到 HTTP 的新版本协议

- 2xx：表示成功，如接收或知道了

- 200 OK: 请求成功

- 3xx：表示重定向，如要完成请求还必须采取进一步的行动

- 301 Moved Permanently: 永久移动。请求的资源已被永久的移动到新 URL，返回信息会包括新的 URL，浏览器会自动定向到新 URL。今后任何新的请求都应使用新的 URL 代替

- 4xx：表示客户的差错，如请求中有错误的语法或不能完成

- 400 Bad Request: 客户端请求的语法错误，服务器无法理解

- 401 Unauthorized: 请求要求用户的身份认证

- 403 Forbidden: 服务器理解请求客户端的请求，但是拒绝执行此请求（权限不够）

- 404 Not Found: 服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置 “您所请求的资源无法找到” 的个性页面

- 408 Request Timeout: 服务器等待客户端发送的请求时间过长，超时

- 5xx：表示服务器的差错，如服务器失效无法完成请求

- 500 Internal Server Error: 服务器内部错误，无法完成请求

- 503 Service Unavailable: 由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的 Retry-After 头信息中

- 504 Gateway Timeout: 充当网关或代理的服务器，未及时从远端服务器获取请求

> 更多状态码：菜鸟教程 . HTTP 状态码

##### 其他协议

- SMTP（Simple Main Transfer Protocol，简单邮件传输协议）是在 Internet 传输 Email 的标准，是一个相对简单的基于文本的协议。在其之上指定了一条消息的一个或多个接收者（在大多数情况下被确认是存在的），然后消息文本会被传输。可以很简单地通过 Telnet 程序来测试一个 SMTP 服务器。SMTP 使用 TCP 端口 25。

- DHCP（Dynamic Host Configuration Protocol，动态主机设置协议）是一个局域网的网络协议，使用 UDP 协议工作，主要有两个用途：

- 用于内部网络或网络服务供应商自动分配 IP 地址给用户

- 用于内部网络管理员作为对所有电脑作中央管理的手段

- SNMP（Simple Network Management Protocol，简单网络管理协议）构成了互联网工程工作小组（IETF，Internet Engineering Task Force）定义的 Internet 协议族的一部分。该协议能够支持网络管理系统，用以监测连接到网络上的设备是否有任何引起管理上关注的情况。

## 网络编程

### Socket

#### Socket 中的 read()、write() 函数

```
ssize_t read(int fd, void *buf, size_t count);
ssize_t write(int fd, const void *buf, size_t count);


```

##### read()

- read 函数是负责从 fd 中读取内容。

- 当读成功时，read 返回实际所读的字节数。

- 如果返回的值是 0 表示已经读到文件的结束了，小于 0 表示出现了错误。

- 如果错误为 EINTR 说明读是由中断引起的；如果是 ECONNREST 表示网络连接出了问题。

##### write()

- write 函数将 buf 中的 nbytes 字节内容写入文件描述符 fd。

- 成功时返回写的字节数。失败时返回 -1，并设置 errno 变量。

- 在网络程序中，当我们向套接字文件描述符写时有俩种可能。

- （1）write 的返回值大于 0，表示写了部分或者是全部的数据。

- （2）返回的值小于 0，此时出现了错误。

- 如果错误为 EINTR 表示在写的时候出现了中断错误；如果为 EPIPE 表示网络连接出现了问题（对方已经关闭了连接）。

#### Socket 中 TCP 的三次握手建立连接

我们知道 TCP 建立连接要进行 “三次握手”，即交换三个分组。大致流程如下：

1. 客户端向服务器发送一个 SYN J

2. 服务器向客户端响应一个 SYN K，并对 SYN J 进行确认 ACK J+1

3. 客户端再想服务器发一个确认 ACK K+1

只有就完了三次握手，但是这个三次握手发生在 Socket 的那几个函数中呢？请看下图：

![](https://mmbiz.qpic.cn/mmbiz_png/kChlCQZAfH5FqDts5YrdZGE45XzVJudXU3CYC5EU3tKckJvC4XB2vaUpFyFvKNiaQ8k5icVONibnILdyXpIlvPBYA/640?wx_fmt=png)socket 中发送的 TCP 三次握手

从图中可以看出：

1. 当客户端调用 connect 时，触发了连接请求，向服务器发送了 SYN J 包，这时 connect 进入阻塞状态；

2. 服务器监听到连接请求，即收到 SYN J 包，调用 accept 函数接收请求向客户端发送 SYN K ，ACK J+1，这时 accept 进入阻塞状态；

3. 客户端收到服务器的 SYN K ，ACK J+1 之后，这时 connect 返回，并对 SYN K 进行确认；

4. 服务器收到 ACK K+1 时，accept 返回，至此三次握手完毕，连接建立。

#### Socket 中 TCP 的四次握手释放连接

上面介绍了 socket 中 TCP 的三次握手建立过程，及其涉及的 socket 函数。现在我们介绍 socket 中的四次握手释放连接的过程，请看下图：

![](https://mmbiz.qpic.cn/mmbiz_png/kChlCQZAfH5FqDts5YrdZGE45XzVJudXxNJlh5gfLcegmkogu0QWWl1LT5mD5E2bEhQtNlYRMhB6PnrOtVuUPw/640?wx_fmt=png)socket 中发送的 TCP 四次握手

图示过程如下：

1. 某个应用进程首先调用 close 主动关闭连接，这时 TCP 发送一个 FIN M；

2. 另一端接收到 FIN M 之后，执行被动关闭，对这个 FIN 进行确认。它的接收也作为文件结束符传递给应用进程，因为 FIN 的接收意味着应用进程在相应的连接上再也接收不到额外数据；

3. 一段时间之后，接收到文件结束符的应用进程调用 close 关闭它的 socket。这导致它的 TCP 也发送一个 FIN N；

4. 接收到这个 FIN 的源发送端 TCP 对它进行确认。

这样每个方向上都有一个 FIN 和 ACK。

## 数据库

- 数据库事务四大特性：原子性、一致性、分离性、持久性

- 数据库索引：顺序索引、B+ 树索引、hash 索引
    MySQL 索引背后的数据结构及算法原理

- SQL 约束 (Constraints)

### 范式

- 第一范式（1NF）：属性（字段）是最小单位不可再分

- 第二范式（2NF）：满足 1NF，每个非主属性完全依赖于主键（消除 1NF 非主属性对码的部分函数依赖）

- 第三范式（3NF）：满足 2NF，任何非主属性不依赖于其他非主属性（消除 2NF 主属性对码的传递函数依赖）

- 鲍依斯 - 科得范式（BCNF）：满足 3NF，任何非主属性不能对主键子集依赖（消除 3NF 主属性对码的部分和传递函数依赖）

- 第四范式（4NF）：满足 3NF，属性之间不能有非平凡且非函数依赖的多值依赖（消除 3NF 非平凡且非函数依赖的多值依赖）

## 设计模式

> 各大设计模式例子参考：CSDN 专栏 . C++ 设计模式 系列博文

设计模式工程目录

### 单例模式

单例模式例子

### 抽象工厂模式

抽象工厂模式例子

### 适配器模式

适配器模式例子

### 桥接模式

桥接模式例子

### 观察者模式

观察者模式例子

### 设计模式的六大原则

- 单一职责原则（SRP，Single Responsibility Principle）

- 里氏替换原则（LSP，Liskov Substitution Principle）

- 依赖倒置原则（DIP，Dependence Inversion Principle）

- 接口隔离原则（ISP，Interface Segregation Principle）

- 迪米特法则（LoD，Law of Demeter）

- 开放封闭原则（OCP，Open Close Principle）

## 链接装载库

### 内存、栈、堆

一般应用程序内存空间有如下区域：

- 栈：由操作系统自动分配释放，存放函数的参数值、局部变量等的值，用于维护函数调用的上下文

- 堆：一般由程序员分配释放，若程序员不释放，程序结束时可能由操作系统回收，用来容纳应用程序动态分配的内存区域

- 可执行文件映像：存储着可执行文件在内存中的映像，由装载器装载是将可执行文件的内存读取或映射到这里

- 保留区：保留区并不是一个单一的内存区域，而是对内存中受到保护而禁止访问的内存区域的总称，如通常 C 语言讲无效指针赋值为 0（NULL），因此 0 地址正常情况下不可能有效的访问数据

#### 栈

栈保存了一个函数调用所需要的维护信息，常被称为堆栈帧（Stack Frame）或活动记录（Activate Record），一般包含以下几方面：

- 函数的返回地址和参数

- 临时变量：包括函数的非静态局部变量以及编译器自动生成的其他临时变量

- 保存上下文：包括函数调用前后需要保持不变的寄存器

#### 堆

堆分配算法：

- 空闲链表（Free List）

- 位图（Bitmap）

- 对象池

#### “段错误（segment fault）” 或 “非法操作，该内存地址不能 read/write”

典型的非法指针解引用造成的错误。当指针指向一个不允许读写的内存地址，而程序却试图利用指针来读或写该地址时，会出现这个错误。

普遍原因：

- 将指针初始化为 NULL，之后没有给它一个合理的值就开始使用指针

- 没用初始化栈中的指针，指针的值一般会是随机数，之后就直接开始使用指针

### 编译链接

#### 各平台文件格式

<table><thead><tr><th>平台</th><th>可执行文件</th><th>目标文件</th><th>动态库 / 共享对象</th><th>静态库</th></tr></thead><tbody><tr><td>Windows</td><td>exe</td><td>obj</td><td>dll</td><td>lib</td></tr><tr><td>Unix/Linux</td><td>ELF、out</td><td>o</td><td>so</td><td>a</td></tr><tr><td>Mac</td><td>Mach-O</td><td>o</td><td>dylib、tbd、framework</td><td>a、framework</td></tr></tbody></table>

#### 编译链接过程

1. 预编译（预编译器处理如 `#include`、`#define` 等预编译指令，生成 `.i` 或 `.ii` 文件）

2. 编译（编译器进行词法分析、语法分析、语义分析、中间代码生成、目标代码生成、优化，生成 `.s` 文件）

3. 汇编（汇编器把汇编码翻译成机器码，生成 `.o` 文件）

4. 链接（连接器进行地址和空间分配、符号决议、重定位，生成 `.out` 文件）

> 现在版本 GCC 把预编译和编译合成一步，预编译编译程序 cc1、汇编器 as、连接器 ldMSVC 编译环境，编译器 cl、连接器 link、可执行文件查看器 dumpbin

#### 目标文件

编译器编译源代码后生成的文件叫做目标文件。目标文件从结构上讲，它是已经编译后的可执行文件格式，只是还没有经过链接的过程，其中可能有些符号或有些地址还没有被调整。

> 可执行文件（Windows 的 `.exe` 和 Linux 的 `ELF`）、动态链接库（Windows 的 `.dll` 和 Linux 的 `.so`）、静态链接库（Windows 的 `.lib` 和 Linux 的 `.a`）都是按照可执行文件格式存储（Windows 按照 PE-COFF，Linux 按照 ELF）

##### 目标文件格式

- Windows 的 PE（Portable Executable），或称为 PE-COFF，`.obj` 格式

- Linux 的 ELF（Executable Linkable Format），`.o` 格式

- Intel/Microsoft 的 OMF（Object Module Format）

- Unix 的 `a.out` 格式

- MS-DOS 的 `.COM` 格式

> PE 和 ELF 都是 COFF（Common File Format）的变种

##### 目标文件存储结构

<table><thead><tr><th>段</th><th>功能</th></tr></thead><tbody><tr><td>File Header</td><td>文件头，描述整个文件的文件属性（包括文件是否可执行、是静态链接或动态连接及入口地址、目标硬件、目标操作系统等）</td></tr><tr><td>.text section</td><td>代码段，执行语句编译成的机器代码</td></tr><tr><td>.data section</td><td>数据段，已初始化的全局变量和局部静态变量</td></tr><tr><td>.bss section</td><td>BSS 段（Block Started by Symbol），未初始化的全局变量和局部静态变量（因为默认值为 0，所以只是在此预留位置，不占空间）</td></tr><tr><td>.rodata section</td><td>只读数据段，存放只读数据，一般是程序里面的只读变量（如 const 修饰的变量）和字符串常量</td></tr><tr><td>.comment section</td><td>注释信息段，存放编译器版本信息</td></tr><tr><td>.note.GNU-stack section</td><td>堆栈提示段</td></tr></tbody></table>

> 其他段略

#### 链接的接口————符号

在链接中，目标文件之间相互拼合实际上是目标文件之间对地址的引用，即对函数和变量的地址的引用。我们将函数和变量统称为符号（Symbol），函数名或变量名就是符号名（Symbol Name）。

如下符号表（Symbol Table）：

<table><thead><tr><th>Symbol（符号名）</th><th>Symbol Value （地址）</th></tr></thead><tbody><tr><td>main</td><td>0x100</td></tr><tr><td>Add</td><td>0x123</td></tr><tr><td>...</td><td>...</td></tr></tbody></table>

### Linux 的共享库（Shared Library）

Linux 下的共享库就是普通的 ELF 共享对象。

共享库版本更新应该保证二进制接口 ABI（Application Binary Interface）的兼容

#### 命名

`libname.so.x.y.z`

- x：主版本号，不同主版本号的库之间不兼容，需要重新编译

- y：次版本号，高版本号向后兼容低版本号

- z：发布版本号，不对接口进行更改，完全兼容

#### 路径

大部分包括 Linux 在内的开源系统遵循 FHS（File Hierarchy Standard）的标准，这标准规定了系统文件如何存放，包括各个目录结构、组织和作用。

- `/lib`：存放系统最关键和最基础的共享库，如动态链接器、C 语言运行库、数学库等

- `/usr/lib`：存放非系统运行时所需要的关键性的库，主要是开发库

- `/usr/local/lib`：存放跟操作系统本身并不十分相关的库，主要是一些第三方应用程序的库

> 动态链接器会在 `/lib`、`/usr/lib` 和由 `/etc/ld.so.conf` 配置文件指定的，目录中查找共享库

#### 环境变量

- `LD_LIBRARY_PATH`：临时改变某个应用程序的共享库查找路径，而不会影响其他应用程序

- `LD_PRELOAD`：指定预先装载的一些共享库甚至是目标文件

- `LD_DEBUG`：打开动态链接器的调试功能

#### so 共享库的编写

#### 使用 CLion 编写共享库

创建一个名为 MySharedLib 的共享库 CMakeLists.txt

```
cmake_minimum_required(VERSION 3.10)
project(MySharedLib)

set(CMAKE_CXX_STANDARD 11)

add_library(MySharedLib SHARED library.cpp library.h)


```

library.h

```
#ifndef MYSHAREDLIB_LIBRARY_H
#define MYSHAREDLIB_LIBRARY_H

// 打印 Hello World!
void hello();

// 使用可变模版参数求和
template <typename T>
T sum(T t)
{  
    return t;
}
template <typename T, typename ...Types>
T sum(T first, Types ... rest)
{ 
    return first + sum<T>(rest...);
}

#endif


```

library.cpp

```
#include <iostream>
#include "library.h"

void hello() {  
    std::cout << "Hello, World!" << std::endl;
}


```

#### so 共享库的使用（被可执行项目调用）

#### 使用 CLion 调用共享库

创建一个名为 TestSharedLib 的可执行项目 CMakeLists.txt

```
cmake_minimum_required(VERSION 3.10)
project(TestSharedLib)

# C++11 编译
set(CMAKE_CXX_STANDARD 11)

# 头文件路径
set(INC_DIR /home/xx/code/clion/MySharedLib)
# 库文件路径
set(LIB_DIR /home/xx/code/clion/MySharedLib/cmake-build-debug)

include_directories(${INC_DIR})
link_directories(${LIB_DIR})
link_libraries(MySharedLib)

add_executable(TestSharedLib main.cpp)

# 链接 MySharedLib 库
target_link_libraries(TestSharedLib MySharedLib)


```

main.cpp

```
#include <iostream>
#include "library.h"
using std::cout;
using std::endl;

int main() {  

    hello(); 
    cout << "1 + 2 = " << sum(1,2) << endl;   
    cout << "1 + 2 + 3 = " << sum(1,2,3) << endl;   
    
    return 0;
}


```

执行结果

```
Hello, World!
1 + 2 = 3
1 + 2 + 3 = 6


```

### Windows 应用程序入口函数

- GUI（Graphical User Interface）应用，链接器选项：`/SUBSYSTEM:WINDOWS`

- CUI（Console User Interface）应用，链接器选项：`/SUBSYSTEM:CONSOLE`

#### _tWinMain 与_tmain 函数声明

```
Int WINAPI _tWinMain( 
    HINSTANCE hInstanceExe,  
    HINSTANCE,  
    PTSTR pszCmdLine,  
    int nCmdShow);
    
int _tmain(  
    int argc, 
    TCHAR *argv[],  
    TCHAR *envp[]);


```

<table><thead><tr><th>应用程序类型</th><th>入口点函数</th><th>嵌入可执行文件的启动函数</th></tr></thead><tbody><tr><td>处理 ANSI 字符（串）的 GUI 应用程序</td><td>_tWinMain(WinMain)</td><td>WinMainCRTSartup</td></tr><tr><td>处理 Unicode 字符（串）的 GUI 应用程序</td><td>_tWinMain(wWinMain)</td><td>wWinMainCRTSartup</td></tr><tr><td>处理 ANSI 字符（串）的 CUI 应用程序</td><td>_tmain(Main)</td><td>mainCRTSartup</td></tr><tr><td>处理 Unicode 字符（串）的 CUI 应用程序</td><td>_tmain(wMain)</td><td>wmainCRTSartup</td></tr><tr><td>动态链接库（Dynamic-Link Library）</td><td>DllMain</td><td>_DllMainCRTStartup</td></tr></tbody></table>

### Windows 的动态链接库（Dynamic-Link Library）

> 知识点来自《Windows 核心编程（第五版）》

#### 用处

- 扩展了应用程序的特性

- 简化了项目管理

- 有助于节省内存

- 促进了资源的共享

- 促进了本地化

- 有助于解决平台间的差异

- 可以用于特殊目的

#### 注意

- 创建 DLL，事实上是在创建可供一个可执行模块调用的函数

- 当一个模块提供一个内存分配函数（malloc、new）的时候，它必须同时提供另一个内存释放函数（free、delete）

- 在使用 C 和 C++ 混编的时候，要使用 extern "C" 修饰符

- 一个 DLL 可以导出函数、变量（避免导出）、C++ 类（导出导入需要同编译器，否则避免导出）

- DLL 模块：cpp 文件中的 __declspec(dllexport) 写在 include 头文件之前

- 调用 DLL 的可执行模块：cpp 文件的 __declspec(dllimport) 之前不应该定义 MYLIBAPI

#### 加载 Windows 程序的搜索顺序

1. 包含可执行文件的目录

2. Windows 的系统目录，可以通过 GetSystemDirectory 得到

3. 16 位的系统目录，即 Windows 目录中的 System 子目录

4. Windows 目录，可以通过 GetWindowsDirectory 得到

5. 进程的当前目录

6. PATH 环境变量中所列出的目录

#### DLL 入口函数

#### DllMain 函数

```
BOOL WINAPI DllMain(HINSTANCE hinstDLL, DWORD fdwReason, LPVOID lpvReserved)
{ 
    switch(fdwReason)   
    { 
    case DLL_PROCESS_ATTACH:      
        // 第一次将一个DLL映射到进程地址空间时调用     
        // The DLL is being mapped into the process' address space.      
        break;  
    case DLL_THREAD_ATTACH:    
        // 当进程创建一个线程的时候，用于告诉DLL执行与线程相关的初始化（非主线程执行）     
        // A thread is bing created.    
        break;  
    case DLL_THREAD_DETACH:    
        // 系统调用 ExitThread 线程退出前，即将终止的线程通过告诉DLL执行与线程相关的清理      
        // A thread is exiting cleanly.  
        break;  
    case DLL_PROCESS_DETACH:    
        // 将一个DLL从进程的地址空间时调用   
        // The DLL is being unmapped from the process' address space.     
        break;  
    } 
    return (TRUE); // Used only for DLL_PROCESS_ATTACH
}


```

#### 载入卸载库

#### FreeLibraryAndExitThread 函数声明

```
// 载入库
HMODULE WINAPI LoadLibrary( 
  _In_ LPCTSTR lpFileName
);
HMODULE LoadLibraryExA( 
  LPCSTR lpLibFileName,
  HANDLE hFile, 
  DWORD  dwFlags
);
// 若要在通用 Windows 平台（UWP）应用中加载 Win32 DLL，需要调用 LoadPackagedLibrary，而不是 LoadLibrary 或 LoadLibraryEx
HMODULE LoadPackagedLibrary( 
  LPCWSTR lpwLibFileName, 
  DWORD   Reserved
);

// 卸载库
BOOL WINAPI FreeLibrary( 
  _In_ HMODULE hModule
);
// 卸载库和退出线程
VOID WINAPI FreeLibraryAndExitThread( 
  _In_ HMODULE hModule,  
  _In_ DWORD   dwExitCode
);


```

#### 显示地链接到导出符号

#### GetProcAddress 函数声明

```
FARPROC GetProcAddress(
  HMODULE hInstDll,
  PCSTR pszSymbolName  // 只能接受 ANSI 字符串，不能是 Unicode
);


```

#### DumpBin.exe 查看 DLL 信息

在 `VS 的开发人员命令提示符` 使用 `DumpBin.exe` 可查看 DLL 库的导出段（导出的变量、函数、类名的符号）、相对虚拟地址（RVA，relative virtual address）。如：

```
DUMPBIN -exports D:\mydll.dll


```

DLL 头文件

```
// MyLib.h

#ifdef MYLIBAPI

// MYLIBAPI 应该在全部 DLL 源文件的 include "Mylib.h" 之前被定义
// 全部函数/变量正在被导出

#else

// 这个头文件被一个exe源代码模块包含，意味着全部函数/变量被导入
#define MYLIBAPI extern "C" __declspec(dllimport)

#endif

// 这里定义任何的数据结构和符号

// 定义导出的变量（避免导出变量）
MYLIBAPI int g_nResult;

// 定义导出函数原型
MYLIBAPI int Add(int nLeft, int nRight);


```

DLL 源文件

```
// MyLibFile1.cpp

// 包含标准Windows和C运行时头文件
#include <windows.h>

// DLL源码文件导出的函数和变量
#define MYLIBAPI extern "C" __declspec(dllexport)

// 包含导出的数据结构、符号、函数、变量
#include "MyLib.h"

// 将此DLL源代码文件的代码放在此处
int g_nResult;

int Add(int nLeft, int nRight)
{  

    g_nResult = nLeft + nRight; 
    return g_nResult;
}


```

#### DLL 库的使用（运行时动态链接 DLL）

#### DLL 库的使用（运行时动态链接 DLL）

```
// A simple program that uses LoadLibrary and 
// GetProcAddress to access myPuts from Myputs.dll.

#include <windows.h> 
#include <stdio.h> 

typedef int (__cdecl *MYPROC)(LPWSTR); 

int main( void )
{  
    HINSTANCE hinstLib;  
    MYPROC ProcAdd;  
    BOOL fFreeResult, fRunTimeLinkSuccess = FALSE;     
    
    // Get a handle to the DLL module.   
    
    hinstLib = LoadLibrary(TEXT("MyPuts.dll"));   
    
    // If the handle is valid, try to get the function address.   
    
    if (hinstLib != NULL)  
    {     
        ProcAdd = (MYPROC) GetProcAddress(hinstLib, "myPuts");       
        // If the function address is valid, call the function.      
        if (NULL != ProcAdd)       
        {      
            fRunTimeLinkSuccess = TRUE;    
            (ProcAdd) (L"Message sent to the DLL function\n");        
        }     
        // Free the DLL module.     
        
        fFreeResult = FreeLibrary(hinstLib);   
    }   
    
    // If unable to call the DLL function, use an alternative.  
    if (! fRunTimeLinkSuccess)     
        printf("Message printed from executable\n");   
    return 0;
}


```

### 运行库（Runtime Library）

#### 典型程序运行步骤

1. 操作系统创建进程，把控制权交给程序的入口（往往是运行库中的某个入口函数）

2. 入口函数对运行库和程序运行环境进行初始化（包括堆、I/O、线程、全局变量构造等等）。

3. 入口函数初始化后，调用 main 函数，正式开始执行程序主体部分。

4. main 函数执行完毕后，返回到入口函数进行清理工作（包括全局变量析构、堆销毁、关闭 I/O 等），然后进行系统调用结束进程。

> 一个程序的 I/O 指代程序与外界的交互，包括文件、管程、网络、命令行、信号等。更广义地讲，I/O 指代操作系统理解为 “文件” 的事物。

#### glibc 入口

`_start -> __libc_start_main -> exit -> _exit`其中 `main(argc, argv, __environ)` 函数在 `__libc_start_main` 里执行。

#### MSVC CRT 入口

`int mainCRTStartup(void)`

执行如下操作：

1. 初始化和 OS 版本有关的全局变量。

2. 初始化堆。

3. 初始化 I/O。

4. 获取命令行参数和环境变量。

5. 初始化 C 库的一些数据。

6. 调用 main 并记录返回值。

7. 检查错误并将 main 的返回值返回。

#### C 语言运行库（CRT）

大致包含如下功能：

- 启动与退出：包括入口函数及入口函数所依赖的其他函数等。

- 标准函数：有 C 语言标准规定的 C 语言标准库所拥有的函数实现。

- I/O：I/O 功能的封装和实现。

- 堆：堆的封装和实现。

- 语言实现：语言中一些特殊功能的实现。

- 调试：实现调试功能的代码。

#### C 语言标准库（ANSI C）

包含：

- 标准输入输出（stdio.h）

- 文件操作（stdio.h）

- 字符操作（ctype.h）

- 字符串操作（string.h）

- 数学函数（math.h）

- 资源管理（stdlib.h）

- 格式转换（stdlib.h）

- 时间 / 日期（time.h）

- 断言（assert.h）

- 各种类型上的常数（limits.h & float.h）

- 变长参数（stdarg.h）

- 非局部跳转（setjmp.h）

## 海量数据处理

- 海量数据处理面试题集锦

- 十道海量数据处理面试题与十个方法大总结

## 音视频

- 最全实时音视频开发要用到的开源工程汇总

- 18 个实时音视频开发中会用到开源项目

## 其他

- Bjarne Stroustrup 的常见问题

- Bjarne Stroustrup 的 C++ 风格和技巧常见问题

## 书籍

### 语言

- 《C++ Primer》

- 《Effective C++》

- 《More Effective C++》

- 《深度探索 C++ 对象模型》

- 《深入理解 C++11》

- 《STL 源码剖析》

### 算法

- 《剑指 Offer》

- 《编程珠玑》

- 《程序员面试宝典》

### 系统

- 《深入理解计算机系统》

- 《Windows 核心编程》

- 《Unix 环境高级编程》

### 网络

- 《Unix 网络编程》

- 《TCP/IP 详解》

### 其他

- 《程序员的自我修养》

> 转自：https://github.com/huihut/interview

- EOF -

推荐阅读  点击标题可跳转

1、[干货推荐 ：五万字长文总结 C/C++ 知识](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651171118&idx=1&sn=e3ce537eb3cee543a6a04932f2334c20&chksm=80647871b713f1679d1cc7c5e415e099d2396c9e8e9c6ab60573a13c0f9a38688834b62f0481&scene=21#wechat_redirect)

2、[可怕！CPU 暗藏了这些未公开的指令！](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651171115&idx=1&sn=5f3b59cd28380528cf6e23bc9f113811&chksm=80647874b713f162e9c8d18c0755ccb64930882b57407481c6659381d64b629cb8f5235cc7f8&scene=21#wechat_redirect)

3、[又要卷？挑战 C 语言，新的系统编程语言 Hare 发布](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651170940&idx=1&sn=76cd0ba93868798e83f2630ead6770ce&chksm=80647923b713f035393048a5268c2a7b90749f60d504401ed44282aeb151099bbd3302311b79&scene=21#wechat_redirect)
