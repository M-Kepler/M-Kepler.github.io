- [`datetime`](#datetime)
  - [`date`](#date)
  - [`time`](#time)
  - [`datetime`](#datetime-1)
- [格式化](#格式化)

## `datetime`

- [UTC 时间、GMT 时间、本地时间、Unix 时间戳](https://www.cnblogs.com/xwdreamer/p/8761825.html)

- [Python datetime 模块详解](https://www.cnblogs.com/awakenedy/articles/9182036.html)

### `date`

- 构建一个时间实例

  ```py
  >>> from datetime import date
  >>> date(2020, 9, 1)
  >>> datetime.date(2020, 9, 1)
  ```

### `time`

- 创建一个实例

  ```py
  >>> from datetime import time
  >>> time(10, 10, 0)  # 10 点 10 分 0 秒
  >>> datetime.time(10, 10)
  ```

### `datetime`

- 获取当天星期

  ```py
  from datetime import datetime
  today = datetime.today()
  weekday = today.weekday()  # 返回的0-6，代表周一到周日
  weekday2 = today.isoweekday()  # 返回1-7，代表周一到周日，当前时间所在本周第几天；
  ```

- 获取当前时间

  ```py{cmd=tru}
  from datetime import datetime
  # 返回当前日期和时间，其类型是 datetime
  dt = datetime.now()
  print(dt)
  # 2019-07-28 11:32:44.228970

  print(type(dt))
  # <type 'datetime.datetime'>
  ```

- 指定时间

  ```py
  dt = datetime(2019, 7, 28, 11, 37)
  print(dt)
  ```

- 当前时间与时间戳

  ```py
  # datetime2timestamp
  dt.timestamp()

  # python2做法如下
  dt = datetime.datetime.now()
  print(time.mktime(dt.timetuple()))

  # timestamp2datetime
  datetime.fromtimestamp(t)
  ```

- 时间差

  ```py
  from datetime import timedelta, datetime
  dt = datetime(2019, 7, 28, 11, 37)
  print(dt - timedelta(days=1))
  print(dt + timedelta(days=2, hours=12))
  ```

- `UTC` 时间

  ```py
  from datetime import timezone
  # 本地时间转为UTC时间
  tz_utc_8 = timezone(timedelta(hours=8))  # 创建时区UTC+8:00
  dt = dt.replace(tzinfo=tz_utc_8)  # 强制设置UTC+8:00

  # 拿到 UTC 时间，并强制设置时区为 UTC+0:00
  utc_dt=datetime.utcnow().replace(tzinfo=timezone.utc)
  # 北京时间:
  bj_dt=utc_dt.astimezone(timezone(timedelta(hours=8)))
  ```

## 格式化

- 时间格式化字符串

  | 字符 | 意义                                     |
  | :--- | :--------------------------------------- |
  | `%Y` | 完整的年份                               |
  | `%y` | 去掉世纪的年份                           |
  | `%m` | 月份（01 - 12）                          |
  | `%d` | 一个月中的第几天（01 - 31）              |
  | `%H` | 一天中的第几个小时（24 小时制，00 - 23） |
  | `%M` | 分钟数（00 - 59）                        |
  | `%S` | 秒（01 - 61）                            |
  | `%w` | 一个星期中的第几天（0 - 6，0 是星        |

- 时间与字符串

  ```py
  # datetime2string
  # string format time
  dt.strftime('%a, %b, %d, %H:%M')

  # string2datetime
  # string parse time
  datetime.strptime('2016-3-27 21:57:23', '%Y-%m-%d %H:%M:%S')
  ```
