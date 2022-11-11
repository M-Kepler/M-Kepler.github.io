- [模块](#模块)
  - [`setup.py`](#setuppy)
  - [`pip`](#pip)
  - [`requirements.txt`](#requirementstxt)
  - [`egg-info`](#egg-info)
  - [`wheel`](#wheel)
  - [`dist-info`](#dist-info)
  - [模块路径](#模块路径)
  - [导入机制](#导入机制)
  - [不能相对路径导入](#不能相对路径导入)
  - [`import hook` 实现定制模块](#import-hook-实现定制模块)
    - [meta_path](#meta_path)
    - [customize](#customize)
  - [构建自己的包](#构建自己的包)
- [其他](#其他)

# 模块

- 如果是要发布出去的模块，建议使用相对路径，不要用包自身的名字来导入 `from package_test import class_a`

  - 只有当这个包安装在 `Python` 环境变量路径中 `PYTHONPATH` 的时候，这个模块才会正常运行

  - 只有当包名是 `package_test` 的时候，才能运行正常

  - 如果环境变量下安装了两个同名的包，有可能会导致模块导入了另一个同名模块的内容

- `PYTHONPATH`

  是导入模块时使用的环境变量。每当导入模块时，也会查找 PYTHONPATH 以检查各个目录中是否存在导入的模块。解释器使用它来确定要加载的模块。

- `[module_name].[module_ver].dist_info`

## `setup.py`

setup.cfg

setup.py 与其说是脚本，这个文件更像是一个配置文件。

```sh
python setup.py build
python setup.py install
```

```py
from setuptools import setup, find_packages
setup(
    name = "spawn-egg",
    version="0.1.0",
    #  packages：包含的 package，setuptools 自带了一个 find_packages() 工具可以自动从 name 同名的 folder 下找到 package。
    packages = find_packages(),
    description = "test how to make eggs",
    author = "Litrin J.",
    author_email = "XXX@gmail.com",
    license = "GPL",
    # keywords：关键字，便于发布到 pip 上，用于搜索。
    keywords = ("test", "python"),
    platforms = "Independant",
    url = "",
)
```

## `pip`

```sh
$python -m pip install --upgrade pip
```

- [`python 在 Windows 10 执行 pip install 时出现 UnicodeDecodeError: ‘gbk‘ codec can‘t decode`](https://blog.csdn.net/spurs611/article/details/124472286)

  在系统环境变量中增加: PYTHONUTF8 值为 1

- 版本冲突

  pip 的依赖项解析器当前未考虑安装的所有包。此行为是以下依赖项冲突的根源。

  ERROR: pip's dependency resolver does not currently take into account all the packages that are installed. This behaviour is the source of the following dependency conflicts.

- 查看第三方库的路径

  ```py
  import django
  print(django.__file__)
  '/usr/local/lib/Python3.6/site-packages/Django-2.2-py3.6-egg/django/__init__.py
  ```

- [Python 中 pip 安装、升级、升级固定的包](https://blog.csdn.net/qq_15260769/article/details/80731407)

  - `pip list --outdated` 查看所有可更新的模块

  - `pip freeze --local | grep -v '^-e' | cut -d = -f 1 | xargs -n1 pip install -U` 更新全部包

  - `pip install --upgrade [module_name]` 更新某一个模块

  - `pip install --upgrade -i https://pypi.douban.com/simple [moudle_name]` 指定更新源更新模块

  - `pip install pip-review` 安装对应的模块

  - `pip-review --local --interactive` 更新所有的模块

  - `python -m pip install --upgrade pip` 更新 pip

  - `pip install "requests==2.7"` 指定版本号 2.7

  - `pip install "requests>2.0,<3.0"` (2.0,3.0) 之间的最新版本

- [修改 pip 包安装路径](https://www.cnblogs.com/yinliang/p/12931685.html)

- 查看是否安装了某模块 `pip list | grep [package_name]`

- 指定超时时间

  ```sh
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --default-timeout=100 [module_name]
  ```

- 指定源

  ```sh
  # 临时使用
  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple [module_name] #清华的大学的镜像

  # 永久使用
  vim ~/.pip/pip.conf
  # 写入一下配置
  [global]
  index-url = https://pypi.tuna.tsinghua.edu.cn/simple12
  ```

- 指定版本的 `pip`

  ```sh
  sudo python3.8 -m pip install Jinja2
  ```

- 查看第三方库版本

  ```sh
  pip3 list | grep pytest-ordering
  ```

## `requirements.txt`

- 把当前环境所有依赖的第三方库输出到文件

  ```sh
  /usr/bin/pip freeze > requirements.txt
  ```

- [`pipreqs` 只把当前项目依赖的库导出来](https://blog.csdn.net/Waller_/article/details/106176742)

  ```sh
  # 生成依赖清单；执行的时候，还会帮你检查一下语法
  pipreqs . --encoding=utf8
  ```

- 把某个库添加进去

  ```sh
  # 直接把当前版本在用的库添加进去
  PY_LIB="tenacity"
  pip list | grep $PY_LIB | awk '{OFS="=="; print $1,$2}' >> requirements.txt
  ```

- 安装 `requirements.txt` 中的所有第三方库

  ```sh
  pip install -r requirements.txt
  ```

- 继承，比如 `requirements.txt` 是正式发布所需要的包，`dev.txt` 是开发调试中需要的包，怎么在开发过程中把两个的都安装，但是发布的时候不安装 dev 中的包呢？

  ```ini
  # dev.txt
  -r requirements.txt
  ForgeryPy==0.1
  ```

## `egg-info`

> 尽管现在有了 `wheel` 这类更为 “先进” 的包装方式，但无可否认的是 egg 包 + easy_install 方式是最为热门的 Python 扩展包安装方式

[Python 的 egg 包](https://blog.csdn.net/feng98ren/article/details/80332938)

## `wheel`

> Egg 格式是由 setuptools 在 2004 年引入，而 Wheel 格式是由 PEP427 在 2012 年定义。Wheel 的出现是为了替代 Egg，它的本质是一个 zip 包，现在被认为是 Python 的二进制包的标准格式。

- wheel 是新的 Python 的 disribution，用于替代 Python 传统的 egg 文件。

- 目前有超过一半的库文件有对应的 wheel 文件。`.whl` 文件有一点与 `.egg` 文件相似：实际上它们都是 “伪装的” `.zip` 文件。

  如果你将 `.whl` 文件名扩展改为 `.zip`，你就可以使用你的 zip 应用程序打开它，并且可以查看它包含的文件和文件夹。

  wheel 和 egg 都是二进制包

## `dist-info`

## 模块路径

**模块搜索路径**

```py
# 1. 解释器会搜索当前目录
# 2. 所有已安装的内置模块
# 3. 第三方模块

import sys
print(sys.path)
# 直接在控制台查看： python -m site
```

**添加搜索路径**

- 代码中添加

  ```py
  import sys
  sys.path.append('/path/to/your/lib')
  # 运行结束后就无效了
  ```

- 环境变量中添加 `PYTHONPATH`

  ```sh
  export PYTHONPATH = "/path/to/your/lib:$PYTHONPATH"
  ```

- 在 `site-packages` 下添加 `xxx.pth` 文件，文件内容为**库的父目录的绝对路径**；一行一个

  Python 在遍历已知的库文件目录过程中，如果见到一个 pth 文件，就会将文件中所记录的路径加入到 sys.path 设置中，于是 pth 文件所指明的库也就可以被 Python 运行环境找到了。

**`dist-packages` 和 `site-packages`**

- `dist-packages`

  这个目录其实是使用 Debian Linux 或 ubuntu Linux 安装预制 Python 会被指定的库目录

- `site-packages`

  如果是手动编译 Python 安装或安装 Windows 预制 Python,使用的是 site-packages 库目录

- 查找包安装路径

  ```py
  import pickle
  from distutils.sysconfig import get_Python_lib

  # 输出picke路径
  print(get_Python_lib(pickle))
  ```

## 导入机制

- [导入的时候我不确定有没有这个模块，怎么办](https://www.Pythonheidong.com/blog/article/51529/)

  ```py
  """
  设备上有些版本旧一点，还没有这个模块，所以直接引入会有问题；通过打桩的方式来规避
  """

  # my_lib.py
  def get_status():
      retur False

  try:
      from path.to.my.lib import mylib
      return mylib.get_status()
  except ImportError:
      return get_status()


  # 使用
  # 有mylib模块的用法
  from path.to.my.lib import mylib
  mylib.get_status()

  # 兼容之后的用法
  from path.to.my_lib import my_lib # 只要改一下导入方法就可以了
  mylib.get_status()
  ```

- 两个模块有相同的方法时怎么办，不要 `import *`，导入后用 `as xxx` 创建别名

  ```py
  from a import *
  from b import *
  test()
  # a和b中都定义了test方法
  # 最终执行的是b中的test方法，应该是覆盖了
  ```

- [导入机制](https://blog.csdn.net/u010786109/article/details/52038443)

  - 加载到内存中的模块都存放在 `sys.modules` 列表中

  - 所以可以自己写根据导入协议写一个类，然后添加到 `sys.modules` 列表中来实现导入，参考 `jsonsempai` 这个第三方库

- [循环导入问题怎么解决](https://www.cnblogs.com/Xjng/p/10672422.html)

  - 主要还是要在代码结构上划分好，区分好哪些是工具提供方，哪些是使用方，哪些是共用的

  - 或者不要在文件头导入，再用到的时候再导入，规避一下。遇到问题的时候有点奇怪，模块能正常运行，但是执行单个文件就会报循环导入

  ```py
  # a.py
  from b import ModuleB
  class ModuleA(object):
    def do_something(self):
      print('do something with function in module b')
      ModuleB().func_in_b()

    def func_in_a(self):
      print('function in module a')

  # b.py
  from a import ModuleA
  class ModuleB(object):
    def do_something(self):
      print('do something with function in module a')
      ModuleA().func_in_a()

    def func_in_b(self):
      print('function in module b')

  # python a.py  # 报错了
  '''
  Traceback (most recent call last):
  File "a.py", line 1, in <module>
    from b import ModuleB
  File "/home/m_kepler/b.py", line 1, in <module>
    from a import ModuleA
  File "/home/m_kepler/a.py", line 1, in <module>
    from b import ModuleB
  ImportError: cannot import name 'ModuleB'
  '''
  ```

- 在导入模块的时候，模块所在文件夹会自动生成一个 `__pycache__\module_name.cPython-35.pyc` 文件

  `import module_name` 的本质是将 `module_name.py` 中的**全部代码加载到内存并赋值给与模块同名的变量写在当前文件中**

  这个变量的类型是 `'module'；<module 'module_name' from 'E:\\PythonImport\\module_name.py'>`

  - 所以如果文件 A 在控制台被 `import` 进去了，然后修改了文件 A，需要再次 `import` 才会生效

  - `from module_name import name` 的本质是导入指定的变量或方法到当前文件中

  - `import package_name` 导入包的本质就是执行该包下的 `__init__.py` 文件，在执行文件后，会在 `package_name` 目录下生成一个 `__pycache__/__init__.cPython-35.pyc` 文件

  - `from package_name import class_name` 导入类，会执行类的 `__init__` 函数

- 知道了导入机制，那么代码中更精准地导入可以提高查找的效率

  ```py
  from module_name import g_value
  from module_name import class_a
  from module_name import func_a
  from module_name import * # 导入module_name模块中所有不以下划线开头的成员(以下划线开头的为私有成员)
  ```

- `import_modle`

## 不能相对路径导入

> `ValueError: Attempted relative import in non-package` 不能用相对路径导入

## `import hook` 实现定制模块

> [Python 探针实现原理](https://mozillazg.com/2016/04/apm-Python-agent-principle.html)

- [Python 导入机制 - import hook](https://blog.csdn.net/u010786109/article/details/52038443)

### meta_path

### customize

- `Python` 解释器初始化的时候会自动 `import` `PYTHONPATH` 环境变量下存在的 `sitecustomize` 和 `usercustomize` 模块

- 查看用户的 `site-packages` 目录

  ```py
  >>> import site
  >>> site.getusersitepackages()
  # '/home/m_kepler/.local/lib/Python3.6/site-packages'

  # sitecustomize 也是一样，不过这个是在全局 site-packages 目录下
  # 修改 pip 包安装路径 https://www.cnblogs.com/yinliang/p/12931685.html
  ```

- XXX 然后可以在上述目录新建 `usercustomize.py` 文件，`它会影响Python的每次启动`，除非加上 `-s` 选项启动来禁用自动导入

  第三方模块 `prety-errors` 就是这样，影响 `Python` 的启动，自动导入这个库

## 构建自己的包

- [Python 包构建教程](https://www.cnblogs.com/cposture/p/9029023.html)

- [Python 相对包导入报 “Attempted relative import in non-package” 错误](https://www.cnblogs.com/jiaxin359/p/7580375.html)

- [构建 Python 包的五个简单准则简介](https://blog.csdn.net/hijack00/article/details/53436017)

- [Python 包内的导入问题（绝对导入和相对导入）](https://www.cnblogs.com/gaowengang/p/8543840.html)

相对导入可以避免硬编码带来的包维护问题，例如我们改了某一层包的名称，那么其它模块对于其子包的所有绝对导入就不能用了，但是采用相对导入语句的模块，就会避免这个问题。

- [存在相对导入语句的模块，是不能直接运行的，报错：`ImportError: attempted relative import with no known parent package`](https://blog.csdn.net/weixin_41699811/article/details/84965328)

# 其他
