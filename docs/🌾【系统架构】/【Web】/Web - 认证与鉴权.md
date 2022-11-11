- [参考资料](#参考资料)
- [认证 & 鉴权](#认证--鉴权)
  - [`cookies` 和 `session` 以及 `token`](#cookies-和-session-以及-token)
    - [cookies](#cookies)
      - [有效期](#有效期)
      - [同一个 ip 不同的端口导致 cookie 相互覆盖的问题](#同一个-ip-不同的端口导致-cookie-相互覆盖的问题)
      - [cookie 是怎么工作的](#cookie-是怎么工作的)
    - [session](#session)
    - [token](#token)
  - [安全性](#安全性)
    - [失败重试次数限制](#失败重试次数限制)
    - [重放攻击](#重放攻击)
    - [Token 泄露](#token-泄露)
  - [挑战响应认证](#挑战响应认证)
    - [AK/SK](#aksk)
  - [`JWT`](#jwt)
    - [针对 `jwt` 的攻击](#针对-jwt-的攻击)
  - [`OAuth 1.0`](#oauth-10)
  - [`OAuth 2.0`](#oauth-20)
- [单点登录 `sso`](#单点登录-sso)
  - [认证中心 CAS](#认证中心-cas)
  - [同源原则](#同源原则)
  - [跨域问题](#跨域问题)
- [其他](#其他)

# 参考资料

- [如何设计 QQ、微信等第三方账号登陆](https://mp.weixin.qq.com/s/DzQno0ZfWsQ-vpZHE8AB9g)

- [基于 timestamp 和 nonce 防止重放的方案](https://blog.csdn.net/koastal/article/details/53456696)

# 认证 & 鉴权

- 设计认证登录模块的时候，最容易想到的就是直接把用户名密码保存起来，认证的时候做比对；但是如果服务器被攻破了，明文保存密码的方式风险就大了，不仅本网站有风险，用户往往在多个网站使用相同的密码，黑客直接使用这些密码去尝试登录别的网站

- 想保证数据库中用户密码的安全，关键在于`不能存储密码本身，而要存储密码的散列值`。计算密码散列值的函数接收密码作为输入，使用一种或多种加密算法转换密码，最终得到一个和原始密码没有关系的字符序列。核对密码时，密码散列值可代替原始密码，因为计算散列值的函数是可复现的：只要输入一样，结果就一样

## `cookies` 和 `session` 以及 `token`

[彻底弄懂 session，cookie，token](https://segmentfault.com/a/1190000017831088)

- `cookie` 和 `session` 都是**因为 HTTP 请求无状态而引入的概念**

  - `cookie` 可以认为是一个变量，存储在浏览器，需要浏览器打开 cookie 支持，而且还有大小限制；

  - `session` 存储在服务器，可以存储更多信息

  - 二者优势互补，一般都是请求携带一个 cookie，后端根据该 cookie 找到对应的 session

  - 多说一句，`cookie` 和 `session` 不是必须一起使用的，禁用 cookie 后，还可以放在 URL 中，只要能达到保持会话状态的目的就行

- `token`

  认证鉴权用的，比如登录认证、CSRF 校验等

### cookies

- [同一域名不同端口 cookie 共享问题](https://juejin.cn/post/7094880337716592654)

- [cookies 基础了解](https://segmentfault.com/a/1190000004556040)

- [如何区分不同用户——Cookie/Session 机制详解](https://www.cnblogs.com/zhouhbing/p/4204132.html)

- 每个域名下的 cookie 的大小最大为 `4KB`，每个域名下的 cookie 数量最多为`20`个

- 根据同源策略，cookie 是区分端口的，但是浏览器实现来说，**cookie 区分域，而不区分端口**，也就是说，同一个 ip 下的多个端口下的 cookie 是共享的！ip 相同，端口不同，覆盖就是这个道理。

- cookie 属性

  ```sh
  Set-Cookie: bbc_session=eyJ1c2VyX3Rva2VuIjp7IiBiIjoiWXpSa1pqRTBOV0V0WmpFelppMHhNV1ZqTFRrMk5qUXRabVZtWTJabFpUQXhZemhrIn19.FZMZVA.4A4pCH7Epmp1DuOvACl1I60GRs0; Secure; HttpOnly; Path=/

  # name 为 bbc_session

  # value 为 eyJ1c2Vy...

  # Secure;
  # 当设置为true时，表示创建的 Cookie 会被以安全的形式向服务器传输
  # 也就是只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，如果是 HTTP 连接则不会传递该信息，所以不会被窃取到 Cookie 的具体内容。

  # HttpOnly;
  # https://www.jianshu.com/p/42abd108d1d1
  # 浏览器会禁止页面中的 JavaScript 访问带有 HttpOnly 属性的 Cookie。 目的很明显，就是为了应对 Cookie 劫持攻击。

  # Path=/  该 cookie 生效范围
  ```

#### 有效期

- 如果 Cookie 没有设置 expires 属性，那么 cookie 的生命周期只是在当前的会话中， 关闭浏览器意味着这次会话的结束，此时 cookie 随之失效

- 查看 `chrome` 浏览器的 `cookie`

  ```sh
  # 浏览器地址栏输入
  chrome://settings/siteData
  ```

- 默认 `cookies` 过期时间是多久

  - 设置 Cookie 的生存期。有两种存储类型的 Cookie：会话性与持久性。Expires 属性`缺省时，为会话性Cookie，仅保存在客户端内存中，并在用户关闭浏览器时失效`。

  - 持久性 Cookie 会保存在用户的硬盘中，直至生存期到或用户直接在网页中单击“注销”等按钮结束会话时才会失效 。

- 过期时间里的 `会话结束` 是指浏览器关闭的时候

  [cookies.expires 的值是 session 是什么意思](https://zhidao.baidu.com/question/267319510906067005.html)

  如果想从客户端修改 session 的话,是绝对没门的!session 和 cookies 同样是在客户端存储单用户信息,但,不同的是,cookies 以文件方式存储于客户端磁盘,而 session 以系统变量来存储(仅在内存中)再者,cookies 可以设置有效期限,而 session 是客户一旦与服务器断开(关闭浏览器答)session 自动注销,(就算不关闭浏览器,默认 20 分钟 session 自动失效)

#### 同一个 ip 不同的端口导致 cookie 相互覆盖的问题

[一个服务器搭多个 tomcat 导致 session 丢失，或者同一个 IP 不同端口，多个应用的 session 会冲突解决方法](https://blog.csdn.net/ISSHQuery/article/details/8493231)

- 多台设备共用同一个 IP，比如管理口的 `https://10.111.222.33`，页面登录设备 A 后，浏览器为 `10.111.222.33` 设置了 cookies_a；设备在不退出浏览器的情况下（cookies 默认会在关闭浏览器的时候清理掉）也通过这个 IP 访问设备 B，会发现浏览器存储的该 ip 对应的 cookies 变成了 cookies_b（即，cookies_b 覆盖了 cookies_a），导致页面 A 退出的问题

- 同一个主机，不同端口， `cookies` 字段还一样的两个 web 服务也会存在这个问题

- 直接表现就是页面还没到超时时间就提示需要重新登录了，或者一直提示需要重新登录

- 搜一下相同 ip，cookies 失效就出现一堆相关文章

#### cookie 是怎么工作的

- 存储 cookie 是浏览器提供的功能。cookie 其实是存储在浏览器中的纯文本，浏览器的安装目录下会专门有一个 cookie 文件夹来存放各个域下设置的 cookie。

- 发 http 请求时，浏览器会先检查是否有相应的 cookie，有则自动`添加在request header中的cookie字段`中。这些是浏览器自动帮我们做的，而且每一次 http 请求浏览器都会自动帮我们做

### session

- 需要浏览器打开 cookies 支持

- cookies 大小限制

- 一般都是携带一个 cookie，然后根据该 cookie 从后端找出对应的 session 信息

### token

token 可以抵抗 csrf，cookie+session 不行

## 安全性

> 时间戳、随机数、签名

### 失败重试次数限制

### 重放攻击

> timestamp 时间戳、nonce (Number used once) 只允许出现一次的随机数

### Token 泄露

- 上 HTTPS

- 使用 `Cookies` 而不是 `LocalStorage` 存储

## 挑战响应认证

> 双方都提前知道了 `用户名和密码` 或其他用于认证的唯一信息，且提前约定了 `签名方法`

```sh
C ----------- ① 认证请求 ----------→ S
   # Client发出认证请求，进行身份认证，发送Client的id

C <---------- ② 挑战 -------------- S
   # 发送Server产生的Random_s(挑战码)

C ----------- ③ 响应 -------------→ S
   # 发送用自己的密钥加密的(Random_s + id)
   # M || H(Random_s + id + key)

C <---------- ④ 验证结果 ---------→ S
   # S用保存的C的密钥加密(Random_s + id)，和C发过来的做比较，返回认证结果
```

- 一种客户端认证机制，挑战相当于咨询，应答相当于回答

- 特点是`密码不在网络上传输`

- 该认证机制中认证者每次向被认证者发送一个随机挑战字串，客户端收到这个挑战字串后，按照双方事先协商好的方法应答

- 认证完成后就可以颁发 token 用于后面的通信了

### AK/SK

`Access Key Id / Secret Access Key`

https://www.cnblogs.com/xiaomengniu/p/16174330.html

## `JWT`

> - 服务端、客户端都知道用来登录的用户名、密码
> - 通过比较双方计算消息摘要是否一致来鉴别身份，避免了密码在网络上传输

[在线解码工具](https://tooltt.com/jwt-decode/)

[JWT 签名算法 HS256、RS256 及 ES256 及密钥生成](https://www.cnblogs.com/kirito-c/p/12402066.html)

```sh
# 编码前：
## 第一部分：HEADER
{
    "alg": "HS256",
    "typ": "JWT"
}

## 第二部分：PAYLOAD
{
    "iss": "sangfor.com.cn",
    "iat": 1653461445,
    "dev_key": "5045002758",
    "exp": 1654066245
}

## 第三部分：
用 HEADER 中的消息摘要算法对 `第一部分 + "." + 第二部分` 计算消息摘要；然后用 `.` 拼接起来，形成三段式的 JWT

# 编码后：可用点分割成三段
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0=.eyJpc3MiOiJzYW5nZm9yLmNvbS5jbiIsImlhdCI6MTY1MzQ2MTQ0NSwiZGV2X2tleSI6IjUwNDUwMDI3NTgiLCJleHAiOjE2NTQwNjYyNDV9.YTZlYzljOWRlYjljYjZmODIxYTE0M2EwMzI4MDlhNTA1ZDJlMDYzZGJmYzZjODUyZTJlNzYzNjQ0NTQyMzU4Ng==
```

- [★ 理解 JWT（JSON Web Token）认证及实践](https://mp.weixin.qq.com/s/gUgh_kmMu0Hmobeah7wNLQ)

- [★ JWT 超详细分析](https://cloud.tencent.com/developer/article/1849936)

- [★ JWT、 超详细、分析、token、鉴权、组成、优势](https://blog.csdn.net/qq_41570658/article/details/111517646)

- 优势在于使用无状态、可扩展的方式处理应用中的用户会话。`服务端可以通过内嵌的声明信息，很容易地获取用户的会话信息，而不需要去访问用户或会话的数据库`。在一个分布式的面向服务的框架中，这一点非常有用。

- Token 有长度限制，且不能撤销，需要 token 有失效时间限制 (exp)

### 针对 `jwt` 的攻击

- [针对 JWT 的几种攻击方法](https://www.cnblogs.com/wjrblogs/p/14361834.html)

- [微信开放平台接入指南](https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html)

- 可以篡改 jwt 的 payload 信息，并且修改 header 中的 algo 为 None，如果服务端支持 None 不验签的话就通过了

## `OAuth 1.0`

![alt](https://img-blog.csdnimg.cn/20190521200756553.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2l2b2xjYW5v,size_16,color_FFFFFF,t_70)

## `OAuth 2.0`

[OAuth 授权的工作原理是怎样的？足够安全吗？](https://www.zhihu.com/question/19781476/answer/200400369?utm_source=com.microsoft.emmx&utm_medium=social&utm_oi=70255225339904)

OAuth（开放授权）是一个开放标准，允许用户授权第三方移动应用访问他们存储在另外的服务提供者上的信息，而不需要将用户名和密码提供给第三方移动应用或分享他们数据的所有内容

- [OAuth2.0 认证原理浅析](https://blog.csdn.net/tclzsn7456/article/details/79550249)

  - 授权码模式（Authorization Code）(正统方式)(支持 refresh token)

  - 授权码简化模式（Implicit）(为 web 浏览器设计)(不支持 refresh token)

  - Pwd 模式（Resource Owner Password Credentials） (基本不用)(支持 refresh token)

  - Client 模式（Client Credentials） (为后台 api 调用设计)(不支持 refresh token)

  - 扩展模式（Extension）（自定义模式，这个就不介绍了）

- 授权码模式

  ![alt](https://img-blog.csdnimg.cn/20200304172356246.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2phdmFfNjY2NjY=,size_16,color_FFFFFF,t_70)

  ![alt](https://res.wx.qq.com/op_res/D0wkkHSbtC6VUSHX4WsjP5ssg5mdnEmXO8NGVGF34dxS9N1WCcq6wvquR4K_Hcut)

# 单点登录 `sso`

共享登录状态，A 系统登录了，可以免登录 B 系统；A 系统退出了，B 系统也退出

## 认证中心 CAS

> cookie 不能在两个域之间共享。这时就必须引入第三方进行登录状态的管理，从而在多个应用之间实现共享；简单的理解：所有的网站都查询一个只做登录的服务器

在多个网站之间共享登录状态指的就是单点登录。多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统

- 首先将用户信息的验证中心独立出来，作为一个单独的 **`认证中心 CAS`**，作用是判断客户端发送的账号密码的正确性

- 然后向客户端返回对应的用户信息，并且返回一个由服务器端秘钥加密的登录信息的 token 给客户端，该 token 具有一定的有效时限

- 当一个应用系统跳转到另一个应用系统时，通过 url 参数的方式来传递 token，然后转移到的应用站点发送给认证中心

- 认证中心对 token 进行解密后验证，如果用户信息没有失效，则向客户端返回对应的用户信息，如果失效了则将页面重定向会单点登录页面。

[跨域单点登录](https://www.toutiao.com/article/6392461462589145601/?iid=10130159787&app=news_article&tt_from=android_share&utm_medium=toutiao_android&utm_campaign=client_share&wid=1651545210212)

**流程一：所有站点均未登录，用户访问站点 A 资源页。**

![alt](https://p9.toutiaoimg.com/origin/18500000de0a2ab3df7d?from=pc)

**流程二：用户在 A.登录页登录**

![alt](https://p9.toutiaoimg.com/origin/18510004e9de0f2af3ac?from=pc)

**流程三：用户访问 B.资源页**

![alt](https://p9.toutiaoimg.com/origin/18510004ea0aafdb9c5f?from=pc)

## 同源原则

- 出于浏览器的`同源策略`限制。同源策略（Sameoriginpolicy）是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。可以说 Web 是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。同源策略会阻止一个域的 javascript 脚本和另外一个域的内容进行交互。所谓同源（即指在同一个域）就是两个页面具有相同的协议（protocol），主机（host）和端口号（port）

- 同源策略需要同时满足 `协议、域名、端口` 三者都相同；只要任意条件不满足，都存在 **跨域问题**

## 跨域问题

因为我们之前做的单点登录都是在 **模拟登录过程**，由站点 A 主动把加密后的用户名密码发送给站点 B（即模拟用户手动输入用户名密码登录的过程）；

但是会存在这样的问题，站点 B 通过认证校验后，响应中会包含 cookies 和 token 等登录凭证，这些会保存到 浏览器 cookies 中；

这就存在跨域问题了，因为是 A 站点进行的模拟登录，所以返回的响应也是设置到了 A 站点的域下；A 站点再重定向到 B 站点首页，B 站点是获取不到这些登录凭证的（同源原则）

[cookie 单点登录（跨域访问）](https://www.bbsmax.com/A/o75NjyyK5W/)

# 其他

[什么是跨域？怎么解决？](https://zhuanlan.zhihu.com/p/442610509)

[关于跨域登录](https://segmentfault.com/q/1010000009353301)

[跨域实现统一登录](https://www.pianshen.com/article/4973125380/)

[基于 Nginx 解决前端访问服务器跨域问题(Session 和 cookie 无效)]https://developer.aliyun.com/article/758010)
