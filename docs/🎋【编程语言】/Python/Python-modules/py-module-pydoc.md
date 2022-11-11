- [`pydoc`](#pydoc)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
  - [参考资料](#参考资料)

## `pydoc`

> - 自动从代码生成接口文档
> - 虽然功能不错，但是展示效果比较差，可以了解下 `sphinx`

### 使用记录

> 模块使用记录

- http 服务，通过浏览器查看所有的 `python` 库文档

  ```sh
  python3 -m pydoc -p 1212
  # 浏览器打开 localhost:1212
  ```

- 查看单个文件的文档

  ```py
  #test_file.py
  class Test():
      """
      :desc xxxx
      :param xxxx
      """
      def __init__(self):
          pass
      def get(self):
          '''
          :desc xxxx
          :param xxxx
          :return xxxx
          '''
  # 控制台查看
  python3 -m pydoc test_file   # 注意只要写文件名，不需要加后缀

  # 生成 html 查看
  python3 -m pydoc -w test_file
  ```

- 从生成的信息来看，此模块会自动忽略掉 `_` 开头的函数，下划线开头的函数在 `python` 中本来就是指不希望外部使用或知道的接口

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

### 参考资料

> 参考资料

- https://www.cnblogs.com/kaid/p/7992240.html
