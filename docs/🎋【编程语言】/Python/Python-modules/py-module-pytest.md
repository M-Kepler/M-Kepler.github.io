- [参考资料](#参考资料)
- [pytest](#pytest)
  - [配置](#配置)
  - [使用记录](#使用记录)
  - [插件](#插件)
    - [pytest-rerunfailures](#pytest-rerunfailures)
  - [报告](#报告)
  - [断言](#断言)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
- [allure](#allure)
  - [allure-pytest 插件](#allure-pytest-插件)

# 参考资料

[Pytest 使用手册](https://learning-pytest.readthedocs.io/zh/latest/index.html)

[Pytest 和 Allure 测试框架 - 超详细版 + 实战](https://blog.csdn.net/qq_42610167/article/details/101204066)

# pytest

- 查找测试策略

  默认情况下，pytest 会递归查找当前目录下所有以 test 开始或结尾的 Python 脚本，并执行文件内的所有以 test 开始或结束的函数和方法。

## 配置

[pytest 配置文件 pytest.ini 详解](https://blog.csdn.net/u011035397/article/details/109550202)

```ini
# 在项目根目录下创建 pytest.ini 文件
```

## 使用记录

> 模块使用记录

- [pytest-ordering 顺序执行](https://www.cxyzjd.com/article/Michaelyq1229/116651656)

  [Pytest 简介及用例执行顺序](https://blog.csdn.net/qq_33491651/article/details/124835052)

  ```py
  - 第一个执行：@pytest.mark.first
  - 第二个执行：@pytest.mark.second
  - 倒数第二个执行：@pytest.mark.second_to_last
  - 第四个执行：@pytest.mark.last
  ```

- 跨文件共享变量，网上说用 fixture，实际我用一个全局变量也可以实现

- print 输出

  pytest 不会输出 print 的信息到控制台，如果要想打印所有内容，需要运行时加上 "-s" 参数，即 pytest -s xxx.py

## 插件

### pytest-rerunfailures

## 报告

https://blog.csdn.net/zangba9624/article/details/114688271

## 断言

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方

# allure

[Allure 的安装与使用](https://blog.csdn.net/weixin_45548112/article/details/123596592)

## allure-pytest 插件
