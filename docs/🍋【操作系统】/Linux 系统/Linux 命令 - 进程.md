- [参考资料](#参考资料)
- [进程管理](#进程管理)
  - [`top`](#top)
    - [load average 系统负载](#load-average-系统负载)
  - [`iostat`](#iostat)
    - [`iowait`](#iowait)
  - [`pidstat`](#pidstat)
  - [`vmstat`](#vmstat)
  - [`mpstat`](#mpstat)
  - [`ps`](#ps)
  - [`/proc/[pid]`](#procpid)
  - [`/proc/net/tcp`](#procnettcp)
  - [systemctl 和 service](#systemctl-和-service)
  - [`journalctl`](#journalctl)
  - [日志](#日志)
    - [syslog](#syslog)
    - [logrotate](#logrotate)
  - [`supervisor`](#supervisor)
  - [`pstack`](#pstack)
  - [`strace`](#strace)
    - [常用选项](#常用选项)
    - [使用记录](#使用记录)

# 参考资料

# 进程管理

- 查看线程

  ```sh
  # -d 表示刷新时间
  top -p 122587 -d 0.5 -H
  ```

- 查看进程占用内存情况

  ```sh
  cat /proc/[pid]/status

  pmap -x [pid]
  ```

- 查看进程 CPU 耗费在哪

  ```sh
  # 用没别的，用 strace 吧
  ```

- `nice 和 renice` 设置程序运行优先级

  - [Linux nice 及 renice 命令使用](https://blog.csdn.net/XD_hebuters/article/details/79619213)

  - CPU 密集型程序，最好通过 nice 命令来启动它，这样可以保证其他进程获得更高的优先级，即使服务器在负载很重的情况下也可以快速响应

  ```sh
  host-fefcfe704a2e ~ # nice sleep 200 &
  [2] 11231
  host-fefcfe704a2e ~ # ps -el | grep sleep
  0 S     0 10509   810  0  80      0        - 1399 hrtime pts/0    00:00:00 sleep
  0 S     0 11231   810  0  90     10        - 1399 hrtime pts/0    00:00:00 sleep
  #                            该字段为优先级
  ```

## `top`

- 为什么有时候看 CPU 占用超过 100%? 因为你的是核 CPU

- [`top` 输出信息的含义](https://www.jianshu.com/p/af584c5a79f2)

  ```sh
  $top
  #### 统计信息 #####
  # 也可以通过 cat /proc/loadavg 来查看负载

  # 负载指的是：在这段时间内，CPU正在处理以及等待CPU处理的进程数之和
  top - 22:00:12 up 3 days, 23:59,  0 users,      load average: 0.52, 0.58, 0.59
        当前时间  系统运行时间        当前登录用户   系统负载（前1、5、15 分钟平均负载）

  Tasks:  16 total,   1 running,      15 sleeping,   0 stopped,    0 zombie
          进程总数     运行中的进程数   睡眠的进程数    停止的进程数   僵尸进程数

  %Cpu(s):  2.7 us,               3.9 sy,  0.0 ni, 93.2 id,  0.0 wa,  0.2 hi,  0.0 si,  0.0 st

  【CPU 使用情况】
  us:         用户进程占 CPU 的使用率
  sy:         系统进程占 CPU 的使用率
  ni:         用户进程空间改变过优先级
  id:         空闲CPU占用率
  wa:         iowait 等待输入输出的CPU时间百分比
  hi:         硬件的中断请求
  si:         软件的中断请求
  st:         steal time

  KiB Mem :  8302152 total,  1189352 free,  6883448 used,      229352 buff/cache

  KiB Swap: 25165824 total, 24326772 free,   839052 used.  1284972 avail Mem

  【内存 / 交换分区信息】
  total:      物理内存总量
  free:       空闲内存总量
  used:       使用的物理内存总量
  buffer/cache: 作为内核缓存的内存量

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
  199 m_kepler  20   0   17632   2088   1496 R   0.7  0.0   0:00.03 top
    1 root      20   0    9776    520    476 S   0.0  0.0   0:02.87 init
  231 mysql     20   0   10668    788    756 S   0.0  0.0   0:00.22 mysqld_safe
  590 mysql     20   0 2134732  62664  17920 S   0.0  0.8   0:02.32 mysqld

  【进程信息】
  PID:        进程id
  USER:       进程所有者
  PR:         优先级。数值越大优先级越高
  NI:         nice 值，负值表示高优先级，正值表示低优先级
  VIRT:       进程使用的虚拟内存总量
  SWAP:       进程使用的虚拟内存中被换出的大小
  RES:        进程使用的、未被换出的物理内存大小
  SHR:        共享内存大小
  SHR:        共享内存大小
  S:          进程状态。
                D 表示不可中断的睡眠状态
                R 表示运行
                S 表示睡眠
                T 表示跟踪/停止
                Z 表示僵尸进程
  %CPU:       上次更新到现在的CPU占用百分比 ；
  %MEM:       进程使用的物理内存百分比 ；
  TIME+:      进程使用的CPU时间总计，单位1/100秒；
  COMMAND:    命令名/命令行
  ```

- 输出 `top` 信息后自定义显示信息

  输入 top 后按关键字和直接 `top -H` 是一样的

  | 按下        | 效果                                     |
  | ----------- | ---------------------------------------- |
  | `H`         | 显示进程的线程                           |
  | `P`         | 表示按 CPU 排序（默认也是按照 CPU 排序） |
  | `M`         | 表示按内存排序                           |
  | `T`         | 按进程使用 CPU 时间排序                  |
  | `1`         | 显示各个 CPU 负载情况                    |
  | `c`         | 显示详细命令                             |
  | `u`         | 可以按照用户来过滤                       |
  | `z`         | 更换着色                                 |
  | `m`         | 显示内存占用情况，按多次更换为用图形显示 |
  | `d`         | 更改刷新频率，默认为 3s                  |
  | `k`         | 杀死一个进程                             |
  | `l`         | 隐藏系统负载                             |
  | `shift + l` | 进行搜索                                 |

### load average 系统负载

[记一次 CPU 使用率低负载高的排查过程](https://blog.csdn.net/qq_29463709/article/details/106412861)

[Load Average (系统负载)](https://blog.csdn.net/evenness/article/details/7658221)

系统负载高，不代表 CPU 资源不足。高只是代表需要运行的队列累计过多。但队列中的任务实际可能是耗 CPU 的，也可能是耗 IO 及其他因素的

- load average 是怎么计算出来的

- load average 统计的是哪些状态的进程

## `iostat`

```sh
iostat -x -d 1

Linux 2.6.32-642.13.1.el6.x86_64 (CESHI_Game_YALI_3)    05/09/2019  _x86_64_    (4 CPU)

Device:         rrqm/s   wrqm/s     r/s     w/s   rsec/s   wsec/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
vda               0.00     0.00    0.00   72.00     0.00 72080.00  1001.11   159.52 3429.00    0.00 3429.00  13.89 100.00
dm-0              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
dm-1              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
dm-2              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
dm-3              0.00     0.00    0.00    0.00     0.00     0.00     0.00     0.00    0.00    0.00    0.00   0.00   0.00
```

| 指标       | 意义                                                             |
| :--------- | :--------------------------------------------------------------- |
| `rrqm/s`   | 每秒进行 merge 的读操作数目。即 rmerge/s                         |
| `wrqm/s`   | 每秒进行 merge 的写操作数目。即 wmerge/s                         |
| `r/s`      | 每秒完成的读 I/O 设备次数。即 rio/s                              |
| `w/s`      | 每秒完成的写 I/O 设备次数。即 wio/s                              |
| `rsec/s`   | 每秒读扇区数。即 rsect/s                                         |
| `wsec/s`   | 每秒写扇区数。即 wsect/s                                         |
| `rkB/s`    | 每秒读 K 字节数。是 rsect/s 的一半，因为每扇区大小为 512 字节。  |
| `wkB/s`    | 每秒写 K 字节数。是 wsect/s 的一半。                             |
| `avgrq-sz` | 平均每次设备 I/O 操作的数据大小 (扇区)。                         |
| `avgqu-sz` | 平均 I/O 队列长度。                                              |
| `await`    | 平均每次设备 I/O 操作的等待时间 (毫秒)。                         |
| `svctm`    | 平均每次设备 I/O 操作的服务时间 (毫秒)。                         |
| `%util`    | 一秒中有百分之多少的时间用于 I/O 操作，即被 io 消耗的 cpu 百分比 |

- 如果 `%util` 接近 100%，说明产生的 I/O 请求太多，I/O 系统已经满负荷，该磁盘可能存在瓶颈

- 如果 `svctm` 比较接近 `await`，说明 I/O 几乎没有等待时间

- 如果 `await` 远大于 `svctm`，说明 I/O 队列太长，io 响应太慢，则需要进行必要优化

- 如果 `avgqu-sz` 比较大，也表示有当量 io 在等待。

### `iowait`

> [理解 %IOWAIT](https://blog.csdn.net/linux_hua130/article/details/51368057)

- `%iowait` 表示在一个采样周期内有百分之几的时间属于以下情况：CPU 空闲、并且有仍未完成的 I/O 请求

- `%iowait` 高并不一定代表 I/O 有性能瓶颈，而是与 I/O 的并发度相关，当系统中只有 I/O 类型的进程在运行时也会很高，仅凭 `%iowait` 的上升不能得出 I/O 负载增加的结论

## `pidstat`

> 监控进程的 CPU、内存、线程、设备 IO 等系统资源的占用情况

- [pidstat 命令详解](<https://www.jianshu.com/p/3991c0dba094#%E7%A4%BA%E4%BE%8B%E4%BA%8C:%20cpu%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5%E7%BB%9F%E8%AE%A1(-u)>)

- 监控指定进程资源占用

  ```sh
  # 每秒刷新一次
  pidstat -p 12243 1
  ```

- `pidstat -u` CPU 使用情况统计

  > 默认输出的就是 CPU 的统计信息

  ```sh
  # 查看全部
  pidstat

  Linux 4.4.0-22000-Microsoft (DESKTOP-HSENS6B)   08/19/2021      _x86_64_        (4 CPU)

  11:44:39 PM   UID       PID    %usr %system  %guest   %wait    %CPU   CPU  Command
  11:44:39 PM     0         1    0.00    0.00    0.00    0.00    0.00     0  init
  11:44:39 PM   112       175    0.00    0.00    0.00    0.00    0.01     0  redis-server
  11:44:39 PM   113       389    0.00    0.00    0.00    0.00    0.00     0  mysqld_safe
  11:44:39 PM   113       825    0.00    0.00    0.00    0.00    0.00     0  mysqld
  11:44:39 PM  1000      5089    0.00    0.00    0.00    0.00    0.00     0  pidstat
  ```

  | 指标      | 意义                            |
  | :-------- | :------------------------------ |
  | `UID`     |                                 |
  | `PID`     |                                 |
  | `%usr`    | 进程在用户空间占用 cpu 的百分比 |
  | `%system` | 进程在内核空间占用 cpu 的百分比 |
  | `%guest`  | 进程在虚拟机占用 cpu 的百分比   |
  | `%wait`   |                                 |
  | `%CPU`    | 该进程的总 CPU 使用率           |
  | `CPU`     |                                 |
  | `Command` |                                 |

- `pidstat -d` IO 使用情况统计

  ```sh
  linux:~ # pidstat -d 1 2
  Linux 2.6.32.12-0.7-default (linux)             06/18/12        _x86_64_

  17:11:36          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
  17:11:37        14579 124988.24      0.00      0.00  dd

  17:11:37          PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
  17:11:38        14579 105441.58      0.00      0.00  dd
  ```

  | 指标        | 意义                                                           |
  | :---------- | :------------------------------------------------------------- |
  | `PID`       |                                                                |
  | `kB_rd/s`   | 每秒进程从磁盘读取的数据量(以 kB 为单位)                       |
  | `kB_wr/s`   | 每秒进程向磁盘写的数据量(以 kB 为单位)                         |
  | `kB_ccwr/s` | 任务取消的写入磁盘的 KB。当任务截断脏的 pagecache 的时候会发生 |
  | `Command`   | 进程命令                                                       |

- `pidstat -r` 内存使用情况统计

  ```sh
  linux:~ # pidstat -r -p 13084 1
  Linux 2.6.32.12-0.7-default (linux)             06/18/12        _x86_64_

  15:08:18          PID  minflt/s  majflt/s     VSZ    RSS   %MEM  Command
  15:08:19        13084 133835.00      0.00 15720284 15716896  96.26  mmmm
  15:08:20        13084  35807.00      0.00 15863504 15849756  97.07  mmmm
  15:08:21        13084  19273.87      0.00 15949040 15792944  96.72  mmmm
  ```

  | 指标       | 意义                                                                                                                                                               |
  | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `PID`      | 进程 ID                                                                                                                                                            |
  | `minflt/s` | 每秒次缺页错误次数(minor page faults)，次缺页错误次数意即虚拟内存地址映射成物理内存地址产生的 page fault 次数                                                      |
  | `majflt/s` | 每秒主缺页错误次数(major page faults)，当虚拟内存地址映射成物理内存地址时，相应的 page 在 swap 中，这样的 page fault 为 major page fault，一般在内存使用紧张时产生 |
  | `VSZ`      | 该进程使用的虚拟内存(以 kB 为单位)                                                                                                                                 |
  | `RSS`      | 该进程使用的物理内存(以 kB 为单位)                                                                                                                                 |
  | `%MEM`     | 该进程使用内存的百分比                                                                                                                                             |
  | `Command`  | 进程命令                                                                                                                                                           |

- `pidstat -l` 显示出详细命令

## `vmstat`

## `mpstat`

- `mpstat -P ALL 1`

## `ps`

> [linux ps 命令](https://www.cnblogs.com/xiangtingshen/p/10920236.html)

| 选项              | 意义                         |
| :---------------- | :--------------------------- |
| `a`               | 显示所有进程                 |
| `-a`              | 显示同一终端下的所有程序     |
| `-A`              | 显示所有进程                 |
| `c`               | 显示进程的真实名称           |
| `-N`              | 反向选择                     |
| `-e`              | 等于 -A                      |
| `e`               | 显示环境变量                 |
| `f`               | 显示程序间的关系             |
| `-H`              | 显示树状结构                 |
| `r`               | 显示当前终端的进程           |
| `T`               | 显示当前终端的所有程序       |
| `u`               | 指定用户的所有进程           |
| `-au`             | 显示较详细的资讯             |
| `-aux`            | 显示所有包含其他使用者的进程 |
| `-C<命令>`        | 列出指定命令的状况           |
| `--lines<行数>`   | 每页显示的行数               |
| `--width<字符数>` | 每页显示的字符数             |
| `--help`          | 显示帮助信息                 |
| `--version`       | 显示版本显示                 |

- 显示父进程

  ```sh
  ps -ef | grep apache  # 加 - 和不加 - 结果是不一样的
  ```

- `ps -aux` 输出信息含义

  ```sh
  USER   PID %CPU %MEM    VSZ     RSS   TTY  STAT START   TIME   COMMAND
  root   1   0.0  0.3    185228   3100  ?    Ss   May23   0:08   /lib/systemd/systemd --system --deserialize 21
  ```

  | 列名      | 含义                                                                               |
  | --------- | ---------------------------------------------------------------------------------- |
  | `USER`    | 该进程 属于那个使用者账号的                                                        |
  | `PID`     | 该进程 的号码                                                                      |
  | `%CPU`    | 该进程 使用掉的 CPU 资源百分比                                                     |
  | `%MEM`    | 该进程 所占用的物理内存百分比                                                      |
  | `VSZ`     | 该进程 使用掉的虚拟内存量 (Kbytes)                                                 |
  | `RSS`     | 该进程 占用的固定的内存量 (Kbytes)                                                 |
  | `TTY`     | 该进程 是在那个终端机上面运作，若与终端机无关，则显示 ?                            |
  | `STAT`    | 该进程 目前的状态，主要的状态有                                                    |
  | `R`       | 该进程 目前正在运作，或者是可被运作                                                |
  | `S`       | 该进程 目前正在睡眠当中 (可说是 idle 状态)，但可被某些讯号 (signal) 唤醒           |
  | `T`       | 该进程 目前正在侦测或者是停止了                                                    |
  | `Z`       | 该进程 应该已经终止，但是其父程序却无法正常的终止他，造成 zombie (疆尸) 程序的状态 |
  | `START`   | 该进程 被触发启动的时间                                                            |
  | `TIME`    | 该进程 实际使用 CPU 运作的时间                                                     |
  | `COMMAND` | 该进程 实际指令                                                                    |

- [`RSS` 和 `VSZ`](https://www.jianshu.com/p/9bf36aa82f90)

- 查看进程启动和运行时间

  ```sh
  ps -eo pid,lstart,etime|grep 37275
  #lstart 启动时间
  #etime 运行时间
  #PID 为37275  必须是进程id
  ```

- 查看进程的线程

  ```sh
  # 每一行显示的是线程
  top -H -p $pid

  # 查看所有存在的线程
  ps -xH

  pstree -p | grep [process_name]

  # 查看指定进程产生的线程数
  ps -mq [pid]
  ```

- 查看完整命令

  ```sh
  protram_name=your_program_name
  readlink -f /proc/$(ps -ef | grep ${protram_name}| grep -v grep | awk '{print $2}')/exe
  ```

## `/proc/[pid]`

- 查看进程占用句柄数（打开的文件描述符）

  ```sh
  ls /proc/[pid]/fd -l

  # 查看多一点
  total=0
  for i in $(ps auxf | grep apache | grep -v grep | awk '{print $2}'); do
      pid_fds=$(ls /proc/$i/fd -l | wc -l)
      echo "pid: $i ===> fds: $pid_fds"
      total=$(($total + $pid_fds))
  done
  echo ""
  echo "total ===> $total"
  ```

## `/proc/net/tcp`

- [关于 `/proc/[pid]/fd` , 根据 fd 来查找连接](https://www.cnblogs.com/youxin/p/4744652.html)

- [`/proc/net/tcp` 中各项参数说明](https://www.cnblogs.com/zlingh/p/6132462.html)

![alt](http://img-blog.csdn.net/20140311180218984?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvanVzdGxpbnV4MjAxMA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

```sh
# 跟踪网络系统调用
strace -f -e trace=network -s 10000 -p 8612

# 可以看到这样的系统调用，想知道 18 这个文件描述符的对端是谁
# 8636  recvfrom(18, "\1\0\0\223\1\0\0\0\1\0\203\0\255T\6\0\0\0\0\0\10\222/\22\f\346\200\273\351\203\250\345\210\207\346\215\242\32\7network\"\20server_switching*M\345\244\232\346\225\260\346\215\256\344\270\255\345\277\203\350\277\236\346\216\245(\345\215\216\345\215\227), \351\232\247\351\201\223\344\270\255\346\226\255\357\274\214\345\210\207\346\215\242\350\207\263\344\270\213\344\270\200\346\200\273\351\203\250(\346\261\207\345\244\25101)0\0018\330\347\234\215\6", 8192, 0, NULL, NULL) = 151

# 查看该进程下打开的文件描述符
ls -l /proc/[pid]/fd
total 0
lrwx------ 1 root root 64 Dec  1 09:33 0 -> /dev/null
lrwx------ 1 root root 64 Dec  1 09:33 1 -> /dev/null
lrwx------ 1 root root 64 Dec  1 09:33 18 -> socket:[34220]  ### 看到 18 是这个 socket 套接字，34220 就是这个文件的 inode


# 根据这个文件的 inode 去查找对应的网络连接
cat /proc/net/tcp | grep 34220
#  sl    local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout   inode
# 12478: 0100007F:16A6 0100007F:A21D 01 00000000:00000000 00:00000000 00000000     0        0   34220 1 ffff8807533cab80 20 4 28 10 24
# 转换成对应的十进制
# 16A6 ---> 5798
# A21D ---> 41501

# 根据端口可以看到对端服务是 c_logsvr
netstat -apn | grep 41501
# tcp        0      0 127.0.0.1:5798          127.0.0.1:41501         ESTABLISHED 8612/c_alarm
# tcp        0      0 127.0.0.1:41501         127.0.0.1:5798          ESTABLISHED 8779/c_logsvr
```

## systemctl 和 service

[最简明扼要的 Systemd 教程，只需十分钟](https://blog.csdn.net/weixin_37766296/article/details/80192633)

[linux systemctl 命令](https://www.cnblogs.com/sparkdev/p/8472711.html)

[Linux 下 systemctl 命令和 service、chkconfig 命令的区别](https://blog.csdn.net/qq_38265137/article/details/83081881)

[Ubuntu16 将 nginx(openresty) 加入 service 服务](https://blog.csdn.net/weixin_43789195/article/details/113740161)

[systemctl 实现开机自启服务](https://blog.csdn.net/qq_29663071/article/details/80814081)

![alt](https://img-blog.csdnimg.cn/20201231221643939.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQzNjg1MDQw,size_16,color_FFFFFF,t_70)

- [配置进程参数](https://blog.csdn.net/ggh5201314/article/details/89297734)

  ```ini
  # 句柄数
  LimitNOFILE
  ```

- 配置文件路径

  ```log
  # 配置文件优先级依次从高到低
  # 如果同一选项三个地方都配置了，优先级高的会覆盖优先级低的
  ┌────────────────────────┬─────────────────────────────┐
  │Path                    │ Description                 │
  ├────────────────────────┼─────────────────────────────┤
  │/etc/systemd/system     │ Local configuration         │
  ├────────────────────────┼─────────────────────────────┤
  │/run/systemd/system     │ Runtime units               │
  ├────────────────────────┼─────────────────────────────┤
  │/lib/systemd/system     │ Units of installed packages │
  └────────────────────────┴─────────────────────────────┘
  ```

- **如果发现配置无效，一定要看一下配置文件的路径和自己改的那个文件是不是同一个，有的放在了 `/etc/systemd/system` 有的放在 `/lib/systemd/system`**

- 系统后台进程管理工具，和 `service` 、`supervisor` 功能类似；为了方便系统中各项服务的启动和停止，要不然的话，一个服务一个路径，系统管理员很难做控制

  ```log
  systemctl = system ctrol ==> 所以命令是： systemctl status [service_name]

  service ==> 所以命令是： service [service_name] status
  ```

  - `service`来管理服务的时候，其实是去 `/etc/init.d/` 寻找执行脚本，所以添加服务，也是在这下面添加

  - `chkconfig` 是管理系统服务(service)的命令行工具。所谓系统服务(service)，就是随系统启动而启动，随系统关闭而关闭的程序

  - `systemctl`中，也类似，文件目录有所不同，在 `/lib/systemd/system` 目录下创建一个 `xxxx.service` 脚本文件来管理 `xxx`服务； `systemctl = service + chkconfig`

    systemctl 是 RHEL 7 的服务管理工具中主要的工具，它融合之前 service 和 chkconfig 的功能于一体。可以使用它永久性或只在当前会话中启用 / 禁用服务。

- 配置说明

  ```ini
  [Unit]
  ; 描述信息
  Description=Tomcat
  ; 指在哪个服务启动后在启动
  After=network.target syslog.target

  [Service]
  ; 服务类型
  Type=forking

  ; pid文件
  PIDFile=/usr/local/tomcat/pid

  ; 环境变量，也可以通过 EnvironmentFile 指定环境变量文件
  Environment="CATALINA_PTH=/usr/local/tomcat/bin/"

  ; 启动、重启、停止服务的命令
  ExecStart=/absolute/path/to/catalina.sh start
  ExecReload=/absolute/path/to/catalina.sh restart
  ExecStop=/absolute/path/to/catalina.sh stop

  ; always: 只要不是通过 systemctl stop 来停止服务，任何情况下都必须要重启服务，默认值为no
  ; on-failure
  Restart=always

  ; 重启间隔，比如某次异常后，等待5(s)再进行启动，默认值0.1(s)
  RestartSec=5

  ; 当服务挂掉 10s 后重启
  TimeoutStartSec=10

  ; 无限次重启，默认是10秒内如果重启超过5次则不再重启，设置为0表示不限次数重启
  StartLimitInterval=0

  ; 忽略某些退出信号，比如忽略 exit code 为 143 以及信号为 TERM 和 KILL 的情况
  RestartPreventExitStatus= 143 SIGTERM SIGKILL

  [Install]
  ; 表示以哪种方式启动：multi-user.target表明当系统以多用户方式（默认的运行级别）启动时，这个服务需要被自动运行
  WantedBy=multi-user.target
  ```

- 常用命令

  - `systemctl cat [service_name]` 查看某个服务配置

  - `systemctl mask [service_name]` 临时禁止某服务

  - `systemctl unmask [service_name]` 取消禁止某服务

  - `systemctl daemon-reload` 刷新配置，配置有更新的时候需要刷新 `systemctl` 才能识别

  - `systemctl enable [service_name]` 将该服务加入**开机自启**，禁止的话就是 `disable`

  - `systemctl list-units --type=service` 显示有哪些已启动的服务

  - `systemctl list-unit-files | grep enabled` 查看有哪些服务是**开启的**

  - `systemctl --failed` 查看有哪些服务启动失败了

  - `systemctl is-failed [server_name] | grep -w active` 检查当前服务状态: `failed`、`active`、`inactive`

- [systemctl start xxx 阻塞卡住的问题](https://blog.csdn.net/Sardkit/article/details/79911925)

- `EnvironmentFile` 指定当前服务的环境参数文件

## `journalctl`

- [使用方法](https://www.cnblogs.com/cocowool/p/systemd_journal_log.html)

- `systemd` 统一管理所有 `unit` 的启动日志。带来的好处就是可以只用 `journalctl` 一个命令，查看所有日志（内核日志和 应用日志）。日志的配置文件 `/etc/systemd/journald.conf`

- 在 `systemd` 出现之前，`linux` 系统及各应用的日志都是分别管理的，`systemd` 开始统一管理了所有 `unit` 的启动日志，这样带来的好处就是可以只用一个 `journalctl` 命令，查看所有内核和应用的日志

- `journalctl -u [server_name]` 查看某个服务的启动日志

## 日志

### syslog

[linux syslog 格式详解](https://blog.csdn.net/zhezhebie/article/details/75222667)

[linux 系统日志以及分析](https://blog.csdn.net/dubendi/article/details/78782691)

![alt](http://images2015.cnblogs.com/blog/895931/201611/895931-20161125084136315-473310908.png)

`/var/log/messages`：记录 Linux 操作系统常见的系统和服务错误信息

### logrotate

> 期望是一个服务保存 7 天的日志，每天 2 份日志，每份日志最多 50 M

[日志切割之 Logrotate](https://www.cnblogs.com/clsn/p/8428257.html)

- [★ logrotate 机制和原理](https://cloud.tencent.com/developer/article/1363352)

  - 创建新的日志文件，文件名和原来日志文件一样。虽然新的日志文件和原来日志文件的名字一样，但是 inode 编号不一样，所以程序输出的日志还是往原日志文件输出。

  - **通过某些方式通知程序**，重新打开日志文件。程序重新打开日志文件，靠的是文件路径而不是 **inode 编号**，所以打开的是新的日志文件。

  - 如果程序不支持重新打开日志的功能，又不能粗暴地重启程序，怎么滚动日志呢？`copytruncate` 的方案出场了。**思路是把正在输出的日志拷(copy)一份出来，再清空(trucate)原来的日志**

  - 日志在拷贝完到清空文件这段时间内，程序输出的日志没有备份就清空了，这些日志不是丢了吗？是的，copytruncate 有丢失部分日志内容的风险

- 配置文件路径 `/etc/logrotate.conf 和 /etc/logrotate.d/`

- `logrotate` 是基于 CRON 来运行的，安装时就配置好定时任务了 `/etc/cron.daily/logrotate`（如果要看到执行日志，需要价格 `-v` 参数，就可以在 cron 的日志 `/var/log/cron`下看到具体过程了），系统每天定时执行，日志轮转是系统自动完成的。先压缩完才能删除原始文件；`/var/lib/logrotate/logrotate.status` 记录着所有配置文件的状态

- [cron 和 logrotate 的时间怎么协调的](https://stackoverflow.com/questions/43678387/logrotate-daily-weekly-monthly)

  既然安装时自动加了个 `/etc/cron.daily/logrotate` 每天的定时任务，且 `/etc/logrotate.conf` 默认是 `weekly`，那他是怎么实现每天轮转的呢？每周呢？需不需要在 `cron.weekly` 下面加脚本？

  > cron runs logrotate once a day (see /etc/cron.daily/logrotate), and logrotate then decides what to do based on the configuration files.

  可以认为 `cron` 是检查的时间间隔；`logrotate` 是日志轮转的间隔

- 配置文件新增在 `/etc/logrotate.d/xxx`

  ```ini
  ### 不配置的话，默认会继承 `/etc/logrorate.conf` 的全局变量

  ; 默认每一周执行一次 rotate 轮转工作，其它可用值为'daily'，'weekly'或者'yearly'。
  daily

  ; 文件大小（默认为 K）
  size 1M

  ; 当到达timeperiod，例如daily，日志大小至少为#MB才会触发rotate，否则啥也不处理。
  minsize

  ; 在日志轮循期间，任何错误将被忽略，例如 “文件无法找到” 之类的错误
  missingok

  ; 保留多少个日志文件(轮转几次).默认保留四个，0 指没有备份（一天一份）
  rotate 4

  ; 如果日志为空则不滚动
  notifempty

  ; prerotate 滚动前执行的脚本
  ; postrotate 滚动后执行的脚本
  prerotate
    ... 脚本内容
  endscript

  ; 自动创建新的日志文件，新的日志文件具有和原来的文件相同的权限
  ; 因为日志被改名，因此要创建一个新的来继续存储之前的日志
  create

  ; 切割后的日志文件以当前日期为格式结尾，如 xxx.log-20131216 这样
  ; 默认切割出来是按数字递增,即前面说的 xxx.log-1这种格式
  dateext

  ; 是否通过gzip压缩转储以后的日志文件，如xxx.log-20131216.gz
  compress

  ; 和 compress 一起使用时，转储的日志文件到下一次转储时才压缩
  delaycompress

  ; mode owner group 转储文件，使用指定的文件模式创建新的日志文件
  create 0644 www-data ymserver

  ; 轮训日志时切换设置的用户 / 用户组来执行（默认是 root）
  ; 如果设置的 user/group 没有权限去让文件容用 create 选项指定的拥有者，会触发错误
  su root root

  ; 如果没有设置，操作方式：是将原 log 日志文件，移动成类似 log.1 的旧文件， 然后创建一个新的文件。
  ; 如果设置了，操作方式：拷贝原日志文件，并且将其变成大小为 0 的文件。
  copytruncate
  ```

- 支持的选项

  ```sh
  logrotate [OPTION...] <configfile>

  -d, --debug ：debug模式，测试配置文件是否有错误
  -f, --force ：强制转储文件               ######## 可以借此判断配置是否正确
  -m, --mail=command ：压缩日志后，发送日志到指定邮箱
  -s, --state=statefile ：使用指定的状态文件
  -v, --verbose ：显示转储过程
  ```

- [按天和文件大小分割](https://stackoverflow.com/questions/20162176/centos-linux-setting-logrotate-to-maximum-file-size-for-all-logs)，我们可以根据日志文件的大小，也可以根据其天数来转储，这个过程一般通过 cron 程序来执行

  [logrotate 的三个大小相关的参数](https://www.jianshu.com/p/93e888f4492e)

  - size，一旦设置了 size 参数，滚动周期参数就自动无效了，只要每次执行 logrotate 指令时，文件大小超过 size，就会触发一次滚动，没有滚动周期一说了

  - minsize，当到达 timeperiod，例如 daily，**时间到，且，日志大小至少为 xxx 大小才触发**，否则啥也不处理

  - maxsize，当日志大小超过 maxsize，**或者** 到达 timeperiod，满足任一条件，均会触发

  - 如果一个`日志分割周期`被定义为 hourly，但是 logrotate 的 `cron 调度周期`还是 daily 的话，那么这个日志的 hourly 分割周期是无效的，因为 logrotate 才每天调度一次，导致日志的实际分割周期是天。

  - 因此 logrotate 的调度周期不能比任何日志的分割周期长。假设最小的日志分割周期需求是 hourly，那么 logrotate 的调度周期最多是一小时，只能更小。

## `supervisor`

> 类似 systemctl 的进程管理工具

[upervisord进程守护的使用以及与systemd的对比](https://juejin.cn/post/6844904154897317902)

[[web - cgi]]

[配置](https://www.keepnight.com/archives/1797)

```sh
mkdir -p /etc/supervisord.d

echo_supervisord_conf > supervisor.conf

```

## `pstack`

[跟踪进程栈](https://www.cnblogs.com/kongzhongqijing/articles/7685699.html)

## `strace`

[linux 工具-strace](https://leokongwq.github.io/2016/10/15/linux-strace.html)

[Linux strace 命令](https://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316692.html)

```sh
$strace -T -tt -f -F [programe]
```

### 常用选项

| 选项               | 说明                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| `-c`               | 统计每一系统调用的所执行的时间,次数和出错的次数等                                                   |
| `-d`               | 输出 strace 关于标准错误的调试信息                                                                  |
| `-f`               | 跟踪由 fork 调用所产生的子进程                                                                      |
| `-ff`              | 如果提供 `-o filename`,则所有进程的跟踪结果输出到相应的 `filename.pid` 中，pid 是各进程的进程号     |
| `-F`               | 尝试跟踪 `vfork` 调用.在 `-f` 时, `vfork` 不被跟踪                                                  |
| `-h`               | 输出简要的帮助信息                                                                                  |
| `-i`               | 输出系统调用的入口指针                                                                              |
| `-q`               | 禁止输出关于脱离的消息                                                                              |
| `-r`               | 打印出相对时间关于,,每一个系统调用                                                                  |
| `-t`               | 在输出中的每一行前加上时间信息                                                                      |
| `-tt`              | 在输出中的每一行前加上时间信息,微秒级                                                               |
| `-ttt`             | 微秒级输出,以秒了表示时间                                                                           |
| `-T`               | 显示每一调用所耗的时间                                                                              |
| `-v`               | 输出所有的系统调用.一些调用关于环境变量,状态,输入输出等调用由于使用频繁,默认不输出                  |
| `-V`               | 输出 strace 的版本信息                                                                              |
| `-x`               | 以十六进制形式输出非标准字符                                                                        |
| `-xx`              | 所有字符串以十六进制形式输出                                                                        |
| `-a column`        | 设置返回值的输出位置.默认 为 40                                                                     |
| `-e trace=set`     | 只跟踪指定的系统 调用.例如:-e trace=open,close,rean,write 表示只跟踪这四个系统调用.默认的为 set=all |
| `-e trace=file`    | 只跟踪有关文件操作的系统调用                                                                        |
| `-e trace=proces`  | 只跟踪有关进程控制的系统调用                                                                        |
| `-e trace=network` | 跟踪与网络有关的所有系统调用                                                                        |
| `-e strace=signal` | 跟踪所有与系统信号有关的 系统调用                                                                   |
| `-e trace=ip`      | 跟踪所有与进程通讯有关的系统调用                                                                    |
| `-e abbrev=set`    | 设定 strace 输出的系统调用的结果集.-v 等与 abbrev=none.默认为 abbrev=all                            |
| `-e raw=set`       | 将指 定的系统调用的参数以十六进制显示                                                               |
| `-e signal=set`    | 指定跟踪的系统信号.默认为 all.如 signal=!SIGIO(或者 signal=!io),表示不跟踪 SIGIO 信号               |
| `-e read=set`      | 输出从指定文件中读出 的数据.例如 -e read=3                                                          |
| `-e write=set`     | 输出写入到指定文件中的数据                                                                          |
| `-o filename`      | 将 strace 的输出写入文件 filename                                                                   |
| `-p pid`           | 跟踪指定的进程 pid                                                                                  |
| `-s strsize`       | 指定输出的字符串的最大长度.默认为 32.文件名一直全部输出                                             |
| `-u username`      | 以 username 的 UID 和 GID 执行被跟踪的命令                                                          |

### 使用记录

- 用来跟踪用户空间进程的系统调用和信号

  ```sh
  strace -t -T -v -f -p [pid]
  ```

- 跟踪已经在运行的进程，包括子进程

  ```sh
  strace -f -p [pid]
  ```

- 指定跟踪类型

  ```sh
  # 跟踪与网络有关的所有系统调用
  strace -e trace=network -p [pid]
  ```

- 统计进程哪种系统调用最多

  ```sh
  strace -c -p [pid]
  ```

- `strace -o output.txt -T -tt -e trace=all -p $pid` 跟踪 28979 进程的所有系统调用（`-e trace=all`），并统计系统调用的花费时间，以及开始时间（并以可视化的时分秒格式显示），最后将记录结果存在 `output.txt` 文件里面
