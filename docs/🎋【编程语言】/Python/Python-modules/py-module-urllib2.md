- [urllib2](#urllib2)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
- [其他](#其他)

## urllib2

> 模块简介

### 参考资料

### 使用记录

> 模块使用记录

- 基本使用

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## 其他

- 有些配置很奇葩，多一个 `/` 就匹配不到 NGX 规则了，拼接 URL 用 urljoin；但是 `urljoin` 也有缺陷，不能拼接多个，而且后面的那个参数不能用 `/` 开头

  ```py
  >>> from urllib.parse import urljoin

  # 不能一次拼接多个 url，但是可以拼接多次
  >>> urljoin('/a/a/', 'b/b/b', 'c/c/c')
  '/a/a/b/b/b'
  >>> urljoin('/a/a', 'b/b/b', 'c/c/c')
  '/a/b/b/b'
  >>>
  >>> a = urljoin('/a/a', 'b/b/b')
  >>> urljoin(a, 'c/c/c')
  '/a/b/b/c/c/c'

  # 后面的 UR了不能以 / 开头（有点像 os.path.join）
  >>> a = "https://x.sangfor.com.cn/api/v1/scl/easydeploy"
  >>> b = "/bbc_discover/bbc_address"
  >>> urljoin(a, b)
  'https://x.sangfor.com.cn/bbc_discover/bbc_address'

  # 这也是个奇葩。。。
  >>> urljoin('/a/a/', 'c/c/c')
  '/a/a/c/c/c'
  >>> urljoin('/a/a', 'c/c/c')
  '/a/c/c/c'
  >>>

  # 正常示例
  >>> b = "bbc_discover/bbc_address"
  >>>
  >>> urljoin(a, b)
  'https://x.sangfor.com.cn/api/v1/scl/bbc_discover/bbc_address'
  >>>
  ```
