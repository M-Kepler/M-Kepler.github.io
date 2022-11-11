- [前言](#前言)
- [1. 相关数据库知识点回顾](#1-相关数据库知识点回顾)
  - [1.1 什么是数据库事务，为什么要有事务](#11-什么是数据库事务为什么要有事务)
  - [1.2 事务包括哪几个特性？](#12-事务包括哪几个特性)
  - [1.3 事务并发存在的问题](#13-事务并发存在的问题)
    - [1.3.1 脏读](#131-脏读)
    - [1.3.2 不可重复读](#132-不可重复读)
    - [1.3.3 幻读](#133-幻读)
  - [1.4 四大隔离级别](#14-四大隔离级别)
    - [1.4.1 读未提交](#141-读未提交)
    - [1.4.2 读已提交](#142-读已提交)
    - [1.4 3 可重复读](#14-3-可重复读)
    - [1.4.4 串行化](#144-串行化)
    - [1.4.5 四大隔离级别，都会存在哪些并发问题呢](#145-四大隔离级别都会存在哪些并发问题呢)
  - [1.5 数据库是如何保证事务的隔离性的呢？](#15-数据库是如何保证事务的隔离性的呢)
- [2. 什么是 MVCC？](#2-什么是-mvcc)
- [3. MVCC 实现的关键知识点](#3-mvcc-实现的关键知识点)
  - [3.1 事务版本号](#31-事务版本号)
  - [3.2 隐式字段](#32-隐式字段)
  - [3.3 undo log](#33-undo-log)
  - [3.4 版本链](#34-版本链)
  - [3.5 快照读和当前读](#35-快照读和当前读)
  - [3.6 Read View](#36-read-view)
- [4. MVCC 实现原理分析](#4-mvcc-实现原理分析)
  - [4.1 查询一条记录，基于 MVCC，是怎样的流程](#41-查询一条记录基于-mvcc是怎样的流程)
  - [4.2 读已提交（RC）隔离级别，存在不可重复读问题的分析历程](#42-读已提交rc隔离级别存在不可重复读问题的分析历程)
  - [4.3 可重复读（RR）隔离级别，解决不可重复读问题的分析](#43-可重复读rr隔离级别解决不可重复读问题的分析)
    - [4.3.1 不同隔离级别下，Read View 的工作方式不同](#431-不同隔离级别下read-view-的工作方式不同)
    - [4.3.2 实例分析](#432-实例分析)
  - [4.4 网络江湖传说，MVCC 是否解决了幻读问题呢？](#44-网络江湖传说mvcc-是否解决了幻读问题呢)
    - [4.4.1 RR 级别下，一个快照读的例子，不存在幻读问题](#441-rr-级别下一个快照读的例子不存在幻读问题)
    - [4.4.2 RR 级别下，一个当前读的例子](#442-rr-级别下一个当前读的例子)
    - [4.4.3 这种特殊场景，似乎有幻读问题](#443-这种特殊场景似乎有幻读问题)
- [参考资料](#参考资料)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/l40astGsfghnzXSl0VeUKQ)

## 前言

MySQL MVCC 实现原理是一道非常高频的面试题，最近我一直在面试，能够清晰准确回答这个问题的人不多，今天我们一起来聊聊。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBBuWtBL6kBoQR6hoIh5JoVllUPPf1YCMyAKWmuMich5X0H3Xr0zHsRsA/640?wx_fmt=png)

## 1. 相关数据库知识点回顾

### 1.1 什么是数据库事务，为什么要有事务

事务，由一个有限的数据库操作序列构成，这些操作要么全部执行, 要么全部不执行，是一个不可分割的工作单位。

> 假如 A 转账给 B 100 元，先从 A 的账户里扣除 100 元，再在 B 的账户上加上 100 元。如果扣完 A 的 100 元后，还没来得及给 B 加上，银行系统异常了，最后导致 A 的余额减少了，B 的余额却没有增加。所以就需要事务，将 A 的钱回滚回去，就是这么简单。

**为什么要有事务呢？** 就是为了保证数据的最终一致性。

### 1.2 事务包括哪几个特性？

事务四个典型特性，即 ACID，原子性（Atomicity）、一致性（Consistency）、隔离性（Isolation）、持久性（Durability）。

- 原子性：事务作为一个整体被执行，包含在其中的对数据库的操作要么全部都执行，要么都不执行。

- 一致性：指在事务开始之前和事务结束以后，数据不会被破坏，假如 A 账户给 B 账户转 10 块钱，不管成功与否，A 和 B 的总金额是不变的。

- 隔离性：多个事务并发访问时，事务之间是相互隔离的，一个事务不应该被其他事务干扰，多个并发事务之间要相互隔离。。

- 持久性：表示事务完成提交后，该事务对数据库所作的操作更改，将持久地保存在数据库之中。

### 1.3 事务并发存在的问题

事务并发会引起**脏读、不可重复读、幻读**问题。

#### 1.3.1 脏读

> 如果一个事务读取到了另一个未提交事务修改过的数据，我们就称发生了脏读现象。

假设现在有两个事务 A、B：

- 假设现在 A 的余额是 100，事务 A 正在准备查询 Jay 的余额

- 事务 B 先扣减 Jay 的余额，扣了 10，但是还没提交

- 最后 A 读到的余额是 90，即扣减后的余额

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBoRjCl7d8eKnrRtbK8mfeDuYksadBvY7Nydicp6yrlJJQBM1RBMMfLBw/640?wx_fmt=png)脏读

因为事务 A 读取到事务 B **未提交的数据**, 这就是脏读。

#### 1.3.2 不可重复读

> 同一个事务内，前后多次读取，读取到的数据内容不一致

假设现在有两个事务 A 和 B：

- 事务 A 先查询 Jay 的余额，查到结果是 100

- 这时候事务 B 对 Jay 的账户余额进行扣减，扣去 10 后，提交事务

- 事务 A 再去查询 Jay 的账户余额发现变成了 90

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBaxI9DQRicD4EJibVyvJCR2ViaBWLU4weHYdEykPiavf1VEOLKyhKKLsFxQ/640?wx_fmt=png) 不可重复读

事务 A 被事务 B 干扰到了！在事务 A 范围内，两个相同的查询，读取同一条记录，却返回了不同的数据，这就是**不可重复读**。

#### 1.3.3 幻读

> 如果一个事务先根据某些搜索条件查询出一些记录，在该事务未提交时，另一个事务写入了一些符合那些搜索条件的记录（如 insert、delete、update），就意味着发生了**幻读**。

假设现在有两个事务 A、B：

- 事务 A 先查询 id 大于 2 的账户记录，得到记录 id=2 和 id=3 的两条记录

- 这时候，事务 B 开启，插入一条 id=4 的记录，并且提交了

- 事务 A 再去执行相同的查询，却得到了 id=2,3,4 的 3 条记录了。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBGTQicHibriaCofS4yUia0FUsOPjichI1PzMMMiaTQFdqbgNiaHpBdicxNmugJA/640?wx_fmt=png)幻读

事务 A 查询一个范围的结果集，另一个并发事务 B 往这个范围中插入新的数据，并提交事务，然后事务 A 再次查询相同的范围，两次读取到的结果集却不一样了，这就是幻读。

### 1.4 四大隔离级别

为了解决并发事务存在的**脏读、不可重复读、幻读**等问题，数据库大叔设计了四种隔离级别。分别是**读未提交，读已提交，可重复读，串行化（Serializable）**。

#### 1.4.1 读未提交

读未提交隔离级别，只限制了两个数据**不能同时修改**，但是修改数据的时候，即使事务**未提交**，都是可以被别的事务读取到的，这级别的事务隔离有**脏读、重复读、幻读**的问题；

#### 1.4.2 读已提交

读已提交隔离级别，当前事务只能读取到其他事务**提交**的数据，所以这种事务的隔离级别**解决了脏读**问题，但还是会存在**重复读、幻读**问题；

#### 1.4 3 可重复读

可重复读隔离级别，限制了读取数据的时候，不可以进行修改，所以**解决了重复读**的问题，但是读取范围数据的时候，是可以插入数据，所以还会存在**幻读**问题；

#### 1.4.4 串行化

事务最高的隔离级别，在该级别下，所有事务都是进行**串行化顺序**执行的。可以避免脏读、不可重复读与幻读所有并发问题。但是这种事务隔离级别下，事务执行很耗性能。

#### 1.4.5 四大隔离级别，都会存在哪些并发问题呢

<table><thead><tr><th>隔离级别</th><th>脏读</th><th>不可重复读</th><th>幻读</th></tr></thead><tbody><tr><td>读未提交</td><td>√</td><td>√</td><td>√</td></tr><tr><td>读已提交</td><td>×</td><td>√</td><td>√</td></tr><tr><td>可重复读</td><td>×</td><td>×</td><td>√</td></tr><tr><td>串行化</td><td>×</td><td>×</td><td>×</td></tr></tbody></table>

### 1.5 数据库是如何保证事务的隔离性的呢？

数据库是通过**加锁**，来实现事务的隔离性的。这就好像，如果你想一个人静静，不被别人打扰，你就可以在房门上加上一把锁。

加锁确实好使，可以保证隔离性。比如**串行化隔离级别就是加锁实现的**。但是频繁的加锁，导致读数据时，没办法修改，修改数据时，没办法读取，大大**降低了数据库性能**。

**那么，如何解决加锁后的性能问题的？**

答案就是,**MVCC 多版本并发控制**！它实现读取数据不用加锁，可以让读取数据同时修改。修改数据时同时可读取。

## 2. 什么是 MVCC？

MVCC，即 **Multi-Version  Concurrency Control （多版本并发控制）**。它是一种并发控制的方法，一般在数据库管理系统中，实现对数据库的并发访问，在编程语言中实现事务内存。

> 通俗的讲，数据库中同时存在多个版本的数据，并不是整个数据库的多个版本，而是某一条记录的多个版本同时存在，在某个事务对其进行操作的时候，需要查看这一条记录的隐藏列事务版本 id，比对事务 id 并根据事物隔离级别去判断读取哪个版本的数据。

数据库隔离级别读**已提交、可重复读** 都是基于 MVCC 实现的，相对于加锁简单粗暴的方式，它用更好的方式去处理读写冲突，能有效提高数据库并发性能。

## 3. MVCC 实现的关键知识点

### 3.1 事务版本号

> 事务每次开启前，都会从数据库获得一个**自增长**的事务 ID，可以从事务 ID 判断事务的执行先后顺序。这就是事务版本号。

### 3.2 隐式字段

对于 InnoDB 存储引擎，每一行记录都有两个隐藏列 **trx_id**、**roll_pointer**，如果表中没有主键和非 NULL 唯一键时，则还会有第三个隐藏的主键列 **row_id**。

<table><thead><tr><th>列名</th><th>是否必须</th><th>描述</th></tr></thead><tbody><tr><td>row_id</td><td>否</td><td>单调递增的行 ID，不是必需的，占用 6 个字节。</td></tr><tr><td>trx_id</td><td>是</td><td>记录操作该数据事务的事务 ID</td></tr><tr><td>roll_pointer</td><td>是</td><td>这个隐藏列就相当于一个指针，指向回滚段的 undo 日志</td></tr></tbody></table>

### 3.3 undo log

undo log，**回滚日志**，用于记录数据被修改前的信息。在表记录修改之前，会先把数据拷贝到 undo log 里，如果事务回滚，即可以通过 undo log 来还原数据。

![alt](https://mmbiz.qpic.cn/mmbiz_gif/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxB7QCNKsd8asKib4R9CM0uXjuPia7xrYlpZ3VvibGRUGGxQAJLWvLIibQBjQ/640?wx_fmt=gif)

可以这样认为，当 delete 一条记录时，undo log 中会记录一条对应的 insert 记录，当 update 一条记录时，它记录一条对应相反的 update 记录。

undo log 有什么**用途**呢？

1. 事务回滚时，保证原子性和一致性。

2. 用于 MVCC **快照读**。

### 3.4 版本链

多个事务并行操作某一行数据时，不同事务对该行数据的修改会产生多个版本，然后通过回滚指针（roll_pointer），连成一个链表，这个链表就称为**版本链**。如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBeia1anA1L8sJpk264dotFJXROnATaExLajtqzDeCrSJle6CH830rkAg/640?wx_fmt=png)

其实，通过版本链，我们就可以看出**事务版本号、表格隐藏的列和 undo log** 它们之间的关系。我们再来小分析一下。

- 假设现在有一张 core_user 表，表里面有一条数据, id 为 1，名字为孙权：

  ![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBvIC5uBpI0uPPK6BSRfibOa8VHibFrsA3yvSM5pjswlibLhKHfuc1coIBQ/640?wx_fmt=png)

- 现在开启一个事务 A：对 core_user 表执行`update core_user set name ="曹操" where id=1`, 会进行如下流程操作

- 首先获得一个事务 ID： trx_id = 100

- 把 core_user 表修改前的数据, 拷贝到 undo log

- 修改 core_user 表中，id=1 的数据，名字改为曹操

- 把修改后的数据事务 trx_id = 101 改成当前事务版本号，并把 **roll_pointer** 指向 undo log 数据地址。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBCPAjUqqkQcCIZd320aDhqEP8hTbr8iaxpOMibomyd04FzWiagvLYGUBicg/640?wx_fmt=png)

### 3.5 快照读和当前读

**快照读：** 读取的是记录数据的可见版本（有旧的版本）。不加锁, 普通的 select 语句都是快照读, 如：

```sql
select * from core_user where id > 2;

```

**当前读**：读取的是记录数据的最新版本，显式加锁的都是当前读

```sql
select * from core_user where id > 2 for update;
select * from account where id > 2 lock in share mode;

```

### 3.6 Read View

- **Read View 是什么呢？** 它就是事务执行 SQL 语句时，产生的读视图。实际上在 innodb 中，每个 SQL 语句执行前都会得到一个 Read View。

- **Read View 有什么用呢？** 它主要是用来做可见性判断的，即判断当前事务可见哪个版本的数据~

Read View 是如何保证可见性判断的呢？我们先看看 Read view 的几个重要属性

- m_ids: 当前系统中那些活跃 (未提交) 的读写事务 ID, 它数据结构为一个 List。

- min_limit_id: 表示在生成 Read View 时，当前系统中活跃的读写事务中最小的事务 id，即 m_ids 中的最小值。

- max_limit_id: 表示生成 Read View 时，系统中应该分配给下一个事务的 id 值。

- creator_trx_id: 创建当前 Read View 的事务 ID

**Read view 匹配条件规则**如下：

1. 如果数据事务 ID `trx_id < min_limit_id`，表明生成该版本的事务在生成 Read View 前，已经提交 (因为事务 ID 是递增的)，所以该版本可以被当前事务访问。

2. 如果`trx_id>= max_limit_id`，表明生成该版本的事务在生成 ReadView 后才生成，所以该版本不可以被当前事务访问。

3. 如果 `min_limit_id =<trx_id< max_limit_id`, 需腰分 3 种情况讨论

> - （1）. 如果`m_ids`包含`trx_id`, 则代表 Read View 生成时刻，这个事务还未提交，但是如果数据的`trx_id`等于`creator_trx_id`的话，表明数据是自己生成的，因此是**可见**的。
>
> - （2）如果`m_ids`包含`trx_id`，并且`trx_id`不等于`creator_trx_id`，则 Read   View 生成时，事务未提交，并且不是自己生产的，所以当前事务也是**看不见**的；
>
> - （3）. 如果`m_ids`不包含`trx_id`，则说明你这个事务在 Read View 生成之前就已经提交了，修改的结果，当前事务是能看见的。

## 4. MVCC 实现原理分析

### 4.1 查询一条记录，基于 MVCC，是怎样的流程

1. 获取事务自己的版本号，即事务 ID

2. 获取 Read View

3. 查询得到的数据，然后 Read View 中的事务版本号进行比较。

4. 如果不符合 Read View 的可见性规则， 即就需要 Undo log 中历史快照;

5. 最后返回符合规则的数据

InnoDB 实现 MVCC，是通过`Read View+ Undo Log` 实现的，Undo Log 保存了历史快照，Read View 可见性规则帮助判断当前版本的数据是否可见。

### 4.2 读已提交（RC）隔离级别，存在不可重复读问题的分析历程

- 创建 core_user 表，插入一条初始化数据, 如下：

  ![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBbofuhWPa5tCzfejtFIb7Pl0kq08Nvsuemexdhva6iaq0icd9RqpDkWYw/640?wx_fmt=png)

- 隔离级别设置为读已提交（RC），事务 A 和事务 B 同时对 core_user 表进行查询和修改操作。

  ```sql
  事务A: select * fom core_user where id = 1
  事务B: update core_user set name = "曹操"
  ```

执行流程如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBwzxFHXYmX62jtOpAMDvLgibYK8jsICRxzj9QsaYjooV6xpQe04mJiceQ/640?wx_fmt=png)

最后事务 A 查询到的结果是，**name = 曹操**的记录，我们**基于 MVCC**，来分析一下执行流程：

(1). A 开启事务，首先得到一个事务 ID 为 100

(2).B 开启事务，得到事务 ID 为 101

(3). 事务 A 生成一个 Read View，read view 对应的值如下

| 变量           | 值       |
| -------------- | -------- |
| m_ids          | 100, 101 |
| max_limit_id   | 102      |
| min_limit_id   | 100      |
| creator_trx_id | 100      |

然后回到版本链：开始从版本链中挑选可见的记录：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBl5kT4uBTAlQiacPmeXPWQ5wAo0Ja7kAmgxELtFOA5UCbdmNFw49cvibQ/640?wx_fmt=png)版本链

由图可以看出，最新版本的列 name 的内容是`孙权`，该版本的`trx_id`值为 100。开始执行 read view 可见性规则校验：

```sql
min_limit_id(100) =< trx_id（100）< 102;
creator_trx_id = trx_id = 100;

```

由此可得，trx_id=100 的这个记录，当前事务是可见的。所以查到是 name 为`孙权`的记录。

（4). 事务 B 进行修改操作，把名字改为曹操。把原数据拷贝到 undo log, 然后对数据进行修改，标记事务 ID 和上一个数据版本在 undo log 的地址。

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBCPAjUqqkQcCIZd320aDhqEP8hTbr8iaxpOMibomyd04FzWiagvLYGUBicg/640?wx_fmt=png)

(5) 提交事务

(6) 事务 A 再次执行查询操作，**新生成一个 Read View**，Read View 对应的值如下

| 变量           | 值  |
| -------------- | --- |
| m_ids          | 100 |
| max_limit_id   | 102 |
| min_limit_id   | 100 |
| creator_trx_id | 100 |

然后再次回到版本链：从版本链中挑选可见的记录：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBCPAjUqqkQcCIZd320aDhqEP8hTbr8iaxpOMibomyd04FzWiagvLYGUBicg/640?wx_fmt=png)

从图可得，最新版本的列 name 的内容是`曹操`，该版本的`trx_id`值为 101。开始执行 Read View 可见性规则校验：

```sql
min_limit_id(100) =< trx_id(101) < max_limit_id(102);
但是,trx_id=101，不属于m_ids集合

```

因此，`trx_id=101`这个记录，对于当前事务是可见的。所以 SQL 查询到的是 name 为`曹操`的记录。

综上所述，在**读已提交（RC）隔离级别**下，同一个事务里，两个相同的查询，读取同一条记录（id=1），却返回了不同的数据（**第一次查出来是孙权，第二次查出来是曹操那条记录**），因此 RC 隔离级别，存在**不可重复读**并发问题。

### 4.3 可重复读（RR）隔离级别，解决不可重复读问题的分析

在 RR 隔离级别下，是如何解决不可重复读问题的呢？我们一起再来看下，

还是 4.2 小节那个流程，还是这个事务 A 和事务 B，如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBJlHnrlYXfesV0jFcvYIibnqR3uLlqLmZJduPp2o14OPeuSArazKR2zA/640?wx_fmt=png)

#### 4.3.1 不同隔离级别下，Read View 的工作方式不同

实际上，各种事务隔离级别下的 Read view 工作方式，是不一样的，RR 可以解决不可重复读问题，就是跟 **Read view 工作方式有关**。

- 在读已提交（RC）隔离级别下，同一个事务里面，**每一次查询都会产生一个新的 Read View 副本**，这样就可能造成同一个事务里前后读取数据可能不一致的问题（不可重复读并发问题）。

  | begin                                  |                    |
  | -------------------------------------- | ------------------ |
  | `select * from core_user where id = 1` | 生成一个 Read View |
  | /                                      | /                  |
  | /                                      | /                  |
  | `select * from core_user where id = 1` | 生成一个 Read View |

- 在可重复读（RR）隔离级别下，**一个事务里只会获取一次 read view**，都是副本共用的，从而保证每次查询的数据都是一样的。

  | begin                                  |                         |
  | -------------------------------------- | ----------------------- |
  | `select * from core_user where id = 1` | 生成一个 Read View      |
  | /                                      |                         |
  | /                                      |                         |
  | `select * from core_user where id = 1` | 公用一个 Read View 副本 |

#### 4.3.2 实例分析

我们穿越下，回到**刚 4.2 的例子**，然后执行第 2 个查询的时候：

事务 A 再次执行查询操作，复用老的 Read View 副本，Read View 对应的值如下

| 变量           | 值       |
| -------------- | -------- |
| m_ids          | 100, 101 |
| max_limit_id   | 102      |
| min_limit_id   | 100      |
| creator_trx_id | 100      |

然后再次回到版本链：从版本链中挑选可见的记录：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBCPAjUqqkQcCIZd320aDhqEP8hTbr8iaxpOMibomyd04FzWiagvLYGUBicg/640?wx_fmt=png)

从图可得，最新版本的列 name 的内容是`曹操`，该版本的`trx_id`值为 101。开始执行 read view 可见性规则校验：

```sql
min_limit_id(100) =< trx_id(101) < max_limit_id(102);
因为m_ids{100,101}包含trx_id(101)，
并且creator_trx_id (100) 不等于trx_id（101）

```

所以，`trx_id=101`这个记录，对于当前事务是**不可见**的。这时候呢，版本链`roll_pointer`跳到下一个版本，`trx_id=100`这个记录，再次校验是否可见：

```sql
min_limit_id(100) =< trx_id(100) < max_limit_id(102);
因为m_ids{100,101}包含trx_id(100)，
并且creator_trx_id (100) 等于trx_id（100）


```

所以，`trx_id=100`这个记录，对于当前事务是**可见**的，所以两次查询结果，都是 **name = 孙权**的那个记录。即在可重复读（RR）隔离级别下，复用老的 Read View 副本，解决了**不可重复读**的问题。

### 4.4 网络江湖传说，MVCC 是否解决了幻读问题呢？

网络江湖有个传说，说 MVCC 的 RR 隔离级别，解决了幻读问题，我们来一起分析一下。

#### 4.4.1 RR 级别下，一个快照读的例子，不存在幻读问题

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxBibv0iaYRwwml3xW8Mib7ZRSCzicAaibx6iaerGDnPvOjOy49vJuUPr6ow47w/640?wx_fmt=png)

由图可得，步骤 2 和步骤 6 查询结果集没有变化，**看起来 RR 级别是已经解决幻读问题啦**~

#### 4.4.2 RR 级别下，一个当前读的例子

假设现在有个`account表`，表中有 4 条数据，RR 级别。

- 开启事务 A，执行**当前读**，查询 id>2 的所有记录。

- 再开启事务 B，插入 id=5 的一条数据。

流程如下：

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxB90AhKdDUn12K9SEajicD8H4DloDYjHesLdkyRoXDZHvg0UiaVe57gO3g/640?wx_fmt=png)

显然，事务 B 执行插入操作时，阻塞了~ 因为事务 A 在执行`select ... lock in share mode`（当前读）的时候，不仅在 id = 3,4 这 2 条记录上加了锁，而且在`id > 2`这个范围上也加了**间隙锁**。

因此，我们可以发现，RR 隔离级别下，加锁的 select, update, delete 等语句，会使用间隙锁 + 临键锁，锁住索引记录之间的范围，避免范围间插入记录，以**避免产生幻影行记录**，那就是说 RR 隔离级别解决了幻读问题？

#### 4.4.3 这种特殊场景，似乎有幻读问题

![alt](https://mmbiz.qpic.cn/mmbiz_png/PoF8jo1PmpzkkRHibH0jLK3GSCicOrOdxB7yibXicxmPjLU7TjiaE59xT72iaxJvY15MNFuJNJV4gOIW5aB1jH5Cticng/640?wx_fmt=png)

其实，上图事务 A 中，多加了`update account set balance=200 where id=5;`这步操作，同一个事务，相同的 sql，查出的结果集不同了，这个结果，就符合了幻读的定义~

这个问题，亲爱的朋友，你觉得它算幻读问题吗，所以 RR 隔离级别，还是存在幻读问题吧？欢迎大家评论区留言哈。

## 参考资料

数据库基础（四）Innodb MVCC 实现原理: https://zhuanlan.zhihu.com/p/52977862
