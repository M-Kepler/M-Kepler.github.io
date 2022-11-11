- [生成器变形 yield/send](#生成器变形-yieldsend)
- [yield from](#yield-from)
- [asyncio.coroutine 和 yield from](#asynciocoroutine-和-yield-from)
- [async 和 await](#async-和-await)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/soonfly/article/details/78361819)

Python 中的协程大概经历了如下三个阶段：

1. 最初的生成器变形 yield

2. 引入 `@asyncio.coroutine` 和 `yield from`

3. 在最近的 Python3.5 版本中引入 `async/await` 关键字

# 生成器变形 yield/send

普通函数中如果出现了 yield 关键字，那么该函数就不再是普通函数，而是一个生成器。

```py
def mygen(alist):
    while len(alist) > 0:
        c = randint(0, len(alist)-1)
        yield alist.pop(c)
a = ["aa","bb","cc"]
c=mygen(a)
print(c)

输出：<generator object mygen at 0x02E5BF00>
```

像上面代码中的 c 就是一个生成器。生成器就是一种迭代器，可以使用 for 进行迭代。生成器函数最大的特点是可以接受外部传入的一个变量，并根据变量内容计算结果后返回。  
这一切都是靠生成器内部的 send() 函数实现的。

```py
def gen():
    value=0
    while True:
        receive=yield value
        if receive=='e':
            break
        value = 'got: %s' % receive

g=gen()
print(g.send(None))
print(g.send('hello'))
print(g.send(123456))
print(g.send('e'))
```

上面生成器函数中最关键也是最易理解错的，就是 `receive=yield value` 这句, 如果对循环体的执行步骤理解错误，就会失之毫厘，差之千里。

- 其实 `receive=yield value` 包含了 3 个步骤：

  - 向函数外抛出（返回）value

  - 暂停 (pause)，等待 next() 或 send()恢复

  - 赋值 `receive=MockGetValue()`

  这个 MockGetValue() 是假想函数，用来接收 send() 发送进来的值

- 执行流程

  - 通过 `g.send(None)` 或者 `next(g)` 启动生成器函数，并执行到第一个 yield 语句结束的位置

    这里是关键，很多人就是在这里搞糊涂的。运行`receive=yield value`语句时，我们按照开始说的拆开来看，实际程序只执行了 1，2 两步，程序返回了 value 值，并暂停 (pause)，并没有执行第 3 步给 receive 赋值。因此 yield value 会输出初始值 0。**这里要特别注意：在启动生成器函数时只能 send(None), 如果试图输入其它的值都会得到错误提示信息。**

  - 通过`g.send('hello')`，会传入 hello，从上次暂停的位置继续执行，那么就是运行第 3 步，赋值给 receive。然后计算出 value 的值，并回到 while 头部，遇到 `yield value`，程序再次执行了 1，2 两步，程序返回了 value 值，并暂停 (pause)。此时 `yield value` 会输出”got: hello”，并等待 send() 激活。

  - 通过 `g.send(123456)`，会重复第 2 步，最后输出结果为”got: 123456″。

  - 当我们 `g.send('e')` 时，程序会执行 break 然后推出循环，最后整个函数执行完毕，所以会得到 StopIteration 异常。

从上面可以看出， 在第一次 `send(None)` 启动生成器（执行 1–>2，通常第一次返回的值没有什么用）之后，对于外部的每一次 `send()`，生成器的实际在循环中的运行顺序是 3–>1–>2，也就是先获取值，然后 dosomething，然后返回一个值，再暂停等待。

# yield from

看一段代码：

```py
def g1():
    yield  range(5)
def g2():
    yield  from range(5)

it1 = g1()
it2 = g2()
for x in it1:
    print(x)

for x in it2:
    print(x)

输出：
range(0, 5)
0
1
2
3
4
```

这说明 `yield` 就是将 `range` 这个可迭代对象直接返回了。而 `yield from` 解析了 `range` 对象，将其中每一个 item 返回了。

`yield from iterable`本质上等于`for item in iterable: yield item`的缩写版

来看一下例子，假设我们已经编写好一个斐波那契数列函数

```py
def fab(max):
     n,a,b = 0,0,1
     while n < max:
          yield b
          # print b
          a, b = b, a + b
          n = n + 1
f=fab(5)
```

`fab` 不是一个普通函数，而是一个生成器。因此 `fab(5)` 并没有执行函数，而是返回一个生成器对象 (生成器一定是迭代器 `iterator`，迭代器一定是可迭代对象 `iterable`)

现在我们来看一下，假设要在 `fab()` 的基础上实现一个函数，调用起始都要记录日志

```py
def f_wrapper(fun_iterable):
    print('start')
    for item  in fun_iterable:
        yield item
     print('end')
wrap = f_wrapper(fab(5))
for i in wrap:
    print(i,end=' ')
```

现在使用 `yield from` 代替 `for` 循环

```py
import logging

def f_wrapper2(fun_iterable):
    print('start')
    yield from fun_iterable  #注意此处必须是一个可生成对象
    print('end')
wrap = f_wrapper2(fab(5))
for i in wrap:
    print(i,end=' ')
```

再强调一遍：`yield from` 后面必须跟 `iterable` 对象 (可以是生成器，迭代器)

# asyncio.coroutine 和 yield from

`yield from` 在 asyncio 模块中得以发扬光大。之前都是我们手工切换协程，现在当声明函数为协程后，我们通过事件循环来调度协程。

先看示例代码：

```py
import asyncio,random

@asyncio.coroutine
def smart_fib(n):
    index = 0
    a = 0
    b = 1
    while index < n:
        sleep_secs = random.uniform(0, 0.2)
        yield from asyncio.sleep(sleep_secs) #通常yield from后都是接的耗时操作
        print('Smart one think {} secs to get {}'.format(sleep_secs, b))
        a, b = b, a + b
        index += 1

@asyncio.coroutine
def stupid_fib(n):
    index = 0
    a = 0
    b = 1
    while index < n:
        sleep_secs = random.uniform(0, 0.4)
        yield from asyncio.sleep(sleep_secs) #通常yield from后都是接的耗时操作
        print('Stupid one think {} secs to get {}'.format(sleep_secs, b))
        a, b = b, a + b
        index += 1

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    tasks = [
        smart_fib(10),
        stupid_fib(10),
    ]
    loop.run_until_complete(asyncio.wait(tasks))
    print('All fib finished.')
    loop.close()
```

`yield from` 语法可以让我们方便地调用另一个 generator。

本例中 `yield from` 后面接的 `asyncio.sleep()` 是一个 `coroutine`(里面也用了 `yield from`)，所以线程不会等待 `asyncio.sleep()`，而是直接中断并执行下一个消息循环。当 `asyncio.sleep()` 返回时，线程就可以从 `yield from` 拿到返回值（此处是 None），然后接着执行下一行语句。

`asyncio` 是一个基于事件循环的实现异步 I/O 的模块。通过 `yield from`，我们可以将协程 `asyncio.sleep` 的控制权交给事件循环，然后挂起当前协程；之后，由事件循环决定何时唤醒 `asyncio.sleep`, 接着向后执行代码。

协程之间的调度都是由事件循环决定。

`yield from asyncio.sleep(sleep_secs)` 这里不能用`time.sleep(1)`因为 `time.sleep()` 返回的是 None，它不是 `iterable`，还记得前面说的 `yield from` 后面必须跟 `iterable` 对象 (可以是生成器，迭代器)。  
所以会报错：

```
> yield from time.sleep(sleep_secs)
> TypeError: ‘NoneType’ object is not iterable
```

# async 和 await

弄清楚了 `asyncio.coroutine` 和 `yield from` 之后，在 Python3.5 中引入的 `async` 和 `await` 就不难理解了；

可以将他们理解成 `asyncio.coroutine / yield from` 的完美替身。当然，从 Python 设计的角度来说，`async / await` 让协程表面上独立于生成器而存在，将细节都隐藏于 `asyncio` 模块之下，语法更清晰明了。

加入新的关键字 `async` ，可以将任何一个普通函数变成协程

```py
import time,asyncio,random

async def mygen(alist):
    while len(alist) > 0:
        c = randint(0, len(alist)-1)
        print(alist.pop(c))
a = ["aa","bb","cc"]
c=mygen(a)
print(c)

# 输出：
<coroutine object mygen at 0x02C6BED0>
```

在上面程序中，我们在前面加上 `async`，该函数就变成一个协程了。

但是 `async` 对生成器是无效的。`async` 无法将一个生成器转换成协程。还是刚才那段代码，我们把 `print` 改成 `yield`

```py
async def mygen(alist):
    while len(alist) > 0:
        c = randint(0, len(alist)-1)
        yield alist.pop(c)
a = ["ss","dd","gg"]
c=mygen(a)
print(c)

```

可以看到输出

```
<async_generator object mygen at 0x02AA7170>
```

并不是 `coroutine` 协程对象 所以我们的协程代码应该是这样的

```py
import time,asyncio,random
async def mygen(alist):
    while len(alist) > 0:
        c = random.randint(0, len(alist)-1)
        print(alist.pop(c))
        await asyncio.sleep(1)
strlist = ["ss","dd","gg"]
intlist=[1,2,5,6]
c1=mygen(strlist)
c2=mygen(intlist)
print(c1)
```

要运行协程，要用事件循环；在上面的代码下面加上：

```py
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    tasks = [
        c1,
        c2
    ]
    loop.run_until_complete(asyncio.wait(tasks))
    print('All fib finished.')
    loop.close()
```

就可以看到交替执行的效果。

本文参考

[http://python.jobbole.com/81911/](http://python.jobbole.com/81911/)

[http://python.jobbole.com/86069/](http://python.jobbole.com/86069/)
