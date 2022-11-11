- [1. Session 的集群管理](#1-session-的集群管理)
  - [1.1 Session 复制](#11-session-复制)
  - [1.2 Session 绑定](#12-session-绑定)
  - [1.3 利用 Cookie 记录 Session](#13-利用-cookie-记录-session)
  - [1.4 Session 服务器](#14-session-服务器)
- [2 基于 Memcached 的 Session 同步实现](#2-基于-memcached-的-session-同步实现)
  - [2.1 系统结构](#21-系统结构)
  - [2.2 原理](#22-原理)
  - [2.3 配置](#23-配置)
  - [2.4 验证](#24-验证)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/u010723709/article/details/50326877)

# 1. Session 的集群管理

事实上，网站总是有状态的。每一个登录信息、用户信息常常被存储在 session 内部。而当一个网站被部署在不止一台服务器的时候，就会遇到 session 同步的问题。事实上即使一个很小的网站，也要至少有两台服务器互为备份，分单流量是必须得，更重要的是无缝切流量升级。为了保证服务的不间断又要进行网站的维护升级，切流量是最简单的。那么如何保证切流量的时候 session 也会跟着同步过去呢？在集群环境下，大致有以下几种手段

## 1.1 Session 复制

> 这是一种在早期应用系统中使用较多的服务器 session 管理方式。应用服务器`开启 Web 容器的 session 的复制功能，在集群中的几台服务器之间同步 session 对象，这样一台服务器宕机不会导致 session 数据丢失`。即每一台服务器都持有集群中所有的 session，每次访问仅从本机获取就可以了。其工作形式如下所示：

![alt](https://img-blog.csdn.net/20151216141300490?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 从 session 复制的几条线就可以看出，这种方式仅适用用小型集群

- 当服务集群规模很大时，集群服务器间的复制就需要大量的通讯，占用大量网络资源，甚至会出现内存不够的情况

## 1.2 Session 绑定

> Session 绑定可以`利用负载均衡的源地址 Hash 算法实现，负载均衡服务器总是将来自同一个 IP 地址的访问分发到同一台服务器上`。这样整个会话期间，用户所有的请求都来自一台服务器，保证了 Session 总是从这台服务器获取。其工作形式如下图所示

![alt](https://img-blog.csdn.net/20151216142313062?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- 如果一台服务器宕机，那么其处理的所有请求 Session 会话全部丢失，用户因为切换服务器后没有 Session 而导致无法完成业务。

## 1.3 利用 Cookie 记录 Session

> 这种管理方式`将 Session 记录在客户端`，每次请求服务器的时候，将 Session 放在请求中发送给服务器，服务器处理完成后再将修改后的 Session 响应给客户端。

![alt](https://img-blog.csdn.net/20151216143006117?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

- Cookie 有大小长度限制

- Cookie 能记录的信息也有限，因为很多时候我们在 Session 中储存的也并非 String 类型的记录

- 每次请求都需要传输 Cookie，影响性能

- 如果用户关闭 Cookie 功能就不能用了

但是这种方式因此高可用性、支持服务器的线性伸缩，许多网站都在使用这种方式。我的学校网站也应用了这种技术。

## 1.4 Session 服务器

> 如果有这样一个服务器，可用性高、伸缩性好、性能也不错，对信息大小又没有限制，那它就是 Session 服务器。`利用独立部署的 Session 服务器统一管理 Session`，应用服务器每次读写 Session 时，都访问 Session 服务器。其工作形式如下所示。

![alt](https://img-blog.csdn.net/20151216143759968?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

这种方式实际上是将应用服务器的状态分离，分为无状态的应用服务器和有状态的 Session 服务器，然后针对这两种服务器的不同特性分别设计其架构。

对于有状态的 Session 服务器，一种比较简单的方式是利用分布式缓存、数据库等。

# 2 基于 Memcached 的 Session 同步实现

## 2.1 系统结构

本人利用 Memcached 集群简单实现了 Tomcat Session 的同步管理。系统环境中所有服务器都是 CentOS6.5 的环境， 系统中有两台内存较大的服务器安装了 Memcached 服务，作为 Session 集群；两台服务器分别部署了 Tomcat8 作为应用服务器，一个服务器部署了 Apache2.4 作为负载均衡服务器

## 2.2 原理

> 这种基于 Memcached 的 Session 管理（memcached-session-manager 简称 SMS），利用的是 Tomcat 对 Request 跟踪。Request 到来时，从 memcached 中获取对应的 session，request 结束时，将 tomcat 中的 session 更新至 memcached 服务器。目前支持 sticky 和 no-sticky 模式

- `sticky 模式`

  tomcat 中的 session 作为主 session，memcached 中的为备份 session。发生 request 时，首先检查容器是否发生变化，发生变化则从 memcached 加载 Session 到本地，否则不加载，直到 request 请求结束。

- `Non-sticky 模式`

  memcached1 为主 session 服务，memcached2 为备份 session，tomcat 中的 session 为备份 session。Request 请求到来时，从 memcached 2 加载备 session 到 tomcat，（当容器中还是没有 session 则从 memcached1 加载主 session 到 tomcat， 这种情况是只有一个 memcached 节点，或者有 memcached1 出错时），Request 请求结束时，将 tomcat session 更新至 主 memcached1 和备 memcached2，并且清除 tomcat session 。以达到主备同步之目的。

## 2.3 配置

- 修改两台 tomcat 服务器的 conf 目录下 context.xml 文件，n1,n2 为两台 memcached 服务器的地址和端口号

  ```xml
  <Manager class
  memcachedNodes="n1:172.20.201.191:50120 n2:172.18.124.5:50120"
  lockingMode="auto"
  sticky="false"
  requestUriIgnorePattern= ".*\.(png|gif|jpg|css|js)$"
  sessionBackupAsync= "false"
  sessionBackupTimeout= "100"
  copyCollectionsForSerialization="true"
  transcoderFactoryClass="de.javakaffee.web.msm.serializer.kryo.KryoTranscoderFactory"
  />
  ```

- 将需要的 jar 包放在 tomcat 的 lib 目录下，然后启动 tomcat 服务器就可以了

  ```ini
  asm-4.0
  kryo-1.04(必须是这个版本)
  kryo-serializers-0.11（必须是这个版本）
  memcached-session-manager-1.8.3
  memcached-session-manager-tc8-1.8.3（与 tomcat 版本对应）
  minlog-none-1.2
  msm-kryo-serializer-1.8.3
  reflectasm-1.07
  spymemcached-2.10.3
  ```

注：在配置以上两步之前，需要保证的时候 apache 服务器已经可以负载均衡 tomcat 两台服务器。

## 2.4 验证

- 访问 Apache 服务器地址，负载到其中一台服务器

  ![alt](https://img-blog.csdn.net/20151216154426120?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

- 停止掉被负载到的这台服务器，刷新页面，可以看到服务器已经切换，但 sessionId 没有变化。已实现 Session 同步功能。

  ![alt](https://img-blog.csdn.net/20151216154443433?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)
