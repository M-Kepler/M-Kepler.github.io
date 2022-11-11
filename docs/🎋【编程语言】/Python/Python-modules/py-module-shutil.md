- [`shutil`](#shutil)
  - [参考](#参考)
  - [使用记录](#使用记录)
  - [模块学习](#模块学习)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)

## `shutil`

> 模块简介

### 参考

### 使用记录

> 模块使用记录

- `copyfile` 和 `copy`

  ```py
  import shutil
  src = "/var/tmp/aa.txt"
  dst = "/var/tmp/test/bb.txt"
  # src、dst都只能是文件
  # 目标文件必须存在
  # 路径不区分大小写
  shutil.copy(src, dst)  # 文件不存在会报异常

  # 拷贝时如何保证拷贝后的目标文件属性不变
  ```

- 拷贝文件，并保留原文件属性

  ```py
  if not os.path.exists(dst_path):
      # 拷贝的目标文件不存在，并创建一个空文件
      os.makedirs(os.path.dirname(dst_path))
      os.mknod(dst_path)
  # 拷贝的时候保留目标文件原有权限
  shutil.copystat(dst_path, src_path)
  shutil.copy(src_path, dst_path)
  ```

- `copytree` 拷贝文件夹

  ```py
  import shutil
  src = "/home/huangjinjie/dc"
  dst = "/home/huangjinjie/tmp/dc"
  # 把src目录下的文件全部拷贝到dst下
  # 即使目录不存在会自动创建，但是如果 dst 已存在会报错...
  shutil.copytree(src, dst)
  ```

- `rmtree` 删除目录

  ```py
  import shutil
  path = "/root/tmp"  # tmp下面有文件、有文件夹
  # os.remove(r"E:\code\practice\data\1.py")  # 删除文件
  # os.rmdir(r"E:\code\practice\data\2")  # 删除文件夹（只能删除空文件夹）
  # shutil.rmtree(r"E:\code\practice\data\2")  # 删除文件夹

  # 相当于 rm -rf /root/tmp  把整个tmp删掉
  shutil.rmtree(path)
  ```

- 删除目录下全部内容

  ```py
  # 和 rmtree 不一样，如果传入 /root/tmp 期望删除tmp下的文件，但仍保留tmp
  ```

- 判断 A 是否是 B 的子目录

### 模块学习

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方
