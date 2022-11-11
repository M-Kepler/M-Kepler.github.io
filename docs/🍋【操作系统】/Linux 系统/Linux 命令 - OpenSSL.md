- [参考资料](#参考资料)
- [`openssl`](#openssl)
  - [配置](#配置)
  - [名词解释](#名词解释)
  - [`ca`](#ca)
  - [`x509`](#x509)
    - [用自己的 CA 签发证书](#用自己的-ca-签发证书)
  - [`pkcs12`](#pkcs12)
  - [`rsa`](#rsa)
  - [使用](#使用)
  - [s_client](#s_client)
  - [s_server](#s_server)
  - [Q&A](#qa)
  - [其他](#其他)

# 参考资料

- [openssl 对 SSL 证书及密钥操作说明](https://blog.csdn.net/a82514921/article/details/104589443)

- [openssl RSA 密钥格式 PKCS1 和 PKCS8 相互转换](https://www.cnblogs.com/cocoajin/p/10510574.html)

- [生成 private.pem 和 public.crt 实现 https](https://www.cnblogs.com/gao88/p/10593281.html)

- [创建自签名 SSL 证书](https://www.cnblogs.com/kusy/p/9560458.html)

- [你不在意的 HTTPS 证书吊销机制](http://www.sohu.com/a/332752009_733939)

# `openssl`

- 生成证书

  ```sh
  # 生成2048位强度的RSA密钥，server.key是密钥文件名，生成过程会要求输入私钥密码
  openssl genrsa -des3 -out server.key 2048

  # 生成csr
  openssl req -new -key server.key -out server.csr -config openssl.cnf

  # 删除私钥中的密码
  openssl rsa -in server.key -out server_no_passwd.key

  # 利用私钥生成自签名证书crt文件
  openssl x509 -req -days 365 -in server.csr -signkey server_no_passwd.key -out server.crt

  # 保存 server.crt 签名证书
  ```

## 配置

> 配置文件路径 `openssl version -a` 可以看到 OPENSSL 路径

- [OpenSSL 主配置文件 openssl.cnf](https://www.cnblogs.com/f-ck-need-u/p/6091027.html)

## 名词解释

> [openssl、x509、crt、cer、key、csr、ssl、tls](https://www.cnblogs.com/lan1x/p/5872915.html)

- 常见公钥后缀：`pem crt key`

- 常见私钥后缀：`pfx p12 pem key`

- `X.509` 的证书文件，一般以 `.crt` 结尾，根据该文件的内容编码格式，可以分为以 `pem` 和 `der` 两种格式

- 密钥格式

  - `PEM - Privacy Enhanced Mail`

    ```sh
    # 打开看文本格式,以`-----BEGIN-----`开头, `-----END-----`结尾
    # 内容是`Base64`编码，查看PEM格式的信息可以用命令
    openssl rsa -in my.pem -text -noout
    ```

  - `DER - Distinguished Encoding Rules`

    ```sh
    # 打开看是二进制格式，不可读，查看DER格式的信息可以用命令
    openssl rsa -in my.der -inform der -text -noout
    ```

- `pem` 和 `crt` 格式的证书

  - `.cer/.crt` 是用于存放证书，它是二进制形式存放的，不含私钥
  - `.pem 跟 crt/cer` 的区别是它以 `Ascii` 来表示

- `pkcs` 公钥加密标准

- [`csr` 证书请求文件](https://blog.csdn.net/CTO_ZhangHui_/article/details/51140148)

- `pkcs1` 格式

  ```sh
  # 公钥
  -----BEGIN RSA PUBLIC KEY-----
  -----END RSA PUBLIC KEY-----

  # 私钥
  -----BEGIN RSA PRIVATE KEY-----
  -----END RSA PRIVATE KEY-----
  ```

- `pkcs8` 格式

  ```sh
  # 公钥
  -----BEGIN PUBLIC KEY-----
  -----END PUBLIC KEY-----

  # 私钥
  -----BEGIN PRIVATE KEY-----
  -----END PRIVATE KEY-----
  ```

- `pkcs8` 转 `pkcs1`

## `ca`

https://blog.csdn.net/as3luyuan123/article/details/13346613

## `x509`

- [如何创建自签名的 SSL 证书](https://www.jianshu.com/p/e5f46dcf4664?tdsourcetag=s_pcqq_aiomsg)

- [OpenSSL 加解密使用](https://www.jianshu.com/p/15b1d935a44b)

- [证书之间的转换（crt pem key）](https://blog.csdn.net/qq_37049781/article/details/84837342)

- [吊销列表 crl](http://www.sohu.com/a/212606007_604699)

- [查看密钥信息](https://www.cnblogs.com/lqynkdcwy/p/9664080.html)

  ```sh
  # 可以查看颁发日期、有效期、颁发CA等信息
  openssl x509 -in server.crt -noout -text
  ```

- [如何用 openssl 生成过期的证书](https://www.cnblogs.com/qifei-liu/p/9155663.html)

- 证书生成的信息配置

  ```sh
  # 系统中搜索该文件，存放路径可能不相同
  openssl.cnf # 包括证书颁发者颁发有效期等
  ```

- 提取公钥

  ```sh
  openssl x509 -in public.cer -pubkey -noout > public.pem
  ```

### 用自己的 CA 签发证书

> 什么 ca 不 ca 的，其实就是两个证书，用一个证书的私钥对另一个证书进行签名，所以你看到有些自签名的粒子，都没有证书请求，直接拿自己的私钥对自己进行签名了

- [OpenSSL 生成自签名证书](https://blog.csdn.net/sing_sing/article/details/78556054)

- [openssl、x509、crt、cer、key、csr、ssl、tls](https://www.cnblogs.com/lan1x/p/5872915.html)

- [使用 openssl 生成自签名证书](https://blog.csdn.net/whahu1989/article/details/102616675)

- 生成 RSA 密钥对

  ```sh
  openssl genrsa -out /tmp/test.hjj.key 2048 2>&1
  ```

- 生成证书请求 `csr`

  ```sh
  # -config 通过配置文件进行配置，也可以直接通过命令参数去设置
  openssl req -new -sha1 -key /tmp/test.hjj.key -out /tmp/test.hjj.csr -config /path/to/your/config/req.conf 2>&1
  ```

- 用 CA 签发证书

  ```sh
  openssl ca -in /tmp/test.hjj.csr -out /tmp/test.hjj.crt -config /path/to/system/openssl-rsa.cnf -policy policy_anything -key /tmp/test.hjj.key -notext -days 3650 -batch 2>&1

  ```

- 校验证书有效性

  ```sh
  openssl verify -CAfile /path/to/your/root/ca.crt /tmp/test.hjj.crt
  ```

- 导出 `p12` 格式

  ```sh
  openssl pkcs12 -export -in /tmp/test.hjj.crt -inkey /tmp/test.hjj.key -passin "pass:YOUR:PASSWORD" -chain -CAfile /path/to/your/fake/ca.crt -password "pass:YOUR:PASSWORD" -out /tmp/hjj.p12
  ```

- 查看证书信息

  ```sh
  openssl x509 -in cn_test_1_SDW-R_9d44591e.crt -text -noout
  ```

## `pkcs12`

- [OpenSSL 命令—pkcs12](https://blog.csdn.net/as3luyuan123/article/details/16105475)

## `rsa`

- 该算法基于一个十分简单的数论事实:

  将**两个大素数相乘十分容易，但想要对其乘积进行因式分解却极其困难**，因此可以将乘积公开作为加密密钥，即公钥，而两个大素数组合成私钥。公钥是可发布的供任何人使用，私钥则为自己所有，供解密之用。（可以通过私钥推算出公钥，但是反过来就没那么容易了）

- 非对称加密

  由公钥加密的密文，而已被私钥解密；反之，由私钥加密的密文也可以被公钥解密

- 用 RSA 加密后的密文，是无法直接用文本显示，因为存在一些无法用文本信息编码显示的二进制数据。对于保存，网络传输，打印不乱码，需要通 base64 编码进行转换；base64 编解码能把一些无法直接用文件本信息编码的二进制数据，转换成常规的二进制数据

- 生成并校验 RSA 私钥

  ```sh
  # 生成私钥
  openssl genrsa -out ./test.private.key 2048

  # 校验私钥
  openssl rsa -check -in ./test.private.key -noout
  ```

## 使用

- [查看证书](https://www.jianshu.com/p/f5f93c89155e)
  https://blog.csdn.net/sayyy/article/details/109456959

- [`pkcs1` 格式公钥与 `pkcs8` 格式公钥转换](https://blog.csdn.net/six66hao/article/details/81814576)

- [openssl](https://www.cnblogs.com/alittlebitcool/archive/2011/09/22/2185418.html)

- 生成密钥

  ```sh
  openssl genrsa -out test_pri.key 1024
  ```

- 提取 `pem` 格式公钥

  ```sh
  # pkcs1格式
  openssl rsa -in test_pri.key -pubout -out test_pub.key
  ```

- 使用 `pem` 格式公钥加密文件

  ```sh
  openssl rsautl -encrypt -in hello.txt -inkey test_pub.key -pubin -out hello.en
  ```

- 使用私钥解密

  ```sh
  openssl rsautl -decrypt -in hello.en -inkey test_pri.key -out hello.de
  ```

- openssl rsa 获取十六进制公钥，用于`js`加密

  > https://blog.csdn.net/wmsjlihuan/article/details/81326559

  ```sh
  # 生成公钥私钥对
  openssl genrsa -out rsa_private_key.pem 2048

  # 生成公钥
  openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem

  # 从公钥获取十六进制的公钥（第一段16进制字符串，用于前端js加密）
  openssl asn1parse -out temp.ans -i -inform PEM<rsa_private_key.pem
  """
  0:d=0  hl=4 l=1188 cons: SEQUENCE
  4:d=1  hl=2 l=   1 prim:  INTEGER           :00
  7:d=1  hl=4 l= 257 prim:  INTEGER           :B22499E74A123BD02DC0D24B338FDA8066368AAA3632486431052C5F1EE2BD4E3DF1677F8517A119A09D99181B5ABA2DF79F546F43AF78F03A6C3742CE8D3B23C26C9F8731882863664A2CA2E26F8830B9D48A242B498FAFA364ADA5C374D57A3304F1DB8A8662E57F4789162EE6ACA4303030B2C720D27DB9309CD7081B900A5769924869F48B4F0C62D7B644358DB40BDCCD106124713C668C1476D80816EB3A96B708B6BCE405F71E627AE85659206B100187F2D70FB45DCE74E2DCE7AAC8EB8A9E87717C0E015F6DFE81066B4DAEBBB99B9F05A0EF799AA09CDDBD9743F7BA27FC3B765D9D3A53B8C1702A24CC50B1C8815B8F660D33A3BE3A1D25C4D255
  ### ### ### ### ####
  【【【【 这里的B224开始的就是所需要的16进制公钥 】】】】】
  ### ### ### ### ####
  ...
  """
  ```

- `openssl` 获取 base16 进制格式公钥

  ```sh
  openssl rsa -pubin -text -modulus -in warmup -in pubkey.pem
  ```

- [怎么从 pem 格式的公钥生成十六进制的公钥](https://www.cnblogs.com/masako/p/7660418.html)

- [怎么使用 base16 进制的公钥来加密](https://cloud.tencent.com/developer/article/1495903)

## s_client

- 查看 openssl 支持的所有 TLS/SSL 版本

  ```sh
  openssl s_client -help 2>&1 | awk '/-(ssl|tls)[0-9]/{print $1}'
  ```

## s_server

## Q&A

- 现在要使用 rsa 进行加解密，因为现在写的是公共代码，这部分代码最终会在所有设备上面跑，如果这份代码里使用一套公钥私钥，那其中一台设备被攻破，私钥泄漏，其他所有设备都有危险了，所以能不能加盐？在设备出厂/启动的时候生成一套公钥私钥（考虑重启、恢复出厂的场景，公钥会直接写到前端代码中的）

  - 现在 BBC 也有这存在这个问题的...就是所有设备都是用一套公钥私钥
  - 解决方案：
    可以在拉起这个认证服务的时候去生成一对公钥私钥，这样就能保证不同设备使用不同的公钥私钥；但是这个十六进制公钥是要发布出去给 js 用来加密的，也就是说 auth 服务起来后，客户端要先来取公钥。如果 auth 服务挂了，被看门狗又重新拉起（即公钥私钥更新了）此时前端怎么感知到？怎么获取新的公钥？可不可以我先检验一下公钥，如果国药不正确，则把新公钥返回给前端，前端使用新的公钥加密后再次请求过来

- 如何校验公钥是否是有某私钥生成的？

- 浏览器是怎么获取到证书的?

## 其他

- [RSA 的公钥和私钥到底哪个才是用来加密和哪个用来解密](https://www.zhihu.com/question/25912483)

  - 既然是加密，那肯定是不希望别人知道我的消息，所以只有我才能解密，所以可得出 **公钥负责加密，私钥负责解密**

  - 同理，既然是签名，那肯定是不希望有人冒充我发消息，只有我才能发布这个签名，所以可得出私钥负责签名，公钥负责验证

```sh
openssl rand -hex 32


```
