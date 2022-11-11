- [`CGI`](#cgi)
  - [`fastcgi`](#fastcgi)
  - [WSGI 服务器](#wsgi-服务器)
    - [`wsgi` Web 服务器网关接口](#wsgi-web-服务器网关接口)
    - [`uWsgi`](#uwsgi)
    - [`gunicorn`](#gunicorn)
- [部署](#部署)
  - [wsgi Web 服务器网关](#wsgi-web-服务器网关)
  - [Web 服务器](#web-服务器)
    - [Nginx](#nginx)
    - [Apache](#apache)
  - [后台服务管理 `supervisor`](#后台服务管理-supervisor)
  - [正向反向代理](#正向反向代理)
  - [`https`](#https)

# `CGI`

- [nginx 和 gunicorn 和 flask 的关系](https://www.zhihu.com/question/297267614/answer/505683007)

- [GI、FastCGI、WSGI、uwsgi、uWSGI](https://blog.csdn.net/qq_32767041/article/details/81227348)

- [说说 http/webserver/fastcgi/php-fpm](http://www.lxlxw.me/?p=216)

`common gateway interface` 通用网关接口，我把请求参数发送给你，然后我接收你的处理结果给客户端（浏览器）

- CGI 是为了保证 web 服务器传递过来的数据是标准格式的，它是一个协议，方便 CGI 程序的编写者。Fastcgi 是 CGI 的更高级的一种方式，是用来提高 CGI 程序性能的

- 如果请求的不是静态文件，需要去找 PHP 解析器来处理，那么它会把这个请求简单处理后启动对应的 CGI 程序（比如 PHP 解析器）。此时 CGI 便是规定了要传什么数据和以什么格式传输给 PHP 解析器的协议。接下来 PHP 解析器会解析配置文件，初始化执行环境，然后处理请求，再以 CGI 规定的格式返回处理后的结果，退出进程。web 服务器再把结果返回给浏览器

- `CGI` 针对每个 `http` 请求都是 `fork` 一个新进程来进行处理，处理过程包括解析配置文件，初始化执行环境等，然后这个进程会把处理完的数据返回给 `web`服务器，最后 `web` 服务器把内容发送给用户，刚才 `fork` 的进程也随之退出。 如果下次用户还请求动态资源，那么 `web` 服务器又再次 `fork` 一个新进程，周而复始的进行

## `fastcgi`

- CGI 的一个扩展，像是一个常驻的 CGI ，废除了 CGI `fork-and-execute`（来一个请求 fork 一个新进程处理，处理完再把进程 kill 掉）的工作方式，转而使用一种长生存期的方法，减少了进程消耗，提升了性能。

- Web 服务器启动时载入 FastCGI 进程管理器（IIS ISAPI 或 Apache Module)

- FastCGI 进程管理器自身初始化，启动多个 CGI 解释器进程 (可见多个 php-cgi) 并等待来自 Web 服务器的连接。

- 当客户端请求到达 Web 服务器时，FastCGI 进程管理器选择并连接到一个 CGI 解释器。Web 服务器将 CGI 环境变量和标准输入发送到 FastCGI 子进程 php-cgi

- FastCGI 子进程完成处理后将`标准输出和错误信息`从同一连接返回 Web 服务器。当 FastCGI 子进程关闭连接时，请求便告处理完成。FastCGI 子进程接着等待并处理来自 FastCGI 进程管理器 (运行在 Web 服务器中) 的下一个连接。 在 CGI 模式中，php-cgi 在此便退出了。

## WSGI 服务器

### `wsgi` Web 服务器网关接口

> `web server gateway interface` WEB 服务器（和 Nginx 和 Apache 一样）网关接口，当前运行在 WSGI 协议之上的 Web 框架有 Bottle，Flask，Django

[wsgi 与 cgi 的区别](https://www.cnblogs.com/jingtyu/p/6951436.html)

- `WSGI` 是一个 Python 程序和用户请求之间的接口；作用就是接受并分析用户的请求，调用相应的 `python` 对象完成对请求的处理，然后返回相应的结果。

- **`wsgi` 规范**

  - 必须接受 `environ, start_response` 两个参数

  - 必须返回可迭代对象，用来表示 `http body`

  - 必须是一个可调用对象

- 一个简单的 `wsgi` 应用例子

  ```py
  def application(environ, start_response):
      # 必须是一个可调用（比如函数）对象
      # 必须接受 `environ, start_response` 两个参数

      headers = [
          ('Content-Type', 'text/html; charset=utf8'),
          ('Content-Length', str(len(body)))
      ]
      start_response('200 OK', headers)

      # 必须返回可迭代对象，用来表示 http body
      return [body]
  ```

- `uWSGI & gunicorn`

  都提供了 `prefork` 方式增加服务器的并发处理能力，都是 `wsgi` 服务器

### `uWsgi`

[官方文档](https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/index.html)

- `uwsgi 和 uWSGI`

  - `uWSGI` 是一个生产用服务器，而 `uwsgi` 是一种网络通信协议

  - `uwsgi` 是 **python 的 web 程序和 web 服务器（比如 Nginx）** 之间的一种通信协议，是 `uWSGI` 服务器的独占协议

- 简单测试

  ```py
  # test.py
  # 入参和返回值遵循wsgi规范
  def application(env, start_response):
    start_response('200 OK', [('Content-Type','text/html')])
    # return "Hello World"      # 注：python2使用
    return [b"Hello World"]     # 注：python3使用
  ```

- 通过命令运行 wsgi 服务

  ```sh
  # 注意端口的格式 --http :8001 相当于 --http 0.0.0.0:8001
  uwsgi --http :8001 --wsgi-file test.py

  ```

- 通过 `ini` 或 `xml` 配置文件启动 `uwsgi --ini /path/to/uwsgi_Nginx.ini`

  ```ini
  #添加配置选择
  [uwsgi]
  base = /path/to/your/proj

  # 配置和Nginx连接的socket连接
  socket=127.0.0.1:8002

  # 配置项目路径，项目的所在目录
  chdir = %(base)/keplerblog  # 可以这样像使用变量一样使用定义的值

  # 配置wsgi接口模块文件路径
  wsgi-file=%(base)/wsgi.py

  # 实例名称，根据uwsgi协议，一般是application
  callable = app

  # uwsgi 运行日志
  logto = %(chdir)/logs/uwsgi/%n.log  # %n 表示当前文件名称

  # 配置启动的进程数
  processes=4
  # 配置每个进程的线程数
  threads=2

  # 配置启动管理主进程
  master=True

  # 配置存放主进程的进程号文件
  pidfile=uwsgi.pid

  # 配置dump日志记录
  daemonize=uwsgi.log`
  ```

### `gunicorn`

一个 Python WSGI UNIX 的 `HTTP 服务器`

[uWsgi 和 gunicorn 区别](https://blog.csdn.net/hans99812345/article/details/124815686)

- uWsgi 和 gunicorn 都是实现 WSGI 协议的 Web 服务器，**并且都是基于 Perfork 模型**

- Uwsgi 是通过 C 语言编写的， Gnnicorn 是通过 Python 语言编写的；相对于 Uwsgi，Gunicorn 相对于简单，启动也十分方便

- [Gunicorn 配置](https://www.cnblogs.com/nanrou/p/7026789.html)

- [配置项说明](https://blog.csdn.net/qq_40039731/article/details/123124455)

  `gunicorn` 的配置是一个 `py` 文件（当然，你也可以把后缀改为 ini）

  ```py
  # gunicorn_config.py
  import logging
  import os
  import multiprocessing


  # 绑定ip和端口号
  bind = '10.0.0.130:8000'

  # 监听队列
  backlog = 512

  # gunicorn要切换到的目的工作目录
  chdir = '/home/test/server/bin'

  # 超时
  timeout = 30

  # 工作模式协程，默认的是sync模式
  worker_class = 'gevent'

  # 预加载
  preload_app = True

  # 进程数
  workers = multiprocessing.cpu_count() * 2 + 1

  # 指定每个进程开启的线程数
  threads = 2

  # 日志配置
  # 日志级别，这个日志级别指的是错误日志的级别，而访问日志的级别无法设置
  loglevel = 'info'
  access_log_format = '%(t)s %(p)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'
  accesslog = "/home/test/server/log/gunicorn_access.log"
  errorlog = "/home/test/server/log/gunicorn_error.log"

  # 通过配置文件启动django服务：
  # 对应的wsgi文件路径是 /mysite/wsgi.py，启动时要用像python导入一样的路径
  # gunicorn mysite.wsgi -c gunicorn_config.py
  ```

- 当然也可以直接通过命令行去执行

  ```sh
  gunicorn -D -t 30 -b 0.0.0.0:8080 -w 5 /path/to/your/app
  # -t timeout -w workers -b bind
  ```

- [指定虚拟环境](https://www.jianshu.com/p/9243b98faa06/)

  在虚拟环境中 pip install gunicorn；运行的时候就会用虚拟环境中的可执行程序了（运行的时候不需要 source 激活虚拟环境，还是很方便的）

# 部署

![部署结构](https://upload-images.jianshu.io/upload_images/13545807-0bbaaff9cd4bf625.png)

```sh
一：

  Flask 内置 WebServer + Flask App ===> 弱鸡版本的 Server, 单进程（单 worker) / 失败挂掉 / 不易 Scale

二：

  gunicorn + Flask App ===> 多进程（多 worker） / 多线程 / 失败自动帮你重启 Worker / 可简单 Scale

三：

  多 Nginx + 多 Gunicorn + Flask App ===> 小型多实例 Web 应用，一般也会给 gunicorn 挂 supervisor


[Chrome] -- HTTP --> [Nginx / Apache] -- 反向代理 --> [uwsgi / gunicorn] -- wsgi --> [Flask / Django]

由 supervisor 管理 gunicorn 进程（进程管理功能比 systemctl 更强大）；再由 systemctl 管理 supervisor 进程（方便启停命令执行）

```

## wsgi Web 服务器网关

## Web 服务器

- `apache 的 httpd & Nginx` 都是 web 服务器

  Nginx 会拦截到静态请求（静态文件，如图片），并交给自己处理。

  动态请求则反向代理给 web 应用

- `Nginx` 和 `uwsgi` 的区别和作用：

  - Nginx 是对外的服务器，外部浏览器通过 url 访问 nginx, uwsgi 是对内的服务器，主要用来处理动态请求。

  - Nginx 接收到浏览器发送过来的 http 请求，将包进行解析，分析 url

    - 如果是静态文件请求就直接访问用户给 Nginx 配置的静态文件目录，直接返回用户请求的静态文件

    - 如果是一个动态的请求，那么 Nginx 就==将请求转发给 uwsgi==

  - uwsgi 接收到请求之后将包进行处理，处理成 `wsgi协议` 可以接受的格式，并发给实现了 wsgi 协议的 web 应用（Flask / Django）

    - web 应用根据请求调用应用程序的某个文件，某个文件的某个函数，最后处理完将返回值再次交给 wsgi, wsgi 将返回值进行打包，打包成 uwsgi 能够接收的格式

  - uwsgi 接收 wsgi 发送的请求，并转发给 Nginx, nginx 最终将返回值返回给浏览器。

- 有 `cgi` 服务器，为什么还要 `Nginx`

  - 安全；不管什么请求都要经过代理服务器，可以避免外部程序直接攻击 Web 服务器

  - 负载均衡；根据请求情况和服务器负载情况，将请求分配给不同的 Web 服务器，保证服务器性能

  - 提高 Web 服务器的 IO 性能；请求从客户端传到 Web 服务器是需要时间的，传递多长时间就会让这个进程阻塞多长时间，而**通过反向代理，就可以由反向代理完整接受该请求，然后再传给 Web 服务器，从而保证服务器性能**，而且有的一些简单的事情（比如静态文件）可以直接由反向代理处理，不经过 Web 服务器。

### Nginx

### Apache

## 后台服务管理 `supervisor`

[supervisor 简单使用](https://bbs.huaweicloud.com/blogs/363606)

> 和 systemctl 类似的进程管理工具

- linux/unix 下 `python 开发的` 进程管理工具，用这个工具可以一次管理多个进程，而不必启动的时候去各个程序安装目录下面启动和关闭，还可以监控进程状态，异常退出时能自动重启，僵尸进程会杀掉 j 重启吗？

- `uWSGI` 和 `gunicorn` 都是直接通过命令行运行，并不能够在后台运行，所以我们需要借助进程管理工具让 uWSGI 或 gunicorn 在后台运行

## 正向反向代理

![alt](https://pic1.zhimg.com/v2-6cb52abc5ee452d1b6944d4bc0dc1e90_r.jpg)

- `正向代理`

  > 正向的就是**由浏览器主动通过代理服务器发出请求**，经代理服务器做出处理后再转给目标服务器

  客户要访问 facebook 但是无法访问，则需要通过 `VPN` 进行代理，把数据包丢给 VPN 提供商，VPN 提供商再把响应返回给我们，对于 web 服务器来说，隐藏了客户端的信息

- `反向代理`

  > 反向的就是不管浏览器同不同意，**请求都会经过代理服务器处理再发给目标服务器**

  客户端给服务器发送的请求，`Nginx` 作为代理服务器接收到之后，按照一定的规则分发给了后端的业务处理服务器进行处理了。此时客户端是明确的，但是这些请求被哪台服务器处理并不明确

## `https`

- [`linux` 中 `openssl` 生成证书和自签证书](https://www.cnblogs.com/gradven/p/5353256.html)
