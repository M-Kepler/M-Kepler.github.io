- [string 类的 构造](#string-类的-构造)
- [string 类的 字符操作](#string-类的-字符操作)
- [string 类的 特性描述](#string-类的-特性描述)
- [string 类的 输入输出操作](#string-类的-输入输出操作)
- [string 类的 赋值 =](#string-类的-赋值-)
- [string 类的 连接 +=](#string-类的-连接-)
- [string 类的 比较 `== > < >= <= !=`](#string-类的-比较------)
- [string 类的 子串 substr](#string-类的-子串-substr)
- [string 类的 交换 swap](#string-类的-交换-swap)
- [string 类的 查找 find / rfind](#string-类的-查找-find--rfind)
- [string 类的 替换 replace](#string-类的-替换-replace)
- [string 类的 插入 insert](#string-类的-插入-insert)
- [string 类的 删除 erase](#string-类的-删除-erase)
- [string 类的 迭代器处理 const_iterator](#string-类的-迭代器处理-const_iterator)
- [字符串流处理](#字符串流处理)
- [其他](#其他)

> [原文地址](https://blog.csdn.net/sinat_36184075/article/details/54836053)

## string 类的 构造

```cpp
// 用c字符串s初始化
string(const char *s);

// 用n个字符c初始化
string(int n, char c);

// string 类还支持默认构造函数和复制构造函数，如 string s1；string s2 = "hello"

// 当构造的 string 太长而无法表达时会抛出 length_error 异常
```

## string 类的 字符操作

```cpp
const char &operator[](int n)const;
const char &at(int n)const;
char &operator[](int n);
char &at(int n);
```

`operator[]` 和 `at()` 均返回当前字符串中第 n 个字符的位置，但 `at` 函数提供范围检查，当越界时会抛出 `out_of_range` 异常，下标运算符 `[]` 不提供检查访问。

```cpp
// 返回一个非null终止的c字符数组
const char *data()const;

// 返回一个以null终止的c字符串
const char *c_str()const;

// 把当前串中以pos开始的n个字符拷贝到以s为起始位置的字符数组中，返回实际拷贝的数目
int copy(char *s, int n, int pos = 0) const;
```

## string 类的 特性描述

```cpp
// 返回当前容量（即string中不必增加内存即可存放的元素个数）
int capacity()const;

// 返回string对象中可存放的最大字符串的长度
int max_size()const;

// 返回当前字符串的大小
int size()const;

// 返回当前字符串的长度
int length()const;

// 当前字符串是否为空
bool empty()const;

// 把字符串当前大小置为len，并用字符c填充不足的部分
void resize(int len,char c);
```

## string 类的 输入输出操作

string 类重载运算符 `operator>>` 用于输入，同样重载运算符 `operator<<` 用于输出操作

```cpp
// 用于从输入流in中读取字符串到s中，以换行符'\n'分开
getline(istream &in,string &s);

// 实现了读取一行字符，包括空格、制表符、回车符等行内字符和符号，以\n分开
string s1;
getline (cin, s1);
```

## string 类的 赋值 =

```cpp
// 把字符串s赋给当前字符串
string &operator=(const string &s);

// 用c类型字符串s赋值
string &assign(const char *s);

// 用c字符串s开始的n个字符赋值
string &assign(const char *s,int n);

// 把字符串s赋给当前字符串
string &assign(const string &s);

// 用n个字符c赋值给当前字符串
string &assign(int n,char c);

// 把字符串s中从start开始的n个字符赋给当前字符串
string &assign(const string &s,int start,int n);

// 把first和last迭代器之间的部分赋给字符串
string &assign(const_iterator first,const_itertor last);
```

## string 类的 连接 +=

```cpp
// 把字符串s连接到当前字符串的结尾
string &operator+=(const string &s);

// 把c类型字符串s连接到当前字符串结尾
string &append(const char *s);

// 把c类型字符串s的前n个字符连接到当前字符串结尾
string &append(const char *s,int n);

// 同operator+=()
string &append(const string &s);

// 把字符串s中从pos开始的n个字符连接到当前字符串的结尾
string &append(const string &s,int pos,int n);

// 在当前字符串结尾添加n个字符c
string &append(int n,char c);

// 把迭代器first和last之间的部分连接到当前字符串的结尾
string &append(const_iterator first,const_iterator last);
```

## string 类的 比较 `== > < >= <= !=`

```cpp
// 比较两个字符串是否相等
bool operator==(const string &s1,const string &s2)const;
```

- 运算符 `">","<",">=","<=","!="` 均被重载用于字符串的比较

  > `compare` 函数在 `>` 时返回 1，`<` 时返回 - 1，`==` 时返回 0

  ```cpp
  // 比较当前字符串和s的大小
  int compare(const string &s) const;

  // 比较当前字符串从pos开始的n个字符组成的字符串与 s 的大小
  int compare(int pos, int n, const string &s)const;

  // 比较当前字符串从pos开始n个字符字符串与s中pos2开始n2个字符字符串的大小
  int compare(int pos, int n, const string &s, int pos2, int n2)const;

  int compare(const char *s) const;
  int compare(int pos, int n, const char *s) const;
  int compare(int pos, int n, const char *s, int pos2) const;
  ```

## string 类的 子串 substr

```cpp
// 返回pos开始的n个字符组成的字符串
string substr(int pos = 0, int n = npos) const;

// s = s.substr(begin, end - begin);
```

## string 类的 交换 swap

```cpp
// 交换当前字符串与s2的值
void swap(string &s2);

string s1 = "aaa";
string s2 = "bbb";
s1.swap(s2);
```

## string 类的 查找 find / rfind

````cpp
// 从 pos开始查找字符c在当前字符串的位置
int find(char c, int pos = 0) const;

// 从 pos开始查找字符串s在当前串中的位置
int find(const char *s, int pos = 0) const;

// 从 pos开始查找字符串s中前n个字符在当前串中的位置
int find(const char *s, int pos, int n) const;

// 从 pos开始查找字符串s在当前串中的位置
int find(const string &s, int pos = 0) const;

//查找成功时返回所在位置，失败返回string::npos的值

```cpp
//从 pos开始【从后向前】查找字符c在当前串中的位置
int rfind(char c, int pos = npos) const;
int rfind(const char *s, int pos = npos) const;
int rfind(const char *s, int pos, int n = npos) const;
int rfind(const string &s,int pos = npos) const;
// 从pos开始从后向前查找字符串s中前n个字符组成的字符串在当前串中的位置，成功返回所在位置，失败时返回string::npos的值
````

```cpp
//从 pos 开始查找字符c第一次出现的位置
int find_first_of(char c, int pos = 0) const;
int find_first_of(const char *s, int pos = 0) const;
int find_first_of(const char *s, int pos, int n) const;
int find_first_of(const string &s,int pos = 0) const;
//从pos开始查找当前串中第一个在s的前n个字符组成的数组里的字符的位置。查找失败返回string::npos
```

```cpp
int find_first_not_of(char c, int pos = 0) const;
int find_first_not_of(const char *s, int pos = 0) const;
int find_first_not_of(const char *s, int pos,int n) const;
int find_first_not_of(const string &s,int pos = 0) const;
//从当前串中查找第一个不在串s中的字符出现的位置，失败返回string::npos
```

```cpp
int find_last_of(char c, int pos = npos) const;
int find_last_of(const char *s, int pos = npos) const;
int find_last_of(const char *s, int pos, int n = npos) const;
int find_last_of(const string &s,int pos = npos) const;
int find_last_not_of(char c, int pos = npos) const;
int find_last_not_of(const char *s, int pos = npos) const;
int find_last_not_of(const char *s, int pos,  int n) const;
int find_last_not_of(const string &s,int pos = npos) const;
// find_last_of和find_last_not_of与find_first_of和find_first_not_of相似，只不过是从后向前查找
```

## string 类的 替换 replace

```cpp
// 删除从 【p0开始】的 【n0个字符】，然后在p0处插入串s
string &replace(int p0, int n0, const char *s);

// 删除p0开始的n0个字符，然后在p0处插入字符串s的前n个字符
string &replace(int p0, int n0, const char *s, int n);

// 删除从p0开始的n0个字符，然后在p0处插入串s
string &replace(int p0, int n0, const string &s);

// 删除p0开始的n0个字符，然后在p0处插入串s中从pos开始的n个字符
string &replace(int p0, int n0, const string &s, int pos, int n);

// 删除p0开始的n0个字符，然后在p0处插入n个字符c
string &replace(int p0, int n0, int n, char c);

// 把 [first0，last0）之间的部分替换为字符串s
string &replace(iterator first0, iterator last0,const char *s);

// 把 [first0，last0）之间的部分替换为s的前n个字符
string &replace(iterator first0, iterator last0,const char *s, int n);

// 把 [first0，last0）之间的部分替换为串s
string &replace(iterator first0, iterator last0,const string &s);

// 把 [first0，last0）之间的部分替换为n个字符c
string &replace(iterator first0, iterator last0,int n, char c);

// 把 [first0，last0）之间的部分替换成[first，last）之间的字符串
string &replace(iterator first0, iterator last0,const_iterator first, const_iterator last);
```

## string 类的 插入 insert

```cpp
string &insert(int p0, const char *s);
string &insert(int p0, const char *s, int n);
string &insert(int p0,const string &s);
string &insert(int p0,const string &s, int pos, int n);
//前4个函数在p0位置插入字符串s中pos开始的前n个字符

//此 函数在p0处插入n个字符c
string &insert(int p0, int n, char c);

//在 it处插入字符c，返回插入后迭代器的位置
iterator insert(iterator it, char c);

//在 it处插入[first，last）之间的字符
void insert(iterator it, const_iterator first, const_iterator last);

//在 it处插入n个字符c
void insert(iterator it, int n, char c);
```

## string 类的 删除 erase

```cpp
//删除 [first，last) 之间的所有字符，返回删除后迭代器的位置
iterator erase(iterator first, iterator last);

//删除 it 指向的字符，返回删除后迭代器的位置
iterator erase(iterator it);

//删除 pos 开始的n个字符，返回修改后的字符串
string &erase(int pos = 0, int n = npos);
```

## string 类的 迭代器处理 const_iterator

- string 类提供了向前和向后遍历的迭代器 iterator，迭代器提供了访问各个字符的语法，类似于指针操作，`迭代器不检查范围`

- 用 `string::iterator` 或 `string::const_iterator` 声明迭代器变量，`const_iterator 不允许改变迭代的内容`

```cpp
const_iterator begin()const;
iterator begin();
//返回string的起始位置

const_iterator end()const;
iterator end();
//返回string的最后一个字符【后面的位置】

const_iterator rbegin()const;
iterator rbegin();
//返回string的最后一个字符的位置

const_iterator rend()const;
iterator rend();
//返回string第一个字符位置的前面
```

- `rbegin` 和 `rend` 用于从后向前的迭代访问，通过设置迭代器 `string::reverse_iterator`,`string::const_reverse_iterator` 实现

## 字符串流处理

通过定义 ostringstream 和 istringstream 变量实现，`<sstream>` 头文件中

```cpp
#include <sstream>
#include <string>

string input("hello,this is a test");
// istringstream 对象可以绑定一行字符串，然后【以空格为分隔符把该行分隔开来】
istringstream is(input);

// 从输入流 is 中读入一个字符串到 temp，遇到空格是结束
string s1,s2,s3,s4;
is >> s1 >> s2 >> s3 >> s4; // s1="hello,this",s2="is",s3="a",s4="test"

/*
string tmp;
while (is >> temp)
{
    cout << temp << endl;
}
*/

ostringstream os;
os << s1 << s2 << s3 << s4;

cout << os.str();
```

对于 string 对象进行的操作非常多，在这里调用的成员函数中也包括由点操作符和函数名组成的对象名称，同时对象通过函数的参数列表来传递。如下所示：

```cpp
#include <iostream>
#include <string>

using namespace std;

int main()
{
    // s1 = "string of many words." 和 string s1("string of many words.") 等价， 都调用了string类构造函数。
    string s1 = "string of many words.", s2 = "many";
    int i;
    cout << s1 << endl;

    // 调用find函数，返回s2在s1中的位置。在这里返回10，因s1在s2起始位置是10
    i = s1.find(s2);

    //调用replace函数用字符串few来替换s1中的4个字符。i的值就是find的返回值，
    //many在字符串中的位置，并且表示替换从这该位置开始。
    s1.replace(i, 4, "few");

    cout << s1 << endl;

    //删除了s1字符串中从第10个开始的4个字符
    s1.erase(i, 4);

    cout << s1 << endl;

    // 把字符串"simple"插入字符串s1的第10个字符的位置。
    s1.insert(i,"simple ");
    cout << s1 << endl;
}
```

- 在调用 find 函数时，没有找到字符串 s2 将返回一个 string 类的数据成员 `npos(npos=-1)`

- 在 string 类中 find 函数被重载了，重载后有两个参数 `ob1.find(ob2, index)`，index 是个整数值，表示从字符串 ob1 中开始搜索起始位置。

- repace 函数也可以重载，如 `ob1.replace(index1, num1, ob2, index2, num2);` 这里 index1 和 num1 是 ob1 中要替换的字符串和字符个数，

- index2 和 num2 是 ob2 中用于替换字符串下标和字符个数，replace 函数返回一个引用给调用对象。

## 其他

- [append 和 push_back 的区别](https://blog.csdn.net/weixin_44635198/article/details/104522387)
