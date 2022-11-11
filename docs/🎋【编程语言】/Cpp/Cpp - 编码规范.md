- [参考资料](#参考资料)
- [编码规范](#编码规范)
  - [命名规范](#命名规范)
  - [头文件包含次序](#头文件包含次序)
  - [语句规范](#语句规范)
- [注释规范](#注释规范)

# 参考资料

- [万字详文告诉你如何做 Code Review](https://mp.weixin.qq.com/s?__biz=MjM5ODYwMjI2MA==&mid=2649747120&idx=1&sn=b57e81735c6f6d5bdca31160792df547&chksm=bed37dcb89a4f4ddc8cd3d876aa3fe214ceeea012baf86fc07ba8c7a0a9e0d450a4485b502e8&scene=27#wechat_redirect)

- 文档《金正 C 及 C++编程规范》

# 编码规范

## 命名规范

```cpp
g* 全局变量前缀，有效区域为整个项目的作用域。
m* 类成员变量前缀，有效区域为整个类的作用域。
p\_ 函数入参前缀，有效区域为整个函数的作用域。

---

n 或 u 无符号整型 ch 单字符
i 有符号整型 sz 以零字符结束的字串
l 有符号长整型 str CString
ul 无符号长整型 p 指针
f 有符号浮点型 by BYTE
uf 无符号浮点型 wd WORD
d 有符号双精度 dw DWORD
ud 无符号双精度 st 结构变量
b 逻辑型 cl 类变量
a 数组或 vector en 枚举变量
v vect
ref 引用

---

函数名：
动词 操作说明 备注
Add 增加操作 例：AddUser
Mdf 更新、修改操作 例：MdfUser
Del 删除操作 例：DelUser
Lst 查询操作 例：LstRegKey
Get 获取 例：GetRegKey
Set 设置 例：SetRegKey
Init 初始化动作 例：InitClass
Chk 校验操作 例：ChkValidity
```

## 头文件包含次序

```cpp
#include C 库头文件
#include C++库头文件
#include 其他库头文件
#include 本项目头文件
```

## 语句规范

```cpp
if/for 后加空格再跟括号
太长的语句要分行，通常在运算符前进行分行
大括号独占一行
if、for、do、while、case、switch、default 等语句自占一行，且 if、for、
   do、while 等语句的执行语句部分无论多少都要加括号{ }。
```

# 注释规范
