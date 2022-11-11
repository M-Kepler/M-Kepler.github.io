- [`configparser`](#configparser)
  - [参考](#参考)
  - [模块学习](#模块学习)
  - [使用记录](#使用记录)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `configparser`

> - ini 配置操作模块
> - `configparser`: 在 `python3` 中的包名
> - `ConfigParser`: 在 `python2` 中的包名

### 参考

> 参考资料

- https://www.cnblogs.com/shellshell/p/6947049.html

### 模块学习

- [Python 操作配置文件 configparser 模块](https://www.cnblogs.com/zhuzhaoli/p/10645922.html)

- [Python 之 ConfigParser 模块](https://www.cnblogs.com/ming5218/p/7965973.html)

### 使用记录

> 模块使用记录

- 把 `ini` 文件读入成 `json` 格式

  ```ini
  # test.ini
  [global]
  key1=value1
  key2=value2
  ```

  ```py
  from configparser import ConfigParser

  cfg = ConfigParser.ConfigParser()
  cfg.read("./test.ini")
  global_config = {
      key: value
      for key, value in cfg.items("global")
  }
  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

- 读写配置时，配置选项会变成小写

  ```py
  import configparser
  path_of_cfg = "./config.ini"
  conf = configparser.ConfigParser()
  conf.add_section("test_section")
  conf.set('test_section', '/aaA/ADF/dfa/ad/ASDF', "/asdf/adf/DFASD/asd")
  with open(path_of_cfg, "w") as fd:
      conf.write(fd)

  # 写入后
  '''
  # cat config.ini
  [test_section]
  # key 变成小写了
  /aaa/adf/dfa/ad/asdf = /asdf/adf/DFASD/asd
  '''


  # 修改方法 https://www.cnblogs.com/workingdiary/p/6855726.html
  '''
  # cat a.ini
  [global]
  /Asaf/efwsf/Ead = /adf/asd/ADF
  '''

  import ConfigParser
  class IgnoreCaseCfg(ConfigParser.ConfigParser):
      def __init__(self, defaults=None):
          ConfigParser.ConfigParser.__init__(self, defaults=defaults)

      # 这里重写了optionxform方法，直接返回选项名
      def optionxform(self, optionstr):
          return optionstr

  # 使用：

  # 获取test.cfg
  conf = IgnoreCaseCfg()
  conf.read("/path/to/config")
  conf.items("global")
  ```

- `windows` 下读入配置文件时报错：`UnicodeDecodeError: 'gbk' codec can't decode byte 0x80 in position 205: illegal multibyte sequence`

  ```py
  FILE_OBJECT= open('order.log','r', encoding='UTF-8')
  import configparser
  conf = configparser.ConfigParser
  conf.read("config.ini", encoding="utf-8")
  ```

- 该模块会把所有配置读入内存，如果该文件很大的话，会导致占用过多内存

  - 场景  
    读入配置文件只为了获取配置中某个标记(如 `dev_type` 为 0 的配置，而其他非 0 的配置（占大多数）是没有用到的

  - 方案  
    修改源码，专为该服务使用（以免其他不需要特殊处理的代码出现问题），遍历 `section` 时对标记进行判断，只有标记为特定的值的时候才读入
