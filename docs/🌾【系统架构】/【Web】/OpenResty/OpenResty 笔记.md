- [参考资料](#参考资料)
- [OpenResty](#openresty)
  - [安装配置](#安装配置)
  - [TCP 代理](#tcp-代理)
  - [反向代理 `proxy_pass`](#反向代理-proxy_pass)
    - [客户端源 IP 问题](#客户端源-ip-问题)
  - [opm 包管理器](#opm-包管理器)
- [Nginx](#nginx)
- [Lua](#lua)
  - [引入 Lua 的方式](#引入-lua-的方式)
  - [编译缓存 `lua_code_cache`](#编译缓存-lua_code_cache)
  - [环境变量 `lua_package_path`](#环境变量-lua_package_path)
  - [传递参数](#传递参数)
  - [全局变量](#全局变量)
  - [各阶段处理流程](#各阶段处理流程)
    - [`content_by_lua_*`](#content_by_lua_)
    - [`preread_by_lua_*`](#preread_by_lua_)
    - [`access_by_lua_*`](#access_by_lua_)
    - [`balancer_by_lua_*`](#balancer_by_lua_)
    - [`rewrite_by_lua_*`](#rewrite_by_lua_)
- [操作 Nginx](#操作-nginx)
  - [内置变量](#内置变量)
  - [自定义变量](#自定义变量)
  - [日志](#日志)
  - [请求](#请求)
  - [响应](#响应)
  - [`ngx.ctx` 模块上下文](#ngxctx-模块上下文)
  - [`ngx.var` 变量](#ngxvar-变量)
  - [`ngx.re` 正则表达式匹配模块](#ngxre-正则表达式匹配模块)
  - [负载均衡 `ngx_balancer`](#负载均衡-ngx_balancer)
  - [`ngx.location.capture`](#ngxlocationcapture)
- [其他](#其他)
- [操作 Redis](#操作-redis)
  - [连接](#连接)
  - [API](#api)
- [操作 MySQL](#操作-mysql)
- [原理](#原理)
- [学习过程中的疑问](#学习过程中的疑问)
- [排障指南](#排障指南)
  - [请求正常，但是报错 `connect() failed (111: Connection refused) while connecting to upstream`](#请求正常但是报错-connect-failed-111-connection-refused-while-connecting-to-upstream)
  - [Lua 有时候获取不到其他模块里的变量 `lua entry thread aborted: runtime error: /opt/device.saas.sangfor.com/lua_scripts/bbcaddr.lua:75: bad argument #1 to 'format' (string expected, got nil)`](#lua-有时候获取不到其他模块里的变量-lua-entry-thread-aborted-runtime-error-optdevicesaassangforcomlua_scriptsbbcaddrlua75-bad-argument-1-to-format-string-expected-got-nil)
  - [反向代理正常，但是错误日志一直报错 `connect() failed (111: Connection refused) while connecting to upstream`](#反向代理正常但是错误日志一直报错-connect-failed-111-connection-refused-while-connecting-to-upstream)
  - [Nginx 报错 `“The plain HTTP request was sent to HTTPS port”`](#nginx-报错-the-plain-http-request-was-sent-to-https-port)
  - [报错： `lua tcp socket connect timed out, when connecting to 127.0.0.1:6379, client: 127.0.0.1,`](#报错-lua-tcp-socket-connect-timed-out-when-connecting-to-1270016379-client-127001)
  - [报错： 重定向跳转到出口 IP](#报错-重定向跳转到出口-ip)
- [其他](#其他-1)

# 参考资料

- [♥ OpenResty 最佳实践](https://moonbingbing.gitbooks.io/openresty-best-practices/content/)

- [Openresty 请求处理](https://www.wangt.cc/2021/11/openresty-%e8%af%b7%e6%b1%82%e5%a4%84%e7%90%86)

- [Nginx 与 lua](https://blog.huoding.com/2012/08/31/156)

- [如何在 nginx 中配置使用 lua 模块](https://blog.csdn.net/zhaoydzhaoyd/article/details/107916968)

- [使用 Nginx+Lua(OpenResty)开发高性能 Web 应用](https://blog.csdn.net/jinnianshilongnian/article/details/84768674)

- [openresty 开发系列](https://www.cnblogs.com/reblue520/category/1535368.html?page=2)

# OpenResty

OpenResty 通过 Lua 脚本扩展 nginx 功能，可提供`负载均衡、请求路由、安全认证、服务鉴权、流量控制与日志监控`等服务

## 安装配置

**openresty.service**

```ini
# Stop dance for OpenResty
# =========================
#
# ExecStop sends SIGSTOP (graceful stop) to OpenResty's nginx process.
# If, after 5s (--retry QUIT/5) nginx is still running, systemd takes control
# and sends SIGTERM (fast shutdown) to the main process.
# After another 5s (TimeoutStopSec=5), and if nginx is alive, systemd sends
# SIGKILL to all the remaining processes in the process group (KillMode=mixed).
#
# nginx signals reference doc:
# http://nginx.org/en/docs/control.html
#
[Unit]
Description=The OpenResty Application Platform
After=syslog.target network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/usr/local/openresty/nginx/logs/nginx.pid
ExecStartPre=/usr/local/openresty/nginx/sbin/nginx -t -q -g 'daemon on; master_process on;'
ExecStart=/usr/local/openresty/nginx/sbin/nginx -g 'daemon on; master_process on;'
ExecReload=/usr/local/openresty/nginx/sbin/nginx -g 'daemon on; master_process on;' -s reload
ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /usr/local/openresty/nginx/logs/nginx.pid

Restart=always
RestartSec=5

TimeoutStopSec=5
KillMode=mixed

[Install]
WantedBy=multi-user.target
```

## TCP 代理

[OpenResty 代理转发 UDP、TCP 样例详解](https://blog.csdn.net/zzhuan_1/article/details/97938095)

[★ OpenResty 正向代理搭建](https://www.jianshu.com/p/7808ee6395ab)

[openresty 域名动态解析](https://blog.csdn.net/ChinaUnicom2015/article/details/102114550)

## 反向代理 `proxy_pass`

[OpenResty 部署反向代理](https://zhuanlan.zhihu.com/p/25202281)

**nginx.conf**

```nginx
server {
    # 端口和域名
    listen 443 ssl;
    server_name bbc.saas.sangfor.com www.bbc.saas.sangfor.com;

    access_log /opt/bbc.saas.sangfor.com/logs/access.log;
    error_log /opt/bbc.saas.sangfor.com/logs/error.log info;

    # 避免下载接口出现问题
    client_max_body_size 1024M;

    # SSL 证书
    ssl_certificate /opt/bbc.saas.sangfor.com/conf/certificates/server.crt;
    ssl_certificate_key /opt/bbc.saas.sangfor.com/conf/certificates/server.key;

    # static 和 media 的地址
    location / {
        # 定义一个变量 backend
        set $backend '';
        # 更新变量backend
        rewrite_by_lua_file /opt/bbc.saas.sangfor.com/lua_scripts/set_proxy.lua;
        # 将请求发往backend
        proxy_pass https://$backend;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**set_proxy.lua**

```lua
-- 一顿操作，最终设置 ngx.var.backend 变量即可

local function main()
    ngx.var.backend = "10.119.110.17"
end

main()
```

### 客户端源 IP 问题

[与反向代理有关的头部](https://blog.51cto.com/u_11101184/3136189)

**X-Forwarded-For**

![alt](https://img-blog.csdnimg.cn/eb7e275b2a3d46b1951bce89b75c2ea8.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5LiA5LiA56m6,size_20,color_FFFFFF,t_70,g_se,x_16)

## opm 包管理器

用来装 Lua 库的工具，这些工具全都发布在 https://opm.openresty.org/

```sh
# 搜索
opm search [name1] [name2]

# 获取包
# 文件默认安装在 /usr/local/openresty/site/lualib/resty/ 下
# 注：这个路径并不在 lua 环境变量中，如果要在 lua 中使用的话，需要修改环境变量
# opm get [pkg_name]

opm get openresty/lua-resty-mysql
* Fetching openresty/lua-resty-mysql
  Downloading https://opm.openresty.org/api/pkg/tarball/openresty/lua-resty-mysql-0.22.opm.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 14692  100 14692    0     0  36822      0 --:--:-- --:--:-- --:--:-- 36730
Package openresty/lua-resty-mysql 0.22 installed successfully under /usr/local/openresty/site/ .

# 指定安装路径
opm --install-dir=/usr/local/openresty get [pkg_name]
```

# Nginx

Nginx 采用的是 `master-worker` 模型，一个 master 进程管理多个 worker 进程，基本的事件处理都是放在 woker 中，master 负责一些全局初始化，以及对 worker 的管理。

在OpenResty中，每个 woker 使用一个 LuaVM，当请求被分配到 woker 时，将在这个 LuaVM 里创建一个 coroutine(协程)，协程之间数据隔离。

![alt](https://pic.wangt.cc/download/pic_router.php?path=https://img-blog.csdnimg.cn/5f9676e89a4b46068a73cd2ed03693a7.png)

# Lua

## 引入 Lua 的方式

- `xxx_by_lua` 字符串编码方式

  ```nginx
  local /testlua {
      # Lua 代码串
      content_by_lua "ngx.say('hello from content_by_lua')";
  }
  ```

- `xxx_by_lua_block` 代码块方式

  ```nginx
  local /testlua {
      # 大括号内为 Lua 代码块
      content_by_lua_block {
          ngx.say("hello from content_by_lua_block");
      }
  }
  ```

- `xxx_by_lua_file` 脚本文件方式，路径建议用 `绝对路径`，默认路径是 `/usr/local/openresty/nginx/` **或者自定义一个变量保存当前项目的路径，注意，错误日志不能用变量**

  ```nginx
  localtion /testlua {
      set $prefix /usr/local/openresty/nginx/conf/sites-avaliable/test/;
      # 这里不能用变量 $prefix
      # error_log $prefix/logs/error.log;  # ERROR
      error_log /var/log/nginx/error.log

      content_by_lua_file $prefix/lua_scripts/test.lua;
  }
  ```

## 编译缓存 `lua_code_cache`

我们每次修改都要重启 Nginx，这样太过于麻烦，我们可以用 `content_by_lua_file` 引入外部 Lua，这样的话 只要修改外部的 Lua 就可以了，不需要重启 Nginx 了

注意需要把 `lua_code_cache` 设置为 `off`，实际生产环境是需要设置为 `on` 的，这个指令是指定是否开启 lua 的代码编译缓存，开发时可以设置为`off`，以便 lua 文件实时生效，如果是生产线上，为了性能，建议开启。

```log
语法：lua_code_cache on | off
默认： on
适用上下文：http、server、location、location if
```

## 环境变量 `lua_package_path`

```ini
http {
    # 在 nginx 的配置文件中只能使用一个 lua_package_path 配置来指定lua代码包的路径地址

    lua_package_path "/usr/local/openresty/nginx/conf/sites-enabled/www.huangjinjie.bbc.com/lua_scripts/?.lua;;";
}
```

[当然也可以直接加载 lua 文件中](https://www.04007.cn/article/751.html)

```lua
package.path = "/opt/bbc.saas.sangfor.com/lua_scripts/?.lua;/usr/local/openresty/lualib/?.lua;;";
local redis = require "resty.redis"
local const = require "const"

```

## 传递参数

**set_proxy.lua**

```lua
-- 取参数
return ngx.arg.proxy_port
```

**nginx.conf**

```lua
location /{
    -- 设置参数
    set $proxy_port 443;

    set_by_lua_file $re /var/www/aceEditor/m.lua;
    echo $re;
}
```

## 全局变量

比如我有个请求来的时候需要查一下映射关系，才知道转发给哪个服务器；目前是从 redis 中查询，有没有可能在 lua 代码中缓存一下？不需要每次都查询 redis

## 各阶段处理流程

![alt](https://pic.wangt.cc/download/pic_router.php?path=https://img-blog.csdnimg.cn/fe6dc0df4b31475584c5dfeea3f4859c.png)

### `content_by_lua_*`

直接把 Lua 代码写进去

```lua
server {
    listen 8089;
    location /hello {
        -- 直接写 lua 代码
        content_by_lua 'ngx.say("world")';
    }
}
```

**`content_by_lua_block`**

内容处理器，接受请求并输出响应

```nginx
# nginx worker 数量
worker_processes  16;

# 指定错误日志文件路径
error_log /var/log/openresty/error.log;
events {
    worker_connections 1024;
}

http {
    server {
        listen 8088;

        location /hello {
            content_by_lua_block {
                ngx.say("hostname:" .. ngx.var.hostname.."</br>")
                ngx.say("host:" .. ngx.var.host .."</br>")
                ngx.print("https:" .. ngx.var.https.."</br>")
                ngx.print("limit_rate:".. ngx.var.limit_rate.."</br>")
                ngx.print("msec:".. ngx.var.msec.."</br>")
                ngx.say("nginx_version:"..ngx.var.nginx_version .. "</br>")
                ngx.say("nginx_pid:" .. ngx.var.pid .. "</br>")
                ngx.say("pipe:" .. ngx.var.pipe .."</br>")
                ngx.say("request:" .. ngx.var.request .. "</br>")
                ngx.say("request_method:" .. ngx.var.request_method .. "</br>")
                ngx.say("request_filename:" .. ngx.var.request_filename .. "</br>")
                ngx.say("scheme:" .. ngx.var.scheme .. "</br>")
                ngx.say("server_addr:" .. ngx.var.server_addr .. "</br>")
                ngx.say("server_name:" .. ngx.var.server_name .. "</br>")
                ngx.say("server_port:" .. ngx.var.server_port .. "</br>")
                ngx.say("server_protocol:" .. ngx.var.server_protocol .."</br>")

            }
        }
    }

    server {
        listen 8089;
        location /hello {
            content_by_lua 'ngx.say("world")';
        }
    }
}
```

### `preread_by_lua_*`

预读处理器，执行顺序在转发之前

### `access_by_lua_*`

准入阶段完成参数检查

### `balancer_by_lua_*`

### `rewrite_by_lua_*`

反向代理

```ini
location / {
    # 定义变量
    set $backend '';
    set $proxy_port 443;

    # 更新变量 backend
    rewrite_by_lua_file /path/to/lua_scripts.lua;

    # 将请求发往 backend
    proxy_pass https://$backend;
    ...
```

# 操作 Nginx

[NginxApi for lua](https://www.nginx.com/resources/wiki/modules/lua/#nginx-api-for-lua)

## 内置变量

| 变量                    | 意义                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `$arg_name`             | 请求中的 name 参数                                                                                    |
| `$args`                 | 请求中的参数                                                                                          |
| `$binary_remote_addr`   | 远程地址的二进制表示                                                                                  |
| `$body_bytes_sent`      | 已发送的消息体字节数                                                                                  |
| `$content_length`       | HTTP 请求信息里的 "Content-Length"                                                                    |
| `$content_type`         | 请求信息里的 "Content-Type"                                                                           |
| `$document_root`        | 针对当前请求的根路径设置值                                                                            |
| `$document_uri`         | 与 $uri 相同; 比如 /test2/test.php                                                                    |
| `$host`                 | 请求信息中的 "Host"，如果请求中没有 Host 行，则等于设置的服务器名                                     |
| `$hostname`             | 机器名使用 gethostname 系统调用的值                                                                   |
| `$http_cookie`          | cookie 信息                                                                                           |
| `$http_referer`         | 引用地址                                                                                              |
| `$http_user_agent`      | 客户端代理信息                                                                                        |
| `$http_via`             | 最后一个访问服务器的 Ip 地址。                                                                        |
| `$http_x_forwarded_for` | 相当于网络访问路径                                                                                    |
| `$is_args`              | 如果请求行带有参数，返回 "?"，否则返回空字符串                                                        |
| `$limit_rate`           | 对连接速率的限制                                                                                      |
| `$nginx_version`        | 当前运行的 nginx 版本号                                                                               |
| `$pid`                  | worker 进程的 PID                                                                                     |
| `$query_string`         | 与 $args 相同                                                                                         |
| `$realpath_root`        | 按 root 指令或 alias 指令算出的当前请求的绝对路径。其中的符号链接都会解析成真是文件路径               |
| `$remote_addr`          | 客户端 IP 地址                                                                                        |
| `$remote_port`          | 客户端端口号                                                                                          |
| `$remote_user`          | 客户端用户名，认证用                                                                                  |
| `$request`              | 用户请求                                                                                              |
| `$request_body`         | 这个变量（0.7.58+）包含请求的主要信息。在使用 proxy_pass 或 fastcgi_pass 指令的 location 中比较有意义 |
| `$request_body_file`    | 客户端请求主体信息的临时文件名                                                                        |
| `$request_completion`   | 如果请求成功，设为 "OK"；如果请求未完成或者不是一系列请求中最后一部分则设为空                         |
| `$request_filename`     | 当前请求的文件路径名，比如 `/opt/nginx/www/test.php`                                                  |
| `$request_method`       | 请求的方法，比如 "GET"、"POST" 等                                                                     |
| `$request_uri`          | 请求的 URI，带参数; 比如 `http://localhost:88/test1/`                                                 |
| `$scheme`               | 所用的协议，比如 http 或者是 https                                                                    |
| `$server_addr`          | 服务器地址，如果没有用 listen 指明服务器地址，使用这个变量将发起一次系统调用以取得地址 (造成资源浪费) |
| `$server_name`          | 请求到达的服务器名                                                                                    |
| `$server_port`          | 请求到达的服务器端口号                                                                                |
| `$server_protocol`      | 请求的协议版本，"HTTP/1.0" 或 "HTTP/1.1"                                                              |
| `$uri`                  | 请求的 URI，可能和最初的值有不同，比如经过重定向之类的                                                |

## 自定义变量

```nginx
location /var {
    # 设置变量
    set $test 3;
    # 使用变量
    content_by_lua_block {
        ngx.say(ngx.var.test);
    }
}
```

## 日志

**如果打的是 `ngx.INFO` 日志，一定要记得把 Nginx 日志级别改为 INFO**

```lua
-- ngx.STDERR     -- 标准输出
-- ngx.EMERG      -- 紧急报错
-- ngx.ALERT      -- 报警
-- ngx.CRIT       -- 严重，系统故障，触发运维告警系统
-- ngx.ERR        -- 错误，业务不可恢复性错误
-- ngx.WARN       -- 告警，业务中可忽略错误
-- ngx.NOTICE     -- 提醒，业务比较重要信息
-- ngx.INFO       -- 信息，业务琐碎日志信息，包含不同情况判断等
-- ngx.DEBUG      -- 调试

ngx.log(ngx.ERR, "num:", num)
ngx.log(ngx.INFO, " string:", str)

-- 打开 info 级别日志
-- error_log /var/log/nginx/error.log info;
```

## 请求

- 获取 URL

  ```lua
  -- ngx 参数
  $http_host - $request_uri;

  -- lua
  ngx.say(ngx.var.request_uri)
  ```

- 获取请求方法

  ```lua
  ngx.req.get_method()
  ```

- 获取请求头

  ```lua
  -- 获取带中划线的请求头时请使用如 headers.user_agent 这种方式
  -- 如果一个请求头有多个值，则返回的是table
  local headers = ngx.req.get_headers()
  --[[
  {
      "Host": xxx,
      "user-agent": xxx,
  }
  --]]
  -- 获取指定请求头
  return ngx.req.get_headers()["Content-Type"]
  ```

- 获取 `cookie`

  ```lua
  -- 获取所有 cookie，这里获取的是一个字符串，如果不存在则返回 nil
  ngx.var.http_cookie

  -- 获取单个 cookie，后面的 cookie 的 name，如果不存在则返回 nil
  ngx.var.cookie_username
  ```

- [获取请求参数](https://segmentfault.com/a/1190000007923803)

  ```lua
  -- 获取 GET 请求方式一：
  local strider = ngx.arg.arg_strider

  -- 获取 GET 请求方式二：
  local striders = ngx.req.get_uri_args()["strider"]

  local args = ngx.req.get_uri_args()
  for k, v in pairs(args) do
      ngx.say("GET key: ", k, " value: ", v)
  end

  -- 对于 ?strider=1&strider=2&strider=3&strider=4
  -- ngx.var.arg_strider 的值为 "1",
  -- 而 ngx.req.get_uri_args()["strider"] 的值为 table ["1", "2", "3", "4"]。

  -- 获取 POST 请求参数
  ngx.req.read_body()
  local postargs = ngx.req.get_post_args()
  postargs["user_id"]

  for k, v in pairs(postargs) do
      ngx.say("POST key: ", k, " valus: ", v)
  end

  -- 解析请求 body 内容字符串
  ngx.req.get_body_data()

  ```

  ```lua
  function _get_req_params()
      local method_name = ngx.req.get_method()
      local args = {}
      local err = nil

      if method_name == 'GET' then
          args = ngx.req.get_uri_args()
      elseif method_name == 'POST' then
          ngx.req.read_body()
          local content_type = ngx.req.get_headers()['Content-Type']
          if content_type == 'application/x-www-form-urlencoded' then
              args, err = ngx.req.get_post_args()
          elseif content_type == 'application/json' then
              args, err = ngx.req.get_body_data()
              if args ~= ngx.null then
                  args = cjson.decode(args)
              end
          end
      end

      return args
  end
  ```

## 响应

[输出响应体](https://moonbingbing.gitbooks.io/openresty-best-practices/content/openresty/response.html)

```lua
-- 输出响应内容体；(内容体结束后没有换行符；)
ngx.print("aaaaaaaaaaaaaa")

-- 输出响应内容体；(内容体结束后，输出一个换行符；)
ngx.say("aaaaaaaaaaaaaaa")
```

- 设置响应头

  ```lua
  ngx.header.a = "test"
  ```

- [返回 json 数据](https://lua.ren/topic/377/)

  ```lua
  --[[
  /**
   * \brief: 构造响应数据包
   * \param: code integer 状态码
   * \param: message string 描述信息
   * \param: data string 客户端需要处理的有效数据
   * \param resp object 响应结构体
   * \return: HTTP 响应
   *          {
   *              "code": code,
   *              "message": message,
   *              "data": {
   *                  data
   *              }
   *          }
   */
  --]]
  local function makeResponse(code, message, data)
      local retInfo = {}
      retInfo["code"] = code
      retInfo["message"] = message
      if (data ~= nil) then
          retInfo["data"] = data
      end
      local result = json.encode(retInfo)
      ngx.header['Content-Type'] = 'application/json; charset=utf-8'
      ngx.say(result)
  end

  local function main()
      makeResponse(201, "err_response")
      -- 记得要 return
      return
  end

  main()
  ```

- 打印响应体

## `ngx.ctx` 模块上下文

https://zhuanlan.zhihu.com/p/52965407

## `ngx.var` 变量

[ngx.var 与 ngx.ctx 的区别](https://blog.csdn.net/u011944141/article/details/89145362)

```nginx
lua_add_variable $proxy;

server {
    listen 5430;
    content_by_lua_block {
        ngx.var.proxy= "server_test";
   }
    proxy_pass $proxy;
}

```

## `ngx.re` 正则表达式匹配模块

`ngx.re` 的正则表达式比 lua 自身的好，他实现了标准的 POSIX 规范

[Openresty 资料之正则表达式](https://blog.csdn.net/sky6even/article/details/90667549)

[Openresty 正则表达式](https://moonbingbing.gitbooks.io/openresty-best-practices/content/lua/re.html)

- `ngx.re.match`

  ```lua
  CORPCODE_PATTERN = "^[1-9][0-9]{7,9}$"
  function checkCorpCode(corpcode)
    -- "jo" 表示开启编译并缓存
    return ngx.re.match(corpcode, CORPCODE_PATTERN, "jo")
  end
  ```

- `ngx.re.sub`

- `ngx.re.gsub`

- `ngx.re.find`

- `ngx.re.gmatch`

## 负载均衡 `ngx_balancer`

## `ngx.location.capture`

nginx 内部接着执行子请求

```ini
    # 有一个 location query-ip
    location = /query-ip {
        internal;
        set_unescape_uri $key $arg_key;
        redis2_query auth $redis_password;
        redis2_query get $key;
        redis2_pass 11.20.10.25:6379;
    }
```

```lua
local r_key = "corp:"..code..":ip"

-- 转发到 redis 查询接口
local res = ngx.location.capture("/query-ip", {args = { key = r_key }})
if not res or res.status ~= 200 then
    ngx.log(ngx.WARN, "redis server returned status:", res.status)
    ngx.exit(502)
end
```

# 其他

- MD5 加密

  ```lua
  ngx.say("ngx.md5: ", ngx.md5("123"))
  ```

- 获取时间

  ```lua
  -- 秒级
  ngx.say("ngx.time(): ", ngx.time(), "s")

  -- 毫秒级
  ngx.say("ngx.now(): ", ngx.now(), "ms")
  ```

# 操作 Redis

[https://github.com/openresty/lua-resty-redis](https://github.com/openresty/lua-resty-redis)

## 连接

- Redis 操作库定义在 `/usr/local/openresty/lualib/resty/redis.lua`

  ```lua
  local redis = require("resty.redis")

  -- 创建实例
  local redis_instance = redis:new()
  -- 设置超时（毫秒）
  redis_instance:set_timeout(3000)

  local rhost = "127.0.0.1"
  local rport = 6379
  local ok, err = redis_instance:connect(rhost, rport)

  local res, err = redis_instance:get("ping")
  if not res then
      ngx.log(ngx.ERR, "error: ", err)
      return redis_instance:close()
  end

  ```

- 连接池 `redisInstance:set_keepalive`

  [Redis 正确使用连接池](https://blog.51cto.com/u_15162069/2880018)

  ```lua
  --[[
  /**
   * \brief: 连接 Redis
   * \param: ip
   * \param: port
   * \param: timeout
   * \return: Redis 连接的实例
   */
  --]]
  local function openRedisConn(ip, port, timeout)

      -- 创建实例
      local redisInstance = redis:new()

      --设置超时（毫秒）
      -- redisInstance:set_timeout(timeout)

      -- 与 Redis 建立连接
      local ok, err = redisInstance:connect(ip, port)
      if not ok then
          ngx.log(ngx.ERR, "connect to redis error: ", err)
          return nil
      end
      return redisInstance
  end

  --[[
  /**
   * \brief: 关闭 Redis 连接
   * \param: redisInstance Redis 连接实例
   * \return:
   */
  --]]
  local function closeRedisConn(redisInstance)
      -- redisInstance:close()
      -- 不关闭连接，把当前连接放到连接池中
      redisInstance:set_keepalive(
          const.REDIS.MAX_IDLE_TIMEOUT, const.REDIS.POOL_SIZE)
  end
  ```

## API

- [怎么判断是否查询到数据，查不到的时候也是返回 userdata 类型的数据 `ngx.null`](https://www.cnblogs.com/tm2015/articles/7575491.html)

# 操作 MySQL

# 原理

![alt](https://pic.wangt.cc/download/pic_router.php?path=https://img-blog.csdnimg.cn/5f9676e89a4b46068a73cd2ed03693a7.png)

Nginx 采用的是 master-worker 模型，一个 master 进程管理多个 worker 进程。

基本的事件处理都是放在 woker 中，master 负责一些全局初始化，以及对 worker 的管理。

在 OpenResty 中，每个 woker 使用一个 LuaVM，当请求被分配到 woker 时，将在这个 LuaVM 里创建一个 coroutine(协程)，协程之间数据隔离。

# 学习过程中的疑问

# 排障指南

## 请求正常，但是报错 `connect() failed (111: Connection refused) while connecting to upstream`

**问题描述**

`a.com` 监听 443 端口，匹配 `location scl/v1/dev/address` 转发到 `b.com` 监听的 4430 端口，请求正常返回，但是 `a.com` 项目却存在如下错误日志

```log
2022/05/07 07:48:12 [error] 29849#0: *19444 connect() failed (111: Connection refused) while connecting to upstream, client: 200.200.126.22, server: bbc.saas.sangfor.com, request: "GET /scl/v1/dev/address?appversion=0x2050000&corpcode=87652166 HTTP/1.0", upstream: "http://[::1]:4430/scl/v1/dev/address?appversion=0x2050000&corpcode=87652166", host: "bbc.saas.sangfor.com"
```

**解决方法**

[`proxy_next_upstream_tries` 解决nginx 4 层 tcp 代理，无限重试不存在的地址](https://www.lijiaocn.com/%E9%97%AE%E9%A2%98/2019/09/17/ingress-nginx-l4-proxy.html)

## Lua 有时候获取不到其他模块里的变量 `lua entry thread aborted: runtime error: /opt/device.saas.sangfor.com/lua_scripts/bbcaddr.lua:75: bad argument #1 to 'format' (string expected, got nil)`

**项目结构如下**

`bbc.saas.sangfor.com` 监听 443 端口，匹配 `location scl/v1/dev/address` 转发到 `device.saas.sangfor.com` 监听的 4430 端口，`a.com/lua_scripts/` 和 `b.com/lua_scripts/` 下都存在 `const.lua`

```nginx
# cat bbc.saas.sangfor.com/conf/nginx.conf
server {
    ...

    # 开启 lua 编译缓存，加快速度
    lua_code_cache on;

    ...

    # 转发 BBC_SDK 获取 bbc 地址的请求
    location ^~ /scl/v1/dev/address {
        proxy_pass http://localhost:4430;
    }
}

# cat device.saas.sangfor.com/conf/nginx.conf
server {

    ...

    # 开启 lua 编译缓存，加快速度
    lua_code_cache on;

    location /scl/v1/dev/address {
        # 设置项目路径
        set $proj_home /opt/device.saas.sangfor.com;
        content_by_lua_file $proj_home/lua_scripts/bbcaddr.lua;
    }
}

```

```sh
/opt # tree bbc.saas.sangfor.com/ device.saas.sangfor.com/
bbc.saas.sangfor.com/
├── conf
│   ├── certificates
│   │   ├── server.crt
│   │   └── server.key
│   └── nginx.conf
├── logs
│   ├── access.log
│   └── error.log
└── lua_scripts
    ├── const.lua         # 同名文件
    └── set_proxy.lua
device.saas.sangfor.com/
├── conf
│   ├── certificates
│   │   ├── server.crt
│   │   └── server.key
│   └── nginx.conf
├── logs
│   ├── access.log
│   └── error.log
└── lua_scripts
    ├── bbcaddr.lua       # 这里面配置了环境变量 package.path，但是【有时候】会获取不到 const.lua 里开放出来的接口或变量
    ├── cgiutils.lua
    └── const.lua

# package.path = "/opt/device.saas.sangfor.com/lua_scripts/?.lua;/usr/local/openresty/lualib/?.lua;;";
8 directories, 16 files

```

**解决方法一：**

[变量的共享范围 变量的共享范围](https://moonbingbing.gitbooks.io/openresty-best-practices/content/ngx_lua/lua-variable-scope.html)

修改 `device.saas.sangfor.com/conf/nginx.conf` 把编译缓存关掉就好了。。。

```nginx
lua_code_cache off;
```

**解决方法二：**

不用关缓存，把 `device.saas.sagnfor.com/lua_scripts/const.lua` 换个名称就行了。。。

```sh
# 测试不断发请求，没有出现 500 的情况了
while true; do curl -k -X GET "https://a.com/v1/address?version=0x2050000&code=87652166"; sleep 1; done
```

## 反向代理正常，但是错误日志一直报错 `connect() failed (111: Connection refused) while connecting to upstream`

网上找的内容，百分之八十都是跟 php 有关的，，，可我的后端又不是 php，最终 [nginx报错111: Connection refused](https://cloud.tencent.com/developer/article/1531927) 解决了我的问题

```nginx
; 这个好像会往 ipv4 的本地地址 127.0.0.1；ipv6 的本地地址 [::1] 发
proxy_pass http://localhost:4430;

--> 修改为： proxy_pass http://127.0.0.1:4430;
```

[Nginx——*5 connect() failed (111: Connection refused) while connecting to upstream](https://blog.csdn.net/hao134838/article/details/80872307)

## Nginx 报错 `“The plain HTTP request was sent to HTTPS port”`

[Nginx 报错 `“The plain HTTP request was sent to HTTPS port”`](https://blog.csdn.net/afreon/article/details/97142847)

因为每一次用户请求试图通过 HTTP 访问你的网站，这个请求被重定向到 HTTPS。于是 Nginx 预计使用 SSL 交互，但原来的请求（通过端口 80 接收）是普通的 HTTP 请求，于是会产生错误。

## 报错： `lua tcp socket connect timed out, when connecting to 127.0.0.1:6379, client: 127.0.0.1,`

[Why am I seeing the "lua tcp socket connect timed out" error?](https://openresty.org/en/faq.html#why-am-i-seeing-the-lua-tcp-socket-connect-timed-out-error)

```lua
-- 使用了连接池，把 set_timeout 去掉就好了（但是这只是操作超时时长，不应该于这个有关啊）

-- redisInstance:set_timeout(timeout)
```

## 报错： 重定向跳转到出口 IP

```py
# Chrome --> AF --> AD --> Nginx -- vBBC --> waf --> Apache --> Flask

response = make_response(redirect("./index", 302))
```

浏览器访问 `www.test.com/bbc/token_login?token=xxxx` 被 301 重定向到 `www.test.com/bbc/token_login/?token=xxx` 然后又被重定向到 `1.1.1.1/bbc/index`，其中 `1.1.1.1` 为本机的出口 IP

```log
https://bbc-sase.sangfor.com.cn/bbc/token_login?access_token=bd73abbf-05d7-43ad-9e65-59796c53e421&corpcode=65214609
请求方法: GET
状态代码: 301 MOVED PERMANENTLY
远程地址: 14.17.110.247:443
引用站点策略: strict-origin-when-cross-origin
Cache-Control: no-store,no-cache
Connection: keep-alive
Content-Length: 445
Content-Security-Policy: object-src 'none';worker-src 'none';media-src 'none';child-src https:
Content-Type: text/html; charset=utf-8
Date: Mon, 16 May 2022 09:56:32 GMT
Location: https://bbc-sase.sangfor.com.cn/bbc/token_login/?access_token=bd73abbf-05d7-43ad-9e65-59796c53e421&corpcode=65214609
Pragma: no-cache
Server: openresty/1.21.4.1rc3
Set-Cookie: bbc_session=eyJ1c2VyX3Rva2VuIjp7IiBiIjoiWXpNMFlXUTVZVEl0WkRSbVpDMHhNV1ZqTFdGa09URXRabVZtWTJabE9USXpaRGRpIn19.FWOxVA.CpuiKLeQX-45_kvRDF584JxE14o; Secure; HttpOnly; Path=/
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

```log
请求 URL: https://bbc-sase.sangfor.com.cn/bbc/token_login/?access_token=bd73abbf-05d7-43ad-9e65-59796c53e421&corpcode=65214609
请求方法: GET
状态代码: 302 FOUND
远程地址: 14.17.110.247:443
引用站点策略: strict-origin-when-cross-origin
Cache-Control: no-store,no-cache
Connection: keep-alive
Content-Length: 221
Content-Security-Policy: object-src 'none';worker-src 'none';media-src 'none';child-src https:
Content-Type: text/html; charset=utf-8
CSRFPreventionToken: 7966d8a8-d4fe-11ec-baff-fefcfe923d7b
Date: Mon, 16 May 2022 09:56:33 GMT
Location: http://121.32.254.146/bbc/index                   ============================= 这里 Location 变了
Pragma: no-cache
Server: openresty/1.21.4.1rc3
Set-Cookie: BBCAuthCookie=Login:admin:62821FD4::lMmgEU/0QBl46UNO5H5dd9VU+ww4pqr8TjjInJ4T359Y25z6NiX746QeuEnTome/hCJxa9inCkbLxECFEkg+wkwh2VzEwGsftrvYLQlRWV9Ysfgryowzo8apaEU1q0dlsXnJUZMpwvj8Z1YOrCq/BakYGFYmVVNpUu9DD2D3fiDkzeHshSlhpcwGWKn1wvgGcH1zPS02FV9pMPQzrvyxDewa2HGyLx7Ljz33+uaiGffaKkm7v0uCpxZHdCdJ1j3AjIj6i5ffcz0D2bHYPkDw1G2wop3RYCR0hKG72Ua2iZZ0DxS8thwIyjKviFqf/3jH5DHYbnnDfaVyKiHDSpxKig==; Secure; HttpOnly; Path=/
Set-Cookie: Corpcode=65214609; Secure; HttpOnly; Path=/
Set-Cookie: bbc_session=eyJ1c2VyX3Rva2VuIjp7IiBiIjoiTnprMk5tTmlaV010WkRSbVpTMHhNV1ZqTFdKaFptWXRabVZtWTJabE9USXpaRGRpIn19.FWOxVA.Q5zXPXG9WJWCy7uGtxXqsh7gNpM; Secure; HttpOnly; Path=/
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

```log
请求 URL: http://121.32.254.146/bbc/index                   =============================
引用站点策略: strict-origin-when-cross-origin
临时标头已显示
了解详细信息
DNT: 1
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="101", "Microsoft Edge";v="101"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36 Edg/101.0.1210.39
```

正常的话，应该还是重定向到 `www.test.com/bbc/index`，为什么会重定向到了出口 IP 呢

**问题解决**

```py
# 把 302 去掉就没问题了
# response = make_response(redirect("./index", 302))
response = make_response(redirect("./index"))
```

# 其他
