- [1、数据拷贝基础过程](#1数据拷贝基础过程)
- [1.1 仅 CPU 方式](#11-仅-cpu-方式)
- [1.2 CPU&DMA 方式](#12-cpudma-方式)
- [2、普通模式数据交互](#2普通模式数据交互)
- [读数据过程](#读数据过程)
- [写数据过程](#写数据过程)
- [综上所述](#综上所述)
- [3、零拷贝技术](#3零拷贝技术)
- [3.1 出现原因](#31-出现原因)
- [3.2 解决思路](#32-解决思路)
- [3.2.1 mmap 方式](#321-mmap-方式)
- [3.2.2 sendfile 方式](#322-sendfile-方式)
- [3.2.3 sendfile+DMA 收集](#323-sendfiledma-收集)
- [3.2.4 splice 方式](#324-splice-方式)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/442771856)

## 1、数据拷贝基础过程

在 Linux 系统内部缓存和内存容量都是有限的，更多的数据都是存储在磁盘中。对于 Web 服务器来说，经常需要从磁盘中读取数据到内存，然后再通过网卡传输给用户：

![alt](https://pic4.zhimg.com/v2-28030b8822172f0b911c44f45a0394e3_r.jpg)

## 1.1 仅 CPU 方式

- 当应用程序需要读取磁盘数据时，调用 read() 从用户态陷入内核态，read() 这个系统调用最终由 CPU 来完成；
- CPU 向磁盘发起 I/O 请求，磁盘收到之后开始准备数据；
- 磁盘将数据放到磁盘缓冲区之后，向 CPU 发起 I/O 中断，报告 CPU 数据已经 Ready 了；
- CPU 收到磁盘控制器的 I/O 中断之后，开始拷贝数据，完成之后 read() 返回，再从内核态切换到用户态；

![alt](https://pic3.zhimg.com/v2-819945113e77d909db6e03c3de0b489e_r.jpg)

## 1.2 CPU&DMA 方式

CPU 的时间宝贵，让它做杂活就是浪费资源。

直接内存访问（Direct Memory Access），是一种硬件设备绕开 CPU 独立直接访问内存的机制。所以 DMA 在一定程度上解放了 CPU，把之前 CPU 的杂活让硬件直接自己做了，提高了 CPU 效率。

目前支持 DMA 的硬件包括：网卡、声卡、显卡、磁盘控制器等。

![alt](https://pic4.zhimg.com/v2-340b274d20348d770076683b1d0803af_r.jpg)

**有了 DMA 的参与之后的流程发生了一些变化：**

![alt](https://pic3.zhimg.com/v2-294d6e0062abb163dfea296acf41be8e_r.jpg)

最主要的变化是，CPU 不再和磁盘直接交互，而是 DMA 和磁盘交互并且将数据从磁盘缓冲区拷贝到[内核缓冲区](https://www.zhihu.com/search?q=%E5%86%85%E6%A0%B8%E7%BC%93%E5%86%B2%E5%8C%BA&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)，之后的过程类似。

> 无论从仅 CPU 方式和 DMA&CPU 方式，都存在多次冗余数据拷贝和内核态 & 用户态的切换。

继续思考 Web 服务器读取本地磁盘文件数据再通过网络传输给用户的详细过程。

## 2、普通模式[数据交互](https://www.zhihu.com/search?q=%E6%95%B0%E6%8D%AE%E4%BA%A4%E4%BA%92&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)

一次完成的数据交互包括几个部分：系统调用 syscall、CPU、DMA、网卡、磁盘等。

![alt](https://pic4.zhimg.com/v2-48a14f236be6dc58f2447780dc68f86b_r.jpg)

**系统调用 syscall 是应用程序和内核交互的桥梁，每次进行调用 / 返回就会产生两次切换：**

- 调用 syscall 从用户态切换到内核态
- syscall 返回 从内核态切换到用户态

![alt](https://pic2.zhimg.com/v2-49b8f556c837ea868acbf5847cd6f05d_r.jpg)

**来看下完整的数据拷贝过程简图：**

![alt](https://pic4.zhimg.com/v2-a9ca1af6595c47ceea8bb76c9afbcf6f_r.jpg)

## 读数据过程

- 应用程序要读取磁盘数据，调用 read() 函数从而实现用户态切换内核态，这是第 1 次状态切换；
- DMA 控制器将数据从磁盘拷贝到内核缓冲区，这是第 1 次 DMA 拷贝；
- CPU 将数据从内核缓冲区复制到[用户缓冲区](https://www.zhihu.com/search?q=%E7%94%A8%E6%88%B7%E7%BC%93%E5%86%B2%E5%8C%BA&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)，这是第 1 次 CPU 拷贝；
- CPU 完成拷贝之后，read() 函数返回实现用户态切换用户态，这是第 2 次状态切换；

## 写数据过程

- 应用程序要向网卡写数据，调用 write() 函数实现用户态切换内核态，这是第 1 次切换；
- CPU 将用户缓冲区数据拷贝到内核缓冲区，这是第 1 次 CPU 拷贝；
- DMA 控制器将数据从内核缓冲区复制到 [socket 缓冲区](https://www.zhihu.com/search?q=socket%E7%BC%93%E5%86%B2%E5%8C%BA&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)，这是第 1 次 DMA 拷贝；
- 完成拷贝之后，write() 函数返回实现内核态切换用户态，这是第 2 次切换；

## 综上所述

- 读过程涉及 2 次空间切换、1 次 DMA 拷贝、1 次 CPU 拷贝；
- 写过程涉及 2 次空间切换、1 次 DMA 拷贝、1 次 CPU 拷贝；

可见传统模式下，涉及多次空间切换和数据冗余拷贝，效率并不高，接下来就该零拷贝技术出场了。

**【文章福利**】小编推荐自己的 Linux 内核技术交流群:【**[865977150](https://link.zhihu.com/?target=https%3A//jq.qq.com/%3F_wv%3D1027%26k%3DMIwvxPCw)**】整理了一些个人觉得比较好的学习书籍、视频资料共享在群文件里面，有需要的可以自行添加哦！！

![alt](https://pic2.zhimg.com/v2-d82d7a5d2b2bd88088197dad24b326e5_r.jpg)

> **内核学习网站：**

[Linux 内核源码 / 内存调优 / 文件系统 / 进程管理 / 设备驱动 / 网络协议栈 - 学习视频教程 - 腾讯课堂](https://link.zhihu.com/?target=https%3A//ke.qq.com/course/4032547%3FflowToken%3D1040236)

## 3、零拷贝技术

## 3.1 出现原因

可以看到，如果应用程序不对数据做修改，从内核缓冲区到用户缓冲区，再从用户缓冲区到内核缓冲区。两次数据拷贝都需要 CPU 的参与，并且涉及用户态与内核态的多次切换，加重了 CPU 负担。 需要降低冗余数据拷贝、解放 CPU，这也就是零拷贝 Zero-Copy 技术。

## 3.2 解决思路

目前来看，零拷贝技术的几个实现手段包括：mmap+write、sendfile、sendfile+DMA 收集、splice 等。

![alt](https://pic1.zhimg.com/v2-053bd5ece0681b98c9ac1975d9d26738_r.jpg)

## 3.2.1 mmap 方式

mmap 是 Linux 提供的一种[内存映射文件](https://www.zhihu.com/search?q=%E5%86%85%E5%AD%98%E6%98%A0%E5%B0%84%E6%96%87%E4%BB%B6&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)的机制，它实现了将内核中读缓冲区地址与用户空间缓冲区地址进行映射，从而实现内核缓冲区与用户缓冲区的共享。

这样就减少了一次用户态和内核态的 CPU 拷贝，但是在内核空间内仍然有一次 CPU 拷贝。

![alt](https://pic3.zhimg.com/v2-12ccebf90a584314a49ddec744b7f516_r.jpg)

mmap 对大文件传输有一定优势，但是小文件可能出现碎片，并且在多个进程同时操作文件时可能产生引发 coredump 的 signal。

## 3.2.2 sendfile 方式

mmap+write 方式有一定改进，但是由系统调用引起的状态切换并没有减少。

sendfile 系统调用是在 Linux 内核 2.1 版本中被引入，它建立了两个文件之间的传输通道。

sendfile 方式只使用一个函数就可以完成之前的 read+write 和 mmap+write 的功能，这样就少了 2 次状态切换，由于数据不经过用户缓冲区，因此该数据无法被修改。

![alt](https://pic2.zhimg.com/v2-b004cfc8a31e8f2e93fd85631c9109a1_r.jpg)![alt](https://pic4.zhimg.com/v2-bb1412ba2f2c077df6a6776b88f5590f_r.jpg)

从图中可以看到，应用程序只需要调用 [sendfile 函数](https://www.zhihu.com/search?q=sendfile%E5%87%BD%E6%95%B0&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)即可完成，只有 2 次状态切换、1 次 CPU 拷贝、2 次 DMA 拷贝。

但是 sendfile 在内核缓冲区和 socket 缓冲区仍然存在一次 CPU 拷贝，或许这个还可以优化。

## 3.2.3 sendfile+DMA 收集

Linux 2.4 内核对 sendfile 系统调用进行优化，但是需要硬件 DMA 控制器的配合。

升级后的 sendfile 将[内核空间缓冲区](https://www.zhihu.com/search?q=%E5%86%85%E6%A0%B8%E7%A9%BA%E9%97%B4%E7%BC%93%E5%86%B2%E5%8C%BA&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)中对应的数据描述信息（文件描述符、地址偏移量等信息）记录到 socket 缓冲区中。

DMA 控制器根据 socket 缓冲区中的地址和偏移量将数据从内核缓冲区拷贝到网卡中，从而省去了内核空间中仅剩 1 次 CPU 拷贝。

![alt](https://pic4.zhimg.com/v2-c5d1ebde36f60675ca325fd0b3fe3703_r.jpg)

这种方式有 2 次状态切换、0 次 CPU 拷贝、2 次 DMA 拷贝，但是仍然无法对数据进行修改，并且需要硬件层面 DMA 的支持，并且 sendfile 只能将文件数据拷贝到 [socket 描述符](https://www.zhihu.com/search?q=socket%E6%8F%8F%E8%BF%B0%E7%AC%A6&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A442771856%7D)上，有一定的局限性。

## 3.2.4 splice 方式

splice 系统调用是 Linux 在 2.6 版本引入的，其不需要硬件支持，并且不再限定于 socket 上，实现两个普通文件之间的数据零拷贝。

![alt](https://pic1.zhimg.com/v2-463295c02066c22d28ee40ecfb136674_r.jpg)

splice 系统调用可以在内核缓冲区和 socket 缓冲区之间建立管道来传输数据，避免了两者之间的 CPU 拷贝操作。

![alt](https://pic4.zhimg.com/v2-0860c5a643be397d5d129c1dd92eba63_r.jpg)

splice 也有一些局限，它的两个文件描述符参数中有一个必须是管道设备。

![alt](https://pic2.zhimg.com/v2-2f99f178d1f705443847114da1b2e19d_b.jpg)
