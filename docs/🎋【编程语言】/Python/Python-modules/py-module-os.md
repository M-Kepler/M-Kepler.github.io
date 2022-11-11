- [`os`](#os)
  - [目录操作](#目录操作)
  - [`os.path`](#ospath)
  - [其他](#其他)
  - [坑](#坑)
  - [其他](#其他-1)

## `os`

> [Python OS 文件/目录方法](https://www.runoob.com/python/os-file-methods.html)

- `os.environ`  
  输出系统环境变量，结果是一个 dict `os.environ.get('LD_LIBRARY_PATH')`

### 目录操作

```py
import os
os.getcwd() # get current workspace directory 相当于 pwd 命令

os.chdir('/etc/systemd') # change directory 相当于 cd，如果路径不存在会报错

os.curdir # current directory，当前目录，相当于 .

os.pardir # parent directory，父目录，相当于 ..

os.mkdir('dirname') # 创建一个文件夹

os.removedirs('dir1/dir2')  # 递归删除目录。像rmdir(), 如果子文件夹成功删除, removedirs()才尝试它们的父文件夹

os.makedirs('dir1/dir2') # 创建多级目录，相当于 mkdir -p dir1/dir2

os.rmdir('dirname') # 删除一个空目录

os.remove() # 删除一个文件

os.listdir('dir1') # 列出dir1目录下的所有文件和子目录组成的列表，包含隐藏目录

os.rename('oldname', 'newname') # 重命名

os.stat('dir1') # 获取文件或目录信息，就像C语言的state

os.sep # 输出当前操作系统特定的路径分隔符，win是 \\ linux是 /

os.linesep # 当前操作系统的行终止符，win是 \t\n linux是 \n

os.name # 系统平台

os.system('cmd') # 运行shell命令，直接显示
```

- 相对路径

- `os.walk(top, topdown=True, οnerrοr=None, followlinks=False)`

  用来遍历一个目录内各个子目录和子文件， 返回三个值：`parent,dirnames,filenames`，分别表示`path的路径`、`path路径下的文件夹的名字`和`path路径下文件夹以外的其他文件`

- 给文件增加可执行权限

  ```py
  import os, stat
  files = [name for name in os.listdir(os.path.abspath(".")) if name.endswith(('.sh', '.py'))]
  for f in files:
      os.stat('file').st_mode  # 获取文件权限
      stat.S_IXUSR  # 对拥有者执行的权限
      os.chmod(f, os.stat(f).st_mode | stat.S_IXUSR)  # 给文件增加可执行权限
  ```

### `os.path`

- [菜鸟教程](https://www.runoob.com/python/python-os-path.html)

```py
import os

os.path.abspath('path')  # 返回path的绝对路径

os.path.dirname('path')  # 返回文件所在目录

os.path.basename('path')  # 返回文件名（从末尾到倒数第一个 / 之间的字符串）

os.path.join()  # 常用来链接路径

os.path.join('/usr', '/lib') # 返回/lib，使用这个方法不是拼接字符串，直接从参数为名称就行了

os.path.join('/usr', 'lib') # 返回/usr/lib

os.path.split(path)  # 把path分为目录和文件两个部分，以列表返回

os.path.exists()     # 就是判断括号里的文件是否存在的意思，括号内的可以是文件路径

os.path.sep  # 一个常量，路径分隔符 linux下就用这个了’/’

os.path.altsep  # 根目录

os.path.curdir # 当前目录

os.path.pardir  # 父目录

```

- 获取文件夹下全部的文件，包括子目录内的，输出所有文件的路径

  ```py
  def _get_video_folders(self, root_path):
    ''' 如果当前目录下所有包含 entry.json 文件的目录，即视频信息所在目录
    '''
    video_folders = list()
    for root, dirs, files in os.walk(root_path):
        if self.config.entry_file in files:
            # 如果当前目录下所有包含 entry.json 文件的目录(包括子目录)
            video_folders.append(root)
    return video_folders
  ```

- 获取文件后缀

  ```py
  import os

  def cutom_basename(fullname):
      return os.path.basename(
          os.path.splitext(fullname)[0]
      )

  a = "/var/local/txt/232.txt"
  print(custombasename(a))
  >>> 232

  print(os.path.splitext(a))
  >>> ("/var/label/txt/232", ".txt")

  print(os.path.basename(os.path.splitext(a)[0]))  # 取1个path的最后名称
  >>> 232

  # 同理，先取最后文件名，再得到无后缀名称
  print(os.path.basename(a))
  >>> 232.txt

  print(os.path.splitext(os.path.basename(a))[0])
  >>> 232
  ```

- 获取指定后缀的文件

  ```py
  path = "/tmp/"
  for root, dirs, files in os.walk(path):
      for file in files:
          file_name, file_ext = os.path.split(file)
          if file_ext == ".out":
              do_something(file)
  ```

- 删除某个目录下的一个`子文件夹`所在目录

  ```py
  sub_dir_name = "test"
  """
  /root/
      test_dir1/
          test_dir2/
              test/  # 把这个文件夹所在父目录 test_dir2 删掉
                  test_dir3
  """
  for root, _, _ in os.walk(path):
      if root.endswith(sub_dir_name):
          shutil.rmtree(os.path.dirname(root))
          break
  ```

### 其他

### 坑

- `os.path.join(parent, curr)`

  `curr` 首个字符不能是 `/`，否则就直接返回 `curr` 了；`parent` 末尾有没有 `/` 都不影响

- [`os.sep`](https://blog.csdn.net/LittleStudent12/article/details/81020633) `windows` 和 `linux` 路径的坑

### 其他

- 获取 cpu 个数

  ```py
  from multiprocessing import cpu_count
  print(cpu_count())

  import psutil
  print(psutil.cpu_count())
  ```

- 获取进程 ID

  ```py
  os.getpid()
  ```
