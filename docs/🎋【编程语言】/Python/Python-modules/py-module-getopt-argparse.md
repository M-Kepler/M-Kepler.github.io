- [参考资料](#参考资料)
- [`argparse 和 getopt`](#argparse-和-getopt)
  - [getopt](#getopt)
  - [argparse](#argparse)
- [其他](#其他)

## 参考资料

## `argparse 和 getopt`

> 命令行参数解析，感觉 `argparse` 更好一点，更 oop

### getopt

- [getopt](https://blog.csdn.net/qq_34765864/article/details/81368754)

  ```py
  def usage(code, msg=''):
    # 输出重定向
    print >> sys.stderr, __doc__
    if msg:
      print >> sys.stderr, msg
    sys.exit(code)

  def main():
    try:
      # 第一个参数：sys.argv[1:] 取sys.argv[0]文件名后的所有参数
      # 第二个参数：如果该命令行参数需要指定一个参数值，则需要在后面加个冒号，如下面的 -o为参数 xxx为参数值:，使用方法python test.py -o xxx
      # 第三个参数：长参数 使用方法：python test.py --ouput_file=xxx
      # python test.py -o output.py -a xxxxx yyyyy
      # 返回值： opts：列表，元素是选项和值组成的tupler [('-o', 'output.py'), ('-a', '')]
      #         args：列表，存放其他参数 ['xxxxx', 'yyyyy']
      #         o后面加冒号，表示该参数需要接收一个入参
      opts, args = getopt.getopt(sys.argv[1:], 'aho:V', ['help', 'version', 'ouput-file='])
    except Exception as ex: #getopt.error, msg:
      usage(1, ex.msg)

    output_file = None

    # parse args
    for opt, arg in opts:
      if opt in ('-h', '--help'):
        usage()
      elif opt in ('o', '--ouput-file'):
        # 取 -o或--output_file=后面的参数
        output_file = args
    # 最后的输入参数
    if not args:
      print >> sys.stderr, 'No input file given'
      return
    for filename in args:
      do_something(filename, outputfile)

  if __name__ == '__main__':
      main()
  # python test_getopt.py -o /home/kepler/test.mo ui.po
  # python test_getopt.py --output-file=/home/kepler/test.mo ui.po
  ```

### argparse

- [argparse](https://blog.csdn.net/lanzheng_1113/article/details/77574446)

  > https://blog.51cto.com/steed/2051192

  ```py
  # argparse 自带 - h 参数解析
  import argparse
  if __name__ == "__main__":
    # 记录化
    parser = argparse.ArgumentParser(description="show example")

    # 添加操作参数
    # action=store_true 意思是如果使用了这个参数则值默认为TRUE

    # -a 是短参数 --aaaaa 是长参数
    # parser.add_argument("-a", "--aaaaa", help="help of param_a")
    # parser.add_argument("-b", "--aaaaa", help="help of param_b", action="store_true")

    # 用字典来组织参数值，优化代码结构
    kwargs_opts = {
      "aaaaa" : (
        "-a",       # short arg
        "--aaaaa",  # long arg
        dict(
          default="default values",  # 默认值
          type=str,  # 类型
          help="help..............",  # 帮助信息
          choices=[1, 2, 3],  # 候选参数
          required=True  # 必选参数
        )
      ),
      "bbbbb": (
        "-b",
        "--bbbbb",
        dict(
          default="default values",
          type=str,
          help="help.............."
        )
      )
    }
    for arg in kwargs:
      if arg in kwargs_opts:
        args = kwargs_opts[arg]
        args, kw = args[0: -1], args[-1]
        parser.add_argument(*args, **kw)

    # 添加一组互斥的选项，如下例中的 -l 和 -r 只能用一个
    exptypegroup = parser.add_mutually_exclusive_group()
    exptypegroup.add_argument("-r", "--remote", help="remote mode", action="store_true")
    exptypegroup.add_argument("-l", "--local", help="local mode", action="store_true")
    ARGS = parser.parse_args()
    if ARGS.param_a:
        print(u"设置了param_a值为：" + ARGS.param_a)
    if ARGS.param_b:
        print(u"设置了param_b值为：" + str(ARGS.param_b))
  ```

## 其他
