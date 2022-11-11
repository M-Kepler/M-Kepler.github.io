- [参考资料](#参考资料)
- [事件循环](#事件循环)
- [`asyncio`](#asyncio)
  - [演变过程](#演变过程)
  - [`asyncio.get_event_loop` 和 `async.run`](#asyncioget_event_loop-和-asyncrun)
  - [`asyncio.coroutine` 和 `asyncio.sleep`](#asynciocoroutine-和-asynciosleep)
  - [★ Task 对象 与 `asyncio.wait`、`asyncio.create_task`](#-task-对象-与-asynciowaitasynciocreate_task)
  - [`asyncio.Future` 对象](#asynciofuture-对象)
  - [`concurrent.futures.Future` 对象](#concurrentfuturesfuture-对象)
  - [`async` 和 `await`](#async-和-await)
  - [`asyncio.ensure_future`](#asyncioensure_future)
  - [`asyncio.gather` 和 `asyncio.wait`](#asynciogather-和-asynciowait)
  - [自定义异步迭代器](#自定义异步迭代器)
  - [异步上下文管理器](#异步上下文管理器)
  - [模块的坑](#模块的坑)
- [uvloop](#uvloop)
- [异步模块](#异步模块)
- [其他](#其他)

# 参考资料

- [理解 Python 协程: 从 yield/send 到 yield from 再到 async/await](https://blog.csdn.net/soonfly/article/details/78361819)

- [★ Python 协程之 asyncio](https://www.cnblogs.com/Hui4401/p/13588985.html)

- [把 Python 协程的本质扒得干干净净](https://mp.weixin.qq.com/s/yOGSwKseuN790LpCm0luYg)

- [人人都能学会的 asyncio 教程](https://mp.weixin.qq.com/s/9e3R4ZNneRHzfOLhQeYJzQ)

- [Python的可等待对象在Asyncio的作用](https://mp.weixin.qq.com/s?__biz=MzIzMzMzOTI3Nw==&mid=2247506167&idx=2&sn=1308f6a3681bac85369882ab4d4b9911&chksm=e885b815dff23103b2761da0272648114d7a5aa22a442973661b8490c6d5b6ba2edcd0472369&scene=90&subscene=93&sessionid=1652794973&clicktime=1652795028&enterid=1652795028&ascene=56&fasttmpl_type=0&fasttmpl_fullversion=6158039-zh_CN-zip&fasttmpl_flag=0&realreporttime=1652795028728#rd)

- [★ Python 高级编程之 asyncio 并发编程](https://zhuanlan.zhihu.com/p/137698989)

# 事件循环

[Python3.10 原生协程 asyncio 工业级真实协程异步消费任务调度实践](https://blog.csdn.net/zcxey2911/article/details/126232290)

> `Eventloop` 可以将一些异步方法绑定到事件循环上，事件循环会循环执行这些方法，但是和多线程一样，同时只能执行一个方法，因为协程也是单线程执行。当执行到某个方法时，如果它遇到了阻塞，事件循环会暂停它的执行去执行其他的方法，**与此同时为这个方法注册一个回调事件，当某个方法从阻塞中恢复，下次轮询到它的时候将会继续执行，亦或者，当没有轮询到它，它提前从阻塞中恢复，也可以通过回调事件进行切换**。如此往复，这就是事件循环的简单逻辑。

和事件驱动 `libuv` 一样，其实就是 `死循环`，循环去 `检测任务列表` 里的任务，执行 `可执行` 的任务，不可执行的任务（比如 IO）就继续等待

```py
任务列表 = [任务1, 任务2， 任务3]

while True:
    可执行的任务列表, 已完成的任务列表 = 【检查】任务列表，返回可执行和已完成的任务

    for 任务 in 可执行的任务列表:
        执行已就绪的任务

    for 任务 in 已完成的任务列表:
        从任务列表中移除

    if 任务列表中的任务都已完成，终止循环
```

**生成或获取一个事件循环**

```py
# python3.7+ 不需要显式创建事件循环

import asyncio

# 获取一个事件循环
event_loop = asyncio.get_event_loop()

# 把任务列表 tasks 加入到事件循环
loop.run_until_complete(asyncio.wait(tasks))

loop.close()
```

# `asyncio`

==当执行某协程遇到 IO 操作时，会自动切换执行其他任务==

- `Python3.4` 版本引入的标准库，基于事件循环的实现**异步 IO**的模块，适用于 `IO` 阻塞且需要大量并发的场景，比如爬虫、文件读写；

- 通过 `yield from` 可以将协程 `asyncio.sleep` 控制的控制权交给事件循环，然后挂起当前协程，之后由事件循环决定何时唤醒 asyncio.sleep, 接着向后执行代码，协程之间的调度都是由事件决定的，之前我们手写 `send` 就是自己玩

## 演变过程

[理解 Python 协程 - 从 yield send 到 yield from 再到 async await](https://blog.csdn.net/soonfly/article/details/78361819)

Python 中的协程大概经历了如下三个阶段：

- 最初的生成器变形 `yield`

- 引入 `@asyncio.coroutine` 和 `yield from`

- 在最近的 Python3.5 版本中引入 `async/await` 关键字

## `asyncio.get_event_loop` 和 `async.run`

`Python3.7+` 中，运行这个 `asyncio` 程序只需要一句：`asyncio.run(main())` ，而在 `Python3.6` 中，需要手动获取事件循环并加入协程任务

## `asyncio.coroutine` 和 `asyncio.sleep`

- `asyncio.coroutine` 装饰器把一个**生成器**修饰为一个协程任务

- `asyncio.sleep` 是一个 coroutine(里面也用了 `yield from`)；`yield from` 后面必须跟一个可迭代对象，不能直接用 `time.sleep(xx)`；线程不会等待 `asyncio.sleep()`，而是直接中断并执行下一个消息循环

- `yield from` 线程不会等待 `asyncio.sleep()`，**而是直接中断并执行下一个消息循环**。当 `asyncio.sleep()` 返回时，线程就可以从 `yield from` 拿到返回值（此处是 None），然后接着执行下一行语句

## ★ Task 对象 与 `asyncio.wait`、`asyncio.create_task`

创建任务对象，可以把多个任务添加进去，然后给到事件循环

```py
import asyncio

async def func():
    await asyncio.sleep(3)
    return "value"


async def main():
    # < Python3.7
    # asyncio.ensure_future(协程对象)

    # >= Python3.7
    task1 = asyncio.create_task(func())
    task2 = asyncio.create_task(func())

    ret1 = await task1
    ret2 = await task2

    print(ret1, ret2)


asyncio.run(main())
```

如果需要创建很多任务的时候，就需要不断 `create_task`，而 `asyncio.wait` 可以优雅地去等待任务列表

```py
import asyncio

async def func():
    asyncio.sleep(3)
    return "value"


async func main():
    task_list = [
        # 创建 Task 对象，并将当前的协程对象
        asyncio.create_task(func(), name="n1")
        asyncio.create_task(func(), name="n2")
    ]

    done, pending = await asyncio.wait(task_list, timeout=None)
    print(done)


# asyncio.run 会【先创建事件循环，再加入任务】
# 因为 create_task 会【立即加入事件循环】
# 也就是说不能把 create_task 和 run 放在 `__name__ == "__main__"`
# 必须用函数包起来
asyncio.run(main())

```

## `asyncio.Future` 对象

- Task 继承自 Future，Task 对象内部 await 结果的处理就是基于 Future 对象来的，一般情况下作为理解 await 等待原理，正常不会在编码中用到

- Future 对象会让进程 hung 住，等待结果

## `concurrent.futures.Future` 对象

> 记得 C++11 多线程编程等，都有这个 future，就是用来获取执行结果的

- Python 中的 concurrent 库 也有个 Future 对象；使用线程池、进程池实现异步操作时用到的对象

- 进程池 + 协程的时候，这个 Future 对象

## `async` 和 `await`

`Python3.5` 引入；`async/await` 让协程表面上独立于生成器而存在，将细节都隐藏于 `asyncio` 模块之下，语法更清晰明了。

- `async` 定义一个`协程函数`

  如果是普通函数，加括号就执行了，但是这这里是得到一个 `协程对象`，函数内部代码是不会执行的，要放入到 `事件循环` 中才执行

  ```py
  # 定义一个协程函数
  async def test():
      pass

  # 得到一个协程对象
  task1 = test()

  # 加入到事件循环中
  loop = asyncio.get_event_loop()
  loop.run_until_complete(result)
  ```

- `await` 等待 `可等待的对象`

  包括协程对象、Future 对象、Task 对象；这些对象都是 `IO 等待`，支持协程切换的对象。不然你在里面写个死循环，人家怎么让出控制权，切换协程

  await 后面的必须是可等待对象（可移交控制权的）

  ```py
  import asyncio

  async def func():
      # 其实相当于 yield 了，所以返回后，在执行下面的代码

      # 遇到 IO 操作挂起当前协程（任务）
      # 等 IO 操作完成之后再继续往下执行
      # 当前携程【挂起】时，可以去执行其他协程（任务）
      response = await asyncio.sleep(2)
      print("get1: {}".format(response))

      response = await asyncio.sleep(3)
      print("get2: {}".format(response))
  ```

## `asyncio.ensure_future`

[asyncio: Task, create_task, ensure_future 都可以创建任务，该用哪个？](https://www.cnblogs.com/andy0816/p/15591485.html)

```py
# < Python3.7
# asyncio.ensure_future(协程对象)

# >= Python3.7
task1 = asyncio.create_task(func())
```

## `asyncio.gather` 和 `asyncio.wait`

**wait 的使用**

在内部 wait() 使用一个 set 集合保存它创建的 Task 实例：（asyncio.wait 返回的是任务对象，里面存储了大部分的任务信息，包括执行状态）

- 因为 set 集合是无序的所以这也就是我们的任务不是顺序执行的原因。

- wait 的返回值是一个元组，包括两个集合，分别表示已完成和未完成的任务。

**gather 的使用**

> 如果没有 asyncio.gather 的参与，协程方法就是普通的同步方法，就算用 async 声明了异步也无济于事。而 asyncio.gather 的基础功能就是将协程任务并发执行，从而达成 “协作”。

gather 的作用和 wait 类似，但不同的是：

- gather 任务无法取消。

- 可以收集任务执行结果；返回值是一个结果列表。

- 可以按照传入参数的顺序，顺序输出。

## 自定义异步迭代器

> `__aiter__`、`__anext__`

- 异步迭代器

  `async for` 语句会处理异步迭代器的 `__anext__` 方法所返回的可等待对象，知道引发一个 `StopAsyncIteration` 异常

- 异步可迭代对象

  可在 `async for` 语句中被使用的对象，必须实现 `__aiter__` 方法，该方法返回一个 asynchronous iterator

## 异步上下文管理器

> `__aenter__`、`__aexit__`

- `async with` 语句

## 模块的坑

> 一些不注意使用容易犯错的地方

- `TypeError: object NoneType can't be used in 'await' expression？` 如果函数不是异步的，还加 `aswiat` 会报这个错

- 哪些函数可以用协程，肯定是要支持异步的，支持让出控制权的，你不能一个函数啥也不干的也想异步吧，没必要，只针对 IO 密集型

- 需要嵌套 async 吗

  ```py
  async def test():
      await return "test"


  async def test2():
      # 这里还需要 await 吗？
      data = await test()
  ```

- 如果我的一个函数里业务逻辑非常慢（CPU 密集型），那协程也无济于事了啊

# uvloop

> asyncio 事件循环的替代方案，性能高很多

# 异步模块

> 使用异步模块的时候，要知道在那个过程是阻塞的，可以让出控制权的；比如使用 aiomysql 模块操作 MySQL 时，可以预料到 MySQL 客户端向服务端发命令的过程是阻塞的（也就是说所有的命令都是阻塞的，可调度的）

# 其他

- 我的代码是用 `asyncio` 协程做异步了，但是如果我代码中有一些无法异步的情况怎么办呢？比如 `for 循环` 或 `操作 MySQL`

  - 当然啊，这是 异步 IO，如果是 IO 密集型，就有效果，你要给 `for 循环` 那是 CPU 密集型，本就是要消耗 CPU 的

  - 线程池操作 `MySQL`

- 异步和非异步模块混合案例：多线程
