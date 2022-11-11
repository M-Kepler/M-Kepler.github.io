- [参考资料](#参考资料)
- [`IPy`](#ipy)
  - [模块学习](#模块学习)
    - [IP](#ip)
    - [IPSet](#ipset)
  - [使用记录](#使用记录)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)

# 参考资料

- [Python 自动化-IP 地址处理模块（IPy）](https://blog.csdn.net/huanghelouzi/article/details/88411513)

- [Python 之实用的 IP 地址处理模块 IPy](https://www.cnblogs.com/cherishry/p/5916935.html)

- [IPy 模块](https://www.jianshu.com/p/16d8570b78db)

- [IPy-IPv4 和 IPv6 地址处理模块学习笔记](https://blog.csdn.net/qq_38265137/article/details/103341095)

# `IPy`

处理 IP 地址的模块, 网上资料比较少，要想玩转这个模块，这个模块代码不多，源码还是要看看的

## 模块学习

### IP

### IPSet

- 初始化

  ```py
  from IPy import IP, IPSet
  # 第一种, add的方式
  a = IP('1.1.0.0/28')
  sa = IPSet()
  sa.add(a)

  # 第二种, 传入一个列表
  sa = IPSet([IP('10.10.0.0/28')])
  ```

## 使用记录

> 模块使用过程的记录

- 判断 `ipv4` 还是 `ipv6`

  ```py
  from IPy import IP
  IP("10.0.0.0/8").version()
  ```

- 判断是公有还是私有地址

  ```py
  from IPy import IP
  IP("10.0.0.0/8").iptype()
  ```

- 掩码类型转换

  ```py
  >>> from IPy import _intToIp, _prefixlenToNetmask
  >>> mask = 20
  >>> _mask = intToIP(_prefixlenToNetmask(mask, 4), 4)
  >>> '255.255.240.0'
  ```

- 找到子网 `IP('192.168.10.80/28)` 所在的按 `26` 掩码划分的网络

  ```py
  >>> from IPy import IP
  >>> IP('192.168.10.80/28').net().make_net(26)
  >>> IP('192.168.10.64/26')
  ```

- 掩码格式转换

  ```py
  >>> from IPy import intToIp, _prefixlenToNetmask
  # 后面的两个4都是表示IPV4
  >>> intToIp(_prefixlenToNetmask(24, 4), 4)
  >>> 255.255.255.0
  ```

- 这个会自动帮去除空格  
  这是个坑，因为做格式校验的时候是可以校验通过的，这样的话如果定义的数据库字段长度为 15，就抛异常了

  ```py
  >>> from IPy import IP
  >>> a = '       1.1.1.0'
  >>> IP(a)
  >>> IP('1.1.1.0')
  ```

- 两个子网有没有可能部分重叠

  ```py
  from IPy import IP
  pool = IP('192.168.10.32/28')

  # 子网的网络地址并不一定是2的n次方，判断是否是2的n次方可以用 num & (num-1)来判断
  # 比如 3.0.0.0/8
  pool_start = pool.net()

  # 但是可以确定，子网的主机地址个数肯定是2的n次方
  host_cnt = 2**(32 - pool.prefixlen())

  # 因为子网的步长是一样的，所以不可能出现ip范围为 [0, 16] 和 [8, 24] 这样的两个子网
  # 因此可以确定子网之间如果有交集，那肯定是包含关系，比如[0, 16] 和 [0, 8]
  ```

- ip 加减

  ```py
  ip = '192.168.10.1'
  IP(IP(ip).int() + 1).strNormal()
  ```

- 网络范围转化为网段

  ```py
  >>> print(IPy.IP("192.168.1.0-192.168.1.255", make_net=True))
  >>> 192.168.1.0/24
  ```

- 各种格式

  ```py
  >>> IPy.IP("192.168.10.0/24").strNormal()
  '192.168.10.0/24'
  >>> IPy.IP("192.168.10.0/24").strNormal(0)
  '192.168.10.0'
  >>> IPy.IP("192.168.10.0/24").strNormal(1)
  '192.168.10.0/24'
  >>> IPy.IP("192.168.10.0/24").strNormal(2)
  '192.168.10.0/255.255.255.0'
  >>> IPy.IP("192.168.10.0/24").strNormal(3)
  '192.168.10.0-192.168.10.255'
  ```

- 赋值

  ```py
  from IPy import IPSet
  from IPy import IP

  new = IP('192.168.10.0/28')

  all_ips = IPSet()
  tmp = IPSet()

  all_ips.add(a)

  tmp = all_ips
  tmp.add(IP('128.96.0.0/16'))

  if  tmp - all_ips != new:
      rise DhcpCfgOverlaps()

  # IPSet方法没办法拷贝，本来是想拷贝一个副本tmp，然后比较副本和原件，看是否等于，不等则表明新增加的IP池和原有的IP池有重叠
  # 需要深拷贝
  ```

## Q & A

> 使用过程中的疑问或者坑

- 在使用 `overlaps` 之前，想一下能不能用 IPSet

## 模块亮点

> 模块设计上有哪些值的借鉴的地方
