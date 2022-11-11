- [官方文档](#官方文档)
- [内置模块](#内置模块)
  - [`typing`](#typing)
  - [`shlex`](#shlex)
  - [`sys`](#sys)
    - [参考资料](#参考资料)
    - [使用记录](#使用记录)
    - [模块学习](#模块学习)
    - [Q & A](#q--a)
    - [模块亮点](#模块亮点)
    - [模块的坑](#模块的坑)
  - [`stat`](#stat)
  - [`fcntl`](#fcntl)
    - [参考资料](#参考资料-1)
    - [`flock` 文件锁](#flock-文件锁)
    - [模块的坑](#模块的坑-1)
  - [`psutil`](#psutil)
  - [`functools`](#functools)
    - [`partial`](#partial)
  - [`timeit`](#timeit)
    - [参考资料](#参考资料-2)
    - [使用参考](#使用参考)
    - [模块学习](#模块学习-1)
    - [Q & A](#q--a-1)
    - [模块亮点](#模块亮点-1)
    - [模块的坑](#模块的坑-2)
  - [`time`](#time)
  - [`dateutil`](#dateutil)
  - [`pickle`](#pickle)
  - [`hmac`](#hmac)
  - [`uuid`](#uuid)
  - [`binascii`](#binascii)
  - [`wsgiref`](#wsgiref)
  - [`calender`](#calender)
  - [subprocess](#subprocess)
    - [参考资料](#参考资料-3)
    - [使用记录](#使用记录-1)
    - [模块学习](#模块学习-2)
    - [Q & A](#q--a-2)
    - [模块亮点](#模块亮点-2)
    - [模块的坑](#模块的坑-3)
  - [inspect](#inspect)
  - [forgery_py](#forgery_py)
  - [`tarfile`](#tarfile)
- [第三方模块](#第三方模块)
  - [`netifaces`](#netifaces)
  - [`weakref`](#weakref)
  - [`intervals`](#intervals)
    - [参考资料](#参考资料-4)
  - [`xmlrpc`](#xmlrpc)
  - [`gettext`](#gettext)
    - [参考资料](#参考资料-5)
    - [使用记录](#使用记录-2)
    - [模块学习](#模块学习-3)
    - [Q & A](#q--a-3)
    - [模块亮点](#模块亮点-3)
    - [模块的坑](#模块的坑-4)
  - [`json-sempai`](#json-sempai)
    - [参考资料](#参考资料-6)
    - [使用记录](#使用记录-3)
    - [模块学习](#模块学习-4)
    - [Q & A](#q--a-4)
    - [模块亮点](#模块亮点-4)
    - [模块的坑](#模块的坑-5)
  - [`cryptography`](#cryptography)
  - [`sqlite3`](#sqlite3)
  - [`pretty_error`](#pretty_error)
    - [使用记录](#使用记录-4)
  - [`sphinx`](#sphinx)
  - [`cython`](#cython)
  - [`faker`](#faker)
  - [selenium](#selenium)
  - [`signal`](#signal)
  - [`zlib`](#zlib)
  - [`html`](#html)
  - [`rpdb`](#rpdb)
    - [参考资料](#参考资料-7)
    - [使用记录](#使用记录-5)
    - [模块学习](#模块学习-5)
    - [Q & A](#q--a-5)
    - [模块亮点](#模块亮点-5)
    - [模块的坑](#模块的坑-6)
  - [`futurist`](#futurist)
    - [`periodics`](#periodics)
  - [pyarmor](#pyarmor)
  - [OpenSSL](#openssl)
- [其他](#其他)

# 官方文档

- 官方文档](https://docs.python.org/zh-cn/3/index.html)

- [`Python` 菜鸟教程](https://www.runoob.com/python/python-tutorial.html)

# 内置模块

## `typing`

> `python3.5` 中开始新增的专用于类型注解 (type hints) 的模块

- [python Typing 模块 - 类型注解](https://blog.csdn.net/jeffery0207/article/details/93734942)

## `shlex`

> 简单词汇分析

- [官方文档](https://www.osgeo.cn/cpython/library/shlex.html)

## `sys`

> 模块简介

### 参考资料

### 使用记录

> 模块使用记录

- `sys.modules`

  - `sys.modules` 是一个全局字典，该字典是 python 启动后就加载在内存中

  - `每当程序员导入新的模块，sys.modules都将记录这些模块` 字典 sys.modules 对于加载模块起到了缓冲的作用。当某个模块第一次导入，字典 sys.modules 将自动记录该模块。当第二次再导入该模块时，python 会直接到字典中查找，从而加快了程序运行的速度

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## `stat`

## `fcntl`

> 模块简介

### 参考资料

### `flock` 文件锁

```py
flock(f, operation)
"""
operation: 包括：
  fcntl.LOCK_SH 共享锁:   所有进程没有写访问权限，即使是加锁进程也没有。所有进程有读访问权限。
  fcntl.LOCK_EX 排他锁:   除加锁进程外其他进程没有对已加锁文件读写访问权限。
  fcntl.LOCK_NB 非阻塞锁: 如果指定此参数，函数不能获得文件锁就立即返回，否则，函数会等待获得文件锁。
"""
flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB) # LOCK_NB 可以同 LOCK_SH 或 LOCK_NB 进行按位或`|`运算操作
```

### 模块的坑

> 一些不注意使用容易犯错的地方

## `psutil`

- 获取 cpu 核数

  ```python
  import psutil
  print(cpu_module_cnt = psutil.cpu_count())

  # 或者
  from multiprocessing import cpu_count
  print(cpu_count())
  ```

## `functools`

### `partial`

> 偏函数

- 偏函数的作用等价于上面的这种写法

  ```py{cmd=true}
  from functools import partial
  test2 = partial(test, def_arg=2)  # 相当于定义
  test2(xxxx) # 调用
  ```

## `timeit`

### 参考资料

- [`python` 模块之 `timeit`](https://www.cnblogs.com/Uncle-Guang/p/8796507.html)

### 使用参考

```py
import timeit

'''
def timeit(stmt="pass", setup="pass", timer=default_timer, number=default_number, globals=None)
  stmt   表示要测试的代码，可以是字符串，单个变量或者函数
  setup  表示执行 stmt 需要传入的环境，比如 import 一些东西
  number 表示 stmt 执行的次数，默认是100 0000
'''

foo = """
sum = []
for i in range(1000):
  sum.append(i)
"""
print(timeit.timeit(stmt="[i for i in range(1000)]", number = 100000))
# 3.480182599974796

print(timeit.timeit(stmt=foo, number=100000))
# 8.93708649999462
```

### 模块学习

- 从内部实现来讲，`timeit` 内部构建了一个独立的虚拟环境，手工的执行建立语句，然后手工编译和执行被计时的语句

- 如何把参数传递进去

  ```py
  import timeit, functools
  t = timeit.Timer(functools.partial(foo, arg_1, arg_2))
  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## `time`

```py
time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
```

## `dateutil`

## `pickle`

## `hmac`

> - [Python3 加密(hashlib 和 hmac)模块的实现](https://www.jb51.net/article/128911.htm)
> - [hmac 模块生成加入了密钥的消息摘要详解](https://www.jb51.net/article/132645.htm)

- `compare_digest`

  `hmac.compare_digest(a, b)`
  在 hmac 模块中，通过 `from _operator import _compare_digest as compare_digest` 引入了这个函数。这个函数简单点来说就是用来比较 a 与 b 值是否相等的，当将外部输入的值与 HMAC.degest()/HMAC.hexdigest()的输出做比较时，有可能会遭到时序攻击，所以可以通过调用这个函数比较值并防御可能存在的攻击行为。Python3.3 版本后新增。

- 时序攻击？ TODO

## `uuid`

- uuid1()

  基于时间戳。由 MAC 地址、当前时间戳、随机数生成。可以保证全球范围内的唯一性，但 MAC 的使用同时带来安全性问题，局域网中可以使用 IP 来代替 MAC。

- uuid2()

  基于分布式计算环境 DCE（Python 中没有这个函数）。算法与 uuid1 相同，不同的是把时间戳的前 4 位置换为 POSIX 的 UID。实际中很少用到该方法。

- uuid3()

  `基于名字的MD5散列值`。通过计算名字和命名空间的 MD5 散列值得到，保证了同一命名空间中不同名字的唯一性，和不同命名空间的唯一性，但同一命名空间的同一名字生成相同的 uuid。

- uuid4()

  基于随机数。由伪随机数得到，有一定的重复概率，该概率可以计算出来。

- uuid5()

  `基于名字的SHA-1散列值`。算法与 uuid3 相同，不同的是使用 Secure Hash Algorithm 1 算法。

## `binascii`

> 用来进行进制和字符串之间的转换

- 如下

  ```py
  import binascii
  s = 'abcde'
  s = binascii.a2b_hex(h)    # 16进制转字符串  'abcde'
  s = binascii.unhexlify(h)  # 作用同上

  h = binascii.b2a_hex(s)    # 字符串转16进制  '6162636465'
  h = binascii.hexlify(s)    # 作用同上
  ```

## `wsgiref`

## `calender`

## subprocess

> 模块简介

### 参考资料

> 参考资料

- [Subprocess 执行外部命令并获取输出](https://mp.weixin.qq.com/s?subscene=23&__biz=MzIxODIwMDIxOQ==&mid=2649438158&idx=1&sn=77218bd73cc3f72397d8be36b1a347b9&chksm=8ff1b63ab8863f2c13fe031c30b601afc21180e05d4d7480b050df839597a23fbade5e2a5e0a&scene=7&key=ad479a0dc78b18f3d5401864a64c13057e8ea4151421c455193e0857edaca0fda23041d71fd1e0e43e00d5758ff944e98171ff12cb15e1bc207e312da902672bcd14340efcca55c8aee5138856bf68096cb6c21ae1e27cdd863acf562c498212a94285dd23cc3cc5bc984101bd44ed09bdf53f741877b6c370b49da3b86a1c55&ascene=0&uin=OTczNDE4OTg0&devicetype=Windows+10+x64&version=62090529&lang=zh_CN&exportkey=A4DL7NJtJQpMclIi6rgDyUs%3D&pass_ticket=HX9R39yFMLBfi5EDyASmcrSG0LxEpC3DX1xCNCN%2BDtfXS5mNjNOeR75Kn1WU9QSZ)

### 使用记录

> 模块使用记录

- `Popen` 执行 shell 命令

  ```py
  import subprocess
  def _push_env(env):
    # 把环境变量放到os.environ中
    pass

  def _pop_env(env):
    pass

  def run_cmd(cmd, log_output, shell, with_output, env):
      if isinstance(cmd, (list, tuple)):
          cmd = map(lambda s: s.encode('utf-8') if isinstance(s, unicode) else s, cmd)
      elif isinstance(cmd, unicode):
          cmd = cmd.encode('utf-8')

      old_env = _push_env(env)
      try:
          if with_output:
              # 命令注入警告
              sp = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, shell=shell)
              stdout = sp.communicate()[0]
              retcode = sp.pool()
          else:
              retcode = subprocess.call(cmd, shell=shell)
              stdout = ''
      finally:
          _pop_env(old_env)
      if log_output:
          LOG.debug("output: %s", stdout)
      LOG.debug("end running: %(cmd)s") % {'cmd': cmd})
      return (retcode, stdout)
  ```

- `call`

  ```py
  import subprocess
  def test(host):
      # host = "www.baidu.com"
      cmd = "ping -c 1 %s" % host
      subprocess.call(cmd, shell=True)
      # 如果 host 被设置为 "; ls" 等特殊的字符，使得一条命令变成两条，后面的命令也会被执行，就完成了命令注入
  ```

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

- [执行的命令包含 `括号`、`空格`导致执行失败](https://www.zhihu.com/question/21970501)

  ```
  https://blog.csdn.net/qq_21063873/article/details/82049532
  使用check_output
  ```

> 一些不注意使用容易犯错的地方

- [Python Subprocess 库在使用中可能存在的安全风险总结](https://blog.csdn.net/sinat_38682860/article/details/82708787)

  `subprocess.Popen(cmd, stdout, stderr, shell)` 存在命令注入的危险

  ```py
  import pipes
  import subprocess
  cmd = "whoami;ls"
  # cmd = "whoami && ls"
  # 会执行 whoami ls 两个命令
  subprocess.Popen(cmd, shell=True)
  ```

## inspect

## forgery_py

## `tarfile`

# 第三方模块

## `netifaces`

> [获取计算机网卡信息](https://segmentfault.com/a/1190000020525940?utm_source=tag-newest)

- 获取网卡信息（网关、IP、掩码）

  ```py
  import netifaces
  # AF_INET 表示 ipv4地址
  # 获取网关
  netifaces.gateways()['default'][netifaces.AF_INET][0]
  # 获取指定网口IP
  netifaces.ifaddresses('eth0')[netifaces.AF_INET][0]['addr']
  # 获取网口掩码
  netifaces.ifaddresses('eth0')[netifaces.AF_INET][0]['netmask']
  ```

## `weakref`

> 对一个对象 `弱引用`，相对于通常的引用来说，如果一个对象有一个常规的引用，它是不会被垃圾收集器销毁的； 但是如果一个对象只剩下一个**弱引用，那么它可能被垃圾收集器收回**

- [python weakref 模块](https://blog.csdn.net/Ricky110/article/details/77899715)

- 弱引用消除了引用循环的这个问题，本质来讲，弱引用就是一个对象指针，它不会增加它的引用计数.

## `intervals`

> 区间运算的第三方库，类似的库有很多，甚至名字都是一样的

- [Python 区间库 python-intervals](https://blog.csdn.net/u011519550/article/details/101168773)

### 参考资料

- [官网源码](https://github.com/kvesteri/intervals)

```py
>>> from intervals import IntInterval
# 闭区间
>>> interval = IntInterval.closed(1, 2)
>>> IntInterval('[1, 2]')

# 开区间
>>> interval = IntInterval.open(2, 3)
>>> interval
IntInterval('(2, 3)')

# 左开右闭区间
>>> interval = IntInterval.open_closed(1, 2)
>>> interval
IntInterval('(1, 2]')

# 左闭右开区间
>>> interval = IntInterval.closed_open(1, 2)
>>> interval
IntInterval('[1, 2)')

# 无限区间
>>> from infinity import inf
>>> interval = IntInterval.open(-inf, inf)
IntInterval('(,)')

>>> 1 in interval
True
>>> 2 in interval
False
```

## `xmlrpc`

- 服务端

  ```py
  server = SimpleXMLRPCServer(("localhost",9999)) # 绑定端口
  server.register_function(speak_your_words) # 注册RPC服务，客户端可调用其中的方法
  server.serve_forever() #启动监听
  ```

- 客户端

  ```py
  server = xmlrpclib.ServerProxy("192.168.10.5:333")
  s.speak_your_words("chris") # 调用服务端rpc服务
  ```

## `gettext`

> 本地化，用来做 id 转成 str 的

### 参考资料

[Python gettext 使用](https://www.cnblogs.com/miaoweiye/p/12525259.html)

### 使用记录

- 编写本地化文件

  ```po
  # 我是备注
  msgid "test"
  msgstr "测试"
  ```

- 编译文件

  ```sh
  # msgfmt 是python自带的命令
  $msgfmt ui.po   # 得到 ui.mo 文件
  ```

- 怎么使用

  ```py
  import gettext
  from functools import partial

  ''' 可以搞个配置文件来保存配置
  # 配置文件
  [locale]
  lang = zh_CN
  encoding = utf8
  '''

  _LOCALE_PATH = "/path/to/locale"
  _LANG = ["zh_CN"]
  _CONTEXT = "ui"

  trans = gettext.translation(_CONTEXT, _LOCALE_PATH, _LANG)
  '''
  :param xxx.po 文件名 xxx
  :param locale 目录所在路径
  :param 本地化语言 zh_CN、en_US
  '''
  trans.gettext
  my_gettext = partial(trans.gettext)

  # from path.to.ui import my_gettext as _
  print(my_gettext("test"))  # 获取test对应的翻译后文件
  # 输出"测试"
  ```

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## `json-sempai`

> 可以像使用 python 模块一样访问 json 文件

### 参考资料

> 参考资料

### 使用记录

- 读取 `json` 文件

  ```py
  import jsonsempai
  with jsonsempai.imports():
      # 也可以直接from jsonsempai import json_file_name
      # 但是还是用with安全点
      import path.to.json_file_name
  ```

### 模块学习

> 有助于了解导入机制

- json 文件可以像使用 python 包一样直接导入

  ```py
  >>> from jsonsempai import magic
  # import magic之后直接导入json文件名称就可以访问了
  >>> import path.to.json_file_name
  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## `cryptography`

## `sqlite3`

## `pretty_error`

> 让程序异常输出的信息看起来舒服一点的一个库

### 使用记录

> 模块使用记录

- 基本使用

  ```python
  # a.py
  import pretty_errors
  print(1/0)

  # python a.py 输出的异常信息:
  -----------------------------------------------------------------------------------a.py 3 <module>
  print(1/0)
  ZeroDivisionError:
  division by zero
  ```

- 也可以不用每个`py`文件都导入一边

  ```sh
  # 让所有的python程序的异常输出都得到美化
  python -m pretty_errors
  ```

## `sphinx`

> - 和 `pydoc` 一样，是一个把注释生成文档的工具
> - 和 `markdown` 一样，有自己的语法

- [使用 sphinx 快速为你 python 注释生成 API 文档](https://blog.csdn.net/sinat_29957455/article/details/83657029)

## `cython`

## `faker`

> 模块简介

- [Python Faker 的使用 (1)：基础使用方法与函数速查](https://www.jianshu.com/p/6bd6869631d9)

- 从列表中随机选择

  ```py
  ranges = list(range(1, 100))
  cnt = 10
  faker.random_choices(ranges, cnt)
  ```

## selenium

> Web 自动化测试

## `signal`

> Python 3.4 版本引入的标准库，直接内置了对异步 IO 的支持

## `zlib`

> 对数据进行简单压缩处理

- [Python 使用 zlib 对数据进行简单压缩处理](https://blog.csdn.net/Star_SDK/article/details/80562059)

## `html`

## `rpdb`

> 用来进行远程调试的

### 参考资料

### 使用记录

> 模块使用记录

- 基本使用

  ```py
  # 在需要进行断点调试的地方加上这一行，代码运行到这里会停下来
  import rpdb; rpdb.set_trace()
  # telnet 4444 端口进入pdb调试
  # telnet 127.0.0.1 4444
  ```

- `rpdb_socket` 调试 unix 域套接字

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

## `futurist`

### `periodics`

## pyarmor

[python 代码加密](https://blog.csdn.net/weixin_43572000/article/details/83832677)

## OpenSSL

# 其他

- `python -m SimpleHTTPServer` 默认是把启动目录当根目录的

- `python3 -m http.server 8888`

- mockredispy
