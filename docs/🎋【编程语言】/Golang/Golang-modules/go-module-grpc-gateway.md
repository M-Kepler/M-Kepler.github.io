- [grpc-gateway](#grpc-gateway)
- [参考资料](#参考资料)
  - [安装](#安装)
- [遇到的问题](#遇到的问题)

# grpc-gateway

![alt](https://www.liwenzhou.com/images/Go/grpc_gateway/architecture.svg)

在 grpc 之上加一层代理并转发，转变成 protobuf 格式来访问 grpc 服务

当客户端发送 HTTP 请求时候，`grpc-gateway` 接收请求，生成 grpc 的 client 去请求 grpc 的 server 端；**grpc-gateway 实际上做了反向代理的作用**。

因此会产生两个服务，一个是 grpc-gateway 产生的 http 服务，负责接受客户端的 http 请求，一个 grpc 的 server 服务，负责处理 client 端的请求。

# 参考资料

- [gRPC 教程 - grpc-gateway](https://blog.csdn.net/Mr_XiMu/article/details/125000670)

- [gRPC-Gateway 使用指南](https://www.liwenzhou.com/posts/Go/grpc-gateway/#autoid-0-0-0)

## 安装

```sh
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest

```

# 遇到的问题

- [--go_out: protoc-gen-go: plugins are not supported 问题处理](https://blog.csdn.net/dorlolo/article/details/123195165)
