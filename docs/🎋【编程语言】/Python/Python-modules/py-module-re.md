- [`re`](#re)
  - [参考资料](#参考资料)
  - [模块学习](#模块学习)
  - [使用记录](#使用记录)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `re`

正则表达式模块

### 参考资料

- [菜鸟教程 python re 模块](https://www.runoob.com/python/python-reg-expressions.html)

### 模块学习

### 使用记录

> 模块使用记录

- 正则匹配参数

  | 参数   | 意义                                                                            |
  | :----- | :------------------------------------------------------------------------------ |
  | `re.I` | 忽略大小写                                                                      |
  | `re.L` | 表示特殊字符集 `\w, \W, \b, \B, \s, \S` 依赖于当前环境                          |
  | `re.M` | 多行模式                                                                        |
  | `re.S` | 即为 `.` 并且包括换行符在内的任意字符（`.` 不包括换行符）                       |
  | `re.U` | 表示特殊字符集 `\w, \W, \b, \B, \d, \D, \s, \S` 依赖于 `Unicode` 字符属性数据库 |
  | `re.X` | 为了增加可读性，忽略空格和 `#` 后面的注释                                       |

- 使用

  ```py
  import re
  TEST_REG = r'(^([a-zA-Z0-9]){8,20}$)'
  test_str = "q34123asdfas234"
  # 匹配成功，返回一个匹配的对象，否则返回None
  reg_ret = re.match(TEST_REG, test_str)

  # re.search 扫描整个字符串并返回第一个成功的匹配。
  re.search()

  # 返回匹配到的结果集，就是正则表达式里的()分组
  reg_ret.group(num=0)
  reg_ret.groups()

  ###### 用法有点不一样 ######
  pattern = re.compile(r'\d+')
  # 从下标为[3, 10]的位置开始进行匹配
  pattern.match('one12twothree34four', 3, 10)
  pattern.group(0)  # 输出匹配到的第0组数据
  pattern.start(0)  # 输出匹配到的第0组数据的开始下标
  pattern.end(0)    # 输出匹配到的第0组数据的结束下标
  pattern.span(0)   # 输出匹配到的第0组数据的下标范围，返回一个tuple，包含开始和结束两个下标值

  # 返回一个包含所有匹配到的元素的列表
  pattern.findall("one12twothree34four")
  # pattern.finditer("one12twothree34four") 迭代器形式返回
  ```

- 匹配中英文

  ```py
  >>> import re
  >>> ree = r"[\u4e00-\u9fa5_a-zA-Z0-9]*"
  >>> re.search(ree, "黄")   # ok

  >>> s = '会得到'
  >>> re.search(ree, s)
  >>> ree = re.compile('^[\u4e00-\u9fa5a-z0-9A-Z_@.\-]*$')  # 有 ^ 开头 $ 结尾就不行
  >>> re.search(ree, s)  # err

  >>> ree = re.compile('[\u4e00-\u9fa5a-z0-9A-Z_@.\-]*')
  >>> re.search(ree, s)  # ok
  <_sre.SRE_Match object at 0x7f8892d4dd30>
  >>>

  # 字符串前用 u
  >>> ree = re.compile(u'^[\u4E00-\u9FA5a-z0-9A-Z_@.\-]{1,90}$')
  >>> re.search(ree, '和')   ###### ok

  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

- 带开始结束的正则表达式

  ```py
  import re
  # 正则表达式快忘光了
  # pattern = r"^BBC2.5.[0-9]+$"
  # 不能匹配到，只能匹配到 B开头，[0-9] 数字结尾的字符串
  # string ="BBC2.5.1052345223452345"

  pattern = r"BBC2.5.[0-9]+"  # 可以匹配到
  string ="BBC2.5.10-HyBBC2.5.10—hyp"
  re.match(pattern, string)
  ```
