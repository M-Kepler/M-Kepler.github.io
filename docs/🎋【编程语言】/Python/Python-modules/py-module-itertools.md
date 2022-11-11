- [`itertools`](#itertools)
  - [`product`](#product)

## `itertools`

- [这段代码很 Pythonic | 相见恨晚的 itertools 库](https://mp.weixin.qq.com/s/DIe1vug5bkuou77mXvAk8Q)

### `product`

- 笛卡尔积

  ```py
  >>> from itertools import product
  >>> list1 = range(1, 3)  # 左闭右开
  >>> list2 = range(4, 6)
  >>> list3 = range(7, 9)
  >>> for item1, item2, item3 in product(list1, list2, list3):
  ...     print(item1, item2, item3)
  ...
  1 4 7
  1 4 8
  1 5 7
  1 5 8
  2 4 7
  2 4 8
  2 5 7
  2 5 8

  >>> # 结果是和三层遍历一样
  >>> for item1 in list1:
  ...    for item2 in list2:
  ...        for item3 in list3:
  ...            print(item1 + item2 + item3)
  ...

  for item in itertools.product([1,2,3,4],[100,200]):
      print(item)
      # 返回的排列组合
      #​ product(list1,list2)依次取出list1中每1个元素,与list2中的每1个元素,组成元组,将所有元组组合成一个列表返回.
  (1, 100)
  (1, 200)
  (2, 100)
  (2, 200)
  (3, 100)
  (3, 200)
  (4, 100)
  (4, 200)
  ```
