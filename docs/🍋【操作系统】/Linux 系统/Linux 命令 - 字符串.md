- [参考资料](#参考资料)
- [字符串处理](#字符串处理)
  - [`cut`](#cut)
  - [`tr`](#tr)
- [查找](#查找)
  - [`sort`](#sort)
  - [`find`](#find)
    - [选项](#选项)
    - [实例](#实例)
  - [`grep`](#grep)
    - [选项](#选项-1)
    - [实例](#实例-1)

# 参考资料

# 字符串处理

## `cut`

## `tr`

- [【Linux 基础】tr 命令替换和删除字符 linux 命令总结之 tr 命令](https://www.cnblogs.com/badboy200800/p/10389973.html)

> 对标准输入的字符进行替换、压缩和删除

- 大小写转换

  ```sh
  echo "HELLe WORLD" | tr 'A-Z' 'a-z'
  ```

# 查找

> SED、AWK、GREP、FIND

## `sort`

[sort 多列正排序，倒排序](https://segmentfault.com/a/1190000005713784)

> 将文件的每一行作为一个单位，相互比较，比较原则是从首字符向后，依次按 ASCII 码值进行比较，最后将他们按升序输出

- 按照某一列排序

  ```sh
  sort -n -k 2 -t : facebook.txt
  ```

## `find`

- [linux 自动删除 tmp 文件夹](https://blog.csdn.net/hellobabygogo3/article/details/51077772)

- [排除](https://www.cnblogs.com/drizzlewithwind/p/5705915.html)

- 查找文件夹，不查找文件 `-d`

  ```sh
  find / -name testdir -d
  ```

- 排除某个文件

  ```sh
  find . -type f ! -name "*.html"
  ```

- 查找多个文件后缀

  ```sh
  find / -name "*.lua" -o -name "*.schema" -print
  ```

- 查找某目录及子目录下的文件

  ```sh
  find directory options criteria_to_match action_to_perform_on_results
  ```

- 删除当前目录及子目录下多有的.log 文件

  ```sh
  find . -name "\*log" -print -exec rm -rf {} \;
  # 花括号将由find命令结果替换
  # -exec 必须以分号或加号结尾
  # 分号是特殊字符，需要加右斜杠做转义
  ```

### 选项

- `-name`

  > 按照文件名查找

  ```sh
  find dir/ -name file_name # 在dir/目录及子目录下查找
  find . -name "*.py" # 在当前目录及子目录下查找扩展为py的文件
  find ./ -name "*.o" -exec rm {} \ # 删除当前目录及其子目录下的所有.o文件
  ```

- `-perm`

  > 按照文件权限来查找

  ```sh
  find. -perm 755 -print # 在当前目录下查找权限为755的文件
  ```

- `-regex`

  > 正则方式查找, -iregex 忽略大小写的正则

  ```sh
  find . -regex ".*\(\.txt|\.pdf\)$"
  ```

- `-print`

  > find 命令将匹配到的文件输出到标准输出

- `-prune`(删减) 排除

  > 在 A 文件夹内,不包含 B 文件夹中查找;如果同时使用-depth,那 prune 会被 find 命令忽略

  ```sh
  find /apps -path "/apps/bin" -prune -o -print # 在/apps下,但不在/apps/bin内查找
  # 多个路径
  find /usr/sam \( -path /usr/sam/dir1 -o -path /usr/sam/file1 \) -prune -o -print
  ```

- `-newer file1 ! file2`

  > 查找更改时间比 file1 新但比 file2 旧的文件

  ```sh
  find -newer file1 ! # 查找比file1新的文件
  ```

- `-type`

  > 查找某一类型的文件

  ```sh
  b 块设备文件
  d 目录
  c 字符设备文件
  p 管道文件
  l 符号链接文件
  f 普通文件
  ```

- `-depth`

  ```sh
  # 首先在当前目录查找,再在子目录中查找
  find / -name "CON.FILE" -depth -print
  ```

- `-follow`

  > 如果查找到符号链接文件,就跟中所指向的文件

- `-size`

  ```sh
  # 在 /etc 下查找文件大小大于 1M 的文件, 1M 是 1000000 个字节
  # find /ect -size +1000000c  # 字节
  find /ect -size +20000k # kb
  ```

- `-mtime -n +n`

  ```sh
  # (modify_time) 按照文件更改时间查找
  # +n/-n 表示文件更改时间距现在 n 天 前/内.
  find / -mtime -5 -print #在根目录下查找更改时间在5日以内的文件
  ```

- `-user`

  ```sh
  # 按照文件属主来查找
  find ~ -user kepler -print # 在$HOME下查找属于kepler的文件
  ```

- `-nouser`

  ```sh
  # 查找无有效属主的文件
  find /home -nouser -print
  ```

- `-group`

  ```sh
  # 按照文件属组来查找
  # 在/apps目录下查找属于kepler_group用户组的文件
  find /apps -group kepler_group -print
  ```

- `-nogroup`

  ```sh
  # 查找无有效所属组的文件
  find / -nogroup -print
  ```

- `xargs` 以空格或者换行作为分隔符，把标准输入转化成多个命令行参数

  ```sh
  # 相当于 echo 1; echo 2; echo 3
  echo "1 2 3 " | xargs echo

  # -d 指定分隔符
  echo -n "a#b#c" | xargs -d "#" echo

  # -p 输出要执行的命令，每次都会询问是否执行
  echo -n "a#b#c" | xargs -pd "#" echo  #  还是拆开参数吧，如果连起来要确保 d在后面，"#" 是给 d 的参数


  # -t 输出要打印的命令是什么样的
  echo "a b c" | xargs -t echo

  # -n 指定将一行中多少项参数作为命令行参数
  echo "a b c d e f" | xargs -n 2 echo
  # 输出为
  # a b
  # c d
  # e f

  # -I 参数替换
  echo "a b c" | xargs -I F sh -c "echo F.txt"
  # 当然也可以换成脚本
  a.txt 保存如下内容:
  aa
  bb
  cc

  cat a.txt | xargs -I -F sh -c 'echo F.txt'
  ```

- [`-exec 与 xargs 与 |`](https://blog.csdn.net/appke846/article/details/80585469)

  - `-exec command {} \;` 会对**每个查找到的文件**执行后面的一次命令

  - `xargs` 会把前一个命令的输出作为后一个命令的参数

  - `|` 会把前一个命令的输出作为后一个命令的标准输入

  - 管道符 `|` 所传递给程序的不是简单地在程序名后面输入的参数，它们会被程序内部的读取功能如 scanf 和 gets 等接收，而 `xargs` 则是将内容作为普通的参数传递给程序，相当于直接跟在命令后面。况且，有些命令是不接受标准输入的，比如 `kill，rm` 等命令

  - 比如我想对查找出来的文件进行事件排序，如果用 -exec 就不行

    ```sh
    # no
    find . -name "*.log" -exec ls -lt {} \;

    # yes
    find . -name "*.log" | xargs ls -lt
    ```

### 实例

- 找出当前目录下文件数最多的目录

  ```py
  for i in ./*; do echo $i; find $i | wc -l; done
  ```

- 找出当前目录下文件行数最多的文件

  ```sh
  find . -type f -print -exec wc -l {} \;
  ```

- 删除所有的日志文件

  ```sh
  find . -name "*log" -print -exec rm -rf {} \;
  ```

- 全文搜索

  ```sh
  # 当前目录下查找文件中包含“hello world!”这个字符串的文件
  grep -rn "hello,world!"
  ```

- 查找目录下的所有文件中是否含有某个字符串

  ```sh
  find .| xargs grep -ri "SMS_ISSEND"
  ```

- 查找目录下的所有文件中是否含有某个字符串,并且只打印出文件名

  ```sh
  find . | xargs grep -ri "SMS_ISSEND" -l
  ```

- 把指定后缀的文件拷贝到其他目录下

  ```sh
  find /path -type f -name "*.swf" -exec cp {} /otherpath \;
  ```

- 把目录下所有文件由 dos 转 unix

  ```sh
  find . -type f -exec dos2unix {} \;
  ```

## `grep`

- `pgrep`

### 选项

- 以 str 开始/结尾

  ```sh
  ^str # 以str开始
  str$ # 以str结尾
  ```

- 显示匹配行附近几行

  ```sh
  # 同时显示匹配行的上下的 n 行 `grep -2 pattern filename`
  grep -A 5 foo file  # 显示 foo 及后 5 行
  grep -B 5 foo file  # 显示 foo 及前 5 行
  grep -C 5 foo file  # 显示 foo 以及上下 5 行
  ```

- `-b` byte offset 显示匹配行所在的行号

- `-c` count 显示匹配的行数有多少,不显示匹配的内容

- `-v`

  ```sh
  # 逻辑非
  grep test | grep -v grep

  # 非文件夹
  ls -alt | grep -v ^d  # ^ 正则表达式开始标志
  ```

- `-E`

  > 用来扩展选项为正则表达式

  ```sh
  # 逻辑或
  grep -E 'pattern1|pattern2' filename
  # 逻辑与（通过正则表达式实现的话pattern1和pattern2分顺序先后）
  grep -E 'pattern1.*pattern2' filename
  ```

- `-f` file 从文件中提取模板

  ```sh
  echo "$exclude_key_word" > "$grep_exclude_file"
  grep -v -f "$grep_exclude_file"
  ```

- `-c` 被查找的字符串匹配的行数

- `-i` ignore-case 忽略大小写

- `-h` 不标示该行所属的文件名称

  ```sh
  grep -h "xxx" /path/to/dir/*
  # 对目录进行 grep 的时候，原本显示的是 file_name:xxx
  # 加 -h 后显示为 xxx
  ```

- `-l` files-with-matchs 显示**包含匹配内容**的文件名

- `-L` 显示**不包含匹配内容**的文件名

- `-r` 递归查找文件夹内的所有文件

- `-s` silent 不显示关于不存在或无法读物文件之类的错误信息

### 实例

- 指定文件类型

  ```sh
  find . -name "*.lua" -exec grep 'config/update' {} \;
  ```

- 检查 grep 出来的数据是否有有重复，类似 `group by`

  ```sh
  cat sfvt_bbcvpnsvr.log | grep hjj | awk '{count[$11]++;} END {for(i in count) {print i count[i]}}'
  ```

- `-w` 全词匹配

  ```sh
  grep -w "test adfas"
  ```

- `-F` 不匹配正则

  ```sh
  crontab -l | grep -F "*/30 * * * * /etc/cron.daily/logrotate"
  ```

- 排除多个

  ```sh
  grep_exclude_path=mktemp

  echo "webui
  src" > $grep_exclude_path

  grep -v -f $grep_exclude_path
  ```

- 匹配多个关键字

  ```sh
  grep -r -E '0341028|100081|10086|10001' *
  ```

- 统计当前文件夹下文件的个数 / 若要统计目录个数，将`"^-"改为"^d"`

  ```sh
  ls -l | grep "^-" | wc -l
  ```

- 统计当前文件夹下文件的个数(包括子文件夹内)

  ```sh
  ls -lR | grep "^-" | wc -l
  ```

- 指定查询目录

  ```py
  grep -rn "test" /tool/*
  ```

- 在当前目录及当前目录下的子目录查找某个字符串

  ```sh
  grep -rn "test" *
  ```

- 全面搜索正则表达式 pattern 并把匹配的行打印出来

  ```sh
  grep [OPTION] 'pattern' [FILE]
  ```

- 统计当前文件夹下文件的个数, 若要统计目录个数，将 `"^-"` 改为 `"^d"`

  ```sh
  ls -l | grep "^-" | wc -l
  ```

- 统计当前文件夹下文件的个数(包括子文件夹内)

  ```sh
  ls -lR | grep "^-" | wc -l
  ```
