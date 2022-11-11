- [参考资料](#参考资料)
- [Golang 必知必会](#golang-必知必会)
  - [make 和 new](#make-和-new)
- [其他](#其他)

# 参考资料

[Go 语言笔试面试题汇总](https://geektutu.com/post/qa-golang.html)

[Go 语言后端开发如何规划学习路线](https://www.zhihu.com/question/466080367/answer/2304713833)

# Golang 必知必会

## make 和 new

- **new 只分配内存它并不初始化内存，只是将其置初始值**

  new(T) 会为 T 类型的新项目，分配被置零的存储，并且返回它的地址，一个类型为 T 的值，也即其返回一个指向新分配的类型为 T 的指针，这个指针指向的内容的值为零（zero value），注意并不是指针为零。比如，对于 bool 类型，零值为 false；int 的零值为 0；string 的零值是空字符串。

- make 用于 slice，map，和 channel 的初始化，返回一个初始化的 (而不是置零)，类型为 T 的值（而不是 T）。

  之所以有所不同，是因为**这三个类型是使用前必须初始化的数据结构**。例如，slice 是一个三元描述符，包含一个指向数据（在数组中）的指针，长度，以及容量，在这些项被初始化之前，slice 都是 nil 的。对于 slice，map 和 channel，make 初始化这些内部数据结构，并准备好可用的值。

# 其他
