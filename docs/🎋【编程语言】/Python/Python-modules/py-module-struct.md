- [参考资料](#参考资料)
- [`struct`](#struct)
- [其他](#其他)

## 参考资料

- [struct 使用详解](https://blog.csdn.net/qq_30638831/article/details/80421019)

## `struct`

> - 让 `python` 可以向像 C 那样处理二进制字节
> - 按照指定格式把 `python` 数据格式转化成字符串，该字符串为字节流，如网络传输时，不能传输 `int`，需要先转化为字节流，然后再发送
> - 按照指定格式把字节流转化为 `python` 的数据类型
> - 处理 `c` 语言的结构体

- 函数说明

  ```py
  struct.pack("IHHI4s", VERSION, CMD_TYPE, 4, 4, b'TEST') ##模拟数据
  # 就像 snprintf 一样
  # "IHHI4s" 表示格式，需要参照下面的格式符
  # 后面的参数是格式 I H H I 4 s 对应的值
  ```

- 格式符

  | 格式符        | C 语言类型           | Python 类型          | Standard size |
  | :------------ | :------------------- | :------------------- | :------------ |
  | `x`           | `pad byte(填充字节)` | no value             |
  | `c`           | `char`               | `string of length 1` | 1             |
  | `b`           | `signed char`        | `integer`            | 1             |
  | `B`           | `unsigned char`      | `integer`            | 1             |
  | `?`           | `_Bool`              | `bool`               | 1             |
  | `h`           | `short`              | `integer`            | 2             |
  | `H`           | `unsigned short`     | `integer`            | 2             |
  | `i`           | `int`                | `integer`            | 4             |
  | `I(大写的 i)` | `unsigned int`       | `integer`            | 4             |
  | `l(小写的 L)` | `long`               | `integer`            | 4             |
  | `L`           | `unsigned long`      | `long`               | 4             |
  | `q`           | `long long`          | `long`               | 8             |
  | `Q`           | `unsigned long long` | `long`               | 8             |
  | `f`           | `float`              | `float`              | 4             |
  | `d`           | `double`             | `float`              | 8             |
  | `s`           | `char[]`             | `string`             |               |
  | `p`           | `char[]`             | `string`             |               |
  | `P`           | `void *`             | `long`               |               |

- 把任意数据类型变成字节

  ```py
  import struct
  # pack的第一个参数是处理指令，'>I'的意思是：
  # > 表示字节序是 big-endian，也就是网络序(大端)， I 表示 4 字节无符号整数。
  # < 表示小端
  struct.pack('>I', 10240099)
  >>> b'\x00\x9c@c
  ```

- 把字节转换成相应的类型

  ```py
  import struct
  # >IH 的说明，后面的 bytes 依次变为 I: 4字节无符号整数 H: 2字节无符号整数
  struct.unpack('>IH', b'\xf0\xf0\xf0\xf0\x80\x80')
  >>> (4042322160, 32896)
  ```

## 其他
