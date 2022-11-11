- [1. 慎重选择 STL 容器类型](#1-慎重选择-stl-容器类型)
- [2. 不要试图编写独立于容器类型的代码](#2-不要试图编写独立于容器类型的代码)
- [3. 确保容器中的对象拷贝正确而高效](#3-确保容器中的对象拷贝正确而高效)
- [4. 调用 empty 而不是检查 size() 是否为 0](#4-调用-empty-而不是检查-size-是否为-0)
- [5. 区间成员函数优先于与之对应的单元素成员函数](#5-区间成员函数优先于与之对应的单元素成员函数)
- [6. 如果容器中包含了通过 new 操作创建的指针，切记在容器对象析构前将指针 delete 掉](#6-如果容器中包含了通过-new-操作创建的指针切记在容器对象析构前将指针-delete-掉)
- [7. 慎重选择删除元素的方法](#7-慎重选择删除元素的方法)
- [8. 切勿对 STL 容器的线程安全性有不切实际的依赖](#8-切勿对-stl-容器的线程安全性有不切实际的依赖)
- [9. vector 等容器考虑使用 reserve 来避免不必要的重新分配](#9-vector-等容器考虑使用-reserve-来避免不必要的重新分配)
- [10. 使用 swap 技巧除去多余的容量](#10-使用-swap-技巧除去多余的容量)
- [11. 避免使用 vector 存储 bool](#11-避免使用-vector-存储-bool)
- [12. 理解相等和等价的区别](#12-理解相等和等价的区别)
- [13. 为包含指针的关联容器指定比较类型](#13-为包含指针的关联容器指定比较类型)
- [14. 总是让比较函数在等值情况下返回 false](#14-总是让比较函数在等值情况下返回-false)
- [15. 切勿直接修改 set 或 multiset 中的键](#15-切勿直接修改-set-或-multiset-中的键)
- [16. 考虑用排序的 vector 替代关联容器](#16-考虑用排序的-vector-替代关联容器)
- [17. 当效率至关重要时，请在 map::operator[] 与 map::insert 之间谨慎做出选择](#17-当效率至关重要时请在-mapoperator-与-mapinsert-之间谨慎做出选择)
- [18.iterator 优先于 const_iterator、reverse_iterator、const_reverse_iterator](#18iterator-优先于-const_iteratorreverse_iteratorconst_reverse_iterator)
- [19. 使用 distance 和 advance 将容器的 const_iterator 转换成 iterator](#19-使用-distance-和-advance-将容器的-const_iterator-转换成-iterator)
- [20. 对于逐个字符的输入, 请考虑使用 istreambuf_iterator](#20-对于逐个字符的输入-请考虑使用-istreambuf_iterator)
- [21. 容器的插入, 要确保目标空间足够大](#21-容器的插入-要确保目标空间足够大)
- [22. 了解各种与排序有关的选择](#22-了解各种与排序有关的选择)
- [23. 如果确实需要删除元素，则需要在 remove 这一类算法之后调用 erase](#23-如果确实需要删除元素则需要在-remove-这一类算法之后调用-erase)
- [24. 了解哪些算法使用排序的区间作为参数](#24-了解哪些算法使用排序的区间作为参数)
- [25.  通过 mismatch 或 lexicographical_compare 实现简单的忽略大小写的字符串比较](#25-通过-mismatch-或-lexicographical_compare-实现简单的忽略大小写的字符串比较)
- [26. 使用 accumulate 或者 for_each 进行区间统计](#26-使用-accumulate-或者-for_each-进行区间统计)
- [27. 算法调用优先于手写的循环](#27-算法调用优先于手写的循环)
- [28. 容器的成员函数优先于同名的算法](#28-容器的成员函数优先于同名的算法)
- [29. 正确区分 count、find、binary_search、lower_bound、upper_bound、equal_range](#29-正确区分-countfindbinary_searchlower_boundupper_boundequal_range)
- [30. 考虑使用函数对象而不是函数作为 STL 算法的参数](#30-考虑使用函数对象而不是函数作为-stl-算法的参数)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/zGenVqpJ2L7jV7C-8ObYXQ)

最近看了一本书《Effective STL》，这本书内容比较老，但里面很多内容还是值得我们学习的。书里一共有 50 条有效使用 STL 的经验，这里整理出了 30 条自认为有用的条目分享给大家，希望对大家有所帮助，想了解具体内容的的朋友可以直接去看书哈。

## 1. 慎重选择 STL 容器类型

a) 确保自己了解每个容器的使用场景，特定的场景选择合适的容器类型

b) 连续内存，支持下标访问，可考虑选择 vector

c) 频繁的在中间做插入或者删除操作，可考虑选择 list

d) 两者都有，可考虑使用 deque

## 2. 不要试图编写独立于容器类型的代码

a) 不同容器有不同的成员函数，想独立于容器类型，只能取它们的交集

b) 然而，取交集意义不大

## 3. 确保容器中的对象拷贝正确而高效

a) 大家应该都知道，容器中存放的都是对象的拷贝，想要拷贝正确那就实现拷贝构造函数和拷贝赋值运算符

b) 想要更高效，可以使容器包含指针而不是对象，也可考虑智能指针

## 4. 调用 empty 而不是检查 size() 是否为 0

a)empty 对所有的标准容器都是常数时间操作，而对一些 list 实现，size 耗费线性时间

## 5. 区间成员函数优先于与之对应的单元素成员函数

a) 写起来更方便，代码更少

b) 更能清晰的表达意图

c) 有些情况下可能更高效

## 6. 如果容器中包含了通过 new 操作创建的指针，切记在容器对象析构前将指针 delete 掉

a) 其实就是为了避免资源泄漏

b) 可以考虑在容器中存储 shared_ptr

## 7. 慎重选择删除元素的方法

**a) 要删除容器中有特定值的所有对象**

i. 如果容器是 vector、string 或 deque，则使用 erase-remove 习惯用法

ii. 如果容器是 list，则使用 list::remove

iii. 如果容器是一个标准关联容器，则使用它的 erase 成员函数

**b) 要删除容器中满足特定条件的所有对象**

i. 如果容器是 vector、string 或 deque，则使用 erase-remove_if 习惯用法

ii. 如果容器是 list，则使用 list::remove_if

iii. 如果容器是一个标准关联容器，则使用 remove_copy_if 和 swap，或者写一个循环来遍历容器中的元素，记住当把迭代器传给 erase 时，要对它进行后缀递增

**c) 要在循环内部做某些操作**

i. 如果容器是一个标准序列容器，则写一个循环来遍历容器中的元素，记住每次调用 erase 时，要用它的返回值更新迭代器

ii. 如果容器是一个标准关联容器，则写一个循环来遍历容器中的元素，记住当把迭代器传给 erase 时，要对迭代器做后缀递增。

**d) 返回值更新迭代器示例**

```cpp
for (auto i = c.begin(); i != c.end();) {  
    if (xxx) {   
        i = c.erase(i);
    }  
    else ++i;
}

```

**e) 迭代器后缀递增示例**

```cpp
for (auto i = c.begin(); i != c.end();) {
    if (xxx) {
        c.erase(i++);
    }
    else ++i;
}

```

**f)（!!!）现在可以统一使用返回值更新迭代器方式**

## 8. 切勿对 STL 容器的线程安全性有不切实际的依赖

a) 书中原话是：当涉及 STL 容器和线程安全性时，你可以指望一个 STL 库允许多个线程同时读一个容器，以及多个线程对不同的容器做写入操作。你不能指望 STL 库会把你从手工同步控制中解脱出来，而且你不能依赖于任何线程支持。

b) 原文磨磨唧唧的，我就可以理解为 STL 不支持线程安全，想要线程安全，那自己加锁就完事儿了。

## 9. vector 等容器考虑使用 reserve 来避免不必要的重新分配

**a) 这种动态扩容的容器每次扩容都会大体经历 4 步：**

i. 分配一块大小为当前容量的某个倍数的新内存。大多数实现中，vector 和 string 的容器每次以 2 的倍数增长

ii. 把容器的所有元素从旧的内存移动或者拷贝到新的内存中

iii. 如果有拷贝，析构掉旧内存中的对象

iv. 如果有拷贝，释放旧内存

**b) 明确 size()、capacity()、resize()、reserve() 四个成员函数的具体含义**

**c)reserve 能使重新分配的次数减少到最低限度，避免重新分配和迭代器失效带来的开销，两种方式：**

i. 若能明确知道或预计容器最终有多少元素，可使用 reverse，预留适当大小的空间

ii. 先预留足够大的空间，然后，当把所有数据都加入以后，再去除多余的空间。

## 10. 使用 swap 技巧除去多余的容量

**a) vector().swap(a)**

**b) a.clear()**

**c) 以上两种都是清空容器的方法，swap 相对于 clear 一般更合适一些**

## 11. 避免使用 vector 存储 bool

**a) 有两点：**

i. 它不是一个 STL 容器，不能取元素的地址

ii. 它不存储 bool

**b) 可以用 deque** **和 bitset 来替代**

## 12. 理解相等和等价的区别

**a) 相等的概念基于 operator==，即 a==b，则为相等**

**b) 如果!(a < b) && !(b < a)，则为等价**

## 13. 为包含指针的关联容器指定比较类型

**a) 容器里面存储的都是指针，但是由于是关联容器，需要进行比较，但默认的比较（比较指针）一般不是我们想要的行为**

**b) 所以需要指定比较类型，自定义比较行为**

## 14. 总是让比较函数在等值情况下返回 false

**a) 直接看这个文章吧【线上问题】P1 级公司故障，年终奖不保，很不错**

## 15. 切勿直接修改 set 或 multiset 中的键

**a) 如果改变了键，那么可能破坏该容器（顺序），再使用该容器可能导致不确定的结果**

**b) 为什么标题是切勿修改 set，而不是切勿修改 map 中的键呢？**

i. 因为 map 中的键是 const K，本来就不允许修改

## 16. 考虑用排序的 vector 替代关联容器

a) 在排序的 vector 中存储数据可能比在标准关联容器中存储同样的数据要耗费更少的内存。

b) 由于 Page Fault，通过二分搜索来查找一个排序的 vector 可能比查找一个标准关联容器要更快一些

c) 对于排序的 vector，最不利的地方在于它必须保持有序，这对 vector 来说，代价是很高的。所以，在查找操作几乎从不跟插入删除操作混在一起时，使用排序的 vector 才更合适。

## 17. 当效率至关重要时，请在 map::operator[] 与 map::insert 之间谨慎做出选择

a) 当向 map 中添加元素时，优先选用 insert 而不是 operator[]

b) 当更新 map 中的值时，优先选用 operator[]

## 18.iterator 优先于 const_iterator、reverse_iterator、const_reverse_iterator

a) 尽量用 iterator 来代替 const 或 reverse 型的迭代器

b)iterator 相对于其它更加实用

c) 很多参数都是 iterator，很少有其它

## 19. 使用 distance 和 advance 将容器的 const_iterator 转换成 iterator

```cpp
Container d;
ConstIter ci;
Iter i(d.begin());
advance(i, distance(i, ci));


```

## 20. 对于逐个字符的输入, 请考虑使用 istreambuf_iterator

a) istreambuf_iterator 性能一般优于 istream_iterator

b) istreambuf_iterator 不会跳过任何字符

```cpp
istream inputFile("xxx.txt");
string str(istreambuf_iterator<char>(inputFile), istreambuf_iterator<char>());

```

## 21. 容器的插入, 要确保目标空间足够大

a) 灵活使用 reverse 和 back_inserter、front_inserter 和 inserter 返回的迭代器。

## 22. 了解各种与排序有关的选择

**a) 重点关注以下几项：**

i.partial_sort

ii.nth_element

iii.stable_sort

iv.sort

v.partition

vi.stable_partition

**b) 对排序算法的选择应该更多地基于所需要完成的功能，而不是算法的性能**

**c) 总结：**

i. 如果需要对 vector、string、deque 或者数组中的元素执行一次完全排序，那可以使用 sort 或者 stable_sort

ii. 如果有一个 vector、string、deque 或者数组，并且只需要对等价性最前面的 n 个元素进行排序，那可以使用 partial_sort

iii. 如果有一个 vector、string、deque 或者数组，并且需要找到第 n 个位置上的元素，或者，需要找到等价性最前面的 n 个元素但又不必对这 n 个元素进行排序，那么，nth_element 正是所需要的函数

iv. 如果需要将一个标准序列容器中的元素按照是否满足某个特定的条件区分开来，那么，partition 和 stable_partition 可能正是你所需要的

v. 如果你的数组在一个 list 中，那么你仍然可以调用 partition 和 stable_partition 算法，可以用 list::sort 来替代 sort 和 stable_sort 算法。

## 23. 如果确实需要删除元素，则需要在 remove 这一类算法之后调用 erase

a)erase-remove 这块应该大家都知道

b)list 是个例外，list 的 remove 就是 erase

c)remove 指针时注意释放掉对应的内存，防止内存泄漏

## 24. 了解哪些算法使用排序的区间作为参数

**a) 某些算法为了性能考虑，需要使用排序的区间作为参数**

**b) 如果传递了没有排序的区间进去，会导致错误的结果**

**c) 要求排序区间的 STL 算法：**

i.binary_search

ii.lower_bound

iii.upper_bound

iv.equal_range

v.set_union

vi.set_intersection

vii.set_difference

viii.set_symmetric_difference

ix.merge

x.inplace_merge

xi.includes

d) 下面的算法不一定要求排序区间，但通常和排序区间一起使用

i.unique

ii.unique_copy

## 25.  通过 mismatch 或 lexicographical_compare 实现简单的忽略大小写的字符串比较

a)mismatch 或 lexicographical_compare 更通用

b) 但 strcmp 在处理长字符串时可能更高效

## 26. 使用 accumulate 或者 for_each 进行区间统计

a)accumulate 会计算出一个区间的统计信息

b)for_each 是对一个区间的每个元素做一个操作

## 27. 算法调用优先于手写的循环

**a) 大多数情况下，标准的 STL 肯定比我们自己手写的好一些，包括正确性以及性能和可维护性方面**

**b) 比如：**

- min_element

- accumulate

- partition

- find

- find_if

- for_each

- erase-remove

- transform

## 28. 容器的成员函数优先于同名的算法

**a) 关联容器提供了 count、find、lower_bound、upper_bound、equal_range**

**b)list 提供了 remove、remove_if、unique、sort、merge、reverse**

**c) 有两个原因：**

i. 成员函数通常与容器（特别是关联容器）结合得更加紧密

ii. 成员函数往往速度更快

## 29. 正确区分 count、find、binary_search、lower_bound、upper_bound、equal_range

![alt](https://mmbiz.qpic.cn/mmbiz_png/JeibBY5FJRBGd59vrcic9askGRPZFdnoy72pG5oTCZUqAZoibnpGj4E4iaqPxCBfcTRA2PGz3vxuhXfrAypicSN1pkA/640?wx_fmt=png)

## 30. 考虑使用函数对象而不是函数作为 STL 算法的参数

a) 现在一般都是使用 lambda 表达式作为 STL 算法参数

- EOF -

推荐阅读    点击标题可跳转

1、[C++ STL 容器如何解决线程安全的问题？](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651165473&idx=1&sn=e63fd504c3c362dc75abea90bda3faa8&chksm=8064427eb713cb68d5c5f3bfd41c6c590b43184e2809322a73d96f84898da58cdeac558861ec&scene=21#wechat_redirect)

2、[为何某些公司不允许使用 C++ STL？](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651162763&idx=1&sn=daa0252ac07f43edbf5110aa0d23d68a&chksm=806459d4b713d0c21632a071be211689d4b65bb90bd07dc4aaa1b82124bc3dc059ece9feef26&scene=21#wechat_redirect)

3、[STL 中有哪些副作用或稍不注意会产生性能开销的地方？](http://mp.weixin.qq.com/s?__biz=MzAxNDI5NzEzNg==&mid=2651166504&idx=1&sn=75293ce7ba3f37a319a86f23e3a9dd9b&chksm=80644677b713cf61a7aec4b415a8108fcc2b1cbda7a52ddd62b2dc2a2b6bbe6fb73cc5031fef&scene=21#wechat_redirect)
