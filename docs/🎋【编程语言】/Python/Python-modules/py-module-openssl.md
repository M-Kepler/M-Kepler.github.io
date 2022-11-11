- [`OpenSSL`](#openssl)
  - [参考](#参考)
  - [`crypto`](#crypto)
    - [读取证书信息](#读取证书信息)
    - [rsa](#rsa)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `OpenSSL`

> 模块简介

### 参考

- [官方文档](https://www.pyopenssl.org/en/stable/index.html)

### `crypto`

> `from OpenSSL import crypto`

```py
from OpenSSL import crypto

# 加载 p12 格式整数
cer_p12 = crypto.load_pkcs12(cer_b64, pwd)

# openssl pkcs12 -in /path/to/cer -password your:pass:word -nokeys -cacerts -out /path/to/save/pem
# 从 p12 格式私钥中提取出 pem 格式公钥
cer_ca = cer_p12.get_ca_certificates()
cer_pem = crypto.dump_certificate(crypto.FILETYPE_PEM, cer_ca[0])
# 把 pem 格式公钥转化成 cert 格式公钥
cer_cert = crypto.load_certificate(crypto.FILETYPE_PEM, cer_pem)
```

- [生成自签名证书](https://rohanc.me/valid-x509-certs-pyopenssl)

#### 读取证书信息

- [使用 Python Openssl 库解析 X509 证书信息](https://www.cnblogs.com/qq874455953/p/10264428.html)

#### rsa

[Python Openssl 生成 rsa 密钥对并写入 fi](https://www.cnpython.com/qa/312594)

```py
from OpenSSL import crypto, SSL

def gen_rsa_key_pair():
    k = crypto.PKey()
    k.generate_key(crypto.TYPE_RSA, 1024)
    with open("test.private.key", "wt") as fd:
        # 导出私钥
        fd.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, k))
    with open("test.public.key", "wt") as fd:
        # 导出公钥
        fd.write(crypto.dump_publickey(crypto.FILETYPE_PEM, k))
```

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方
