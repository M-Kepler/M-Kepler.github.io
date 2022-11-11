- [参考资料](#参考资料)
- [Web](#web)
  - [基础](#基础)
- [其他](#其他)
  - [`jsonschema`](#jsonschema)
  - [请求时间](#请求时间)

# 参考资料

# Web

## 基础

- 避免来自其他地方的 post 请求，需要标记 post 请求的来源，以免视图函数也去处理这些请求

- 所以，需要识别这些请求是当前服务器输出的 ui 页面的 post 请求，进行 wsgi 配置就行了

- [`URL` 默认加和不加斜杠 `/` 的区别](https://ahrefs.com/blog/zh/trailing-slash/)，比如：`a.com/test?arg=1` 和 `a.com/test/?arg=1`

  末尾斜杠通常用于区分目录和文件。然而，这些只是建议，而不是要求。有些路由匹配规则如果不加末尾斜杠的话，会匹配不上

- [URL 和 URI 之间的区别](https://www.php.cn/div-tutorial-413616.html)

  ```sh
  # 统一资源【标志符】
  URI = Uniform Resource Identifier

  # 统一资源【定位符】
  URL = Uniform Resource Locator

  # 统一资源名称
  URN = Uniform Resource Name

  https://www.baidu.com/api/location/?a=1&b=2
  URI 是 ID 标识； URL 可以定位到资源，所以一般喊做 URL 贴切点
  ```

  原来 URI 包括 URL 和 URN，后来 URN 没流行起来，导致几乎目前所有的 URI 都是 URL

  ![alt](https://images2015.cnblogs.com/blog/591228/201601/591228-20160116223301225-1866838315.png)

# 其他

任何性能提高，都将被你使用的大型 Web 框架如 Django 或 TurboGears 吃掉，尤其是用了数据库后端，大多数的 overhead 源自 Python Web Framework 以及任何访问数据库时的瓶颈。mod_wsgi 上的 overhead 只是很小的一块，这一小块上的任何性能提高都很难被注意到

- [JS 精度问题](https://blog.csdn.net/auntvt/article/details/105701460)

- `webrtc`

- `websocket`

- 中间人攻击

- 重放攻击

- RainBow 碰撞攻击

- 调试的时候如果服务监听的是 `127.0.0.1:8080` 那只有本机可以访问，如果希望别人通过本机 IP 来访问的话，需要改为 `0.0.0.0:8080`

- django 好像不可以多个 url 指向同一个处理方法

- [CentOS7 下部署 Django 项目详细操作步骤](https://www.cnblogs.com/lqyu/p/12123757.html)

- 耗时的 cgi 操作，比如上传下载，配置备份恢复

## `jsonschema`

> 一套检验 json 格式的规则

- [利用 JSON-Schema 对 Json 数据进行校验](https://cloud.tencent.com/developer/article/1005810)

- [什么是 json schema](https://www.cnblogs.com/terencezhou/p/10474617.html)

## 请求时间

- [TTFB](https://www.wpzhiku.com/wating-ttfb-too-long/)

- [对HTTP请求接口资源下载时间过长的问题分析](https://cloud.tencent.com/developer/article/1770300)

- [Apache 开启 gzip 压缩](https://segmentfault.com/a/1190000014087848)
