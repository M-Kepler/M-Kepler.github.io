- [grpc](#grpc)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
    - [`grpc` 与 `restful` 的对比](#grpc-与-restful-的对比)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

# grpc

> 模块简介

## 参考资料

## 使用记录

> 模块使用记录

```sh
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. test.proto
```

- 编写一个 `proto` 文件

- 编译出 `xxx_pb2.py 和 xxx_pb2_grpc.py` 文件: `python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. xxx.proto`

## 模块学习

### `grpc` 与 `restful` 的对比

- `grpc` 的消息载体是 `protobuf`，而 `restful` 使用的是 `json`，问题转到 protobuf 与 json 的对比，两个都是跨语言的

- `grpc` 需要启动一个客户端，`restful` 不需要

- `grpc` 可以通过调用类成员的方式来完成远程调用，比如 `A.a`；而 `restful` 则是通过 `HTTP` 方法来完成

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方
