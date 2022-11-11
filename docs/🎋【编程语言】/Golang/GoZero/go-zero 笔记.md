- [go-zero](#go-zero)
  - [Interceptor 拦截器模块](#interceptor-拦截器模块)
  - [goctl 工具](#goctl-工具)
    - [goctl 生成的代码目录结构](#goctl-生成的代码目录结构)
      - [api](#api)
      - [model](#model)
      - [rpc](#rpc)
  - [配置文件](#配置文件)
  - [API](#api-1)
    - [参数](#参数)
  - [zrpc](#zrpc)
- [参考资料](#参考资料)
- [其他](#其他)

# go-zero

!!! . 工具大于约定和文档

## Interceptor 拦截器模块

https://go-zero.dev/cn/docs/blog/showcase/zrpc/?_highlight=addunaryinterceptors#interceptor%E6%A8%A1%E5%9D%97

## goctl 工具

https://blog.csdn.net/u012804784/article/details/125044476

- 我限制新增一个 rpc 接口，还能用这个工具生成吗？它会不会覆盖了我其他 rpc 接口的代码

  不会

- [生成文件的命名](https://github.com/zeromicro/go-zero/blob/master/tools/goctl/config/readme.md)

- 检查或安装 protoc,protoc-gen-go,protoc-gen-grpc-go

  ```sh
  goctl env check -i -f

  ```

- 安装

  ```sh
  # goctl
  go install github.com/zeromicro/go-zero/tools/goctl@latest

  # goctl-swagger
  go install github.com/zeromicro/goctl-swagger@latest

  ```

### goctl 生成的代码目录结构

[代码目录结构](https://go-zero.dev/cn/docs/advance/service-design)

#### api

```sh
goctl api go -api user.api -dir .

```

```log
$tree ~/workspaces/book/service/user/api
.
|-- etc
|   `-- user-api.yaml            -- 配置文件
|-- internal
|   |-- config
|   |   `-- config.go            -- 加载 yaml 配置
|   |-- handler
|   |   |-- loginhandler.go      -- HTTP 请求处理（请求体解析、业务 API 调用、响应体封装）
|   |   `-- routes.go            -- 根据 user.api 配置文件生成的 API 路由
|   |-- logic
|   |   `-- loginlogic.go        -- 业务逻辑
|   |-- svc
|   |   `-- servicecontext.go    -- 进程上下文（有点像 flask 中的上下文，或者 cpp 中的上下文，把一些程序运行过程中需要用到的资源加载进来）
|   `-- types
|       `-- types.go             -- 根据 user.api 配置文件生成的请求、响应结构体
|-- user.api                     -- 接口描述文件，定义了 API 接口，以及对应的请求响应格式
`-- user.go                      -- main 函数入口
```

#### model

```sh
goctl model mysql ddl -src user.sql -dir . -c

# goctl model mysql datasource -url="user:password@tcp(127.0.0.1:3306)/database" -table="table1,table2" -dir="./model"

```

```log
$cd ~/workspaces/book/service/user/model
$tree
.
|-- user.sql                    -- SQL 语句
|-- usermodel_gen.go            -- 生成的 CRUD 函数
|-- usermodel.go                -- 表模型，通过表模型调用 usermodel_gen.go 中的 CURD 函数操作数据库
`-- vars.go                     -- 变量定义

0 directories, 4 files
```

#### rpc

```sh
# go_out proto 代码生成路径
# go-grpc_out grpc 代码生成路径
# zrpc_out 指定 go-zero 代码生成路径
goctl rpc protoc user.proto --go_out=./types --go-rpc_out=./types --zrpc_out=.

```

```log
$cd ~/workspaces/book/service/user/rpc
$tree
.
|-- etc
|   `-- user.yaml
|-- internal
|   |-- config
|   |   `-- config.go
|   |-- logic
|   |   `-- getuserlogic.go     -- GRPC 接口逻辑都在这里
|   |-- server
|   |   `-- userserver.go       -- grpc 服务端，【注意这里调用的是 logic 里的逻辑取处理 grpc 请求的】
|   `-- svc
|       `-- servicecontext.go
|-- types
|   `-- user
|       |-- user.pb.go          -- protoc 生成的 pb 文件
|       `-- user_grpc.pb.go     -- protoc 生成的 grpc 文件
|-- user.go                     -- main 函数入口
|-- user.proto                  -- proto 文件
`-- userclient
    `-- user.go                 -- grpc 客户端（其他微服务调用本服务提供的 grpc 接口的时候，可以直接调用）
```

## 配置文件

配置文件和 Config 结构体是对应的

```yaml
# RpcServerConf 配置
Name: user.rpc
ListenOn: 127.0.0.1:8080
Etcd:
  Hosts:
    - 127.0.0.1:2379
  Key: user.rpc

# 数据库配置
Mysql:
  DataSource: root:root@tcp(localhost:3306)/book?charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai

CacheRedis:
  - Host: localhost:6379
    Pass:
    Type: node

```

对应结构如下

```json
{
    "Name": "user.rpc",
    "ListenOn": "127.0.0.1:8080",
    "Etcd": {
        "Hosts": [
            "127.0.0.1:2379"
        ],
        "Key": "user.rpc"
    },
    "Mysql": {
        "DataSource": "root:root@tcp(localhost:3306)/book?charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai"
    },
    "CacheRedis": [
        {
            "Host": "localhost:6379",
            "Pass": "",
            "Type": "node"
        }
    ]
}
```

对应 go 代码中的结构体

```go
type Config struct {
    // 引入一个结构
    zrpc.RpcServerConf
    Mysql struct {
        DataSource string
    }
    CacheRedis cache.CacheConf
}
```

## API

[API 语法介绍](https://go-zero.dev/cn/docs/design/grammar)

```sh
# 模板文件
goctl template init

```

### 参数

## zrpc

https://chende.ren/2021/01/28105429-003-zrpc.html

# 参考资料

[官方文档](https://go-zero.dev/cn/)

[作者博客](https://www.cnblogs.com/kevinwan/tag/go-zero/)

[五分钟给你的 gRPC 服务 加上 HTTP 接口](https://www.cnblogs.com/kevinwan/p/16492868.html)

[go-zero demo: 图书借阅查询系统](https://gitee.com/wu_wen_yi/go-zero-library-demo)

[RPC 服务配置](https://go-zero.dev/cn/docs/configuration/rpc?_highlight=timeout#zrpcrpcserverconf)

# 其他

- `internal` 是内部的意思

- 如何快速知道这个微服务提供哪些接口（不需要深入代码去看）

- grpcurl

- golang goto 语句？
