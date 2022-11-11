- [`Pythonic`](#pythonic)

# `Pythonic`

- 万年不变的 `if...else` 太挫了，而又没有 `switch` 结构，可以通过字典来优化代码可读性

  ```py
  def show_price_list(user_choice):
    if user_choice.lower() == "single":
      print(150)
    elif user_choice.lower() == "business":
      print(300)
    elif user_choice.lower() == "couple":
      print(500)
    else:
      print("type not found")

  PRICES = {
    # 这里当然也可以是函数，反正就是一个 k-v 关系
    'single': 150,
    'business': 300,
    'couple': 500
  }
  def show_price_list_better(user_choice):
    print(PRICES.get(user_choice.lower(), "type not found"))
  ```

- 类的初始化

  ```py
  class Test(object):
    def __init__(self, arg1):
      self.arg1 = arg1
      self.result = self._do_init()
      self.ret1 = result[0]
      self.ret2 = result[1]
      self.ret3 = result[2]

    def _do_init(self):
      print('do something with %s' self.arg1)
      return [result1], [result2], [result3]

    def do_other_thimgs(self):
      print('do something with self.ret1 %s', self.ret1)

  # 存在的问题是写的太乱了
  # 代码的目的是实例化类的时候传入一些参数，然后执行一个函数做解析等初始化的工作，并且希望初始化的结果可以被其他类成员使用

  # 一般都是在__init__函数中做一下参数初始化的工作，很少去执行一个函数，但是要明白__init__是初始化函数

  class Test2(object):
    def __init__(self, arg1):
      self._do_init(self.arg1)

    def _do_init(self, arg1):
      print('do something with %s' self.arg1)
      self.ret1 = 'xxx'
      self.ret2 = 'xxx'
      self.ret3 = 'xxx'
  ```

- 如果我需要返回的是一个字典，没必要在前面堆叠一堆的定义

  ```py
  def not_Pythonic():
    ret = dict()
    ret['app_crc'] = list()
    ret['test'] = list()

    # ... do_something() 在这里操作的时候才填到ret里去
    return ret

  def Pythonic():
    return {
      'app_crc': [xxxx, xxxxx],
      'test': [yyyy, yyyy]
    }
  ```
