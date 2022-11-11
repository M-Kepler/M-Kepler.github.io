- [auto & decltype](#auto--decltype)
- [左值右值](#左值右值)
- [列表初始化](#列表初始化)
- [std::function & std::bind & lambda 表达式](#stdfunction--stdbind--lambda-表达式)
- [模板的改进](#模板的改进)
- [并发](#并发)
- [智能指针](#智能指针)
- [基于范围的 for 循环](#基于范围的-for-循环)
- [委托构造函数](#委托构造函数)
- [继承构造函数](#继承构造函数)
- [nullptr](#nullptr)
- [final & override](#final--override)
- [default](#default)
- [delete](#delete)
- [explicit](#explicit)
- [const](#const)
- [constexpr](#constexpr)
- [enum class](#enum-class)
- [非受限联合体](#非受限联合体)
- [sizeof](#sizeof)
- [assertion](#assertion)
- [自定义字面量](#自定义字面量)
- [内存对齐](#内存对齐)
  - [什么是内存对齐](#什么是内存对齐)
  - [为什么要内存对齐](#为什么要内存对齐)
- [thread_local](#thread_local)
- [基础数值类型](#基础数值类型)
- [随机数功能](#随机数功能)
- [正则表达式](#正则表达式)
- [chrono](#chrono)
  - [duration](#duration)
  - [time_point](#time_point)
  - [clocks](#clocks)
- [新增数据结构](#新增数据结构)
- [新增算法](#新增算法)
- [参考资料](#参考资料)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [mp.weixin.qq.com](https://mp.weixin.qq.com/s/G7HwKlSA1d8h2nRTs8s1DA)

C++ 程序员面试过程中基本上都会被问到 c++11 新特性吧，你是怎么回答的呢？

本文基本上涵盖了 c++11 的所有新特性，并有详细代码介绍其用法，对关键知识点做了深入分析，对重要的知识点我单独写了相关文章并附上了相关链接，我整理了完备的 c++ 新特性脑图（由于图片太大，我没有放在文章里，同学可以在后台回复消息 “新特性”，即可下载完整图片）。

#### auto & decltype

关于 C++11 新特性，最先提到的肯定是类型推导，C++11 引入了 auto 和 decltype 关键字，使用他们可以在编译期就推导出变量或者表达式的类型，方便开发者编码也简化了代码。

- auto：让编译器在编译器就推导出变量的类型，可以通过 = 右边的类型推导出变量的类型。

```
auto a = 10; // 10是int型，可以自动推导出a是int

```

- decltype：相对于 auto 用于推导变量类型，而 decltype 则用于推导表达式类型，这里只用于编译器分析表达式的类型，表达式实际不会进行运算。

```
cont int &i = 1;
int a = 2;
decltype(i) b = 2; // b是const int&

```

关于 auto 和 decltype 的详细介绍请看：[一文吃透 C++11 中 auto 和 decltype 知识点](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483911&idx=1&sn=9808fea93560af81c594e7d7c0f81ed9&chksm=eb7a0494dc0d8d82abfc0db427d921c93eb077e9f9162088b13651e81618bb231cb6f22f96a2&scene=21#wechat_redirect)

#### 左值右值

众所周知 C++11 新增了右值引用，这里涉及到很多概念：

- 左值：可以取地址并且有名字的东西就是左值。
- 右值：不能取地址的没有名字的东西就是右值。
- 纯右值：运算表达式产生的临时变量、不和对象关联的原始字面量、非引用返回的临时变量、lambda 表达式等都是纯右值。
- 将亡值：可以理解为即将要销毁的值。
- 左值引用：对左值进行引用的类型。
- 右值引用：对右值进行引用的类型。
- 移动语义：转移资源所有权，类似于转让或者资源窃取的意思，对于那块资源，转为自己所拥有，别人不再拥有也不会再使用。
- 完美转发：可以写一个接受任意实参的函数模板，并转发到其它函数，目标函数会收到与转发函数完全相同的实参。
- 返回值优化：当函数需要返回一个对象实例时候，就会创建一个临时对象并通过复制构造函数将目标对象复制到临时对象，这里有复制构造函数和析构函数会被多余的调用到，有代价，而通过返回值优化，C++ 标准允许省略调用这些复制构造函数。

这里的详细介绍请看：[左值引用、右值引用、移动语义、完美转发，你知道的不知道的都在这里](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483921&idx=1&sn=5f5a14ac4db1e12092434bd9c20e44a2&chksm=eb7a0482dc0d8d94df49a59c1b9dce1458e9b385e97a6c53ecb4bea06b24bd47187a1c47cc4c&scene=21#wechat_redirect)

#### 列表初始化

在 C++11 中可以直接在变量名后面加上初始化列表来进行对象的初始化，详细介绍一定要看这篇文章：[学会 C++11 列表初始化](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483934&idx=1&sn=26025c7e7d530df870059be967908c6d&chksm=eb7a048ddc0d8d9b42e8954645cf7f60b9f3ba520f0d03adc1863a8456c89f2f0ad4c2645124&scene=21#wechat_redirect)

#### std::function & std::bind & lambda 表达式

c++11 新增了 std::function、std::bind、lambda 表达式等封装使函数调用更加方便，详细介绍请看：[搞定 c++11 新特性 std::function 和 lambda 表达式](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483968&idx=1&sn=3d1e0efb0a0cdc66bbf646fc5d64fcbe&chksm=eb7a04d3dc0d8dc56030fed11c83534c105d71f402f56bbb8ad75cb4b7ea4c5e25a6640c078b&scene=21#wechat_redirect)

#### 模板的改进

C++11 关于模板有一些细节的改进：

- 模板的右尖括号
- 模板的别名
- 函数模板的默认模板参数

详细介绍请看：[C++11 的模板改进](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483929&idx=1&sn=7a2fac8daf54d12705ae6f36c57771ef&chksm=eb7a048adc0d8d9cd6ba448c6423ae167deca839965cf82ecec2a92d51b9cb325217689b0764&scene=21#wechat_redirect)

#### 并发

c++11 关于并发引入了好多好东西，有：

- std::thread 相关
- std::mutex 相关
- std::lock 相关
- std::atomic 相关
- std::call_once 相关
- volatile 相关
- std::condition_variable 相关
- std::future 相关
- async 相关

详细介绍请看：[c++11 新特性之线程相关所有知识点](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483972&idx=1&sn=de4a41c7c7920241c35e76d25e092350&chksm=eb7a04d7dc0d8dc102d8400cb081f0a23ab231e36c7adff8c24bfc5cbcc73ac7389614167c95&scene=21#wechat_redirect)

这里也使用 c++11 来实现的线程池和定时器，可以看：

[C++ 线程池的实现之格式修订版](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483823&idx=1&sn=732303e36464f0c9fb4bd75fa10ba4db&chksm=eb7a073cdc0d8e2a6dca8babec94ce063ccab0c7832b9d85539357fe2da692fc6ad6cd5b938b&scene=21#wechat_redirect)

[C++ 定时器的实现之格式修订版](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483823&idx=2&sn=9d39ed7ef1d3bb6c2984db28aa013a9f&chksm=eb7a073cdc0d8e2a2e24291dc9c71d6c48bd8dd8e9149e91f10b44a75b10034005908de7b78d&scene=21#wechat_redirect)

#### 智能指针

很多人谈到 c++，说它特别难，可能有一部分就是因为 c++ 的内存管理吧，不像 java 那样有虚拟机动态的管理内存，在程序运行过程中可能就会出现内存泄漏，然而这种问题其实都可以通过 c++11 引入的智能指针来解决，相反我还认为这种内存管理还是 c++ 语言的优势，因为尽在掌握。

c++11 引入了三种智能指针：

- std::shared_ptr
- std::weak_ptr
- std::unique_ptr

详细介绍请看：[c++11 新特性之智能指针](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483979&idx=1&sn=c815b28d8ffcb49adb7538bf76378f6d&chksm=eb7a04d8dc0d8dce96f262e0b14a74c0bc3a7bf335b202b4f404899489e7e1a325bc0b5b9068&scene=21#wechat_redirect)

#### 基于范围的 for 循环

直接看代码

```
vector<int> vec;
for (auto iter = vec.begin(); iter != vec.end(); iter++) { // before c++11
   cout << *iter << endl;
}
for (int i : vec) { // c++11基于范围的for循环
cout << "i" << endl;
}

```

#### 委托构造函数

委托构造函数允许在同一个类中一个构造函数调用另外一个构造函数，可以在变量初始化时简化操作，通过代码来感受下委托构造函数的妙处吧：

不使用委托构造函数：

```
struct A {
   A(){}
   A(int a) { a_ = a; }
   A(int a, int b) { // 好麻烦
       a_ = a;
       b_ = b;
  }
   A(int a, int b, int c) { // 好麻烦
       a_ = a;
       b_ = b;
       c_ = c;
  }
   int a_;
   int b_;
   int c_;
};

```

使用委托构造函数：

```
struct A {
   A(){}
   A(int a) { a_ = a; }
   A(int a, int b) : A(a) { b_ = b; }
   A(int a, int b, int c) : A(a, b) { c_ = c; }
   int a_;
   int b_;
   int c_;
};

```

初始化变量是不是方便了许多。

#### 继承构造函数

继承构造函数可以让派生类直接使用基类的构造函数，如果有一个派生类，我们希望派生类采用和基类一样的构造方式，可以直接使用基类的构造函数，而不是再重新写一遍构造函数，老规矩，看代码：

不使用继承构造函数：

```
struct Base {
   Base() {}
   Base(int a) { a_ = a; }
   Base(int a, int b) : Base(a) { b_ = b; }
   Base(int a, int b, int c) : Base(a, b) { c_ = c; }
   int a_;
   int b_;
   int c_;
};
struct Derived : Base {
   Derived() {}
   Derived(int a) : Base(a) {} // 好麻烦
   Derived(int a, int b) : Base(a, b) {} // 好麻烦
   Derived(int a, int b, int c) : Base(a, b, c) {} // 好麻烦
};
int main() {
   Derived a(1, 2, 3);
   return 0;
}

```

使用继承构造函数：

```
struct Base {
   Base() {}
   Base(int a) { a_ = a; }
   Base(int a, int b) : Base(a) { b_ = b; }
   Base(int a, int b, int c) : Base(a, b) { c_ = c; }
   int a_;
   int b_;
   int c_;
};
struct Derived : Base {
   using Base::Base;
};
int main() {
   Derived a(1, 2, 3);
   return 0;
}

```

只需要使用 using Base::Base 继承构造函数，就免去了很多重写代码的麻烦。

#### nullptr

nullptr 是 c++11 用来表示空指针新引入的常量值，在 c++ 中如果表示空指针语义时建议使用 nullptr 而不要使用 NULL，因为 NULL 本质上是个 int 型的 0，其实不是个指针。举例：

```
void func(void *ptr) {
   cout << "func ptr" << endl;
}
void func(int i) {
   cout << "func i" << endl;
}
int main() {
   func(NULL); // 编译失败，会产生二义性
   func(nullptr); // 输出func ptr
   return 0;
}

```

#### final & override

c++11 关于继承新增了两个关键字，final 用于修饰一个类，表示禁止该类进一步派生和虚函数的进一步重载，override 用于修饰派生类中的成员函数，标明该函数重写了基类函数，如果一个函数声明了 override 但父类却没有这个虚函数，编译报错，使用 override 关键字可以避免开发者在重写基类函数时无意产生的错误。

示例代码 1：

```
struct Base {
   virtual void func() {
       cout << "base" << endl;
  }
};
struct Derived : public Base{
   void func() override { // 确保func被重写
       cout << "derived" << endl;
  }
   void fu() override { // error，基类没有fu()，不可以被重写
  }
};

```

示例代码 2：

```
struct Base final {
   virtual void func() {
       cout << "base" << endl;
  }
};
struct Derived : public Base{ // 编译失败，final修饰的类不可以被继承
   void func() override {
       cout << "derived" << endl;
  }
};

```

#### default

c++11 引入 default 特性，多数时候用于声明构造函数为默认构造函数，如果类中有了自定义的构造函数，编译器就不会隐式生成默认构造函数，如下代码：

```
struct A {
   int a;
   A(int i) { a = i; }
};
int main() {
   A a; // 编译出错
   return 0;
}

```

上面代码编译出错，因为没有匹配的构造函数，因为编译器没有生成默认构造函数，而通过 default，程序员只需在函数声明后加上 “`=default;`”，就可将该函数声明为 defaulted 函数，编译器将为显式声明的 defaulted 函数自动生成函数体，如下：

```
struct A {
   A() = default;
   int a;
   A(int i) { a = i; }
};
int main() {
   A a;
   return 0;
}

```

编译通过。

#### delete

c++ 中，如果开发人员没有定义特殊成员函数，那么编译器在需要特殊成员函数时候会隐式自动生成一个默认的特殊成员函数，例如拷贝构造函数或者拷贝赋值操作符，如下代码：

```
struct A {
   A() = default;
   int a;
   A(int i) { a = i; }
};
int main() {
   A a1;
   A a2 = a1;  // 正确，调用编译器隐式生成的默认拷贝构造函数
   A a3;
   a3 = a1;  // 正确，调用编译器隐式生成的默认拷贝赋值操作符
}

```

而我们有时候想禁止对象的拷贝与赋值，可以使用 delete 修饰，如下：

```
struct A {
   A() = default;
   A(const A&) = delete;
   A& operator=(const A&) = delete;
   int a;
   A(int i) { a = i; }
};
int main() {
   A a1;
   A a2 = a1;  // 错误，拷贝构造函数被禁用
   A a3;
   a3 = a1;  // 错误，拷贝赋值操作符被禁用
}

```

delele 函数在 c++11 中很常用，std::unique_ptr 就是通过 delete 修饰来禁止对象的拷贝的。

#### explicit

explicit 专用于修饰构造函数，表示只能显式构造，不可以被隐式转换，根据代码看 explicit 的作用：

不用 explicit：

```
struct A {
   A(int value) { // 没有explicit关键字
       cout << "value" << endl;
  }
};
int main() {
   A a = 1; // 可以隐式转换
   return 0;
}

```

使用 explicit:

```
struct A {
   explicit A(int value) {
       cout << "value" << endl;
  }
};
int main() {
   A a = 1; // error，不可以隐式转换
   A aa(2); // ok
   return 0;
}

```

#### const

因为要讲后面的 constexpr，所以这里简单介绍下 const。

const 字面意思为只读，可用于定义变量，表示变量是只读的，不可以更改，如果更改，编译期间就会报错。

主要用法如下：

- 用于定义常量，const 的修饰的变量不可更改。

  ```cpp
  const int value = 5;

  ```

- 指针也可以使用 const，这里有个小技巧，从右向左读，即可知道 const 究竟修饰的是指针还是指针所指向的内容。

  ```cpp
  char *const ptr; // 指针本身是常量
  const char* ptr; // 指针指向的变量为常量

  ```

- 在函数参数中使用 const，一般会传递类对象时会传递一个 const 的引用或者指针，这样可以避免对象的拷贝，也可以防止对象被修改。

  ```cpp
  class A{};
  void func(const A& a);

  ```

- const 修饰类的成员变量，表示是成员常量，不能被修改，可以在初始化列表中被赋值。

  ```cpp
  class A
  {
      const int value = 5;
  };

  class B
  {
      const int value;
      B(int v) : value(v){}
  };

  ```

- 修饰类成员函数，表示在该函数内不可以修改该类的成员变量。

  ```cpp
  class A
  {
      void func() const;
  };

  ```

- 修饰类对象，类对象只能调用该对象的 const 成员函数。

  ```cpp
  class A
  {
      void func() const;
  };

  const A a;
  a.func();

  ```

#### constexpr

constexpr 是 c++11 新引入的关键字，用于编译时的常量和常量函数，这里直接介绍 constexpr 和 const 的区别：

两者都代表可读，const 只表示 read only 的语义，只保证了运行时不可以被修改，但它修饰的仍然有可能是个动态变量，而 constexpr 修饰的才是真正的常量，它会在编译期间就会被计算出来，整个运行过程中都不可以被改变，constexpr 可以用于修饰函数，这个函数的返回值会尽可能在编译期间被计算出来当作一个常量，但是如果编译期间此函数不能被计算出来，那它就会当作一个普通函数被处理。如下代码：

```cpp
#include<iostream>
using namespace std;

constexpr int func(int i)
{
    return i + 1;
}

int main()
{
    int i = 2;
    func(i); // 普通函数
    func(2); // 编译期间就会被计算出来
}

```

#### enum class

c++11 新增有作用域的枚举类型，看代码

不带作用域的枚举代码：

```cpp
enum AColor
{
    kRed,
    kGreen,
    kBlue
};

enum BColor
{
    kWhite,
    kBlack,
    kYellow
};

int main()
{
    if (kRed == kWhite)
    {
        cout << "red == white" << endl;
    }
    return 0;
}

```

如上代码，不带作用域的枚举类型可以自动转换成整形，且不同的枚举可以相互比较，代码中的红色居然可以和白色比较，这都是潜在的难以调试的 bug，而这种完全可以通过有作用域的枚举来规避。

有作用域的枚举代码：

```cpp
enum class AColor
{
    kRed,
    kGreen,
    kBlue
};

enum class BColor
{
    kWhite,
    kBlack,
    kYellow
};

int main()
{
    if (AColor::kRed == BColor::kWhite)
    { // 编译失败
        cout << "red == white" << endl;
    }
    return 0;
}

```

使用带有作用域的枚举类型后，对不同的枚举进行比较会导致编译失败，消除潜在 bug，同时带作用域的枚举类型可以选择底层类型，默认是 int，可以改成 char 等别的类型。

```cpp
enum class AColor : char
{
    kRed,
    kGreen,
    kBlue
};

```

我们平时编程过程中使用枚举，一定要使用有作用域的枚举取代传统的枚举。

#### 非受限联合体

c++11 之前 union 中数据成员的类型不允许有非 POD 类型，而这个限制在 c++11 被取消，允许数据成员类型有非 POD 类型，看代码：

```cpp
struct A
{
    int a;
    int *b;
};

union U
{
    A a; // 非POD类型 c++11之前不可以这样定义联合体
    int b;
};

```

对于什么是 POD 类型，大家可以自行查下资料，大体上可以理解为对象可以直接 memcpy 的类型。

#### sizeof

c++11 中 sizeof 可以用的类的数据成员上，看代码：

c++11 前：

```cpp
struct A
{
    int data[10];
    int a;
};

int main()
{
    A a;
    cout << "size " << sizeof(a.data) << endl;
    return 0;
}

```

c++11 后：

```cpp
struct A
{
    int data[10];
    int a;
};

int main()
{
    cout << "size " << sizeof(A::data) << endl;
    return 0;
}

```

想知道类中数据成员的大小在 c++11 中是不是方便了许多，而不需要定义一个对象，在计算对象的成员大小。

#### assertion

```cpp
static_assert(true/false, message);

```

c++11 引入 static_assert 声明，用于在编译期间检查，如果第一个参数值为 false，则打印 message，编译失败。

#### 自定义字面量

c++11 可以自定义字面量，我们平时 c++ 中都或多或少使用过 chrono 中的时间，例如：

```cpp
std::this_thread::sleep_for(std::chrono::milliseconds(100)); // 100ms
std::this_thread::sleep_for(std::chrono::seconds(100)); // 100s

```

其实没必要这么麻烦，也可以这么写：

```cpp
std::this_thread::sleep_for(100ms); // c++14里可以这么使用，这里只是举个自定义字面量使用的例子
std::this_thread::sleep_for(100s);

```

这就是自定义字面量的使用，示例如下：

```cpp
struct mytype
{
    unsigned long long value;
};

constexpr mytype operator"" _mytype ( unsigned long long n )
{
    return mytype{n};
}

mytype mm = 123_mytype;
cout << mm.value << endl;

```

关于自定义字面量，可以看下 chrono 的源代码，相信大家会有很大收获，需要源码分析 chrono 的话，可以留言给我。

#### 内存对齐

##### 什么是内存对齐

理论上计算机对于任何变量的访问都可以从任意位置开始，然而实际上系统会对这些变量的存放地址有限制，通常将变量首地址设为某个数 N 的倍数，这就是内存对齐。

##### 为什么要内存对齐

- 硬件平台限制，内存以字节为单位，不同硬件平台不一定支持任何内存地址的存取，一般可能以双字节、4 字节等为单位存取内存，为了保证处理器正确存取数据，需要进行内存对齐。

- 提高 CPU 内存访问速度，一般处理器的内存存取粒度都是 N 的整数倍，假如访问 N 大小的数据，没有进行内存对齐，有可能就需要两次访问才可以读取出数据，而进行内存对齐可以一次性把数据全部读取出来，提高效率。

在 c++11 之前如果想创建内存对齐需要：

```cpp
void align_cpp11_before()
{
    static char data[sizeof(void *) + sizeof(A)];
    const uintptr_t kAlign = sizeof(void *) - 1;
    char *align_ptr = reinterpret_cast<char *>(
        reinterpret_cast<uintptr_t>(data + kAlign) & ~kAlign);
    A *attr = new (align_ptr) A;
}

```

c++11 关于内存对齐新增了一些函数：

```cpp
void align_cpp11_after()
{
    static std::aligned_storage<sizeof(A), alignof(A)>::type data;
    A *attr = new (&data) A;
}

```

还有：alignof()、std::alignment_of()、alignas()，关于内存对齐详情可以看这篇文章：[内存对齐之格式修订版](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483981&idx=1&sn=cfda6e84fd77084c75e5048187a1ab28&chksm=eb7a04dedc0d8dc8cb2a26e92f254e23a4538cd2756a1d7f0e8a2aaf99c6e18a42391208276f&scene=21#wechat_redirect)

#### thread_local

c++11 引入 thread_local，用 thread_local 修饰的变量具有 thread 周期，每一个线程都拥有并只拥有一个该变量的独立实例，一般用于需要保证线程安全的函数中。

```cpp
#include <iostream>
#include <thread>

class A
{
public:
    A() {}
    ~A() {}
    void test(const std::string &name)
    {
        thread_local int count = 0;
        ++count;
        std::cout << name << ": " << count << std::endl;
    }
};

void func(const std::string &name)
{
    A a1;
    a1.test(name);
    a1.test(name);
    A a2;
    a2.test(name);
    a2.test(name);
}

int main()
{
    std::thread(func, "thread1").join();
    std::thread(func, "thread2").join();
    return 0;
}

```

输出：

```log
thread1: 1
thread1: 2
thread1: 3
thread1: 4
thread2: 1
thread2: 2
thread2: 3
thread2: 4

```

验证上述说法，对于一个线程私有变量，一个线程拥有且只拥有一个该实例，类似于 static。

#### 基础数值类型

c++11 新增了几种数据类型：long long、char16_t、char32_t 等

#### 随机数功能

c++11 关于随机数功能则较之前丰富了很多，典型的可以选择概率分布类型，先看如下代码：

```cpp
#include <time.h>
#include <iostream>
#include <random>
using namespace std;

int main()
{
    std::default_random_engine random(time(nullptr));
    std::uniform_int_distribution<int> int_dis(0, 100); // 整数均匀分布
    std::uniform_real_distribution<float> real_dis(0.0, 1.0); // 浮点数均匀分布

    for (int i = 0; i < 10; ++i)
    {
        cout << int_dis(random) << ' ';
    }
    cout << endl;
    for (int i = 0; i < 10; ++i)
    {
        cout << real_dis(random) << ' ';
    }
    cout << endl;
    return 0;
}

```

输出：

```log
38 100 93 7 66 0 68 99 41 7
0.232202 0.617716 0.959241 0.970859 0.230406 0.430682 0.477359 0.971858 0.0171148 0.64863

```

代码中举例的是整数均匀分布和浮点数均匀分布，c++11 提供的概率分布类型还有好多，例如伯努利分布、正态分布等，具体可以见最后的参考资料。

#### 正则表达式

c++11 引入了 regex 库更好的支持正则表达式，见代码：

```cpp
#include <iostream>
#include <iterator>
#include <regex>
#include <string>

int main()
{
    std::string s = "I know, I'll use2 regular expressions."; // 忽略大小写
    std::regex self_regex("REGULAR EXPRESSIONS", std::regex_constants::icase);

    if (std::regex_search(s, self_regex))
    {
        std::cout << "Text contains the phrase 'regular expressions'\n";
    }

    std::regex word_regex("(\\w+)");  // 匹配字母数字等字符
    auto words_begin = std::sregex_iterator(s.begin(), s.end(), word_regex);
    auto words_end = std::sregex_iterator();

    std::cout << "Found " << std::distance(words_begin, words_end) << " words\n";

    const int N = 6;

    std::cout << "Words longer than " << N << " characters:\n";

    for (std::sregex_iterator i = words_begin; i != words_end; ++i)
    {
        std::smatch match = *i;
        std::string match_str = match.str();
        if (match_str.size() > N)
        {
            std::cout << " " << match_str << '\n';
        }
    }
    std::regex long_word_regex("(\\w{7,})");
    // 超过7个字符的单词用[]包围
    std::string new_s = std::regex_replace(s, long_word_regex, "[$&]");
    std::cout << new_s << '\n';
}

```

#### chrono

c++11 关于时间引入了 chrono 库，源于 boost，功能强大，chrono 主要有三个点：

- duration

- time_point

- clocks

##### duration

`std::chrono::duration` 表示一段时间，常见的单位有 s、ms 等，示例代码：

```cpp
// 拿休眠一段时间举例，这里表示休眠100ms
std::this_thread::sleep_for(std::chrono::milliseconds(100));

```

sleep_for 里面其实就是 std::chrono::duration，表示一段时间，实际是这样：

```cpp
typedef duration<int64_t, milli> milliseconds;
typedef duration<int64_t> seconds;

```

duration 具体模板如下：

```cpp
template <class Rep, class Period = ratio<1> > class duration;
```

Rep 表示一种数值类型，用来表示 Period 的数量，比如 int、float、double，Period 是 ratio 类型，用来表示【用秒表示的时间单位】比如 second，常用的 duration<Rep, Period> 已经定义好了，在 std::chrono::duration 下：

```cpp
ratio<3600, 1>：hours

ratio<60, 1>：minutes

ratio<1, 1>：seconds

ratio<1, 1000>：microseconds

ratio<1, 1000000>：microseconds

ratio<1, 1000000000>：nanosecons
```

ratio 的具体模板如下：

```cpp
template <intmax_t N, intmax_t D = 1> class ratio;

```

N 代表分子，D 代表分母，所以 ratio 表示一个分数，我们可以自定义 Period，比如 ratio<2, 1> 表示单位时间是 2 秒。

##### time_point

表示一个具体时间点，如 2020 年 5 月 10 日 10 点 10 分 10 秒，拿获取当前时间举例：

```cpp
std::chrono::time_point<std::chrono::high_resolution_clock> Now() {
   return std::chrono::high_resolution_clock::now();
}
// std::chrono::high_resolution_clock为高精度时钟，下面会提到

```

##### clocks

时钟，chrono 里面提供了三种时钟：

- `steady_clock`

  稳定的时间间隔，表示相对时间，相对于系统开机启动的时间，无论系统时间如何被更改，后一次调用 now() 肯定比前一次调用 now() 的数值大，可用于计时。

- `system_clock`

  表示当前的系统时钟，可以用于获取当前时间：

  ```cpp
  int main()
  {
    using std::chrono::system_clock;
    system_clock::time_point today = system_clock::now();
    std::time_t tt = system_clock::to_time_t(today);
    std::cout << "today is: " << ctime(&tt);
    return 0;
  }
  // today is: Sun May 10 09:48:36 2020

  ```

- `high_resolution_clock`

  表示系统可用的最高精度的时钟，实际上就是 system_clock 或者 steady_clock 其中一种的定义，官方没有说明具体是哪个，不同系统可能不一样，我之前看 gcc chrono 源码中 high_resolution_clock 是 steady_clock 的 typedef。

更多关于 chrono 的介绍可以看下我之前的文章：[RAII 妙用之计算函数耗时](http://mp.weixin.qq.com/s?__biz=MzI3NjA1OTEzMg==&mid=2247483852&idx=1&sn=34dde853d5304f8a165e82effe287f3c&chksm=eb7a075fdc0d8e4971f55dc3c4ad4388a3c7466c6df5a47bcfa81510de230cf22065298fee26&scene=21#wechat_redirect)

#### 新增数据结构

- `std::forward_list`：单向链表，只可以前进，在特定场景下使用，相比于 std::list 节省了内存，提高了性能

```cpp
std::forward_list<int> fl = {1, 2, 3, 4, 5};

for (const auto &elem : fl)
{
    cout << elem;
}

```

- std::unordered_set：基于 hash 表实现的 set，内部不会排序，使用方法和 set 类似

- std::unordered_map：基于 hash 表实现的 map，内部不会排序，使用方法和 set 类似

- std::array：数组，在越界访问时抛出异常，建议使用 std::array 替代普通的数组

- std::tuple：元组类型，类似 pair，但比 pair 扩展性好

```cpp
typedef std::tuple<int, double, int, double> Mytuple;
Mytuple t(0, 1, 2, 3);
std::cout << "0 " << std::get<0>(t);
std::cout << "1 " << std::get<1>(t);
std::cout << "2 " << std::get<2>(t);
std::cout << "3 " << std::get<3>(t);

```

#### 新增算法

- all_of：检测表达式是否对范围 [first, last) 中所有元素都返回 true，如果都满足，则返回 true

  ```cpp
  std::vector<int> v(10, 2);

  if (std::all_of(v.cbegin(), v.cend(), [](int i) { return i % 2 == 0; }))
  {
      std::cout << "All numbers are even\n";
  }

  ```

- any_of：检测表达式是否对范围 [first, last) 中至少一个元素返回 true，如果满足，则返回 true，否则返回 false，用法和上面一样

- none_of：检测表达式是否对范围 [first, last) 中所有元素都不返回 true，如果都不满足，则返回 true，否则返回 false，用法和上面一样

- find_if_not：找到第一个不符合要求的元素迭代器，和 find_if 相反

- copy_if：复制满足条件的元素

- itoa：对容器内的元素按序递增

  ```cpp
  std::vector<int> l(10);
  std::iota(l.begin(), l.end(), 19); // 19为初始值
  for (auto n : l) std::cout << n << ' ';
  // 19 20 21 22 23 24 25 26 27 28

  ```

- minmax_element：返回容器内最大元素和最小元素位置

  ```cpp
  int main()
  {
      std::vector<int> v = {3, 9, 1, 4, 2, 5, 9};
      auto result = std::minmax_element(v.begin(), v.end());
      std::cout << "min element at: " << *(result.first) << '\n';
      std::cout << "max element at: " << *(result.second) << '\n';
      return 0;
  }
  // min element at: 1
  // max element at: 9

  ```

- is_sorted、is_sorted_until：返回容器内元素是否已经排好序。

关于 c++11 的新特性基本上就是这些，相信各位看完一定会有所收获。

#### 参考资料

> - https://juejin.im/post/5dcaa857e51d457f7675360b
> - https://zhuanlan.zhihu.com/p/21930436
> - https://zh.wikipedia.org/wiki/Nullptr
> - https://zh.wikipedia.org/wiki/Constexpr
> - https://zh.cppreference.com/w/cpp/language/enum
> - https://kheresy.wordpress.com/2019/03/27/using-enum-class/
> - https://zh.cppreference.com/w/cpp/language/union
> - http://c.biancheng.net/view/7165.html
> - https://zhuanlan.zhihu.com/p/77585472
> - http://www.cplusplus.com/reference/random/
> - https://zh.cppreference.com/w/cpp/regex
> - https://www.cnblogs.com/jwk000/p/3560086.html
> - https://zh.cppreference.com/w/cpp/algorithm/all_any_none_of

相关链接：

- [你一定要搞明白的 C 函数调用方式与栈原理](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247486799&idx=1&sn=dcf7602b48a383d2d5cafcd6688d0445&chksm=fc70f6a3cb077fb56b83d30a07d749d0543245eb9b143d72eb7c49f958fa5cd570e3042e460c&scene=21#wechat_redirect)

- [深入理解 C/C++ 中 的指针](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247486800&idx=1&sn=deea622ac5d765893847ee1486f6dbb4&chksm=fc70f6bccb077faa00937db819a6eaea0ce6d4a53db69ed1a3fa02a8dc2c80b4d199e71488e8&scene=21#wechat_redirect)

- [后台 C++ 开发你一定要知道的条件变量](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247486849&idx=1&sn=dda6a329e4f3ab7a0c9ca2548b8b35f2&chksm=fc70f66dcb077f7b90ec782d5c03af6ad0f23df069480fd74809e8ebeef258b6f71918155111&scene=21#wechat_redirect)

- [详解 C++ 11 中的智能指针](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247487571&idx=1&sn=f41029e78af410fe6075dde4e4cb8c70&chksm=fc70ebbfcb0762a9b41d3a73342ce89baa274156f4480f8e09f64f1dc08bbda112b77f83c679&scene=21#wechat_redirect)

- [C++ 17 结构化绑定](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247487524&idx=1&sn=d41ed1c78296fa01760c73b9d0502983&chksm=fc70ebc8cb0762dedad9e8413fb49c0578693b1adfb9a4aecb1a25db2d6d229a276c16063669&scene=21#wechat_redirect)

- [C++ 如何进阶？](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247487260&idx=1&sn=7590da96b0f1f73cd84cc8c8e1e5d619&chksm=fc70f4f0cb077de6f100c1fcb2696d79cbbf413b412f5cf187d35f8c16c34858c3724645ceb9&scene=21#wechat_redirect)[如何准备 C++ 面试？](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247487260&idx=1&sn=7590da96b0f1f73cd84cc8c8e1e5d619&chksm=fc70f4f0cb077de6f100c1fcb2696d79cbbf413b412f5cf187d35f8c16c34858c3724645ceb9&scene=21#wechat_redirect)

- [如何使用 Visual Studio 管理和阅读开源项目代码](http://mp.weixin.qq.com/s?__biz=MzU2MTkwMTE4Nw==&mid=2247486661&idx=1&sn=abfd28c6c41b7affa8d764b664a6171b&chksm=fc70f729cb077e3febdb2e08f96199e5a666e80854bf83893595b1efa3b6e2755e79ec90442d&scene=21#wechat_redirect)
