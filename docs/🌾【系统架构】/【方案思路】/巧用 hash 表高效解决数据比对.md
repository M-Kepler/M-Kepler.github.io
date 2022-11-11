- [什么是哈希表](#什么是哈希表)
- [哈希函数的可靠性](#哈希函数的可靠性)
- [解决冲突的几种办法](#解决冲突的几种办法)
  - [开放寻址法](#开放寻址法)
  - [再散列法](#再散列法)
  - [链式存储法 (坊间称之为拉链法)](#链式存储法-坊间称之为拉链法)
- [准备工作](#准备工作)
- [接下来展示我们的代码](#接下来展示我们的代码)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s?__biz=MzI4NDMyNzA4NQ==&idx=1&mid=2247483816&sn=9c60561b82c016ed8be741260bc5b157)

一直以来都想在数据结构与算法这个领域写点东西，后来发现太基础的东西很容易懂，也没什么可写的；太难的东西我又不会；觉得一般的东西，总结起来居然感觉很吃力；理解太浅，写不出好东西来。一拖再拖，真让人伤神。直到今年项目吃紧，啥都做，渐渐的觉得是时候了。

自打跳槽季以来，10 个人的开发团队走了一半，就独得公司恩宠，领导偏偏宠我一人。于是我就劝领导，要雨露均沾，任务这么重，能不能给招几个人一起做啊，可领导非是不听呐，就让我做。。。

由于这样的机会，让我深入的理解了哈希表的应用以及各种哈希算法。

## 什么是哈希表

哈希表也叫散列表。哈希表的基本思想为：将需要存储的记录 K 作为自变量，通过一种函数 H(K) 计算出一个整型的函数值。把这个值映射为一个可连续存储的存储空间的下标，就像普通数组那样。最后将要存储的数据放到下标对应的存储空间。我们称函数 H 为哈希函数或者散列函数，按照以上方法建立的存储空间，我们称之为哈希表或者散列表。

## 哈希函数的可靠性

上面我们已经了解到哈希表的构建，接下来我们聊一下上面说到的哈希函数 H。理想的情况下，经过哈希函数的映射，我们要存储的数据和映射的结果是一一对应的，但是这也仅限于理想情况下了。在实际开发中，我们常常会发现不同的记录经过哈希函数的加工得到了相同的结果，这是正常的。所以选择一个适合自己需求的哈希函数特别重要，但是，再好的哈希函数，也有可能出现输出下标值冲突的问题。

## 解决冲突的几种办法

### 开放寻址法

这种方法适用于存储数据不是特别多的情况

寻址计算式：`Hi = (H(K) + di)  MOD  m, I =1,2…m-1`，其中 H 为散列函数，di 为增量序列，当发现存储下标冲突时改变此值，重新计算后找到数据最佳存放位置。

- 如果 di 按照 `di= 1,2,3,…,m-1` 的方式递增，我们将此方法称为线性探测再散列；

- 如果 di 按照 `di=1^2, (-1)^2, 2^2,(-2)^2,(3)^2, …, ±(k)^2,(k<=m/2)` 的方式递增，我们称其为二次探测再散列。二次指的当然是二次方的意思。

- 如果 di 的取值为某个随机数，我们称之为随机探测再散列。

### 再散列法

简单的说，就是当我们的哈希函数发生冲突时，接着用另外一个哈希函数计算，不行再换，直到没有冲突为止。

计算式为：Hi=RHi(key),i=1,2,…,k. RHi 均是不同的散列函数

这种办法不易产生数据聚集，但是增加了计算时间。

### 链式存储法 (坊间称之为拉链法)

想象一下，我是民间的爱狗人士，天天收留流浪狗与刀下狗。家摆了好多笼子，来一只我就按照某种方法，计算一下往哪个笼子里放。笼子里如果有狗，我就重新计算一下再给它找个笼子。刚开始，大家相安无事，我很享受，多么伟大的爱狗精神。慢慢的狗越来越多了，发现怎么算笼子里边都有狗，这可咋整。后来无奈之下，想出了一个绝妙的办法。我再笼子后面拴根绳子，经过计算后发现如果狗是当前笼子的，栓到后面就行了。同一个笼子再来一个，就再往后栓。栓哪儿？ 为了能形象的阐述我们拉链存储法的精髓，我决定栓前一只狗的尾巴上 (爱狗人士别骂我)。这样不管来多少狗，我都不怕了。

上例中，家里摆放的诸多笼子，就构成了一个哈希表。计算往哪个笼子里放狗的方法，代表了一种哈希算法。笼子不够用时后面拴绳子的办法，就是我们将要讲述的拉链算法的雏形。

简单的说，就是将所有的关键字为同义词的记录存储在同一个线性链表中；简历一个公共溢出区。这就是拉链算法的核心思想。

## 准备工作

了解到这里，我们就可以做点事情了。我提个需求，假如你们公司是做灾备软件的，备份完数据后怎么高效的比对出同备两端数据究竟一不一致呢？

或许你想到了 Linux 自带的文本比对命令 diff， 当备份数据为文本时，这是可行的。

简单实在速度快。但是该命令是逐行比对的， 如果我们的需求中允许有不一致的空白行；如果备份的数据是从数据库中读出来的，两边的数据库查询出数据的组织顺序可能是不一样的。这些情况下我们的 diff 岂不是没用了？ Yes it is。就算是可以满足需求，效率呢？ 自己算算逐行比对的时间复杂度吧。这时，笔者想到了一个更好的办法，既能实现需求，而且可以高效的完成任务。

我们的主角哈希表来了。

- 差不多可以上代码了，首先我们创建存放数据的哈希表。

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxq67eG3DMw1wvicyWFyJPlTeCqTjK6bnsA1Yspmuhqbp8bhBEsV0jEOlg/0?wx_fmt=png)

- 里边包含了一个元素结构体，元素的个数，以及表容量。接着看一下元素结构体中包含哪些内容

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqxDkibnD03UGrBPo6mIgLAqdibFATZKfuqlktH75A7TZwibqcXvskHyhfw/0?wx_fmt=png)

- 元素结构体中包含了需要存储的内容 ord，ord 对应的 md5 校验值 key,  数据来源标识 flag(1 表示源端数据库，2 表示目标端数据库)，以及当冲突发生时用于摆平冲突的那个链表 SamePos(以上拉链算法的实际运用)。

- 创建好链表后，接下来我们进行初始化操作。

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqM4sMf8PYe6s3MULa8SDlljeCIhzN0HyiasSgf8jncGMlGqDPO5tbkIg/0?wx_fmt=png)

- 然后介绍一下我们选用的哈希函数 RSHash，该函数因 Robert Sedgwicks 在其《Algorithms in C》一书中展示一战成名，让我深深的爱上了它。

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxq0pmxsiaOmRt3A8Mq9WS20NhWGEvGDoQDp2DRE6GZyQL6eAEX8PtvDibg/0?wx_fmt=png)

这个函数不难理解，自己拿着测试一下就知道它的运行原理了。一切具备之后，我们理理我们的思路。

要想比对两个数据库表的数据是否一致，只要将两个表的数据或者关键数据（取主键足以) 拿出来，插入我们的哈希表中。现在有两个方案可供选择

- 将数据插入哈希表后，再执行一轮排重遍历，之后只要哈希表里还残留数据，说明两张表的数据有出入

- 将数据插入哈希表的之前进行一次查询操作，如果插入位置已经有数据了，且恰好不是本端的数据，ok，直接删掉原有的数据，分析下一条结果就行了。这样，最后两端的数据插入完后，哈希表为空，说明比对结果正常。

## 接下来展示我们的代码

- 首先在插入前查一下该位置有没有数据

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqzUajpiaQXIBvKDjlmxE2ke5BM9pCkagOebzCDR4dUrR5et17cPaNk5w/0?wx_fmt=png)

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqXPu4RY0lvu39kunm0fzfFoyTr6uHzyibml6znjIQ7Qrs682EtbxQaQQ/0?wx_fmt=png)

- 没有数据，好滴，直接插入

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqGibZPLqD2zI4Ct2QZSzoXWChrDsCkIXBiaiafZt2QibtTQSdluWnKeibydA/0?wx_fmt=png)

- 有数据，干掉

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqdX1YWo9ZI7VJpblOicUKVwZRntdbNYuaRJfb4D2TLqeznqwlrjv2N2w/0?wx_fmt=png)

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqXtfiaj1ncC8UaK03vljCSkSSqdIIfPYm9MKXOhawf3qdy0JPjKF0yww/0?wx_fmt=png)

- 最后送上一个哈希表打印函数，在整个过程中都会用到

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqXId5X25GNkpRIvq0K6bHHxBmMzFS7XTgXXDvk1vzFLIYvSc4pcibblA/0?wx_fmt=png)

- 对了，还有哈希表底下的链表也得打印

  ![alt](http://mmbiz.qpic.cn/mmbiz/mqO4iahyatRgv0EApHc4NMibestG5lFBxqMMhfwGFlUFFwYiaicos6VDoibibUl7zSMz5UmwfpLx6wMsXID7365yrc1Q/0?wx_fmt=png)

至此，整个比对工具开发完成。有兴趣的朋友可以私聊我要源码，明天开始总结新的内容，侧重于基础，有准备入门 iOS 的朋友可以跟着看看。
