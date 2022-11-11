- [参考资料](#参考资料)
- [文件 IO](#文件-io)
  - [文件指针](#文件指针)
- [原子性](#原子性)
- [其他](#其他)

# 参考资料

- [文件打开方式](https://blog.csdn.net/laobai1015/article/details/91957436)

- [Python 文件读写（open()，close()，with open() as f...）](https://www.cnblogs.com/tianyiliang/p/8192703.html)

- [python 中大数据文件读取](https://blog.csdn.net/jane_xing/article/details/120332665)

- [⭐ Processing large files using python](https://www.blopig.com/blog/2016/08/processing-large-files-using-python/)

# 文件 IO

- [Python 文件读写模式 `r,r+,w,w+,a,a+` 的区别](https://www.cnblogs.com/dadong616/p/6824859.html)

  | 模式 | 可做操作 | 若文件不存在 | 是否覆盖   |
  | ---- | -------- | ------------ | ---------- |
  |      |          |              |            |
  | `r`  | 只能读   | 报错         | -          |
  | `r+` | 可读可写 | 报错         | 是         |
  | `w`  | 只能写   | 创建         | 是         |
  | `w+` | 可读可写 | 创建         | 是         |
  | `a`  | 只能写   | 创建         | 否，追加写 |
  | `a+` | 可读可写 | 创建         | 否，追加写 |

- 读取文件

  ```py
  file_path = "/home/huangjinjie/test.txt"
  '''
  1.iasdfasdf
  2.basdfasdfasdf
  '''
  with open(file_path, "r") as fd:
      # 把文件内容全部读入，包括\n，如果文件很大的话就坑了
      # 输出 1.iasdfasdf\nbasdfasdfasdf\n
      file_content = file_path.read()

      # 从文件中读入一行，再次调用时，返回下一行
      # 输出 1.iasdfasdf\n
      # 输出 2.basdfasdfasdf\n
      file_content1 = file_path.readline()
      file_content2 = file_path.readline()

      # 从文件按行读入所有信息，返回一个列表
      # ["1.iasdfasdf\n", "2.basdfasdfasdf\n"]
      file_content = file_path.readlines()

      # 上面的读取操作始终会有 \n，使用字符串函数 splitlines() 可以去掉 \n
      # ["1.iasdfasdf", "basdfasdfasdf"]
      file_content = file_path.read().splitlines()
  # 坑，如果文件里是一行一行的数据，会把最后的 \n 读进来
  ```

- 如何读出文件内容，修改后再写回去

  ```py
  # 好像也没什么好方法，不能用 'w+' 打开
  with open(filename) as f:
    file_str = f.read()

  with open(filename, 'w') as f:
    f.write(file_str)
  ```

## 文件指针

- `fd.tell`

- `fd.seek`

  移动文件的读取指针到指定位置。seek 函数需要使用文件对象进行调用，无返回值。

  ```py
  # 将文件读取指针移动到文件的第 p 个字节处，表示绝对位置。f.seek(0) 移动到文件头位置。
  fd.seek(p, 0) # 或 fd.seek(p)

  # 在当前位置的基础上，将文件读取指针移动 p 个字节，表示相对位置。
  fd.seek(p, 1)

  # 在文件尾的基础上，将文件读取指针移动 p 个字节，表示相对位置。f.seek(0, 2) 移动到文件尾位置。
  fd.seek(p, 2)
  ```

# 原子性

[python 文件原子写入](https://blog.csdn.net/weixin_29775447/article/details/114961064)

```py
from atomicwrites import atomic_write

with atomic_write('userlist1', overwrite=True) as f:
    f.write('xiaohong\n')
```

# 其他
