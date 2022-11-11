- [证书生成](#证书生成)
- [认证交互](#认证交互)
- [SSL 认证数据包分析](#ssl-认证数据包分析)
  - [客户端请求包](#客户端请求包)
  - [服务端响应包](#服务端响应包)
  - [客户端随机数包](#客户端随机数包)
  - [通知秘钥和加密算法](#通知秘钥和加密算法)
  - [握手验证消息](#握手验证消息)
  - [通知客户端加密算法与握手限制消息](#通知客户端加密算法与握手限制消息)
  - [加密通信](#加密通信)
  - [Encrypted Alert，SSL 告警，这里出现通常是提示 SSL 传输完成](#encrypted-alertssl-告警这里出现通常是提示-ssl-传输完成)
- [nginx 代理证书配置（附测试脚本）](#nginx-代理证书配置附测试脚本)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.cnblogs.com](https://www.cnblogs.com/small-office/p/9770896.html)

## 证书生成

1、SSL Server 生成私钥 / 公钥对。server.key（加密）/server.pub（解密）；

2、server.pub 生成请求文件 server.csr，包含 server 的一些信息，如域名 / 申请者 / 公钥等；

3、server 将 server.csr 递交给 CA，CA 验证通过，用 ca.key 和 csr 加密生成 server.cert；

4、server 将证书 server.cert 传给 client，client 通过 ca.crt 解密 server.cert。

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011101227630-42448935.png)

附证书制作流程：https://m.aliyun.com/yunqi/articles/40398

## 认证交互

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011101346191-898940755.png)

## SSL 认证数据包分析

### 客户端请求包

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135326373-669990604.png)

- 版本信息

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135341214-1062213136.png)

- 随机数

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135356127-2138498227.png)

- 加密套件列表

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135417004-1746457881.png)

- 压缩算法和扩展参数

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135432286-1131070139.png)

### 服务端响应包

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135449097-913597653.png)

- 版本号

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135502724-669024916.png)

- 随机数

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135520262-897305470.png)

- 选择的加密套件，压缩算法，及扩展参数

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135534024-1009617737.png)

- 证书

  ![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135552207-968922956.png)

### 客户端随机数包

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135604704-178419069.png)

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135613413-193314936.png)

### 通知秘钥和加密算法

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135629849-939321797.png)

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135636422-953651935.png)

### 握手验证消息

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135651499-1361470161.png)

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135658760-953753874.png)

### 通知客户端加密算法与握手限制消息

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135712499-767125143.png)

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135724255-1587804988.png)

### 加密通信

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135741549-1342521217.png)

### Encrypted Alert，SSL 告警，这里出现通常是提示 SSL 传输完成

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135757756-2101695528.png)

![alt](https://img2018.cnblogs.com/blog/1365566/201810/1365566-20181011135806382-447851518.png)

## nginx 代理证书配置（附测试脚本）

```conf
server {
    listen 8000 ssl;
    listen[::]:8000 ssl;
    server_name *.*.*.*:8000;
    ssl on;
    ssl_certificate /home/nginx/conf/cert/ server.cert;
    ssl_certificate_key /home/nginx/conf/cert/server.key;
    ssl_client_certificate /home/nginx/conf/cert/ca.cert;
    ssl_verify_client on;
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 5m;

    ssl_protocols TLSv1.2;
    ssl_ciphers  ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256;
    ssl_prefer_server_ciphers on;


    error_log /var/log/nginx/error.log error;


    location / {
        proxy_ssl_certificate /home/nginx/conf/cert/client.cert;
        proxy_ssl_certificate_key /home/nginx/conf/cert/client.key;
        proxy_ssl_trusted_certificate /home/nginx/conf/cert/ca.cert;
        proxy_ssl_verify on;
        proxy_ssl_session_reuse on；
        proxy_pass https://*.*.*.*:8080;
    }
}
```

关于其他参数请参见：http://nginx.org/en/docs/http/ngx_http_proxy_module.html

```py
import httplib2

ca_cert = '/home/nginx/conf/cert/client/ca.cert'
client_key = '/home/nginx/conf/cert/client/client.key'
client_cert = '/home/nginx/conf/cert/client/client.cert'
full_url = 'https://*.*.*.*:8000/test_url'
headers = {
    'content-type': 'application/json',
    'accept': 'application/json'
}

http = httplib2.Http(timeout=120, ca_certs=ca_cert, disable_ssl_certificate_validation=False)
http.follow_all_redirects = True
http.add_certificate(client_key, client_cert, '')
resp, resp_content = http.request(full_url, method='GET', headers=headers)
print resp, resp_content
```
