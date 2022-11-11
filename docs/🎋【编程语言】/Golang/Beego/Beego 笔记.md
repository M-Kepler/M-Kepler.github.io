- [参考资料](#参考资料)
- [Beego](#beego)
  - [配置](#配置)
  - [请求](#请求)
    - [routers 路由](#routers-路由)
    - [controllers 控制器](#controllers-控制器)
    - [models 模型](#models-模型)
    - [views 视图模板](#views-视图模板)
    - [请求头](#请求头)
    - [参数](#参数)
      - [参数校验](#参数校验)
      - [获取请求参数](#获取请求参数)
  - [响应](#响应)
  - [日志](#日志)
  - [ctx 上下文](#ctx-上下文)
    - [`c.Ctx.Input`](#cctxinput)
    - [`c.Ctx.Input.Query`](#cctxinputquery)
  - [i18n 本地化](#i18n-本地化)
  - [ORM](#orm)
  - [单元测试和覆盖率](#单元测试和覆盖率)
- [Bee 工具](#bee-工具)
  - [swagger](#swagger)
- [学习过程中的疑问](#学习过程中的疑问)
- [坑](#坑)
- [其他](#其他)

# 参考资料

[Go Web 编程](https://learnku.com/docs/build-web-application-with-golang)

[beego 快速入门](https://www.tizi365.com/archives/104.html)

[beego 官方文档](https://beego.vip/docs/intro/)

# Beego

- 创建项目

  ```sh
  bee new webproject
  cd webproject
  go get webproject
  bee run
  ```

- 打包

  ```sh
  打包成功后再项目根目录下生成一个 .tar.gz 压缩包，命名格式: ${项目名}.tar.gz
  bee pack
  ```

## 配置

`conf/app.conf`

```ini
[ip_service]
auth_url = /v1/auth

; 通过 include 加载配置
include /path/to/your/common.conf
```

```go
// 获取 [ip_service] 下的 auth_url
beego.AppConfig.String("ip_service::auth_url")
```

## 请求

### routers 路由

- 获取 url

### controllers 控制器

### models 模型

### views 视图模板

有点像 jinja2

```html
{{.Website}} 会被替换掉
```

### 请求头

```go
base.Ctx.Request.Header.Get("X-Real-ip")
```

### 参数

controller 就是封装了很多解析 HTTP 请求报文的函数，比如获取当前请求的 url、protocol、参数等等

```go
id := this.Ctx.GetInt("id")
```

#### 参数校验

[beego——表单验证](https://www.cnblogs.com/yangmingxianshen/p/10122395.html)

https://github.com/beego/beego/blob/master/adapter/validation/validation.go

```go
type MssGetCcodeByDevTypeReq struct {
    // 自定义了一个 MyTimestamp 校验函数
    DeviceType     int    `json:"type" valid:"Required;Range(-1,50)"`
    StartTimeStamp string `json:"start_time" valid:"Required;MyTimestamp"`
    EndTimestamp   int64  `json:"end_time" valid:"Required;MyTimestamp"`
}
```

#### 获取请求参数

[beego 中 Query 和 Param 的区别](https://www.jianshu.com/p/7aa6abc69d21)

## 响应

## 日志

## ctx 上下文

可以通过 Context 获取请求参数，返回请求结果

### `c.Ctx.Input`

```go
//获取用户请求的协议:HTTP/1.1
beego.Info(u.Ctx.Input.Protocol())

//用户请求的RequestURI: /v1/apptodayRpt/UpALL
beego.Info(u.Ctx.Input.URI())

//请求的URL地址: /v1/apptodayRpt/UpALL
beego.Info(u.Ctx.Input.URL())

//请求的 scheme: http/https
beego.Info(u.Ctx.Input.Scheme())

//请求的域名:例如 beego.me, 192.168.0.120
beego.Info(u.Ctx.Input.Domain())

//返回请求域名的根域名,例如请求是blog.beego.me-->返回 beego.me;192.168.0.120--> 192.168
beego.Info(u.Ctx.Input.SubDomains())

//请求的域名,和上面相同:例如 beego.me, 192.168.0.120
beego.Info(u.Ctx.Input.Host())

//请求的站点地址,scheme+doamin的组合: http://192.168.0.10
beego.Info(u.Ctx.Input.Site())

//请求的方法:GET,POST 等
beego.Info(u.Ctx.Input.Method())

//判断是否是某一个方法:是不是POST方法,注意必须大写
beego.Info(u.Ctx.Input.Is("POST"))

//是不是Get请求
beego.Info(u.Ctx.Input.IsGet())

//是不是Put请求
beego.Info(u.Ctx.Input.IsPut())

//是不是Post请求
beego.Info(u.Ctx.Input.IsPost())

//判断是否是AJAX请求:false
beego.Info(u.Ctx.Input.IsAjax())

//判断当前请求是否HTTPS请求:false
beego.Info(u.Ctx.Input.IsSecure())

//判断当前请求是否 Websocket请求:false
beego.Info(u.Ctx.Input.IsWebsocket())

//判断当前请求是否有文件上传:true
beego.Info(u.Ctx.Input.IsUpload())

//返回请求用户的 IP,如果用户通过代理，一层一层剥离获取真实的IP:192.168.0.102
beego.Info(u.Ctx.Input.IP())

//返回用户代理请求的所有IP,如果没有代理,返回[]
beego.Info(u.Ctx.Input.Proxy())

//返回请求的服务器端口:3000
beego.Info(u.Ctx.Input.Port())

//客户端浏览器的信息:Mozilla/5.0 (Linux; Android 5.1.1; vivo X7 Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Mobile Safari/537.36 Html5Plus/1.0 (Immersed/24.0)
beego.Info(u.Ctx.Input.UserAgent())

//该函数返回 Get 请求和 Post 请求中的所有数据
beego.Info(u.Ctx.Input.Query("name"))
```

### `c.Ctx.Input.Query`

## i18n 本地化

## ORM

[beego 框架 orm 基础使用一](https://juejin.cn/post/6889280478281465864)

- `in` 必须有值才行

  ```go
  // 根据服务注册时间过滤企业 ID
  _, err = o.QueryTable(scloudb.KTableNameSaas).
    Filter("scode", constants.KPLTSOCCode).
    Filter("ccode__in", corpCodes).  ########## 这里 corpcodes 如果为空的话，会报错
    Filter("ttick__gte", time.Unix(ServiceStartTs, 0)).
    Filter("ttick__lte", time.Unix(ServiceEndTs, 0)).
    All(&saasInfos, "ccode")

  // 只能这样了，先判断有没有值，有才加过滤条件
  if len(request.CorpCodes) > 0 {
    qs = qs.Filter("corp_code__in", request.CorpCodes)
  }
  ```

- [查不到数据会抛异常](https://studygolang.com/articles/17004)

  ```golang
  // 查询不到数据
  if err != nil && err == orm.ErrNoRows {
      do_something()
  }
  ```

- 查询某列数据

  ```go
  // 先把数据查询出出来，再搬到返回的结构中
  deviceInfos := make([]*scloudb.Device, 0)
  o := orm.NewOrm()
  _, err := o.QueryTable(KTableNameDevices).
    Filter("type", QueryType).
    Distinct().
    All(&deviceInfos, "code")

  result := make([]int, 0, len(deviceInfos))
  for _, deviceItem := range deviceInfo{
    result = append(result, deviceItem.Code)
  }
  ```

- [使用原生 SQL](https://blog.51cto.com/u_3409716/2904248)

  ```sql

  ```

## 单元测试和覆盖率

[beego 与 gin 的覆盖率测试](https://blog.csdn.net/hbshhb/article/details/107087040)

[在 beego 框架中写单元测试时，go test 获取不到 app.conf 的配置信息](https://www.cxymm.net/article/qq_44477844/108681285)

# Bee 工具

```sh
go env -w GO111MODULE=on
go install github.com/beego/bee/v2@latest

```

## swagger

[beego 使用 Swagger](https://blog.csdn.net/wplblog/article/details/113243447)

```sh
bee generate doc

```

# 学习过程中的疑问

> 据说你很垃圾

- 不是 RESTFul 风格，不像 Flask，代码路径就是 API 路径，非常清晰

# 坑

[引入的库红土，导致记录日志后，无法启动](https://blog.csdn.net/hotqin888/article/details/122270738)

# 其他

```go
func test() []int {
  return []int {}
}
```
