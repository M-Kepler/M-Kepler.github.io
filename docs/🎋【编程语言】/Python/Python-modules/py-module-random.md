- [`random`](#random)
  - [参考](#参考)
  - [使用记录](#使用记录)
  - [与 `os.urandom`的区别](#与-osurandom的区别)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

# `random`

> 模块简介

## 参考

- [Python3 中 random 模块](https://www.cnblogs.com/liangmingshen/p/8909376.html)

## 使用记录

> 模块使用记录

- 打乱列表顺序

  ```py
  l = range(30)
  random.shuffle(l)
  ```

- 从列表中随机取值

  ```py
  # 随机生一个整数int类型，可以指定这个整数的范围，同样有上限和下限值
  random.randint(1, 10)

  # 可以从任何序列，比如list列表中，选取一个随机的元素返回，可以用于字符串、列表、元组等
  random.choice([1, 2, 3, 4, 5])

  # 可以从指定的序列中，随机的截取指定长度的片断，不作原地修改
  random.sample()
  ```

## 与 `os.urandom`的区别

- 随即产生 `n` 个字节的字符串，可以作为随机加密 key 使用~

- `random` 这个模块中的大部分随机数伪随机数，不能用于安全加密,使用 `os.urandom()` 或者 `random` 模块中的 `SystemRandom` 类来实现【强制】

  ```py
  bad = random.random()

  # 选择一个整数并定义 [a，b] 之间的范围。它通过从指定范围中随机选择元素来返回元素。它不构建范围对象。
  bad = random.randrange()

  bad = random.randint()

  bad = random.choice()

  # 选择一个在 [a，b) 范围内定义的浮点数
  bad = random.uniform()

  bad = random.triangular()

  good = os.urandom()

  good = random.SystemRandom()
  ```

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方
