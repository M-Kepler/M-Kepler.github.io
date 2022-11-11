- [参考资料](#参考资料)
- [docker-compose](#docker-compose)
  - [配置文件](#配置文件)
  - [变量](#变量)
  - [配置网络](#配置网络)
  - [常用命令](#常用命令)
- [其他](#其他)

# 参考资料

# docker-compose

`compose v. 作曲；创作；编排；形成；使镇静`

[K8S 系列第五篇（DOCKER COMPOSE）](https://mp.weixin.qq.com/s?__biz=MzI3MjQzNzc4Mw==&mid=100002827&idx=1&sn=496d7a382aeb3f3a47b18f2d0f3adf42&scene=19#wechat_redirect)

[一个小例子感受下](https://yeasy.gitbook.io/docker_practice/compose/usage)

在日常工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个 Web 项目，除了 Web 服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。

Compose 恰好满足了这样的需求。它允许用户通过一个单独的 docker-compose.yml 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。

Compose 中有两个重要的概念：

- 服务 (service)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例。

- 项目 (project)：由一组关联的应用容器组成的一个完整业务单元，在 docker-compose.yml 文件中定义。

Compose 的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理
和 k8s 的关系：

| 技术           | 应用场景                | 资源占用情况 |
| :------------- | :---------------------- | :----------- |
| Docker         | 单机部署简单应用        | 低           |
| Docker-Compose | 单机 / 少数机器部署应用 | 低           |
| k8s            | 集群部署高可用应用      | 高           |

要运行一个 docker 镜像， 通常都是使用 docker run 命令， 在运行的镜像的时候， 需要指定一些参数， 例如：容器名称、 映射的卷、 绑定的端口、 网络以及重启策略等等， 一个典型的 docker run 命令如下所示：

```sh
docker run \
  --detach \
  --name registry \
  --hostname registry \
  --volume $(pwd)/app/registry:/var/lib/registry \
  --publish 5000:5000 \
  --restart unless-stopped \
  registry:latest
```

为了保存这些参数， 可以将这个 run 命令保存成 shell 文件， 需要时可以重新运行 shell 文件。 对于只有单个镜像的简单应用， 基本上可以满足需要了。 只要保存对应的 shell 文件， 备份好卷的内容， 当容器出现问题或者需要迁移活着需要重新部署时， 使用 shell 文件就可以快速完成。

不过不是所有的应用都倾向于做成单个镜像， 这样的镜像会非常复杂， 而且不符合 docker 的思想。 因为 docker 更倾向于简单镜像， 即： 一个镜像只有一个进程。 一个典型的 web 应用， 至少需要一个 web 服务器来运行服务端程序， 同时还需要一个数据库服务器来完成数据的存储， 这就需要两个镜像， 一个是 web ， 一个是 db ， 如果还是按照上面的做法， 需要两个 shell 文件， 或者是在一个 shell 文件中有两个 docker run 命令：

```sh
# PostGIS DB
docker run \
  --datach \
  --publish 5432:5432 \
  --name postgis \
  --restart unless-stopped \
  --volume $(pwd)/db/data:/var/lib/postgresql/data \
  beginor/postgis:9.3

# GeoServer Web
docker run \
  --detach \
  --publish 8080:8080 \
  --name geoserver \
  --restart unless-stopped \
  --volume $(pwd)/geoserver/data_dir:/geoserver/data_dir \
  --volume $(pwd)/geoserver/logs:/geoserver/logs \
  --hostname geoserver \
  --link postgis:postgis \
  beginor/geoserver:2.11.0
```

在上面的例子中， web 服务器使用的是 geoserver ， db 服务器使用的是 postgis ， web 服务器依赖 db 服务器， 必须先启动 db 服务器， 再启动 web 服务器， 这就需要编写复杂的 shell 脚本， 需要的镜像越多， 脚本越复杂， 这个问题被称作 docker 的编排。

## 配置文件

[docker-compose 简介及使用](https://www.cnblogs.com/xiaoyuxixi/articles/12738325.html)

默认配置文件是 `docker-compose.yml`；指定配置文件名： `docker-compose -f server.yml up`

`docker-compose -p/--project-name [proj_name]` 指定项目名称，默认以 docker-compose.yml 所在目录作为项目名称

[可不可以在 .yml 中定义项目名称啊，好像没办法，只能用 COMPOSE_PROJECT_NAME 环境变量](https://www.it1352.com/2053065.html)

```yaml
version: "3.0"
services:
  huangjinjie_test:
    # build 指令
    build:                # 表示用 Dockerfile 来进行构建
      context: ./dir      # 指定 Dockerfile 所在文件夹路径，可以是绝对或相对路径
      dockerfile: Dockerfile-alternate  # 文件名
      args:
        buildno: 1  # dockerfile 参数

  huangjinjie_test2:
    # image 指令
    image: centos:7

    # 设置容器内主机名
    hostname: huangjinjie_tset2

    # entrypoint 指令：覆盖Dockerfile文件里面的：ENTRYPOINT command param1 param2
    entrypoint: /code/entrypoint.sh

    # command 指令: 覆盖容器启动后默认执行的命令
    # 支持一下三种格式
    command: bundle exec thin -p 3000
    command: ["redis-sentinel", "/usr/local/etc/redis/sentinel.conf"]
    command:
      - redis-sentinel
      - /usr/local/etc/redis/sentinel.conf

    # container_name 指令: 指定容器名称
    # 默认为 [proj_name]-[service_name]-[id] 比如：kafka_cluster_new-broker3-1
    container_name: huangjinjie_test2

    # env_file 指令： 从文件中获取环境变量，可以为单独的路径或列表。
    env_file:
      - ./common.env
      - ./apps/web.env

    # environment 指令： 设置环境变量。你可以使⽤数组或字典两种格式。
      # 只给定名称的变量会自动获取运行 Compose 主机上对应变量的值，可以预防泄露不必要的数据。
    environment:
      MYSQL_ROOT_PASSWORD: 123
      TARGET: huangjinjie_test2

    # network_mode 指令：网络模式 host、bridge、overlay、Macvlan
    network_mode: "host"

    # ports 指令： 暴露端口；也可以是用宿主端口：容器端口 (HOST:CONTAINER) 格式，或者仅仅指定容器的端口（宿主将会随机选择端口）都可以。
    ports:
      - "4430:443"
      # 容器间访问用的是 5000 端口， 4431 是宿主机的
      - "4431:5000"

    # volumes 指令：数据卷所挂载路径设置，该指令中路径保持相对路径。
    # 数据卷所挂载路径设置。可以设置为宿主机路径(HOST:CONTAINER)或者数据卷名称(VOLUME:CONTAINER)，并且 可以设置访问模式 （ HOST:CONTAINER:ro ）。
    volumes:
      - /var/lib/mysql
      - cache/:/tmp/cache:rw
      # 使用创建的数据卷来挂载
      - node1-data:/tmp

    # volumes_from:

    # sysctls 配置容器内核参数
    sysctls:
      net.core.somaxconn: 1024
      net.ipv4.tcp_syncookies: 0
    sysctls:
     - net.core.somaxconn=1024
     - net.ipv4.tcp_syncookies=0

    # ulimits 指定容器的 ulimits 限制值
    ulimits:
      nproc: 65535
      nofile:
      soft: 20000
      hard: 40000

    # healthcheck 指令：通过命令检查容器是否健康运行
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3

    # 对应 docker run 中 的 –restart=always 选项
    # 保证 docker 服务启动时，容器会自动运行
    # restart 重启操作 "no"、 always、 on-failure、 unless-stopped
    restart: always

    # depends_on 指令：解决容器的依赖、启动先后的问题
    # 每个容器都能通过应用名找到对方
    # 例如，web容器可以通过 redis = Redis(host='redis', port=6379) 来使用 Redis 容器中的数据库
    depends_on:
      - nginx
      - redis

    # 链接到其他服务中的容器
    # depends_on 是规定启动顺序
    # links 是让本服务可以访问别的容器内服务
    links:
      # 服务名称:服务别名
      - redis:cache_db
      - nginx

    # links 代表的是在本文件下互通：意思就是在这个 yml 文件一块启动的容器下互通
    # （XXX 在一个网络内的服务，不是本来就可以吗？）
    # external_links 是只要是同一个 docker 启动的都可以互通（可能需要配置网络）

    # 链接外部服务，在当前服务中，可以直接使用该外部服务名表示 host。所有容器需要在同一个网络中。
    # 最近发布的 Docker 版本已经不需要使用 external_links 来链接容器，容器的 DNS 服务可以正确的作出判断
    external_links:
      - external_service

    # networks 指令：配置 IP 地址
    # networks:
    #   huangjinjie_test3 # 这个是下面定义的网络名称
    #     ipv4_address:172.69.0.13 # 表示在这个网络中指定使用的 IP

    # networks 指令：配置容器链接的网络
    networks:
      - huangjinjie_test

  nginx:
    image: nginx:latest
    networks:
      - backend

  redis:
    image: redis:alpine
    networks:
      - backend

# 创建数据卷
# 默认名称为 [project_name]_[name]
# 默认路径在 /var/lib/docker/volumes/[volume_name]/_data 下
# 可以通过 docker volume ls 看到，通过 docker inspect volume [volume_name] 查看详情
volumes:
  node1-data:
  node2-data:
  node3-data:
  node4-data: {}

  # 当执行 docker-compose up 的时候。会发生以下事情：
    # 会创建一个名字是 [proj_name]_default 的网络 proj_name 默认为 yml 文件所在目录
    # 容器会自动加入到 [proj_name]_default 网络中，并且在网络中的名称就是上面 服务的名称
    # 本例中为 huangjinjie_test huangjinjie_test2 nginx redis 这些
networks:
  # 定义网络，不在一个网络中的服务不能通信
  frontend:
    driver: custom-driver-1
  backend:
    driver: custom-driver-2
    driver_opts:
      foo: "1"
      bar: "2"
  # 默认网络，不配置时，默认用这个
  default:
    driver: custom-driver-1

  # 加入已存在的网络
  # 创建网络：docker network create --driver bridge --subnet 172.69.0.0/25 --gateway 172.69.0.1 hjj-network-test
  # WARN[0000] network sentinel: network.external.name is deprecated in favor of network.name
  huangjinjie_test:
    external:
      name: hjj-network-test

  # 收到警告：WARN[0000] network default: network.external.name is deprecated in favor of
  # 去掉 external 就行了:
  huangjinjie_test2:
    name: hjj-network-test

  # 生成的网络名称为 [proj_name]_[network_name]
  huangjinjie_test3:
    driver: bridge
    ipam:
      config:
        - subnet: 192.168.101.0/24
          gateway: 192.168.101.1

  # 这里的配置和 docker inspect 看到的网络配置对应的
  #  "IPAM": {
  #      "Driver": "default",
  #      "Options": null,
  #      "Config": [
  #          {
  #              # 容器所在网段
  #              "Subnet": "172.17.0.0/16",
  #              # 网关
  #              "Gateway": "172.17.0.1"
  #          }
  #      ]
  #  },

```

## 变量

**环境变量**

默认会去命令执行路径下的 `.env` 文件（也可以通过 `--env-file` 指定环境变量文件），或者在 yml 文件中通过 `env_file` 指令指定环境变量文件

```ini
LABEL=latest
```

```yml
web:
  # LABEL 来自环境变量
  image: "webapp:${LABEL}
```

**内置变量**

- `COMPOSE_API_VERSION`

- `COMPOSE_CONVERT_WINDOWS_PATHS`

- `COMPOSE_FILE`

- `COMPOSE_HTTP_TIMEOUT`

- `COMPOSE_TLS_VERSION`

- `COMPOSE_PROJECT_NAME` 项目名称

- `DOCKER_CERT_PATH`

- `DOCKER_HOST`

- `DOCKER_TLS_VERIFY`

## 配置网络

[docker-compose 配置 networks](https://www.jianshu.com/p/3004fbce4d37)

compose 中的多个服务会加入一个名为 default 的网络。**这些服务在 default 网络中是互通的，互相之间可以通过 [service_name] 相互访问**。该 default 网络的全称是以 compose 文件所在文件夹名字做为前缀。比如文件夹为 hello_world 的 compose。其一组服务对应的网络名为：hello_world_default，可以通过 `docker network ls` 看到这个网桥，`docker inspect [container_name]` 也可以看到容器连接到的 `NetworkID`

- **它是一个比主机网络更加独立的网络**；因此，系统环境的小问题就不太会导致 compose 设置的行为差异。你可以访问互联网，但是你希望从主机访问的任何端口都要使用端口绑定来声明。

- 如果一个服务开始监听 0.0.0.0（容器应该这样），那么主机网络设置将在 WLAN 上打开那个端口。如果你使用 Docker 网络，它只会将该端口暴露给该网络。

- 你可以通过使用服务的 compose name 作为主机名来实现服务之间的通信。因此，如果你有一个名为 db 的服务，在其内部有一个侦听端口 5432 的服务，那么你可以从任何其他服务通过 db:5432 访问它。这通常比 localhost:5432 更直观。而且，由于不存在本地主机端口冲突的风险，因此，在跨不同项目使用时，它可能会更加一致。

- 大多数端口不需要向主机开放——这意味着，如果你需要通过 `--scale` 增加副本的话，它们不会竞争全局资源。

```sh
# flask_test 项目

$docker network ls
NETWORK ID     NAME                              DRIVER    SCOPE
206fb6ac7059   flask_test_default                bridge    local

$docker inspect [container_id] -f {{.NetworkSettings.Networks.[project_name].NetworkID}}
206fb6ac7059

```

## 常用命令

可以把整个 docker-compose.yml 当成一个项目，进行启动、重启等管理操作

- 可以通过 `docker-compose [cmd] --help` 查看帮助文档

- `docker-compose ls` 查看运行中的项目

- `docker-compose -f/--filie` 指定 compose 文件

  可以同时指定多个 `-f xxx -f yyy` 文件来合并配置，可以通过 `docker-compose -f xxx -f yyy config` 看一下合并后的样子

  但是如果两个 yml 文件中定义了相同的服务的话，后者会把前者的配置覆盖掉

- `docker-compose --env-file` 指定环境变量文件

- `docker-compose --log_level [DEBUG/INFO/WARNING/ERROR/CRITICAL]` 定义日志级别

- `docker-compose stop [service_name]` 停止某个容器

- `docker-compose start [service_name]` 运行某个容器

- `docker-compose down` 删除容器和网络

- `docker-compose up` 构建并启动所有容器

  - `-d` 后台跑这些容器

  - `--build` 重新构建

  - `--force-recreate` 删掉老容器，强制重新创建容器

- `docker-compose run [service_name1] [service_name2] ...` 指定需要启动的服务

- `docker-compose run logs -f [service_name]` 查看指定容器服务日志

- `docker-compose build` 构造镜像，不运行

- `docker-compose down` 此命令将会停止 up 命令所启动的容器，并移除网络

- `docker-compose config [-q]` 检查配置是否正确，正确的话，会把配置输出，加 `-q` 则不输出

- `docker-compose exec -p [proj_name] [service_name] bash` 进入容器，和 `docker exec` 不一样，不需要加 `-it` 选项

  `docker-compose exec [proj_name]-[service_name]-1 bash` 是错误的，不能进入 docker-compose ps 看到的容器名称

- `docker-compose ps` 查看是否启动（要在 docker-compose.yml 同一个目录下执行该命令）

- `docker-compsoe scale [service_name]=[scale_cnt]` 多开几个副本

# 其他

- 从 dockerhub 拉取的镜像，怎么看启动参数，即需要配置哪些环境变量

  ```sh
  # 只能通过查看启动脚本了
  docker run -it [image_id] cat /usr/local/bin/docker-entrypoint.sh
  ```
