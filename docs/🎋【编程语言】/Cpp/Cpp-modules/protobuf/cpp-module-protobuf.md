- [参考资料](#参考资料)
- [`protobuf`](#protobuf)
- [使用过程中遇到的问题](#使用过程中遇到的问题)
- [其他](#其他)

# 参考资料

- [ProtoBuf3 C++使用篇](https://www.cnblogs.com/DswCnblog/p/6700660.html)

- [Protobuf3 语法详解](https://blog.csdn.net/qq_36373500/article/details/86551886)

# `protobuf`

- 安装

- 假定现在要实现一个保存和显示用户通讯录的功能。如里不用 protocbuf ，思路大概是这样的：提示用户输入姓名,电话号码之类，然后保存到文件，文件可以是 xml，csv 之类。读取的时候要解析 xml 或者 csv，然后再把文件中的数据装入内存。这个思路完全能实现功能，问题是读写的时候都要涉及文件操作。protocbuf 可以简化这个操作，存的时候直接按对象存，取的时候按对象取，效率极高。

- 最好是做到看 proto 就能写代码，知道怎么使用定义的变量

- 语法

  ```java
  syntax = "proto3"; // 版本
  package student;   // 包，就像c++的名字空间
  enum SexType {     // 枚举类型
      male = 0;      // 首元素必须为0
      femal = 1;
  }

  message xxx {      // 类似于c++的strut，里面还可以再定义message
    // 字段规则：required -> 字段只能也必须出现 1 次【proto3已移除】
    // 字段规则：optional -> 字段可出现 0 次或1次   【proto3已移除】
    // 字段规则：repeated -> 字段可出现任意多次（包括 0）
    // 类型：int32、int64、sint32、sint64、string、32-bit ....
    // 字段编号：0 ~ 536870911（除去 19000 到 19999 之间的数字）
    字段规则 类型 名称 = 字段编号;
  }

  message person {
      string name = 1;
      SexType sex = 2;
      string address = 3;
      int32 age = 4;
  }
  message student {
      string class = 1;
      float score = 2;
      person baseinfo = 3;
  }
  ```

- 默认值

  当一个消息被解析的时候，如果编码消息里不包含一个特定的 singular 元素，被解析的对象锁对应的字段被设置为一个默认值，对于不同类型指定如下：

  - 对于 string，默认是一个空 string

  - 对于 bytes，默认是一个空的 bytes

  - 对于 bool，默认是 false

  - 对于数值类型，默认是 0

  - 对于枚举，默认是第一个定义的枚举值，必须为 0

  - 对于消息类型(message)，字段没有被设置，确切的消息是根据语言确定的，详见 generated code guide

  - 可重复字段的默认值是 empty(通常情况下是对应语言中空列表)。

- 编译

  ```sh
  protoc -I/path/to/proto --cpp_out=/path/to/output student.proto
  ```

- 解析和序列化

  ```cpp
  // 序列化消息，将存储的字节以string方式输出。字节是二进制，而非文本；
  bool SerializeToString(string* output) const
  // 解析给定的string
  bool ParseFromString(const string& data)
  // 写消息给定的c++  ostream中
  bool SerializeToOstream(ostream* output) const
  // 从给定的c++ istream中解析出消息
  bool ParseFromIstream(istream* input)
  ```

- 自动生成的 API

  - 读写

    Python 直接用 `obj.member=xxxx` 就可以赋值，读也是直接 `obj.member` 来读
    C++ 不一样，要用 `obj.member()` 来获取，`obj.set_xxx` 来设值

  - 其实是生成一个类，类中有着对应的方法

    名字空间 -- proto 的 package

    类 -- proto 的每个 message

- 和 c++一起编译链接

  ```sh
  # 编译 `.pb.cc`
  g++ -c student.pb.cc -MD -lprotobuf
  # 编译生成 .d 和 .o 文件

  g++ -c main.cpp
  # 生成 main.o

  # 链接
  g++ -I./student.pb.h student.pb.o main.o -o a.out
  ```

- `DebugString`

# 使用过程中遇到的问题

- [`undefined reference to 'google::protobuf::internal::fixed_address_empty_string[abi:cxx11]....'` 版本不匹配](https://blog.csdn.net/zhuansun1990/article/details/104708537)

  如果 libprotobuf 是使用 GCC 4.x 或之前构建的，但您的应用程序是使用 GCC 5+构建的，就会有这个问题

  代码中有归档其用到的 protobuf 编译后的文件；手动编译最新版本，替换上去就行了

# 其他
