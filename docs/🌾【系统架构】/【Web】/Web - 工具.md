- [Web 工具](#web-工具)
  - [`wget`](#wget)
  - [`curl`](#curl)
  - [`ab`](#ab)
  - [`wrk`](#wrk)
  - [`curl-load`](#curl-load)
  - [`jmeter` 并发测试工具](#jmeter-并发测试工具)
  - [浏览器插件](#浏览器插件)
- [其他](#其他)

# Web 工具

## `wget`

```sh
wget http://127.0.0.1:5556/vpn_agent/monitor
```

- `-P` 保存到指定目录下

  ```sh
  wget http://code.huangjinjie.org/test_repo/raw/branch_name/path/to/test_files.txt -P ./tmp/
  ```

- `--output-document=/dev/null` 不保存文件

  ```sh
  wget --output-document=/dev/null http://127.0.0.1:5556/vpn_agent/monitor
  ```

- `--no-check-certificate` 不校验证书

## `curl`

[curl 发 post 请求](https://www.cnblogs.com/guixiaoming/p/8507268.html)

[curl 网站开发指南](https://www.ruanyifeng.com/blog/2011/09/curl.html)

- 不要用关键字 `PWD`，否则，改变当前目录名称的

  ```sh
  [root@localhost test]# PWD="123123123"

  [root@localhost 123123123]# # 看到当前目录已经改变为 $PWD 了

  ```

- `--silent` 静默模式，不输出任何东西

- `-w %{http_code}` 获取 HTTP 响应码

  ```sh
  $curl -I -m 10 -o /dev/null -s -w %{http_code} www.baidu.com
  -I 仅测试 HTTP 头
  -m 10 最多查询 10s
  -o /dev/null 屏蔽原有输出信息
  -s silent 模式，不输出任何东西
  -w %{http_code} 控制额外输出
  ```

- 变量拼接

  ```sh
  URI=/cloud_deploy/device_auth
  echo -e "\n\n第四步：请求认证: $URI"
  # 用双引号才能把变量放进去，单引号的话不会
  PARAM="{\"device_key\":\"5045002758\",\"random\":$RANDOM_CODE,\"sign\":\"TODO\"}"
  curl -X POST -d ${PARAM} "http://easydeploy-1:8116/${URI}?token=${TOKEN}" --header "Outer_addr:127.0.0.1"

  ```

- echo 输出拼接后的 URL

  ```sh
  echo curl -X POST -d ${PARAM} "http://easydeploy-1:8116/${URI}?token=${TOKEN}" --header "Outer_addr:127.0.0.1"
  ```

- Linux 中使用 curl 命令发送带参数的 get 请求和 post 请求](https://blog.csdn.net/finghting321/article/details/105733140)

  ```sh
  # 一定用引号，要不然多个 url 参数的话，只会获取到第一个
  PARAM_T=11111
  # 不能用双引号，否则变量不会被替换
  url -k -X GET 'https://xxxxxxxxxx?_tt=$PARAM_T'

  ```

- [配置详解](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)

  | 选项                | 说明                       |
  | ------------------- | -------------------------- |
  | `-d`                | 请求参数                   |
  | `-X`                | 请求的方法                 |
  | `-D`                |
  | `-H`                | 指定请求头                 |
  | `--connect-timeout` | 请求超时时间               |
  | `-v`                | 查看详细请求信息           |
  | `-s`                | 参数将不输出错误和进度信息 |

- `--header` 携带请求头

  ```sh
  curl -k --location --request GET "http://test.com" --header 'Cookie: AuthCookie=adfasd'
  ```

- 携带参数

  https://blog.csdn.net/qq_29566629/article/details/123258127

  ```sh
  # 使用 -d 发送带参数的请求（默认是 post 方式提交）
  # 模拟 form 表单提交
  curl -d "device_key=e5611eba64" localhost:5555/cloud_deploy/device_conn
  # 模拟 json 提交
  curl -d "{\"device_key\": \"e5611eba64\"}\" localhost:5555/cloud_deploy/device_conn
  ```

- `-v` 打印出 https 握手过程

  ```sh
  curl -v -k -H 'Content-type: application/json' -X GET 'https://172.251.252.2:7443/v1/bbc/pkgget/update?version=20210119%2F10%3A00%3A00&plan_type=savevirus&image_id=AF_8.0.50&lang=zh-CN'

  {"code": 2004, "message": "The lib file does not exist.", "data": null}
  ```

- [-c cookie.txt](https://aiezu.com/article/linux_curl_http_cookie.html) 获取 cookie

  ```sh
  $curl -c cookie.txt -X POST http://172.251.252.4:10000/api/v1/ctrlmanager/bbcauth?x_id=null -d '{"data":{"bbcInfo":"dockerBbcInfo"}}'
  {"data":{"reset_psw":"false","permission":"rw","token":"0E887001B3CC1E6D9CB694FDDF8A3347","result":""},"code":0,"message":"成功"}

  # 查看返回的 cookie 信息
  $cat cookie.txt
  ```

- `-b cookie.txt` 携带 cookie

  ```sh
  curl -b cookie.txt -k --request GET $TEST_BBC_URL --header "CSRFPreventionToken: $CSRF_TOKEN"
  ```

- 忽略 https 证书认证

  ```sh
  # 注意是小写的 k，意思是：允许 curl 使用非安全的 ssl 连接并且传输数据（证书不受信）。
  curl -k -X GET 'https://10.60.160.110/bbc/branch/branch?sort_field=status&sort_order=desc&org_id=0&limit=20&start=0'
  ```

- 怎么指定传入的参数类型

  http 请求传过来的都是字符串，没办法指定传过来的类型，只有在 cgi 处理的时候做转换、校验。比如接口指定传入的参数需要是整形，其实 http 传过来的都是字符串，只不过在做参数校验的时候强行转成整型，如果发生异常，说明传过来的参数错误

- `--user_agent` 伪装成浏览器发起请求

- `--refer`

- `--location`

## `ab`

`apache` 自带的压力测试工具

- [参数](https://www.cnblogs.com/myvic/p/7703973.html)

  - `-n` 执行的请求个数，默认时执行一个请求

  - `-c` 一次产生的请求个数，即并发个数，同时访问的客户端数

  - `-p` 模拟 post 请求，文件格式为 `gid=2&status=1` ,配合 `-T` 使用

  - `-T` post 数据所使用的 `Content-Type` 头信息，如果 `-T 'application/x-www-form-urlencoded'`

  - 如果只用到一个 Cookie，那么只需键入命令：`-C key＝value`

  - 如果需要多个 Cookie，就直接设 Header：`-H "Cookie: Key1=Value1; Key2=Value2"`

- [输出说明](https://www.cnblogs.com/weizhxa/p/8427708.html)

- 发 GET 请求

  ```sh
  ab -c 10 -n 10 http://www.test.api.com/?gid=2
  ```

- 发 POST 请求

  ```sh
  # post要带去的参数保存到文件 post.txt
  device_key=e5611eba64

  # 发post请求
  ab -n 100  -c 10 -p 'post.txt' -T 'application/x-www-form-urlencoded' 'https://10.118.194.141:5001/cloud_deploy/device_conn'
  ```

  - 读取 `post.txt` 发 `post` 请求，从服务端看，传过来的是 `xxxxx\n`

    ```sh
    device_key=xxxxx
    # 用 notepad++ 打开，把那个\n删掉
    ```

- ab 命令做压测

  > 参数存放在 post.txt 里, 注意默认不要有换行字符，用 notpad++ 检查一下

  ```sh
  POST_DATA='post.txt'
  URL='https://10.118.194.141:5001/cloud_deploy/device_conn'
  CONTENT_TYPE='application/x-www-form-urlencoded'
  ab -n 20000  -c 200 -p $POST_DATA -T $CONTENT_TYPE $URL
  ```

## `wrk`

## `curl-load`

## `jmeter` 并发测试工具

## 浏览器插件

- **modheader** 修改请求头

- **cookieeditor** 修改 cookie

# 其他

- [设置请求头 modheader 插件](https://www.chrome666.com/chrome-extension/modheader.html)
