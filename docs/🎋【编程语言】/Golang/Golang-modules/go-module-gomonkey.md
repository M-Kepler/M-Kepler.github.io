# 参考资料

[gomonkey 调研文档和学习](https://blog.csdn.net/u013276277/article/details/104993370)

[https://github.com/agiledragon/gomonkey](https://github.com/agiledragon/gomonkey)

# gomonkey

> 单元测试打桩

## 使用过程中的疑问

- **函数 A 调用了包 P 中的函数 B，`xxx,err := P.B()` 这种情况无法 mock，但是如果把调用 P.B() 再封装一层函数，就可以用 gomonkey.ApplyFunc 的方式 mock**

  ```go
  package test

  func A() {
      // 期望可以把给这个函数打桩，而不是把整个 A 函数打桩
      // 如果单独写个函数 C，里面调用 P.B()，就可以 mock 成功
      authStr, err := P.B()
      ...
  }

  // patchLicenseAuth := ApplyFuncReturn(test.C, "fake license auth", nil)
  ```
