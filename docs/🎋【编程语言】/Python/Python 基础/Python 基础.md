- [Python 的背景](#python-的背景)
- [Python 的特点](#python-的特点)
- [Python 基础](#python-基础)
  - [变量与类型](#变量与类型)
  - [基础数据结构](#基础数据结构)
  - [面向对象](#面向对象)
    - [Duck typing(鸭子类型)](#duck-typing鸭子类型)
- [异常处理](#异常处理)
- [如何让代码更加 Pythonic](#如何让代码更加-pythonic)
  - [如何让代码更加 Pythonic](#如何让代码更加-pythonic-1)
    - [对某个范围内的值进行迭代](#对某个范围内的值进行迭代)
      - [更好的做法](#更好的做法)
    - [迭代一个集合](#迭代一个集合)
      - [更好的做法](#更好的做法-1)
    - [反向迭代](#反向迭代)
      - [更好的做法](#更好的做法-2)
    - [带下标地迭代一个集合](#带下标地迭代一个集合)
      - [更好的做法](#更好的做法-3)
    - [同时迭代两个集合](#同时迭代两个集合)
      - [更好的做法](#更好的做法-4)
    - [以有序地方式进行迭代](#以有序地方式进行迭代)
    - [持续地调用某个函数直到满足某个特定的值](#持续地调用某个函数直到满足某个特定的值)
      - [更好的做法](#更好的做法-5)
    - [循环中多个出口的判断](#循环中多个出口的判断)
      - [更好的做法](#更好的做法-6)
    - [对 dict 的 key 进行迭代](#对-dict-的-key-进行迭代)
    - [迭代字典的 keys 和 values](#迭代字典的-keys-和-values)
      - [更好的做法](#更好的做法-7)
    - [对 dict 进行计数](#对-dict-进行计数)
      - [更好的做法](#更好的做法-8)
    - [利用关键字参数让函数调用更清晰](#利用关键字参数让函数调用更清晰)
      - [更好的做法](#更好的做法-9)
    - [对序列进行解包](#对序列进行解包)
      - [更好的做法](#更好的做法-10)
    - [更新多个状态变量](#更新多个状态变量)
      - [更好的做法](#更好的做法-11)
    - [更新序列](#更新序列)
      - [更好的做法](#更好的做法-12)
- [一些有用的机制](#一些有用的机制)
  - [迭代器和生成器](#迭代器和生成器)
    - [迭代器协议](#迭代器协议)
    - [生成器](#生成器)
  - [装饰器](#装饰器)
  - [上下文管理器](#上下文管理器)
    - [自定义上下文管理器](#自定义上下文管理器)
- [GIL 的限制](#gil-的限制)
  - [规避 GIL 的办法](#规避-gil-的办法)
- [学习 Python 的第三方资料](#学习-python-的第三方资料)

# Python 的背景

Python 诞生于 1989 年的圣诞节期间，有着近 30 年的历史。尤其近年来已经成为最炙手可热的编程语言之一，长期处在 TIOBE 语言排行榜的前五位，越来越多的开发者也选择 Python 作为主力编程语言。许多大型网站就是用 Python 开发的，例如 YouTube、Instagram，还有国内的豆瓣。很多大公司，包括 Google、Yahoo 等，甚至 NASA（美国航空航天局）都大量地使用 Python。

# Python 的特点

Python 是一门**动态类型**的编程语言。

Python 的优点：

- 上手简单，语法接近自然语言。
- 语法优雅，写起来自然，读起来舒服。
- 库强大的库，开发效率高。

总之就是一个字，**爽**。

但同时 Python 也有自己的缺陷：

- 解释型动态语言，执行速度慢。

- 全局解释器锁(GIL, global interpreter lock)。

- `动态语言一时爽，代码重构火葬场`

Python 为什么慢？

- 作为一门动态语言，Python 的抽象层次太高，毕竟鱼与熊掌不可兼得。例如它的变量和类型是不绑定的，需要在运行时进行类型推导、类型检查等额外操作。虽然 PyPy 采用了 JIT 技术，可以直接编译成机器码，但它还不是完全支持 Python 标准，只是个实验项目，生产环境中用的不多。

Python 虽然慢，但有些时候，它并不成为瓶颈。比如一个爬虫程序，逻辑部分用 Python 来写要跑 0.1 秒，C 要跑 0.01 秒，而网络更慢，需要 2 秒，那 2.1 秒和 2.01 秒是没有本质差别的。

# Python 基础

关于语言最基础的内容，这里不再赘述，可以参考标准 API 文档和一些相关书籍。这里讲一些平时不太容易注意到的内容。

## 变量与类型

前面提到过，Python 是一门动态语言，所以在 Python 中没有显示的类型声明，变量的声明：

```python
a = 1
a = 'This is a string'
```

变量**a**它本身和类型是不绑定的，所以它可以随意地更改自己所代表的类型而不需要手动去进行类型转换，这些工作由 Python 解释器在代码执行的过程中自动完成。

## 基础数据结构

Python 中最基础的常用的内置数据结构有三种：Tuple、List、Dict。

```python
t = (1, 2, 'abc')
l = ['a', 2, 3]
d = {'name': wgc, 123: 'wgc'}
```

list 是一种有序的集合，可以随时添加和删除其中的元素。

```python
L.append(var)   #追加元素
L.insert(index,var)
L.pop(var)      #返回最后一个元素，并从list中删除之
L.remove(var)   #删除第一次出现的该元素
L.count(var)    #该元素在列表中出现的个数
L.index(var)    #该元素的位置,无则抛异常
L.extend(list)  #追加list，即合并list到L上
L.sort()        #排序
L.reverse()     #倒序
list 操作符:,+,*，关键字del
a[1:]       #片段操作符，用于子list的提取
[1,2]+[3,4] #为[1,2,3,4]。同extend()
[2]*4       #为[2,2,2,2]
del L[1]    #删除指定下标的元素
del L[1:3]  #删除指定下标范围的元素
```

而 tuple 和 list 非常相似，很多操作是共通的，但 tuple 是不可修改的，它一旦被初始化，就不能修改它内部的元素，也不能再向其中添加或删除元素。

那什么时候用 tuple 呢？

- 简单来讲，可以认为 tuple 比 list 要快，大部分情况下，对它的创建、迭代都更高效。
- 如果确保元素不会被修改，可以用 tuple，这样更安全。
- tuple 可以作为 dict 的 key，而 list 不行，因为它是 unhashable 的。

而 dict 是一个 key-value 的 hash 结构，所有不可变类型都可以做它的 key，包括字符串，数字，如果一个 tuple 里面只包含字符串数字或 tuple，也可以作为 dict 的 key。对字典最好的描述是把它当做一个无序的 k-v 集合，要求 key 是唯一的。dict 支持一些基本的增删改查操作：

```python
D.get(key, 0)       #同dict[key]，多了个没有则返回缺省值，0。[]没有则抛异常
D.has_key(key)      #有该键返回TRUE，否则FALSE
D.keys()            #返回字典键的列表
D.values()
D.items()
D.update(dict2)     #增加合并字典
D.popitem()         #得到一个pair，并从字典中删除它。已空则抛异常
D.clear()           #清空字典，同del dict
D.copy()            #拷贝字典
D.cmp(dict1,dict2)  #比较字典，(优先级为元素个数、键大小、键值大小)
                    #第一个大返回1，小返回-1，一样返回0
```

## 面向对象

面向对象最重要的概念就是`类`和`实例`，Python 中定义一个类：

```python
class Student(object):
    # 构造方法
    def __init__(self, name, score=100):
        self.name = name
        self._score = score # _score保护变量
        self.__sex = 'boy' # __sex是私有变量

    def is_boy(self):
        return self.__sex == 'boy'

wgc1 = Student('wgc')
wgc2 = Student('wgc', 59)
wgc2.is_boy() # True
```

注意到\_\_init\_\_方法的第一个参数永远是 self，表示创建的实例本身，因此，在\_\_init\_\_方法内部，就可以把各种属性绑定到 self，因为 self 就指向创建的实例本身。

如果用过 Java 的同学，应当知道，Java 中有接口，配合各种面向对象的特性（继承、多态）和设计模式来实现复杂的设计。而 Python 作为动态语言，弱化了接口和类型的概念，应当灵活使用以减少代码量和增加可读性。

### Duck typing(鸭子类型)

`If it walks like a duck and it quacks like a duck, then it must be a duck`

如果一个东西它走起来像鸭子，叫起来也像鸭子，那我们就可以把它当成鸭子

```python
class Sparrow:
    def fly(self):
        print("Sparrow flying")

class Airplane:
    def fly(self):
        print("Airplane flying")

class Whale:
    def swim(self):
        print("Whale swimming")

def lift_off(entity):
    entity.fly()

sparrow = Sparrow()
airplane = Airplane()
whale = Whale()

lift_off(sparrow) # prints `Sparrow flying`
lift_off(airplane) # prints `Airplane flying`
lift_off(whale) # Throws the error `'Whale' object has no attribute 'fly'
```

在`lisf_off`这函数中，entity 就是 duck typing，代码不需要关注它的类型，只需要关注它该怎么用。

# 异常处理

在程序运行的过程中，如果发生了错误，可以事先约定返回一个错误代码，这样，就可以知道是否有错，以及出错的原因。在操作系统提供的调用中，返回错误码非常常见。比如打开文件的函数 open()，成功时返回文件描述符（就是一个整数），出错时返回-1。

用错误码来表示是否出错十分不便，因为函数本身应该返回的正常结果和错误码混在一起，造成调用者必须用大量的代码来判断是否出错(在 C 和 Go 中，这样的错误码判断司空见惯)：

```python
def foo():
    r = some_function()
    if r==(-1):
        return (-1)
    # do something
    return r

def bar():
    r = foo()
    if r==(-1):
        print('Error')
    else:
        pass
```

一旦出错，还要一级一级上报，直到某个函数可以处理该错误（比如，给用户输出一个错误信息）。

```python
try:
    print('try...')
    r = 10 / 0
    print('result:', r)
except ZeroDivisionError as e:
    print('except:', e)
finally:
    print('finally...')

print('END')
```

需要注意的是，并非所有异常都要去捕获。只有那些你明确知道会产生哪些异常并且出现后依然想让程序继续运行下去的异常，需要捕获，否则应当让它出错或者继续上抛。

# 如何让代码更加 Pythonic

## 如何让代码更加 Pythonic

为什么有些初学者的 Python 代码写起来像 C？是因为不够**Pythonic**。

Pythonic 指的是，让 Python 代码更加 Python，让代码看起来很明显区别于其他语言的更优雅和性能高效的写法。
这里列举一些初学者容易写出的不那么 Pythonic 的代码，并给出更好写法的例子：

### 对某个范围内的值进行迭代

```python
for i in [0, 1, 2, 3, 4, 5]:
    print i**2
for i in range(6):
    print i**2
```

#### 更好的做法

```python
for i in xrange(6):
    print i**2
```

**xrange**创造了一个序列迭代器，每次只产生一个值。这种方式在内存上比**range**更加高效。

### 迭代一个集合

```python
colors = ['red', 'green', 'blue', 'yellow']
for i in range(len(colors)):
    print colors[i]
```

#### 更好的做法

```python
for color in colors:
    print color
```

### 反向迭代

```python
colors = ['red', 'green', 'blue', 'yellow']
for i in range(len(colors)-1, -1, -1):
    print colors[i]
```

#### 更好的做法

```python
for color in reversed(colors):
    print color
```

### 带下标地迭代一个集合

```python
colors = ['red', 'green', 'blue', 'yellow']
for i in range(len(colors)):
    print i, '--->', colors[i]
```

#### 更好的做法

```python
for i, color in enumerate(colors):
    print i, '--->', color
```

这是一个更优雅和高效的写法，它不需要你手动去维护另一个下标序列。任何时候，如果你发现自己在维护一个下标序列，那么很可能你把事情搞复杂了。

### 同时迭代两个集合

```python
names = ['raymond', 'rachel', 'matthew']
colors = ['red', 'green', 'blue', 'yellow']
n = min(len(names), len(colors))
for i in range(n):
    print names[i], '--->', colors[i]
for name, color in zip(names, colors):
    print name, '--->', color
```

#### 更好的做法

```python
for name, color in izip(names, colors):
    print name, '--->', color
```

**zip**会创建另一个 list，耗费更多内存，而**izip**更加高效。

### 以有序地方式进行迭代

```python
colors = ['red', 'green', 'blue', 'yellow']

# Forward sorted order
for color in sorted(colors):
    print colors

# Backwards sorted order
for color in sorted(colors, reverse=True):
    print colors
```

### 持续地调用某个函数直到满足某个特定的值

```python
blocks = []
while True:
    block = f.read(32)
    if block == '':
        break
    blocks.append(block)
```

#### 更好的做法

```python
blocks = []
for block in iter(partial(f.read, 32), ''):
    blocks.append(block)
```

**iter**接收两个参数，它会不断地调用第一个参数所代表的函数，直到他的返回值满足第二个参数。
**partial**会把一个函数和参数包装成另一个函数。

### 循环中多个出口的判断

```python
def find(seq, target):
    found = False
    for i, value in enumerate(seq):
        if value == target:
            found = True
                break

    if not found:
        return -1
    return i
```

#### 更好的做法

```python
def find(seq, target):
    for i, value in enumerate(seq):
        if value == target:
            break
    else:
        return -1

    return i
```

**for**循环也可以带有 else。

### 对 dict 的 key 进行迭代

```python
d = {'matthew': 'blue', 'rachel': 'green', 'raymond': 'red'}
for k in d:
    print k

for k in d.keys():
    if k.startswith('r'):
    del d[k]
```

keys 会返回一个新的 list，当你需要改变字典内容的时候，就要用第二种而不是第一种了。

### 迭代字典的 keys 和 values

```python
# Not very fast, has to re-hash every key and do a lookup
for k in d:
    print k, '--->', d[k]

# Makes a big huge list
for k, v in d.items():
    print k, '--->', v
```

#### 更好的做法

```python
for k, v in d.iteritems():
    print k, '--->', v
```

**iteritems()**是更好的做法，因为它返回了一个迭代器。

### 对 dict 进行计数

```python
colors = ['red', 'green', 'red', 'blue', 'green', 'red'] # Simple, basic way to count. A good start for beginners.
d = {}
for color in colors:
    if color not in d:
        d[color] = 0
    d[color] += 1

# {'blue': 1, 'green': 2, 'red': 3}
```

#### 更好的做法

```python
d = {}
for color in colors:
    d[color] = d.get(color, 0) + 1

# Slightly more modern but has several caveats, better for advanced users who understand the intricacies
d = defaultdict(int)
for color in colors:
    d[color] += 1
```

### 利用关键字参数让函数调用更清晰

```python
twitter_search('@obama', False, 20, True)
```

#### 更好的做法

```python
twitter_search('@obama', retweets=False, numtweets=20, popular=True)
```

### 对序列进行解包

```python
p = 'Raymond', 'Hettinger', 0x30, 'python@example.com'
# A common approach / habit from other languages
fname = p[0]
lname = p[1]
age = p[2]
email = p[3]
```

#### 更好的做法

```python
fname, lname, age, email = p
```

利用元组进行解包，性能更好并且可读性强

### 更新多个状态变量

```python
def fibonacci(n):
    x = 0
    y = 1
    for i in range(n):
        print x
        t = y
        y = x + y
        x = t
```

#### 更好的做法

```python
def fibonacci(n):
    x, y = 0, 1
    for i in range(n):
        print x
        x, y = y, x + y
```

第一种做法存在的问题：

- x, y 都代表状态，状态应当一次性全部更新。如果放在多行进行更新，可能会不小心导致顺序错乱或者状态的错误赋值。

### 更新序列

```python
names = ['raymond', 'rachel', 'matthew', 'roger', 'betty', 'melissa', 'judith', 'charlie']
del names[0]
# The below are signs you're using the wrong data structure
names.pop(0)
names.insert(0, 'mark')
```

#### 更好的做法

```python
names = deque(['raymond', 'rachel', 'matthew', 'roger', 'betty', 'melissa', 'judith', 'charlie'])
# More efficient with deque
del names[0]
names.popleft()
names.appendleft('mark')
```

# 一些有用的机制

## 迭代器和生成器

在 Python 这门语言中，生成器毫无疑问是最有用的特性之一。与此同时，也是使用的最不广泛的 Python 特性之一。究其原因，主要是因为，在其他主流语言里面没有生成器的概念。正是由于生成器是一个“新”的东西，所以，它一方面没有引起广大工程师的重视，另一方面，也增加了工程师的学习成本，最终导致大家错过了 Python 中如此有用的一个特性。

### 迭代器协议

- 迭代器协议是指：对象需要提供 next 方法，它要么返回迭代中的下一项，要么就引起一个 StopIteration 异常，以终止迭代。
- 可迭代对象就是：实现了迭代器协议的对象。
- 协议是一种约定，可迭代对象实现迭代器协议，Python 的内置工具(如 for 循环，sum，min，max 函数等)使用迭代器协议访问对象。

举个例子：在所有语言中，我们都可以使用 for 循环来遍历数组，Python 的 list 底层实现是一个数组，所以，我们可以使用 for 循环来遍历 list。如下所示：

```python
for n in [1, 2, 3, 4]:
    print n
```

但是，对 Python 稍微熟悉一点的朋友应该知道，Python 的 for 循环不但可以用来遍历 list，还可以用来遍历文件对象，如下所示：

```python
with open('/etc/wtf') as f: # 文件对象提供迭代器协议
    for line in f: # for循环使用迭代器协议访问文件
        print line
```

为什么在 Python 中，文件还可以使用 for 循环进行遍历呢？这是因为，在 Python 中，文件对象实现了迭代器协议，for 循环并不知道它遍历的是一个文件对象，它只管使用迭代器协议访问对象即可。正是由于 Python 的文件对象实现了迭代器协议，我们才得以使用如此方便的方式访问文件，如下所示：

```python
f = open('/etc/passwd')
dir(f)
['__class__', '__enter__', '__exit__', '__iter__', '__new__', 'writelines', '...'
```

### 生成器

Python 使用生成器对延迟操作提供了支持。所谓延迟操作，是指在需要的时候才产生结果，而不是立即产生结果。这也是生成器的主要好处。
Python 有两种不同的方式提供生成器：

- 生成器函数：常规函数定义，但是，使用 yield 语句而不是 return 语句返回结果。yield 语句一次返回一个结果，在每个结果中间，挂起函数的状态，以便下次重它离开的地方继续执行。
- 生成器表达式：类似于列表推导，但是，生成器返回按需产生结果的一个对象，而不是一次构建一个结果列表。

我们来看一个例子，使用生成器返回自然数的平方（注意返回的是多个值）：

```python
def gensquares(N):
    for i in range(N):
        yield i ** 2

for item in gensquares(5):
    print item,
```

使用普通函数：

```python
def gensquares(N):
    res = []
    for i in range(N):
        res.append(i*i)
    return res

for item in gensquares(5):
    print item,
```

- 使用列表推导，将会一次产生所有结果：

  ```py
  >>> squares = [x**2 for x in range(5)]
  >>> squares
  [0, 1, 4, 9, 16]
  ```

- 将列表推导的中括号，替换成圆括号，就是一个生成器表达式：

  ```py
  >>> squares = (x**2 for x in range(5))
  >>> squares
  <generator object at 0x00B2EC88>
  >>> next(squares)
  0
  >>> next(squares)
  1
  >>> next(squares)
  4
  >>> list(squares)
  [9, 16]
  ```

前面已经对生成器有了感性的认识，我们以生成器函数为例，再来深入探讨一下 Python 的生成器:

- 语法上和函数类似：生成器函数和常规函数几乎是一样的。它们都是使用 def 语句进行定义，差别在于，生成器使用 yield 语句返回一个值，而常规函数使用 return 语句返回一个值。
- 自动实现迭代器协议：对于生成器，Python 会自动实现迭代器协议，以便应用到迭代背景中（如 for 循环，sum 函数）。由于生成器自动实现了迭代器协议，所以，我们可以调用它的 next 方法，并且，在没有值可以返回的时候，生成器自动产生 StopIteration 异常。
- 状态挂起：生成器使用 yield 语句返回一个值。yield 语句挂起该生成器函数的状态，保留足够的信息，以便之后从它离开的地方继续执行。

- 大家可以在自己电脑上试试下面两个表达式，并且观察内存占用情况。对于前一个表达式，我在自己的电脑上进行测试，还没有看到最终结果电脑就已经卡死，对于后一个表达式，几乎没有什么内存占用。

  ```py
  sum([i for i in xrange(10000000000)])
  sum(i for i in xrange(10000000000))
  ```

## 装饰器

很多时候，我们想给函数加上一个包装层以天津额外的处理（例如，记录日志、及时统计），就可以用到 Python 里面的一个很有用的特性——装饰器。

```python
import time
from functools import wraps

def timethis(func)
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(func.__name__, end-start)
        return result
    return wrapper
```

下面来使用这个装饰器：

```python
@timethis
def countdown(n):
    while n > 0:
        n -= 1

countdown(10000) # countdown 0.0089178085327148
countdown(1000000) # countdown 0.8710829538542
```

可以看到，实际上，装饰器就是一个函数，它可以接受一个函数作为输入并返回一个新的函数作为输出，当你这样编写代码时：

```python
@timethis
def countdown(n):
    xxx
```

和单独执行下面的步骤效果是一样的：

```python
def countdown(n):
    xxx

countdown = timethis(countdown)
```

详细来讲，装饰器内部的代码一般会涉及创建一个新的函数，利用*args 和\*\*kwargs 来接受任意的参数。需要强调的是，装饰器一般来说不会修改函数签名，也不会修改被包装函数返回的结果。这里对*args 和\**kwargs 的使用时为了确保可以接受任何形式的输入参数。装饰器的返回值一般是要和直接调用 func(*args, \*\*kwargs)是一样的。

## 上下文管理器

在使用 Python 编程中，可以会经常碰到这种情况：有一个特殊的语句块，在执行这个语句块之前需要先执行一些准备动作；当语句块执行完成后，需要继续执行一些收尾动作。

例如：当需要操作文件或数据库的时候，首先需要获取文件句柄或者数据库连接对象，当执行完相应的操作后，需要执行释放文件句柄或者关闭数据库连接的动作。

又如，当多线程程序需要访问临界资源的时候，线程首先需要获取互斥锁，当执行完成并准备退出临界区的时候，需要释放互斥锁。

对于这些情况，Python 中提供了上下文管理器（Context Manager）的概念，可以通过上下文管理器来定义/控制代码块执行前的准备动作，以及执行后的收尾动作。

在 Python 中，可以通过 with 语句来方便的使用上下文管理器，with 语句可以在代码块运行前进入一个运行时上下文（执行**enter**方法），并在代码块结束后退出该上下文（执行**exit**方法）。

with 语句的语法如下：

```python
with context_expr [as var]:
    with_suite
```

- context_expr 是支持上下文管理协议的对象，也就是上下文管理器对象，负责维护上下文环境。
- as var 是一个可选部分，通过变量方式保存上下文管理器对象。
- with_suite 就是需要放在上下文环境中执行的语句块。

### 自定义上下文管理器

对于自定义的类型，可以通过实现\_\_enter\_\_和\_\_exit\_\_方法来实现上下文管理器。

```python
import time

class MyTimer(object):
    def __init__(self, verbose = False):
        self.verbose = verbose

    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *unused):
        self.end = time.time()
        self.secs = self.end - self.start
        self.msecs = self.secs * 1000
        if self.verbose:
            print "elapsed time: %f ms" %self.msecs
```

```python
def fib(n):
    if n in [1, 2]:
        return 1
    else:
        return fib(n-1) + fib(n-2)

with MyTimer(True):
    print fib(30)
```

- 代码的输出结果为：

  ```py
  832040
  elapsed time : 317.000151 ms
  ```

# GIL 的限制

首先需要明确的一点是 GIL 并不是 Python 的特性，它是在实现 Python 解析器(CPython)时所引入的一个概念，有的解释器（比如 JPython）就没有 GIL 的限制。

至于为什么会有 GIL 的存在，官方给出的解释是，CPython 的内存管理并不是线程安全的（其实是线程安全会严重拖慢 CPython 的性能）。
而 GIL 带来的最严重的后果就是，CPython 的多线程代码永远无法利用多核 CPU 带来的优势，不过这还不是最糟糕（搞笑）的，如果你的多线程使用有问题的时候，GIL 的存在会让你的性能还不如单线程。

按照 Python 社区的想法，操作系统本身的线程调度已经非常成熟稳定了，没有必要自己搞一套。所以 Python 的线程就是 C 语言的一个 pthread，并通过操作系统调度算法进行调度（例如 linux 是 CFS）。为了让各个线程能够平均利用 CPU 时间，python 会计算当前已执行的微代码数量，达到一定阈值后就强制释放 GIL。而这时也会触发一次操作系统的线程调度（当然是否真正进行上下文切换由操作系统自主决定）。

```python
while True:
    acquire GIL
    for i in 1000:
        do something
    release GIL
    # Give Operating System a chance to do thread scheduling
```

这种模式在只有一个 CPU 核心的情况下毫无问题。任何一个线程被唤起时都能成功获得到 GIL（因为只有释放了 GIL 才会引发线程调度）。但当 CPU 有多个核心的时候，问题就来了。从伪代码可以看到，从`release GIL`到`acquire GIL`之间几乎是没有间隙的。所以当其他在其他核心上的线程被唤醒时，大部分情况下主线程已经又再一次获取到 GIL 了。这个时候被唤醒执行的线程只能白白的浪费 CPU 时间，看着另一个线程拿着 GIL 欢快的执行着。然后达到切换时间后进入待调度状态，再被唤醒，再等待，以此往复恶性循环。

简单的总结下就是：Python 的多线程在多核 CPU 上，只对于 IO 密集型计算产生正面效果；而当有至少有一个 CPU 密集型线程存在，那么多线程效率会由于 GIL 而大幅下降。

## 规避 GIL 的办法

- 用 multiprocessing 替代 Thread。multiprocessing 库的出现很大程度上是为了弥补 thread 库因为 GIL 而低效的缺陷。它完整的复制了一套 thread 所提供的接口方便迁移。唯一的不同就是它使用了多进程而不是多线程。每个进程有自己的独立的 GIL，因此也不会出现进程之间的 GIL 争抢。但是进程间同步显然要比线程间同步困难的多。
- 将计算密集型任务转移到 C 语言中，使其独立于 Python，然后在 C 代码中通过插入特殊的宏来（`Py_BEGIN_ALLOW_THREADS`和`Py_END_ALLOW_THREADS`）释放 GIL。

# 学习 Python 的第三方资料

- 《廖雪峰的 Python 教程》：最基础的 Python 入门教程，帮助你打开 Python 的大门。
- 《Python Cookbook》: 书里列举了很多 Python 在实际应用中的例子，例如常见的数据结构和算法的实现，字符串处理，元编程，迭代器和生成器的使用，并发编程等等，这些能帮助大家更快更好地掌握 Python。
- requests：Python HTTP 库，它的代码简单，优雅，功能强大的同时，API 设计的非常合理。
