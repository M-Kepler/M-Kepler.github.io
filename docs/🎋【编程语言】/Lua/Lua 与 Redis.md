- [`redis + lua`](#redis--lua)
  - [如何使用](#如何使用)
    - [参数](#参数)
    - [数据类型](#数据类型)
    - [错误处理](#错误处理)
    - [内置模块](#内置模块)
    - [`redis` 加载 `lua` 脚本过程](#redis-加载-lua-脚本过程)
    - [调试](#调试)
    - [耗时分析](#耗时分析)
    - [redis 操作](#redis-操作)
    - [坑](#坑)
  - [`too many results to unpack lua`](#too-many-results-to-unpack-lua)

# `redis + lua`

- Lua 脚本功能为 Redis 开发和运维人员带来如下三个好处：

  - Lua 脚本在 Redis 中是**原子执行**的，执行过程中间不会插入其他命令。

  - Lua 脚本可以帮助开发和运维人员创造出自己定制的命令，并可以将这些命令常驻在 Redis 内存中，实现复用的效果。

  - 可以像调用内置命令一样调用 Lua 脚本

  - 还有一个是，`可以提高执行效率`，至少我只需要一个连接就能处理这个事件，而不是通过 `redis-client` 发送多条命令去执行

- 由于 redis 对数据集**单线程读写的特性**，脚本执行时会**`阻塞所有对数据集的读写操作`**

  - `原子性`

    可以通过 Lua 脚本实现对数据集的原子读写操作，这和 Redis 的事务功能 MULTI / EXEC 类似

  - `长时间阻塞风险`

    如果 Lua 脚本执行时间过长，导致整个 Redis 不可用

## 如何使用

- 简单使用

  ```sh
  $redis-cli -p 6379 -a password
  # 执行 lua 脚本内容
  127.0.0.1:6379> eval "return #{1, 2, 3, 4}" 0
  ```

- [调用 lua 脚本](https://blog.csdn.net/wzzfeitian/article/details/42081837)

  ```sh
  # test.lua
  return redis.call("ping")

  # shell
  redis-cli -p 6379 --eval test.lua
  # 输出执行结果 PONG
  ```

### 参数

> `redis-cli eval "$(cat test.lua)" 1 apple type`

- `KEYS` 是一个全局变量，用数组的形式保存着这些传入的参数

- `redis` 先把测试数据设置进去

  ```sh
  redis-cli set apple '{"color": "red", "type": "fruit"}'
  => OK
  ```

- `test.lua`

  ```lua
  if redis.call("EXISTS", KEYS[1]) == 1 then
      local payload = redis.call("GET", KEYS[1])
      -- return cjson.decode(payload)  # 返回 json 的字符串形式
      return cjson.decode(payload)[ARGV[1]]
  else
      return nil
  end
  ```

- `--eval` 命令行参数执行

  ```sh
  # 逗号前的参数将存入变量 KEYS，逗号后的参数将存入变量 ARGV，多个变量用空格隔开
  # 逗号与前一个值要有空格隔开

  # redis-cli --eval /path/to/your/test.lua KEYS[1] KEYS[2] , ARGV[1] ARGV[2]
  redis-cli --eval test.lua apple , type
  ```

- `eval` 执行（相当于进入到交互终端执行，和 `redis-cli get ping` 一个意思）

  ```sh
  # 1. 第一个参数是脚本内容
  # 2. 第二个参数表示 【KEYS 的参数个数】
  # 3. KEY 和 VALUE 间【没有逗号】

  # redis-cli eval LUA_CONTENT PARAM_CNT PARAM1 PARAM2 ... VALUE1 VALUE2 ...
  redis-cli eval "$(cat test.lua)" 1 apple type
  ```

- 如果要传入的参数很多，可以先存到一个临时 key，然后在 lua 脚本最后面把这个 key 删掉

  ```lua
  -- Note: 不能在redis中的lua脚本中 unpack 大多数据(<1000)，所以需要在外部先处理
  -- DEFAULT_STACK_SIZE in the Lua source code set to 1024
  -- http://www.lua.org/source/4.0.1/src_llimits.h.html
  ```

### 数据类型

| `redis`        | `lua`                                      |
| :------------- | :----------------------------------------- |
| 整数回复       | 数字类型                                   |
| 字符串回复     | 字符串类型                                 |
| 多行字符串回复 | table 类型 (数组形式)                      |
| 状态回复       | table 类型 (只有一个 ok 字段存储状态信息)  |
| 错误回复       | table 类型 (只有一个 err 字段存储错误信息) |

### 错误处理

- `redis.call`

  ```sh
  redis-cli lpush foo a
  redis-cli eval "return redis.call('get', 'foo')" 0
  # 直接报错了，脚本会停止执行，并返回一个脚本错误，并不会继续执行
  (error) Error running script (call to f_xxxx)
  ```

- `redis.pcall`

  ```sh
  redis-cli lpush foo a
  redis-cli eval "return redis.pcall('get', 'foo')" 0
  # 出错时并不引发(raise)错误，而是记录错误并【继续执行】
  ```

### 内置模块

- 常用的 lua 模块，不过有的经过 redis 重写，用法还是一样的

- `cjson`、`cmsgpack` 库

### `redis` 加载 `lua` 脚本过程

- 为了在 Redis 服务器中执行 Lua 脚本, Redis 内嵌了一个 Lua 环境, 并对该环境进行了一系列修改, 从而确保满足 Redis 的需要；整个 Redis 服务器只需创建一个 Lua 环境

- 创建全局表 `redis`，包含了对 redi 的基础操作，比如 `redis.call("GET", "ping")`、`redis.pcall()`

- 为了**确保相同脚本可在不同机器上产生相同结果**，redis 使用自制函数替换了 Math 库中原有的 math.random()和 math.randomseed()

- 另一个可能产生数据不一致的地方是那些带有不确定性质的命令 (如: 由于 set 集合无序, 因此即使两个集合内元素相同, 其输出结果也并不一样), 这类命令包括 `SINTER、SUNION、SDIFF、SMEMBERS、HKEYS、HVALS、KEYS` 等

  Redis 会创建一个辅助排序函数 `__redis__compare_helper` , 当执行完以上命令后, 会调用 `table.sort()` 以 `__redis__compare_helper` 作为辅助函数对命令返回值排序.

- `redis` 会根据传入的脚本内容生成函数，函数名由 `f_ + 脚本内容的 sha1 摘要` 组成

- 函数保存到 `Lua_scripts` 字典，便于 `evalsha` 使用

  ```sql
  -- 加载脚本
  script load "return 'love u'"
  "b1778997b8491c6711ea377e6ad5877dcf624a5d"

  -- 执行脚本
  -- eval 脚本sha值 参数个数 keys argv
  127.0.0.1:6379> evalsha "a1ba158a87b39f68b9dd50039a5b2640e3fc18cd" 1 "app" "get_contchk_info:bd481d40359d45a2a9d3fe78a115e560"
  ```

- 执行脚本函数

  - 将 `KEYS` 和 `ARGV` 两个参数数组传入 `Lua` 执行环境

  - 装载超时处理钩子

  - 执行脚本

  - 移除超时钩子

  - 结果保存到客户端输出缓冲区，等待服务器将结果返回客户端

  - Lua 环境垃圾回收

- `lua` 脚本超时的风险

  - redis 的配置文件中提供了如下配置项来规定最大执行时长，`Lua-time-limit 5000` Lua 脚本最大执行时间，默认 5 秒

  - 当一个脚本达到最大执行时长的时候，Redis **会开始接收其他命令，但不会执行，也不会强制停止脚本的运行（保证原子性），仅仅在日志里打印个警告，告知有脚本超时**

  - 其他 redis 命令执行时，会收到如下警告: `raise response ResponseError: BUSY Redis is busy running a script. You can only call SCRIPT KILL or SHUTDOWN NOSAVE`，命令被阻塞，知道这个脚本执行完才能正常下去

  - 因为 Redis 必须保证脚本执行的原子性，中途停止可能导致内存的数据集上只修改了部分数据

### 调试

> [调试工具的使用](https://blog.csdn.net/u010205879/article/details/82911162)

- 断点调试

  ```sh
  # 进入调试模式，默认情况下将执行脚本第一行并停住
  redis-cli --ldb --eval set_ttl.lua fruit , apple 100

  # 查看帮助信息
  lua debugger> h

  # 调试命令和 gdb 差不多
  ```

- 获取脚本的 `sha1` 值

  ```sh
  echo -n "$(cat test.lua)" | sha1sum
  ```

- `redis + lua` 怎么把日志打出来?

  ```lua
  -- 在lua脚本里用 redis.log 写日志，可以在 redis 的日志文件中看到输出
  redis.log(redis.LOG_NOTICE, "notice please", "xxx", "yyy")
  --[[
    redis.log(loglevel, message)
    message 参数是一个字符串，而 loglevel 参数可以是以下任意一个值：
    redis.LOG_DEBUG
    redis.LOG_VERBOSE
    redis.LOG_NOTICE
    redis.LOG_WARNING
  ]]
  ```

### 耗时分析

> 如果一个脚本耗时 10ms，那么 QPS 也就只有 100

- 耗时打点

  ```sql
  -- 第一个字符串是当前时间(以 UNIX 时间戳格式表示)
  -- 第二个字符串是当前这一秒钟已经逝去的微秒数
  127.0.0.1:6379> TIME
  1) "1621339804"
  2) "928370"   -- 928ms

  -- 额。。。redis日志本来就有时间了啊

  local cur_time = redis.call("TIME")
  redis.log(redis.LOG_NOTICE, cur_time[1], cur_time[2])
  ```

### redis 操作

- `hgetall`

  ```lua
  local function hgetall(hash_key)
    local flat_map = redis.call('HGETALL', hash_key)
    local result = {}
    for i = 1, #flat_map, 2 do
      result[flat_map[i]] = flat_map[i + 1]
    end
    return result
  end
  ```

- `hmset`

  ```lua
  -- 把从数据库查到的数据缓存到 redis
  -- 先从数据库查询数据，然后转成 json 字符串
  -- redis-cli -p 6333 -a redis@sfdc --eval a.lua '[{"gateway_id": "0C3F4121", "branch_id": 20055, "usage_state": "", "product_id": 16, "device_list_id": 0, "fix_code": "", "device_name": "200.200.126.21_SDW-R", "parent_id": -1, "manager": "", "sn": "", "tpl_id": 3, "id": 20087, "audit_status": 0, "physical_state": 1, "product_name": "SDW-R", "gwsn": ""}, {"gateway_id": "-1", "branch_id": 20088, "usage_state": "", "product_id": 16, "device_list_id": 0, "fix_code": "", "device_name": "555_SDW-R", "parent_id": -1, "manager": "", "sn": "", "tpl_id": 4, "id": 20090, "audit_status": 0, "physical_state": 1, "product_name": "SDW-R", "gwsn": "eeeee"}]'

  local device_infos = cjson.decode(KEYS[1])
  local MAX_CACHE_CNT = 1000

  for index, device_info in ipairs(device_infos) do
      local tmp_tb = {}

      -- 不能用 ipair 因为有的字段为空
      for column_name, column_value in pair(device_info) do
          table.insert(tmp_tb, column_name)
          table.insert(tmp_tb, column_value)

          -- DEFAULT_STACK_SIZE in the Lua source code set to 1024
          -- http://www.lua.org/source/4.0.1/src_llimits.h.html
          -- 一千条数据提交一次，以免太多
          if #tmp_tb > MAX_CACHE_CNT then
              redis.call("HMSET", "device:" .. device_info.id, unpack(tmp_tb))
              tmp_tb = {}
          end
      end

      -- 不满 1000 的单独提交一次
      if #tmp_tb > 0 then
          redis.call("HMSET", "device:" .. device_info.id, unpack(tmp_tb))
      end
  end

  ```

- 分多次提交

  ```lua
  --[[
  /**
   * \brief: 分多次进行缓存
             以免把所有信息塞到一个数组，导致报错超出lua数组的大小
   * \param:
   * \return:
   */
  --]]
  local function cache_by_multi_part(command, cache_key, infos)
      local tmp_tb = {}
      for key, value in pairs(infos) do
          -- 哈希把键值对都进行缓存
          if command == "HMSET" then
              table.insert(tmp_tb, key)
          end
          table.insert(tmp_tb, value)
          if #tmp_tb >= const.MAX_CACHE_CNT then
              redis.call(command, cache_key, unpack(tmp_tb))
              tmp_tb = {}
          end
      end
      if #tmp_tb > 0 then
          redis.call(command, cache_key, unpack(tmp_tb))
      end
  end
  ```

- `exist`

  ```lua
  redis.call("EXISTS", cache_key)
  -- 1 表示存在
  ```

### 坑

## `too many results to unpack lua`

> [`too many results to unpack lua`](https://blog.csdn.net/yangjian_9276/article/details/86679937)数组过大，会报错 too many results to unpack

- 如果是因为传入给 lua 的参数太长，可以先存到临时键，然后在 lua 脚本用 redis 命令取

- 如果是 lua 脚本需要把非常多的 ID，比如 20000 个组装到一个 table，然后调用 `redis.call("SADD", "tmp_key", unpack(err_tb))` 来一次性提交，那只能拆开分多次提交了
