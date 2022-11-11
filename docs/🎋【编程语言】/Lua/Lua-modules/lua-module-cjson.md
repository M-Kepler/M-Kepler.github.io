- [参考资料](#参考资料)
- [cjson](#cjson)

# 参考资料

# cjson

```lua
cjson = require ("cjson")
result = {}
location_info_list = {}

table.insert(location_info_list, {wan3="1", wan4="2"})

data = {}
data["force_update"] = "0"
data["location_info"] = location_info_list

result["code"] = 200
result["message"] = "test"
result["data"] = data
```
