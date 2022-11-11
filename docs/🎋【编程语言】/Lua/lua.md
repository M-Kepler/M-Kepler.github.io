- [参考资料](#参考资料)
- [Lua](#lua)
  - [数据类型](#数据类型)
    - [类型判断](#类型判断)
    - [枚举类型](#枚举类型)
    - [`number`](#number)
    - [表 `table`](#表-table)
      - [数组](#数组)
      - [字典](#字典)
      - [集合](#集合)
      - [链表](#链表)
      - [队列](#队列)
      - [元表 `metatable`](#元表-metatable)
      - [表操作](#表操作)
      - [其他](#其他)
    - [字符串](#字符串)
    - [`userdata`](#userdata)
    - [类型转换](#类型转换)
  - [控制语句](#控制语句)
    - [循环](#循环)
    - [判断](#判断)
    - [迭代器](#迭代器)
  - [函数](#函数)
    - [函数参数](#函数参数)
    - [闭包](#闭包)
    - [函数返回值](#函数返回值)
    - [函数尾调用](#函数尾调用)
    - [匿名函数](#匿名函数)
  - [封装](#封装)
    - [模块](#模块)
    - [设置环境变量](#设置环境变量)
    - [面向对象 `oop`](#面向对象-oop)
  - [模块加载机制](#模块加载机制)
    - [`require`](#require)
    - [`loadfile`](#loadfile)
    - [`loadstring`](#loadstring)
    - [`loadlib`](#loadlib)
    - [`dofile`](#dofile)
    - [`package`](#package)
  - [异常处理](#异常处理)
  - [调试](#调试)
    - [`debug` 库](#debug-库)
    - [命令行调试](#命令行调试)
    - [调试 `so` 库](#调试-so-库)
  - [其他](#其他-1)

# 参考资料

# Lua

## 数据类型

- 和 `python` 一样，可以通过 `type(xxx)` 来查看变量类型

- 全局变量和局部变量

  - 全局变量不需要声明，给一个变量赋值后默认创建的就是全局变量

  - 如果想删除一个全局变量，只需要把它赋值为 `nil`

  - 如果要声明的是局部变量的话，需要加 `local` 限定字

### 类型判断

### 枚举类型

### `number`

> [数学函数库](https://blog.csdn.net/dingkun520wy/article/details/51004198)

- Lua 会`自动在字符串类型和数值类型之间自动进行类型转换`，当一个字符串使用算术操作符时，字符串就会被转成数值类型，和 shell 一样

  ```lua
  -- 虽然可以这样，但并不表示 "10" == 10
  print("10" + 100) -- 字符串变成数字参与运算 -- 可以使用 tonumber() 显式把字符串转为数字
  print(10 .. 20)   -- 数字类型编程字符串类型 -- 可以使用 tostring() 显式把数字转为字符串
  ```

- 所有的数字都用这个类型，lua 的数字只有 double 类型，64bits，不怕不够长

  ```lua
  num = 11
  num = 1.10
  num = 3.1416
  num = 0.3
  num = 0xff -- 十六进制
  ```

- 和 python 一样，不用区分 整形、长整型、短整型

  ```lua

- 幂次方

  ```lua
  print(10 ^ 2) -- python里 ^ 表示异或运算
  -- 100
  -- python
  -- print(10 ** 2)
  ```

- `4e-3 = 4 * 10^(-3)`

- `x` 的 `y` 次方

  ```lua
  -- 和python一样
  -- python也可以 print(2**5)
  > print(math.pow(2, 5))
  > 32 -- python的话，结果是32.0
  ```

### 表 `table`

- 用来帮助我们创建不同的数据类型，如：数组字典等。创建一个空表: `emp_tb = {}`

- `table` 使用关联型数组，你可以**用任意类型的值来作数组的索引**（那不就是 python 里的字典 key 值了？），但这个值不能是 `nil`。

- 不固定大小，可以根据自己需要进行扩容。

- [判断空表](https://blog.csdn.net/hp_cpp/article/details/50530989)

  ```lua
  local a = {1, 2, 3}
  -- 判断空表不能这样判断，这样是比较两个内存地址
  -- print(a == {}) --> false

  -- 这种写法对于数组倒还行，但是对于字典就不行了
  -- print(table.maxn(a) == 0)

  print(next(a) == nil) --> true
  ```

- 任何数据都可以作为 `table` 的索引，因此，表可以出现多种混合的数据类型

- 通用的构造方式

  ```lua
  -- 这种通用构造方式可以构造hash的键值对
  -- 且key可以包含特殊符号，也可以以数值作为key构造数组元素
  a = {
    -- 左侧为下标，不能用 "xxx", 用 xxx，否则要用[]
    ["one"] = 1,
    ["two"] = 2,
    [1] = "one",
    [2] = "two"
  }
  ```

#### 数组

- [判断值是否在数组里 in](https://www.jb51.net/article/65457.htm)

- [`pairs` 和 `ipairs` 的区别](https://www.cnblogs.com/kerven/p/10331335.html)

  - `ipairs`并不会输出 table 中存储的键值对，会`跳过键值对`，然后顺序输出 table 中的值，遇到 nil 则会停止。

  - `pairs` 会输出 table 中的键和键值对，先`顺序输出值`，再`乱序（键的哈希值）输出键值对`。因为 table 在存储值的时候是按照顺序的，但是在存储键值对的时候是按照键的哈希值存储的，并不会按照键的字母顺序或是数字顺序存储

  ```lua
  local a = {"Hello", "World", a = 1, b = 2, x = 10, y = 20, "Good", nil, "Bye"}
  -- 对于a来说，如果执行print(a[3])，输出的结果也会是Good。也就是说table并不会给键值对一个索引值
  -- 也就是说，ipairs只是按照索引值顺序，打印出了table中有索引的数据，没有索引值的不管
  -- 而pairs是先按照索引值打印，打印完成后再按照键值对的键的哈希值打印它的值
  for i, v in ipairs(a) do
      print(i, v)
  end
  --[[ 输出
    1       Hello
    2       World
    3       Good
  --]]

  for k, v in pairs(a) do
      print(k, v)
  end
  --[[ 输出
    1       Hello
    2       World
    3       Good
    5       Bye
    a       1
    x       10
    y       20
    b       2
  ]]
  ```

- [获取数组长度](https://blog.csdn.net/github_36413952/article/details/78332716)

  - 使用 `#tb_name` 和 `table.getn(tb_name)`

    默认遇到 `nil` 便被判断为数组结束，最好不要用 `#` 和 `table.getn` 来获取包含有 `nil` 的数组长度

  - 感觉跟 `ipairs` 和 `pairs` 有关系，最好使用 `pairs` 遍历来获取长度

    ```lua
    tabletest = {a=1, b=2, c=3, d=5, e=7}
    local count=0
    for k, v in pairs(tabletest) do
        count = count + 1
    end
    print(count)     -----> 5
    ```

- 这里的数组也用表来表示，而且和 c 不一样，元素数据类型可以不相同，但是 `lua` 里**索引值是从 1 开始**

  ```lua
  -- 构造函数最后的逗号存在也没问题
  array = {"Lua", "Tutorial",}
  for i=0, 2 do
      print(array[i])
  end
  -- 输出 nil Lua Tutorial
  a = {1, 2, 4}
  a[-1] = -1 -- 这里并不像python那样-1是倒数第一个，而是真的是索引为-1
  for i=-1, 2 do
      print(a[i])
  end
  -- 输出 -1 nil 1 2
  ```

- 删除元素 [table.remove 和 nil 的区别](https://blog.csdn.net/maoliran/article/details/75734828)

  - 如果 table 作为字典，想要删除元素应该是赋值为 `nil`

  - 如果 table 作为列表/数组，想要删除元素就要看上面这个连接中描述的区别

#### 字典

- [判断 key 是否存在 table 中](https://blog.csdn.net/weixin_43789195/article/details/109188006)

- 判断是否空

  ```lua
  a = {}
  print(next(a) == nil)
  if a == {} then
  -- 这样的结果就是a == {}永远返回false
  -- 是一个逻辑错误。因为这里比较的是table a和一个匿名table的内存地址
  ```

- 可以通过点来操作，下标访问不存在的成员返回 `nil` 而不会报错

  ```lua
  dict_arg = {}
  dict_arg['a'] = 1
  print(dict_arg.a) --> 1 py没有这种操作
  print(dict_arg.b) --> nil 如果是python，这里也报错了
  print(dict_arg['c'])
  ```

- 字典赋值

  ```lua
  arg = {
    b = 1,
    c = 2,
    [11] = 22,  -- 末尾加逗号 也没关系
  }

  -- 等价于
  arg = {
      ['b'] = 1,
      ['c'] = 2,
      [11] = 22
  }
  -- 不可以 arg = {11 = 22}，同理不能通过arg.11来访问

  -- 访问
  print(arg.b)
  print(arg['b'])
  print(arg[11])

  arg = {}
  arg['b'] = 1
  arg['c'] = 2

  a = {
    aa = "111"
  }
  b = {
    a.aa = "222"  -- 不能这样
  }
  ```

- 字典取值

  ```lua
  a = {}
  x = "y"
  print(a.x) --> 输出 1
  print(a[x]) --> 输出 nil
  -- 容易将将 a.x 和 a[x]弄混淆
  -- 这里的第一种写法代表了 a['x']，也即，表 a 中由"x"索引的项
  -- 而第二种写法表示表 a 中由变量 x 所对应的值索引的项（因为table可以任意类型作为索引）
  print(a.y) --> 10 等同于 a['y']
  ```

- [获取字典长度](https://blog.csdn.net/weixin_34405925/article/details/86133607)

  ```lua
  -- 不能用 #tb_name
  local function getArgsLength(args)
    local s = 0;
    for k, v in pairs(args) do
      if v ~= nil then s = s + 1 end
    end
    return s;
  end

  function GetArrayLength(array)
    local n = 0
    while array[n+1] do
      n = n + 1
    end
    return n
  end
  ```

- 删除元素

  ```lua
  b = {}
  b['a'] = 1
  b['b'] = 2

  -- 删除元素
  b['a'] = nil  -- 用 table.remove(xx) 没效果的。。。。。
  ```

- [`ipairs` 和 `pairs` 遍历](https://www.runoob.com/note/11315)

  - `ipairs` 仅仅遍历值，按照索引升序遍历，索引中断停止遍历，遇到 nil 就停止了

  - `pairs` 迭代 table，可以遍历表中所有的 key 可以遍历包含 nil 的表

  ```lua
  a = {"one", "two", "three"}
  for i, v in pairs(a) do -- 类似于python的 dict.items()
      print(i, v)
  end
  -- 输出
  -- 1 one
  -- 2 two
  -- 3 three
  ------------------------------------------
  local tab= {
    [1] = "a",
    [3] = "b",
    [4] = "c"
  }

  for index, v in pairs(tab) do        -- 输出 "a" ,"b", "c"
    print(tab[index])
  end

  for index, v in ipairs(tab) do    -- 输出 "a" ,k=2时断开
    print(tab[index])
  end
  ```

- 点操作和下标操作的区别

  ```lua
  a = {}
  a['b'] = 1
  a['c'] = 2
  print(a.b) -- 1
  print(a['b']) -- 1
  print(a.c) -- 2
  print(a['c']) -- 2

  a = {b=1}
  print(a.b) -- 1
  print(a['b']) -- 1
  ```

- [`defaultdict`](https://stackoverflow.com/questions/10371155/is-there-a-pythons-defaultdict-functionality-available-in-lua)

  ```lua
  function defaultdict(default_value_factory)
      local t = {}
      local metatable = {}
      metatable.__index = function(t, key)
          if not rawget(t, key) then
              rawset(t, key, default_value_factory(key))
          end
          return rawget(t, key)
      end
      return setmetatable(t, metatable)
  end

  d = defaultidct(function() return {} end)
  table.insert(d["people"], {"Bob", "The Builder"})
  table.insert(d["people"], {"Bob2", "The Builder2"})
  print_r(d)
  ```

#### 集合

#### 链表

#### 队列

#### 元表 `metatable`

> 原表就是表的表，有点像 python 中元类的意思，可以为表定义一些原本不支持的行为

- 其他元方法

  ```lua
  -- [[
    Lua 中的值都具有元方法，只有 Table 可以重载
  ]]

  -- 所有元方法如下
  __add(a, b)                     for a + b
  __sub(a, b)                     for a - b
  __mul(a, b)                     for a * b
  __div(a, b)                     for a / b
  __mod(a, b)                     for a % b
  __pow(a, b)                     for a ^ b
  __unm(a)                        for -a
  __concat(a, b)                  for a .. b
  __len(a)                        for #a
  __eq(a, b)                      for a == b
  __lt(a, b)                      for a < b
  __le(a, b)                      for a <= b
  __index(a, b)                   for a.b
  __newindex(a, b, c)             for a.b = c
  __call(a, ...)                  for a(...)
  ```

- `_add`

  ```lua
  -- 为表重载一些元方法(metamethods)
  f1 = {a = 1, b = 2}
  f2 = {a = 2, b = 3}
  -- s = f1 + f2 不支持

  mm = {}
  function mm.__add(x, y)
      sum = {}
      sum.a = x.a + y.a
      sum.b = x.b + y.b
  return sum
  end

  setmetatable(f1, mm)
  setmetatable(f2, mm)
  -- 实际调用 f1 的 metatable 中的 __add(f1, f2)
  -- 只为 f1 设置元表也可以
  s = f1 + f2 -- s = {a = 3, b = 5}
  ```

- `__index` 元方法重载表中的提取符 `'.'`

  ```lua
  default_favs = {animal = "monkey", food = "donuts"}
  my_favs = {food = "pizza"}
  setmetatable(my_favs, {__index = default_favs})
  print(my_favs.food)  --> pizza
  print(my_favs.animal)  --> monkey
  ```

#### 表操作

- `table.pack`

- `table.insert`

- `table.sort`

#### 其他

- 怎么构造 json 数据

  ```lua
  local result = {}
  for i = 1, 2, 1 do
      result[tostring(i)] = {}
      result[tostring(i)]["up"] = 100
      result[tostring(i)]["down"] = 200
  --[[
  {
      "1": {
          "up": 100,
          "down": 200
      },
      "2": {
          "up": 100,
          "down": 100
      }
  }
  -- 如果不加 tostring，会得到如下结构
  [
      {
          "up": 100,
          "down": 200
      }
      {
          "up": 100,
          "down": 200
      }
  ]
  --]]
  ```

- [怎么把 `table` 打印出来](https://www.cnblogs.com/leezj/p/4230271.html)

```lua

print=print

-- print=log.debug  -- 打到模块日志
-- print=redis.log  -- 打到 redis 日志

function print_r(t)
    local print_r_cache={}
    local function sub_print_r(t,indent)
        if (print_r_cache[tostring(t)]) then
            print(indent.."*"..tostring(t))
        else
            print_r_cache[tostring(t)]=true
            if (type(t)=="table") then
                for pos,val in pairs(t) do
                    if (type(val)=="table") then
                        print(indent.."["..pos.."] => "..tostring(t).." {")
                        sub_print_r(val,indent..string.rep(" ",string.len(pos)+8))
                        print(indent..string.rep(" ",string.len(pos)+6).."}")
                    elseif (type(val)=="string") then
                        print(indent.."["..pos..'] => "'..val..'"')
                    else
                        print(indent.."["..pos.."] => "..tostring(val))
                    end
                end
            else
                print(indent..tostring(t))
            end
        end
    end
    if (type(t)=="table") then
        print(tostring(t).." {")
        sub_print_r(t,"  ")
        print("}")
    else
        sub_print_r(t,"  ")
    end
end
```

- 如何动态获取

  ```lua
  arg = {a=1, b=2, c=3}
  -- 如何动态获取，而不是获取C又要写一个 arg.c
  print(arg.a)

  arg = {}
  arg['a'] = 1
  arg['b'] = 2

  e = 'a'
  print(arg[e]) -- 1
  e = 'b'
  print(arg[e]) -- 2
  ```

- 如何判断是否属于表

### 字符串

- [`startswith` / `endwith`](https://www.jianshu.com/p/90a443b693aa)

- 大小写转换

  ```lua
  local upperstr = string.upper(q_sourcestr);
  local lowstr = string.lower(q_sourcestr);
  ```

- [正则表达式](https://www.cnblogs.com/meamin9/p/4502461.html)

  [Lua的字符串匹配与正则表达式](https://www.cnblogs.com/meamin9/p/4502461.html)

  - 不支持 `{7,9}` 这种形式来控制匹配重复次数，可以用整体长度来判断

- `trim` 左右空格

- 多行字符串

  > `[[...]]` 表示字符串。这种形式的字符串可以包含多行，可以嵌套且`不会进行转义`序列

  ```lua
  a = [[
    asdfa,a
    asdasd
    asdf,asdfas
  ]]
  ```

- 拼接字符串

  ```lua
  -- 可以这样多行
  a="asdfasdfasfa"..
  "afsdfasdf"
  ```

- 格式化输出

  ```lua
  print(string.format('test: %s', 'test'))

  -- 包含回车字符的字符串，相当于 a = "hello\nworld"
  a = [[ hello
  world]]
  ```

- `..` 连接两个字符串

  ```lua
  a = "str1"
  b = nil
  -- print(a .. b) -- 拼接nil会报错
  print((a or '') .. (b or '') == '') -- True
  ```

- `#"args"` 像 `bash` 一样，返回字符串长度

- `select("#", ...)` 获取可变参数数量

- `select(n, ...)` 数字 n 表示起点，select(n, ...) 返回从起点 n 到结束的可变参数

### `userdata`

> userdata 可以将 C 数据存置入 Lua 变量中

### 类型转换

> https://blog.csdn.net/mitu405687908/article/details/51137956

- 向下取整

  ```lua
  math.floor(num)
  num = 12.4
  print(math.floor(num)) 12
  ```

- 向上取整

  ```lua
  math.ceil(num)
  num = 12.4
  print(math.ceil(num)) 13
  ```

- 取整取余

  ```lua
  num = 12.4
  math.modf(num)
  integer, decimal = math.modf(num)
  print(integer) 12
  print(decimal) 0.4
  ```

- 字符串转换为数字

  ```lua
  str = io.read()
  n = tonumber(str)  -- 如果字符串不是正确的数值，会返回 nil，tonumber(nil) 也不会报错
  if n == nil then
      error(str .. " is not a valid nmber")
  else
      print("got a number: " .. n)
  end
  ```

## 控制语句

- `for xxx do yyy end` 而 `if xxx then yyy end`

### 循环

- `for` 循环

  ```lua
  -- 循环区间是两头闭合的 [start, end], python里的range是左闭右开
  for start, end, step do -- step 可不写，默认为1
      -- do something
  end
  -- for的三个表达式在循环开始前一次性求值，以后不再进行求值
  local function func(x)
      print("in function")
      return x*2
  end

  for i=1, f(5) do
      print(i)
  end

  -- 遍历数组
  for index = 1, #content do
      print(content[index])
  end

  -- 遍历字典
  for k, v in pairs(content) do
      print(k)
      print(v)
  end
  ```

- `while`循环

  ```lua
  local a = 10
  while a < 20 do
      print('a的值是:', a)
      a = a + 1
  end
  ```

- `repeat until`
  先执行循环体再判断循环条件，有点像 c 里面的`do...while`

  ```lua
  a = 10
  repeat
      print("a的值是:", a)
      a = a + 1
  until(a > 15)
  ```

- `break`

  ```lua
  local i = 1
  while a[i] do
    if a[i] == v then
      -- lua 规定，break和return只能出现在代码块的结尾一句
      -- 所以如果为了调试的话，可以自己加一个 do...end 代码块
      break
    end
    i = i + 1
  end
  ```

- `lua` 不支持 `continue`，不过可以通过下面的方法实现

  ```lua
  for i = 1, 10 do
    repeat
      if i == 5 then
        break
      end
      print(i)
    until true  -- 这里如果学错写成 True 的话就进入死循环了
  end
  ```

### 判断

- 逻辑运算符 `and、or、not`
  `not` 是逻辑判断，只能判断 `是否为真假或是否为nil`，不像 `python`，可以判断真假、0 或 1、None、空等

  ```lua
  a = xxxxx
  b = false
  if not a then print('a is nil') end
  if not b then print('b is false') end

  -- c 语言中 d = a ? b : c
  b = true
  c = true and 'yes' or 'no' --> yes

  a = 3
  b = 10
  b = b < a and a or b -- 取a和b之间最大值
  ```

- `if xxx else 语句`

  ```lua
  local a = 10
  local b = 20
  if a - b > 0 then
      print('xxx')
  end
  -- 没输出，先运算减

  if num < 50 then
      print('a')
  elseif num > 50 then
      print('b')
  else
      print('c')
  end
  ```

### 迭代器

```lua
-- 迭代器
function allwords()
  local line = io.read()  -- 当前行
  local pos = 1  -- 当前行位置
  return function ()  -- 迭代函数
    while line do  -- 遍历所有行
      local s, e = string.find(line, "%w+", pos)
      if s then
        pos = e + 1
        return string.gsub(line, s, e)
      else
        line = io.read()
        pos = 1
      end
    end
    return nil
  end
end

for word = allwords() do
  print(word)
end
```

## 函数

- 函数调用时，不要忽略其后面的一对小括号，如果函数只有一个参数，而且这个参数是一个字面量的字符串或是一个表的话，那么函数后面的一对小括号可以省略。

### 函数参数

- 引用传递 & 值传递
  **`lua` 中除了 `table` 是引用传递外，其他基本都是值传递**

  ```lua
  --[[
    引用传递示例
  ]]
  tb_origin = {
    "huang",
    "jin"
    "jie"
  }
  local tb_copy = tb_origin
  print(tb_origin)
  --> table: 0x7fffcd822950
  print(tb2)
  --> table: 0x7fffcd822950
  -- 可以看到两个 table 是指向同一个地址的，也可以通过下面的操作来证明

  --[[
    值传递示例
  ]]
  str = "huangjinjie"
  new_str = str
  str = string.gsub(str, "jinjie", "xxx")
  print(str)
  --> huangxxx
  print(new_str)
  --> huangjinjie 值传递，两者是完全不相干的两个变量
  ```

- 那怎么深拷贝一个表呢?

- **数组作为参数 unpack**

  > https://www.cnblogs.com/msxh/p/10054070.html

  ```lua
  print(unpack{10, 20, 30})
  --> 10    20    30

  a, b = unpack{10, 20, 30}
  --> a = 10, b = 20

  function foo(arg1, arg2)
    print(arg1, arg2)
  end
  test = {10, 20}
  foo(test)
  --> table: 0x7ffff8376360   nil
  foo(unpack(test))
  --> 10    20
  ```

- **默认参数**

  > Lua 函数实参和形参的匹配与赋值语句类似，多余部分被忽略，缺少部分用`nil`补足

  ```lua
  -- args 如果不传则认为是nil
  function send_msg(g_tunnel, warnmsg, args)
      if arg and arg > 0 then
          print(arg)
      end
  end

  function test_func(num)
    num = num or 1 -- 参数num默认值为1
    print(num)
  end
  ```

- 命令行参数

  ```sh
  m_kepler@DESKTOP-HSENS6B:~$ lua -h
  usage: lua [options] [script [args]].
  Available options are:
    -e stat  execute string 'stat'   # 直接执行 lua 代码
    -l name  require library 'name'  # 加载一个 lua 文件
    -i       enter interactive mode after executing 'script'  # 进入命令行交互模式
    -v       show version information
    --       stop handling options
    -        execute stdin and st

  lua -e "print('hello world')" test.lua a b
  arg[-3] = "lua"
  arg[-2] = "-e"
  arg[-1] = "print('hello world')"
  arg[0]  = "script"
  arg[1]  = "a"  # 从这里开始才是给 lua 脚本的入参
  arg[2]  = "b"
  ```

  ```lua
  -- 直接 arg， arg[0] 脚本文件名 arg[1] 开始是参数
  for i, v in ipairs(arg) do
    print(i, v)
  end
  ```

- [**变长参数 `...`**](https://blog.csdn.net/fanyun_01/article/details/69063148)
  `...` 表示该函数有可变数量的参数。当该函数被调用的时候，它所有的参数会被存入一个表变量，该变量是一个名为 `arg` 的隐藏变量，表中除了存储所有的参数之外，还附带一个额外的域 `n` 用来存储参数的个数

  ```lua
  function add(...)
    local s = 0
    -- 额，直接把...当成一个table了
    args = {...}
    for i, v in ipairs(args) do
      s = s + v
    end
    return s
  end
  -- print(add(3, 4, 10, 25, 12))
  ```

- 函数被调用时的参数怎么放

  ```lua
  -- 一般的调用和其他语言一样
  func_name(arg1, arg2)

  -- 特殊的是，如果函数只有一个参数，而且参数是字符串或表构造器，那么可以去掉括号
  -- 变得有点像 shell 了
  print "hello huangjinjie"

  ```

- **命名参数**
  `lua` 不可以像 `python` 那样支持显式给指定参数赋值，不过可以通过 `table` 来实现

  ```lua
  function func_test(arg)
    -- body
    return os.rename(arg.old, arg.new)
  end

  tb_arg = {
    old = "old_file",
    new = "new_file"
  }
  func_test(tb_arg)
  ```

### 闭包

- 当一个函数内部嵌套另一个函数的时候，位于内部的函数可以访问位于外包函数的局部变量

  ```lua
  local function addr(x)
      return function(y) return x + y end
  end
  ```

- 闭包为迭代器的实现提供了很好的机制，每次闭包成功调用后，这些外部的局部变量都可以保存执行之后的值，闭包可以凭借该值知道它在遍历过程中的位置

  ```lua
  function allwords()
  local line = io.read()  -- 当前行
  local pos = 1  -- 当前行位置
  return function ()  -- 迭代函数
    while line do  -- 遍历所有行
      local s, e = string.find(line, "%w+", pos)
      if s then
        pos = e + 1
        return string.gsub(line, s, e)
      else
        line = io.read()
        pos = 1
      end
    end
    return nil
  end

  function test_func()
    -- 每次循环都会执行一下allword函数，创建一个闭包
    for word in allword():
      print(word)
    end
  end
  ```

### 函数返回值

- 函数可以返回多个值，如果没有赋值给足够多的变量，后面的返回值会被舍弃

  ```lua
  function test()
      return 1, 2, 3
  end
  a, b, c = test() -- 如果是python的话，这里就报错了，python要么足够多变量要么就一个
  d = test()
  print(a) --> 1
  print(b) --> 2
  print(c) --> nil
  print(d) --> 1 多余的值会被忽略

  x, y = foo(), 20, 30
  --> x = 'nil', y = 20 即使foo()有多个返回值，也只取第一个值赋值给x
  ```

- 如果不确定函数有多少个返回值，又想把所有返回值都接收

  ```lua
  function foo() return 'a', 'b' end
  ret = {foo()}
  --> ret = {'a', 'b'}

  -- 如果函数作为表构造器中最后或者唯一的元素时，才会把函数的所有返回值加入到表
  -- 否则只会把第一个返回值加入到表中
  ret2 = {foo(), 4}
  --> ret2 = {'a', 4}
  ret3 = {11, foo()}
  --> ret2 = {11, 'a', 'b'}
  ```

- 也可以强制函数只返回一个值，只要用 `(foo())` 把函数括起来就行了

  ```lua
  -- 没必要的话最好不这样，因为你用一个变量来保存函数返回值就可以办到了

  print(foo())
  --> a    b 正常输出函数返回值
  function test()
      return foo() -- 正常返回函数的所有返回值
  end

  print((foo()))
  --> a 多加了一个括号之后就可以强制只返回一个

  function test2()
      return (foo()) -- 只返回函数的第一个返回值
  end
  ```

### 函数尾调用

- 尾调用并不像 c++调用函数那样要开辟额外的队长空间，而是类似**在函数最末尾**执行地址跳转 `goto` 的调用方式，这是一种优化方式，不限于 `lua`，递归很耗性能，但是可以把递归改造成使用尾调用

- 执行尾调用不需要在栈中保留有关调用者的任何信息，即不需要额外的栈空间，因此尾调用的嵌套层次是没有限制的

  ```lua
  function foo(n)
    if n > 0 then
      return foo(n - 1)  -- 尾调用不需要使用栈空间，无论n多大都不会导致栈溢出
    end
  end
  ```

- 尾调用样例

  ```lua
  -- 尾调用
  function func1()
    return g(x)
  end

  function foo(n)
    if n == 0 then
      return 1
    else
      return fac(n - 1) -- 尾调用
    end
  end

  -- 非尾调用
  function func2()
    g(x)
    return
  end
  -- 非尾调用
  function func3()
    return g(x) + 1
    -- return (g(x))
    -- return x or g(x)
  end
  ```

### 匿名函数

```lua
function ader(x)
-- 返回一个函数，闭包内封存x值
    return function(y) return x + y end
end

function test_func(path, do_something)
    return 'path:' .. path
end
-- 匿名函数作为参数传进去
local ret = test_func(file_path, function()
    print('lambda func in test')
end)
```

## 封装

### 模块

> 创建一个模块很简单，就是创建一个 `table`，然后把需要导出的常量、函数放入其中，最后返回这个 `table`

- 创建模块

  ```lua
  -- 文件名为 module.lua
  -- 定义一个名为 module 的模块
  local module = {}
  -- 定义一个常量
  module.constant = "这是一个常量"
  -- 模块内定义一个函数 - 方式一
  function module.func1()
    io.write("public func!\n")
  end

  --[[
  不能定义为 local
  local function module.test()
  end
  ]]

  -- 模块内定义一个函数 - 方式二
  module.func2 = function(x, y) return x + y end

  -- 模块内定义一个函数 - 方式三（表构造器）
  module2 = {
    func_add = function(x, y) return x + y end
    func_sub = function(x, y) return x - y end
  }

  -- 可以遍历模块里的函数
  for func_name, func in pairs(module2)do
    print("func_name is" .. func_name)
    func()  -- 执行函数
  end


  -- 所谓私有函数就是不把这个函数放到模块里。。。
  local function func2()
    print("private func!")
  end

  function module.func3()
    func2()
  end

  -- test_module.lua
  require "module" -- 可以直接require或者赋值给一个变量
  require (test .. "test/test") -- 用括号的作用是可以拼接字符串
  ```

- 模块调用的坑

  ```lua
  -- 坑，这样的话能正常通过module.fun4调用，但是入参为空
  -- [[
  -- a.lua
  module = {}
  local function module:fun4(test) -- 注意这里
    print('in module.fun4:', test)
  end
  return module

  -- b.lua
  mod = require "a" -- 运行 a.lua 模块中的代码
  print(mod.fun4('arg')) -- 输出为 in module.fun4 nil
  --]]
  return module
  ```

### 设置环境变量

```lua
local root_path = arg[1] or "/"
local cpath = {
    root_path .. "/lualibs/mig_log/?.so",
    root_path .. "/lualibs/?.so",
    root_path .. "/sf/sgp/platform/lualibs/?.so",
    root_path .. "/sf/sgp/auth/lualibs/?.so",
    root_path .. "/usr/lib/lua/?.so"
}
package.cpath = table.concat(cpath, ";")
local path = {
    root_path .. "/lualibs/?.lua",
    root_path .. "/sbin/?.lua",
    root_path .. "/bin/?.lua",
    root_path .. "/sf/sgp/platform/lualibs/?.lua",
    root_path .. "/sf/sgp/auth/?.lua",
    root_path .. "/sbin/status/?.lua",
    root_path .. "/sbin/fw/?.lua",
    root_path .. "/sbin/fw/fwserver/?.lua",
    root_path .. "/sbin/fw/fwweb/?.lua",
    root_path .. "/lualibs/network/?.lua"
}
package.path = table.concat(path, ";")
```

### 面向对象 `oop`

> 不支持 class，自己用 表 来实现

- 类

  ```lua
  Dog = {}                                -- 1.
  function Dog:new()                      -- 2.
      newObj = {sound = 'woof'}           -- 3.
      self.__index = self                 -- 4.
      return setmetatable(newObj, self)   -- 5.
  end
  function Dog:makeSound()                -- 6.
      print('I say ' .. self.sound)
  end

  mrDog = Dog:new()                       -- 7.
  mrDog:makeSound() --> "I say woof"

  --[[
    1. Dog 像类但实际是 Table

    2. Dog:new(...) 相当于 Dog.new(self, ...)
       看字符串方法 string.upper("xxx") 相当于 a = "xxx" a:upper()

    3. newObj 作 Dog 的实例

    4. self 是 Lua 中默认的参数，在这里 self = Dog
       继承的时候可以改变
       self.__index 与 self 的元方法 __index 不是一回事
       self = {__index = self, metatable = {__index = ...}}

    5. setmetatable(newObj, self) 相当于 setmetatable(newObj, {__index = self})
       赋予实例所有类方法

    6. 同 2.

    7. mrDog = Dog.new(Dog)
  ]]
  ```

- 继承

  ```lua
  LoudDog = Dog:new()
  function LoudDog:makeSound()
      s = self.sound .. ' '
      print(s .. s .. s)
  end
  seymour = LoudDog:new()
  seymour:makeSound() --> "woof woof woof"
  ```

## 模块加载机制

- [lua 中的 require 机制](https://www.cnblogs.com/lsgxeva/p/7761001.html)

- [Lua 中 dofile, loadfile, require 的区别](https://blog.csdn.net/u012861978/article/details/54667179)

Lua 会首先把代码预编译成中间码然后再执行（很多解释型语言都是这么做的）。在解释型语言中存在编译阶段听起来不合适，然而，解释型语言的特征不在于他们是否被编译，而是编译器是语言运行时的一部分，所以，执行编译产生的中间码速度会更快。我们可以说函数 `dofile` 的存在就是说明可以将 Lua 作为一种解释型语言被调用。

### `require`

> - `require` 加载的时候不用带目录，有自己的模块搜索逻辑；而且`会判断文件是否加载过，加载过就不加载了`
> - 标准库都是默认 `require` 进来的
> - 如果 `require` 找到了这个模块是个 `lua` 文件，则调用 `loadfile` 来加载该文件，如果是个 `so` 库，则调用 `loadlib` 来加载（加载代码而已，还没有运行）

- `require ("module_name")` 的处理流程

  - `package.loaded` 查找模块，`如果已经存在就直接返回`，即加载过的文件不会在加载一次

    - 所以如果我 `a.lua` 加载了模块 A，`b.lua` 也加载了模块 A，并不会多出一份内存

    - `package.loaded` 这个表会记录哪些模块被加载过，（可以通过清空这个来实现再次加载，而不会影响现有的执行--热更新），需要热更新一个文件只需要设置 `package.loaded[module_name] = nil`，下次 `require` 的时候就会重新加载新的文件。

  - `package.preload` 查找，如果 `preload` 存在，就把它当作 `loader`，调用 `loader(L)` 但是这些加载函数仅仅是加载它们，没有运行

  - `package.path` 查找 `lua` 库

  - `package.cpath` 查找 `C` 库

- `package.loaders` 供 `require` 控制模块加载的 table，每一个值都是一个查找函数；Lua 初始化这个表时提供四个函数

  - 第一个查找函数会去 `package.preload` 表里面查找；

  - 第二个查找函数会去找一个用于加载 `Lua` 库的 `loader`，然后根据 `package.path` 路径去找寻要加载的模块；

  - 第三个查找函数会去找一个加载 `C` 模块的 `loader`，然后根据 `package.cpath` 作为查找路径；

  - 第四个查找函数会使用一个 `all-in-one loader`, 主要用于 `C` 模块的查找，比如 require a.b.c, 它会找一个名为 a 的 C 库，如果找到了，就看里面有没有一个 `luaopen_a_b_c` 的供 lua 调用的函数。

- `require` 引入模块的时候会立即执行，返回的值是会被缓存的，`即使多次调用 require，被调用的文件也只会运行一次`
  所以 **最好不要在模块变量定义的时候调用函数来获取返回值**

  ```lua
  -- module_test.lua
  local function foo()
    print("function foo() in module_test")
    os.execute("sleep 1")
  end
  return {
    foo = foo
  }

  -- test1.lua
  -- 那么问题来了，如果我定义一个模块局部变量，local test = func_foo() 这个变量的值来自本模块的一个函数，这样是不是也耗时
  -- 也一样，会调用
  local mod_test = require "module_test"
  local mod_arg = mod_test.foo()

  -- test2.lua
  local mod_test = require "module_test"
  local mod_arg = mod_test.foo()

  -- test3.lua
  --  这样会导致 foo 被运行了两次
  local test1 = require("test1")
  local test2 = require("test2")
  ```

- `require` 大概流程如下

  ```lua
  function require(name)
    if not package.loaded[name] then
      -- 模块已加载过
      local loader = findloader(name)
      if loader == nil then
        error("unable to load module" .. module)
      end
      -- 标记模块已加载过
      package.loaded[name] = true
      -- 初始化模块
      local res = loader(name)
      if res ~= nil then
        package.loaded[name] = res
      end
    end
    return package.loaded[name]
  end
  ```

### `loadfile`

- [lua 基础： loadfile](https://www.jianshu.com/p/d2c120e342bf)

- [Lua 语言：函数级别的重载](https://zhuanlan.zhihu.com/p/76249694)

- 加载文件、`编译文件`，并返回一个函数，不运行；不会抛出错误信息，而是返回错误代码

- `loadfile` 只会在你指定的路径下搜索。如果不是绝对路径，那就是相对与当前目录的相对路径

- 被加载文件中的函数或语句仅仅会被加载编译，但不会执行，只有 `loadfile` 返回的函数执行以后，才会创建这些函数和执行文件中的语句；被加载文件中的全局成员，会被缓存，就是下次还可以使用，不用重新 loadfile，局部的就不行

- `lua` 的函数定义是发生在运行时的，而不是发生在编译时

  ```lua
  -- 如果没有入参，则默认从标准输入来获取内容
  f = loadfile(foo.lua)
  print(foo) --> nil -- 只是 `func` 被编译了，但还没有定义，运行起来的时候才有
  f() --> 定义
  foo("ok") --> 可以直接执行 foo.lua 里的全局函数，执行后这个函数会缓存起来，下次还可以执行，不用loadfile

  -- 可以快捷的这样做
  loadfile("foo.lua")()
  ```

- 看样子 `loadfile` 是把模块的函数加载到全局变量里了，不用模块也能直接执行，那如果 `loadfile()` 同时加载两个文件，包含同名函数会怎么样呢

  ```lua
  --  这样会导致 foo 被运行了两次
  local test1 = loadfile("test1.lua")
  test1()
  do_get()
  -- 只能这样分开，否则执行的就是最后加载进来的模块里的函数

  local test2 = loadfile("test2.lua")
  test2()
  do_get()

  -- 可以通过指定加载到全局变量的方式改变这种情况（但是要注意别覆盖已有的变量）
  local function mod_regist(mod_file)
    -- 因为 loadfile 得到的是地址，没办法拿到函数名，所以只能用地址作为函数名了
    local mod_func = mod_file()
    if not mod_func or _G[mod_func] then
      return
    end
    _G[mod_func] = mod_func
  end
  local test1 = loadfile("test1.lua")
  local test2 = loadfile("test2.lua")

  local new_test1 = mod_regist(test1)
  local new_test2 = mod_regist(test2)
  new_test1.do_get()
  new_test2.do_get()
  _G[test1] = nil
  _G[test2] = nil
  ```

- `loadfile(test.lua)` 和 `require` 不一样，这个东西需要加后缀；加载 lua 文件，但是不会运行

  ```lua
  function dofile(file_name)
    -- 让 loadfile 失败的时候抛出错误
    local fd = assert(loadfile(file_name))
    -- 根据 loadfile的返回函数运行一遍
    return f()
  end
  ```

### `loadstring`

> 与 `loadfile` 相似，只不过这里读入的是个字符串

```lu
-- 有点 python 的偏函数的感觉，把一些固定下来的东西用一个新的函数名替代
local func = loadstring("i = i + 1")
func()  -- 是一个函数，调用时执行 i = i + 1
```

### `loadlib`

### `dofile`

> - 使用 `dofile` 加载文件的时候，会返回一个编译的函数调用，只有调用了相应的方法才能用到文件中的函数，否则里面的函数是没有定义的，不能调用

- 与 `require` 的区别是

  - `dofile` 必须加 `.lua` 后缀，`require` 则不用

    ```lua
    local test = dofile("os_test.lua")
    local test = require("os_test")
    ```

  - `require` 只会加载一次，加载的时候执行；`dofile` 每次都会加载文件但不执行

- 与 `loadfile` 的区别

  - `dofile` 其实是包装了 `loadfile`；根据 `loadfile` 的返回函数运行一遍
  - 如果运行一个文件多次的话， `loadfile` 只需要编译一次就可以多次运行，而 `dofile` 则需要每次都编译

- `dofile("module")` 引入模块时，不会执行模块代码（不会缓存版本的 `require`）

  ```lua
  -- test.lua
  function norm(x, y)
      local n2 = x ^ 2 + y ^ 2
      return math.sqrt(n2)
  end

  function twice(x)
      return 2 * x
  end

  -- ternimal
  > dofile("test.lua")
  > n = norm(3.4, 1.0)
  > prinr(twice(n))
  ```

- `-l` 执行代码文件

  ```lua
  -- a.lua
  print('in a.lua')

  -- b.lua
  print('in b.lua')

  $lua -la -lb
  in a.lua -- 执行a文件
  in b.lua -- 执行b文件
  Lua 5.1.5  Copyright (C) 1994-2012 Lua.org, PUC-Rio
  > -- 进入lua交互模式

  $lua -i -la -lb
  Lua 5.1.5  Copyright (C) 1994-2012 Lua.org, PUC-Rio
  > -- 进入lua交互模式
  in a.lua -- 执行a文件
  in b.lua -- 执行b文件
  ```

### `package`

- `package.path`

  保存加载外部模块的搜索路径，可通过环境变量 `LUA_PATH` 来进行配置；在 `lua` 虚拟机启动时设置

  ```sh
  export LUA_PATH="~/lua/?.lua;;"
  # 以 ; 分隔,最后的 2 个 ;; 表示新加的路径后面加上原来的默认路径
  # 目标模块在 /sbin/easydeploy/product/product_info.lua 下

  export LUA_PATH="/usr/local/share/lua/5.1/?/init.lua;;"  # 注意这里的 /?/init
  # a = require "test"
  # 则会去搜索 /usr/local/share/lua/5.1/module.lua、/usr/local/share/lua/5.1/module/init.lua

  # test.lua
  require "product/product_info.lua"
  require "product.product_info.lua" -- 也可以用点

  # 导入方法：
  # ?.lua 可以匹配目录下的所有.lua文件（包括子目录）
  export LUA_PATH="$LUA_PATH;/sbin/easydeploy/?.lua"
  ```

- `package.cpath` 保存加载第三方 C 库的路径，可通过环境变量 `LUA_CPATH` 来进行配置

- `package.loadlib(lib_name, func_name)` 相当于手工打开 C 库，并导出函数返回，`loadlib` 其实就是 `ll_loadlib`

- `package.preload`

- `package.loadeers`

## 异常处理

- `pcall`

  ```lua
  -- lua_pcall(lua_State *L,int nargs,int nresults,int errfunc)
  function test_func(arg)
      print("do_something with " .. "arg")
      return "result in test func"
  end

  -- 通常会用一个匿名函数来作为第一个参数
  local rec, ret = pcall(test_func, "arg_huangjinjie")
  if rec == ture then
      print("do test_func success, get return: " .. ret)
  else
      print("do test_func failed")
  end
  ```

- `xpcall`

## 调试

> `lua` 本身没有提供调试器

### `debug` 库

- `upvalue` 大概就是函数定义之前变量的意思

### 命令行调试

- [调试 lua 代码](https://www.cnblogs.com/baiyanhuang/archive/2013/01/01/2841398.html)

### 调试 `so` 库

- 编写好 so 库后用 lua 引用报 core 了

  ```lua
  > package.cpath = "/path/to/lib/?.so"
  > a = require "license_tool"
  > print(a.is_lic_activated("sn"))
  > Segmentation fault
  ```

- 调试

  ```sh
  # 找到core文件（事先打开允许coredump，并设置 ulimit -c unlimited）
  $gdb /usr/bin/lua /path/to/your/core
  (gdb) bt # 查看堆栈信息，这里可以看到哪里出错
  (gdb) b license_tool.c:44 # 在44行设置断点
  (gdb) r  # 运行程序，此时会打开一个lua解析器
  # 把上面的lua代码敲上去，调用 a.is_lic_activated('sn') 的时候会触发断点
  ```

## 其他

- [`lua` 和 `luajit`](https://blog.csdn.net/liao392781/article/details/97132095)

- [迭代器](https://www.jb51.net/article/147517.htm)

- 三元运算符

  ```lua
  x = 20
  y = 30
  max = (x > y) and x or y
  ```

- `if...else`

  ```lua
  -- 如果没有传timeout的话，默认是2
  timeout = timeout or 2
  ```

- 运算符优先级

  ```lua
    ^
    not - (unary)
    *   /
    +   -
    ..
    <   >   <=  >=  ~=  ==
    and
    or
  ```

- lua 是大小写敏感的，`and` 是关键字，`AND` 不是

- 怎么退出终端?

  ```lua
  -- 直接Ctrl + D 或者 Ctrl + C
  os.exit(2) -- 或者调用os库的退出函数，返回码设置为 2
  ```

- 语句结尾的封号可有可无

- 运算符优先级

- 赋值

  ```lua
  a = 'aax'
  b = a
  print(a)
  print(b)
  b = nil -- a和b都指向常量'aax'，b接触引用对a没有影响
  print(a)
  print(b)
  ```

- 移除引用 `mytable = nil`， lua 垃圾回收会释放内存

- 代码作用域用 `end` 表示结束

- `~=` 表示不等于

- `nil` 表示空，使用的时候要用 `"nil"`

- 自增/减操作

  ```lua
  -- 没有 ++ 或 += 自增操作符号
  num = num + 1
  ```

- 字符串和 python 一样，可以用单引号或双引号括起来

- Lua 中的变量全是全局变量，那怕是语句块或是函数里，除非用 `local` 显式声明为局部变量。

- 多行注释 `--[[xxx\nxx]]`
