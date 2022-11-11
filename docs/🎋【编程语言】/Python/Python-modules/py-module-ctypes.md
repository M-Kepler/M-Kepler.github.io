- [`ctypes`](#ctypes)
  - [模块学习](#模块学习)
  - [使用记录](#使用记录)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
  - [参考资料](#参考资料)

## `ctypes`

> 模块简介

记载动态链接库（linux 下的 so 库，windows 下的 dll 库）

- [调试 Python 调用的 C++ 共享库](https://www.cnblogs.com/yemanxiaozu/p/8269638.html)

### 模块学习

### 使用记录

> 模块使用记录

- 基本使用

  ```py
  import ctype
  # 加载动态链接库
  _libclient_so = ctype.CDLL("/path/to/so/file")

  _libclient_init = _get_so_func(_libclient_so, 'client_init_py', argtypes=(ctypes.c_int,), ret_types=ctypes.c_void_p)

  _libclient_send_cmd_reply = _get_so_func(xxxx)
  _libclient_destroy = _get_so_func(xxxxx)
  _libclient_free_ret = _get_so_func(xxxx)

  class ClientPy(object):
      def __init__(self, client_arg):
          self.client_arg = client_arg
          self.client = None

      def __enter__(self):
        self._client_init()
        return False

      def _client_init(self):
          self.client = _libclient_init(self.client_arg)
          if not self.client:
              raise Exception('init fail')

      def __exit__(self):
          self._libclient_destroy()
          return False

      def _client_destroy(self):
          _libclient_destroy(self.client)

      def _client_free_ret(client_ret):
          _libclient_free_ret(client_ret)

      def client_send_cmd_reply(self, cmd):
          ret = _libclient_send_cmd_reply(self.client, cmd)
          if not ret:
              raise Exception('send cmd fail')
          # 类型转换
          ret_str = ctypes.string_at(ret.contents.ret_data,
                                     ret.contents.len)
          self._client_free_ret(ret)
          return ret_str.strip()
  ```

- 使用 `so` 中的函数

  ```py
  def _get_so_func(so, func, arg_types=None, ret_types = None):
      func = getattr(so, func)
      if arg_types is not None:
        func.arg_types = arg_types
      if ret_type is not None:
        func.ret_types = ret_types
  _client_sum = _get_so_func(_lib_client_so,
                             'client_sum',
                             arg_types=(ctypes.c_int,),
                             ret_types=ctypes.c_void_p)
  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

### 参考资料

> 参考资料
