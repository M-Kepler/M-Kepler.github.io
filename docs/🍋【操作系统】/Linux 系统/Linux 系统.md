- [参考资料](#参考资料)
- [Linux 系统](#linux-系统)
  - [`keepalived`](#keepalived)
  - [环境变量](#环境变量)
  - [`./config`](#config)
  - [文件系统](#文件系统)
    - [目录结构](#目录结构)
      - [`/etc/rc*.d`](#etcrcd)
      - [`/etc/init.d`](#etcinitd)
    - [`dev`](#dev)
    - [`var`](#var)
  - [网络](#网络)
    - [CONSOLE 串口](#console-串口)
    - [网卡工作模式](#网卡工作模式)
      - [混杂模式](#混杂模式)
    - [IP 地址](#ip-地址)
  - [信号](#信号)

# 参考资料

- [★ 工具参考篇](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/index.html)

- [Linux Command](http://man.linuxde.net/)

- [Linux 工具快速教程](https://linuxtools-rst.readthedocs.io/zh_CN/latest/index.html)

- [每天一个 linux 命令](https://www.cnblogs.com/peida/tag/%E6%AF%8F%E6%97%A5%E4%B8%80linux%E5%91%BD%E4%BB%A4/)

- [一步一步学 Linux 系列教程汇总](https://blog.csdn.net/dengjin20104042056/article/details/94669639)

# Linux 系统

> [apt](https://www.cnblogs.com/chao538/p/7906279.html)

## `keepalived`

- [Linux 下安装 keepalived 及原理解析](https://blog.csdn.net/terry100000/article/details/80156983)

## 环境变量

[Linux 启动时读取配置文件的顺序](https://blog.csdn.net/lei_qi/article/details/121694489)

## `./config`

## 文件系统

- `文件描述符` 本质上是非负整数，通常是小整数，它是一个索引，通过该索引可以找到对应的文件

- stat 文件时间

  ```sh
  stat -c %x test_file  # 获取最近访问时间

  %x     # Time of last access 最近访问时间 atime
  %X     # Time of last access as seconds since Epoch
  %y     # Time of last modification 最近修改时间 mtime
  %Y     # Time of last modification as seconds since Epoch
  %z     # Time of last change 最近变化时间  ctime
  %Z     # Time of last change as seconds since Epoch
  ```

### 目录结构

| 目录                | 用途                                                                                             |
| :------------------ | :----------------------------------------------------------------------------------------------- |
| `/bin`              | 存放二进制可执行文件(ls,cat,mkdir 等)，常用命令一般都在这里                                      |
| **`/etc`**          | 存放系统管理和配置文                                                                             |
| `/etc/init.d`       | 很多服务的启动脚本在这里，通过`service mysql status/start/stop`来管理，也可以直接执行下面的脚本  |
| `/etc/rc*.d`        | 各个启动级别的可执行程序的软链接目录                                                             |
| `/etc/sysconfig`    |                                                                                                  |
| `/usr`              | 用于存放系统应用程序                                                                             |
| `/usr/bin`          | 几乎所有的用户命令，有的在`usr/local/bin`                                                        |
| `/usr/sbin`         | 超级用户的一些管理程序                                                                           |
| `/usr/lib`          | 常用的动态链接库和软件包的配置文件                                                               |
| `/usr/doc`          | linux 文档                                                                                       |
| `/usr/include`      | linux 下开发和编译应用程序所需要的头文件                                                         |
| `/usr/src`          | 源代码，linux 内核的源代码就放在 `/usr/src/linux` 里                                             |
| `/usr/local`        | 用户级的程序目录，用户自己编译的软件默认会安装到这个目录下                                       |
| `/usr/local/bin`    | 本地增加的命令                                                                                   |
| `/usr/local/lib`    | 本地增加的库                                                                                     |
| `/opt`              | 额外安装的第三方应用程序包所放置的位置。一般情况下，我们可以把 tomcat 等都安装到这里             |
| **`/proc`**         | 虚拟文件系统目录，是系统内存的映射。可直接访问这个目录来获取系统信息                             |
| `/sbin`             | 存放二进制可执行文件，只有 root 才能访问。这里存放的是系统管理员使用的系统级别的管理命令和程序。 |
| `/dev`              | 用于存放设备文件                                                                                 |
| `/mnt`              | 系统管理员安装临时文件系统的安装点，系统提供这个目录是让用户临时挂载其他的文件系统               |
| **`/boot`**         | 存放用于**系统引导启动**时使用的各种文件                                                         |
| **`/lib`**          | 存放跟文件系统中的程序运行所需要的**共享库**及内核模块                                           |
| `/tmp`              | 用于存放各种临时文件，是公用的临时文件存储点，系统会自动清理 `内存文件系统`，放这里会快一点      |
| **`/var`**          | 用于存放**运行时需要改变数据的文件**，也是某些大文件的溢出区，比方说各种服务的**日志文件**等     |
| `/var/lib`          | 系统正常运行时要改变的文件                                                                       |
| `/var/local`        | `/usr/local` 中安装的程序的可变数据(即系统管理员安装的程序)                                      |
| `/var/lock`         | 锁定文件.许多程序遵循在/var/lock 中产生一个锁定文件的约定                                        |
| `/var/log`          | 各种程序的 Log 文件                                                                              |
| `/var/log/wtmp`     | login (/var/log/wtmp log 所有到系统的登录和注销)                                                 |
| `/var/log/messages` | syslog 里存储所有核心和系统程序信息. /var/log 里的文件经常不确定地增长，应该定期清除.            |
| `/var/run`          | 保存到下次引导前有效的关于系统的信息文件.例如， /var/run/utmp 包含当前登录的用户的信息           |
| `/var/spool`        | mail, news, 打印队列和其他队列工作的目录.每个不同的 spool 在/var/spool 下有自己的子目录          |
| `/var/tmp`          | 比/tmp 允许的大或需要存在较长时间的临时文件                                                      |
| `/lost+found`       | 这个目录平时是空的，系统非正常关机而留下“无家可归”的文件（windows 下叫什么.chk）就在这           |

#### `/etc/rc*.d`

> 各个启动级别的可执行程序的软链接目录

- `/etc/rc5.d` 表示优先级为 5 的启动脚本

- `ls -l /etc/rc5.d/*` 列出的全是 `S` 开头 + 数字（序号）+ 脚本名称的软连接，本体放在 `/etc/init.d/` 下面

- 脚本名称的含义

  - `S` 代表系统启动时需要启动的脚本

  - `K` 表示系统关闭时需要关闭的脚本

  - 数字代表**执行顺序** 这里有个坑，99 个就满了，100 个以后的就执行不到了。

#### `/etc/init.d`

- [理解 Linux 系统 / etc/init.d 目录和 / etc/rc.local 脚本](https://blog.csdn.net/pugu12/article/details/51001202)

### `dev`

- 设备文件有两种，一种是`块设备`, 一种是`字符设备`

  - 块设备的特点是可以随机读写（Random Access），比如内存、硬盘等
  - 字符设备的特点是顺序读写（Sequential Access），比如鼠标，键盘，麦克风等。

- `/dev/zero` 是 linux 提供的一个特殊的字符设备，从这个文件读出的结果永远都是`二进制的0`

### `var`

- [`/var/run` 目录](https://blog.csdn.net/ibsfn/article/details/82010943)

  > 该目录被迁移到`/run`了，可以看到 `/var/run` 是指向 `/run`的软链

  - 目录中`存放的是自系统启动以来描述系统信息的文件`，系统启动时会先清空该文件夹
  - 目录下 pid 文件的作用
    防止进程启动多个副本。只有获得 pid 文件(固定路径固定文件名)写入权限(F_WRLCK)的进程才能正常启动并把自身的 PID 写入该文件中。其它同一个程序的多余进程则自动退出

- `/var/run/xxx.sock` 是什么文件
  `/var/run` 目录中存放的是自系统启动以来描述系统信息的文件。比较常见的用途是 daemon 进程将自己的 pid 保存到这个目录。标准要求这个文件夹中的文件必须是在系统启动的时候清空，以便建立新的文件。为了达到这个要求，linux 中 `/var/run` 使用的是 `tmpfs` 文件系统，这是一种存储在内存中的临时文件系统，当机器关闭的时候，文件系统自然就被清空

## 网络

- [Linux 查看实时网卡流量的几种方式](https://www.jianshu.com/p/b9e942f3682c)

### CONSOLE 串口

- 设备的管理口，ssh 需要设备联网才能登上去进程配置，串口可以直接登上去

- 笔记本连接串口后，通过 我的电脑 - 管理 - 端口 可以看到多出来一个 `USB Serial Port(COM11)`
- `xshell` 新建会话，协议选择 `serial`

- 点击 连接 - SERIAL，选择刚才看到的端口 `COM11`，波特率 `Baud Rate` 选择 `115200` （不同产品这个值不一样）

### 网卡工作模式

#### 混杂模式

- 混杂模式（Promiscuous Mode）

  网卡能够接收所有经过它的数据流，而不论其目的地址是否是它他

- 非混杂模式

  只接收目的地址是本机的数据包

- 设置网卡为混杂模式

  ```sh
  # vi /etc/rc.d/rc.local 后面加上
  ip link set dev ens19 promisc on
  ```

### IP 地址

- `192.16.0.0/14` 按照 16 位掩码可以划分出以下子网：

  ```sh
  # 点分十进制，每个点间隔的是 8 位二进制数
  # 14 位网络地址掩码，一共可以分 2^(32 - 14) 262144 个主机地址
  # 按 16 位一共可以分 2^(16 - 14) = 4 个子网，每个子网 2^(32 - 16) 个主机地址

  192.16.0.0-192.16.255.255
  192.17.0.0-192.17.255.255
  192.18.0.0-192.18.255.255
  192.19.0.0-192.19.255.255
  ```

## 信号

- [Linux 进程被信号杀死后退出状态码(exit code)的分析](https://blog.csdn.net/halfclear/article/details/72783900)
