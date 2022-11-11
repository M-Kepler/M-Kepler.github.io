- [参考资料](#参考资料)
- [pyzmq](#pyzmq)
  - [Device](#device)
  - [Monitor Queue](#monitor-queue)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
- [其他](#其他)

# 参考资料

[官方文档](https://pyzmq.readthedocs.io/en/latest/index.html)

# pyzmq

> 模块简介

## Device

- [`zmq.device` 已经用 `zmq.proxy` 替代了](https://ask.csdn.net/questions/5022639)

## Monitor Queue

- [pyzmq 的 Monitor Queue](https://blog.csdn.net/peijie73/article/details/84753977)

- 试了一下，如果用 `ipc://`，监视器会无法监控到数据，要用 `tcp://` 才行

## 模块学习

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方

- 各个版本用法差异太大了

# 其他
