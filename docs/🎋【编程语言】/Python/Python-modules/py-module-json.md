- [`json`](#json)
  - [模块的坑](#模块的坑)

## `json`

> JSON 格式:JavaScript Object Notation, 是一种数据交换格式
> dumps / dump :卸下 loads / load :加载
> 后面有没有 s 的区别:有 s 的方法标识返回一个对象，没有则直接写入文件中

- 数据类型

  ```sh
  number boolean string null array object
  ```

- [`json.dumps(xxx)`，被转成 unicode 了`u'xxxxx'`](https://www.cnblogs.com/stubborn412/p/3818423.html)

  ```py
  json.dumps(data, ensure_ascii=False)
  ```

- 序列化/反序列化

  把变量从内存中变成可存储或传输的过程, 将对象序列化成 JSON 格式

- `pickle` 把 `python` 对象序列化成字符串，对比一下和 `struct` 的区别

  ```py
  import pickle
  with open('dump.txt', 'wb') as f:
      pickle.dump(dict, f)
  #  将dict对象序列化成一个bytes写入到dump.txt
  with open('dump.txt', 'rb') as f: # 反序列化
      dict = pickle.load(f)
  ```

- `JSON`

  Pickle 进行序列化的话只有 python 才能读得懂`dump.txt`的内容, JSON 格式则任何语言都有方法进行解析

  ```py
  # dumps()返回一个str，内容就是标准的JSON, dump()则直接写入文件
  import json
  d = dict(name='Jack', age=21, score=99)
  with open('json_str.txt', 'w') as f:   # 这里直接以读的形式打开
      json.dump(d, f)
  with open('json_str.txt', 'r') as f:
      _dict = json.load(f)
  ```

- 字符串被转化成 `unicode`

  ```py
  >>> import json
  >>> aa = json.dumps("中文")
  >>> print(aa)
  >>> "\u4e2d\u6587"

  >>> bb = json.dumps(
    [{'contry': '中国', 'province': '广东', 'city': '深圳'}],
    indent=4,
    ensure_ascii=False)
  # 以4个空格作为缩进
  # 接收非ASCII编码字符,这样才能用中文
  >>> print(bb)  # 此时输出的就是格式化好的json串
  [
      {
          "province": "广东",
          "contry": "中国",
          "city": "深圳"
      }
  ]
  >>> print(bb.decode('unicode_escape'))
  ```

### 模块的坑

- [传输二进制 byte 流的问题](https://blog.csdn.net/xingty/article/details/44201379)
