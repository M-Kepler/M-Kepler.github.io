- [`Lua` 与 `C`](#lua-与-c)
  - [引入 so 库](#引入-so-库)
  - [`lua api`](#lua-api)
    - [`luaState`](#luastate)
    - [类型判断](#类型判断)

# `Lua` 与 `C`

- 堆栈结构

  Lua 在和 C/C++ 交互时，Lua 运行环境维护着一份堆栈（不是传统意义上的堆栈，而是 Lua 模拟出来的）Lua 与 C/C++的数据传递都通过这份堆栈来完成，这份堆栈的代表就是 `lua_State*` 所指的那个结构。

- `lua` 调用 `ulfius` 库，`ulfius`库支持多线程，这时候会怎么样? lua 只能单线程执行。

## 引入 so 库

```lua
local cpath = "/usr/local/lua/lib/libluasocket.so"

-- 加载库并连接到 Lua
local f = assert(loadlib(cpath, "luaopen_socket"))

-- 打开库，调用库里的初始化函数
f()
```

## `lua api`

### `luaState`

### 类型判断
