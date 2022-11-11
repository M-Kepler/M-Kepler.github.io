- [`tenacity`](#tenacity)
  - [参考](#参考)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

# `tenacity`

> 重试模块，比如发 HTTP 请求失败后就需要重试一下，以前都是自己写装饰器来实现的

- [任务重试](https://www.jb51.net/article/46641.htm)

  ```py
  class const:
    # 重试退避指数
    # 如重试间隔为 3s，首次失败后3秒重试，再次失败则 backoff * 3s 后再重试
    RETRY_BACKOFF = 3
    # 重试次数
    RETRY_TIMES = 3
    # 重试时间间隔（单位：秒）
    RETRY_INTERVAL = 5

  @staticmethod
  def retry(backoff=const.RETRY_BACKOFF, logger=None):
      """
      任务重试装饰器
      """
      def deco_retry(func):
          @wraps(func)
          def func_retry(*args, **kwargs):
              # 除重试外，本身需要运行一次
              mtries = 1 if const.RETRY_TIMES < 0 else const.RETRY_TIMES + 1
              mdelay = const.RETRY_INTERVAL
              while mtries:
                  try:
                      return func(*args, **kwargs)
                  except Exception as ex:
                      mtries -= 1
                      if not mtries and logger:
                          logger.warning(str(ex))
                          return
                      msg = "moa push fail:【%s】, Retrying in %d seconds..." % (str(ex), mdelay)
                      if logger:
                          logger.warning(msg)
                      mdelay *= backoff
                      time.sleep(mdelay)
          return func_retry
      return deco_retry
  ```

- 重试的需求通常是：`间隔多久重试`、`重试几次`、`重试失败后进行回调处理`、`遇到某种异常才重试`

- 但是貌似不支持指数退避，比如首次失败后等 3 秒后进行重试，如果再次失败，我希望等 6 秒再重试，而不是固定 3 秒

## 参考

- [tenacity 简介](http://suo.im/6cpUSA)

## 使用记录

- 只要在执行的函数上套上装饰器就行了

  ```py
  from tenacity import retry

  def retry_cb():
      '''最后一次重试失败后，执行该回调
      '''
      pass

  def retry_judge(value):
      '''每次重试之前都会来这个函数问一下，是否可以再次重试
      '''
      return value is True

  # 无条件重试
  @retry

  # 重试之前先等待2秒
  @retry(wait=wait_fixed(2))

  # 重试7次
  @retry(stop=stop_after_attempt(7))

  # 重试10秒后就不再重试
  @retry(stop=stop_after_delay(10))

  # 两个条件中的一个成立就不重试
  @retry(stop=(stop_after_attempt(7) | stop_after_delay(10)))

  # 指定抛出特定异常时再进行重试
  @retry(retry=retry_if_exception_type(MyException))

  @retry(stop=stop_after_attempt(3), retry=retry_if_result(if_false))  #

  # 抛出重试出错的原始异常（被retry修饰后，重试失败会抛出 RetryError异常，不是原始的异常）
  @retry(stop=stop_after_attempt(3), reraise=True)

  @retry(stop=stop_after_attempt(3), retry_error_callback=retry_cb, retry=retry_if_result(retry_judge))
  def test_retry():
      do_something...
      raise Exception

  test_retry()
  ```

## 模块学习

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方
