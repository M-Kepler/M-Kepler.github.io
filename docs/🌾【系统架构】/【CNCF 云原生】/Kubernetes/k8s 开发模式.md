- [环境切换](#环境切换)
- [BloomRPC](#bloomrpc)
- [eolink](#eolink)
- [apisix](#apisix)
- [kubectx](#kubectx)
- [okteto](#okteto)
- [syncthing](#syncthing)
- [telepresence2](#telepresence2)
- [istio](#istio)
- [流量染色](#流量染色)

## 环境切换

- `switchosts`

- `autoenv`

## BloomRPC

[GRPC 接口测试工具](https://www.jianshu.com/p/48b34f301738)

## eolink

## apisix

网关，在知乎经常看到这个答主

## kubectx

## okteto

syncthing

https://www.bobobk.com/810.html

https://www.okteto.com/docs/reference/manifest/#build

[官网做得不错](https://www.okteto.com/)

- 离线下载

  ```
  https://downloads.okteto.com/cli/stable/2.7.0/okteto-Linux-x86_64
  ```

- 上下文

  ```sh
  okteto context use kubernetes-admin@kubernetes
  okteto up
  ...
  okteto down
  ```

- 命令行会进入到 pod 内部的命令行，可以直接用 go run 开始运行程序

- 本地编辑的代码改动会实时同步到 pod 内部的代码中

## syncthing

## telepresence2

https://juejin.cn/post/6976246800566976549

## istio

## 流量染色

流量染色的方案，来使前端访问流量打到不同的微服务上

说白了，就是加个标识，网关根据该标识反向代理到不同的节点上。

[全链路压测之流量染色](https://blog.csdn.net/afzaici/article/details/120752210)

![alt](https://img-blog.csdnimg.cn/3c010636979d49398dcb7be45ed3b4fe.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBA5L-hLeW_tQ==,size_20,color_FFFFFF,t_70,g_se,x_16)
