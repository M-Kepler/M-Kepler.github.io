- [coverage](#coverage)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
    - [命令行](#命令行)
    - [API](#api)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## coverage

> 模块简介

### 参考资料

- [聊聊 Python 代码覆盖率工具 - Coverage](https://www.jianshu.com/p/17521a50eeb5)

### 使用记录

> 模块使用记录

#### 命令行

- 基本使用

  ```sh
  pip install coverage
  coverage run test.py  # 生成覆盖率报告
  coverage report  # 终端查看结果
  coverage html -d covhtml  # 生成html报告，指定名称为covhtml
  ```

#### API

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

- `coverage run xx.py` 单测用例跑完后报错 `Coverage.py warning: No data was collected. (no-data-collected)`

  ```sh
  # 需要指定项目目录
  cd /usr/lib/python2.7/site-packages/bbc/dc_tools/dc_orm/test/

  # 指定项目目录下
  vi .coveragerc

  [run]
  include = /usr/lib/python2.7/site-packages/bbc/dc_tools/dc_orm/*

  # 执行覆盖率测试
  coverage run xx.py
  ```

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方
