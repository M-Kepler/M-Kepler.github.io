- [参考资料](#参考资料)
- [网络](#网络)
  - [ping](#ping)
  - [`arp`](#arp)
  - [`ip`](#ip)
  - [`netcat`](#netcat)
  - [`nslookup`](#nslookup)
  - [`iperf`](#iperf)
  - [`tc`](#tc)
  - [防火墙](#防火墙)
    - [firewall-cmd](#firewall-cmd)
    - [iptables](#iptables)
  - [`route`](#route)
  - [`nmap`](#nmap)
  - [★ `tcpdump`](#-tcpdump)
    - [选项](#选项)
  - [`wireshark`](#wireshark)
    - [过滤规则](#过滤规则)
  - [`ss`](#ss)
  - [★ `netstat`](#-netstat)
  - [输出内容的意义](#输出内容的意义)
    - [常用选项](#常用选项)
    - [使用记录](#使用记录)
  - [`dns`](#dns)
    - [dnsmasq](#dnsmasq)
  - [`ethtool`](#ethtool)
  - [`ifconfig`](#ifconfig)
  - [`nload`](#nload)
  - [traceroute](#traceroute)
  - [其他](#其他)

# 参考资料

[ifconfig、route、ip route、ip addr、 ip link 用法](https://blog.51cto.com/13150617/1963833)

# 网络

## ping

[ping 的用法](https://blog.csdn.net/woailyoo0000/article/details/79914355)

- 显示时间

  ```sh
  ping 121.46.30.133 -t | awk '{print strftime("%Y.%m.%d %H:%M:%S",systime()) "\t" $0 }'
  ```

- 指定网卡 ping

  ```sh
  ping -I eth0 10.10.10.1
  ```

## `arp`

- 获取前置网关 `mac` 地址

  ```sh
  arp -an
  arp -an 200.200.255.254 # 查看指定网关的 mac 地址
  ```

- 刷新 `arp` 缓存表

  ```sh
  # 向 33.33.33.254 这个网关发 3 个 arp 包，如果收到回应则停止发包
  arping -I ge3 33.33.33.254 -c 3 -f
  ```

## `ip`

- `ip r` 查看路由表

- [centos 有两个网卡，两个默认网关](https://www.cnblogs.com/onlyworld/p/10475205.html)

  ```sh
  ip route show
  ip route del default via 1.1.1.1
  ```

## `netcat`

> 瑞士军刀

## `nslookup`

> 查询 DNS 记录，查询域名解析是否正常

- `nslookup www.baidu.com`

## `iperf`

- 常用参数

  ```sh
  -c    表示服务器的IP地址；
  -p    表示服务器的端口号；
  -t    参数可以指定传输测试的持续时间,Iperf在指定的时间内，重复的发送指定长度的数据包，默认是10秒钟.

  -i    设置每次报告之间的时间间隔，单位为秒，如果设置为非零值，就会按照此时间间隔输出测试报告，默认值为零；

  -w    设置套接字缓冲区为指定大小，对于TCP方式，此设置为TCP窗口大小，对于UDP方式，此设置为接受UDP数据包的缓冲区大小，限制可以接受数据包的最大值.

  --logfile    参数可以将输出的测试结果储存至文件中.

  -J  来输出JSON格式测试结果.
  -R  反向传输,缺省iperf3使用上传模式：Client负责发送数据，Server负责接收；如果需要测试下载速度，则在Client侧使用-R参数即可.
  ```

- `iperf` 网络性能测试

- 打流

  ```sh
  # 服务端
  iperf -s -p 8888 -u -i 1
  # 客户端
  iperf -c 200.200.77.181 -p 8888 -u -b 10M -i 1 -t 100
  ```

## `tc`

- [tc 模拟网络丢包和延时](https://www.jb51.net/article/161118.htm)

  ```sh
  # 构造 10% 丢包 和 10ms 延时
  tc qdisc add dev ge3 root netem loss 10% delay 10ms

  # 取消策略
  tc qdisc del dev eth0 root netem delay 10ms loss 10%
  ```

## 防火墙

### firewall-cmd

- [放通 80 端口](https://www.jianshu.com/p/dd663cb4affa)

  ```sh
  # 注：–permanent 永久生效，没有此参数重启后失效
  # 永久关闭端口
  # firewall-cmd --remove-port=80/tcp --permanent
  firewall-cmd --zone=public --add-port=80/tcp --permanent

  # 重新载入 返回 success 代表成功
  firewall-cmd --reload

  # 查看 返回 yes 代表开启成功
  firewall-cmd --zone=public --query-port=80/tcp

  ```

### iptables

- [linux 之 iptables](https://www.cnblogs.com/duanxin1/category/1324113.html)

- [iptables 防火墙](https://blog.csdn.net/archimedes123/article/details/86159019)

- [CentOS 配置 iptables 规则并使其永久生效](https://www.cnblogs.com/achengmu/p/9458806.html)

- 规则保存与恢复

  ```sh
  # 备份
  # -t 指定要保存的表的名称
  iptables-save -t filter > iptables_filter.bak

  # 还原
  iptables-restore iptables.bak
  ```

- 防火墙基于时间规则

  ```sh
  # 使用 kerneltz 消除时区影响（默认使用的是UTC时区）
  -A INPUT -m interface --interface input:ge3,usb0  -p tcp --dport 22  -m time --datestart 2020-06-29T10:37:59 --datestop 2020-06-29T18:37:59 --kerneltz -j ACCEPT
  ```

- 全部放通

  ```sh
  iptables -A INPUT ACCEPT
  ```

- [开放某个端口](https://www.cnblogs.com/jinjiyese153/p/8600855.html)

  ```sh
  # yum install iptables-services

  iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
  service iptables save
  systemctl enable iptables.service
  ```

## `route`

- [route 路由表设置](https://www.cnblogs.com/baiduboy/p/7278715.html)

- `route -n` 查看默认路由

- 添加静态路由

  ```sh
  # 添加到主机的路由
  # 给 eth0 网卡添加一条到达 10.1.111.111 的路由记录，网关是 10.2.111.111
  route add -host 10.1.111.111 gw 10.2.111.111 dev eth0

  # 添加到网络的路由
  # 比如 给 eth0 网卡添加一条到达网络 10.1.0.0/16 的路由，网关是 10.2.111.111
  # route add -net 目标网络 netmask 子网掩码 gw 网关 dev 接口
  route add -net 10.1.0.0 netmask 255.255.0.0 gw 10.2.111.111 dev eth0
  # 或者 route add -net 目标网络 / 子网掩码 gw 网关 dev 接口

  # 添加默认网关
  route add default gw 192.168.2.1
  # ip route add default via 1.2.3.1 dev eth3

  ```

- 删除路由记录

  删除路由记录只需要把添加路由记录命令中的 add 改成 del 就可以了，不过删除路由记录可以省略接口

  ```sh
  # 删除到达目标主机的路由记录
  route del -host 主机名

  # 删除到达目标网络的路由记录
  route del -net 目标网络 netmask 子网掩码

  # 删除默认路由
  route del default

  # 删除路由
  route del –host 192.168.1.11 dev eth0
  ```

- 调整优先级

  ```sh

  ```

## `nmap`

> 强大的端口扫描工具

- `-sP` Ping 扫描

  > 对某个或某段 ip 进行 ping 扫描

  ```sh
  nmap -sP 10.21.125.154
  nmap -sP 10.21.125.154-255
  ```

- `-sU` UDP 扫描

  ```sh
  sudo nmap -sU 10.21.125.154
  ```

- `-sT` TCP 扫描

## ★ `tcpdump`

[聊聊 tcpdump 与 Wireshark 抓包分析](https://mp.weixin.qq.com/s?__biz=MzAxODI5ODMwOA==&mid=2666539134&idx=1&sn=5166f0aac718685382c0aa1cb5dbca45&scene=5&srcid=0527iHXDsFlkjBlkxHbM2S3E#rd)

### 选项

| 类别 | 选项                                                                                                       |
| :--- | :--------------------------------------------------------------------------------------------------------- |
| 类型 | `host`, `net`, `port`                                                                                      |
| 方向 | `src`, `dst`, `src or dst`, `src and dst`                                                                  |
| 协议 | `ip`, `tcp`, `udp`, `arp`, `rarp`, `ether`, `fddi`                                                         |
| 逻辑 | `and`, `or`, `not` 或者 `&&`, `\|\|`, `!`                                                                  |
| 选项 | `-i` 指定网卡, `-n` 显示 ip, `-A` 文本显示，`-c` 抓包数 </br> `-x/-xx/-X/-XX` 二进制显示, `-r` 读, `-w` 写 |

- `-i` 指定网口

  本地环回 localhost 不经过以太网卡，在用 tcpdump 加参数 -i lo 来抓本地环回数据

  ```sh
  tcpdump -i eth0
  tcpdump -D # 会列出可供抓包的网口
  ```

- `-X` 以十六进制输出（可以看到内容）

  ```sh
  # -X：输出包的头部数据，会以16进制和ASCII两种方式同时输出。
  tcpdump -i eth0 tcp port 23 and host 210.27.48.1 -X
  ```

- `-e` 输出以太网信息（包含 IP 和端口）

- 指定 ip、端口、协议

  ```sh
  tcpdump -i eth0 tcp port 23 and host 210.27.48.1

  # -nn: 将 ip 解析为数字，第二个 n：将端口显示为数字

  tcpdump -i ge3 udp dst port 514 -nneevv
  ```

- `-w` 输出到文件

  ```sh
  tcpdump -i lo port 8888 -w /root/test.cap
  ```

- `dst / src` 指定数据方向

  ```sh
  # 抓取从10.118.193.12的3300端口发到本机的数据包
  tcpdump -i any src 10.118.193.12 and port 3300

  tcpdump -i lo src port 1111 and dst port 2222 -X
  ```

- 过滤常用表达式

  ```sh
  非: ! or "not" (去掉双引号)
  且: && or "and"
  或: || or "or"

  # 过滤某个 IP

  ```

- `-c` 只抓取 n 个数据包

  ```sh
  tcpdump -c 10 -i eth0 tcp port 23 and host 210.27.48.1 -X
  ```

- 抓取所有经过 eth1，目的地址是 192.168.1.254 或 192.168.1.200 端口是 80 的 TCP 数

  ```sh
  tcpdump -i eth1 '((tcp) and (port 80) and ((dst host 192.168.1.254) or (dst host 192.168.1.200)))'
  ```

## `wireshark`

### 过滤规则

## `ss`

## ★ `netstat`

[不可不知的网络命令 - netstat](https://zhuanlan.zhihu.com/p/69862354)

[Linux netstat 命令详解](https://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316661.HTML)

- netstat 中显示的 `:::` 是什么意思

  ```sh
  # 基本上表示 “任何“
  :::  # 在IPv6中
  0.0.0.0  # 在IPv4中
  ```

## 输出内容的意义

```sh
$netstat -apn | grep 6333
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.1:6333          0.0.0.0:*               LISTEN      6015/redis-server 1
tcp        0      0 127.0.0.1:42963         127.0.0.1:6333          ESTABLISHED 10507/python
tcp        0      0 127.0.0.1:39792         127.0.0.1:6333          ESTABLISHED 10484/python

# Local Address 监听地址
```

### 常用选项

```sh
-a    (all)显示所有选项，默认不显示LISTEN相关
-t    (tcp)仅显示tcp相关选项
-u    (udp)仅显示udp相关选项
-n    拒绝显示别名，能显示数字的全部转化成数字。
-l    仅列出有在 Listen (监听) 的服务状态
-p    显示建立相关链接的程序名
-r    显示路由信息，路由表
-e    显示扩展信息，例如uid等
-s    按各个协议进行统计
-c    每隔一个固定时间，执行该netstat命令。

提示：LISTEN 和 LISTENING 的状态只有用 -a 或者 -l 才能看到
```

### 使用记录

- `netstat -apn`

  ```sh
  -a : 显示所有的连接
  -n : 以ip格式显示
  -p : 显示连接对应的进程
  ```

- 查看端口对应的服务

  ```sh
  netstat -tunlp | grep [port]
  lsof -i:[port]
  ```

- 统计各种网络状态的数量

  ```sh
  netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'

  # 当然也可以用 grep 来统计
  # netstat -n | grep TIME_WAIT | grep -E ^tcp | wc -l

  # netstat -nat |awk '{print $6}'|sort|uniq -c|sort -rn
  ```

- 监控网络连接状态

  ```sh
  while [ true ]; do sleep 1; netstat -n | awk '/tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}' >> ~/a.log; date >> ~/a.log; echo "===" >> ~/a.log; done
  ```

## `dns`

- dns 配置 `/etc/resolv.conf`

- `dns` 和 `hosts` 的区别是啥
  - `dns` 是域名服务器
  - `hosts` 是存在你的电脑本地的域名检析
  - 假设 `hosts` 文件中有对应的 `www.baidu.com` 的 ip 地址, 那么电脑就不会去 `dns` 服务器获取这个 ip 而是直接将你的域名翻译为内 ip 然后过去
  - 假设你的 `hosts` 文件中没有对应的 `www.baidu.com` 那么电脑就会先发送这个域名请求到 `dns` 服务器 ，服务器会将这个域名检析为相应的 `ip` 地址返回给你的电脑，然后电脑再通过这个 ip 地址来访问网站
  - 其中 dns 域名的检析是从 .com 这个终极域名开始 一级一级往下查询的

### dnsmasq

- 如果配置了 dns 劫持，hosts 文件也制定了 ip，那么可以直接走 hosts 了，没有拦截下来

- [dnsmasq 服务](https://www.jianshu.com/p/c54679f73a05)
  本地局域网中的主机可以直接访问 `dnsmasq`，即在这些主机中 `/etc/resolv.conf` 指向了 Dnsmasq

  ```sh
  vi /etc/resolv.conf
  nameserver 1.1.1.1 # dns服务器地址
  ```

- [dnsmasq 详解&手册](https://www.cnblogs.com/sunsky303/p/9238669.html)

- 配置文件 `/var/etc/dnsmasq.conf`， 修改配置后重新加载一下 `/etc/init.d/dnsmasq reload`

- DNS 劫持

  ```sh
  # 编辑配置文件 vi /var/etc/dnsmasq.conf

  # 进行dns劫持，访问任何域名都会被解析到10.111.222.33
  address=/#/10.111.222.33
  # 指定x.sangfor.com.cn使用114.114.114.114 dns服务器进行解析
  # 配合address选项可以做出白名单的效果，除了该域名外，其他域名全部劫持
  server=/x.sangfor.com.cn/114.114.114.114
  ```

## `ethtool`

> 用于查询及设置网卡参数的命令

- [ethtool 命令详解](https://blog.csdn.net/u011857683/article/details/83758689)

## `ifconfig`

- [输出结果详解](https://blog.csdn.net/QQ2558030393/article/details/93337186)

- 临时修改网口地址

  ```sh
  ifconfig eth0 192.168.208.130 netmask 255.255.255.0
  route add default gw 192.168.208.1
  route -n  # 查看路由表
  ```

- [修备设备 `mac` 地址](https://blog.csdn.net/qq_25147897/article/details/77863715)

  ```sh
  # 关闭网卡设备
  ifconfig eth0 down

  # 修改 MAC 地址
  ifconfig eth0 hw ether MAC 地址

  # ifconfig eth0 hw ether  1E:ED:19:27:1A:B4
  # MAC 地址相同则有可能收不到对方发的数据
  # 重启网卡
  ifconfig eth0 up
  ```

## `nload`

> 在命令行界面监控网络吞吐量，nload 应用程序是个不错的选择。它是一个实时监控网络流量和带宽使用的控制台应用程序

## traceroute

```sh

```

## 其他

- 有没有监控网络流量的工具？比如监控网卡出口、入口流量 https://blog.51cto.com/ityunwei2017/2158128
