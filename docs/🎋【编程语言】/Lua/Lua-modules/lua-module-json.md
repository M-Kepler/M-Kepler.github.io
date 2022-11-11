- [参考资料](#参考资料)
- [json](#json)
- [其他](#其他)

# 参考资料

- [github.com/rxi/json.lua](https://github.com/rxi/json.lua)

# json

# 其他

```lua

content = [[
{
    "description": "dddddddd",
    "age": "dddddddddds",
    "aaaaa": "bbbbbb"
}
]]
t = {}
translate_key = "description"
local pattern = '(\n%s*\"' .. translate_key .. '\"%s*)%s*:%s(\"%w+\")'
-- print(pattern)
for k,v in string.gmatch(content, pattern)do
    print(k)
    print(v)
    t[k] = v
end
```
