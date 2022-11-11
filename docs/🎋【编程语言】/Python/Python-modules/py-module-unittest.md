- [`unittest`](#unittest)
  - [TestCase](#testcase)
  - [断言](#断言)
  - [多个模块的用例一次执行](#多个模块的用例一次执行)
  - [数据驱动测试 `data driver test (ddt)`](#数据驱动测试-data-driver-test-ddt)
  - [Q & A](#q--a)
  - [其他](#其他)

# `unittest`

[https://github.com/M-Kepler/KeplerPyUnittest](https://github.com/M-Kepler/KeplerPyUnittest)

- [官方文档](https://docs.python.org/zh-cn/3/library/unittest.html#)

- [unittest](https://www.cnblogs.com/mapu/p/8549824.html)

- [testloader](https://www.jianshu.com/p/99ab2e4ca112)

- [unittest 单元测试框架总结](https://www.cnblogs.com/yufeihlf/p/5707929.html#test2)

## TestCase

- 简单使用

  ```py
  import unittest
  class TestMath(unnittest.TestCase):
      # 在每个测试方法执行前以及执行后执行一次，setUp用来为测试准备环境，tearDown用来清理环境
      # 就像构造函数和析构函数
      '''TestCase中不允许有 __init__ 函数，否则会报错''''
      def setUp(self):
          pass
      def tearDown(self):
          pass
      def test_func_add(self):
          pass

  if __name__ == '__main__':
    # 执行用例
    unittest.main()

  # 或者通过命令运行
  # python -m unittest testCaseFile.py
  ```

- **每个用例**开始执行前都会调用一次 `setUp`，结束时调用 `tearDown`

- 在测试类里面，`setUpClass() / tearDownClass()`，必须使用 `@classmethod` 装饰器, 所有 case 运行之前只运行一次

- 测试用例类继承了 `unittest.TestCase` 所以写**init**`函数的时候也要初始化父类

  ```py
  class TestMath(unittest.TestCase):
    def __init__(self):
      super(TestMath, self).__init__(methodName='runTest')
  ```

## 断言

- 异常断言

  ```py
  from my.exceptions import MyException
  class Test(unittest.TestCase):
    def test_raise_exception(self):
      with self.assertRaises(MyException):
        api = do_something_must_raise()
        # 一定要发生异常才算用例通过，发生其他异常或不发生异常都不算通过

    def test_raise_exception2(self):
      kwargs = {
        'arg1': 'xxx',
        'arg2': 'yyy'j
      }
      # MyClass 初始化函数抛异常
      self.assertRaises(MyException, MyClass, **kwargs)
  ```

## 多个模块的用例一次执行

```py
import unittest
from path.to.testcase import TestMath

def test_TestSuite():
    """
    suite 一套的意思，可以指定测试用例的执行顺序
    """
    suite = unittest.TestSuite()

    tests = [
      TestMathFunc("test_add"), TestMathFunc("test_minus"), TestMathFunc("test_divide")
    ]
    # 按列表顺序顺序执行用例
    suite.addTests(tests)

    # verbosity参数可以控制执行结果的输出，0 是简单报告、1 是一般报告、2 是详细报告
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)
    # 直接用addTest方法添加单个TestCase

def test_TestLoader():
  """
  可以把很多测试用例一次执行
  """
  suite.addTest(TestMathFunc("test_multi"))
  # 用addTests + TestLoader
  # loadTestsFromName()，传入'模块名.TestCase名'
  suite.addTests(unittest.TestLoader().loadTestsFromName('test_mathfunc.TestMathFunc'))
  suite.addTests(unittest.TestLoader().loadTestsFromNames(['test_mathfunc.TestMathFunc']))  # loadTestsFromNames()，类似，传入列表
  # suite.addTests(unittest.TestLoader().discover('/path/to/your/test/files')) # 自动找这个路径下的py文件中test开头的函数
  # loadTestsFromTestCase()，传入TestCase
  suite.addTests(unittest.TestLoader().loadTestsFromTestCase(TestMathFunc))
```

## 数据驱动测试 `data driver test (ddt)`

写多了会发现，大部分代码都是一样的，只是入参不同而已，有没有好点的方法来解决，而不是重复地写一大堆代码

- [Python 数据驱动工具：DDT](https://www.cnblogs.com/lxs886/p/13181884.html)

## Q & A

- [踩坑](https://blog.csdn.net/qq_27261401/article/details/78312252)

  用例执行顺序不是按照函数顺序执行的

- TestCase 的 `__init__` 函数

  - [unittest 类型不能增加**init**()的问题](https://bbs.csdn.net/topics/392377857)

  ```py
  class TestAuth(unittest.TestCase):
    # Error
    def __init__(self):
      pass
  ```

## 其他

- [执行顺序](http://t.zoukankan.com/jpr-ok-p-12890199.html)
