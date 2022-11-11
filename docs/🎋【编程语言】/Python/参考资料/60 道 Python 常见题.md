- [1. 一行代码实现 1--100 之和](#1-一行代码实现-1--100-之和)
- [2. 如何在一个函数内部修改全局变量](#2-如何在一个函数内部修改全局变量)
- [3. 列出 5 个 python 标准库](#3-列出-5-个-python-标准库)
- [4. 字典如何删除键和合并两个字典](#4-字典如何删除键和合并两个字典)
- [5. 谈下 python 的 GIL](#5-谈下-python-的-gil)
- [6. python 实现列表去重的方法](#6-python-实现列表去重的方法)
- [7. `fun(*args, **kwargs)`中的 `*args` 和 `**kwargs` 什么意思？](#7-funargs-kwargs中的-args-和-kwargs-什么意思)
- [8. python2 和 python3 的 range（100）的区别](#8-python2-和-python3-的-range100的区别)
- [9. 一句话解释什么样的语言能够用装饰器](#9-一句话解释什么样的语言能够用装饰器)
- [10. python 内建数据类型有哪些](#10-python-内建数据类型有哪些)
- [11. 简述面向对象中 `__new__` 和 `__init__` 区别](#11-简述面向对象中-__new__-和-__init__-区别)
- [12. 简述 with 方法打开处理文件帮我我们做了什么](#12-简述-with-方法打开处理文件帮我我们做了什么)
- [13. python 中生成随机整数、随机小数、0--1 之间小数方法](#13-python-中生成随机整数随机小数0--1-之间小数方法)
- [14. 避免转义给字符串加哪个字母表示原始字符串](#14-避免转义给字符串加哪个字母表示原始字符串)
- [15. `. div> 中国 </div>`，用正则匹配出标签里面的内容（“中国”），其中 class 的类名是不确定的](#15--div-中国-div用正则匹配出标签里面的内容中国其中-class-的类名是不确定的)
- [16. python 中断言方法举例](#16-python-中断言方法举例)
- [17. python2 和 python3 区别？列举 5 个](#17-python2-和-python3-区别列举-5-个)
- [18. 列出 python 中可变数据类型和不可变数据类型，并简述原理](#18-列出-python-中可变数据类型和不可变数据类型并简述原理)
- [19. s = "ajldjlajfdljfddd"，去重并从小到大排序输出 "adfjl"](#19-s--ajldjlajfdljfddd去重并从小到大排序输出-adfjl)
- [20. 用 lambda 函数实现两个数相乘](#20-用-lambda-函数实现两个数相乘)
- [21. 字典根据键从小到大排序](#21-字典根据键从小到大排序)
- [22. 利用 collections 库的 Counter 方法统计字符串每个单词出现的次数 `"kjalfj;ldsjafl;hdsllfdhg;lahfbl;hl;ahlf;h"`](#22-利用-collections-库的-counter-方法统计字符串每个单词出现的次数-kjalfjldsjaflhdsllfdhglahfblhlahlfh)
- [23. 字符串 `a = "not 404 found 张三 99 深圳"`，每个词中间是空格，用正则过滤掉英文和数字，最终输出 "张三 深圳"](#23-字符串-a--not-404-found-张三-99-深圳每个词中间是空格用正则过滤掉英文和数字最终输出-张三-深圳)
- [24. filter 方法求出列表所有奇数并构造新列表，`a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`](#24-filter-方法求出列表所有奇数并构造新列表a--1-2-3-4-5-6-7-8-9-10)
- [25. 列表推导式求列表所有奇数并构造新列表，`a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`](#25-列表推导式求列表所有奇数并构造新列表a--1-2-3-4-5-6-7-8-9-10)
- [26. 正则 `re.complie` 作用](#26-正则-recomplie-作用)
- [27. `a=（1，）b=(1)，c=("1")` 分别是什么类型的数据？](#27-a1b1c1-分别是什么类型的数据)
- [28. 两个列表 [1,5,7,9] 和[2,2,6,8]合并为[1,2,2,3,6,7,8,9]](#28-两个列表-1579-和2268合并为12236789)
- [29. log 日志中，我们需要用时间戳记录 error,warning 等的发生时间，请用 datetime 模块打印当前时间戳 “2018-04-01 11:38:54”](#29-log-日志中我们需要用时间戳记录-errorwarning-等的发生时间请用-datetime-模块打印当前时间戳-2018-04-01-113854)
- [30. 写一段自定义异常代码](#30-写一段自定义异常代码)
- [31. 正则表达式匹配中，`(.*) 和 (.*?)` 匹配区别？](#31-正则表达式匹配中-和--匹配区别)
- [32. 简述 Django 的 orm](#32-简述-django-的-orm)
- [33. `[[1,2],[3,4],[5,6]]` 一行代码展开该列表，得出 `[1,2,3,4,5,6]`](#33-123456-一行代码展开该列表得出-123456)
- [34. `x="abc",y="def",z=["d","e","f"]`, 分别求出 `x.join(y) 和 x.join(z)` 返回的结果](#34-xabcydefzdef-分别求出-xjoiny-和-xjoinz-返回的结果)
- [35. 举例说明异常模块中 try except else finally 的相关意义](#35-举例说明异常模块中-try-except-else-finally-的相关意义)
- [36. 举例说明 zip() 函数用法](#36-举例说明-zip-函数用法)
- [37. `a="张明 98 分"`，用 `re.sub`，将 98 替换为 100](#37-a张明-98-分用-resub将-98-替换为-100)
- [38. `a="hello"`和`b="你好"` 编码成 bytes 类型](#38-ahello和b你好-编码成-bytes-类型)
- [39. `[1,2,3]+[4,5,6]` 的结果是多少](#39-123456-的结果是多少)
- [40. 提高 python 运行效率的方法](#40-提高-python-运行效率的方法)
- [41. 遇到 bug 如何处理](#41-遇到-bug-如何处理)
- [42. 正则匹配，匹配日期 2018-03-20](#42-正则匹配匹配日期-2018-03-20)
- [43. list=[2,3,5,4,9,6]，从小到大排序，不许用 sort，输出 [2,3,4,5,6,9]](#43-list235496从小到大排序不许用-sort输出-234569)
- [44. 写一个单列模式](#44-写一个单列模式)
- [45. 保留两位小数](#45-保留两位小数)
- [46. 求三个方法打印结果](#46-求三个方法打印结果)
- [47. 分别从前端、后端、数据库阐述 web 项目的性能优化](#47-分别从前端后端数据库阐述-web-项目的性能优化)
- [48. 使用 pop 和 del 删除字典中的 "name" 字段，`dic={"name":"zs","age":18}`](#48-使用-pop-和-del-删除字典中的-name-字段dicnamezsage18)
- [49、计算代码运行结果，zip 函数历史文章已经说了，得出 [("a",1),("b",2)，("c",3),("d",4),("e",5)]](#49计算代码运行结果zip-函数历史文章已经说了得出-a1b2c3d4e5)
- [50. 简述同源策略](#50-简述同源策略)
- [51. 简述 cookie 和 session 的区别](#51-简述-cookie-和-session-的区别)
- [52. 简述多线程、多进程](#52-简述多线程多进程)
- [53. 简述 any() 和 all() 方法](#53-简述-any-和-all-方法)
- [54. IOError、AttributeError、ImportError、IndentationError、IndexError、KeyError、SyntaxError、NameError 分别代表什么异常](#54-ioerrorattributeerrorimporterrorindentationerrorindexerrorkeyerrorsyntaxerrornameerror-分别代表什么异常)
- [55. python 中 copy 和 deepcopy 区别](#55-python-中-copy-和-deepcopy-区别)
- [56. 列出几种魔法方法并简要介绍用途](#56-列出几种魔法方法并简要介绍用途)
- [57. C:\Users\ry-wu.junya\Desktop>python 1.py 22 33 命令行启动程序并传参，print(sys.argv) 会输出什么数据](#57-cusersry-wujunyadesktoppython-1py-22-33-命令行启动程序并传参printsysargv-会输出什么数据)
- [58. 请将 [i for i in range(3)] 改成生成器](#58-请将-i-for-i-in-range3-改成生成器)
- [59. `a = "hehheh"`, 去除收尾空格](#59-a--hehheh-去除收尾空格)
- [60. 举例 sort 和 sorted 对列表排序，list=[0,-1,3,-10,5,9]](#60-举例-sort-和-sorted-对列表排序list0-13-1059)

---

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/QDSU2tfnRjkui-LApimNJA)

## 1. 一行代码实现 1--100 之和

利用 sum() 函数求和

![alt](https://mmbiz.qpic.cn/mmbiz_jpg/mzj5rt1NXgoo2ibqZM79iauL3PGc6qS4hoqx4v3ialdB4hvqQBdRTvjr2iaoMucSaCBUdaGYFqEoIZt6WWpY0bkAxA/640?wx_fmt=jpeg)

## 2. 如何在一个函数内部修改全局变量

函数内部 global 声明 修改全局变量

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgoDj53dJbraGlyBtJubr7eHBo3WvoiaL5EtIsN9s5h2EtibbEicTQnF8urrHu0afqnRblm6owMUWPqwQ/640?wx_fmt=png)

## 3. 列出 5 个 python 标准库

os：提供了不少与操作系统相关联的函数

sys: 通常用于命令行参数

re: 正则匹配

math: 数学运算

datetime: 处理日期时间

## 4. 字典如何删除键和合并两个字典

del 和 update 方法

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgoDj53dJbraGlyBtJubr7eHp6EnH3TZseb7yFGia1hnjeQZ4yiczo6CkBhUQ1eFEvjiacvVpic1Ff4W9w/640?wx_fmt=png)

## 5. 谈下 python 的 GIL

GIL 是 python 的全局解释器锁，同一进程中假如有多个线程运行，一个线程在运行 python 程序的时候会霸占 python 解释器（加了一把锁即 GIL），使该进程内的其他线程无法运行，等该线程运行完后其他线程才能运行。如果线程运行过程中遇到耗时操作，则解释器锁解开，使其他线程运行。所以在多线程中，线程的运行仍是有先后顺序的，并不是同时进行。

多进程中因为每个进程都能被系统分配资源，相当于每个进程有了一个 python 解释器，所以多进程可以实现多个进程的同时运行，缺点是进程系统资源开销大

## 6. python 实现列表去重的方法

先通过集合去重，在转列表：

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgoDj53dJbraGlyBtJubr7eHK5csfRsem4KS07OtUcyJibUYbT40ZAdJHupwmESS887Vrg8E6jETZsA/640?wx_fmt=png)

## 7. `fun(*args, **kwargs)`中的 `*args` 和 `**kwargs` 什么意思？

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgoDj53dJbraGlyBtJubr7eHibLnd1Oq9x7Hw4Ble4UNHl3Ol8sk6wR4zz21u0YqztYicYicpfTkrGLrQ/640?wx_fmt=jpeg)

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgoDj53dJbraGlyBtJubr7eHfCMibOwCTxAqL0iarXpK9QopVmtQKVsRnvtsQNnib9te0l1kBv2eiahaSg/640?wx_fmt=jpeg)

## 8. python2 和 python3 的 range（100）的区别

python2 返回列表，python3 返回迭代器，节约内存

## 9. 一句话解释什么样的语言能够用装饰器

函数可以作为参数传递的语言，可以使用装饰器

## 10. python 内建数据类型有哪些

整型 --int

布尔型 --bool

字符串 --str

列表 --list

元组 --tuple

字典 --dict

## 11. 简述面向对象中 `__new__` 和 `__init__` 区别

`__init__` 是初始化方法，创建对象后，就立刻被默认调用了，可接收参数，如图

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrWN20qZuspibzszvZU4DGWFZ16aXpttCrZ33830tgDwicWHicSdWe9467sw/640?wx_fmt=jpeg)

1、`__new__` 至少要有一个参数 cls，代表当前类，此参数在实例化时由 Python 解释器自动识别

2、`__new__` 必须要有返回值，返回实例化出来的实例，这点在自己实现 `__new__` 时要特别注意，可以 return 父类（通过 super(当前类名, cls)）`__new__` 出来的实例，或者直接是 object 的`__new__` 出来的实例

3、`__init__` 有一个参数 self，就是这个 `__new__` 返回的实例，`__init__` 在 `__new__` 的基础上可以完成一些其它初始化的动作，`__init__` 不需要返回值

4、如果 `__new__` 创建的是当前类的实例，会自动调用 `__init__` 函数，通过 return 语句里面调用的 `__new__` 函数的第一个参数是 cls 来保证是当前类实例，如果是其他类的类名，；那么实际创建返回的就是其他类的实例，其实就不会调用当前类的 `__init__` 函数，也不会调用其他类的 `__init__` 函数。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrWRhBUicpXwiaflou6bNMHYseTWicWdmyn3xCGdVXibib4PeX3XDXjibxHtbRw/640?wx_fmt=jpeg)

## 12. 简述 with 方法打开处理文件帮我我们做了什么

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrW371bic4BGOJUcQo8fgZfPL11V4exaGAdf1hcu4cryroROpvegYibCW7Q/640?wx_fmt=png)

打开文件在进行读写的时候可能会出现一些异常状况，如果按照常规的 f.open

写法，我们需要 try,except,finally，做异常判断，并且文件最终不管遇到什么情况，都要执行 finally f.close() 关闭文件，with 方法帮我们实现了 finally 中 f.close

（当然还有其他自定义功能，有兴趣可以研究 with 方法源码）

## 13. python 中生成随机整数、随机小数、0--1 之间小数方法

随机整数：random.randint(a,b), 生成区间内的整数

随机小数：习惯用 numpy 库，利用 np.random.randn(5) 生成 5 个随机小数

0-1 随机小数：random.random(), 括号中不传参

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrWkBF8ckia0yE028jSrZKaWBvfKLNTibb2dict1xIIe7YrKFlmhnTI19M4w/640?wx_fmt=jpeg)

## 14. 避免转义给字符串加哪个字母表示原始字符串

r , 表示需要原始字符串，不转义特殊字符

## 15. `. div> 中国 </div>`，用正则匹配出标签里面的内容（“中国”），其中 class 的类名是不确定的

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrWsCZXSo2EunWJVlAN3clMsqrBkuYlqj1vydMCdpP4LlnjIchrm66m1w/640?wx_fmt=png)

## 16. python 中断言方法举例

assert（）方法，断言成功，则程序继续执行，断言失败，则程序报错

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpd9Tib6zDHT55ibAZI80RicrWGoibTVubH5ufLQRnCCvibz79GQ4tibIia2I2KbMib0RwC0AG26giabM9ynYw/640?wx_fmt=jpeg)

## 17. python2 和 python3 区别？列举 5 个

- Python3 使用 print 必须要以小括号包裹打印内容，比如 print('hi')

- Python2 既可以使用带小括号的方式，也可以使用一个空格来分隔打印内容，比如 print 'hi'

- python2 range(1,10) 返回列表，python3 中返回迭代器，节约内存

- python2 中使用 ascii 编码，python 中使用 utf-8 编码

- python2 中 unicode 表示字符串序列，str 表示字节序列

- python3 中 str 表示字符串序列，byte 表示字节序列

- python2 中为正常显示中文，引入 coding 声明，python3 中不需要

- python2 中是 raw_input() 函数，python3 中是 input() 函数

## 18. 列出 python 中可变数据类型和不可变数据类型，并简述原理

不可变数据类型：数值型、字符串型 string 和元组 tuple

不允许变量的值发生变化，如果改变了变量的值，相当于是新建了一个对象，而对于相同的值的对象，在内存中则只有一个对象（一个地址），如下图用 id() 方法可以打印对象的 id

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZmHibHwj3eBfia4Q7xlgls8uMLEHS4VDjl1Dqicydlwg2u5LcNFu9QVLWg/640?wx_fmt=png)

可变数据类型：列表 list 和字典 dict；

允许变量的值发生变化，即如果对变量进行 append、+= 等这种操作后，只是改变了变量的值，而不会新建一个对象，变量引用的对象的地址也不会变化，不过对于相同的值的不同对象，在内存中则会存在不同的对象，即每个对象都有自己的地址，相当于内存中对于同值的对象保存了多份，这里不存在引用计数，是实实在在的对象。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZkTIIiceYcEu2Qg5NJziaZvxtZPW54icSTacrickpF7jibR2NsYJ9VvwrxFw/640?wx_fmt=png)

## 19. s = "ajldjlajfdljfddd"，去重并从小到大排序输出 "adfjl"

set 去重，去重转成 list, 利用 sort 方法排序，reeverse=False 是从小到大排

list 是不 变数据类型，s.sort 时候没有返回值，所以注释的代码写法不正确

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9Z5Te5gBwR6LsrU2cZo1UZMLiaVSoRICSqJShsNDeY61MRUblk61DLsOQ/640?wx_fmt=png)

## 20. 用 lambda 函数实现两个数相乘

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZBhJRrWFLTSjKSO6tFG1k6cTBiciaoiafWwxN0icePhVs6tdNKVlWPNd8zw/640?wx_fmt=png)

## 21. 字典根据键从小到大排序

dic={"name":"zs","age":18,"city":"深圳","tel":"1362626627"}

![alt](https://mmbiz.qpic.cn/mmbiz_jpg/mzj5rt1NXgoo2ibqZM79iauL3PGc6qS4hoz8YnpBuwiae7tUOPWwIF454QDia0tQMIUSzSFMQFCicFUicpYjQuDsV6IA/640?wx_fmt=jpeg)

## 22. 利用 collections 库的 Counter 方法统计字符串每个单词出现的次数 `"kjalfj;ldsjafl;hdsllfdhg;lahfbl;hl;ahlf;h"`

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZeVIzic2GXVfvHELj0qm4X3hKQHGvF810jq3luDzBoLgNXyJGr4KNGuA/640?wx_fmt=png)

## 23. 字符串 `a = "not 404 found 张三 99 深圳"`，每个词中间是空格，用正则过滤掉英文和数字，最终输出 "张三 深圳"

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZEdicMYlDd2cjSl0nvaEEszptP2oPs3QonUG7El6f5dFzNNkzo8pZB5A/640?wx_fmt=jpeg)

顺便贴上匹配小数的代码，虽然能匹配，但是健壮性有待进一步确认

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9Zp5yfHsnicfeA7NfMQhwdbzEYdJOibMibbv3tgSlUZVXYLOoXmicdx0PvkQ/640?wx_fmt=jpeg)

## 24. filter 方法求出列表所有奇数并构造新列表，`a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`

filter() 函数用于过滤序列，过滤掉不符合条件的元素，返回由符合条件元素组成的新列表。该接收两个参数，第一个为函数，第二个为序列，序列的每个元素作为参数传递给函数进行判，然后返回 True 或 False，最后将返回 True 的元素放到新列表

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZbsrP8mntgfHKMyqYzQd3zs7ZarzE19GGRdcWflvWTSpqLshYII9eeA/640?wx_fmt=png)

## 25. 列表推导式求列表所有奇数并构造新列表，`a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9Z0FUMbecLAIW1yd5hAR8m08IuiboajHfUANCiawtPNDXJVRmPIYRlb28g/640?wx_fmt=png)

## 26. 正则 `re.complie` 作用

re.compile 是将正则表达式编译成一个对象，加快速度，并重复使用。

## 27. `a=（1，）b=(1)，c=("1")` 分别是什么类型的数据？

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgpyMVNXVO8iaCU29WibXfrd9ZpHU4hjCmh6Yib3jV9bg4awRHFIyeFCVHORgBGZ6COUicibd1XVtLfYJicg/640?wx_fmt=png)

## 28. 两个列表 [1,5,7,9] 和[2,2,6,8]合并为[1,2,2,3,6,7,8,9]

extend 可以将另一个集合中的元素逐一添加到列表中，区别于 append 整体添加。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbcf0ibYb26DhZ27uCgRsKHNAQGCtrbAwsGwEd8icYqKciaxdguBesmqJFg/640?wx_fmt=png)

## 29. log 日志中，我们需要用时间戳记录 error,warning 等的发生时间，请用 datetime 模块打印当前时间戳 “2018-04-01 11:38:54”

顺便把星期的代码也贴上了。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbE4RS79I3NACIMqjxcNPH5TG7ytdfWCuRibQRvtTM8Slka84RRkJonYQ/640?wx_fmt=png)

## 30. 写一段自定义异常代码

自定义异常用 raise 抛出异常。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbWXdsyz2nV214O5M14InUaia7JFL45zwIos0qZA7BWqPGw5KNRZGqaNg/640?wx_fmt=png)

## 31. 正则表达式匹配中，`(.*) 和 (.*?)` 匹配区别？

`(.*)` 是贪婪匹配，会把满足正则的尽可能多的往后匹配。

`(.*?)` 是非贪婪匹配，会把满足正则的尽可能少匹配。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbZtJXJZ0sxrc54aqG2cOnIXaKlLzNq1kKia5UdibEAD028Dev0mToOibKg/640?wx_fmt=png)

## 32. 简述 Django 的 orm

ORM，全拼 Object-Relation Mapping，意为对象 - 关系映射。

实现了数据模型与数据库的解耦，通过简单的配置就可以轻松更换数据库，而不需要修改代码只需要面向对象编程, orm 操作本质上会根据对接的数据库引擎，翻译成对应的 sql 语句, 所有使用 Django 开发的项目无需关心程序底层使用的是 MySQL、Oracle、sqlite....，如果数据库迁移，只需要更换 Django 的数据库引擎即可。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mb2rD7L9I5yZ3WGuhiaYr4b5MgLVnyC7TcJtMIDljE8q9icTdI1W9rhJkQ/640?wx_fmt=png)

## 33. `[[1,2],[3,4],[5,6]]` 一行代码展开该列表，得出 `[1,2,3,4,5,6]`

列表推导式的骚操作

运行过程：for i in a , 每个 i 是【1,2】，【3,4】，【5,6】，for j in i，每个 j 就是 1,2,3,4,5,6, 合并后就是结果。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbpDg5zf7DkoaymJDibibWUOw1G2IeeBXPCHB57l6y3Delr9CLbxqpMvXQ/640?wx_fmt=png)

还有更骚的方法，将列表转成 numpy 矩阵，通过 numpy 的 flatten（）方法，代码永远是只有更骚，没有最骚

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbUAxj3t9UN709LKZ9T2unX7fKBA4vib1lHvQriaxU7qUqBpMu3ro1IqOA/640?wx_fmt=png)

## 34. `x="abc",y="def",z=["d","e","f"]`, 分别求出 `x.join(y) 和 x.join(z)` 返回的结果

join() 括号里面的是可迭代对象，x 插入可迭代对象中间，形成字符串，结果一致，有没有突然感觉字符串的常见操作都不会玩了

顺便建议大家学下 os.path.join() 方法，拼接路径经常用到，也用到了 join, 和字符串操作中的 join 有什么区别，该问题大家可以查阅相关文档，后期会有答案。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbmtVAXSYq0COhjsLLB9140CW1iaNYrxrkL2oNYOfwCImWAoEEcochg5Q/640?wx_fmt=png)

## 35. 举例说明异常模块中 try except else finally 的相关意义

try..except..else 没有捕获到异常，执行 else 语句。

try..except..finally 不管是否捕获到异常，都执行 finally 语句。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mb3QKIgk7CDecIWFkPyukic2mIo4bhIq59R3f4FicvMibxOWANe83TbFicaw/640?wx_fmt=jpeg)

## 36. 举例说明 zip() 函数用法

zip() 函数在运算时，会以一个或多个序列（可迭代对象）做为参数，返回一个元组的列表。同时将这些序列中并排的元素配对。

zip() 参数可以接受任何类型的序列，同时也可以有两个以上的参数; 当传入参数的长度不同时，zip 能自动以最短序列长度为准进行截取，获得元组。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbMTfKABL881rhHA4W8DBCMFf97DBHQ6u3XsXHrLcibPiaosfKGWQMZ9xQ/640?wx_fmt=jpeg)

## 37. `a="张明 98 分"`，用 `re.sub`，将 98 替换为 100

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbcBZcUZD30x88gpgdcn6hkDqibAfswG6ze7uusqNdRXZUP5Jayj8Srfg/640?wx_fmt=png)

## 38. `a="hello"`和`b="你好"` 编码成 bytes 类型

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbNicZ0SII1JbuMFOTGfEeVupoSHnSUX8GbD5fyUyaIqhXxBaWWXYH5ibA/640?wx_fmt=png)

## 39. `[1,2,3]+[4,5,6]` 的结果是多少

两个列表相加，等价于 extend。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrhUc61r6EL0LA5iawmjo4mbsPQWsXzJC8ymMa3OGyVWIzVWqo2iaKsYAFTq682PhfgdvHh1wkN8RVA/640?wx_fmt=png)

## 40. 提高 python 运行效率的方法

1、使用生成器，因为可以节约大量内存；

2、循环代码优化，避免过多重复代码的执行；

3、核心模块用 Cython PyPy 等，提高效率；

4、多进程、多线程、协程；

5、多个 if elif 条件判断，可以把最有可能先发生的条件放到前面写，这样可以减少程序判断的次数，提高效率。

## 41. 遇到 bug 如何处理

1、细节上的错误，通过 print（）打印，能执行到 print（）说明一般上面的代码没有问题，分段检测程序是否有问题，如果是 js 的话可以 alert 或 console.log

2、如果涉及一些第三方框架，会去查官方文档或者一些技术博客。

3、对于 bug 的管理与归类总结，一般测试将测试出的 bug 用 teambin 等 bug 管理工具进行记录，然后我们会一条一条进行修改，修改的过程也是理解业务逻辑和提高自己编程逻辑缜密性的方法，我也都会收藏做一些笔记记录。

4、导包问题、城市定位多音字造成的显示错误问题。

## 42. 正则匹配，匹配日期 2018-03-20

url='https://sycm.taobao.com/bda/tradinganaly/overview/get_summary.json?dateRange=2018-03-20%7C2018-03-20&dateType=recent1&device=1&token=ff25b109b&_=1521595613462'

仍有同学问正则，其实匹配并不难，提取一段特征语句，用（.\*?）匹配即可。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yReHACQUicCo2QUVhZrNzDYJ7xUTibHzFl33l1mWvrvg7CibcL7gas8qqw/640?wx_fmt=png)

## 43. list=[2,3,5,4,9,6]，从小到大排序，不许用 sort，输出 [2,3,4,5,6,9]

利用 min() 方法求出最小值，原列表删除最小值，新列表加入最小值，递归调用获取最小值的函数，反复操作。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5ypfAiaZ3Mg5IUBGzT7MZT728WsvQicJiabbaiaiaH4sKbOTslrn1Nbr8icCQg/640?wx_fmt=jpeg)

## 44. 写一个单列模式

因为创建对象时 `__new__` 方法执行，并且必须 return 返回实例化出来的对象所 `cls.__instance` 是否存在，不存在的话就创建对象，存在的话就返回该对象，来保证只有一个实例对象存在（单列），打印 ID，值一样，说明对象同一个。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5ybjEbU7XibhoTicPvibMUGGX75KTwph3sogUbDDLIcOb4qbYicvyAHIE3xA/640?wx_fmt=jpeg)

## 45. 保留两位小数

题目本身只有 a="%.03f"%1.3335, 让计算 a 的结果，为了扩充保留小数的思路，提供 round 方法（数值，保留位数）。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yjCK7xO3IM8cqCXjV3ZtHsibAYSiaLWia1lmmVZvolPoDIqAicCiajYvkS4w/640?wx_fmt=png)

## 46. 求三个方法打印结果

fn("one",1）直接将键值对传给字典。

fn("two",2) 因为字典在内存中是可变数据类型，所以指向同一个地址，传了新的额参数后，会相当于给字典增加键值对。

fn("three",3,{}) 因为传了一个新字典，所以不再是原先默认参数的字典。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yx2s0MTOnUl9cGBqFeP6q8bUxQfOGDKJV7HzlG3qHzZQcC7232djQpg/640?wx_fmt=png)

## 47. 分别从前端、后端、数据库阐述 web 项目的性能优化

该题目网上有很多方法，我不想截图网上的长串文字，看的头疼，按我自己的理解说几点。

- 前端优化

  - 减少 http 请求、例如制作精灵图；

  - html 和 CSS 放在页面上部，javascript 放在页面下面，因为 js 加载比 HTML 和 Css 加载慢，所以要优先加载 html 和 css, 以防页面显示不全，性能差，也影响用户体验差。

- 后端优化

  - 缓存存储读写次数高，变化少的数据，比如网站首页的信息、商品的信息等。应用程序读取数据时，一般是先从缓存中读取，如果读取不到或数据已失效，再访问磁盘数据库，并将数据再次写入缓存；

  - 异步方式，如果有耗时操作，可以采用异步，比如 celery；

  - 代码优化，避免循环和判断次数太多，如果多个 if else 判断，优先判断最有可能先发生的情况。

- 数据库优化

  - 如有条件，数据可以存放于 redis，读取速度快；

  - 建立索引、外键等。

## 48. 使用 pop 和 del 删除字典中的 "name" 字段，`dic={"name":"zs","age":18}`

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yaLmJ15AGEHZm6JeVy30wJKQOdqsiaMENOvLibic9nlIwMVCzkDgxia38xg/640?wx_fmt=png)

## 49、计算代码运行结果，zip 函数历史文章已经说了，得出 [("a",1),("b",2)，("c",3),("d",4),("e",5)]

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yZyiaU8ia2JPib5BVJQ7SMEuLWQw5AJEZ9mDufcNGUf0OHBpAtdHKaat1Q/640?wx_fmt=png)

dict() 创建字典新方法。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgrwQicQhISmCYV2tTW8gdJ5yUN4YNzkmDA23ATKw3ibhRRL8EicgNiaT2icW8BepHyr0WWJvu4Dp08ZLcg/640?wx_fmt=jpeg)

## 50. 简述同源策略

同源策略需要同时满足以下三点要求：

1）协议相同

2）域名相同

3）端口相同

http:www.test.com 与 https:www.test.com 不同源——协议不同

http:www.test.com 与 http:www.admin.com 不同源——域名不同

http:www.test.com 与 http:www.test.com:8081 不同源——端口不同

只要不满足其中任意一个要求，就不符合同源策略，就会出现 “跨域”。

## 51. 简述 cookie 和 session 的区别

1，session 在服务器端，cookie 在客户端（浏览器）；

2、session 的运行依赖 session id，而 session id 是存在 cookie 中的，也就是说，如果浏览器禁用了 cookie ，同时 session 也会失效，存储 Session 时，键与 Cookie 中的 sessionid 相同，值是开发人员设置的键值对信息，进行了 base64 编码，过期时间由开发人员设置；

3、cookie 安全性比 session 差。

## 52. 简述多线程、多进程

- 进程

  - 操作系统进行资源分配和调度的基本单位，多个进程之间相互独立；

  - 稳定性好，如果一个进程崩溃，不影响其他进程，但是进程消耗资源大，开启的进程数量有限制。

- 线程

  - CPU 进行资源分配和调度的基本单位，线程是进程的一部分，是比进程更小的能独立运行的基本单位，一个进程下的多个线程可以共享该进程的所有资源；

  - 如果 IO 操作密集，则可以多线程运行效率高，缺点是如果一个线程崩溃，都会造成进程的崩溃。

- 应用

  - IO 密集的用多线程，在用户输入，sleep 时候，可以切换到其他线程执行，减少等待的时间；

  - CPU 密集的用多进程，因为假如 IO 操作少，用多线程的话，因为线程共享一个全局解释器锁，当前运行的线程会霸占 GIL，其他线程没有 GIL，就不能充分利用多核 CPU 的优势。

## 53. 简述 any() 和 all() 方法

any(): 只要迭代器中有一个元素为真就为真。

all(): 迭代器中所有的判断项返回都是真，结果才为真。

python 中什么元素为假？

答案：（0，空字符串，空列表、空字典、空元组、None, False）

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNg4651bbEu4wiahLicXROqic0DbjwEKgOzsvEHGx6uD3xFicUqiaQIA2lotJA/640?wx_fmt=png)

测试 all() 和 any() 方法。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgaWgvXy2iaQfnj2ZZKogsgJgozfYUDIJvLPXDhh8opSrRk4EmIyiajTFw/640?wx_fmt=png)

## 54. IOError、AttributeError、ImportError、IndentationError、IndexError、KeyError、SyntaxError、NameError 分别代表什么异常

IOError：输入输出异常。

AttributeError：试图访问一个对象没有的属性。

ImportError：无法引入模块或包，基本是路径问题。

IndentationError：语法错误，代码没有正确的对齐。

IndexError：下标索引超出序列边界。

KeyError: 试图访问你字典里不存在的键。

SyntaxError:Python 代码逻辑语法出错，不能执行。

NameError: 使用一个还未赋予对象的变量。

## 55. python 中 copy 和 deepcopy 区别

1、复制不可变数据类型，不管 copy 还是 deepcopy, 都是同一个地址当浅复制的值是不可变对象（数值，字符串，元组）时和 =“赋值” 的情况一样，对象的 id 值与浅复制原来的值相同。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgdO5Dymku7Dgbl1nzyzOapClkLvou5FIZROy5DyPiblKBFiclNexRUsqg/640?wx_fmt=png)

2、复制的值是可变对象（列表和字典）

浅拷贝 copy 有两种情况：

第一种情况：复制的 对象中无 复杂 子对象，原来值的改变并不会影响浅复制的值，同时浅复制的值改变也并不会影响原来的值。原来值的 id 值与浅复制原来的值不同。

第二种情况：复制的对象中有 复杂 子对象 （例如列表中的一个子元素是一个列表），改变原来的值 中的复杂子对象的值，会影响浅复制的值。

深拷贝 deepcopy：完全复制独立，包括内层列表和字典。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgKeRyqtcAkB6JMQz17ackEy9cZ5UA1z4CIQqibAFlGHnfr5Prss2lKhg/640?wx_fmt=jpeg)

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgkfPjFWr2sSXBnoyJ8HEKTfDyQYic86tmicT9Vf7C0ibWiaSFC0UZPWophA/640?wx_fmt=jpeg)

## 56. 列出几种魔法方法并简要介绍用途

`__init__` : 对象初始化方法

`__new__`: 创建对象时候执行的方法，单列模式会用到

`__str__`: 当使用 print 输出对象的时候，只要自己定义了 `__str__(self)` 方法，那么就会打印从在这个方法中 return 的数据

`__del__`: 删除对象执行的方法

## 57. C:\Users\ry-wu.junya\Desktop>python 1.py 22 33 命令行启动程序并传参，print(sys.argv) 会输出什么数据

文件名和参数构成的列表。

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgRHMjPh0ETRsclZMfFezkI7EP2vqZpFFDBHeIlzGzQFT9AU5iaeHUNgA/640?wx_fmt=png)

## 58. 请将 [i for i in range(3)] 改成生成器

生成器是特殊的迭代器：

1、列表表达式的【】改为（）即可变成生成器；

2、函数在返回值得时候出现 yield 就变成生成器，而不是函数了。

中括号换成小括号即可，有没有惊呆了

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgUMnbiajM69t67Ricjgxib8DlaichhiakVJ046ch3vicickgiaCAMXAD51gFsag/640?wx_fmt=png)

## 59. `a = "hehheh"`, 去除收尾空格

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgraYDyrlbPDcibEaWuiamFKNgIibZNwrSh4EfibfzwV1g8GGCGTYXGmZTB3g8ib76c5kBe7PkDtLOaR7mA/640?wx_fmt=png)

## 60. 举例 sort 和 sorted 对列表排序，list=[0,-1,3,-10,5,9]

![alt](https://mmbiz.qpic.cn/mmbiz_png/mzj5rt1NXgouKjrojSVe7KK2Wxdt6mlgnc4zgKuK3cZeIWQ0OOoNk9nRz4fmWoMAl1L7PRzCjwhibDzQPerLLibw/640?wx_fmt=jpeg)
