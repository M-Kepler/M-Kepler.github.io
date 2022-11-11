
## 单元测试

### 单元测试 `luaunit`

[luaunit 单元测试](https://github.com/bluebird75/luaunit)

```lua{cmd=true}
LUA_XTEST = 1
local luaunit = reuqire "luaunit"

function  test_is_financial_sector()
    local ret = dc_license.is_financial_sector()
    luaunit.assertTrue(ret)
end

os.exit(luaunit.LuaUnit:run())
```

- 打桩测试

  ```lua{cmd=true}
  local operlog
  if (LUA_XTEST == 1) then
      operlog = {
        log=function(arg) return 1 end,
        member1="admin",
        access={ADMIN="admin"}
      }
  else
    operlog = require("operlog")
  end
  operlog.log(arg1, arg2, arg23)
  print(operlog.member1)
  print(operlog.access.ADMIN)
  ```

### 代码覆盖率 luacov

- 执行单测文件 `lua test.unit.lua` 生成 `luacov.stats.out`文件

- `luacov luacov.stats.out` 生成 `luacov.report.out` 代码覆盖率报告，里面有具体的代码覆盖率
