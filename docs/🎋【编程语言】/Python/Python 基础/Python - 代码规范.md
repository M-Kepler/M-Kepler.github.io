- [注释规范](#注释规范)
- [编码规范](#编码规范)
  - [`exception` - 异常处理](#exception---异常处理)
  - [OOP](#oop)
  - [其他](#其他)
- [性能优化](#性能优化)

# 注释规范

`swagger`

`doxygen`

kafka-python 这个模块就做得很好，官网的说明文档就是代码注释直接导出来的，格式排版自动弄好了

```py
def test():
    """ Description of func with docstring groups style.

    Params:
        param1 - descr of param1 that has True for default value.
        param2 - descr of param2

    Returns:
        some value

    Raises:
        keyError: raises key exception
        TypeError: raises type exception
    """
    pass
```

# 编码规范

- 静态代码检查工具 `flake8 / pylint`

- 格式化工具 `yapf / autopep8`

- [Google Python 编码规范](https://zh-google-styleguide.readthedocs.io/en/latest/google-Python-styleguide/contents/)

- [pylint]https://pylint.pycqa.org/en/1.9/technical_reference/features.html)

- 在正常的赋值表达式中等号两侧都是各增加一个空格，但在`定义函数的默认值参数和使用关键字参数调用函数时`一般并不在参数赋值的等号两侧增加空格

- 函数参数太长后面的参数保持与第一个参数对齐缩进

  ```py
  def test(xxx=xxx,
           yyy=yyy,
           ccc=ccc)
  ```

- `if` 语句太长，如何缩进

  ```py
  if xxxxxxxxxx \
      and yyyyyyyy:
    return True

  if (xxxxxxxxxx
      and yyyyyyyy
      and zzzz
      or aaaa):
    return True
  ```

- 尽量不要在 `__init__` 函数做太多的操作，比如调用其他的函数，函数内抛了异常，不好排查

## `exception` - 异常处理

- 不要使用 exception:语句捕获所有异常，也不要捕获 Exception 或者 StandardError。例外：当前处理逻辑已经处于最外层或者捕获到异常之后重新触发该异常。【强制】

- 尽量减少 `try/except` 块中的代码量，`try` 块的体积越大，期望之外的异常就越容易被触发，此时 `try/except` 会隐藏真正的错误。【建议】

- 对于处理从外部读取的数据时，比如文件、数据库、标准输入、命令行参数、管道、socket、及其它任意 RPC 机制，对可能出现异常的地方增加 try/except 处理，防止程序的异常退出。【强制】

- 当抛出一个异常的时候，使用 `raise ValueError('message')` 代替旧的 `raise ValueError, 'message'` 格式。这是由于当异常的参数很长或者是格式化字符串的时候，由于括号的关系，我们不需要使用多行连接符【强制】

- 一个空的 except:语句将会捕获 SystemExit 和 KeyboardInterrrupt 异常。这会使得很难用 Control-C 来中断一个程序，并且还会隐藏其他的问题,禁止空的 except 不做任何处理。【强制】

- 自定义异常，不要使用两个参数形式（raise MyException, "Error message"）或者过时的字符串异常（raise "Error message"）【强制】

- 捕获多个异常【强制】

  ```py
  错误的写法：except Exception1, Exception2:
  正确的写法：except (Exception1, Exception2):
  ```

## OOP

- 可以使用 property。但禁止在派生类里改写 property 实现。【强制】
  由于 property 是在基类中定义的，默认绑定到基类的实现函数。若允许在派生类中改写 property 实现，则需要在基类中通过间接方式调用 property 实现函数。这个方法技巧性太强，可读性差，所以禁止使用。

## 其他

- `-*- coding:utf-8 -*-` 为了方便总是不加空格

- 尽可能使用隐式的 false, 例如: 使用 if foo: 而不是 if foo != []: . 不过还是有一些注意事项需要你铭记在心:【强制】

- 永远不要用==或者!=来比较单件, 比如 None. 使用 is 或者 is not.【强制】

- 注意: 当你写下 if x: 时, 你其实表示的是 if x is not None . 例如: 当你要测试一个默认值是 None 的变量或参数是否被设为其它值. 这个值在布尔语义下可能是 false!【强制】

- 永远不要用==将一个布尔量与 false 相比较. 使用 if not x: 代替. 如果你需要区分 false 和 None, 你应该用像 if not x and x is not None: 这样的语句.【强制】

- 对于序列(字符串, 列表, 元组), 要注意空序列是 false. 因此 if not seq: 或者 if seq: 比 if len(seq): 或 if not len(seq): 要更好.【强制】

- 处理整数时, 使用隐式 false 可能会得不偿失(即不小心将 None 当做 0 来处理). 你可以将一个已知是整型(且不是 len()的返回结果)的值与 0 比较.【强制】

  ```py
  Yes: if not users:
           print 'no users'
       if foo == 0:
           self.handle_zero()
       if i % 10 == 0:
           self.handle_multiple_of_ten()
  No:  if len(users) == 0:
           print 'no users'
       if foo is not None and not foo:
           self.handle_zero()
       if not i % 10:
           self.handle_multiple_of_ten()
  注意'0'(字符串)会被当做true.
  ```

- 在遍历列表或数组时，不允许删除列表或数组里面的元素【强制】

- random 这个模块中的大部分随机数伪随机数，不能用于安全加密,使用 os.urandom()或者 random 模块中的 SystemRandom 类来实现【强制】

  ```py
  bad = random.random()
  bad = random.randrange()
  bad = random.randint()
  bad = random.choice()
  bad = random.uniform()
  bad = random.triangular()
  good = os.urandom()
  good = random.SystemRandom()
  ```

# 性能优化

- `[]` 比 `list()` 性能更高

  ```sh
  $Python3 -m timeit 'x = list()'
  10000000 loops, best of 3: 0.0985 usec per loop

  $Python3 -m timeit 'x = []'
  10000000 loops, best of 3: 0.023 usec per loop
  ```

- 使用 `join` 来拼接字符串

  ```py
  str1 = "huang"
  str2 = "jinjie"
  str = str1 + str2

  # 为什么更推荐 join
  # 他会先统计所有元素的长度，申请内存，然后一次拷贝
  ''.join((str1, str2))
  ```

- `in` 的效率问题

  比如要遍历一个结构，看数据在不在里面，这个结构是列表和字典效率是不一样的

  - `a in list` 列表的`in`需要遍历一遍链表，复杂度 O(n)
  - `b in dict` 字段的`in`是哈希，可直接取值，复杂度 O(1)

- [`map` 和 循环那个更快?](https://www.cnblogs.com/tlz888/p/9365997.html)

- [`while 1` 还是 `while True`](https://www.jianshu.com/p/9cfa1dc99769)

  ```py
  # 对于Python2，bool 是 int 的子类，不是关键字，因此可以任意赋值
  >>> True = 11
  >>> print True
  >>> 11
  >>> print True + True
  >>> 22

  # 到了Python3，True/False 才成为关键字
  >>> True = 11
  SyntaxError: can't assign to keyword

  >>> print(True + True)
  >>> 2  # Python3 中也可以计算？默认是1？
  # 上面提到， `bool` 是 `int` 的字类，所以用 `True` 的话，每次进入 `while` 循环时，都要做类型检查，就没有用 `1` 那么快
  ```

- 直接 `return a in list_test` 就行了，没必要 `return True if a in list_test else False`

- `if x == True` 还是 `if x`

  ```py
  # == 具有传递性，a == b, b == c ==> a == c
  # 这么说的话，在1 和 -1 中非0数都认为是真，那就有 1 == True, -1 == True ==> 1 == -1
  if 6 == True:
    pass

  if 7 == True:
    pass

  if 6:
    pass

  # 论从遵循PEP的规范，还是执行效率，或者程序的简洁性来说，我们都应该使用if x:，而不是if x == True:来进行比较。同理，那些if x is not None:之类的语句也应当被简化为if x:（如果要比较的是非值，而不必须是None的话）
  ```

- [Python 中 in 和 has_key 的性能比较](https://blog.csdn.net/songbinxu/article/details/80360542)
