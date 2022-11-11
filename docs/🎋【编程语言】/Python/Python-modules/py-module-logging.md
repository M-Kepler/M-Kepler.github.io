- [`logging`](#logging)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
  - [多进程环境下](#多进程环境下)
  - [syslog](#syslog)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
  - [参考](#参考)

## `logging`

### 参考资料

[python logging 日志模块以及多进程日志](https://www.cnblogs.com/taosiyu/p/12911699.html)

### 使用记录

> 模块使用记录

- 简单使用

  ```py
  import logging
  logger = logging.getLogger("log_name")
  ```

- 日志回滚

  当日志`大小`达到某个值之后，创建新的日志文件

  ```py
  log_handler = RotatingFileHandler(
      log_file_name,
      mode='a',
      maxBytes=10 * 1024 * 1024,
      backupCount=2,
      encoding=None,
      delay=0
  )
  ```

### 多进程环境下

### syslog

https://blog.csdn.net/weixin_34873798/article/details/116547583

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

### 参考

> 参考资料
