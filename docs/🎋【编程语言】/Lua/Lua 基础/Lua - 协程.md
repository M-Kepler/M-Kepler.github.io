
## 协程 `coroutine`

- [Lua 协程 (coroutine)基本使用](https://blog.csdn.net/qq_40985921/article/details/89924569)

- [Lua Coroutine 详解](https://www.jianshu.com/p/e4b543f3ff17)

```lua
-- example of for with generator functions

function generatefib (n)
  return coroutine.wrap(function ()
    local a,b = 1, 1
    while a <= n do
      coroutine.yield(a)
      a, b = b, a+b
    end
  end)
end

for i in generatefib(1000) do print(i) end
```

- 携带参数

  ```lua
  -- 启动程序
  -- newProductor = coroutine.create(productor)
  aaaa = 100
  newProductor = coroutine.create(
      function()
          productor(aaaa)
      end
  )
  ```

- 协程报 `attempt to yield across metamethod/C-call boundary`

  - 报错不一定是这个原因： https://www.cnblogs.com/lightsong/p/5785615.html

  - 有可能是你的协程代码写得有问题
