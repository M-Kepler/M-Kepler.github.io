- [参考资料](#参考资料)
- [编码规范](#编码规范)
  - [异常](#异常)
- [注释规范](#注释规范)
- [其他](#其他)

# 参考资料

# 编码规范

- `receiver name should be a reflection of its identity; don't use generic names such as "this" or "self" (ST1006)go-staticcheck`

  golang 不建议使用 self 或者 this

  [为什么 go 中的 receiver name 不推荐使用 this 或者 self](https://www.jianshu.com/p/593665168e4e)

## 异常

- 不要什么都打印 `err.Error()`，有可能会报空指针错误： `Handler crashed with error runtime error: invalid memory address or nil pointer dereference`

- 错误日志的记录

  ```go

  func Api() (interface{}, error) {
      // 失败时，记录日志，方便排查时定位
      if false {
          fmt.Println("记录错误日志")
          return nil, errors.News("error message")
      }

      if true {
          return data, nil
      }
  }

  func Test() {
      data, err = Api()
      if err != nil {
          fmt.Println("记录日志")
          do_fail_response()
      }
  }
  ```

# 注释规范

[swagger](https://github.com/swaggo/swag/blob/master/README_zh-CN.md)

[★ golang swagger 注解说明](https://blog.csdn.net/mctlilac/article/details/106198915)

```golang
// @Param dir query string false “direction asc or desc”
@Param
参数，表示需要传递到服务器端的参数，有五列参数，使用空格或者 tab 分割，五个分别表示的含义如下
1. 参数名
2. 参数类型，可以有的值是 formData、query、path、body、header，formData 表示是 post 请求的数据，query 表示带在 url 之后的参数，path 表示请求路径上得参数，例如上面例子里面的 key，body 表示是一个 raw 数据请求，header 表示带在 header 信息中得参数。
3. 参数类型
4. 是否必须
5. 注释
```

# 其他
