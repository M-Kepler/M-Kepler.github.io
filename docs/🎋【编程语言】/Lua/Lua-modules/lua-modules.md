- [内置模块](#内置模块)
  - [`table`](#table)
  - [`os`](#os)
    - [时间](#时间)
      - [`os.clock()`](#osclock)
      - [`os.date()`](#osdate)
      - [`os.time()`](#ostime)
  - [`io`](#io)
  - [`math`](#math)
  - [`string`](#string)
  - [`coroutine`](#coroutine)
- [第三方模块](#第三方模块)
  - [`posix`](#posix)
    - [`posix.signal`](#posixsignal)
  - [`luarocks`](#luarocks)
  - [`lfs`](#lfs)
  - [`LuaXML`](#luaxml)
  - [`protoc-gen-lua`](#protoc-gen-lua)
  - [`lua-base64`](#lua-base64)
- [其他](#其他)
  - [排序](#排序)

# 内置模块

打印出 `package.loaded` 就看到了

## `table`

> https://www.junmajinlong.com/lua/lua_table/

- `table.insert`

- `table.remove`

- `table.move`

- `table.concat`

- `table.sort`

- `table.pack`

  ```lua
  a = table.pack("a","b","c","d","e")
  for k,v in pairs(a) do print(k,v) end
  --[[
  1       a
  2       b
  3       c
  4       d
  5       e
  n       5
  ]]
  ```

- `table.unpack`

  ```lua
  a = {"a","b","c","d","e",n=5}
  print(table.unpack(a))      --> a  b  c  d  e
  print(table.unpack(a,2,3))  --> b  c
  print(table.unpack(a,2,2))  --> b
  ```

## `os`

> [Lua OS 标准库](https://www.junmajinlong.com/lua/os_lib/)

```lua
print(os.time())  -- 1592124891 调用os.time会返回当前时间的时间戳
print(os.time(
  {
    year=2020,
    month=5,
    day=3,
    hour=14,
    min=33,
    sec=51
  }
))  -- 1588487631 也可以指定年月日时分秒

-- 自动打印当前的日期，除此之外还可以传入一个时间戳，来打印指定格式的日期
-- 返回的是一个string类型
print(os.date("%Y-%m-%d"))  -- 2020-06-14
print(os.date("%Y-%m-%d", os.time({year=2020, month=4, day=3})))  -- 2020-04-03
```

- `os.rename`

  ```lua
  local rec = os.rename(tmp_file_path, file_path)
  if rec ~= 0 then
    return false
  end
  ```

- [`os.remove`](https://www.jianshu.com/p/0db899bb2487)

  ```lua
  > a = os.remove("asdfasd")
  > print(a)
  nil
  > a = os.remove("/root/a.sh")
  > print(a)
  true
  ```

- `basename`

  ```lua
  local function basename(str)
    return string.gsub(str, "(.*[/\\])(.*)", "%2")
  end
  ```

- `os.execute(cmd)`

  ```lua
  local rec = os.execute("xxxxxxxxx")
  if rec ~= 0 then
    return false
  end
  ```

- `os.getenv(arg)` 获取环境变量值，参数 `arg` 不区分大小写；环境变量不存在返回 `nil`

### 时间

- [lua 字符串和时间戳相互转换](https://blog.csdn.net/chunniaozheng2370/article/details/101061249)

- [lua 时间戳和日期转换及踩坑](https://www.cnblogs.com/zhaoqingqing/p/9487479.html)

- [字符串和时间戳互转](https://my.oschina.net/u/3443876/blog/3066994)

- 日期时间转时间戳

  ```lua{cmd=true}
  function common.date_to_tm(str_date, format)
    local _, _, y, m, d, _hour, _min, _sec = string.find(tostring(str_date), format)
    local end_tm = os.time({year=y,
                            month=m,
                            day=d,
                            hour=_hour,
                            min=_min,
                            sec=_sec})
    return end_tm
  end
  tm = date_to_timestamp("2020-07-01T14:53:40","(%d+)-(%d+)-(%d+)T(%d+):(%d+):(%d+)")
  print(tm)
  ```

- [lua 中使用 sleep 睡眠](https://www.cnblogs.com/wcong/p/3218053.html)

  ```lua
  os.execute("sleep " .. n)
  ```

#### `os.clock()`

> 取得的时间精度是 `0.01` 秒

- [坑：32 位系统有溢出风险](https://blog.csdn.net/fightsyj/article/details/86258240)

```lua
local start_clock = os.clock()
print(string.format("start clock is %.4f", start_clock))

-- do_something()
os.execute("sleep 2")

local end_clock = os.clock()
print(string.format("end clock is %.4f", end_clock))

-- FIXME 这里实际上并不是2s
print(string.format("delta clock is %.4f", end_clock - start_clock))
```

#### `os.date()`

https://www.jianshu.com/p/76ac11863591

> `os.date([format, [, time]])`

```lua
-- format 以 ! 开头，则按格林尼治时间进行格式化
-- 直接在命令行执行不要加local...
-- os.date 带 *t 会返回一个 table，可以配合 os.time 使用

utimetable = os.date("!*t", os.time())
for i, v in pairs(utimetable) do
  print(i, v)
end
--[[
  hour    17
  min     21
  wday    2
  day     16
  month   11
  year    2020
  sec     31
  yday    321
  isdst   false
]]

-- format 是一个 *t，将返一个带 year(4 位)，month(1-12)， day (1--31)， hour (0-23)， min (0-59)，sec (0-61)，wday (星期几， 星期天为 1)， yday (年内天数) 和 isdst (是否为日光节约时间 true/false)的带键名的表
time_tb = os.date("*t", os.time());
for i, v in pairs(timetable) do
  print(i, v);
end
--[[
  hour    1
  min     21
  wday    3
  day     17
  month   11
  year    2020
  sec     22
  yday    322
  isdst   false
]]

-- 如果 format 不是 *t，os.date 会将日期格式化为一个字符串
```

- 格式化
  | 格式符 | 含义 | 具体示例 |
  | :- | :- | :- |
  | `%a` | 一星期中天数的简写 | `(Fri)` |
  | `%A` | 一星期中天数的全称 | `(Wednesday)` |
  | `%b` | 月份的简写 | `(Sep)` |
  | `%B` | 月份的全称 | `(May)` |
  | `%c` | 日期和时间 | `(09/16/98 23:48:10)` |
  | `%d` | 一个月中的第几天 | `(28)[0 - 31]` |
  | `%H` | 24 小时制中的小时数 | `(18)[00 - 23]` |
  | `%I` | 12 小时制中的小时数 | `(10)[01 - 12]` |
  | `%j` | 一年中的第几天 | `(209)[01 - 366]` |
  | `%M` | 分钟数 | `(48)[00 - 59]` |
  | `%m` | 月份数 | `(09)[01 - 12]` |
  | `%P` | 上午或下午 | `(pm)[am - pm]` |
  | `%S` | 一分钟之内秒数 | `(10)[00 - 59]` |
  | `%w` | 一星期中的第几天 | `(3)[0 - 6 = 星期天 - 星期六]` |
  | `%W` | 一年中的第几个星期 | `(2)0 - 52` |
  | `%x` | 日期 | `(09/16/98)` |
  | `%X` | 时间 | `(23:48:10)` |
  | `%y` | 两位数的年份 | `(16)[00 - 99]` |
  | `%Y` | 完整的年份 | `(2016)` |
  | `%%` | 字符串'%' | `(%)` |

#### `os.time()`

> `os.time[table]`

- [毫秒时间戳](https://www.cnblogs.com/wcong/p/3218053.html)

```lua
local tab = {year=2008, month=8, day=8, hour=20}
local pretime = os.time(tab)
print(os.date("%x", pretime))

local timetb = os.date("*t")
local nowtime = os.time(timetb)
print("%c", nowtime)

print("delta time is ", os.difftime(nowtime - pretime))
```

https://blog.csdn.net/ningyuanhuo/article/details/43069969

## `io`

> [Lua 的文件 IO 操作](https://www.cnblogs.com/muyuqianshan/p/7026141.html)

- 标准输入输出

  ```lua
  local arg
  arg = io.read()
  io.write('arg is' .. arg .. '\n')
  ```

- `io.open`

  ```lua

  ```

- `io.popen`

  ```lua
  local function executeEnhance(cmdstr)
      local fd = io.popen(cmdstr)
      if fd then
          local content = fd:read("*a")
          fd:close()
          return content
      end
      return nil
  end
  ```

- `io.write()`

- `io.read()`

  ```lua
  local file_path = "/path/to/your/file"
  local fd = io.open(file_path, "r")
  local file_content = fd:read("*all)
  fd:close()
  ```

  - `file:read(*all)`
    - `*n`: 读取一个数字
    - `*a`: 从当前位置读取整个文件,若为文件尾，则返回空字串
    - `*l`: [默认]读取下一行的内容,若为文件尾，则返回 nil
    - `number`: 读取指定字节数的字符,若为文件尾，则返回 nil;如果 number 为 0 则返回空字串,若为文件尾，则返回 nil;

- `io.lines([file_name])`

  ```lua
  -- 按文件名以读的模式打开，返回一个迭代函数，迭代函数每次调用都会返回文件中新的一行的内容，直到文件所有内容都被读完
  for line in io.lines("/path/to/your/file") do
    -- 当检测到文件末尾时，会返回 nil 来结束循环并自动关闭文件
    -- 然后就需要再次打开才行了
    print(line)
  end

  file = io.open("/path", "r")
  for k in file:lines() do
    print(k)
  end
  ```

## `math`

> [Lua 基础之 math(数学函数库)](https://blog.csdn.net/sinat_33927885/article/details/82414468)

```lua
-- 取整、求余
a = 10000.12
a1, a2 = math.modf(a)
print(a1)  --> 10000
print(a2)  --> 0.12

-- 随机值
print(math.random(1, 100))  --> 88

-- 平方
print(math.pow(2, 3))  --> 8

-- 开方
print(math.sqrt(16))  --> 4

-- 最值
print(math.max(12, 32, 43, 34.232))  --> 43
print(math.min(12, 32, 43, 34.232))  --> 12

-- 绝对值
print(math.abs(-23.12))  --> 23.12
```

## `string`

- 去除前缀

- 字符串拼接，类似 python 的 `join`

  ```lua{cmd=true}
  -- table.concat要求连接类型是字符串和数字类型，nil明显不符合
  print(table.concat({"a", "b", "c"}, ","))
  --> "a, b, c"
  print(table.concat({nil, "a", nil}, ", "))
  --> " "
  print(table.concat({nil, "a"}, ", "))
  --> ERROR invalid value (nil) at index 9 in table for 'concat'
  -- 这是个table，实现肯定用了遍历，可能就是pairs的问题
  ```

- [字符串分割 split](https://blog.csdn.net/forestsenlin/article/details/50590577)

  ```lua{cmd=true}
  function split(str, reps )
    local resultStrList = {}
    string.gsub(str, '[^'..reps..']+', function ( w )
        table.insert(resultStrList, w)
    end)
    return resultStrList
  end
  aa = "1111$$2222$$3333"
  print(split(aa, "$$"))
  ```

- `string.upper(str) / string.lower(str)` 字符串转大小写

  ```lua
  str = "huangJinJie"
  print(str:upper())
  print(str:lower())
  ```

- `string.strfile(main_str, find_str[, optional_start, optional_end])` 在主串中查找，并返回字符串在主串中的开始和结束位置

- `string.rever(str)` 颠倒字符串

- `string.find`

  ```lua{cmd=true}
  s, e = string.find("hello huangjinjie", "jinjie")
  -- 返回子串的开始和结束索引（注意lua的索引是从1开始的）
  print(s, e)
  --> 12    17

  -- 原型：string.find (s, pattern [, init [, plain]])
  a, b = string.find("xx*yy", "xx*yy")
  --> nil    nil
  -- 还是要取看看函数原型，string.find使用正则查找的，所以*被当做正则字符了
  -- 第三个参数：正数表示从第几位开始匹配 负数则是从倒数第几位开始匹配
  -- 第四个参数（第三个参数必须有）：true表示把*当做普通字符
  a, b = string.find("xx*y", "xx*y", 1, true)
  --> 1    4
  ```

- `string.reverse`
  反转字符串

  ```lua{cmd=true}
  > ret = string.reverse('huang jin jie')
  > print(ret)
  eij nij gnauh
  ```

- `string.format` 格式化字符串

  ```lua{cmd=true}
  string.format("the value is:%d",4)
  ```

- `string.upper 和 string.lower
  转换大小写

  ```lua{cmd=true}
  > ret = string.upper('abcD')
  > print(ret)
  ABCD
  > ret = string.lower('ABCd')
  > print(ret)
  abcd
  ```

- `string.sub`

- `string.gsub` 替换字符串

  ```lua{cmd=true}
  a = "test string"
  b = string.gsub(a, "test", "another")
  -- lua里的字符串函数基于正则实现的， % 被理解为匹配所有的字符，于是想到对%进行转义，从lua的参考手册中发现%是转义字符，”%%”表示符号’%’
  print(a)
  --> test string
  print(b)
  --> another string
  ```

- `string.match`

- `string.gmatch(str, pattern)`

  ```lua
  -- 返回一个迭代器函数，每次调用这个函数返回一个在 `str` 找到的下一个符合 `pattern` 描述的子串；如果没有找到则返回 nil
  --[[
    模式匹配看似正则表达式，其实不是正则表达式
    %a    查找一个字母
    %w    查找一个数字或者字母
    %d    查找一个数字
    +     匹配一个或多个
    %a+   表示查找连续的一个及以上的字母字符串
  ]]
  str = "1234asdfasdfsd,asdew,we32"
  func_itor = string.gmatch(str, "%d")

  -- 查看函数类型
  print("func_itor is ", func_itor)

  sourcestr = "hello world from lua"
  index = 1
  for word in string.gmatch(sourcestr, "%a+") do
    print(index, word)
    index = index + 1
  end
  ```

- `string.len`

  ```lua{cmd=true}
  > ret = string.len("abc")
  > print(ret)
  3
  ```

- `string.rep`
  返回字符串的 n 个拷贝

  ```lua{cmd=true}
  > ret = string.rep('abc', 3)
  > print(ret)
  abcabcabc
  ```

- `string.pack`

## `coroutine`

# 第三方模块

## `posix`

> http://zhaohongjian000.is-programmer.com/posts/33365.html

### `posix.signal`

```lua
-- 忽略信号
signal.signal(signal.SIGPIPE, signal.SIG_IGN)
```

## `luarocks`

一个 `lua` 的包管理器，基于 `lua` 语言开发，[官网](https://luarocks.org/)

- `luarocks search rapidjson` 搜索库

- `luarocks install rapidjson` 安装库

  - 会下载并编译出 `so` 库安装在 `/usr/local/lib/lua/5.1/` lua 的系统库路径下
  - 会在 `/usr/local/lib/luarocks/rocks-5.1/` 下安装帮助文档信息

- `luarocks remove rapidjson` 卸载 `rapidjson` 库

## `lfs`

## `LuaXML`

> [项目地址](https://github.com/LuaDist/luaxml)

![xml结构](https://www.runoob.com/wp-content/uploads/2013/09/nodetree.gif)

- 样例

  ```xml
  <!-- test.xml -->

  <?xml version="1.0"?>    <!-- xml 声明 -->
  <lua_module>  <!-- 根元素 -->
    <file_attribute>  <!-- 子元素  -->
      <fileflag flag="test", version="0.0.1" />
    </file_attribute>

    <file_content>  <!-- 子元素 -->
      <dhcp>
        <dmz dns2="", dns1="", dns_cover_enable="0">  <!-- 元素属性 -->
          <!-- 同级的子元素 -->
          <reservedip/>
          <ippool sfxmltype="array">
            <item ipto="1.1.1.10", ipfrom="1.1.1.1">
            <item ipto="2.1.1.10", ipfrom="2.1.1.1">
          </ippool>
        </dmz>

        <dmz dns2="", dns1="", dns_cover_enable="0"/>

        <lan dns2="", dns1="", dns_cover_enable="0"/>
      </dhcp>
    </file_content>
  </lua_module>
  ```

- 读取

  ```lua
  local xml = require "LuaXML"
  local xml_path = "~/test.xml"
  -- 加载 load
  local rec, xml_fd = pcall(xml.load, xml_path)
  -- print(xml_fd)  -- 可以直接看到整个xml结构
  if rec ~= true then
    print("load config fail.")
    os.exit(1)  -- 设置返回码为 1
  end

  -- find 可以找到所有 <file_content 开头的节点，但最好查根元素，子元素用 children 来获取，返回的是一个表，可以通过  table.getn(xxx) 获取子节点数量
  local file_content = xml_fd:find("file_content")

  -- children(arg) 可以找到该节点下的所有 arg 节点
  for index, info in file_content:children("dhcp") do
    print(index, info)

    -- 可以像表操作一样访问/ 修改 子元素的属性
    print(info.dns2)  -- 修改: info.dns2 = "1.1.1.3"
  end
  local dmz = xml_fd:find("dmz")

  ```

- 改动

  ```lua
  local xml = require "LuaXML"

  local new_xml_content = xml.new("root")
  -- 设置子节点键值
  local child = new_xml_content:append("child");
  child.id = 1;
  -- 或者这样设置
  new_xml_content:append("child").id = 2;

  -- 不设置属性，设置文本
  new_xml_content:append("text")[1] = 'test';
  -- 保存文件 xml.save(var, filename)
  new_xml_content:save("t.xml");
  ```

## `protoc-gen-lua`

- 编译安装

  ```sh
  # 下载代码
  cd /opt
  sudo git clone https://github.com/sean-lin/protoc-gen-lua.git protoc-gen-lua

  # 系统 lua 库路径
  LUA_LIB_PATH=/usr/local/lib/lua
  PROTOC_GEN_LUA_PATH=/opt/protoc-gen-lua

  # 编译 so 库
  cd $PROTOC_GEN_LUA_PATH/protobuf/
  sudo make

  # 创建 protoc 插件软链
  sudo ln -s $PROTOC_GEN_LUA_PATH/plugin/protoc-gen-lua /usr/local/bin

  # 添加到环境变量中
  # 创建一个文件夹来存放自己的lua库
  mkdir -p $LUA_LIB_PATH
  echo "export LUA_PATH=\"$LUA_LIB_PATH/?.lua;;\"" >> ~/.bashrc
  source ~/.bashrc

  # 创建软链到 lua 库目录下
  for file in $(ls *.lua *.so);do sudo ln -s $PROTOC_GEN_LUA_PATH/protobuf/$file $LUA_LIB_PATH/$file;done;
  ```

- 简单测试一下

  ```sh
  cp -r /opt/protoc-gen-lua/example ~/example
  protoc --lua_out=. person.proto
  lua test.lua
  ```

## `lua-base64`

- [纯 lua 实现 Base64 加密与解密](https://www.cnblogs.com/danjing/p/4818462.html)

# 其他

## 排序

- [快排](https://blog.csdn.net/heyuchang666/article/details/47274607)
