
## 内存管理

- [如何深入理解 LUA 数据结构和内存占用](https://blog.csdn.net/ft1874478a/article/details/95307214)

### 垃圾回收 `collectgarbage`

> Lua 垃圾回收只有一个函数 `collectgarbage`，第一个参数是字符串，代表操作类型，第二个参数只有某些操作有，是该操作所需要的参数
> [Lua base collectgarbage()](https://www.jianshu.com/p/8278ff0415dd)

- `collectgarbage([option[, arg]])` 单位是 `kb`

  - `stop` 停止垃圾收集。

  - `restart` 重启垃圾收集。

  - `collect` 执行一个完整的垃圾收集循环。

  - `count` 返回当前使用的内存，单位为千字节。

  - `step` 单步执行垃圾收集，第二个参数代表多少步。如果步长可以完成一次垃圾收集，则返回 true。

  - `setstepmul` 第二参数 / 100 代表单步的速度，默认值为 200，代表是`内存分配速度`的两倍。

  - `setpause` 第二参数 / 100 代表暂停垃圾回收的时长

- `require` 模块的内存释放

  ```lua
  local a = require ("b")
  -- do clear
  --[[
    b.lua 文件是这样定义的，原本是一个 json，将其转为 lua 的，将所有数据赋值给一个变量（require 之后多了一个全局变量）
    这样 package.loaded[modulename] 为 true，**重置这个值并不会回收内存，需要同时清理全局变量（将相应变量置为 nil），才可以实现内存的回收**
  ]]
  a = nil
  package.loaded["b"] = nil
  collectgarbage()
  print(collectgarbage("count"))

  -- 封装一下
  function unrequire(mod_name)
    package.loaded[mod_name] =nil
    _G[mod_name] = nil
  end
  ```

```lua
--[[
  查看消耗了多少内存
]]

local function get_memory()
  return collectgarbage("count")
end
collectgarbage("stop")

-- a.lua
local function func_in_os()
  print("function in os module")
end

return {
  func_in_os = func_in_os
}

-- test.lua
local before_req = get_memory()
local test = require("os_test")
local after_req = get_memory()
print("require os_test module used: " .. (after_req - before_req) * 1024 .. " bits")
--> 输出是 1543 比特
--> 如果计算一下一个空表，发现一个空表占用了 64 bits（我的电脑是64位的）
```

### 内存优化

- `require` 机制

- [系统内存占用优化](https://www.jianshu.com/p/9c7e9951c299)

- `_G` 表，保存了 lua 所用的所有全局函数和全局变量
