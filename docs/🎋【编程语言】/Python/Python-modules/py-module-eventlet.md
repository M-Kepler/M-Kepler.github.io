- [eventlet](#eventlet)
  - [参考资料](#参考资料)
  - [`spawn(func, *args, **kwargs)`](#spawnfunc-args-kwargs)
  - [`spawn_n(func, *args, **kwargs)`](#spawn_nfunc-args-kwargs)
  - [`Greanthread Control` 写成控制函数](#greanthread-control-写成控制函数)
  - [GreenPool](#greenpool)
  - [`eventlet.sleep`](#eventletsleep)
  - [monkey_patch](#monkey_patch)
  - [TimeOut](#timeout)
  - [eventlet + sqlalchemy](#eventlet--sqlalchemy)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

# eventlet

- eventlet 是一个`用来处理和网络相关的 Python 库`，而且可以通过协程来实现并发，在 eventlet 里，把 “协程” 叫做 greenthread(绿色线程)。所谓并发，就是开启了多个 greenthread，并且对这些 greenthread 进行管理，以实现非阻塞式的 I/O

- 绿化
  eventlet 为了实现“绿色线程”，竟然对 python 的和网络相关的几个标准库函数进行了改写，并且可以以补丁（patch）的方式导入到程序中，因为 python 的库函数只支持普通的线程，而不支持协程

## 参考资料

- [线程池、进程池 (concurrent.futures 模块) 和协程](https://www.cnblogs.com/Zzbj/p/9709719.html)

- [Python 学习之 eventlet.greenpool](https://blog.csdn.net/weixin_34096182/article/details/93012514)

- [openstack基础之python的多线程并发库函数——eventlet](https://www.aboutyun.com/thread-20085-1-1.html)

- [eventlet 详解](https://www.cnblogs.com/giotto95827/p/8761055.html)

- [python 并发编程](https://blog.csdn.net/u010827484/article/details/81223035)

## `spawn(func, *args, **kwargs)`

> 创建一个绿色线程去运行函数，返回一个 `eventlet.GreenThread`对象，这个对象可以接收函数运行的返回值

- 基本使用

## `spawn_n(func, *args, **kwargs)`

> 和 `spawn` 类似，不过它没有返回值

## `Greanthread Control` 写成控制函数

## GreenPool

## `eventlet.sleep`

## monkey_patch

## TimeOut

## eventlet + sqlalchemy

https://blog.csdn.net/u012324798/article/details/103940527

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方
