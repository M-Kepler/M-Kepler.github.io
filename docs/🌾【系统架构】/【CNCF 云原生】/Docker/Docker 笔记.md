- [参考资料](#参考资料)
- [`Docker`](#docker)
  - [概念](#概念)
  - [配置文件](#配置文件)
  - [基本操作](#基本操作)
  - [命令选项](#命令选项)
  - [查看信息](#查看信息)
  - [容器管理 `docker exec`](#容器管理-docker-exec)
    - [资源配置](#资源配置)
    - [操作命令](#操作命令)
  - [镜像管理](#镜像管理)
    - [操作命令](#操作命令-1)
    - [`dockerfile`](#dockerfile)
    - [`docker build`](#docker-build)
  - [网络管理](#网络管理)
    - [查看](#查看)
    - [配置](#配置)
    - [DNS 解析过程](#dns-解析过程)
    - [docker0 模式](#docker0-模式)
    - [macvlan 模式](#macvlan-模式)
    - [host 模式](#host-模式)
    - [container 模式](#container-模式)
    - [none 模式](#none-模式)
    - [pipework](#pipework)
  - [数据卷 volume](#数据卷-volume)
- [原理](#原理)
  - [docker 的发展历史](#docker-的发展历史)
  - [命名空间 Namespaces](#命名空间-namespaces)
  - [控制组 ControlGroups](#控制组-controlgroups)
  - [联合文件系统 UnionFS](#联合文件系统-unionfs)
- [容器仓库 Registry](#容器仓库-registry)
  - [harbor](#harbor)
  - [dockerhub](#dockerhub)
- [学习过程中的疑问](#学习过程中的疑问)
- [排障指南](#排障指南)
- [其他](#其他)

# 参考资料

[Docker 入门](https://blog.csdn.net/LUCKWXF/article/details/99243847)

[wsl 中安装 docker](https://www.jianshu.com/p/8ba9a1a17673)

[简单理解 Docker](https://blog.csdn.net/u010129119/article/details/81262973)

[三个技巧，减小 docker 镜像的体积](https://blog.csdn.net/bbwangj/article/details/82178774)

[不要在生产环境中使用 alpine 基础镜像](https://ttys3.dev/post/do-not-use-alpine-in-production-environment/)

[play_with_docker 在线玩 docker 的一个实验室](https://labs.play-with-docker.com/)

[★ Docker 入门与实践](https://yeasy.gitbook.io/docker_practice/)

# `Docker`

![alt](https://baiyp.ren/images/docker/docker01.png)

## 概念

![alt](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWcyMDE4LmNuYmxvZ3MuY29tL2Jsb2cvMTEwMDMzOC8yMDE4MTAvMTEwMDMzOC0yMDE4MTAxMjIxNDEwMzYwOC05Njk3MDY5NDUucG5n)

![alt](https://mmbiz.qpic.cn/mmbiz_png/0cahata6G4fHcB3picOofJZ4zDeLKN9icN1DHH9aLHUGWe0w9UsXgNMZX0XicoExdgxaLHWrYZu0lo1vx4ku40WVg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

- **镜像**

  `镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层`。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉

- **容器**

  - 传统虚拟机如 VMware，VisualBox 之类的需要模拟整台机器包括硬件，每台虚拟机都需要有自己的操作系统，虚拟机一旦被开启，预分配给它的资源将全部被占用。每一台虚拟机包括应用，必要的二进制和库，以及一个完整的用户操作系统。

  - 容器技术是和宿主机共享硬件资源及操作系统，实现资源的动态分配。`容器包含应用和其所有的依赖，但是与其他容器共享内核`。容器在宿主机操作系统中，在用户空间以分离的进程运行。

  - 与虚拟机相比， docker 隔离性更弱， docker 属于进程之间的隔离，虚拟机可实现系统级别隔离

- **安全性**

  docker 的安全性也更弱。**Docker 的租户 root 和宿主机 root 等同**，一旦容器内的用户从普通用户权限提升为 root 权限，它就直接具备了宿主机的 root 权限，进而可进行无限制的操作

- `namespace`

  就像 cpp 中的名字空间，实现资源隔离

- `control Group`

  cgroup 实现资源限制

- 基本概念

  - `Docker`

    属于 Linux 容器的一种封装，提供简单易用的容器使用接口。它是目前最流行的 Linux 容器解决方案

  - `image` 镜像

    镜像可以看作是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。就是一个把环境变量、上下文等等都打包好的文件空间

  - `container` 容器

  - `repository` 仓库

    镜像仓库是用来集中存放镜像文件的地方类似于 Git

- Docker 采用的是 Client/Server 架构。客户端向服务器发送请求，服务器负责构建、运行和分发容器。客户端和服务器可以运行在同一个 Host 上，客户端也可以通过 socket 或 REST API 与远程的服务器通信

## 配置文件

- `/etc/docker/daemon.json`

  配置服务监听端口

  ```json
  { "hosts": ["tcp://0.0.0.0:2376", "unix:///var/run/docker.sock"] }
  ```

- 运行时数据根目录

  ```sh
  # vi /etc/sysconfig/docker-storage
  DOCKER_STORAGE_OPTIONS="--graph=/sf/scloud/data/docker"

  # 默认情况下是在 /var/lib/docker
  # 修改后运行 docker images会发现原来的镜像不见了，
  # 此时要把默认路径下的文件拷贝到新路径下
  cp -r /var/lib/docker /sf/scloud/data/docker/
  ```

- [查看镜像 / 容器的元数据](https://www.cnblogs.com/boshen-hzb/p/6376674.html)

  ```sh
  $docker inspect [container_id/image_id]

  # 返回的是一个json串
  # 可以通过 `-f 或 --format` 参数输出指定的值

  $docker inspect -f {{.Created}} [image_id]
  # 这里的{{}}就像flask里的jinja模板一样
  # . 表示上下文，即整个元数据结构
  ```

- 查看容器持久化目录

  ```sh
  docker inspect -f '{{.HostConfig.Binds}}' [container_id]
  ```

## 基本操作

- 拉取镜像

  ```sh
  # 将名为 hello-world 的 image 文件从仓库抓取到本地
  docker pull library/hello-world
  ```

- 运行镜像

  ```sh

  # docker run redis:latest --name test 时，跟在镜像名后面的参数 --name test 被当成是 ENTRYPOINT 的参数了，最好放在前面 docker run --name test redis:latest

  docker run --name hjj_test hello-world
  # bad: docker run hello-world --name test
  ```

- 退出就销毁容器

  ```sh
  # --rm 容器退出后随之将其删除
  docker run -it --rm ubuntu:14.04 bash
  ```

- 容器导出成镜像

  ```sh
  docker export docker_name -o image_name.tar
  ```

- [import 导入镜像](https://www.cnblogs.com/lijinze-tsinghua/p/9847539.html)

  ```sh
  # 单纯一个 tar 文件，使用这种方式导入，横杠不能少
  cat mysql5.7.19.tar | docker import - my_mysql5.7.19:v0.1
  ```

- 制作镜像

  ```sh
  tar -cvpf /root/BBC2.5.0.tar --directory=/ \
  --exclude=boot/firmware \
  --exclude=proc \
  --exclude=sys \
  --exclude=dev \
  --exclude=run /
  ```

## 命令选项

[Docker 命令详解](https://www.cnblogs.com/yfalcon/p/9044246.html)，这些命令在 Dockerfile 中都有对应的

- `-d / --detach="xx"` 后台运行

- `-u / --user="xx"` 指定容器的用户

- `-it` 就是 `--interactive --tty` 交互式终端

  ```sh
  # –detach       -d  在后台运行容器，并且打印容器 id。
  # –interactive  -i  即使没有连接，也要保持标准输入保持打开状态，一般与 -t 连用。
  # –tty          -t  分配一个伪 tty，一般与 -i 连用。
  ```

- `--privileged=false` 指定容器是否为特权容器

  不是用特权模式前，容器内的 root 只是普通用户权限，用了特权模式后，拥有和宿主机一样的 root 权限

- `--cap-add` 设置容器权限白名单

  https://www.kancloud.cn/zatko/docker/229146

- `--entrypoint=""` image 的入口

- `--env-file=[]` 指定环境变量文件

- `--expost=[]` 指定容器暴露的端口

- `-w` 指定进入容器后的目录

## 查看信息

- 查看镜像

  ```sh
  docker images
  ```

- 查看容器

  ```sh
  docker ps

  # 查看所有容器包括未运行的
  docker ps -a

  # 上面的命令都会对输出的字段做截取，导致看不清具体的命令
  # docker查看容器完整command的命令
  docker ps -a --no-trunc
  ```

- 查看容器标准输出

  ```sh
  # 查看日志路径
  docker inspect --format '{{.LogPath}}' [container_id]

  docker logs [container_id]

  # 像 tail -f 那样跟踪日志输出
  docker logs -f [container_id]

  # 查看容器 mynginx 从 2016 年 7 月 1 日后的最新 10 条日志
  docker logs --since="2016-07-01" --tail=10 [container_id]
  ```

## 容器管理 `docker exec`

### 资源配置

### 操作命令

- [在容器内查看容器的 id](https://blog.csdn.net/qq_32828933/article/details/106869050)

  ```sh
  # 容器内执行：
  head -1 /proc/self/cgroup | cut -d/ -f3 | cut -c1-12
  ```

- 容器改名

  ```sh
  docker rename [old_name] [new_name]
  ```

- 创建容器

  ```sh
  # docker run -itd [image_id] cmd cmd_arg1 cmd_arg2

  docker run [image_id] /usr/local/openresty/bin/openresty -g "daemon off;"
  ```

- 进入容器

  ```sh
  # 查看运行中的容器
  docker ps

  # exec 是在容器中打开新的终端，并且可以启动新的进程
  docker exec -it [container_name/container_id] /bin/bash

  # attach 直接进入容器启动命令的终端，不会启动新的进程
  docker attach [container_name/container_id]
  ```

- 删除容器

  ```sh
  docker rm [container_name/container_id]

  # 强制 kill 掉且 rm 容器
  docker rm -f [container_name/container_id]
  ```

- 批量删除

  ```sh
  # 删除所有容器
  docker rm $(docker ps -a -q)

  # 删除所有镜像
  docker rmi $(docker ps -a -q)

  # 按名称等条件删除
  docker rm $(docker ps -a -q | grep xxx)

  # 根据镜像 ID 删除容器
  ```

- 在容器中运行命令

  ```sh
  docker exec -it docker_name /bin/bash
  ```

- 容器与主机间拷贝复制文件

  ```sh
  # 跟scp一样
  宿主机 --> 容器
  docker cp /local/file_name docker_name:/path/in/docker

  容器 --> 宿主机
  docker cp docker_name:/path/in/docker /local/file_name
  ```

- 保存对容器的修改

  [docker commit 详解](https://blog.csdn.net/weixin_41790086/article/details/102932185)

  ```sh
  # -m='A new image' 添加备注信息
  # --author='Aomine' 添加作者

  # docker commit [选项] [容器ID或容器名] [<仓库名>[:<标签>]]
  docker commit [container_id] [img_name]:[img_tag]

  docker commit \
    --author "huangjinjie@test.com" \
    --message "commit message"
    [container_id] \
    [image_reposity]:[image_tag]
  ```

- 启动停止重启

  ```sh
  # docker ps -a 会显示一些已停止的容器
  docker start xxx
  ```

## 镜像管理

### 操作命令

- 下载镜像到本地，然后在其他机器导入

  [docker load 和 docker import 的区别](https://blog.csdn.net/xiaoshunzi111/article/details/107811568)

  - 需要配对使用，docker save 就应该用 docker load

  - save 和 load 的针对的点是镜像， 将本机的镜像导入、 导出为镜像包。

  - export 和 import 的针对点是容器，将本机的容器导出为镜像包。

  - 文件大小不同：dockers export 保存的镜像的体积小于 docker save

  - 保存的内容不同：docker save 保持的是镜像当时的状态，而 docker export 是根据容器拿到镜像，保存的是保存容器当时的快照状态，再导入时会丢失镜像所有的历史记录和元数据信息，所以无法进行回滚

  - 自定义镜像名称：docker impprt 可以，docker load 不能对载入的镜像重命名。

  - 配置启动命令：docker import 未保存镜像默认的启动命令，docker load 保存了

  - 应用场景：docker save 一般情况下，使用的场景是项目迁移（编排多个镜像组合时，客户端服务器不能连接外网），docker export 一般情况下是作为基础镜像(简单安装软件配置供后续使用)

  ```sh
  # 保存到本地
  # 999c20aee5da 为镜像 ID
  docker save 999c20aee5da > /path/to/save/image.tar

  # 将镜像 runoob/ubuntu:v3 生成 test.tar
  # docker save -o test.tar runoob/ubuntu:v3
  # docker save -o [output_name].tar [repository]:[tag]

  # 拷贝到目标机器
  # 加载镜像到 docker
  docker load < /path/to/your/image.tar
  # 或者 docker load -i image_name.tar

  # load 之后 repository 和 tag都为 [none]，可以改一下
  docker tag [image_id] [name]:[版本]
  ```

- 查找镜像

  ```sh
  # 查看带有g++或者gcc的镜像
  docker search g++
  # 搜索官方提供的镜像
  docker search -f is-official=true [image_name]
  ```

- 查看镜像提交记录

  ```sh
  docker history [image_id]
  ```

- 查看镜像

  ```sh
  docker images
  ```

- 删除镜像

  ```sh
  # 停止所有的容器
  docker stop $(docker ps -a -q)

  # 删除容器之后再删除镜像
  docker rmi [image_name]
  ```

- 环境变量

  ```sh
  --env "NAME=huangjinjie"
  ```

- [重命名](https://www.yisu.com/zixun/320715.html)

  ```sh
  # 重命名
  docker tag [image_id] [repository]:[tag]

  # 删除原镜像
  docker rmi sword2000/unbuntu1604-arm-qt:1.0
  ```

### `dockerfile`

[`dockerfile` 详解](https://www.cnblogs.com/edisonchou/p/dockerfile_inside_introduction.html)

![alt](https://img2018.cnblogs.com/blog/381412/201908/381412-20190811220705871-2130672519.png)

dockerfile 中的命令是不知道命令上文的，你不能把一条命令拆成两条来执行，每条 RUN 命令都是一层容器，相当于 `RUN = docker run & docker commit`。[Docker : RUN cd ... does not work as expected](https://stackoverflow.com/questions/17891981/docker-run-cd-does-not-work-as-expected)

```dockerfile
################################
# 基础镜像信息
################################

# 使用 ubuntu16.04 作为基础镜像
FROM codenvy/cpp_gcc

# Set multiple labels at once, using line-continuation characters to break long lines
LABEL vendor=ACME\ Incorporated \
      com.example.is-beta= \
      com.example.is-production="" \
      com.example.version="0.0.1-beta" \
      com.example.release-date="2015-02-12"

################################
# 维护者信息
################################

# 维护人员信息
MAINTAINER kepler "kepler@fox_mail.com"

################################
# 容器操作指令
################################

# 构建镜像时指定参数
# docker build 构建镜像的时候，可以通过 --build-arg 传入参数
# 传入 BUILD_DIR 时要传入相对目录， basename .build.image （假设要打包的文件都放在了 .build.image）
ARG ARG1 ARG2 BUILD_DIR

# 定义一些变量，可以在 dockerfile 中是用，注意：等号左右不能有空格
ARG NAME=huangjinjie

# 设置环境内环境变量
# 后面可以通过docker run -e USERNAME="XXXXXX"修改
# 这个环境变量在容器里也可以 $USERNAME 获取
ENV USERNAME admin
ENV LD_LIBRARY_PATH=xxx
ENV ARG1=$ARG1
ENV ARG2=$ARG2

# 指定创建容器时候默认的工作目录，即进入容器后的目录
WORKDIR /home/huangjinjie/hello_world

# 为 RUN CMD ENTRYPOINT 执行命令时，指定的运行用户
USER huangjinjie

# 容器健康检查
HEALTHCHECK --interval=5m --timeout=3s --retries=3 \
  CMD curl -f http:/localhost/ || exit 1

#  --interval=DURATION (default: 30s)：每隔多长时间探测一次，默认 30 秒
#  -- timeout= DURATION (default: 30s)：服务响应超时时长，默认 30 秒
#  --start-period= DURATION (default: 0s)：服务启动多久后开始探测，默认 0 秒
#  --retries=N (default: 3)：认为检测失败几次为宕机，默认 3 次

# 一些返回值的说明：
#
# 0: 容器成功是健康的，随时可以使用
# 1: 不健康的容器无法正常工作
# 2: 保留，不使用此退出代码

# 目录挂载：指定容器挂载点到宿主机自动生成的目录，可以通过 docker inspect 查看挂载到数组机哪个路径下了
# 一般不会在 Dockerfile 中用到，更常见的还是在 docker run 的时候指定 -v 数据卷。
VOLUME ["/var/lib/test"]

# 开放 80 端口
# 这个配置只是开放容器内的端口出来，但是你想 telnet 宿主机的这个端口还是不通的
# 除非修改网络为 host 模式，占用宿主机的 80 端口
# https://www.helloworld.net/p/2642902034
EXPOSE 80 443 5000

# 镜像构建时需要运行的命令
RUN mkdir /home/root/hello_world

# 拷贝文件或目录到镜像
COPY .build.image/depedences /path/in/docker

# 将宿主机下的文件拷贝到金贤重
# 和 COPY 命令区别是ADD功能更强大，如果是 URL 或压缩包，会自行下载或解压
ADD $BUILD_DIR/hello_world.cpp /home/root/hello_world/

# 运行命令
RUN g++ hello_world.cpp -o hello

################################
# 容器启动命令
################################

# 容器创建完成后运行的第一个命令
# 容器启动时执行的命令或脚本
CMD ["./hello"]

# exec 格式：CMD ["可执行文件", "参数1", "参数2"...]
# CMD ["/usr/sbin/sshd", "-D"]

# 参数列表格式：CMD ["参数1", "参数2"...]。在指定了 ENTRYPOINT 指令后，CMD 变为 ENTRYPOINT 的参数
# CMD ["-C", "/start.sh"]

# shell 格式：CMD <命令>
# CMD /usr/sbin/sshd -D

# [CMD 和 ENTRYPOINT 的区别](https://blog.csdn.net/taiyangdao/article/details/73214449)

  # 由 ENTRYPOINT 启动的程序不会被 docker run 时命令行指定的参数所覆盖
  # 而且，这些命令行参数会被当作参数传递给 ENTRYPOINT 指定的程序

  # 当指定了 ENTRYPOINT 后，CMD 的含义就发生了改变，不再是直接的运行其命令，而是将 CMD 的内容作为参数传给 ENTRYPOINT 指令

# 可以写多个，但是仅最后一个 ENTRYPOINT 会生效。
ENTRYPOINT ["/bin/bash", "-C", "/start.sh"]
ENTRYPOINT /bin/bash -C '/start.sh'
```

### `docker build`

- `docker build` 的缓存机制

- `-f` 指定 `dockerfile` 创建镜像

  ```sh
  # 根据dockerfile把当前目录下的文件构建镜像，标签为 hello_docker:v1.0
  docker build -f ./hello_dockerfile . -t hello_docker:v1.0
  ```

- 添加说明

  ```sh

  ```

- `--build-arg` 向 `dockerfile` 传递参数

  ```sh
  docker build --build-arg ARG1=huangjinjie [this_ockerfile] .
  ```

- 输出构建进度

  ```sh
  # 设置环境变量
  export DOCKER_BUILDKIT=1
  ```

- `.dockerignore`

  | 规则              | 行为                                                       |
  | :---------------- | :--------------------------------------------------------- |
  | `*/temp*`         | 匹配根路径下一级目录下所有以 temp 开头的文件或目录         |
  | `*/*/temp*`       | 匹配根路径下两级目录下所有以 temp 开头的文件或目录         |
  | `temp?`           | 匹配根路径下以 temp 开头，任意一个字符结尾的文件或目录     |
  | `**/*.go`         | 匹配所有路径下以 .go 结尾的文件或目录，即递归搜索所有路径  |
  | `*.md !README.md` | 匹配根路径下所有以 .md 结尾的文件或目录，但 README.md 除外 |

## 网络管理

[Docker 网络和容器的通信](https://www.cnblogs.com/whych/p/9595671.html)

[docker 容器网络通信原理分析](https://www.cnblogs.com/ilinuxer/p/6680205.html)

### 查看

- 查看 docker 网络

  ```sh
  docker network ls
  # NETWORK ID     NAME      DRIVER    SCOPE
  # 2485462adc19   bridge    bridge    local
  # c64f3041599f   host      host      local
  # bf3f38227072   none      null      local

  # 查看网络配置详情
  docker inspect network [network_id/network_name]

  # 删除一个网络
  docker network rm [network_id/network_name]

  # 查看 容器 IP
  docker inspect -f {{.NetworkSettings.Networks.bridge.IPAddress}} [container_id]
  ```

- 端口映射 `-p`

  ```sh
  docker run -p 80:8080 -i -t uettydkr/test:1.0
  # 容器的 8080 端口映射到宿主机的 80 端口，访问本机 80 端口，流量会转发到 8080 端口
  # 如果不做映射，也可以直接通过 [docker_ip]:[docker_server_port] 来访问，就是直接访问容器内的指定端口
  ```

- 查看端口映射

  ```sh
  docker port [dokcer_id]
  # 查看端口映射情况
  ```

### 配置

- 自定义一个网络

  ```sh
  docker network create huangjinjie-test --driver bridge
  ```

- 指定以哪种网络模式启动容器

  ```sh
  docker run -itd --network=my_macvlan [image_name/image_id] bash

  ```

### DNS 解析过程

Docker daemon 内置的 DNS 服务器 127.0.0.11

https://blog.csdn.net/u013915286/article/details/118973670

### docker0 模式

网桥模式（和交换机一个意思），默认的网络模式

当 docker 进程启动时，主机上会创建一个名为 `docker0` 的虚拟网桥，通过 `ifconfig` 可以看到；容器内部会创建一个只能容器内部看到的接口`eth0`，`eth0` 和 `docker0` 工作方式就像物理二层交换机一样，可以互相通信

![alt](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/5/20/16ad4794b38e90e4~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

- 查看网桥信息

  ```sh
  $ifconfig docker0
  # 可以看到 docker0 网桥的地址
  docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255

  # 查看网桥信息
  $brctl show
  bridge name     bridge id               STP enabled     interfaces
  br-746a82797f78         8000.0242e2c0c0bc       no
  docker0         8000.0242c00deda6       no

  $docker network inspect bridge
  [
      {
          "Name": "bridge",
          "Id": "2485462adc19896ea88d30aedc7adb89cc34a066f60c15917ecb1cada9b532a2",
          "Created": "2022-06-12T11:17:19.0423254+08:00",
          "Scope": "local",
          "Driver": "bridge",
          "EnableIPv6": false,
          "IPAM": {
              "Driver": "default",
              "Options": null,
              "Config": [
                  {
                      # 容器所在网段
                      "Subnet": "172.17.0.0/16",
                      # 网关
                      "Gateway": "172.17.0.1"
                  }
              ]
          },
          ...
  ```

- 如果想从外界访问，创建容器时需要 `-p 把容器内部端口映射出来`，然后访问宿主机的 IP 和端口，把流量转发到容器内

  - 会占用宿主机的端口

  - 外网需要访问进来需要进行需要做 `NAT`

### macvlan 模式

[macvlan 一种虚拟网卡解决方案](https://www.jianshu.com/p/2b8b6c738bf6)

[Docker 网络模型之 macvlan 详解，图解，实验完整](https://www.cnblogs.com/bakari/p/10893589.html)

macvlan 本身是 linxu kernel 模块，其功能是允许在同一个物理网卡上配置多个虚拟网卡，即多个 interface，每个 interface 可以配置自己的 IP。macvlan 本质上是一种网卡虚拟化技术。

macvlan 的最大优点是性能极好，相比其他方式，macvlan 不需要创建 Linux bridge，而是直接通过 interface 连接到物理网络。

在这种网络模式下，宿主物理网卡上为每个容器虚拟出独立的子接口，容器的 `eth0` 不再连接到 `docker0` 桥接口，相当于直接连接到宿主物理口的交换机上，`也就是说一个容器会占用一个宿主机子网的IP`

- 修改 docker 服务监听端口

  ```sh
  # vi /etc/docker/daemon.json

  {
    "hosts": [
      "tcp://0.0.0.0:2376",
      "unix:///var/vun/docker.sock"
    ]
  }
  ```

- 创建 `macvlan` 网络（以 centos7 为例）

  宿主机除了管理口，还需要准备另外一张网卡，设置为混杂模式 `ip link set ens19 promisc on`

  ```sh
  # vi /etc/rc.d/rc.local
  # 开机后自动将 ens19 网卡设置为混杂模式
  ip link set dev ens19 promisc on
  ```

  创建网络

  ```sh
  - `-d` 指定网络模式为 macvlan

  - `--subnet` 宿主机所在的网络

  - `--ip-range` 给容器分配的 IP 段

  - `-o parent` 指定用来分配 macvlan 网络的物理网卡

  - `--gateway` 宿主机网关

  - `--aux-address` 排除 IP，名称和 IP 的键值对参数

  docker network create \
      -d macvlan \
      --subnet=10.118.200.140/15 \
      --ip-range=10.118.200.140/30 \
      --gateway=10.119.255.254 \
      --aux-address="god=10.118.200.141" \
      -o parent=ens19 \
      dockerbbc_macvlan
  ```

  启动容器连接到该网络

  ```sh
  # --ip 指定该容器使用的 IP，不指定的话，就自动分配
  # --network 指定所使用的网络
  docker run --ip=10.118.200.141 --network=[macvlan_name] -itd --name [container_name] bash
  ```

- 使用子接口创建 macvlan

  macvlan 会独占主机的物理网卡，也就是说一个物理网卡只能创建一个 macvlan 网络；好在 macvlan 不仅可以连接到 interface（如 enp0s3），也可以连接到 sub-interface（如 enp0s33.100）。

- 查看配置

  ```sh
  docker network inspect [network_name]
  ```

- 优缺点

  使用该网络模式的容器会占用宿主机所在子网的一个 IP

### host 模式

就是占用主机的端口

`host` 模式的容器，可以直接`使用宿主机的IP地址`与外界进行通信，若宿主机具有公有 IP，那么容器也拥有这个公有 IP。同时容器内服务的端口也可以`使用宿主机的端口`，无需额外进行 NAT 转换，而且由于容器通信时

![alt](https://freeaihub.com/article/images/docker-host.jpg)

- 容器和宿主机共享同一个网络命名空间，换言之，容器的 IP 地址即为宿主机的 IP 地址。

  - 与宿主机共用网络资源，有可能破坏宿主机网络环境

  - 容器和宿主机竞争端口资源

### container 模式

一个容器使用另一个容器的网卡（网络共享），K8s 大量内使用

这个模式指定新创建的容器和已经存在的一个容器共享一个 Network Namespace，而不是和宿主机共享。
新创建的容器不会创建自己的网卡，配置自己的 IP，而是和一个指定的容器共享 IP、端口范围等。
同样，两个容器除了网络方面，其他的如文件系统、进程列表等还是隔离的，两个容器的进程可以通过 lo 网卡设备通信。

![alt](https://mmbiz.qpic.cn/mmbiz_png/0cahata6G4cOGMgIuicTaQPfRz5blEiajibB8LJGGrxz5DV7cMw55WNlTErTh9ncf0jnS5o8v2eQjKCDXnfibJhytQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

```sh
# container后跟共享容器的名称
docker run -it --network=Container:nginx nginx

docker run -it --network="Container:nginx1" nginx   #这种也可以
```

### none 模式

容器拥有自己的 `Network Namespace`，但并不为 `Docker` 容器进行任何网络配置，容器起来时是没有 IP 的，可以在容器起来后再配置网络

- `优缺点`

  只有一个 `lo` 网卡，可自行根据需要配置网络

### pipework

- 优缺点

## 数据卷 volume

[Docker 数据卷之进阶篇](https://www.cnblogs.com/sparkdev/p/8504050.html)

[Docker Compose 挂载目录的限制和解决办法](https://blog.csdn.net/qq_37398834/article/details/115675882)

- 数据的覆盖问题

  `[host: empty] --> [docker: not empty]`

  如果挂载一个空的数据卷到容器中的一个非空目录中，那么这个目录下的文件会被复制到数据卷中。

  `[host: not empty] --> [docker: empty]`

  如果挂载一个非空的数据卷到容器中的一个目录中，那么容器中的目录中会显示数据卷中的数据。如果原来容器中的目录中有数据，那么这些原始数据会被隐藏掉。

  这两个规则都非常重要，灵活利用第一个规则可以帮助我们初始化数据卷中的内容。掌握第二个规则可以保证挂载数据卷后的数据总是你期望的结果。

- 创建数据卷

  ```sh
  # 创建数据卷
  # 在 /var/lib/docker/volumes/hjj-vol/_data 下面可以看到
  docker volume create hjj-vol

  # 删除
  docker volume rm hjj-vol
  ```

- 查看数据卷

  ```sh
  docker volume ls
  docker volume inspect hjj-vol
  # "Mounts": [
  #   {
  #       "Type": "volume",
  #       "Name": "hjj-vol",
  #       "Source": "/var/lib/docker/volumes/hjj-vol/_data",
  #       "Destination": "/usr/share/nginx/html",
  #       "Driver": "local",
  #       "Mode": "z",
  #       "RW": true,
  #       "Propagation": ""
  #   }
  # ],
  ```

- 挂载数据卷到容器

  ```sh
  docker run -d -P \
      --name web \
      # -v hjj-vol:/usr/share/nginx/html \
      # 逗号后面不能有空格
      # 默认权限是`读写`，也可以通过增加 readonly 指定为只读
      # --mount source=hjj-vol,target=/usr/share/nginx/html,readonly \
      --mount source=hjj-vol,target=/usr/share/nginx/html \
      nginx:alpine
  ```

- 清理没用的数据卷

  ```sh
  docker volume prune -f
  ```

- 查看磁盘占用

  ```sh
  docker system df
  ```

- `--mount` 和 `-v` 的区别

  Docker 卷的实现原理是在主机的 `/var/lib/docker/volumes` 目录下，根据卷的名称创建相应的目录，然后在每个卷的目录下创建 `_data` 目录，在容器启动时如果使用 `--mount` 参数，Docker 会把主机上的目录直接映射到容器的指定目录下，实现数据持久化。

  说白了就是 Docker 默认给你映射个路径进去，而用 `-v` 参数这需要你自己指明映射路径

  - `-v` 会自动生成一个卷，把宿主机的路径与容器内路径做一个映射

  - `-v` 参数时如果本地目录不存在，Docker 会自动为你创建一个文件夹，现在使用 `--mount` 参数时如果本地目录不存在，Docker 会报错。

- 挂载持久化目录，不建议挂载单个文件

  [docker 挂载单文件的坑](https://yuansmin.github.io/2019/docker-mount-single-file/)

  当 docker 将宿主机上的一个文件直接挂载到容器内时，在宿主机上修改该文件的内容后，在容器中看到该文件内容不变，或者容器中该文件不见了。
  当你使用一些编辑器时（我这使用的是 PHPStorm）你对文件做的修改不会直接保存该文件，而是创建一个新文件并保存到该位置。
  这样的话就破坏了 volume 的挂载绑定，因为挂载绑定是基于文件系统的 inode，因为我们前面讲的编辑器的行为改变了 inode，所以宿主机上内容的改变不会同步到容器内。

  ```sh
  # 挂多个目录，就写多个 -v xxx:yyy

  # 宿主机路径:容器内路径:读写权限
  docker run -it -d -v /host/persistent/dir:/container/dir:rw [image_id]

  # Q
  # 挂载持久化目录后，启动容器 -v 时会默认把容器中的文件夹置空；能不能以容器的文件为主
  # A
  # 修改容器启动脚本，容器启动后，再把配置文件解压到持久化目录
  ```

# 原理

容器（Container），利用命名空间来做权限的隔离控制，利用 cgroups 来做资源分配。

## docker 的发展历史

> 学习 kubernetes 之前非常有必要了解

[浅谈 dockerd、contaierd、containerd-shim、runC 之间的关系](https://www.jxhs.me/2019/08/05/%E6%B5%85%E8%B0%88dockerd%E3%80%81contaierd%E3%80%81containerd-shim%E3%80%81runC%E4%B9%8B%E9%97%B4%E7%9A%84%E5%85%B3%E7%B3%BB/)

[Kubernetes 容器运行时弃用 Docker 转型 Containerd](https://i4t.com/5435.html)

[docker、oci、runc 以及 kubernetes 梳理](https://xuxinkun.github.io/2017/12/12/docker-oci-runc-and-kubernetes/)

[docker 概念很乱？俺来替你理一下！](https://z.itpub.net/article/detail/B5E4F6F76172B522F04E1EB73378512A)

[⭐ docker、containerd、runc、shim... 容器技术名词全解析](https://blog.csdn.net/dillanzhou/article/details/116505401)

[一文搞懂容器运行时 Containerd](https://www.qikqiak.com/post/containerd-usage/)

[一文搞懂 Docker、Containerd、RunC 间的联系和区别](https://os.51cto.com/article/697381.html)

[谈谈 docker，containerd，runc，docker-shim 之间的关系](https://blog.csdn.net/u013812710/article/details/79001463)

![alt](https://image.z.itpub.net/zitpub.net/JPG/2021-09-10/160D7E464E71DBC68663D38E338EA438.jpg)

在传统的 k8s 集群中，我们都是使用 docker engine 做为底层的容器管理软件的，而 docker engine 因为不是 k8s 亲生的解决方案，所以实际使用中会有更多的分层。之前我们也讲过，k8s 为了调用 docker engine，专门写了一个 dockershim 做为 CRI，而在 1.20 版本的时候，k8s 就宣布停止更新 dockershim 了，也就是说再往后的版本就不推荐使用 k8s+dockershim+docker engine 的方案了。

而 k8s 官方比较推荐的解决方案中，官方比较推荐的是 cri-o 或者 containerd，前者是基于开放容器计划 (OCI) 的实现，后者是基于 docker 的 containerd，后脱离出来进行独立开发的组件，现归属于 CNCF 组织。

- 容器引擎，或者说容器平台，不仅包含对于容器的生命周期的管理，还包括了对于容器生态的管理，比如对于镜像等。

- **`oci (open container initiative)`**

  - 定义的是容器运行时的标准，这个标准，使用 Linux 的 cgroup 和 namespace 等技术，和 docker 所使用的技术没什么两样。docker 只不过是 OCI 的一个实现而已

  - 在 Kubernetes 早起的时候，Kubernetes 为了支持 Docker，通过硬编码的方式直接调用 Docker API。后面随着 Docker 的不断发展以及 Google 的主导，出现了更多容器运行时可以使用，Kubernetes 为了支持更多精简的容器运行时，google 就和 redhat 主导推出了 OCI 标准，用于将 Kubernetes 平台和特定的容器运行时解耦

- **`cri (container runtime interface)`**

  CRI (Container Runtime Interface 容器运行时接口) 本质就是 Kubernetes 定义的一组与容器运行时进行交互的接口

  在 k8s 1.5 版本之后推出，隔离了各个容器引擎之间的差异，而通过统一的接口与各个容器引擎之间进行互动。

  containerd 就是 docker 为了适应这个标准而开发的 CRI 实现，但它已经是 CNCF 的了，不再属于 docker 了。

  CRI 实际上就是一组单纯的 gRPC 接口，核心有如下:

  - RuntimeService 对容器操作的接口，包括创建，启停容器等

  - ImageService 对镜像操作的接口，包括镜像的增删改查等

- **`cri-dockerd`**

  [可以参考这篇文章进行安装和配置](https://www.jianshu.com/p/a613f64ccab6)

- **`runc`**

  简单的说，runC 是一个命令行工具，用来运行按照 OCI 标准格式打包过的应用；RunC 是从 Docker 的 libcontainer 中迁移而来的，实现了容器启停、资源隔离等功能。

  runc 实现了容器的底层功能，例如创建、运行等。runc 通过调用内核接口为容器创建和管理 cgroup、namespace 等 Linux 内核功能，来实现容器的核心特性。

  runc 是一个可以直接运行的二进制程序，对外提供的接口就是程序运行时提供的子命令和命令参数。runc 内通过调用内置的 libcontainer 库功能来操作 cgroup、namespace 等内核特性。

  Docker 公司将 RunC 捐赠给 OCI 作为 OCI 容器运行时标准的参考实现。Docker 默认提供了 docker-runc 实现。

  事实上，通过 containerd 的封装，可以在 Docker Daemon 启动的时候指定 RunC 的实现。

  可以看到从 docker_client、dockerd、containerd 到 runc，这些组件都号称提供了容器操作能力，但上层组件提供的可能只是接口封装、状态展现相关的能力，而下层组件则负责更基础、更核心的内核功能调用、底层功能实现。虽然不太容易清楚的区分各层组件提供的具体能力，但将这些层次想象成软件设计中的功能抽象、接口封装和底层实现就能大体理解这些组件间的关系和拆分成多个组件的原因。

  **`containerd`**

  ![alt](https://bxdc-static.oss-cn-beijing.aliyuncs.com/images/20210810134700.png)

  是一个工业级标准的容器运行时（runc），它强调简单性、健壮性和可移植性，containerd 可以负责干下面这些事情：

  - 管理容器的生命周期（从创建容器到销毁容器）

  - 拉取/推送容器镜像

  - 存储管理（管理镜像及容器数据的存储）

  - 调用 runc 运行容器（与 runc 等容器运行时交互）

  - 管理容器网络接口及网络

  感觉 docker 就是 containerd 封装了一层； containerd 也提供了一个 `ctr` 工具来操作容器镜像

- **`dockerd`**

  ![alt](https://tva1.sinaimg.cn/large/006y8mN6gy1g864od01lxj31560l2tbe.jpg)

  Docker 1.11 之后，Docker Daemon 被分成了多个模块以适应 OCI 标准。拆分之后，结构分成了以下几个部分

  ![alt](https://img-blog.csdnimg.cn/img_convert/d59454c117802bd3c082604f6a3f634e.webp?x-oss-process=image/format,png)

  containerd 独立负责容器运行时和生命周期（如创建、启动、停止、中止、信号处理、删除等），其他一些如镜像构建、卷管理、日志等由 Docker Daemon 的其他模块处理。

- **`docker`**

  docker 的命令行工具，是给用户和 docker daemon 建立通信的客户端。

  启动一个容器的过程如下：

  - 用户在命令行执行 `docker run -itd busybox` 由 docker client 通过 grpc 将指令传给 dockerd

  - docker daemon 请检查本机是否存在 docker 镜像文件，如果有继续往下执行

  - dockerd 会向 host os 请求创建容器

  - linux 会创建一个空的容器(cgroup namespace),并启动 containerd-shim 进程。

  - containerd-shim 拿到三个参数(容器 id，boundle 目录，运行时二进制文件 runc )来调用 runC 的 api

  - runC 提取镜像文件，生成容器配置文件，然后启动容器

- **`docker-shim`**

  由于早期 Kubernetes 在市场没有主导地位，有一些容器运行时可能不会自身实现 CRI 接口，于是就有了 shim，一个 shim 的职责就是作为适配器，将各种容器运行时的本身的接口适配到 Kubernetes 的 CRI 接口上

  ![alt](https://image.abcdocker.com/abcdocker/2022/05/13/dc04b57012a36/dc04b57012a36.png)

  现在创建一个 docker 容器的时候，Docker Daemon 并不能直接帮我们创建了，而是请求 containerd 来创建一个容器。当 containerd 收到请求后，也不会直接去操作容器，而是创建一个叫做 containerd-shim 的进程。让这个进程去操作容器，我们指定容器进程是需要一个父进程来做状态收集、维持 stdin 等 fd 打开等工作的，假如这个父进程就是 containerd，那如果 containerd 挂掉的话，整个宿主机上所有的容器都得退出了，而引入 containerd-shim 这个垫片就可以来规避这个问题了，就是提供的 live-restore 的功能。

  - 在早些版本中，k8s 为了支持 docker，不得不包含一个叫做 `docker-shim（shim: 垫片）` 的组件。一头通过 CRI 跟 kubelet 交互，另一头跟 docker api 交互；2022 年 5 月 3 日，Kubernetes 1.24 正式发布，正式移除对 docker-shim 的支持，我们依然可以使用 containerd 来调用 docker 的所有功能。

  - 从 k8s 的角度看，选择 containerd 作为运行时的组件，它调用链更短，组件更少，更稳定，占用节点资源更少。

    ![alt](https://s6.51cto.com/oss/202112/30/e1c4888a973f8396d4e85e8635329151.jpg)

## 命名空间 Namespaces

## 控制组 ControlGroups

## 联合文件系统 UnionFS

# 容器仓库 Registry

## harbor

## dockerhub

```sh
# 如果未指定镜像仓库地址，默认为官方仓库 Docker Hub
docker login # [docker_hub_addr] -u [user_name] -p [password]

# 发布镜像
docker push huangjinjie/magent:0.6
```

# 学习过程中的疑问

- **宿主机可不可以通过 hostname 访问容器，或者说宿主机可不可以通过容器名访问容器**

  https://www.docker.org.cn/faq/global/c97/views.html

  没办法，老老实实 inspect 找 IP 吧

- **用 docker-compose 编排的时候，数据怎么持久化？**

  volumes 数据卷

- **`docker run -p` 命令可以挂载端口；`Dockerfile 的 EXPOSE` 也可以挂端口；`docker-compose.yml 的 ports` 也可以挂端口。我意思是没有限定区分的地方，一部分用命令行，一部分用 dockerfile，一部分又放在 yml 中**

  正常建议与镜像构建相关的，全部放在 Dockerfile；跑容器相关的，全放在 yml，yml 就是用来替代 shell 命令的

- **为什么一定要用 Dockerfile，而不建议通过保存镜像的方式来生成镜像呢**

  这样才能实现环境配置和环境部署代码化 ，将 Dockerfile 维护在 Git 里面，有版本控制，并且通过自动化的 build 的过程来生成镜像，而镜像中就是环境的配置和环境的部署，要修改环境应先通过 Git 上面修改 Dockerfile 的方式进行，这就是 IaC。

- **我怎么保持容器一致在跑呢？比如我容器跑的是 Nginx，启动容器的时候需要制定一个不会退出的脚本吗？**

  `容器中的应用都应该以前台执行`，而不是像虚拟机、物理机里面那样，用 systemd 去启动后台服务，容器内没有后台服务的概念

  是的，容器内的进程就是要前台运行，然后 `docker run -d` 让容器后台运行

  ```sh
  # openresty 是用 daemon off 指定前台运行
  docker run -d [image_id] "/usr/local/openresty/bin/openresty -g 'daemon off;'"
  ```

- **为什么我 dockerfile 指定了启动脚本，但还是启动不了，需要手动指定启动命令才行**

  [CMD 容器启动命令](https://yeasy.gitbook.io/docker_practice/image/dockerfile/cmd)

  然后发现容器执行后就立即退出了。甚至在容器内去使用 systemctl 命令结果却发现根本执行不了。这就是因为没有搞明白前台、后台的概念，没有区分容器和虚拟机的差异，依旧在以传统虚拟机的角度去理解容器。

  对于容器而言，其启动程序就是容器应用进程，容器就是为了主进程而存在的，主进程退出，容器就失去了存在的意义，从而退出，其它辅助进程不是它需要关心的东西。

  而使用 service nginx start 命令，则是希望 upstart 来以后台守护进程形式启动 nginx 服务。而刚才说了 `CMD service nginx start` 会被理解为 `CMD ["sh", "-c", "service nginx start"]`，因此主进程实际上是 sh。那么当 service nginx start 命令结束后，sh 也就结束了，sh 作为主进程退出了，自然就会令容器退出。

  当然，你可以通过特权模式 `--privileged=true` 来拿到真正的 root 权限，就可以是用 systemctl 了，但是不建议这样做，因为这样拿到的也是宿主机的 root 权限，太危险。

  正确的做法是直接执行 nginx 可执行文件，并且要求以前台形式运行。比如：

  ```dockerfile
  CMD ["nginx", "-g", "daemon off;"]
  ```

# 排障指南

- **我有 redis、openresty、c++ 三个容器，并把他们放入到一个 docker-compose.yml 中进行编排；另外两个容器都需要访问 redis 容器，但是现在 c++ 服务所在容器可以联通，但是 openresty 不行，报错：`openRedisConn(): connect to redis error: no resolver defined to resolve "redis", client: 127.0.0.1, server: ,`**

  openresty 用的镜像是 `openresty/openresty:latest`；c++ 服务用的是 `centos:7`；在 c++ 服务所在容器中，可以 `ping redis`，网络是联通的

  按这里的说法是，这是 alpine 的问题，他直接摆烂了，用 `--host` 网络模式规避了问题[Intro to Lua and Openresty, Part 3: Writing Data to Postgres](https://ketzacoatl.github.io/posts/2017-03-04-lua-and-openresty-part-3-write-to-postgres.html)；后来换成 centos:7 也还是不能通过 redis 名称来连接；看来是 openresty 不能通过 hostname 来访问 redis

  [这个说 nginx 不支持解析 /etc/hosts，所以他转了个 dnsmasq 就解决了](https://github.com/openresty/lua-resty-redis/issues/9)

  ```ini
  http {
    # 指定使用 docker 的 dns 解析
    resolver 127.0.0.11;
    ...
  }
  ```

- **我想把我的服务打包到 docker 里，我原来是用 systemctl 来管理（启动、停止、自启）这个服务的，现在在 docker 里无法是用 `systemctl` 了，报错： [`Docker容器使用问题：Failed to get D-Bus connection: Operation not permitted`](https://blog.51cto.com/lizhenliang/1975466)**

  `systemctl` 需要 root 权限才能使用，除非是用特权模式，让容器拥有真正的 root 权限

  `Docker 不是虚拟机，容器就是进程`。既然是进程，那么在启动容器的时候，需要指定所运行的程序及参数。CMD 指令就是用于指定默认的容器主进程的启动命令的。

  Docker 的设计理念是在容器里面不运行后台服务，容器本身就是宿主机上的一个独立的主进程，也可以间接的理解为就是容器里运行服务的应用进程。一个容器的生命周期是围绕这个主进程存在的，所以正确的使用容器方法是将里面的服务运行在前台。

- **构建 nginx 镜像，dockerfile 中明明指定了前台运行模式 `CMD ["nginx", "-g", "'daemon off;'"]` 但是运行容器的时候还是报错 [`nginx: [emerg] unexpected end of parameter, expecting ";" in command line`](https://codehunter.cc/a/nginx/nginx-unexpected-end-of-file-expecting-or-in-etc-nginx-sites-enabled-default-20-over-raspbian)**

  正常运行的时候确实 `nginx -g 'daemon off;'` 可以保证前台，但是在 dockerfile 中应该是 `CMD ["nginx", "-g", "daemon off;"]` 不要单引号了

  ```sh
  docker run [image_id] /usr/local//openresty/bin/openresty -g "daemon off;"
  ```

- **我用 dockerfile 构建完镜像后，又手动拉起容器进入修改了点内容，然后重新 commit 了，然后启动不了服务了**

  [DOCKER COMMIT 采坑记录](https://www.cnblogs.com/sylvia-liu/p/14647866.html)

  老 image 的 dockerfile 中 CMD 是这样的： `CMD ["nginx" "-g" "daemon off;"]`

  执行 docker run 命令时，最后一条 cmd 由原来的 `nginx -g daemon off;` 变为 `/bin/bash`

  `docker run -it image:tag /bin/bash # 容器主进程变为/bin/bash`

  执行 docker commit 时，当前容器的 cmd 保存最后一条 `/bin/bash`

  docker commit 时使用 --change 参数替换 image 中的 cmd. 比如： `--change='CMD ["nginx", "-g", "daemon off;"]'`

  或者启动的时候指定启动参数 `docker run [image_id] /usr/local/openresty/bin/openresty -g "daemon off;"`

- **我用 `redis:alpine` 作为基础镜像，把我自己的配置拷贝进去，但是我的配置是放在 `/usr/local/redis/etc/redis.conf` 日志是在 `/var/log/redis/redis.log`；我直接启动是可以，但是只要 `-v /var/log/saasbbc/redis/log:/var/log/redis` 进行路径挂载后就不行，报错： `\*** FATAL CONFIG FILE ERROR (Redis 7.0.2) **\* Can't open the log file: Permission denied`**

  [K8S 中容器应用目录挂载数据卷后，就无法启动，报错权限问题](https://cloud.tencent.com/developer/article/1856854)

  [Docker 启动 Mysql 容器失败，挂载时权限不足](https://www.geek-share.com/detail/2804205268.html)

  [redis-alpine 启动报 Can't open the log file: No such file or directory](https://www.jianshu.com/p/50f342f16d5d)

  [docker redis -Can't open the log file: No such file or directory](https://stackoverflow.com/questions/35955853/docker-redis-cant-open-the-log-file-no-such-file-or-directory)

  ```sh

  # 挂载这个之后，就不行了，报无权限
  # 方案一：所以，不挂载这个，或者修改 redis 配置，不输出日志就规避了
  # ✓：方案二：日志输出到 /data/redis.log

  docker run \
    # 挂这个就出问题
    -v /var/log/redis:/var/log/redis/ \
    # 只挂这个就没问题
    -v /usr/local/redis/data:/data \
    redis:alpine
  ```

# 其他

- 抓包

  ```sh
  tcpdump -i docker0 host 172.251.252.2
  ```

- [设置非 root 账号不用 sudo 直接执行 docker 命令](https://blog.csdn.net/boling_cavalry/article/details/106590784)

  ```sh
  # 创建名为 docker 的组，如果之前已经有该组就会报错，可以忽略这个错误
  sudo groupadd docker

  # 将当前用户加入组 docker
  sudo gpasswd -a ${USER} docker

  # 重启 docker 服务 (生产环境请慎用)
  sudo systemctl restart docker

  # 添加访问和执行权限
  sudo chmod a+rw /var/run/docker.sock
  ```

- 每次弄一个服务都要考虑 `日志轮转问题`、失败自动拉起问题

- 一般都会弄个 `docker-entrypoint.sh` 作为入口

- [portainer 轻量化图形页面 docker 管理工具](https://www.cnblogs.com/sparkdev/p/9238796.html)

  如果是通过 TCP 连接服务器上的 docker 服务，需要修改容器服务启动方式，启用 TCP 连接

  ```sh
  # 添加 -H tcp://0.0.0.0
  ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0 --containerd=/run/containerd/containerd.sock
  ```

  ```sh
  docker run -d \
    -p 9000:9000 \
    -v /var/run/docker.sock:/var/run/docker.sock \
    --name portainer \
    --restart always \
    portainer/portainer
  ```

  浏览器访问 http://localhost:9000

- 获取容器 IP 通用脚本

  ```sh
  docker-ip() {
      docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$@"
  }
  ```

- [清理没用到的数据](https://www.cnblogs.com/sparkdev/p/9177283.html)

  ```sh
  # 删除那些已停止的容器、dangling 镜像、未被容器引用的 network 和构建过程中的 cache
  # tag 为 <none> 的镜像就叫做 dangling 镜像
  docker system prune
  ```

- 查看容器状态

  ```sh
  docker container inspect [container_name]--format={{.State.Status}}
  # 输出以下可能的状态：
  created
  running
  ```

- docker run 时进入指定目录

- 实际上由于 Alpine 镜像使用的根本不是 gnu libc 而是 musl libc，所以 /lib64/ld-linux-x86-64.so.2 是不存在的，而实际上 /lib64 都是不存在的。

  [Running glibc programs](https://wiki.alpinelinux.org/wiki/Running_glibc_programs)

  ```sh
  # gcompat 是 Alpine 用户的首选兼容层。
  apk get gcompat

  # 或者去dockerhub 找一个支持 glibc 的 alpine 镜像
  https://hub.docker.com/search?q=alpine-glibc
  ```
