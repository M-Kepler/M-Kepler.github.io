- [`threading`](#threading)
  - [参考资料](#参考资料)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `threading`

> 模块简介

- 通过函数创建多线程

  ```py{cmd=true}
  import time
  import threading

  def loop(arg):
      # current_thread() 永远返回当前线程的实例
      print('thread %s is running...' % threading.current_thread().name)
      n = 0
      while n < arg:
          n = n + 1
          print('thread %s >>> %s' % (threading.current_thread().name, n))
          time.sleep(1)
      print('thread %s ended.' % threading.current_thread().name)
  print('thread %s is running...' % threading.current_thread().name)

  # 创建线程
  t = threading.Thread(target=loop, name='LoopThread', args=(5,))

  # 启动子线程
  t.start()

  # 判断线程是否在执行状态，在执行返回True，否则返回False
  t.is_active()

  # 阻塞子线程，待子线程结束后，再往下执行
  t.join()
  print('thread %s ended.' % threading.current_thread().name)
  ```

- 通过类创建多线程

  ```py

  ```

- 使用 `map` 创建多线程

  ```py
  import time
  from threading import Thread

  class MyThread(Thread):
      def __init__(self, name="Python"):
          # 注意，super().__init__() 一定要写，而且要写在最前面，否则会报错。
          super().__init__()
          self.name=name

      def run(self):
          # 重写run方法，内容为需要多线程执行的内容
          for i in range(2):
              print("hello", self.name)
              time.sleep(1)

  if __name__ == '__main__':
      # 创建线程01，不指定参数
      thread_01 = MyThread()
      # 创建线程02，指定参数
      thread_02 = MyThread("MING")

      thread_01.start()
      thread_02.start()
  ```

- 线程锁

  ```py{cmd=true}
  balance = 0
  lock = threading.Lock()

  def do_work(n):
      for i in range(1000000):
          # 申请锁
          lock.acquire():
          try:
              pass
          finally:
              # 一定要记得释放
              lock.release()
  ```

- `ThreadLocal`

  ```py
  import threading
  # 创建全局 ThreadLocal 对象
  local_school = threading.local()
  def process_student():
      std = local_school.student
      print("Hello, %s in (%s)" % (std, threading.current_thread().name))

  def process_thread(name):
      local_school.student = name
      process_student()

  t1 = threading.Thread(target=process_thread, args=('alice',), name='Thread-a')
  t2 = threading.Thread(target=process_thread, args=('bob',), name='Thread-b')
  t1.start()
  t2.start()
  t1.join()
  t2.join()
  ```

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
