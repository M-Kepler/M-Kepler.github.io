- [参考资料](#参考资料)
- [Nginx](#nginx)
  - [安装部署](#安装部署)
  - [常用命令](#常用命令)
- [配置](#配置)
  - [配置结构](#配置结构)
  - [日志](#日志)
  - [变量](#变量)
  - [`events`](#events)
  - [`http`](#http)
  - [`location`](#location)
  - [重定向 `redirect`](#重定向-redirect)
  - [多站点配置](#多站点配置)
  - [负载均衡 `upstream`](#负载均衡-upstream)
    - [负载均衡配置](#负载均衡配置)
    - [负载均衡算法](#负载均衡算法)
  - [访问控制](#访问控制)
  - [DNS](#dns)
  - [Lua](#lua)
  - [Redis](#redis)
  - [其他](#其他)
- [逻辑控制语句](#逻辑控制语句)
  - [`if`](#if)
- [原理](#原理)
  - [master-worker 模型](#master-worker-模型)
  - [请求处理](#请求处理)
- [学习过程中的疑问](#学习过程中的疑问)
  - [配置加载顺序问题](#配置加载顺序问题)
- [排障指南](#排障指南)
- [其他](#其他-1)

# 参考资料

# Nginx

![alt](https://baiyp.ren/images/nginx/nginx01.png)

## 安装部署

> `nginx -V` 查看编译参数

- [CentOS7 安装 Nginx](https://blog.csdn.net/qq_37345604/article/details/90034424)

- [已安装的 Nginx 增加模块](https://blog.csdn.net/prufeng/article/details/100998041)

- [安装](https://www.php.cn/nginx/422612.html)

  ```sh
  # 安装支持 HTTPS 模块
  ./configure --prefix=/usr/local/nginx --with-http_ssl_module
  ```

- [Nginx 安装 lua-nginx-module](https://www.cnblogs.com/52fhy/p/10164553.html)

- [添加 `nginx` 到系统服务](https://www.jianshu.com/p/1ca5a62df1a9)

  - 其实 `centos` 已经支持了 `service nginx status` 或 `systemctl status nginx`

  - [用 systemctl 管理 nginx](https://www.cnblogs.com/ray-mmss/p/12077299.html)

## 常用命令

- `nginx -s quit` 优雅停止 nginx，有连接时会等连接请求完成再杀死 worker 进程

- `nginx -s reload` 优雅重启，并重新载入配置文件 nginx.conf

- `nginx -s reopen` 重新打开日志文件，一般用于切割日志

- `nginx -s stop` 强制停止 Nginx 服务

- `nginx -v` 查看版本

- `nginx -V` 详细版本信息，包括编译参数

- `nginx -t` 检查 nginx 的配置文件

- `nginx -?,-h` 打开帮助信息

- `nginx -c [filename]` 指定配置文件 (默认是:/etc/nginx/nginx.conf)

- `nginx -q` 在检测配置文件期间屏蔽非错误信息

- `nginx -p prefix` 设置前缀路径 (默认是:/usr/share/nginx/)

- `nginx -g directives` 设置配置文件外的全局指令

- `killall nginx` 杀死所有 nginx 进程

# 配置

[详细配置说明](https://segmentfault.com/a/1190000022338115)

[Nginx 配置](https://www.cnblogs.com/jing99/p/14691414.html)

默认配置 default.conf 不能重命名！！！

## 配置结构

![alt](https://img2020.cnblogs.com/blog/1010726/202104/1010726-20210421115241846-950947083.png)

- `nginx -t` 默认读取 `/usr/local/nginx/conf/nginx.conf` 如果 像上面那样把站点目录 `include` 进来，那么这些站点目录，只需要配置 `server` 块就行了，不需要配置 worker_processes 和 http 块

  ```conf
  # nginx.conf

  # 全局配置
  worker_processes 16;

  # event 块
  events {
    worker_connections 10240;
  }

  # stream 块
  stream {
    ; TCP 代理
    include stream.d/*.conf;
  }

  # http 配置
  http {
    ...
    # 日志在 http 块中定义
    access_log

    # 其他全局地配置也可以在这
    keepalive_timeout 65;
    ...

    # 全局初始化
    lua_package_path "/etc/nginx/luascripts/?.lua;;";
    init_by_lua_file /etc/nginx/luascripts/init.lua;
    init_worker_by_lua_file /etc/nginx/luascripts/init_worker.lua;
    ...

    # 把 server 块配置包含进来
    include conf.d/*.conf;

    # 把 upstream 配置包含进来
    include upstream.d/*.conf

  }

  ########
  # 站点配置 conf.d/test.conf
  server {
    listen 4480;
    location / {
      ...
    }
  }

  # 负载均衡配置 upstream.d/test.conf
  upstream testsrv {
    ip_hash;
    server 10.10.10.1:8888;
    server 10.10.10.2:8888;
  }
  ```

  ```nginx
  server {
    # 监听的端口，设置为默认服务
    # 默认服务(default_server)：当server_name匹配不到时，请求转发给默认服务
    listen 443 ssl default_server;
    server_name sdwanupdate.sangfor.com.cn;

    # 配置日志路径
    access_log /logs/nginx/access.log;
    error_log /logs/nginx/error.log;

    # SSL 证书
    ssl_certificate /root/source/upload_platform/deploy/server.crt;
    ssl_certificate_key /root/source/upload_platform/deploy/server.key.unsecure;

    # static 和 media 的地址
    location /static/ {
        root /root/source/upload_platform;
    }
    location /media/ {
        root /root/source/upload_platform;
    }

    # gunicorn 中生成的文件的地址
    location / {
        proxy_pass http://0.0.0.0:8088;
        # 设置请求头
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
  ```

- [定位静态文件 `alias` 和 `root` 的区别](https://www.nginx.cn/4658.html)

  ```nginx
  ; root 会将 location 匹配的路径前缀放在 root 参数的后面
  ; alias 则是将 location 匹配的路径的目录部分，替换为 alias 的参数
  http {
    server {
      location /api/jsonschema/v1/ {
        alias /sbin/schemas/;
        # 末尾必须有/，表示是个目录
        # alias + resource_filename
        # 访问 http://127.0.0.1/api/jsonschema/v1/network/test.schema
        # 返回的是 /sbin/schemas/network/test.schema

        # root /sbin/schemas;
        # root + url + resource_filename
        # 返回的是 /sbin/schemas/api/jsonschema/v1/network/test.schema
      }
    }
  }
  ```

- 字符替换

  ```nginx
  # 骚操作，算了，要做也是用 rewrite
  http://127.0.0.1/a/b/c/d.schema
  # 转化为 http://127.0.0.1/a/b/c.d.schema
  ```

- 设置请求头

  ```ini
  set $USER_info "dddddddddddddd";
  location /_a/ {
      proxy_set_header Userinfo $USER_INFO;
      proxy_pass https://10.119.110.17:5530/;
  }
  ```

## 日志

[Nginx 日志配置详解](https://segmentfault.com/a/1190000013377493)

- [日志路径不能用变量](https://blog.csdn.net/u013670453/article/details/113835719)

  ```nginx
  server {
    # 特别注意，日志路径不能用变量

    # set home /var/www/bbc;
    # error_log $home/logs/error.log;  ##### 错误

    access_log /logs/nginx/access.log;
    error_log /logs/nginx/error.log;

  }
  ```

- [日志轮转](https://www.cnblogs.com/you-men/p/12827117.html)

  [nginx 系列四 kill -USER1 日志切割](https://blog.csdn.net/yz18931904/article/details/80639822)

  ```sh
  # vi /etc/logrotate.d/device.saas.sangfor.com

  /opt/device.saas.sangfor.com/logs/*.log {
    daily           # 日志按天存放
    rotate 7        # 最多保留 7 份日志
    compress        # 对日志进行 gzip 压缩
    delaycompress   # 在下一个轮转到来时才进行压缩
    missingok       # 日志轮转期间，任何错误都忽略，比如文件无法找到等
    notifempty      # 如果日志文件为空，不进行轮转
    dateext         # 日志文件以当前日期为格式结尾
    sharedscripts
    postrotate      # 每次日志轮转后，执行一下命令
    if [ -f /usr/local/openresty/nginx/logs/nginx.pid ]; then
        # 发命令通知 Nginx 重新读取日志文件
        kill -USR1 `cat /usr/local/openresty/nginx/logs/nginx.pid`
    fi
    endscript
  }
  ```

- 打开 `rewrite` 日志

  ```nginx
  error_log logs/nginx/error.log notice;
  http
  {
      rewrite_log on;
  }
  ```

- 日志级别

  ```nginx
  error_log  logs/error.log error;
  ```

- 日志格式

  ![alt](https://img-blog.csdnimg.cn/0f913f97ab464a8c80d0cfabc4cfc4bc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCY5Z-DMDA5,size_20,color_FFFFFF,t_70,g_se,x_16)

  ```ini
  # TCP 代理日志格式定义
  log_format tcp_proxy '$remote_addr [$time_local] '
                       '$protocol $status $bytes_sent $bytes_received '
                       '$session_time "$upstream_addr" '
                       '"$upstream_bytes_sent" "$upstream_bytes_received" "$upstream_connect_time"';

  log_format main '$remote_addr - $remote_user [$time_local] "$request" ' '$status $body_bytes_sent "$http_referer" ' '"$http_user_agent" "$http_x_forwarded_for" ' '$request_time $upstream_response_time';
  # $request_time 指的就是从接受用户请求的第一个字节到发送完响应数据的时间，即包括接收请求数据时间、程序响应时间、输出响应数据时间
  # $upstream_response_time 是指从 Nginx 向后端（cgi)建立连接开始到接受完数据然后关闭连接为止的时间。
  # $request_time 肯定比 $upstream_response_time 值大，特别是使用 POST 方式传递参数时，因为 Nginx 会把 request body 缓存住，接受完毕后才会把数据一起发给后端。所以如果用户网络较差，或者传递数据较大时，$request_time 会比 $upstream_response_time 大很多。

  # TCP 代理日志配置   ==== 指定所用格式
  # 好像 error_log 是不能设置格式的
  access_log /opt/www.huangjinjie.bbc.com/logs/tcp-access.log tcp_proxy;
  ```

## 变量

[nginx 自定义变量与内置预定义变量](https://blog.csdn.net/m0_37556444/article/details/84563520)

[nginx location 匹配及 rewrite 规则](https://www.cnblogs.com/blxt/archive/2004/01/13/12106211.html)

- `$prefix` 会替换为 nginx 的 prefix path

- 自定义变量

  可以在 `sever, http, location` 等标签中使用 set 命令（非唯一）声明变量，语法如下

  日志路径 `error_log`、SSL 证书路径 `ssl_certificate` 都不能用变量来拼接路径

  [日志路径不能用变量](https://blog.csdn.net/u013670453/article/details/113835719)

  [Nginx 在 ssl_certificate 路径中使用变量时获得权限错误](https://mlog.club/article/2088498)

  ```nginx
  # 注意 nginx 中的变量必须都以 $ 开头。
  set $home "/var/www/test";

  # 后面可以用这个变量替代路径了（特别注意：error_log 不能用变量）
  ```

## `events`

## `http`

## `location`

[location 匹配规则](https://moonbingbing.gitbooks.io/openresty-best-practices/content/ngx/nginx_local_pcre.html)

[location 自测方法](http://t.zoukankan.com/rongfengliang-p-13150534.html)

匹配路径有三种方式：

- `=` 开头：精确匹配

- `~` 表示区分大小写的正则匹配； `~*` 表示【不区分】大小的正则匹配

- `^` 正则表达式的开始

- 顺序 no 优先级：

  (location =) > (location 完整路径) > (location ^~ 路径) > (location ~,~\* 正则顺序) > (location 部分起始路径) > (/)

```nginx
location = / {
    ; 只匹配 / 查询。
    ; 路径完全匹配，具有最高优先级
}

location / {
    ; 匹配任意请求，优先级最低
    ; 匹配任何查询，因为所有请求都以 / 开头。但是正则表达式规则和长的块规则将被优先和查询匹配。
}

location /static {
    alias /path/to/your/project/static;
}

location /api/ {
    ; 不带任何修饰符，也表示前缀匹配
    ; 转发整个路径，如 /api/test 转发到 127.0.0.1:8080/api/test/
    ; proxy_pass http://127.0.0.1:8080;

    ; 转发后面的路径，如 /api/test 转发到 127..0.1:8080/test/
    proxy_pass http://127.0.0.1:8080/;
}

location ~ pattern {
    ; ~ 表示区分大小写的正则匹配
}

location ^~ /images/ {
    ; ^~ 表示匹配所有 /images/ 开头的 URL
    ; 匹配任何以 /images/ 开头的任何查询并且停止搜索。任何正则表达式将不会被测试。
}

location ~*.(gif|jpg|jepgs)$ {
    ; ~* 开头表示不区分大小写的正则匹配
    ; 正则表达式，匹配所有以 .gif、.jpg、.jpeg 结尾的请求
}

location ~ ^(A|B) {
    ; 匹配A 或 B 开头的 URI
}

# 匹配 /api/v1/scl/easy_deploy/ 或 /cloud_deploy/ 开头
location ~ ^(/api/v1/scl/easy_deploy/|/cloud_deploy/) {
    proxy_read_timeout 600s;
    proxy_set_header Host $host;
    proxy_set_header OUTER_ADDR $remote_addr;
    proxy_set_header ALL_ADDRS $proxy_add_x_forwarded_for;
    proxy_pass http://easydeploysrv;
}

```

**匹配优先级**

- 首先精确匹配 `=`

- 其次前缀匹配 `^~`

  如有包含关系时，按最大匹配原则进行匹配。比如在前缀匹配：`location /dir01` 与 `location /dir01/dir02`

  如有请求 `http://localhost/dir01/dir02/file` 将最终匹配到 `location /dir01/dir02`

- 其次是按文件中`顺序`的正则匹配

- 然后匹配不带任何修饰的前缀匹配

- 最后是交给通用匹配 `/`

- 当有匹配成功时候，停止匹配，按当前匹配规则处理请求

## 重定向 `redirect`

- 单次重定向用 `redirect`, 如果永久跳转用 `permanent`

  ```ini
  server {
    listen       80;
    server_name  xxx.com www.xxx.com;
    index index.html index.php;
        root  /data/www/wwwroot;
        # web 文件夹路径 /usr/local/openresty/nginx/html/
        if ($http_host !~ "^www.xxx.com$") {
            rewrite  ^(.*)    http://www.xxx.com$1 permanent;
        }
  }

  ```

## 多站点配置

[绑定域名](https://cloud.tencent.com/developer/article/1054418)

- [`sites-enabled 和 sites-available` 区别](https://www.jianshu.com/p/42c4ffd044e6)

  - `sites-available` 则是用于存放网站的配置文件，意为可用的网站列表，用于**在需要时链接到 `sites-enabled` 中作为需要启用的网站**

  - `sites-enabled` 下的文件，会作为 nginx.conf 的一部分加载；`sites-enabled` 下的用于存放 `sites-available` 中文件的软连接

- `sites-enabled`

  ```sh
  # 默认没有这个文件夹，先手动创建
  mkdir /usr/local/nginx/conf/sites-enabled/

  # 在 /usr/local/nginx/conf/nginx.conf http 下面添加：
  include /usr/local/nginx/conf/sites-enabled/*;
  ```

- 只要在每个 `server` 段下配置域名 `server_name` 就可以了，这些 `server` 都可以监听同一个端口

  ```nginx
  # 站点 a
  server {
      # 监听端口，设置为默认服务
      listen 80 default_server;

      # 绑定域名
      server_name a.huagnjinjie.com;

      location / {
          # 网站存放根目录
          root /usr/www/a

          # 站点默认页面
          index index.html index.htm

      }
  }

  # 站点 b
  server {
      listen 80;

      server_name b.huagnjinjie.com;
      location / {
          root /usr/www/b
          index index.htm index.html
      }
  }
  ```

- 带不带 www 的域名都能访问网站

  ```nginx
  server
  {
      listen 80;
      # 配置两个
      server_name www.test.hjj.com test.hjj.com;
  }
  ```

- [配置多个域名使用同一个端口](https://blog.csdn.net/Doudou_Mylove/article/details/110424804)

  好像也没啥好办法，也是不同站点监听不同端口，然后再来个配置做路由转发

  ```ini
  # nginx 80端口配置 （监听a二级域名）
  server {
      listen  80;
      server_name     a.com;
      location / {
          proxy_pass      http://localhost:8080; # 转发
      }
  }
  # nginx 80端口配置 （监听b二级域名）
  server {
      listen  80;
      server_name     b.com;
      location / {
          proxy_pass      http://localhost:8081; # 转发
      }
  }

  // -------------------------------------

  # a 项目监听 8080 端口
  server {
      listen       8080;
      root         /usr/share/nginx/html;
      index        index.html;
      location / {}
  }
  # b 项目监听 8081 端口
  server {
      listen       8081;
      root         /usr/share/nginx/html;
      index        index.html;
      location / {}
  }

  ```

- 一个站点监听多个端口

  ```ini
  server {
    # 端口和域名
    listen 443 ssl;
    server_name bbc.saas.sangfor.com www.bbc.saas.sangfor.com;

    ...

  }
  server {
    # 端口和域名
    listen 5000 ssl;
    server_name bbc.saas.sangfor.com www.bbc.saas.sangfor.com;

    ...

  }
  ```

## 负载均衡 `upstream`

### 负载均衡配置

`upstream` 是 Nginx 的 HTTP Upstream 【模块】（所以和 server 是同级的），这个模块通过一个简单的调度算法来实现客户端 IP 到后端服务器的负载均衡（默认使用 轮询 ）。

在下面的设定中，通过 upstream 指令指定了一个负载均衡器的名称 test.net。这个名称可以任意指定，在后面需要用到的地方直接调用即可。

```ini
http {
    # 名字可以自定义
    upstream test.net {
        ; 负载均衡算法
        ip_hash;

        ; down 表示当前的 server 暂时不参与负载均衡
        ; max_fails 允许请求失败的次数，默认为1，超过最大次数时，返回 proxy_next_upstream 模块定义的错误
        ; fail_timeout 经历了 max_fails 次失败后，暂停服务的时间

        server localhost:8087 weight=10;
        server localhost:8088 down;
        server localhost:8089 max_fails=3 fail_timeout=20s;

        ; backup 预留的备份机器，其他所有服务器出现故障或忙不过来的时候，才接收请求
        ; 当负载调度算法为 ip_hash 时，后端服务器状态不能是 backup
        ; server localhost:8090 backup;
    }

    server {
        location / {
            root html;
            index index.html index.htm;
            # 名字就是上面自定义的
            proxy_pass http://test.net;
        }
    }
}
```

### 负载均衡算法

**weight 轮询（默认）**

- 接收到的请求按照顺序逐一分配到不同的后端服务器，即使在使用过程中，某一台后端服务器宕机，Nginx 会自动将该服务器剔除出队列，请求受理情况不会受到任何影响。

- 可以给不同的后端服务器设置一个`权重值（加权轮询）`，用于调整不同的服务器上请求的分配率。权重数据越大，被分配到请求的几率越大；该权重值，主要是针对实际工作环境中不同的后端服务器硬件配置进行调整的。

**ip_hash**

- 每个请求按照发起`客户端的 ip 的 hash 结果进行匹配`，这样的算法下一个固定 ip 地址的客户端总会访问到同一个后端服务器，这也在一定程度上解决了 `集群部署环境下 Session 共享`的问题。

**fair**

- 智能调整调度算法，动态的根据后端服务器的请求处理到`响应的时间进行均衡分配`。

- 响应时间短处理效率高的服务器分配到请求的概率高，响应时间长处理效率低的服务器分配到的请求少，它是结合了前两者的优点的一种调度算法。

- Nginx 默认不支持 fair 算法，如果要使用这种调度算法，请安装 `upstream_fair` 模块。

**url_hash**

- 按照访问的 URL  的 hash 结果分配请求，每个请求的  URL  会指向后端固定的某个服务器，可以在 Nginx 作为静态服务器的情况下提高缓存效率。

- Nginx 默认不支持这种调度算法，要使用的话需要安装 Nginx 的 hash 软件包。

**consistent_hash 一致性哈希**

[nginx+lua 实现按参数一致性哈希分发](https://blog.csdn.net/sinat_37380158/article/details/107119523)

该模块通过使用客户端信息(如：$ip, $uri, $args 等变量)作为参数，使用一致性 hash 算法将客户端映射到后端机器

- 如果后端机器宕机，这请求会被迁移到其他机器

- `server [id]` 字段，如果配置 id 字段，则使用 id 字段作为 server 标识，否则使用 server ip 和端口作为 server 标识，

  - 使用 id 字段可以手动设置 server 的标识，比如一台机器的 ip 或者端口变化，id 仍然可以表示这台机器。使用 id 字段

  - 可以减低增减服务器时 hash 的波动。

- `server [weight]` 字段，作为 server 权重，对应虚拟节点数目

- 具体算法，将每个 server 虚拟成 n 个节点，均匀分布到 hash 环上，每次请求，根据配置的参数计算出一个 hash 值，在 hash 环上查找离这个 hash 最近的虚拟节点，对应的 server 作为该次请求的后端机器。

- 该模块可以根据配置参数采取不同的方式将请求均匀映射到后端机器，比如：

  - `consistent_hash $remote_addr`：可以根据客户端 ip 映射

  - `consistent_hash $request_uri`： 根据客户端请求的 uri 映射

  - `consistent_hash $args`：根据客户端携带的参数进行映射

```ini
server {
    listen       80;
    server_name  localhost;
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

    location / {
     set $hashkey "";
     set $backendupstream "rrbackend";
     ; lua 脚本设置 backendupstream 决定用哪种负载方式 和 hashkey 用作一致性哈希
     rewrite_by_lua_file '../set_upstream.lua';
     proxy_pass   http://$backendupstream;
    }
}

; 轮询
upstream rrbackend {
    ; 模拟4台后端服务器
    server 127.0.0.1:8881;
    server 127.0.0.1:8882;
    server 127.0.0.1:8883;
    server 127.0.0.1:8884;
}

; 一致性 hash
upstream hashbackend {
    ; 该模块通过使用客户端信息(如：$ip, $uri, $args等变量)作为参数，使用一致性 hash 算法将客户端映射到后端机器
    consistent_hash $hashkey;

    server 127.0.0.1:9001 id=1001 weight=3;
    server 127.0.0.1:9002 id=1002 weight=10;
    server 127.0.0.1:9003 id=1003 weight=20;
}
```

## 访问控制

[Nginx 限制或允许 IP 或 IP 段访问](https://blog.csdn.net/ywd1992/article/details/87186836)

## DNS

[利用 NGINX 的 resolver 实现动态 UPSTREAM](https://blog.csdn.net/cjfeii/article/details/77987004)

可以配置多个 dns 服务，nginx 会采用轮询的方式去访问 dns 服务，nginx 会缓存 dns 对域名解析的结果，缓存的时间由 valid 指定，ipv6 用于显示开启或者关闭 ipv6。

```ini
http {
    # 定义域名解析
    resolver 114.114.114.114;
    # resolver_timeout 用于指定 dns 解析的超时时间。
    ...
}
```

## Lua

不用 openresty 也可以通过插件来使用 lua

## Redis

**redis2query**

## 其他

- `client_max_body_size 300M;` 上传文件大小限制，默认为 1M

# 逻辑控制语句

## `if`

# 原理

## master-worker 模型

Nginx 是以多进程的方式来工作的，当然 Nginx 也是支持多线程的方式的, 只是我们主流的方式还是多进程的方式，也是 Nginx 的默认方式。Nginx 采用多进程的方式有诸多好处。

Nginx 在启动后，会有一个 master 进程和多个 worker 进程。

- master 进程并不处理网络请求，主要负责调度工作进程：加载配置、启动工作进程及非停升级。

- worker 进程负责处理网络请求与响应。

![alt](https://img-blog.csdn.net/20150819112451778)

master 进程主要用来管理 worker 进程，具体包括如下 4 个主要功能：

- 接收来自外界的信号。

- 向各 worker 进程发送信号。

- 监控 woker 进程的运行状态。

- 当 woker 进程退出后（异常情况下），会自动重新启动新的 woker 进程。

- woker 进程主要用来处理基本的网络事件：

多个 worker 进程之间是对等且相互独立的，他们`同等竞争`来自客户端的请求。

- 一个请求只可能在一个 worker 进程中处理，一个 worker 进程，不可能处理其它进程的请求。

- worker 进程的个数是可以设置的，一般我们会设置与机器 cpu 核数一致。

- 同时，nginx 为了更好的利用多核特性，具有 cpu 绑定选项，我们可以将某一个进程绑定在某一个核上，这样就不会因为进程的切换带来 cache 的失效。

## 请求处理

Nginx 在启动时，会`解析配置文件`，得到需要监听的端口与 IP 地址，然后在 Nginx 的 master 进程里面，先初始化好这个监控的 socket(创建 socket，设置 addrreuse 等选项，绑定到指定的 IP 地址端口，再 listen)，然后再 fork(一个现有进程可以调用 fork 函数创建一个新进程。由 fork 创建的新进程被称为子进程 ) 出多个子进程出来，然后子进程会竞争 accept 新的连接。

此时，客户端就可以向 Nginx 发起连接了。当客户端与 Nginx 进行三次握手，与 Nginx 建立好一个连接后，某一个子进程会 accept 成功，得到这个建立好的连接的 socket，然后创建 Nginx 对连接的封装，即 ngx_connection_t 结构体。

接着，设置读写事件处理函数并添加读写事件来与客户端进行数据的交换。最后，Nginx 或客户端来主动关掉连接，到此，一个连接就寿终正寝了。

# 学习过程中的疑问

## 配置加载顺序问题

[在同一目录下 Nginx 对多个配置文件的读取顺序问题](https://blog.csdn.net/shinyolive/article/details/113855068)

# 排障指南

- **原链接 `abc?var=xxxx` 被从定向到 `/login` 了，后面的参数也没有了**

  - `nginx` 配置了 `rewrite ^/login /v1/api/login` 把 `/login` 开头的链接重定向到 `/v1/api/login`

  - 同时还配置了 `location /abc { rewrite ^/(.*) login.html permanent; }` 即 `/abc?var=xxx` 会被重定向到 `login.html?var=xxx`

  - 由于原本 `login.html` 是直接去找静态资源的，现在把 `login` 开头的链接重定向到 `/v1/api/login` 了；所以 `login.html?var=xxx` 没找到

- **[`nginx` 访问静态文件，可是有中英文区别怎么办](http://www.92csz.com/02/907.html)**

# 其他

- [`kill` 掉 `master` 进程后，`worker` 子进程还能继续提供服务](https://www.csdn.net/tags/NtTaUgzsMDIwMDQtYmxvZwO0O0OO0O0O.html)

  ```sh
  kill -QUIT 主进程号

  # 经过测试，该命令会自动kill掉nginx的父和子进程。推荐使用！ 只用kill -9 主进程，只有主进程被kill，nginx子进程还在！！！
  ```

- 注意 cookie 的域 和路径 PATH
