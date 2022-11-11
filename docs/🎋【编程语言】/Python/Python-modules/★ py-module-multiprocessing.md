- [参考资料](#参考资料)
- [`multiprocessing`](#multiprocessing)
  - [使用记录](#使用记录)
  - [进程池](#进程池)
  - [`subprocess` 子进程](#subprocess-子进程)
  - [获取子进程执行结果](#获取子进程执行结果)
  - [进程间通信](#进程间通信)
    - [管道](#管道)
    - [消息队列](#消息队列)
  - [apply 与 apply_async](#apply-与-apply_async)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

# 参考资料

- [使用 `subprocess.Popen` 可能导致僵尸进程](https://blog.csdn.net/whatday/article/details/109315568)

- [Python subprocess.Popen communicate() 和 wait() 使用上的区别](https://www.cnblogs.com/sueris/p/6235861.html)

# `multiprocessing`

> `multiprocessing` 模块就是跨平台版本的多进程模块

- [Python 中的进程、线程、协程、同步、异步、回调](https://segmentfault.com/a/1190000001813992)

- `os` 模块封装了大部分的系统调用，直接用 `os` 模块也可以写多进程程序

  ```py{cmd=true}
  import os
  print('Process %s start ...' % os.getpid())
  # fork 仅在linux系统中可用
  pid = os.fork()
  if pid == 0:
      print("get child process: %s and main process id is:%s" % (os.getpid(), os.getppid()) )
  else:
      print("main process id: %s, his child process is :%s" % (os.getpid(), pid))
  ```

## 使用记录

> 模块使用记录

```py{cmd=true}
import os
from multiprocessing import Process

def run_proc(name):
    print('Run child process %s (%s)...' % (name, os.getpid()))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    # 创建 Process 实例
    p = Process(target=run_proc, args=('test',))
    # 或者这样 p = Process(target=run_proc, kwargs={'test': 1, "test2": 2})
    print('Child process will start.')
    # 用 start() 方法启动
    p.start()
    # 等待子进程结束
    p.join()
    print('Child process end.')
```

## 进程池

```py{cmd=true}
from multiprocessing import Pool
import os
import time
import random

def do_something(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s run %0.2f seconds.' % (name, end - start))

if __name__ == '__main__':
    print('Parent process %s.' % os.getpid())
    # Pool的默认大小是CPU的核数
    p = Pool(4)
    for i in range(5):
        p.apply_async(do_something, args=(i,))
    print('Waiting for all subprocess done...')
    # 调用close之后就不能继续添加进程到进程池了
    p.close()
    p.join()
    print('All subprocess done.')
```

- 骚操作

  ```py
  from multiprocessing import Pool
  import os
  import time
  import random
  import unittest

  class MyTest(unittest.TestCase)
    def test_multi_mission():
      missions = range(100)
      # 把多进程任务熬在一个函数内部，比如 unittest 的测试用例
      def do_something(name):
          print('Run task %s (%s)...' % (name, os.getpid()))
          start = time.time()
          time.sleep(random.random() * 3)
          end = time.time()
          print('Task %s run %0.2f seconds.' % (name, end - start))

      print('Parent process %s.' % os.getpid())
      p = Pool(4)
      for i in range(5):
          p.apply_async(do_something, args=(i,))
      print('Waiting for all subprocess done...')
      # FIXME 这样的话，直接就运行过去了，没跑到任务里面去
      p.close()
      p.join()
      print('All subprocess done.')

  if __name__ == "__main__":
      unittest.main()
  ```

- 这样也不行

  ```py
  if __name__ == "__main__":
      def multi_mission():
      """ 并发场景 - 多个请求同时来获取DHCP配置，可能导致获取到的地址冲突
      """
      import time
      undeploy_device_ids = list()
      with session_scope() as session:
          ret = session.query(
              BbcDeviceList).filter(
                  BbcDeviceList.dhcp_config == "").all()
          undeploy_device_ids = [x.device_id for x in ret]

      def run(device_id):
          print('Run task %s (%s)...' % (device_id, os.getpid()))
          start = time.time()
          req = get_cloud_deploy_setting_request()
          req.device_id = device_id
          pb_str = req.SerializeToString()
          rep = get_cloud_deploy_setting_response()
          data = get_cloud_deploy_setting(pb_str)
          rep.ParseFromString(data)
          end = time.time()
          print(rep.cloud_deploy_setting)
          print('Task %s run %0.2f seconds.' % (device_id, end - start))
      p = Pool(8)
      for device_id in undeploy_device_ids:
          p.apply_async(run, args=(device_id,))
      print('Waiting for all subprocess done...')
      p.close()
      p.join()

    multi_mission()  # 这也运行不了
  ```

- 目标函数是类成员函数

  ```py
  # 多了解下作用域
  from multiprocessing import Process

  class Test():
      def test(self, arg1, arg2):
            pass

  def do():
        api = Test()
        tasks = []
        for i in range(10):
            task = Process(target=Test.test,
                           args=(api, "arg1", "arg2"))
            task.start()
            tasks.append(task)
        for i in tasks:
            i.join()
  ```

## `subprocess` 子进程

虽然 `multiprocess` 可以 fork 出一个进程，但是子进程一般不是自身，而是另外的可执行程序，感觉有点像 exec 族；`subprocess` 可以很方便得启动一个子进程

```py
import subprocess

print('$nslookup www.baidu.com')
r = subprocess.call(['nslookup', 'www.baidu.com'])
print('Exit code:', r)

print('$nslookup')
p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# communicate 用来支持输入
output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
print(output.decode('utf-8'))
print('Exit code:', p.returncode)
```

- 执行命令

  ```py
  import subprocess
  subprocess.call("ls /", shell=True)
  ```

## 获取子进程执行结果

https://blog.csdn.net/springlustre/article/details/88703947

## 进程间通信

### 管道

### 消息队列

```py{cmd=true}
from multiprocess import Process, Queue
import os, time, random

# 写数据进程执行的代码:
def write(q):
    print('Process to write: %s' % os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' % value)
        q.put(value)
        time.sleep(random.random())

# 读数据进程执行的代码:
def read(q):
    print('Process to read: %s' % os.getpid())
    while True:
        value = q.get(True)
        print('Get %s from queue.' % value)

if __name__=='__main__':
    # 父进程创建Queue，并传给各个子进程：
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动子进程pw，写入:
    pw.start()
    # 启动子进程pr，读取:
    pr.start()
    # 等待pw结束:
    pw.join()
    # pr进程里是死循环，无法等待其结束，只能强行终止:
    pr.terminate()

```

## apply 与 apply_async

- [apply 和 apply_async](https://blog.csdn.net/weixin_37111106/article/details/85122988)

- `callback` 这回调函数的作用就是将函数 func1 的返回值传给 func2，并执行 func2 函数，所以不能在 pool.apply_async 里面单独给 func2 传值，func2 接受的参数就是 func1 的返回值。

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方
