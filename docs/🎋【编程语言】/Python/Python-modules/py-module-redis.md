- [redis](#redis)
  - [参考](#参考)
  - [`redis` 命令](#redis-命令)
    - [`string`](#string)
    - [`list`](#list)
    - [`hash`](#hash)
    - [`set`](#set)
    - [`zset`](#zset)
  - [Redis 批量操作](#redis-批量操作)
  - [模块学习](#模块学习)
    - [python + redis + lua](#python--redis--lua)
    - [集合](#集合)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
  - [参考](#参考-1)

# redis

> 操作 `redis` 的第三方库，操作方式基本与 `redis` 保持一致

## 参考

- [很全的 `redis` 操作](https://www.runoob.com/w3cnote/python-redis-intro.html)

## `redis` 命令

> 查询不到返回的是 `None`

- 其他

  ```py
  # 删除数据库里所有的key
  redis.flushdb()

  # 获取所有的key，参数表示模糊匹配，和 redis一样
  redis.keys('*device*')

  # 连接redis
  # 加上 decode_responses 参数，可以直接显示可以看懂的字符串类型，而不是二进制
  REDIS = StrictRedis(host="localhost", port=6379, db=0, password=None, decode_responses=True)

  # 设置连接池来管理一个redis server的所有链接，避免每次建立释放的带来的开销
  pool = redis.ConnectionPool(host="localhost", port=6379, db=0, password=None, decode_responses=True)
  REDIS = redis.Redis(connection_pool=pool)


  nx  # key 不存在时才设置
  xx  # key 存在时才设置
  ```

- 过期时间

  ```py
  # 设置过期时间
  # ex 秒
  # px 毫秒
  REDIS.set("food", "mutton", ex=3)

  # 查询
  ```

### `string`

```py
# 新增
REDIS.set('test', '成都市a')
REDIS.setnx('test', 'asdf的')  # key不存在时才设置

# 查询
redis_ret = REDIS.get("test")
print(redis_ret)  # 结果是二进制类型
# b'\xe6\x88\x90\xe9\x83\xbd\xe5\xb8\x82a'
print(redis_ret.decode())  # 二进制转化为字符串类型
# '成都市a'

# 删除
REDIS.delete('test')
```

### `list`

```py
# 新增
REDIS.set('name', 'value')
print(REDIS.get('name'))

# 获取长度
REDIS.llen('name')

# 删除全部
REDIS.ltrim("name", 1, 0)  # 索引在1到0以外的数据（全部）
```

### `hash`

```py
# 新增
# 相当于这样的结构
"main_key" = {
    "sub_key": "{\"age\": 23, \"addr\": \"dda\xe5\x9c\xb0\xe6\x96\xb9\"}"
}
REDIS.hset('main_key', 'subk_key', '{"age": 25, "addr": "深圳"}')

# 查询
ret = REDIS.hget('main_key', 'sub_key')
ret_all = REDIS.hgetall('main_key')  # 返回的是一个字典

# 删除
REDIS.delete('main_key')
REDIS.hdel('main_key', 'sub_key')
```

- `hmset`

  ```py
  test = {
    1: ["a", "b"],
    2: ["c", "d"]
  }
  redis.hmset(YOUR_KEY, dict(test))
  ```

- `hmget`

  ```py
  cackey_key = "test:hjj"
  a, b = redis.hmget(cache_key, "age", "name")
  ```

- `hdel`

  ```py
  key = "test"
  del_items = ['a', 'b', 'c']
  # 批量删除哈希值
  # redis-cli> hdel test a b c
  redis.hdel(key, *del_items)
  ```

### `set`

- `sunion`

### `zset`

## Redis 批量操作

- [Python 下 redis 批量操作操作](https://www.cnblogs.com/spaceapp/p/12175975.html)

- `pipeline`开管道，把命令全部填进去，然后一次执行

  ```py
  import redis

  REDIS = redis.StrictRedis(host='127.0.0.1', port=6379, db=0, password='1234567890')
  # pipeline是没执行依次开一个管道吗
  with REDIS.pipeline() as ctx:
      a = time.time()
      ctx.hset('current', "time2", a)
      ctx.hset('current', "time3", a)
      res = ctx.execute()  # 返回执行结果列表，如果是get操作则返回get的结果列表，否则返回set操作错误码
      print("result: ", res)

  # 利用map进行批量操作
  dev_ids = [1, 2, 4, 5]
  with REDIS.pipeline() as ctx:
      # FIXME 这里不知道python3还能不能这样用，好像要list转一下才会执行map里的 function
      map(lambda dev_id: ctx.hgetall("device:%s" % dev_id), dev_ids)
      device_list = ctx.execute()
  ```

- 借助 `register_script` 发送 lua 脚本到 redis 服务器，获取一个本次连接的一个调用句柄，根据此句柄可以无数次执行不同参数调用

  ```py
  import redis
  import time

  REDIS = redis.StrictRedis(host='127.0.0.1', port=6379, password='12345678')

  # lua脚本
  lua = """
  local key = KEYS[1]
  local field = ARGV[1]
  local timestamp_new = ARGV[2]

  -- get timestamp of the key in redis
  local timestamp_old = redis.call('hget', key, field)

  -- redis.call(method, key, field) 的返回值（nil，false，1），此处没有键值返回的是false。如果中间有错误，所有的语句不时不生效
  -- if timestamp_old == nil, it means the key is not exist
  if timestamp_old == nil or timestamp_old == false or timestamp_new > timestamp_old then
      redis.call('hset', key, field .. 1, timestamp_new)
      -- timestamp_new > timestamp_old
      return redis.pcall('hset', key, field, timestamp_new)
  end
  """

  my_cmd = REDIS.register_script(lua)

  cur_time = time.time()
  # 对应 lua 脚本里的 KEYS 和 ARGV 参数
  my_cmd(keys=['current'], args=["time", cur_time])
  ```

## 模块学习

### python + redis + lua

```py
import os
from redis import StrictRedis

redis = StrictRedis(
    host='localhost',
    port=6379,
    db=0,
    password=None)
LUA_PATH = "/path/to/my/lua_sceipts"


def load_script(name, path=LUA_PATH, encoding='utf-8'):
  """ 加载lua脚本
  """
  filename = os.path.normpath(os.path.join(
    path,
    "{}.lua".format(name.replace('/', os.path.seq))
  ))
  with open(filename) as fd:
    content = fd.read().decode(encoding)
    return redis.register_script(content)

insert_alert = load_script("insert_alert")  # 从 LUA_PATH 加载insert_alert.lua脚本

"""
# 写法见 lua.md redis 部分
return redis.call("PING")
"""

if __name__ == "__main__":
    # 对应 lua 脚本里的 KEYS 和 ARGV 参数
    insert_alert(keys=[], args=[])  # 执行 lua 脚本
```

### 集合

- 添加多个元素到集合

  ```py
  tmp_key = "ttt"
  test = range(10)
  # 一定确保 test 不是空列表才行
  redis.sadd(tmp_key, *test)
  ```

## Q & A

> 使用过程中发现的一些问题或者坑

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方

- [python3 redis 返回字节 (bytes) 而不是字符串(string)](https://blog.csdn.net/a1007720052/article/details/107342869/)

- 从 `redis` 中去除的 `json` 串有可能是以**单引号**括起来的字符串。。。无法用 `json.loads(ret)` 来转换成字典，需要使用 `ast.literal_eval(ret)`

  ```py
  a = {
      'device_id': 1,
      'event_type': 2
  }
  json.dumps(a)
  ```

## 参考

> 参考资料

- [Python 操作 Redis，你要的都在这了！](https://www.cnblogs.com/john-xiong/p/12089103.html)
