- [遇到一个这样的需求](#遇到一个这样的需求)
- [第一步，解决跨域](#第一步解决跨域)
- [第二步，设置 domain](#第二步设置-domain)
- [第三步，设置 path](#第三步设置-path)
- [参考文档](#参考文档)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [developer.aliyun.com](https://developer.aliyun.com/article/758010)

## 遇到一个这样的需求

有两个项目 a 和 b, 在 a 项目中有页面需要调用 b 中的接口，两项目的域名不同，分别为 `a.com` 和 `b.com`。这时候如果直接调用，显然跨域了。一番折腾之后，问题解决了，这里记录一下解决方法。

## 第一步，解决跨域

这个使用 Nginx 的代理功能即可，在 a 服务器的 Nginx 添加如下示例配置：

```ini
location ~ /xxx/ {
    proxy_pass http://b.com;
}

```

这样就把路径中带有 `/xxx/` 的请求都转到了 `b.com`。如果不需要保存 cookie，保持 session 这样的功能，这样就可以了。

然而，本项目就是要用到 cookie，所以就有了下边的内容。

## 第二步，设置 domain

因为 cookie 当中是有 domain 的，两个服务器的一般不同，比如 a 服务器返回的 Response Headers 中是

```ini
Set-Cookie:JSESSIONID=_3y4u02v4cbpBw10DoCrMSnjg7m34xuum1XRWBF1Uno; path=/; domain=a.com
```

而 b 服务器返回的是

```ini
Set-Cookie:JSESSIONID=_3y4u02v4cbpBw10DoCrMSnjg7m34xuum1XRWBF1Uno; path=/; domain=b.com
```

这时候如果 a 项目的页面调用了 b 的接口，浏览器发现接口返回的 domain 不是 a.com，就不会把 cookie 保存起来，session 也就失效了。Nginx 引入了 ==**`proxy_cookie_domain`**== 来解决这个问题。示例：

```ini
location ~ /xxx/ {
    proxy_cookie_domain b.com a.com;
    proxy_pass http://b.com;
}

```

这样就可以在 Nginx 转接请求的时候自动把 domain 中的 `b.com` 转换成 `a.com`，这样 cookie 就可以设置成功了。

但是，对于有些情况这样转换不灵光。比如，b 项目的 domain 是 `.b.com`，前边多了一个小点，那对应的改为 `proxy_cookie_domain .b.com a.com;` 可以不？通过实践，不行！！！

通过查看 Nginx 文档，找到了解决办法。其实，除了上边那种配置方式外，Nginx 还支持正则配置：

```ini
location ~ /xxx/ {
    proxy_cookie_domain ~\.?b.com a.com;
    proxy_pass http://b.com;
}

```

这样就可以把 domain 中的 `.b.com` 转换成 `a.com` 啦。

## 第三步，设置 path

正常情况下完成以上两步就可以了，因为 cookie 中的 path 一般默认的是 `path=/`，也就是所有请求都可以访问本 cookie。但有些服务器会指定，只允许某个层级下的请求可以访问 cookie，比如:

```ini
Set-Cookie:JSESSIONID=_3y4u02v4cbpBw10DoCrMSnjg7m34xuum1XRWBF1Uno; path=/sub/; domain=b.com
```

这样就只允许相对根路径，以 `/sub/` 开头的请求路径才能访问 cookie。这时候就又可能出现 cookie 无效的问题了，为了解决这个问题，可以使用 `proxy_cookie_path`。示例：

```ini
location ~ /xxx/ {
    proxy_cookie_domain ~\.?b.com a.com;
    proxy_cookie_path /sub/ /;
    proxy_pass http://b.com;
}

```

这样就把只允许 `/sub/` 层级下的请求访问 cookie，改为允许所有请求访问 cookie 了。

折腾了几个小时，还是在 Nginx 官方文档找到了解决方案。说了这么多，其实只要这样简单的几行配置就可以搞定跨域 cookie 了。希望本文能够对你有所帮助。

## 参考文档

[https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_domain](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_domain)

1，[Nginx 英文帮助文档](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cookie_domain)

2，[Nginx 中文帮助文档](http://tengine.taobao.org/nginx_docs/cn/docs/http/ngx_http_proxy_module.html#proxy_cookie_path)

[Nginx 系列教程（1）nginx 基本介绍和安装入门](https://yq.aliyun.com/articles/752947?source=5176.11533457&userCode=ywqc0ubl&type=copy)

[Nginx 系列教程（2）nginx 搭建静态资源 web 服务器](https://yq.aliyun.com/articles/757598?spm=a2c4e.11153940.0.0.1a6a68a83qKoT2&source=5176.11533457&userCode=ywqc0ubl&type=copy)

[Nginx 系列教程（3）nginx 缓存服务器上的静态文件](https://yq.aliyun.com/articles/752967?source=5176.11533457&userCode=ywqc0ubl&type=copy)

[Nginx 系列教程（4）nginx 处理 web 应用负载均衡问题以保证高并发](https://yq.aliyun.com/articles/752984?source=5176.11533457&userCode=ywqc0ubl)

[Nginx 系列教程（5）如何保障 nginx 的高可用性 (keepalived)](https://yq.aliyun.com/articles/753117?source=5176.11533457&userCode=ywqc0ubl)

[Nginx 系列教程（6）nginx location 匹配规则详细解说](https://yq.aliyun.com/articles/753379?source=5176.11533457&userCode=ywqc0ubl)

[Nginx 系列教程](https://yq.aliyun.com/go/articleRenderRedirect?url=http%252525253A%252525252F%252525252Ftencent.yundashi168.com%252525252F174.html)[（7）](https://yq.aliyun.com/articles/753379?source=5176.11533457&userCode=ywqc0ubl)[nginx rewrite 配置规则详细说明](https://yq.aliyun.com/go/articleRenderRedirect?url=http%252525253A%252525252F%252525252Ftencent.yundashi168.com%252525252F174.html)

[Nginx 系列教程（8）nginx 配置安全证书 SSL](https://yq.aliyun.com/articles/753961?source=5176.11533457&userCode=ywqc0ubl)

[Nginx 系列教程（9）nginx 解决 session 一致性](https://yq.aliyun.com/articles/754525?source=5176.11533457&userCode=ywqc0ubl)
