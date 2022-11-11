- [批量转换文件编码为 UTF8](#批量转换文件编码为-utf8)
- [创建并进入目录](#创建并进入目录)
- [快速备份一个文件](#快速备份一个文件)
- [批量修改文件名](#批量修改文件名)
- [日志](#日志)
- [`split` 切割字符串](#split-切割字符串)
- [大小写转换](#大小写转换)
- [命令行参数解析](#命令行参数解析)
- [比较版本号](#比较版本号)
- [判断是否为空文件](#判断是否为空文件)

### 批量转换文件编码为 UTF8

http://www.wjhsh.net/shanyu20-p-14188194.html

### 创建并进入目录

```sh
mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

### 快速备份一个文件

```sh
cp file_name{,.bak}

go get -u github.com/golang/protobuf/{proto,protoc-gen-go}

```

### 批量修改文件名

[批量修改文件名](https://blog.csdn.net/zhuhai__yizhi/article/details/76619233)

```sh
# stu_102999_4_delete.jpg 去除 _delete
for file in `ls *.jpg`; do mv $file `echo $file|sed 's/_delete//g'`; done;
```

### 日志

```sh
INFO_LOG_FILE=/path/to/info.log
LOG_FILE_MAXSIZE=10000000
function  filesize()
{
    ls -alt ${1} | grep -v ^d | awk '{if ($9) printf("%s",$5)}'
}

# 只保留三个日志文件，每个文件最大LOG_FILE_MAXSIZE
function log_info()
{
    if [ -f ${INFO_LOG_FILE} ]; then
        fsize=$(filesize ${INFO_LOG_FILE})
        if [[ ${fsize} -gt ${LOG_FILE_MAXSIZE} ]]; then
            if [ -f ${INFO_LOG_FILE}".bk1" ]; then
                \mv ${INFO_LOG_FILE}".bk1" ${INFO_LOG_FILE}".bk2"
            fi
            \mv ${INFO_LOG_FILE} ${INFO_LOG_FILE}".bk1"
        fi
    fi
    # 输出到终端的同时输出到文件
    echo "["$(date)"] ["$$"] " ${@} | tee -a ${INFO_LOG_FILE}
}

log_info "test"
```

### `split` 切割字符串

[`split` 切割字符串](https://my.oschina.net/lenglingx/blog/602159)

```sh
# 方式一 awk -F
str="aaa,bbb,ccc,ddd"
echo ${str} | awk -F , '{print $1}'  # 输出 aaa

# 方式一 cut -d
echo ${str} | cut -d "," -f2  # 输出 bbb

# 推荐方式三
arr=(${str//,/ })  # 注意这里一定要有个空格
echo ${arr[0]}  # 输出 aaa
echo ${arr[2]}  # 输出 ccc
```

### 大小写转换

```sh
cat bbc_pub.key | tr 'a-z' 'A-Z'
```

### 命令行参数解析

```bash
arg_update_src=0
usage ()
{
# help_txt=`cat <<- HELP
#     -u, --update    update source from git, default is ${CNOTICE2}$arg_update_src${C0}.
# HELP`
#     ECHO ${CE}"$help_txt";
}
param_parse()
{

}
```

### 比较版本号

```sh
#!/bin/bash

VERSION=$1
VERSION2=$2

function version_gt()
{
    test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1";
}

function version_le()
{
    test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" == "$1";
}

function version_lt()
{
    test "$(echo "$@" | tr " " "\n" | sort -rV | head -n 1)" != "$1";
}

function version_ge()
{
    test "$(echo "$@" | tr " " "\n" | sort -rV | head -n 1)" == "$1";
}

if version_gt $VERSION $VERSION2; then
   echo "$VERSION is greater than $VERSION2"
fi

if version_le $VERSION $VERSION2; then
   echo "$VERSION is less than or equal to $VERSION2"
fi

if version_lt $VERSION $VERSION2; then
   echo "$VERSION is less than $VERSION2"
fi

if version_ge $VERSION $VERSION2; then
   echo "$VERSION is greater than or equal to $VERSION2"
fi
```

### 判断是否为空文件

https://blog.csdn.net/haixin1109/article/details/21632025

```sh
# 去除多余空行
grep -v '^\s*$' $file_path > newfile

# 如果文件存在且为空,-s 代表存在不为空,! 将他取反
if [[ ! -s ./newfile ]]; then
  echo "not empty"
fi

```
