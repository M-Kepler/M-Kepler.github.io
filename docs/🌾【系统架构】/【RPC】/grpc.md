- [参考资料](#参考资料)
- [grpc](#grpc)
  - [什么是 RPC](#什么是-rpc)
  - [GRPC 和 RESTfulApi 的区别](#grpc-和-restfulapi-的区别)
  - [反射](#反射)
  - [拦截器](#拦截器)
  - [metadata](#metadata)
  - [grpcurl](#grpcurl)
- [使用记录](#使用记录)
  - [可以区分版本的 grpc 接口](#可以区分版本的-grpc-接口)
- [排障指南](#排障指南)
- [其他](#其他)
- [参考资料](#参考资料-1)

# 参考资料

- [gRPC 基础概念详解](https://mp.weixin.qq.com/s/I2QHEBO26nGqhGwIw281Pg)

# grpc

## 什么是 RPC

## GRPC 和 RESTfulApi 的区别

[GRPC 和 RESTfulApi 的区别](https://www.infoq.cn/article/i71vnujcel09ebukak59)

## 反射

## 拦截器

## metadata

> 类似 HTTP 的请求头

[GRPC metadata 的使用](https://www.jianshu.com/p/0b7cf0bdbe92)

## grpcurl

[使用 grpcurl 通过命令行访问 gRPC 服务](https://zhuanlan.zhihu.com/p/415775403)

grpcurl 工具接受 json 编码的消息(对人类和脚本更友好)， 工具底层会转化为 protobuf 与服务器交互。

- 用法和 curl 一样，`-d` 加 参数、[`-H` 加请求头（metadata）](https://linuxcommandlibrary.com/man/grpcurl)

# 使用记录

## 可以区分版本的 grpc 接口

期望是可以定义一个对外的接口，这个接口可以同时处理 V1 和 V2 两个版本的逻辑；比如我对外只提供一个用于认证的 RPC 接口，希望再不改动接口的前提下，可以区分版本，实现不同逻辑。

https://stackoverflow.com/questions/59591377/grpc-message-request-versioning-with-a-version-field

建议主版本号作为你的包的一部分 your.package.v2

# 排障指南

- 无论是 bloomrpc 还是 grpcurl 都会报 `deadline exceeded`

  ```log
  {
    "error": "4 DEADLINE_EXCEEDED: context deadline exceeded"
  }
  ```

# 其他

- grpc 命名生成规则，会把 getUser 生成 GetUser

# 参考资料

https://blog.csdn.net/hjxzb/article/details/88980186

https://developer.aliyun.com/article/775492

grpc 教程(四)拓展知识 https://www.modb.pro/db/384813

grpc method?
