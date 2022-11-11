- [`cProfile 和 pstats`](#cprofile-和-pstats)
  - [`line_profiler`](#line_profiler)
  - [`memory_profiler`](#memory_profiler)
- [参考资料](#参考资料)
- [使用记录](#使用记录)
- [模块学习](#模块学习)
- [Q & A](#q--a)
- [模块亮点](#模块亮点)
- [模块的坑](#模块的坑)
- [其他](#其他)

### `cProfile 和 pstats`

- [Python 性能分析](https://www.jianshu.com/p/a82620a9e1ef)

- [10 种检测 Python 程序运行时间、CPU 和内存占用的方法](https://www.jb51.net/article/63244.htm)

- [cProfile——Python 性能分析工具](https://www.cnblogs.com/kaituorensheng/p/4453953.html)

- [分析结果中出现\_lsProf.Profiler](http://www.voidcn.com/article/p-vjkvlrmv-bvt.html)

- `cProfile` 配合 `pstats`输出报告

  ```py
  import cProfile
  from os import path

  base_path = path.dirname(__file__)  # 当前文件所在路径
  result_path = path.join(base_path, "result_out")
  cProfile.run("LineSelectionSummary().get_detail()",
               filename=result_path,
               sort="cumulative")
  # 通过命令行
  # Python -m cProfile -o result.profile test.py

  ```

- `pstats` 分析结果

  ```py
  import pstats

  # 在当前目录下生成 result.out
  p = pstats.Stats(result_path)

  # p.strip_dirs(): 去掉无关的路径信息
  # p.sort_stats(): 排序，支持的方式和上述的一致
  # p.print_stats(): 打印分析结果，可以指定打印前几行

  # 按照函数名排序
  # print_stats(3) 只打印前 3 行的函数信息, 参数还可为小数,表示前百分之几的函数信息
  p.strip_dirs().sort_stats("name").print_stats(3)

  # 按照运行时间和函数名进行排序
  p.strip_dirs().sort_stats("cumulative", "name").print_stats(0.8)
  # 如果要输出文件完整路径，则把 strip_dirs() 去掉

  # 如果想知道有哪些函数调用了bar
  p.print_callers("bar")

  # 查看test()函数中调用了哪些函数
  p.print_callees("foo")
  ```

- `pstats` 结果解释

  需要注意的是 cProfile 很难搞清楚函数内的每一行发生了什么，是针对整个函数来说的。

  | 列名       | 含义                                                                   |
  | :--------- | :--------------------------------------------------------------------- |
  | `ncalls`   | 表示函数调用的次数；                                                   |
  | `tottime`  | 表示指定函数的总的运行时间，除掉函数中调用子函数的运行时间；           |
  | `percall`  | （第一个 percall）等于 `tottime/ncalls`                                |
  | `cumtime`  | 表示该函数及其所有子函数的调用运行的时间，即函数开始调用到返回的时间； |
  | `percall`  | （第二个 percall）即函数运行一次的平均时间，等于 `cumtime/ncalls`      |
  | `filename` | lineno(function)：每个函数调用的具体信息；                             |

- 搞个上下文管理器

  ```py
  import cProfile
  import io
  import pstats
  import contextlib

  @contextlib.contextmanager
  def profiled():
      pr = cProfile.Profile()
      pr.enable()
      yield
      pr.disable()
      s = io.StringIO()
      ps = pstats.Stats(pr, stream=s).sort_stats('cumulative')
      ps.print_stats()
      # uncomment this to see who's calling what
      # ps.print_callers()
      print(s.getvalue())

  with profiled():
      Session.query(FooClass).filter(FooClass.somevalue==8).all()
  ```

- 搞个装饰器用用

  ```py
  def run_with_analyze(api_name):
      def decorator(func):
          @functools.wraps(func)
          def wrapper(*args, **kw):
              start_time = time.time()
              tmp_file = "/tmp/%s.out" % api_name
              prof = cProfile.Profile()
              ret = prof.runcall(func, *args, **kw)
              prof.dump_stats(tmp_file)
              used_time = round(time.time() - start_time, 2)
              LOG.info("===end run %s, cost: %ss===" % (api_name, used_time))
              return ret
          return wrapper
      return decorator

  def analyze_optimize(api_name):
      # 结果分析
      file_path = "/tmp/%s.out" % api_name
      if not os.path.exists(file_path):
          return
      p = pstats.Stats(file_path)
      p.strip_dirs().sort_stats("cumtime").print_stats(10)
  ```

#### `line_profiler`

> 安装是真的难

#### `memory_profiler`

https://www.cnblogs.com/wqbin/p/10398674.html

```py
from hashlib import sha1
import sys

# 套上装饰器，设置进度和输出
@profile(percision=4, stream=open("profile.log", "w+"))
def my_func():
    sha1Obj = sha1()
    with open(sys.argv[1], 'rb') as f:
        while True:
            buf = f.read(10 * 1024 * 1024)
            if buf:
                sha1Obj.update(buf)
            else:
                break

    print(sha1Obj.hexdigest())


if __name__ == '__main__':
    my_func()


##########################################
# 只输出了个大概啊，难道我要每个调用都套上吗
##########################################


"""
$Python3 -m memory_profiler b.py [file_name]

Line #    Mem usage    Increment   Line Contents
================================================
     4   12.902 MiB   12.902 MiB   @profile
     5                             def my_func():
     6   12.906 MiB    0.004 MiB       sha1Obj = sha1()
     7   12.906 MiB    0.000 MiB       with open(sys.argv[1], 'rb') as f:
     8   12.906 MiB    0.000 MiB           while True:
     9   12.922 MiB    0.004 MiB               buf = f.read(10 * 1024 * 1024)
    10   12.922 MiB    0.000 MiB               if buf:
    11   12.922 MiB    0.012 MiB                   sha1Obj.update(buf)
    12                                         else:
    13   12.922 MiB    0.000 MiB                   break
    14
    15   12.922 MiB    0.000 MiB       print(sha1Obj.hexdigest())
"""
```

> 模块简介

### 参考资料

### 使用记录

> 模块使用记录

- 基本使用

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

### 其他

- 耗时装饰器

  ```py
  from functools import wraps
  def time_spen(func):
      @wraps(func)
      def wrapped(*args, **kwargs):
          begin = time.time()
          result = func(*args, **kwargs)
          end = time.time()
          print("@time_span:" + func.__name__ + " took " + str(end - begin) + " seconds")
          return result
      return wrapped
  ```
