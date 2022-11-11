- [参考资料](#参考资料)
- [Linux 命令](#linux-命令)
  - [用户管理](#用户管理)
  - [文件系统](#文件系统)
    - [`lsof`](#lsof)
    - [`echo`](#echo)
    - [`ls`](#ls)
    - [`cp`](#cp)
  - [CPU](#cpu)
  - [内存](#内存)
  - [磁盘 IO](#磁盘-io)
    - [`du`](#du)
    - [`dd`](#dd)
  - [时间](#时间)
    - [sleep](#sleep)
    - [at 延时执行](#at-延时执行)
  - [压缩](#压缩)
    - [tar](#tar)
    - [zip](#zip)
  - [crontab](#crontab)
  - [工具](#工具)
    - [`stress`](#stress)
    - [`split`](#split)
  - [其他](#其他)

# 参考资料

[Linux 命令大全](https://man.linuxde.net)

# Linux 命令

## 用户管理

## 文件系统

### `lsof`

- [Linux lsof 命令](https://www.cnblogs.com/sparkdev/p/10271351.html)

- [too many open files](https://blog.csdn.net/qq_18298439/article/details/83896777)

- [Linux 下查看进程打开的文件句柄数](https://my.oschina.net/dabird/blog/837784)

- 句柄一直不释放会有什么问题

  - 占用系统资源

  - 如果持续增长，会耗尽句柄，导致其他服务无法起来

- 查看哪个服务占用 80 端口

  ```sh
  lsof -i:80
  ```

- `lsof -i -a -p $PID` 查看进程打开的网络文件

  ```sh
  -i # produces a list of network files belonging to a user or process

  -a # logically combines or AND's given parameters

  -p $PID # selects info only about your process

  -n # 现实具体的网络地址，而不是 localhost
     # inhibits the conversion of network numbers to host names for network files

  $lsof -i -a -n -p 23577
  COMMAND     PID USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
  alarm 23577 root   11u  IPv4 42528219      0t0  TCP *:5798 (LISTEN)
  alarm 23577 root   20u  IPv4 42529974      0t0  TCP 127.0.0.1:5798->127.0.0.1:60476 (ESTABLISHED)
  alarm 23577 root   22u  IPv4 42529979      0t0  TCP 127.0.0.1:5798->127.0.0.1:60479 (ESTABLISHED)
  alarm 23577 root   23u  IPv4 42529980      0t0  TCP 127.0.0.1:5798->127.0.0.1:60480 (ESTABLISHED)
  ```

- 查看系统支持的最大文件描述符

  ```sh
  cat /proc/sys/fs/file-max
  ```

- 查看进程占用的句柄

  ```sh
  lsof -p [pid]

  # 查看进程句柄限制
  cat /proc/[pid]/limits
  ```

- 查看谁在用这个文件描述符

  ```sh
  # `strace` 看到的是一对的网络系统调用 `recvfrom(4, ":1\r\n", 65536, 0, NULL, NULL) = 4`
  # 那么这个文件描述符 `4` 是指什么呢

  lsof -d [fd]
  ```

- 查看那些程序在占用文件

  ```sh
  lsof /path/to/your/file
  ```

- [`can't identify protocol` 问题定位](https://blog.csdn.net/stpeace/article/details/51810092)

### `echo`

- 发消息给终端

  ```sh
  w
  12:03:47 up 7 days,  2:23,  5 users,  load average: 0.22, 0.38, 0.56
  USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
  root     pts/0    10.5.84.14       Sun15    1:22m  0.00s  0.00s -bash
  root     pts/1    110.5.84.14       Sun15    1:22m  0.00s  0.00s -bash
  # 发消息
  echo "out" > /dev/pts/1
  ```

- `echo -n` 不输出末尾的那个回车空行

  ```sh
  echo -n "123"
  echo "456
  # 输出是 123456
  ```

- `echo -e` 处理特殊字符，比如各种花里胡哨的显示

- `-e` 换行

  ```sh
  echo "Hello world.\nHello sea"
  Hello world.\nHello sea

  echo -e "Hello world.\nHello sea"
  Hello world.
  Hello sea
  ```

### `ls`

https://www.cnblogs.com/xueqiuqiu/p/7635722.html

### `cp`

- `-n` 跳过某些已经在目标文件夹中已存在的文件

- [排除特定目录](https://cloud.tencent.com/developer/ask/127635)

  ```sh
  cp -r `ls -A | grep -v "c"` $HOME/
  ```

- [cp](https://www.cnblogs.com/irisrain/p/4324817.html)

- 复制时保留目录结构

  ```sh
  cp --parents /usr/lib/python2.7/site-packages/bbc/lib/manage/user.py /root/
  # 拷贝到了 /root/usr/lib/python2.7/site-packages/bbc/lib/manage/user.py
  ```

- [拷贝软连接文件的时候，直接拷贝软连接指向的源文件](https://cloud.tencent.com/developer/article/1656732)

  ```sh
  # 把 test1 中的文件，包括软链文件所链接的实际文件，拷贝到 test2
  rsync -aL test1/* test2
  ```

- 目的路径下有软链接时报错 `cp: cannot overwrite non-directory`

  ```sh
  $mkdir test1 test2
  $mkdir -p test1/a
  $ln -s ./a b
  $ls -l
  total 4
  drwxr-xr-x 2 root root 4096 Apr 15 12:33 a/
  lrwxrwxrwx 1 root root    3 Apr 15 12:33 b -> ./a/

  $cd test2
  $mkdir a b

  $cp -rf test2/* test1/
  cp: cannot overwrite non-directory `test1/b' with directory `test2/b'
  ```

## CPU

- [`proc/cpuinfo`](https://blog.csdn.net/cuker919/article/details/7635488)

  ```sh
  cat /proc/cpuinfo
  processor       : 0
  vendor_id       : GenuineIntel
  cpu family      : 6
  model           : 15
  model name      : Intel(R) Core(TM)2 Duo CPU     T7700  @ 2.40GHz
  stepping        : 11
  cpu MHz         : 2394.000
  cache size      : 0 KB
  physical id     : 0
  siblings        : 2
  core id         : 0
  cpu cores       : 2
  apicid          : 0
  initial apicid  : 0
  fpu             : yes
  fpu_exception   : yes
  cpuid level     : 10
  wp              : yes
  flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht pni ssse3 cx16 sse4_1 sse4_2 x2apic hypervisor lahf_lm
  clflush size    : 64
  cache_alignment : 64
  address sizes   : 40 bits physical, 48 bits virtual
  power management:

  processor       : 1
  vendor_id       : GenuineIntel
  cpu family      : 6
  model           : 15
  model name      : Intel(R) Core(TM)2 Duo CPU     T7700  @ 2.40GHz
  stepping        : 11
  cpu MHz         : 2394.000
  cache size      : 0 KB
  physical id     : 0
  siblings        : 2
  core id         : 1
  cpu cores       : 2
  apicid          : 1
  initial apicid  : 1
  fpu             : yes
  fpu_exception   : yes
  cpuid level     : 10
  wp              : yes
  flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ss ht pni ssse3 cx16 sse4_1 sse4_2 x2apic hypervisor lahf_lm
  clflush size    : 64
  cache_alignment : 64
  address sizes   : 40 bits physical, 48 bits virtual
  power management:
  ```

- `lscpu`

  ```sh
  lscpu
  Architecture:          x86_64
  CPU op-mode(s):        32-bit, 64-bit
  Byte Order:            Little Endian
  CPU(s):                16（CPU数量）
  On-line CPU(s) list:   0-15
  Thread(s) per core:    1
  Core(s) per socket:    4（每颗cpu核心数）
  Socket(s):             4
  NUMA node(s):          2
  Vendor ID:             GenuineIntel
  CPU family:            6
  Model:                 79
  Model name:            Intel(R) Xeon(R) CPU E5-2690 v4 @ 2.60GHz
  Stepping:              1
  CPU MHz:               2599.998（CPU主频）
  BogoMIPS:              5199.99
  Hypervisor vendor:     VMware
  Virtualization type:   full
  L1d cache:             32K
  L1i cache:             32K
  L2 cache:              256K
  L3 cache:              35840K
  NUMA node0 CPU(s):     0-7
  NUMA node1 CPU(s):     8-15
  ```

## 内存

- `meminfo`

  ```sh
  cat /proc/meminfo
  MemTotal:       16334160 kB
  MemFree:         6524508 kB
  ```

- `free`

  ```sh
  # 默认单位是 K, -m 显示的是 M
  # -s 3 每3秒查询一次内存

  free -m
              total       used       free     shared    buffers     cached
  Mem:           15G       9.4G       6.2G        44M       464M       8.0G
  -/+ buffers/cache:       914M        14G
  Swap:         8.0G         0B       8.0G

  # swap 硬盘上交换分区的使用情况

  # total：   总内存大小
  # used：    已经使用的内存大小（这里面包含cached和buffers和shared部分）
  # free：    空闲的内存大小
  # shared：  进程间共享内存（一般不会用，可以忽略）
  # buffers： 内存中写完的东西缓存起来，这样快速响应请求，后面数据再定期刷到磁盘上
  # cached：  内存中读完缓存起来内容占的大小（这部分是为了下次查询时快速返回）
  ```

- `top`

  ```
  top
  Mem:  16334160k total,  9810200k used,  6523960k free,   475260k buffers
  ```

- `vmstat`

  ```sh
  vmstat

  procs -----------memory---------- ---swap-- -----io---- --system-- -----cpu-----
   r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
   1  0      0 6525628 475260 8400980    0    0     0     1    0    0  0  0 100  0  0
  ```

## 磁盘 IO

- [Linux 查看磁盘 IO 性能并找出占用 IO 读写很高的进程](https://www.cnblogs.com/lzpong/p/13687333.html)

- [Linux 如何查看与测试磁盘 IO 性能](https://www.cnblogs.com/mauricewei/p/10502539.html)

- [linux 性能评估 - 磁盘 io 概念实战篇](https://www.cnblogs.com/summerxye/p/11114384.html)

- 查看磁盘空间大小

  ```sh
  df -h
  ```

- 查看系统分区

  ```sh
  fdisk -l
  ```

### `du`

- `du (disk usage)`

  ```sh
   -a 显示全部目录和子目录下每个文件所占磁盘空间
   -s 显示总和
   -b 大小用bytes来显示
  ```

- 查看当前目录所占空间大小

  ```sh
  du -sh    # 查看当前目录总大小
  du -sh *  # 查看当前目录下各文件/文件夹大小
  du -sh /path/to/your/folder
  ```

- [按文件夹大小排序](https://blog.csdn.net/jiaobuchong/article/details/50272761)

  ```sh
  # * 可以将当前目录下所有文件的大小给列出来; 加 h 参数排序不正确的
  du -s * | sort -nr
  ```

- 查看子目录

  ```sh
  du -h --max-depth=1
  ```

- 查看磁盘

  ```sh
  df -h / | sed -n '2 p' | awk '{print $4}'
  ```

### `dd`

- 我想生成一些有意义的数据

  [How To Quickly Generate A Large File On The Command Line](https://skorks.com/2010/03/how-to-quickly-generate-a-large-file-on-the-command-line-with-linux/)

  ```sh
  # generate test file input.txt

  content='{"id": "c9b72270-b548-47f5-af9d-6372846bd758", "symbol": "166842.XSHE", "price": 66.51, "quantity": 295, "type": "feature", "datetime": "2011-07-16 00:42:32481"}' > input.txt
  echo $content > input.txt

  # it will generate 1 * 2^30 lines

  # lines = _1GB / sizeof($content) # 6669203.875776397 lines
  # 2^22 = 4194304  lines -----> 644 MB
  # 2^23 = 8388608  lines -----> 1.2578125 GB
  # 2^24 = -----> 2.515625 GB
  # 2^25 = -----> 5.03125 GB
  # 2^26 = -----> 10.0625 GB
  # 2^27 = -----> 20.125 GB
  # 2^28 = -----> 40.25 GB
  # 2^29 = -----> 80.5 GB
  # 2^30 = -----> 161.0 GB

  # for i in {1..22}; do cat input.txt input.txt > input2.txt && mv input2.txt input.txt; done
  for i in {1..20}; do cat input.txt input.txt > input2.txt && mv input2.txt input.txt; done

  ```

- [文件读写测试，磁盘读写测试全靠它](https://mp.weixin.qq.com/s?__biz=MzI2OTA3NTk3Ng==&mid=2649285335&idx=1&sn=06fdbed8c51168322b6d07989cc96834&chksm=f2f991b0c58e18a6290910f12a046d471971c4f23f0c546509f5390f6a7077a08d0b1b91508b&scene=21#wechat_redirect)

- 测试 IO 性能

  ```sh
  # 一次写入 512 bytes，一共 512000 bytes = 512kB
  dd if=/dev/urandom of=testfile count=1000 oflag=sync

  1000+0 records in
  1000+0 records out
  512000 bytes (512 kB, 500 KiB) copied, 0.012975 s, 39.5 MB/s
  ```

- 构造指定大小的文件（占用实际磁盘空间）

  > 对于 `dd` 来说，输入和输出都是文件，`dd` 做的只是文件拷贝工作

  ```sh
  dd if=/dev/zero of=50M.file bs=1M count=50
  # if        表示 input file  从哪个文件读取数据
  # of        表示 output file 把内容输出到哪个文件夹
  # bs=1M     表示每一次读写1M数据
  # bs        参数还可以进一步细分为ibs和obs两种，为读操作与写操作分别指定不同的Buffer大小。
  # count=50  表示读写 50次

  # 建议用 urandom   生成文件，如果用 /dev/zero 压缩后会很小的
  ```

- 构造指定大小的文件（不占用实际磁盘空间）

  > 之前看书的时候接触过稀疏文件的概念，即实际不占用磁盘

  ```sh
  dd if=/dev/zero of=1G.file bs=1M seek=1000 count=0
  # seek=1000 表示略过1000个块不写
  # count=0 表示写0个块
  # 使用ls查看新生成的文件，大小确实为1G
  # 使用du查看时，发现实际为0M
  ```

## 时间

- 睡眠

  ```sh
  sleep 1    # 睡眠1秒
  sleep 1s   # 睡眠1秒
  sleep 1m   # 睡眠1分
  sleep 1h   # 睡眠1小时
  ```

- [timedatectl 修改时区](https://www.cnblogs.com/zhi-leaf/p/6282301.html)

  ```sh
  # 查看时间信息
  timedatectl status

  # 查看可用时区
  timedatectl list-timezones

  # 修改为上海时区
  timedatectl set-timezone "Asia/Shanghai"
  ```

- 查看系统时间和硬件时间

  ```sh
  # 查看系统时间
  date

  # 查看硬件时间
  hwclock --show
  ```

- 修改系统时间

  ```sh
  # 修改日期、时间
  -s, --set=STRING

  # 修改系统 日期
  date -s 2019-06-18

  # 修改系统 时间
  date -s 16:10:00

  # 修改 时间和日期
  date -s "2016-06-18 16:10:00"

  # 系统时间和硬件时间同步
  # hc代表硬件时间，sys代表系统时间
  hwclock --hctosys
  ```

- 时间和时间戳相互转换

  ```sh
  # 时间戳长度是10位
  # 显示当前时间戳，单位秒
  %s seconds since 1970-01-01 00:00:00 UTC
  %d day of month (e.g., 01)

  date +%s

  # 获取毫秒时间
  start_tm=$(($(date +%s%N)/1000 000))

  # 时间转时间戳
  -d, --date=STRING
      display time described by STRING, not 'now'

  date -d '2018-06-12 07:21:22' +"%s"

  # 时间戳（秒）转时间
  date -d @1574723266
  ```

- 修改文件时间

  [Linux 下查看和修改文件时间](https://www.cnblogs.com/caoshousong/p/10730178.html)

  ```sh
  # 修改 ctime
  touch -a -d "2017-05-10 09:00:00" install.log
  # -a: 仅修改access time
  touch -d "2018-04-18 08:00:00" install.log
  # -d: 后面可以接日期，也可以使用 --date="日期或时间"
  touch -m -d "2018-05-20 08:00:00" install.log
  # -m: 仅修改mtime
  ```

- 查看文件时间 `atime ctime mtime`

  - `atime` 访问时间 用户最近一次访问的时间 `ls -lu`

  - `mtime` 修改时间 文件内容最后一次被修改的时间 `ls -t`

  - `ctime` 变化时间 文件元数据（metadata，例如权限或者所有权）最后一次改变的时间。 `ls -tc`

  - `ls -l --time=ctime install.log`

- `UTC时区` 即 0 时区，北京使用的是 UTC+8

### sleep

### at 延时执行

## 压缩

### tar

> 其参数前面可以使用 `-`，也可以不使用
> tar 命令`只负责打包`，压缩的话要加上 `z 或者 j 来指定用哪个命令压缩

- [选项](https://www.cnblogs.com/manong--/p/8012324.html)

  | 参数 | 含义                                                                 |
  | :--- | :------------------------------------------------------------------- |
  | `-c` | create 生成档案文件，创建打包文件                                    |
  | `-v` | verbose 列出归档解档的详细过程，显示进度                             |
  | `-f` | file 指定档案文件名称，**f 后面一定是.tar 文件**，所以必须放选项最后 |
  | `-t` | 列出档案中包含的文件                                                 |
  | `-x` | 解开档案文件                                                         |
  | `-C` | 指定需要解压到的目录                                                 |
  | `-z` | 用`gzip`来压缩/解压缩文件                                            |
  | `-j` | 用`bzip2`来压缩/解压缩文件                                           |

- [`tar：Exiting with failure status due to previous errors` 报错](https://www.cnblogs.com/paul8339/p/8267864.html)

  ```sh
  # 把过程输出去掉
  tar zcvf backup.tar.gz my_program/ > /dev/null
  ```

- 排除某个目录或文件

  `--exclude` 命令排除打包的时候，**不能加 /**，否则还是会把 logs 目录以及其下的文件打包进去。

  ```sh
  tar -zcvf tomcat.tar.gz --exclude=tomcat/logs --exclude=tomcat/libs tomcat
  ```

- 用例

  ```sh
  # 打包
  tar -cvf test.tar test.txt

  # 解包
  tar -xvf test.tar
  # 解压到当前目录
  tar -xvf test.tar -C ./

  # 打包后使用gzip进行压缩
  tar -zcvf test.tar.gz test.txt

  # 解压
  tar -zxvf test.tar.gz
  ```

- [压缩使用绝对路径，报 `tar: Removing leading / from member names` 的问题](https://www.cnblogs.com/operationhome/p/9802554.html)

### zip

- 需要用 `-y` 参数，否则符号链接直接用被软链的源头文件替换

- `-l` 查看压缩包内文件

  ![alt](https://img-blog.csdnimg.cn/c6dee1b58ce0443fb87cd4a62ff48564.png)

- 解压某个文件

  ```sh
  dst_file=$1
  # 从 a.zip 中解压出 $dst_file
  unzip -o -P"your_password" "./a.zip" "$1"
  ```

- 解压到指定目录

  ```sh
  unzip -d /tmp test.zip
  ```

- `gzip`

  - 压缩后的格式为：`*.gz`

  - `不能保存原文件`，压缩完源文件会被删掉；且`不能压缩目录`

  - `gzip` 压缩 `gunzip` 解压缩

- `zip`

  和 `gzip` 对比，可以压缩目录，可以保留源文件

- `bzip2`

  压缩文件格式为 `.bz2`

## crontab

[cron 表达式生成器](https://tool.lu/crontab)

[Centos crontab 定时任务](https://www.cnblogs.com/huchong/p/9323502.html)

- cron 有两个配置文件，一个是一个全局配置文件（`/etc/crontab`），是针对系统任务的；一组是 crontab 命令生成的配置文件（`/var/spool/cron` 下对应用户的文件，平时 `crontab -l` 编辑的就是这个文件），是针对某个用户的. 定时任务配置到任意一个中都可以。**配置完不需要重启服务**

- 定时任务要加上 `flock` 文件锁保证单例运行

  使用 `crontab` 管理定时脚本时，如果设定的脚本执行时间间隔较短，例如 5 分钟执行一次，正常情况下，脚本执行耗时 1 分钟，在非正常情况下（如服务器压力较大的情况下，或数据量突然增大），脚本执行时间超过 5 分钟，这时就会造成多个脚本同时执行，严重时甚至拖垮服务器，影响服务器上的其它服务

- `tail -f /var/log/cron` 观察定时任务运行日志，可以到 [这个网站](https://crontab.guru/) 测试一下配置是否正确

- [命令行添加一条定时任务](https://blog.csdn.net/mzc11/article/details/81842534)，一般都是 `crontab -e` 然后让你编辑，那怎么在命令行进行编辑呢

  ```sh
  crontab -l > conf && echo "* * * * * hostname >> /tmp/tmp.txt" >> conf && crontab conf && rm -f conf

  ```

- ![alt](https://img-blog.csdn.net/20160408215643922)

  - 星号 `*`

    代表所有可能的值，例如 month 字段如果是星号，则表示在满足其它字段的制约条件后每月都执行该命令操作。

  - 逗号 `,`

    可以用逗号隔开的值指定一个列表范围，例如，“1,2,5,7,8,9”

  - 中杠 `-`

    可以用整数之间的中杠表示一个整数范围，例如“2-6”表示“2,3,4,5,6”

  - 正斜线 `/`

    可以用正斜线指定时间的间隔频率，例如“0-23/2”表示每两小时执行一次。同时正斜线可以和星号一起使用，例如 `*/10`，如果用在 minute 字段，表示每十分钟执行一次。

  ```sh
  # 在 1 到 5 月, 9 到 12 月每周周一到周五的9点到16点之间每5分钟执行一次 comand 命令
  *,*/5  9-16  *  1-5,9-12  1-5  root  command
  ```

- `/etc/crontab` 把脚本放到对应的文件夹下

  [`run-parts`](https://blog.csdn.net/qq_32352565/article/details/70878082) 作用是：遍历目标文件夹，执行第一层目录下的可执行权限的文件

  ```sh
  SHELL=/bin/bash
  PATH=/sbin:/bin:/usr/sbin:/usr/bin
  MAILTO=root

  # For details see man 4 crontabs

  # Example of job definition:
  # .---------------- minute (0 - 59)
  # |  .------------- hour (0 - 23)
  # |  |  .---------- day of month (1 - 31)
  # |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
  # |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
  # |  |  |  |  |
  # *  *  *  *  * user-name  command to be executed

  *    *  *  *  *    root    run-parts /etc/cron.minly
  */5  *  *  *  *    root    run-parts /etc/cron.fiveminly
  18   *  *  *  *    root    run-parts /etc/cron.hourly
  01   3  *  *  *    root    run-parts /etc/cron.daily
  22   4  *  *  0    root    run-parts /etc/cron.weekly
  42   4  1  *  *    root    run-parts /etc/cron.monthly
  ```

## 工具

### `stress`

[CPU 负载模拟工具](https://mp.weixin.qq.com/s/dxPJQ_SPntqNggvU6gIBKg)

### `split`

[分割大文件](https://linux.cn/article-11682-1.html)

- split 命令默认使用非常简单的命名方案。文件块将被命名为 xaa、xab、xac

- split 不会删除原始文件，所以分块后需要自己删除临时文件

- **参数选项**

  ```sh
  split --verbose -b 10M -d -a 2 bigfile bigfile_prefix
  # --verbose 输出分隔的过程
  # -b 10M 按字节拆分，单位可以是K M G T
  #  还可以按照行数拆分（-l）
  # -d split默认使用xaa xab来命令，该参数指定使用数字后缀
  # -a 后缀长度，比如使用两位长度的数字作为后缀
  ```

- 如何组合拆分后的文件

  ```sh
  cat bigfile?? > original.file
  # ?? 表示匹配两个字符
  ```

## 其他

- 对输出的信息按照第 3 列排序

  ```sh
  ps -eo pid,lstart,etime | sort -k 3
  ```

- 移动/复制文件时排除某一文件/文件夹

- Ubuntu 弹出通知 `notify-send`

  ```sh
  notify-send "标题" "通知内容"
  ```

- 只看前/后 10 行

  ```sh
  head/tail - 10 file_name
  ```

- `test` 命令

- 查看文件特定几行

  ```py
  # 查看第10到20行
  sed -n "10,20p" a.log
  # 或者使用 awk
  awk '{if(NR >= 20 && NR <= 30) print $1}' test.txt
  ```

- `taskset` 让 CPU 在指定的核心上执行

  ```sh
  taskset -c 0,10 ./bind_core
  # 只在0号和10号逻辑核心上运行
  # taskset -p 某进程号 -c 1,2
  ```

- `pwd` 显示真实路径

  ```sh
  # 软链不加 -P 参数的话显示的是软链的路径，无法查看到软链实际链接的路径
  pwd -P
  ```

- [`uuidgen`](https://blog.csdn.net/signjing/article/details/69358110)

  ```
  uuidgen -t # 产生基于时间的uuid
  ```

- [拷贝的时候保留文件属性](https://jingyan.baidu.com/article/0a52e3f46bf4dfff62ed72d5.html)

  ```sh
  cp -a xxx tmp/
  ```

- [`uniq` 去重](https://www.cnblogs.com/ghostwu/p/9064689.html)

  https://blog.csdn.net/weixin_29917533/article/details/117275090

  uniq 默认是删除`连续`的重复行，而不是删除整个文件中有重复的行；所以一般先进行排序操作

  - 按照某一列去重

    ```sh
    -w, --check-chars=N 对每行第 N 个字符以后的内容不作对照
    -c, --count 在每行前加上表示相应行目出现次数的前缀编号
    #cat 云端易部署改动记录.log | sort | uniq -c -w 9 | sort -rn
    netstat -nat | awk '{print $6}' | sort | uniq -c | sort -rn
    ```

- `nl` 显示行号

  ```sh
  $nl /etc/passwd
  ```

- CentOs 安装软件报错： `Cannot retrieve metalink for repository: epel/x86_64. Please verify its path`

  不知道什么时候给我自动加了个 epel 的源，把`/etc/yum.repos.d/epel.repo`删除再`yum makecache`就好了

- [`/etc/ld.so.conf`](https://blog.csdn.net/huangjin0507/article/details/50372721)

  `ldconfig` 命令的用途, 主要是在默认搜寻目录(`/lib和/usr/lib`)以及动态库配置文件`/etc/ld.so.conf` 内所列的目录下, 搜索出可共享的动态链接库(格式如 lib*.so*), 进而创建出动态装入程序(ld.so)所需的连接和缓存文件. 缓存文件默认为 `/etc/ld.so.cache`

- 命令前面加 `\` 来取消别名，比如 `\ls`; 反斜杠是直接调用原命令，为了保证你使用的命令不是各种系统别名，经常会在命令前面加一个反斜杠来去除别名。

- `kill -0 [pid]` 不发送任何信号，可以用来检查进程是否存在，如果存在则 `echo $?` 返回 0，否则返回 -1

- [`#! shebang` 指明了执行这个脚本文件的解释程序](https://blog.csdn.net/qq_32863631/article/details/75649033)

- [（总结）Linux 下多行合并成一行，中间加分隔符](https://blog.csdn.net/weixin_34117211/article/details/91723131)

  ```sh
  find . -name "*.pyc" > tmp
  cat tmp
  111.py
  222.py
  333.py

  # 怎么变成 111.py,222.py,333.py（首尾没有，）
  cat tmp |awk '{printf",%s",$0}'
  ```

- `eval`

  [使用 eval 命令解决 shell 脚本中函数嵌套调用中的参数问题](https://www.cnblogs.com/opangle/archive/2012/08/24/2653722.html)

  ```sh
  # eval 的作用是再次执行命令行处理，也就是说，对一个命令行，执行两次命令行处理
  cmd="cat test.txt"
  echo $cmd
  # echo -n "abc" -n 表示不输出末尾的空行

  # 输出为 cat test.txt
  eval $cmd
  # eval 第一遍扫描，进行变量替换
  # 第二遍扫描，执行命令
  # 输出位 cat test.txt 命令的返回内容
  ```

- 不进入交互环境执行 `redis` 命令

  ```sh
  redis-cli -p 6333 -a redis@sfdc keys device*
  redis-cli -h {host} -p {port} {command}
  ```

- [/dev/random 和 /dev/urandom 随机数](https://www.cnblogs.com/zhouhbing/p/5820899.html)

- 杀死某个进程

  ```sh
  # 确保 grep [proc_name] 能找到那个进程
  kill -9 `ps auxf | grep [proc_name] | grep -v grep | awk '{print $2}'`
  pidof [proc_name]
  ```

- `&&` 和 `;` 都可以执行两个命令，有什么区别

  - `&&` 前一个命令执行成功，才执行后一个

  - `;` 无论前一个命令成功与否，都执行后一个命令

- [tee 重定向到文件和终端](http://www.voidcn.com/article/p-xujlftex-bsq.html) 我们可以把输出重定向到文件中，比如 `ls > a.txt`，这时我们就不能看到输出了，如果我们`既想把输出保存到文件中，又想在屏幕上看到输出内容`，就可以使用这个命令了

  ```sh
  # tee -a 追加内容
  # echo -e 自动换行
  echo -e "hello world" | tee -a a.log
  ```

- `ll /var/` 查看 `var` 文件夹下的内容；`ll /var/*` 查看 `var` 目录下包括子目录的内容

- `iconv` 编码转换

  ```sh
  echo "test" | iconv -f gbk -t utf-8
  ```

- 查看文件编码

  ```sh
  file test.log
  test.log: UTF-8 Unicode text
  ```

- 指定 `ping` 哪个网卡进行 `ping -I eth0 10.119.255.254`

- [限制命令执行超时时间](https://blog.csdn.net/qingsong3333/article/details/77342298/)

- 创建临时文件

  ```sh
  # 在 /tmp 下创建临时文件
  mktemp

  # 在 /tmp 下创建临时文件夹
  mktemp -d
  ```

- 快速备份

  ```sh
  cp a.sh{,.bak}
  ```

- [Linux 清理缓存](https://www.cnblogs.com/kazihuo/p/9288846.html)

- `cd .. || exit` 命令失败就退出

- `nl xxx.txt` 输出文本内容，并且带上行号

- 查看 core 文件路径

  ```sh
  # 如果输出为 0，则代表没有打开。如果为 unlimited 则已经打开了, 就没必要在做打开。
  ulimit -c

  # 打开 coredump
  ulimit -c unlimited

  cat /proc/sys/kernel/core_pattern
  ```

- [`timeout` 命令](https://blog.csdn.net/yunweimao/article/details/106688074)

  ```sh
  timeout 10 top
  timeout 5m ping www.baidu.com
  ```

- 查看有哪些 shell 可用: `cat /etc/shells`

- `tree`

  ```sh
  # 输出两层路径
  tree -L 2

  # 只输出目录
  tree -p
  ```

- `Makefile` 中若文件夹不存则创建

  ```sh
  make -pv xxx
  ```

- 格式化 json 文件

  ```sh
  cat /sf/cfg/cloud_deploy.json | python -m json.tool
  cat /sf/cfg/cloud_deploy.json | jq .

  # 去掉双引号
  jq .data -r
  ```

- 查看端口

  ```sh
  lsof -i:443
  netstat -apn
  ```

- `chmod`

  ```sh
  # 给目录下的所有文件赋予 777 权限
  chmod 777 -R /dir/
  ```

- [查看开机时间 `uptime`](https://blog.csdn.net/u014389734/article/details/79392440)

  ```sh
  uptime
  # 当前时间   开机时间           在线用户   前 1、5 和 15 分钟系统的平均负载
  10:24:54    up 1 day,  7:27,   0 users,  load average: 0.00, 0.00, 0.00

  w  # 也可以看到上面 uptime 的内容

  # 查看详细日期
  date -d "$(awk -F. '{print $1}' /proc/uptime) second ago" +"%Y-%m-%d %H:%M:%S"
  ```

- 修改系统资源限制

  ```sh
  ulimit -m [内存大小]
  # 指定可使用内存的上限，单位为KB

  ulimit -n [文件描述符数目]
  # 指定同一时间最多可开启的文件数。
  ```

- [linux 查看资源信息常用命令](https://blog.csdn.net/freedom_824/article/details/80408700)

- [CentOS7 安装 Python3.6.5](https://www.cnblogs.com/yangzhaon/p/11203395.html)

- [CentOS7 安装 sqlite3.27](http://blog.sina.com.cn/s/blog_4c86552f0102z9np.html)

- [强制用户下线](https://www.cnblogs.com/security-guard/p/13684406.html)

  ```sh
  pkill -kill -t pts/1
  ```

- [磁盘挂载](https://blog.csdn.net/qq_21334991/article/details/78589851)

  ```sh
  # 只读
  mount -o remount,ro /

  # 命令虽然是错的，但是默认会挂在成读写
  mount -o remount, ro /
  mount -o remount,rw /
  ```

- [grep "xx" $file_name 和 cat $file_name | grep "xx"](http://www.voidcn.com/article/p-yaslfvhf-bth.html)

- [`write error: Broken pipe`](https://blog.csdn.net/zkkdcs1/article/details/88659069)

  ```sh
  # 管道前的命令不断的向管道 write，管道后的命令不断的从管道 read, 写和读是同时进行的，并不是先写完再通过管道传向下一个命令。所以当 ls 目录下的目录文件很多的时候，向管道写的过程中，管道后的命令条件已满足，满足后会关闭管道，但 ls 还是会向管道写，此时管道已经关闭
  grep "needrestart" package.conf | grep "no"
  ```

- 系统监控

  ```sh
  bash -c "while [ -d /proc/$PPID ]; do sleep 1;head -v -n 8 /proc/meminfo; head -v -n 2 /proc/stat /proc/version /proc/uptime /proc/loadavg /proc/sys/fs/file-nr /proc/sys/kernel/hostname; tail -v -n 16 /proc/net/dev;echo '==> /proc/df <==';df;echo '==> /proc/who <==';who;echo '==> /proc/end <==';echo '##Moba##'; done"
  ```

- 获取 sha1 值

  ```sh
  sha1sum xxxx
  ```

- [如何在不杀进程的前提下关闭一个 TCP Socket 连接](https://cloud.tencent.com/developer/article/1490413)

  ```sh
  # 使用 lsof 找到进程 45059 打开的所有文件描述符，并找到对应的 Socket 连接。

  $lsof -np 45059
  COMMAND     PID USER   FD   TYPE             DEVICE SIZE/OFF       NODE NAME
  ceph-fuse 45059 root  rtd    DIR                8,2     4096          2 /
  ceph-fuse 45059 root  txt    REG                8,2  6694144    1455967 /usr/bin/ceph-fuse
  ceph-fuse 45059 root  mem    REG                8,2   510416    2102312 /usr/lib64/libfreeblpriv3.so
  ...
  ceph-fuse 45059 root   12u  IPv4         1377072656      0t0        TCP 1.1.1.1:59950->1.1.1.2:smc-https (ESTABLISHED)

  # 其中 12u 就是上面对应 Socket 连接的文件描述符。
  # gdb 连接到进程

  $gdb -p 45059

  # 关闭 Socket 连接
  (gdb) call close(12u)
  ```

- `rm -f *` 不会删除隐藏文件

  ```
  mkdir test
  cd test
  touch a b .a .b
  \rm -f *
  ls -al  # 还是有 .a .b
  ```

- 写一个文件，不用每次都写 vi 命令

  ```sh
  cat <<EOF >> /etc/hosts
  192.168.136.128 dev-128
  EOF
  ```

  ```sh
  # 匿名配置
  kubectl apply -f - <<EOF
  apiVersion: v1
  kind: Secret
  metadata:
    name: admin-user-secret
    namespace: kubernetes-dashboard
    annotations:
      kubernetes.io/service-account.name: admin-user
  type: kubernetes.io/service-account-token
  EOF
  ```

  ```sh
  # 你用 -EOF 也行，只要结束的时候也是 -EOF 就可以了

  cat > /root/test.txt << EOF
  asdfasd
  asdfasdasd
  asdfasd
  EOF
  ```

- `set -e` 作用是，如果一个命令返回一个非 0 退出状态值(失败) 就退出

- `cat /proc/version` 查看发行版

- `/etc/hosts.deny` `/etc/hosts.allow`

- 修改可执行文件的 md5

  ```sh
  echo "" >> /path/to/file
  ```

- 一次性创建多个文件夹 `mkdir -p /apps/mysql/{mydir,datadir,conf,source}`

- `chmod -v u+w /etc/sudoers` 修改文件权限为只读（再次执行则赋予可写权限）
