- [参考资料](#参考资料)
- [grpc](#grpc)
  - [安装](#安装)
  - [序列化后字段的大小写](#序列化后字段的大小写)

# 参考资料

[中文文档](http://doc.oschina.net/grpc?t=60133)

# grpc

- 失败重试？

## 安装

```sh
# 安装 protoc-gen-go 插件
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

go get -u google.golang.org/grpc
go get -u google.golang.org/protobuf

```

## 序列化后字段的大小写

```golang
//protobuf
//ConnectAuthReq 接入认证请求
message ConnectAuthReq {
    int64  timestamp = 1;
    int32  tenant_id = 2;
    string account = 3;
    string hash_key = 4;
    string gateway_id = 5;
    string random = 6;
    string product_name = 7;
    string version = 8;
}
```

==> 生成的 pb 文件中，首字母会变成大写，但是 json 格式还是和 protobuf 定义的一样（也是 json 序列化得到的字段）

```golang
//ConnectAuthReq 接入认证请求
type ConnectAuthReq struct {
    state         protoimpl.MessageState
    sizeCache     protoimpl.SizeCache
    unknownFields protoimpl.UnknownFields

    Timestamp   int64  `protobuf:"varint,1,opt,name=timestamp,proto3" json:"timestamp,omitempty"`
    TenantId    string `protobuf:"bytes,2,opt,name=tenant_id,proto3" json:"tenant_id,omitempty"`
    Account     string `protobuf:"bytes,3,opt,name=account,proto3" json:"account,omitempty"`
    HashKey     string `protobuf:"bytes,4,opt,name=hash_key,proto3" json:"hash_key,omitempty"`
    GatewayId   string `protobuf:"bytes,5,opt,name=gateway_id,proto3" json:"gateway_id,omitempty"`
    Random      string `protobuf:"bytes,6,opt,name=random,proto3" json:"random,omitempty"`
    ProductName string `protobuf:"bytes,7,opt,name=product_name,proto3" json:"product_name,omitempty"`
    Version     string `protobuf:"bytes,8,opt,name=version,proto3" json:"version,omitempty"`
}

```

```protobuf
service authRpc {
    //connAuth 生成的接口中这个名字也是会变成大写开头
    //注意：protobuf rpc 接口的备注也生成的在代码中
    //而且会自动在 // 后面加上空格，所以一般看到 protobuf 里的注释都是紧跟着 // 符号的
    rpc connAuth(connAuthReq) returns(connAuthResp)
}
```
