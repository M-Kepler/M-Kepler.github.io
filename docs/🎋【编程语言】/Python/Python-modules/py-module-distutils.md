- [`distutils`](#distutils)
  - [参考资料](#参考资料)
  - [version](#version)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `distutils`

### 参考资料

### version

- [版本比较](https://blog.csdn.net/whatday/article/details/107873900)

  ```py
  # 比较版本号, 本来以为可以用字符串来比较
  >>> "vt2.5.1" < "vt2.5.21"
  >>> False  # 两边字符串位数不匹配的时候就会得到错误的结果
  >>> "vt2.5.1" < "vt2.5.4"
  >>> True   # 位数相同的时候可以这样比较

  >>> "vt2.5.1" < "vT2.5.4"
  >>> False  # 小写 < 大写，这种就是纯粹的字符比较，一位位比较

  # pythonic
  from distutils.version import StrictVersion
  # 将一串带有预发布标签的数字分隔为两个或三个部分的格式
  # 预发布标签的字母只能是a或者b加数字版本号，而且只能在最末尾
  # 预发布a版本低于b版本，并且预发布版本永远小于正式发布版

  from distutils.version import LooseVersion
  # 并没有任何规定的格式。由一系列数字，相隔时间或字母的字符串组成
  # 并没有一个严格的格式。在进行比较的时候按照数字大小，字符串按字典顺序比较
  >>> LooseVersion("VT2.5.3") < LooseVersion("VT2.5.4")
  True
  >>> LooseVersion("vT2.5.3") < LooseVersion("VT2.5.14")
  True
  >>> LooseVersion("vT2.5.3") < LooseVersion("VT2.5.14")
  True
  >>> LooseVersion("BBC2.5.1 B") < LooseVersion("BBC2.5.10")
  True
  >>> LooseVersion("BBC2.5.1 B") < LooseVersion("BBC2.5.1")
  False  # 这里也没办法了，不适用
  >>> LooseVersion("BBC2.5.1 B") < LooseVersion("BBC2.5.1 C")
  True
  ```

> 模块使用记录

- 基本使用

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方
