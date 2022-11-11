- [引言](#引言)
- [什么是 Lambda 表达式](#什么是-lambda-表达式)
- [怎么用 Lambda 表达式](#怎么用-lambda-表达式)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [www.jianshu.com](https://www.jianshu.com/p/96e9dba6e7a9)

## 引言

最近刷 Leetcode 经常看 discuss，通常是佩服别人算法漂亮。但做[第373题 Find K Pairs with Smallest Sums](https://leetcode-cn.com/problems/find-k-pairs-with-smallest-sums/)时，被[这个答案](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/discuss/84607/clean-16ms-c-on-space-oklogn-time-solution-using-priority-queue)语言上的优雅震惊了。代码片段如下：

```c++
auto cmp = [&nums1, &nums2](pair<int, int> a, pair<int, int> b) { 
    return nums1[a.first] + nums2[a.second] > 
             nums1[b.first] + nums2[b.second];
};
priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> min_heap(cmp);
```

通过使用 auto、decltype 和 lambda 表达式等 C++ 11 新特性，大大压缩了代码量，降低了编写和理解难度，所以决定花时间好好研究一下Lambda表达式。

## 什么是 Lambda 表达式

查 Lambda 表达式资料时很容易被函数闭包、Lambda演算、形式系统这些深奥名词淹没而放弃学习，其实Lambda表达式就是匿名函数（annoymous function）——允许我们使用一个函数，但不需要给这个函数起名字。还是有点难懂？没关系，看完下面这个例子就清楚了。

```c++
int main() {
    vector<int> data;
    for (int i = 0; i < 10; ++i)
        data.push_back(i);

    sort(data.begin(), data.end());
    for (int i = 0; i < data.size(); ++i)
        cout << data[i] << endl;
    return 0;
}
```

这段代码的含义是初始化 data，对 data 里的元素排序后输出。algorithm 库里的 sort 默认采用升序，想用倒序怎么办呢？对，自己定义一个比较函数cmp，作为参数传给sort：

```c++
bool cmp(int &a, int &b);

int main() {
    vector<int> data;
    for (int i = 0; i < 10; ++i)
        data.push_back(i);

    // 使用自定义的比较函数
    sort(data.begin(), data.end(), cmp);
    for (int i = 0; i < data.size(); ++i)
        cout << data[i] << endl;
    return 0;
}

bool cmp(int &a, int &b) {
    return a > b;
}
```

在定义了函数 `bool cmp(int &a, int &b)` 后，相同的函数签名变得不可用，我不能再用 `bool cmp(int &a, int &b)` 这个签名定义一个别的比较函数：

```c++
bool cmp(int &a, int &b) {
    return (a % 3) > (b % 3);
}
```

问题是排序这件事通常不会反复做，那么用cmp比较大小是个一次性的临时需求，排序之后它的任务就已经完成了。所以给它特意起个名字污染命名空间似乎有点不太合算，可不可以不给它起cmp这个名字，又能使用比较大小的功能呢？答案当然是可以的，通过与cmp等价的匿名函数：

```c++
int main() {
    vector<int> data;
    for (int i = 0; i < 10; ++i)
        data.push_back(i);

    sort(data.begin(), data.end(), [](int &a, int &b)->bool {return a > b;});

    for (int i = 0; i < data.size(); ++i)
        cout << data[i] << endl;
    return 0;
}
```

其中

```c++
[](int &a, int &b)->bool {return a > b;}
```

就是传说中的Lambda表达式了，先不管`[]`部分，`(int &a, int &b)->bool` 表示接受两个int引用类型的参数，返回值是bool类型，`{}`里是函数体，是不是很简单？

关于Lambda表达式的意义可以参考知乎上的提问，我自己的理解是Lambda表达式实现了函数名字和功能的分离，允许在不起名字的情况下定义和使用功能。举个生活中的例子，点外卖时我们关心的只是外卖小哥送货上门的“功能”，不需要特意记住他的“名字”。

## 怎么用 Lambda 表达式

Lambda 表达式的具体语法可以参考 cppreference 上的 Guide。一个 Lambda 表达式的形式通常为：

```c++
[capture_list] (param_list) -> return { body }
```

其中 `(param_list) -> return` 定义了这个匿名函数的参数和返回类型， `{ body }`定义了这个匿名函数的功能，捕捉列表 `[capture_list]` 是做什么的呢？概括地讲，它使这个匿名函数可以访问外部（父作用域）变量。

还是举个例子：

```c++
int main() {
    int a = 0;
    auto f = ([]()->void {cout << a << endl;});
    f();
    return 0;
}

这段代码的含义是定义了一个匿名函数赋给 f 并运行 f，但编译时会报错： `error: 'a' is not captured`；因为变量a在函数f的外部，想要访问a的话需要把它加到[ capture-list ]里，也就是：

```c++
int main() {
    int a = 0;
    auto f = ([a]()->void {cout << a << endl;});
    f();
    return 0;
}
```

捕捉方式有按值和按引用两种。

- `[a, &b]` 表示按值捕捉a，按引用捕捉b

- `[&, a]` 表示按引用捕捉所有父作用域变量，除了a按值捕捉

- `[=，&b]` 表示按值捕捉所有父作用域变量，除了b按引用捕捉。

假设有数组data，想生成只保留data中偶数的新数组result，可以用：

```c++
int main() {
    vector<int> data;
    vector<int> result;

    for (int i = 0; i < 10; ++i)
        data.push_back(i);

    for_each(data.begin(), data.end(), [&result](int &elem){
        if (elem % 2 == 0)
            result.push_back(elem);
        });

    for_each(result.begin(), result.end(), [](int &elem){
        cout << elem << endl;
        });
    return 0;
}
```
