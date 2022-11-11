- [参考资料](#参考资料)
- [语法](#语法)
  - [变量](#变量)
    - [运算](#运算)
    - [数据类型](#数据类型)
    - [数组](#数组)
    - [字符串](#字符串)
      - [`expr`](#expr)
    - [`"<" 、 "<<" 、 "< <" 、"<<<"` 的含义](#-------的含义)
    - [变量 `$`](#变量-)
    - [变量替换](#变量替换)
    - [替换 / 截取 / split](#替换--截取--split)
    - [字典](#字典)
    - [`json`](#json)
  - [**正则表达式**](#正则表达式)
  - [运算符](#运算符)
    - [功能](#功能)
  - [流程控制](#流程控制)
    - [条件判断](#条件判断)
    - [循环](#循环)
  - [函数](#函数)
    - [返回值](#返回值)
    - [函数参数](#函数参数)
- [IO](#io)
  - [文件读取](#文件读取)
  - [操作 json 数据](#操作-json-数据)
    - [`jq`](#jq)
- [封装](#封装)
- [异常处理](#异常处理)
  - [`> /dev/null 2>&1`](#-devnull-21)
- [`awk`](#awk)
  - [使用方法](#使用方法)
    - [计算](#计算)
  - [内置变量](#内置变量)
  - [分组统计](#分组统计)
  - [实例](#实例)
- [`sed`](#sed)
  - [使用记录](#使用记录)
  - [定位某一行](#定位某一行)
  - [选项](#选项)
  - [命令](#命令)
- [规范](#规范)
  - [注释规范](#注释规范)
- [其他](#其他)
  - [shell 解释器类型](#shell-解释器类型)
  - [各种括号的使用](#各种括号的使用)
  - [单例](#单例)
  - [TIPS](#tips)
- [Shell](#shell)
  - [`shell` 远程](#shell-远程)
  - [生成随机数](#生成随机数)
  - [环境变量](#环境变量)
  - [`ssh`](#ssh)
  - [base64](#base64)
  - [MD5](#md5)
  - [拆分大文件](#拆分大文件)
  - [测试方法](#测试方法)
  - [flock](#flock)

# 参考资料

- [SHELL 教程](https://www.cnblogs.com/maybe2030/p/5022595.html)

- [Linux Shell 系列文章大纲](https://www.junmajinlong.com/shell/index)

# 语法

## 变量

- `${#array}` 获取字符串长度

- 执行拼接出来的命令

  ```sh
  a="ls -l"
  $a
  ```

- 变量不能有数字？

  ```sh
  # 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头
  2516master=`git rev-parse --verify remotes/origin/master`
  # 报错 command not found
  ```

- `shift` 把参数位置**左移**，比如 `shift 3`（不带参数相当于 `shift 1`）后，原本第四个参数 `$4` 就变成了 `$1`

  ```sh
  while [ "$1" != "" ]; do
  case $1 in
          -s )           shift
                         SERVER=$1
                         ;;
          -i )           shift
                         INSTANCE=$1
                         ;;
          -u )           shift
                         USER=$1
                         ;;
          -p )           shift
                         PASSWORD=$1
                         ;;
          -w )           shift
                         WARNINGVAL=$1
                         ;;
          -c )           shift
                         CRITICVAL=$1
                         ;;
      esac
      shift
  done
  ```

- 定义

  ```sh
  #!/bin/sh
  # 等号左右没有空格
  arg_name="arg_value"

  # 只读变量
  arg_name="Zara Ali"
  readonly arg_name

  # 删除变量
  unset arg_name
  ```

- [`declare`](https://blog.csdn.net/weixin_41585557/article/details/82752655)

- `local` 局部变量

  > `local [option] name[=value] …`，为每一个参数创建名为 name，值为 value 的变量。选项可以接受 `declare` 命令的所有选项。`local` 只能在函数中使用，变量的作用域为函数机器子函数。`返回状态为零，除非在函数外部使用 local、提供了无效的名称或 name 是只读变量`

  ```sh
  function test()
  {
    err_file=$1
    err_out=$(tail -n 3 $err_file)
    # 声明一个作用域在函数内的局部变量
    # local test=$(echo "$err_out" | sed "s/\"/'/g" | iconv -f gbk -t utf-8) # 这里有个问题，无论上面的test赋值语句怎么写，都会返回错误码0
    local test
    test=$(echo "$err_out" | sed "s/\"/'/g" | iconv -f gbk -t utf-8)
    if [ $? -eq 0 ]; then
      echo "err"
      return 1
    fi
    echo "succ"
    return 0
  }
  ```

- 全局变量

  ```sh
  hw_info=/hwinfo # 文件
  cmd_getgwid=$(getgwid)  # 命令
  function test()
    local id=${cmd_getgwid}
    local hwinfo=$(cat ${hw_info})
  ```

- 环境变量

- 取值

  ```sh
  arg_b=$arg_name
  ```

- `${test}` 和 `$test` 的区别

  大括号加不加都行，加花括号是为了帮助解释器识别变量的边界

  ```sh
  for skill in Ada Coffe Action Java; do
    # 如果不加花括号，会把 $skillScript 当成一个变量
    echo "I am good at ${skill}Script"
  done
  ```

- 利用`附加字符 x`来判断变量是否已定义

  ```sh
  # 因为未定义 $pid 和 定义了而且赋值为空无法区分

  # 防止出现语法错误
  # 如果不写X，当$?为空或未设置时，语句被解释为 if [ = "0" ]， 出现语法错误
  # 加上X后解释未 if [ X = X"0" ] ，依然正确。当$? 不为空时，两者是一样的。

  # 【关联】 + - = ? 变量替换
  if [ "x$pid" == "x" ]; then
      echo arg pid is not exist
  fi

  # https://zhidao.baidu.com/question/362139754450399132.html
  if [ x"$pids_in_docker" == x ]; then
      echo "$pids"
  fi
  ```

### 运算

> https://www.cnblogs.com/wang618/p/11037348.html

- 运算符号，运算符之间可以加空格

  | 符号 | 意义 |
  | :----------------- | :------------------------- |
  | `+，-` | 加法，减法 |
  | `*，/，%` | 乘法，除法，取余 |
  | `++，--` | 自加一，自减一 |
  | `= += -= *= /= %=` | 赋值运算（例 a+=1,即 a=a+1） |
  | `< <= > >=` | 比较大小 |
  | `**` | 幂运算（上面的都和 C 一样） |

- 运算命令

  | 命令 | 意义 |
  | :----- | :-------------------------------------- |
  | `(())` | 运算，括号内只要符合 C 语言运算规则都可以 |
  | `let` | 用于整数运算，和(())类似 |
  | `expr` | 用于整数运算，共呢个相对较多 |
  | `bc` | linux 下的计算器，适合整数和小数运算 |
  | `$[]` | 用户整数运算 |

  ```sh
  let var=100+1 # 这里如果运算符要加空格的话，要加上括号
  let var=(100 + 100)

  echo $[1 + 300]
  # echo $cnt++  TODO 不行啊
  echo $((1 + 1))   # C 语言规则运算
  echo $((1 <= 2))  # 为真输出 1，为假输出 0

  echo $((2#10 + 4))  # 输出6； 2# 表示10是个二进制数

  # expr 是一个Linux命令，运算符两边要加空格
  number=$(expr 2+1)  # 输出 2+1
  number=$(expr 2 + 1)  # 输出 3
  # expr: date +%s 时间错比较的时候，可能会报错：non-integer argument

  number=$(expr 2 \* 1)  # 输出 2 因为 * 是通配符，要做转义

  # sudo apt instal bc
  echo '1 + 100 * 2' | bc

  # bash内置随机数变量 RANDOM
  echo $RANDOM # 0-32767
  echo $[RANDOM % 50]
  ```

- 更高级一点的，使用 `bc`

  ```sh

  ```

### 数据类型

- shell `只有字符串一种数据类型`，如果字符串是数字，也可以进行算术运算

- `declare` 用来声明变量是数字变量

  ```sh
  declare -i n=10
  declare -i m=10
  ```

### 数组

[shell 脚本中关联数组及其遍历](http://niliu.me/articles/1197.html)

- 数组一般使用 `(item1 item2)` 来定义

  ```sh
  # 元素间使用空格分隔
  array1=(item1 item2 item3)

  # 使用下标初始化，可以使用不连续的下标，而且下标没有范围边界
  # 和 c 一样，可以通过下标来取数组的值
  aray2=[0]=item11
  aray2=[1]=item12
  aray2=[2]=item13
  ```

- 遍历数组

  ```sh
  a="1 2 3"
  # 字符串元素一个个输出
  for i in $a; do echo $i; done

  # 直接输出字符串
  for i in "$a"; do echo $i; done
  ```

- 数组作为参数传递

  ```sh
  # test_dict
  test_func ${ca_contents[@]}
  ```

- [判断元素是否在数组中](https://www.cnblogs.com/thatsit/p/bash-shu-zupan-duan-mou-ge-yuan-su-shi-fou-zai-shu.html)

  ```sh
  https://blog.csdn.net/m0_37886429/article/details/106545946
  ```

- [sh 和 bash 的数组差异](http://www.kbase101.com/question/31037.html)

  ```sh
  array=(var1 var2 var3 var4)  # 定义数组，元素用一个或多个空格隔开
  # bash两种都支持，sh 不支持这种定义，可以使用字符串的方法
  # array2="var1 var2 var3 var4"
  # array3=" # 可以这样换行
  # var1
  # var2
  # "
  for((i=0; i<${#array[@]}; i++)); do
    echo "${array[i]}"
  done
  # sh不支持上述循环方法
  # for item in $array; do
  #     echo $item
  # done
  ```

- [模拟二维数组](https://blog.51cto.com/0101x/1375848)

  ```sh
  arr=('1 2 3' '4 5 6' '7 8 9')
  function test()
  {
      echo $*
  }
  for i in "${arr[@]}"; do
      echo $i
      test $i
  done
  # 输出如下
  # 1 2 3
  # 4 5 6
  # 7 8 9
  ```

- 获取数组长度

  ```sh
  # 取数组元素个数
  length=${#array[@]}
  # 或者
  length=${#array[*]}
  ```

- 数组追加元素 `append`

  ```sh
  a="1
  2
  3
  4"
  new_a="$a 5"
  ```

- 传入数组

  ```sh
  # test.sh
  # 这里不能先用 params="$@" 接变量，否则还是会变成字符串
  for i in "$@"; do
      echo $i
  done

  #bash test.sh '1 2 3' '4 5 6' '7 8 9'
  # 输出如下
  # 1 2 3
  # 4 5 6
  # 7 8 9
  ```

- 传入数组作为参数，批量操作

  ```sh

  make_p12()
  {
      echo "do something"
  }

  batch_make_p12()
  {
      for param in "$@"; do
          make_p12 $param
          if [ $? != 0 ]; then
              echo "make_p12 failed, param: $param"
              exit 1
          fi
      done
      exit 0
  }

  batch_make_p12 "$@"
  ```

### 字符串

> https://www.cnblogs.com/chengmo/archive/2010/10/02/1841355.html > https://www.cnblogs.com/sunada2005/p/3452711.html > https://www.cnblogs.com/kevingrace/p/5996133.html

- 切片

  ```sh
  name="huangjinjie"
  echo ${name:0:5}
  # 输出 huang
  ```

- [比较版本号](http://www.linuxdown.net/install/faq/20160319_how_linux_5069.html)

- 去除字符串前后空格

  ```sh
  # 使用echo去除前后空格
  local cpu=$(echo $(lscpu | grep 'Model name' | awk -F : '{print $2}'))
  ```

- 字符串可以用单引号，也可以用双引号，也可以不用引号

  ```sh
  # 单双引号是有区别的
  TEST=/usr/bin/
  cmd="${TEST}/test asdfasd"
  echo $cmd  # 输出时 ${TEST} 已经被替换了

  cmd2='${TEST}/test asdfasd'
  echo $cmd  # 原滋原味输出，变量不会被替换
  ```

- [字符串变量到底要不要加双引号](https://www.cnblogs.com/lonecloud/p/9066199.html)

  ```bash
  ini_path="~/test.ini"
  cat $ini_path  # 这里直接报错了，ini_path 不用双引号就正常

  # 建议加上双引号，要不然会出现问题
  function test()
  {
    echo $1 $2 $3
  }
  # 如果这里的 [2222] 值是 [22 22] 那么最后的 [3333] 参数不会传到 test，因为 [22 22] 已经作为两个参数传入test了，所以加双引号保险点
  test "1111" "2222" "3333"
  ```

- 双引号里可以有变量 `${arg}`，可以有转义字符

#### `expr`

> [Linux 技巧：使用 expr 命令获取子字符串和字符串长度](https://segmentfault.com/a/1190000022722471)

- `expr index STRING CHARS` 获取指定字符在字符串中的位置

- `expr substr STRING POS LENGTH` 从字符串中获取到子字符串

- `expr length STRING` 获取字符串的长度

### `"<" 、 "<<" 、 "< <" 、"<<<"` 的含义

- [怎么理解 shell 中的 "<" 、 "<<" 、 "< <" 、"<<<" 的含义](https://www.jianshu.com/p/70136d731ca0)

### 变量 `$`

| 变量 | 含义                                                           |
| :--- | :------------------------------------------------------------- |
| `$0` | 当前脚本的文件名                                               |
| `$n` | 传递给脚本或函数的参数。n 是一个数字，表示`第几个参数`         |
| `$#` | 传递给脚本或函数的`参数个数`                                   |
| `$*` | 传递给脚本或函数的`所有参数`，参数会被解析成一个**字符串**     |
| `$@` | 传递给脚本或函数的`所有参数`，参数会被解析成一个**数组**       |
| `$?` | 上个命令的退出状态                                             |
| `$$` | 当前 Shell`进程ID`。对于 Shell 脚本，就是这些脚本所在的进程 ID |

- [`$*` 和 `$@` 的区别](https://www.cnblogs.com/tele-share/p/9080069.html)

  ```sh
  #!/bin/bash
  test()
  {
      echo "未加引号,二者相同"
      echo $*
      echo $@

      echo "加入引号后对比"
      for N in "$*"
      do
         echo $N
      done

      echo "----------"
      for N in "$@"
      do
         echo $N
      done
  }
  test  12 123  3424 546

  #### 输出以下 ###
  未加引号,二者相同
  12 123 3424 546
  12 123 3424 546
  加入引号后对比
  12 123 3424 546
  ----------
  12
  123
  3424
  546
  ```

### 变量替换

- 变量替换

  ```sh
  file=/path/to/test.file.txt
  # 把第一个path替换成path_new
  ${file/path/path_new}
  # 把全部path替换成path_new
  ${file//path/path_new}
  ```

- 变量赋值 `+ - = ?`

  > 不太清楚应用场景，这里对变量是否已定义比较模糊

  - 说明

    - `file=` 表示`已定义`具体的值

    - ~~`file=x`~~ 表示没有定义过这个变量，即`没定义或为空值`

    - XXX 不清楚这里是怎么知道我没定义变量的，因为没定义和定义了赋为空，`echo $arg` 得到的值都是空

  - 总结

  ```sh
  # 左边是原变量，中间是逻辑判断，右边是判断结果后的值
  ${file-myfile.txt} ${file+myfile.txt}
  ${file=myfile.txt} ${file?myfile.txt}

  - 表示 如果 $file 没定义 则 myfile.txt 作为 $file 的值
  + 表示 如果 $file 已定义，则使用 myfile.txt 作为 $file 的值

  = 表示 如果 $file 没定义，则使用 myfile.txt 作为 $file 的值；而且将 $file 赋值为 myfile.txt

  ? 表示 如果 $file 没定义，则将 myfile.txt 输出到 STDERR

  如果有file=定义
  : 带冒号时，才会进行判断输出右边的值
  : 不带冒号时，不会进行判断输出右边的值

  如果没有file=定义
  : 带冒号时，才会进行判断输出右边的值
  : 不带冒号时，也会进行判断输出右边的值
  ```

### 替换 / 截取 / split

> [shell 中的${}，##和%%的使用](https://www.cnblogs.com/sherlockhomles/p/3837113.html)

- [截取](https://blog.csdn.net/u010003835/article/details/80750003)

  ```sh
  #!/bin/bash

  string="hello,shell,split,test"
  array=(${string//,/ })

  for var in ${array[@]}
  do
    echo $var
  done
  ```

- 根据空格截取

  ```sh
  param='2048 your_cn_name1 CN GD SZ sanfor dc your_pwd1'
  cn_name=$(echo $param | awk -F " " '{print $2}')
  ```

- `#` 是去除左边；`%` 是去除右边，这两个字符在键盘上刚好在 `$` 字符的左右

- 单个 `#` 或 `%` 表示最小匹配，两个 `#` 或 `%` 则是最大匹配

  ```sh
  # "$" 和 "%" 分别在 "$" 左右两侧
  # 可以看做是 # 是从左往右匹配； % 是从右往左匹配
  # 一个表示最小匹配（找第一个）、两个表示最大匹配（找最后一个）

  file=/path/to/test.file.txt

  ######### 左边 #########
  # / 表示匹配的词，可以换成其他的
  # 删除第一个 / 及其左边的字符串: path/to/test.file.txt
  ${file#*/}
  # 删除最后一个 / 及其左边的字符串: test.file.txt
  ${file##*/}

  # 删除第一个 . 及其左边的字符串: file.txt
  ${file#*.}
  # 删除最后一个. 及其左边的字符串: txt
  ${file##*.}

  ######### 右边 #########
  # 删掉最后一个 / 及其右边的字符串: /path/to/
  ${file%/*}
  # 删掉第一个 /  及其右边的字符串: (空值)
  ${file%%/*}
  # 删掉最后一个 . 及其右边的字符串: /path/to/test.file
  ${file%.*}
  # 删掉第一个 . 及其右边的字符串: /path/to/test
  ${file%%.*}
  ```

- 截取子串

  ```sh
  file=/path/to/test.file.txt
  # 提取最左边的5个字符: /path
  ${file:0:5}

  # 从第5个字符开始，截取5个字符: /to/te
  ${file:5:5}
  ```

- 去除前缀

  ```sh
  a=/app1/path/to/my/test/dir  # 把/path 去掉
  b=/app2/path/to/my/test/dir  # 把/path 去掉
  echo ${a#*/app[[:digit:]]}
  echo ${b#*/app[[:digit:]]}
  ```

- 去除文件后缀

  ```sh
  test="aaaa.cpp"
  # -d 表示分隔符
  # -f[n] 取分割后的第 n 段
  echo $test | cut -d . -f1
  ```

- 去除字符串中的某个字符

  ```sh
  a="AA-BB"
  # 只替换一个
  b=${a/-/}  # 把空格替换成 - ： b=${a/ /-}
  # 全部替换
  b=${a//-/}
  ```

### 字典

- [shell 数组、字典、source、split 简单实例](https://blog.csdn.net/u014297722/article/details/54601660)

- 定义

  ```sh
  declare -A test_dict
  test_dict=(
    ["aaa"]="11111"
    ["bbb"]="22222"
    ["ccc"]="ddd"
  )
  ```

- 访问

  ```sh
  for src in ${!test_dict[*]}; do
      dst=${test_dict["$src"]}
      echo "key=$src value=$dst"
  done
  ```

- append 添加一个

  ```sh
  test_dict+=(["eeeee"]="ddddd")
  ```

### `json`

## **正则表达式**

> [shell 中正则表达式的使用](https://www.cnblogs.com/fusheng11711/p/10794663.html)

- 好像在 `shell` 里，什么地方都可以用正则表达式，比如 `echo [a-b].txt`

## 运算符

- 逻辑运算符

### 功能

- 拼接字符串

  ```sh
  greeting="hello, "$your_name" !"
  greeting='hello, ${your_name} !'
  ```

- 两端去除空白字符

## 流程控制

### 条件判断

`[ xxxx ]` 即 test 命令

- `if`

  ```sh
  if [ -f ${test_file}]; then
     # body
  elif [ ${test} = true ] && [ -f ${test_file} ]; then
     # body
  else
     # body
  fi
  ```

- `case`

  ```sh
  read color
  case "$color" in
  blue)
      echo $color is blue
      ;; # 表示 break
  green)
      echo $color is green
      ;;
  red | orange)
      echo $color is red or green
      ;;
  *)
      echo "not a color"
      ;;
  esac # case的反写

  ```

- 数值判断

  | 表达式 | 意义           |
  | :----- | :------------- |
  | `-eq`  | 等于则为真     |
  | `-ne`  | 不等于则为真   |
  | `-gt`  | 大于则为真     |
  | `-ge`  | 大于等于则为真 |
  | `-lt`  | 小于则为真     |
  | `-le`  | 小于等于则为真 |

- `-eq` 用于 INTEGER 类型比较； `=` 即适用于 STRING 类型比较，又适用于 INTEGER 类型比较 |

- 字符串

  | 表达式        | 意义                              |
  | :------------ | :-------------------------------- |
  | `= 或 ==`     | 等于则为真                        |
  | `!=`          | 不相等则为真                      |
  | `-z 字符串`   | 字符串的长度为零则为真            |
  | `-n 字符串`   | 字符串的长度不为零则为真          |
  | `str1 < str2` | 按字母排序，str1 排在 str2 则为真 |

- 文件判断

  | 表达式            | 意义                                                     |
  | :---------------- | :------------------------------------------------------- |
  | `-b 文件名`       | 如果文件存在且为块特殊文件则为真                         |
  | `-c 文件名`       | 如果文件存在且为字符型特殊文件则为真                     |
  | `-d 文件名`       | 如果文件存在且为目录则为真                               |
  | `-e 文件名`       | 如果文件存在则为真                                       |
  | `-f 文件名`       | 如果文件存在且为普通文件则为真                           |
  | `-r 文件名`       | 如果文件存在且可读则为真                                 |
  | `-w 文件名`       | 如果文件存在且可写则为真                                 |
  | `-x 文件名`       | 如果文件存在且可执行则为真                               |
  | `-s 文件名`       | 如果文件存在且至少有一个字符则为真                       |
  | `file1 -ef file2` | 如果 file1 和 file2 指向同一文件则为真                   |
  | `file1 -nt file2` | 如果 file1 比 file2 新，或 file1 存在 file2 不存在则为真 |
  | `file1 -ot file2` | 和 -nt 相反                                              |

### 循环

- `for`

  ```sh
  for ((i = 0; i < count; i++)); do
      echo ${i}
      if [ ! -d /tmp ]; then
        continue;
      fi
  done

  for i in $(seq ${count}); do
      echo ${i}
  done
  ```

- `while`

  ```sh
  number=0
  while [ $number -lt 0 ]; do
      echo "$number"
      number=$(expr $number + 1)
  done
  ```

- `until`

  ```sh
  var=1
  until
      echo $var
  do
      (($var++))
      echo $var
  done
  ```

## 函数

- 定义

  ```sh
  function func_name() {
      # 也可以不加关键字 function
      echo "in func_name"
  }
  ```

- 当函数名和系统命令相同时，`$(cmd_name)` 实际调用的是文件中的函数

### 返回值

> - [shell 函数（调用、返回值，返回值获取）](https://www.cnblogs.com/duanxz/p/4661767.html)
> - [shell 脚本——如何获取函数的返回值](https://blog.csdn.net/qq_31598113/article/details/80611480)

- 如果是要命令返回值的话，直接用变量接着得了

  ```bash
  # 获得文件大小
  function filesize() {
      ls -alt ${1} | grep -v ^d | awk '{if ($9) printf("%s",$5)}'
  }
  # 用变量接函数返回值
  file_size=$(filesize ~/test.ini)
  ```

- `return` **只能用来返回整数值**，且返回`0`为正确，其他的值为错误

  ```sh
  # 使用return
  function test1()
  {
      a=$1
      echo "333"
      return ${a}
  }

  function test2()
  {
      # 获取函数返回值
      test1 arg1
      local b=$?
      for i in $(seq ${b}); do
          echo $i
      done
  }
  ```

- 使用 `echo`

  ```sh
  function test1() {
      a=$1
      echo ${a}
  }

  function test2() {
      # 获取函数返回值 echo 的值
      local b=$(test1 10)
      for i in $(seq ${b}); do
          echo $i
      don
  }
  ```

- 使用全局的变量

  ```sh
  isOk=1 # 这里不要用 0 来做返回值
  notOk=2
  function test3() {
      echo "do something"
      return $isOk
  }
  # 判断返回值
  test3
  if [ $? = 1 ]; then
      echo "do something"
  else
      echo "do something"
  fi
  ```

- 返回值的坑

  ```sh
  SSU_PATH="fasdfasdfasd.bin"
  echo $SSU_PATH

  check_upgrade_package_type()
  {
      # 支持 ssu 包
      echo "${SSU_PATH}" | grep -q "\.ssu$"
      if [ $? -eq 0 ]; then
          echo 'SSU'
          return 0
      fi
      return 1
  }

  test()
  {
      local a=$(check_upgrade_package_type) # 期望返回 1
      echo [$?]    ################## error 返回码为 0

      b=$(check_upgrade_package_type)
      echo [$?]    ################## ok 返回码为 1

      ###### 通过返回码判断有问题
      local t=$(check_upgrade_package_type)
      if [ $? -eq 1 ]; then
          echo "aaaa"
          return 1
      fi
      ###### 修改为判断结果，而不是判断返回值
      PKG_TYPE=$(check_upgrade_package_type)
      if [ "x$PKG_TYPE" == "x" ]; then
        return 0
      fi
  }
  test

  ```

### 函数参数

```sh
function test()
{
  arg1=$1
  arg2=$2
  arg3=$3
}

result=$(test 1 2 3)
# 如果函数只接受一个参数，参数是个数组，一定要用双引号引起来，要不然只会传入一个元素
function test_arr()
{
  for item in $1; do
    echo $item
  end
}
# test_arr "$@"
test_arr "1 2 3 4"
```

- [return 和 exit 的区别](https://blog.csdn.net/u013840081/article/details/78245155)

  - `exit()` 表示终止当前进程，return 表示从当前函数返回。

  - `exit()` 带参数表示终止状态，通常 exit(0)表示正常终止, return 带一个参数表示返回值。

  - `exit()` 执行完一些清理工作（终止处理程序，刷新输出流并关闭所有打开的流）后就调用 `_exit` 直接退出，不弹堆栈。而 return 会弹堆栈，返回到上级调用函数。这一点区别在执行 vfork 时很关键。

# IO

## 文件读取

- [awk/sed 操作 ini 文件](https://blog.csdn.net/chn475111/article/details/52299900)

- [读取 `INI` 文件](https://blog.csdn.net/wanxiaoderen/article/details/82388091)

  - 其实就相当于把这个文件当成 shell 脚本，source 一下导进来

    ```sh
    source ./hwinfo # 直接source一些就可以了
    echo ${type}
    ```

  - hwinfo 内容

    ```sh
    # hwinfo
    type=arm
    module=test
    # aa = bb 等号两边不能有空格
    ```

## 操作 json 数据

- [使用 Shell 脚本来处理 JSON](https://www.tomczhen.com/2017/10/15/parsing-json-with-shell-script)

- 使用 `awk`、`sed` 这些处理工具

  ```sh
  # 可以获取 key 对应的 value，即使嵌套
  # {
  #     "restart_device": 1,
  #     "extra": {
  #         "cpu_limit": 43
  #     }
  # }
  # get_json_value "$json" "cpu_limit"
  #
  function get_json_value()
  {
      local json=$1
      local key=$2

      if [[ -z "$3" ]]; then
          local num=1
      else
          local num=$3
      fi
      local value=$(echo "${json}" | awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/'${key}'\042/){print $(i+1)}}}' | tr -d '"' | sed -n ${num}p)
      echo ${value}
  }

  get_json_value "$(cat json_file)" "key"
  ```

- 直接使用 `python`

  ```sh
  # test.json
  #  {
  #    "data": "test",
  #    "are_you_ok": false
  #  }

  json_path = "/root/test.json"
  you_are_ok=$(cat $json_path | python -c "import sys,json; print(json.load(sys.stdin)['are_you_ok'])")
  if [ "x$your_are_ok" == "False" ]; then
      echo "your are not ok"
  fi
  ```

### `jq`

[linux 命令下 jq 的用法简介](https://blog.csdn.net/qq_26502245/article/details/100191694)

- 获取 key

  ```sh
  jq 'keys'
  ```

- 测试文件

  ```json
  $cat json.txt

  {
      "name": "站长工具",
      "url": "http://tool.chinaz.com",
      "address": {
          "city": "厦门",
          "country": "中国"
      },
      "arrayBrowser": [
      {
          "name": "Google",
          "url": "http://www.google.com"
      },
      {
          "name": "Baidu",
          "url": "http://www.baidu.com"
      }
      ]
  }
  ```

- 格式化输出 json 字符串

  ```sh
  cat json.txt | jq .

  # 或者
  jq. json.txt
  ```

- 根据 key 取 value

  ```sh
  cat json.txt | jq .arrayBrowser
  [
    {
      "name": "Google",
      "url": "http://www.google.com"
    },
    {
      "name": "Baidu",
      "url": "http://www.baidu.com"
    }
  ]
  ```

- 根据下标取列表

  ```sh
  cat json.txt | jq .arrayBrowser[0]
  {
    "name": "Google",
    "url": "http://www.google.com"
  }
  ```

- 组装成新的 json 格式

  ```sh
  cat json.txt | jq ".address | {new_city_name: .city, new_country_name: .country}"
  {
    "new_city_name": "厦门",
    "new_country_name": "中国"
  }
  ```

- `-r` 去掉 value 的双引号

  ```sh
  echo '{"name": "test"}' | jq .name
  "test"

  echo '{"name": "test"}' | jq .name -r
  test
  ```

# 封装

- 把另一个脚本文件中定义的函数等包含进来

  ```sh
  # test1.sh
  str="hello huangjinjie"

  # test2.sh
  # 使用 . 引入其他shell文件
  . ./test1.sh
  # source test1.sh
  echo "string from test1.sh: $str"
  ```

# 异常处理

## `> /dev/null 2>&1`

[linux shell 中 "2>&1" 含义](https://www.cnblogs.com/zhenghongxin/p/7029173.html)

将 `stderr` 重定向到 `stdout`，然后将它们一起丢给 `/dev/null` 文件

- `0` 标准输入、`1` 标准输出、`2` 标准错误

- `bash test.sh > /dev/null 2>&1`

  `2>&1` 将标准错误重定向到标准输出

  这里标准输出已经重定向到了 `/dev/null`，那么标准错误也会输出到 `/dev/null`

- `2` 表示标准错误 `/dev/stderr`，即直接运行时会输出到终端的信息

- 写入信息到标准错误 `echo "ddd" 1>&2`

- `>&2` `2>&1`

- 比如一些命令执行结果是输出到标准输出的，这时候无法直接重定向到文件进行保存

  ```sh
  dd if=/dev/urandom of=test_file count=1000 > a.log  # 无法保存

  # 把命令保存到脚本中，否则会被当成 dd 命令的参数
  echo "dd if=/dev/urandom of=test_file count=1000" > a.sh && bash a.sh 0&> a.log

  # 重定向到文件
  command grep > a.log  # 不会写入到 a.log
  command grep 2>a.log  # 会写入到 a.log
  ```

- 忽略标准错误，保留标准输出

  ```sh
  ls xxxx 2>/dev/null  # 忽略标准错误
  echo $?
  2

  ls xxxx  # 会把错误打印出来
  ls: cannot access xxxx: No such file or directory

  echo $?
  2
  ```

# `awk`

- [awk 基本使用](https://linux.cn/article-11658-1.html?utm_source=index&utm_medium=more)

- [Linux 三剑客之 awk 命令](https://www.cnblogs.com/ginvip/p/6352157.html)

- 工作流程

  读入有 **`n`** 换行符分隔的一条记录，然后将记录按指定分隔符（默认分隔符是空白字符）分隔成多个域

- `awk '{pattern + action}' {filenames}`

  - `pattern`

    表示 awk 在数据中要查找的内容；要表示正则表达式时，**用 `/` 括起来**

  - `action`

    表示针对查到的内容执行的操作

  - `{}`

    大括号可以用来对一系列指令进行分组

- ![参数的含义](https://images2015.cnblogs.com/blog/1089507/201701/1089507-20170126222420597-662074402.jpg)

- `awk语言`的最基本功能是在文件或者字符串中基于指定规则浏览和抽取信息

- `awk` 是**以文件的一行为处理单位对文件的所有行进行处理**。每处理一行，就执行一次命令来处理文本

## 使用方法

- [去重](https://blog.51cto.com/xficc/1605562)

  ```sh
  awk '!a[$1]++' testawk
  ```

- 获取输出的第三列数据（从 1 开始计算）

  ```sh
  ls -l | awk | '{print $3}'
  ```

- 输出某几列

  ```sh
  awk '{print $1, $5, $NF}' test.log
  ```

- 取某个列范围内的

  ```sh
  # awk '{for(i=N+1;i<=NF;i++) printf $i"  ";printf"\n"}' file
  # 取第7列以后的
  awk '{for(i=7+1;i<=NF;i++) printf $i}' file
  ```

- 指定分隔符，默认使用 tab 或 空格

  ```sh
  # --field-separator
  awk -F : '{print $2, $3}' test.log # 指定冒号作为分隔符
  ```

- 在输出的列中间增加连接符

  ```sh
  # OFS output field seperator 输出分隔符
  awk '{OFS="  |  "; print $4, $3, $2}' test.log  # 一点要有逗号才行
  ```

- `printf`

  - `printf` 和 C 一样可自定义输出，另外输出内容之后不自动换行

  - `print` 输出内容之后自动换行

    print 函数的参数可以是变量、数值或者字符串。字符串必须用双引号引用，参数用逗号分隔。如果没有逗号，参数就串联在一起而无法区分

- 输出字符串

  ```sh
  # 感觉awk和编程语言一样，每个语句使用大括号括起来
  # 如果想输出多行，可以使用 \n 来实现
  w | awk 'BEGIN {print "Current logins:"} {print $1}'
  ```

- 根据值大小做筛选过滤

  ```sh
  # 取 /etc/passwd 文件按 ":" 进行分隔后第三列的值大于1000的那一行
  awk -F ":" '$3 >= 1000' /etc/passwd
  ```

- 过滤 `%`

  ```sh
  df /data | grep /data | awk -F '[ %]+' '{print $5}'
  80
  # 过滤掉了百分号，原本显示的是 80%
  # -F 是以什么分割。[ %]+ 应该是个正则，表示一个以上空格或者百分号
  ```

### 计算

```sh
# 开平方
awk 'BEGIN {print sqrt(2019)}'

# 计算对数
awk 'BEGIN {print log(2019)}'
```

## 内置变量

| 变量       | 意义                                                             |
| :--------- | :--------------------------------------------------------------- |
| `ARGC`     | 命令行参数个数                                                   |
| `ARGV`     | 命令行参数排列                                                   |
| `ENVIRON`  | 支持队列中系统环境变量的使用                                     |
| `FILENAME` | awk 浏览的文件名                                                 |
| `FNR`      | 浏览文件的记录数                                                 |
| `FS`       | 设置输入域分隔符，等价于命令行 -F 选项                           |
| `NF`       | `$NF Number of Field` 代表一行中字段数量(默认使用空格作为分隔符) |
| `NR`       | 已读的记录数                                                     |
| `OFS`      | 输出域分隔符                                                     |
| `ORS`      | 输出记录分隔符                                                   |
| `RS`       | 控制记录分隔符                                                   |

## 分组统计

> 把日志按 `csv` 格式输出也可以

- [Shell 学习笔记：awk 实现 group by 分组统计功能](https://www.cnblogs.com/hider/p/11834706.html)

## 实例

- 获取文件大小

  ```sh
  ls -alt test.sh | grep -v ^d | awk '{if ($9) printf("%s", $5)}'
  ```

- 统计某个文件夹下的文件占用的字节数

  ```sh
  ls -l |awk 'BEGIN {size=0;} {size=size+$5;} END{print "[end]size is ", size}'
  ```

- 读取 ini 文件

  ```sh
  # dev.ini
  # [dev_info]
  # count = 10
  # [test_info]
  # count = 20

  section=dev_info
  key=count
  $awk -F '=' '/'$section'/{a=1}a==1&&$1~/'$key'/{print $2;exit}' dev.ini
  ```

- 查看文件的中间某几行内容

  ```sh
  # more less head tail 都是查看首尾的文件内容，那怎么查看中间的呢
  awk '{if(NR >= 20 && NR <= 30) print $1}' test.txt
  ```

- 可以用 `BEGIN` 和 `END` 把 `awk` 做成批处理脚本，执行多个命令

  ```sh
  #!/usr/bin/awk -f
  # 这一行是注释　保存文件为 test 可执行权限后可直接执行
  # 也可以通过awk执行: awk -f test
  BEGIN {
      printf "%s\n","User accounts:"
      print "=============="
      FS=":"
      n=0
  }
  # 现在开始遍历数据
  {
      if ($3 >= 1000)
      {
          print $1
          n ++
      }
  }
  END {
      print "=============="
      print n " accounts"
  }
  ```

# `sed`

> [Linux 三剑客之 sed 命令](https://www.cnblogs.com/ginvip/p/6376049.html)
> 命令格式 `sed [选项] '[命令]' 文件`，`sed`会读入文件到缓冲区，并且把命令结果输出到控制台

- [sed、awk 无法使用 shell 变量的问题](https://www.cnblogs.com/gx-303841541/archive/2012/10/25/2738029.html)

  sed 一般使用单引号，sed 引用 shell 变量时使用双引号即可，因为双引号是弱转义，不会去除 $ 的变量表示功能，而单引号为强转义，会把 $ 作为一般符号表示，所以不会表示为变量

## 使用记录

- 插入到指定行

  ```sh
  # 在第 36 行插入内容
  sed -i '36s/^/    client_max_body_size 50m;/g' /path/to/file.conf
  ```

- [有的文本内容有 `/` 很麻烦，可以换个分隔符](https://blog.csdn.net/weixin_33670713/article/details/85721675)

  ```sh
  # 用 ~ 作为分隔符，绕开替换字符串包含 / 的情况，免去做转义的麻烦
  sed "s~aaaa~bbbb~g" a.txt
  ```

- `/` 替换成 `\/`

  ```sh
  a=Alternate/source/build/Makefile/Alternate/source/build/Makefile
  echo $a | sed 's/\//\\\//g'
  ```

- 引入 `shell` 变量

  ```sh
  DEVICE_CNT=2000
  # 修改 grep 查询到的文件，实际上会把 ${DEVICE_CNT} 当做普通的字符串替换，没有替换成shell变量 2000
  # sed -i 's/dev_cnt = 3000/dev_cnt = ${DEVICE_CNT}/g' `grep -rn "dev_cnt = 3000" -rl *`
  # 如果要使用shell变量，就需要使用双引号
  sed -i "s/dev_cnt = 3000/dev_cnt = ${DEVICE_CNT}/g" `grep -rn "dev_cnt = 3000" -rl *`
  ```

- [sed 替换时排除某一行](https://www.cnblogs.com/wangqiguo/archive/2012/05/08/2486548.html)

  ```sh
  # 把 SDW-R4.0.9 开头的行替换成 SDW-R4.0.10
  keyword="SDW-R4.0.9"
  updateinfo="SDW-R4.0.10"
  # 排除 SDW-R4.0.9    Custom-build-csy-20210818-2021020500081 这种不规范的kb包命名，避免这个标记被清除
  sed s/"^(?!.*Custom)${keyword}.*"/"${updateinfo}"/ "$app_path" > /var/tmp/appversion.tmp
  ```

## 定位某一行

- `first~step` 起始行和间隔，比如 `1~3` 表示从第一行开始每个三行执行一次 `sed` 命令，有点像 `python的切片：list[1::3]`

- `$` 表示匹配最后一行，`3,$表示从第三行到最后一行`，美元字符在正则表达式中就表示末尾，然后 `sed` 工作原理就是把源文件读到缓冲区，然后以行为单位一行一行处理

- `/REGEXP/` 按照正则表达式来进行匹配，`/` 之间是正则表达式

- `\cREGEXPc` 按照正则表达式来进行匹配，`\c和c`之间的正则表达式， `c`是任意字符

- `n,m`如果两者都是数字，则表示处理 `第 n 行到第 m` 行之间的数据；如果是正则，则表示这两个正则匹配的行之间的数据

- `n,+m` 表示从第 `n` 行开始往下匹配 `m` 行，一共匹配 `m + 1` 行

- `n,~m` 表示

## 选项

| 选项 | 含义                                             | 例子                                                                                 |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `-e` | 可以指定多个命令                                 | `sed -e 's/test/ttt/g' -e '2d' test.log` 把文件中 `test` 替换为 `ttt` 并且删除第二行 |
| `-i` | 会修改原文件                                     |
| `-n` | 取消控制台输出，与命令 `p`一起用可以打印指定内容 |
| `-f` | 执行`sed`脚本                                    | `sed -f ab.sed test.log` 执行 `ab.sed` 里面的多条命令，同 `-e`                       |

## 命令

| 命令 | 含义                       | 例子                                                                                                           |
| :--- | :------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `a`  | 新增                       | `sed '1~3a test_line' test.log` 从第一行开始开始，每 3 行后面新增一行 `test_line`                              |
| `c`  | 替换                       | `sed '2c test_line' test.log` 把第二行修改为 `test_line`                                                       |
| `d`  | 删除                       | `sed '1,3d' test.log` 删除第 1 到 3 行                                                                         |
| `i`  | 插入                       | `sed '1,3i test_line' test.log` 在第 1 到 3 每行前面插入 `test_line`                                           |
| `p`  | 打印（和 `-n` 选项一起用） | `sed '2p' test.log` 重复打印第 2 行；`sed -n '2p' test.log` 只打印第 2 行                                      |
| `s`  | 替换（匹配局部替换）       | `sed 's/old_str/new_str/gi' test.log`替换每行的第一个 old_str 为 new_str，`g` 表示一行多个，`i` 表示忽略大小写 |

# 规范

## 注释规范

- 文件头注释

- 函数注释

# 其他

- 删除前判断有没有文件

  ```sh
  [ -f file_name ] && rm -rf file_name
  ```

## shell 解释器类型

- [Linux 下查看使用的是哪种 shell 的方法汇总](https://www.jb51.net/LINUXjishu/247797.html)

  ```sh
  # 查看系统中可使用的shell
  cat /etc/shells
  # 查看当前使用的shell
  echo $SHELL
  ```

## 各种括号的使用

> - [各种括号的使用](https://blog.csdn.net/HappyRocking/article/details/90609554)

## 单例

> [怎么正经的实现 shell 脚本单例运行？](https://mp.weixin.qq.com/s?__biz=MzIzMTE1ODkyNQ==&mid=2649413116&idx=1&sn=1cd3f456dde9f0e873495116b77d7604&chksm=f0b6101ec7c199084821c32168ca84c4269efb293fbc9847edcb20b39d5ad91db95f90494c49&mpshare=1&scene=1&srcid=&sharer_sharetime=1591266489482&sharer_shareid=f316a6cebeade5635e10fac82581c72d)

- 通过 `ps` 来检查是否已有该进程在运行，如果存在则不执行

  ```sh
  function run_onece_by_ps() {
    echo "run once by ps"
    local ps_ret=$(ps -ef | grep singleton.sh | grep -v grep -c)
    if [ "${ps_ret}" -ge 1 ]; then
        echo -e "singleton.sh already running, num: ${ps_ret}"
        # 输出进程数是2，因为在shell里没执行一个命令都会fork出一个子进程
        exit 1;
    fi
    while [ true ]; do
        echo "singleton.sh run..."
        sleep 1
    done
  }
  ```

- 通过打标记来表示已有进程在运行，比如进程运行时先创建一个临时文件，进程执行完毕再删除这个文件

  ```sh
  function run_once_by_flag() {
    LOCK_FILE=/var/lock/singleton.lock
    # 用 kill -0 检测该进程是否存在，避免进程不在了，但是锁文件还在，导致后面的脚本无法运行
    if [ -e ${LOCK_FILE} ] && kill -0 $(cat ${LOCK_FILE}) ; then
        echo "$0 already running"
        exit 1;
    fi
    # 确保退出时，锁文件被删除
    trap "rm -f ${LOCK_FILE}; exit" INT TERM EXIT

    # 将当前进程id写入到锁文件
    echo "on begin $$, write pid to lock file"
    echo $$ > ${LOCK_FILE}

    echo "do something in $$ process"
    sleep 5

    ####### 如果程序意外退出没有删除这个锁文件就麻烦了 #######
    # 程序退出时删除锁文件
    echo "on exit $$ delete lock file"
    rm -f ${LOCK_FILE}
  }
  ```

## TIPS

- `mktemp` 创建临时目录

  ```sh
  # 在 /tmp 下创建临时目录，返回临时目录名称 /tmp/tmp.uCJlhnXXN7
  mktemp -d
  # 默认是创建一个空文件
  mktemp
  ```

- 获取当前 `shell` 脚本所在路径

  ```sh
  # basename 获取文件名，比如 /root/a.lua 返回 a.lua

  # dirname 返回的未必是绝对路径，取决于提供给 dirname 的参数是否是绝对路径
  curr_path=$(readlink -f "$(dirname "$0")")
  echo $curr_path

  # dirname 可以获取当前文件/文件夹所在目录
  curr_path=$(dirname $(readlink -f "$0"))
  echo $curr_path
  ```

- 命令前加 `\` 表示不适用系统中设置的别名

  ```sh
  $ cat .bashrc | grep ls
  $ alias ls = 'ls -alF'
  $ ls    # 已经在系统环境变量中设置了别名，不是原始的 ls 命令了
  lrwxrwxrwx 1 m_kepler root     21 Jan  5  2019 debug -> workspaces/c++/debug//
  lrwxrwxrwx 1 root     root     34 Nov 12  2018 default -> /etc/nginx/sites-available/default
  lrwxrwxrwx 1 m_kepler root     25 Jul  3 23:51 golang -> /mnt/f/workspaces/golang//

  $\ls    # 不使用系统中设置的别名，而是使用 which ls 展示的原始命令
  debug default golang
  ```

- [获取本目录下全部文件的 `md5` 值](https://blog.csdn.net/shangyexin/article/details/80968169)

  ```sh
  #!/bin/bash
  function ergodic(){
      for file in ` ls -a $1 `
      do
          # 或
          if [ $file == . ] || [ $file == .. ]
          then
              continue
          fi
          if [ -d $1/$file ]
          then
              ergodic $1/$file
          else
              md5sum $1/$file | sed s#$INIT_PATH/## >> $RECORDFILE
          fi
      done
  }

  #设置输出文件名
  RECORDFILE=check.md5

  #如果存在先删除，防止重复运行脚本时追加到记录文件
  test -e $RECORDFILE && rm $RECORDFILE

  #获取当前目录
  INIT_PATH=`pwd`

  #遍历所有文件
  ergodic $INIT_PATH

  #删除不需要的隐藏文件
  sed -i / \./d $RECORDFILE

  #按文件名称排序
  sort t -k 2 $RECORDFILE -o $RECORDFILE
  ```

- 没有多行注释，每行前面加 `#` 字符

- [shell 脚本内执行多条命令](https://blog.csdn.net/bananasssss/article/details/51315342)

  - 每个命令之间用 `;` 隔开
    说明：各命令的执行给果，不会影响其它命令的执行。换句话说，各个命令都会执行，
    但不保证每个命令都执行成功。

  - 每个命令之间用 `&&` 隔开
    说明：若前面的命令执行成功，才会去执行后面的命令。这样可以保证所有的命令执行完毕后，执行过程都是成功的。
  - 每个命令之间用 `||` 隔开
    说明：||是或的意思，只有前面的命令执行失败后才去执行下一条命令，直到执行成功
    一条命令为止。

- linux 命令后台执行：`& 和 nohup`

  - 使用&命令后，作业被提交到后台运行，当前控制台没有被占用，但是一但把当前控制台关掉(退出帐户时)，作业就会停止运行。
  - nohup 命令可以在你退出帐户之后继续运行相应的进程。nohup 就是不挂起的意思( no hang up)

- [nohup 和&组合使用](https://mp.weixin.qq.com/s?src=11&timestamp=1526953207&ver=890&signature=MddbdKyDuc*7qG--4sep6A1ofiNUSQ5pda60UkQnKTKLiecqGaz*GATJOzBuPwhYJmu78KmUq0K4tGR6YzsMhvRtm-aKsuW*vWahxMtVjVR3BT7FsUKzciMV4y3y-BIf&new=1)

- [`set -x` 调试](https://coolshell.cn/articles/1379.html) 和 `bash -x ccc.sh` 一个意思

- `set -e` 如果任何语句的执行结果不是 true 则应该退出

  ```sh
  #!/bin/bash
  set -e
  command1  # 返回码非 0，直接退出，后面的不会继续执行；不建议这么用，最好自己捕获错误码退出
  echo "1111"
  command2
  exit 0
  ```

- shell 脚本中执行 linux 命令
  shell 脚本中一个命令相当于 `fork` 了一个进程去执行

  ```sh
  aa=/path/to/file

  # 执行命令
  test=`ls -l`

  # 执行命令
  test2=$(ls -l)

  # 取变量
  test3=${aa}
  ```

- [读写 ini 文件](https://blog.csdn.net/wanxiaoderen/article/details/82388091)

- `realpath` 得到文件真是路径， `pwd` 只能得到文件所在文件夹路径

- [shell 模板变量替换](https://www.cnblogs.com/woshimrf/p/shell-template-variable.html)

- 通过标准错误传递错误信息

  ```sh
  # a.sh
  echo "err_msg" >> a.log
  echo "err_msg" 1>&2  # 重定向到标准错误

  # 通过标准错误取错误信息
  # bash a.sh >> b.log 2>&1
  ```

- 循环

  ```sh
  while true; do time curl http://172.16.109.245:10000/popularity/word; sleep 1; done

  for pid in $(ps auxf | grep apache | grep -v grep | awk '{print $2}'); do echo "pid: $pid"; sleep 1; done
  ```

- 输出信息

  ```sh
  {
  > echo "version:$version"
  > echo "gateway_id:$gateway_id"
  > echo "appversion:$appversion"
  > echo "sn:$sn"
  > echo "auth_type:$auth_type"
  > } >> $report_file
  ```

# Shell

- 获取全部文件的文件名到 filename.txt 里，每个文件名一行

- 怎么遍历文件夹下的全部文件，比如有很多 sql，怎么全拿出来执行

- 怎么获取全部文件名包含某个字符串的文件，全拿出来

- 在全部文件的文件头/尾添加某些字符

- 把很多个文件夹内的某个同名文件的内容输出到一个文件中。。

- 要在每个文件夹里都执行同样的几个动作。。。

- 把 find 出来所有文件复制到一个目录下

- 删除所有文件中包含某字符串的行

- `ln -s <源> <目的>` 创建软链

- 获取当前文件夹下所有文件名称到 list.txt(这是 windows 的脚本)

  ```sh
  DIR *.* /B >list.txt
  ```

- 将目录 dir 下面所有文件中的字符串 old 都修改成 new

  ```sh
  sed -i "s/old/new/g" `grep 'old' -rl dir`
  ```

- 将输出内容以表格形式显示

  ```sh
  mount | column -t
  ```

- `linux` 系统中中断已连接的用户

  > [linux 系统中中断已连接的用户](https://www.cnblogs.com/rusking/p/5604735.html)

  ```
  [root@rhel7 ~]# w
  [root@rhel7 ~]# pkill -kill -t  pts/1
  [root@rhel7 ~]# w
  [root@rhel7 ~]#
  ```

## `shell` 远程

- [远程免密登录](http://xiaolin0199.iteye.com/blog/2021558)

- 脚本中远程执行 `shell` 命令

  ```sh
  # 必需先设置免密码登录
  #!/bin/bash
  ssh -tt kbssacct@192.168.16.189 << remotessh
  cd ~/
  ls
  exit
  remotessh
  # 远程的内容在remotessh之间,exit退出远程节点
  # 提示：psesudo-terminal will not be allowed becase stdin is not a terminal
  ## 伪终端将无法分配，因为标准输入不是终端
  解决：ssh 加-tt参数
  ```

- 避免短时间 `ssh` 连接卡死

  ```
  ssh -o ServerAliveInterval=360 kbssacct@192.168.16.189
  ```

- [批量给文件命名，修改文件名](https://www.cnblogs.com/EasonJim/p/7965559.html)

  ```sh
  find /your/path -name 'old_name*' | xargs -i echo mv \"{}\" \"{}\" | sed 's/old_name/new_name/2g' | sh
  ```

- [rename 批量修改文件名](https://blog.csdn.net/fdipzone/article/details/44604591)

  ```sh
  touch a.txt b.txt c.txt
  rename -v 's/.txt/.log/' *.txt  # -v 显示操作细节
  ```

## 生成随机数

- [Linux 生成随机数的几种方法](https://blog.csdn.net/minioesina/article/details/87863485)

## 环境变量

env

## `ssh`

- `-v` 查看详细过程

  ```sh
  ssh -v root@1.1.1.1
  ```

- `ssh` 指定端口

  ```sh
  ssh root@1.1.1.1 -p 663
  ```

- [解决 ssh_exchange_identification: read: Connection reset by peer](https://blog.csdn.net/lilygg/article/details/86187028)

- 便捷登录

  ```sh
  # vim ~/.ssh/config
  Host alias_name
      HostName 11.11.11.11
      Port 22408
      User root
  ```

- [SSH 实现免密登录并设置黑白名单](https://www.cnblogs.com/maohai-kdg/p/12005731.html)

## base64

- `bit`: 位，音译比特,其实就是 0、1；二进制 00010001 占 8 位

- `byte`：字节，一个字节 8 位; 一个字节就是一个字符

- `ASCII` 编码中，一个英文字符占一个字节（8 位)，一个汉字占两个字节

- 网络运营商是千进制，即 1000kb = 1Mb；而且他们的单位 `bit`，所以你开个百兆宽带，下载速度最多也就是 `100Mb / 8 = 12.5MByte`

```sh
1 Byte = 8 Bits
1 KB = 1024 Bytes
1 MB = 1024 KB
1 GB = 1024 MB
```

- `Base64` 是一种用 64 个字符来表示任意二进制数据的方法。就是完成二进制到字符串的转换工作, 常用于在 URL、Cookie、网页中传输少量二进制数据

- 原理
  是一种通过查表的编码方法，不能用于加密，即使使用自定义的编码表也不行

- [字符串(bina)转二进制](http://www.5ixuexiwang.com/str/binary.php)(不足 3 的倍数,补 0x00)

  ```sh
  b i n a 0x00 0x00
  01100010 01101001 01101110 01100001 00000000 00000000
  ```

- 3×8 分割为 4×6（在分割的 6 位前补两个 00, 形成 8 位一组）,二进制转换为十进制

  ```sh
  00011000 00100110 00100101 00101110 00011000 00010000 00000000 00000000
  24 38 37 46 24 16 0 0
  ```

- 对照 Base64 编码表,转化为对应的字符(`0` 用 `=` 替代)

  ```sh
  Y m l u Y Q = =
  ```

- 编码

  ```sh
  echo Hello World | base64
  ```

- 解码

  ```sh
  echo SGVsbG8gV29ybGQK | base64 -d
  Hello World
  ```

## MD5

- 获取字符串的 md5: \$echo -n "hellofasjdfas" | md5sum

- 获取文件的 md5: \$md5sum file_name

- 用 md5 校验文件：

  ```sh
  $md5sum file_name > file_name.md5  //输出md5值到.md5
  $md5sum -c file_name.md5           //把.md5和文件放在同一目录下
  ```

## 拆分大文件

- 拆分大体积的文件(每个 100MB)，然后合并回去

  ```sh
  split –b 100m /path/to/large/archive /path/to/output/files
  cat files* > archive
  ```

## 测试方法

- [模拟高 CPU\高内存\高负载的方法](http://www.embeddedlinux.org.cn/emb-linux/entry-level/201801/21-8031.html)

## flock

- flock 参数

  ```sh
  -s,--shared
    # 获取一个共享锁，在定向为某文件的 FD 上设置共享锁而未释放锁的时间内，其他进程试图在定向为此文件的 FD 上设置独占锁的请求失败，而其他进程试图在定向为此文件的 FD 上设置共享锁的请求会成功
  -x，-e，--exclusive
    # 获取一个排它锁，或者称为写入锁，为默认项
  -u，--unlock
    # 手动释放锁，一般情况不必须，当 FD 关闭时，系统会自动解锁，此参数用于脚本命令一部分需要异步执行，一部分可以同步执行的情况
  -n，--nb, --nonblock
    # 非阻塞模式，当获取锁失败时，返回 1 而不是等待
  -w, --wait, --timeout seconds
    # 设置阻塞超时，当超过设置的秒数时，退出阻塞模式，返回 1，并继续执行后面的语句
  -o, --close
    # 表示当执行 command 前关闭设置锁的 FD，以使 command 的子进程不保持锁。
  -c, --command command
    # 在 shell 中执行其后的语句
  ```

- 通过文件锁 `flock` 来实现单例

  `flock` 的好处是，它的参数是一个文件描述符，`文件描述符关闭的时候就会自动释放锁`；而进程终止（即使是异常退出）的时候，所有文件描述符均被关闭

  ```sh
  function do_lock() {
      LOCK_FILE=/var/lock/test.log

      # 把 LOCK_FILE 与文件描述符 200 以写的方式连接起来（LOCK_FILE 文件可以不存在）
      exec 200<>${LOCK_FILEk}

      # -n 表示非阻塞模式，如果失败则直接 fail，不等待
      flock -n 200 || {
          echo "waitting for lock to release ..."
          # 以阻塞的方式等待获取锁
          flock 7
      }
  }
  ```

- 例子

  ```sh
  #!/bin/bash

  flock -nx /var/.clear_dap_data.sh.lock /sf/bin/clear_dap_data.sh
  # flock -nx /var/lock/reset_config.lock -c 'sh -c /usr/sbin/reset_config.sh'
  ```

- [flock——Linux 下的文件锁](https://blog.lilydjwg.me/2013/7/26/flock-file-lock-in-linux.40104.html)

- [被遗忘的桃源——flock 文件锁](https://zhuanlan.zhihu.com/p/25134841)

> 设置一个文件的状态

- 如果不加锁，A 进程在 0:0:1 时分读取了文件内容进行修改，然后在 0:0:10 时分保存到磁盘; 而 B 进程在 0:0:3 时分读取文件内容进行修改，然后在 0:0:6 时分进行保存；不加锁会出现 A 进程修改的内容把 B 进程修改的内容覆盖的情况（保存文件一般都是操作一个副本，操作完用副本覆盖过去，保证原子性）

- 如果不加锁，两个进程要对一个文件作操作，就需要知道对方到底有没有占用文件，通过 ipc 等通知机制也不现实，如果增加第三个进程进来，程序将变得复杂

- 大小写转换

  ```sh
  例如：UPPERCASE=$(echo $VARIABLE | tr '[a-z]' '[A-Z]')   (把VARIABLE的小写转换成大写)
        LOWERCASE=$(echo $VARIABLE | tr '[A-Z]' '[a-z]')   (把VARIABLE的大写转换成小写)
  ```

- [`if ... else` 简写](https://blog.csdn.net/openme_openwrt/article/details/9766121)

  ```sh
  # && 如果是 “前面”，则 “后面”
  # 检查 文件是否存在，如果存在就删掉
  [-f /var/run/dhcpd.pid] && rm /var/run/dhcpd.pid

  # || 如果不是 “前面”，则后面
  # 检验文件是否存在，如果存在就退出
  [-f /usr/sbin/dhcpd] || exit 0
  ```

https://www.jb51.net/article/157327.htm

https://developer.aliyun.com/article/484681

- [读取 ini 配置](https://segmentfault.com/a/1190000023278995)

  ```sh
  (! ls /cfg/ha_cfg.ini || awk -F '=' '/\['ha'\]/{a=1}a==1&&$1~/'use_ha'/&&$2~/'1'/{print "请先解除双机，再逐个升级设备"; exit 1}' /cfg/ha_cfg.ini)

  cat ha_cfg.ini

  [ha]
  use_ha = 1
  role =
  vip =

  ```

- `le` 和 `\<`；`eq` 和 `==`
