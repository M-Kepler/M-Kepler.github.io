- [前言](#前言)
- [镜像的层就像 Git 的提交一样](#镜像的层就像-git-的提交一样)
- [用 distroless 去除不必要的东西](#用-distroless-去除不必要的东西)
- [小体积的 Alpine 基础镜像](#小体积的-alpine-基础镜像)
- [你应该选择哪个基础镜像](#你应该选择哪个基础镜像)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/bbwangj/article/details/82178774)

## 前言

在构建 Docker 容器时，应该尽量想办法获得体积更小的镜像，因为传输和部署体积较小的镜像速度更快。

但`RUN`语句总是会创建一个新层，而且在生成镜像之前还需要使用很多中间文件，在这种情况下，该如何获得体积更小的镜像呢？

你可能已经注意到了，大多数 Dockerfiles 都使用了一些奇怪的技巧：

```sh
FROM ubuntu
RUN apt-get update && apt-get install vim
```

为什么使用 `&&` 而不是使用两个 RUN 语句代替呢？比如：

```sh
FROM ubuntu
RUN apt-get update
RUN apt-get install vim
```

**从 Docker 1.10 开始，`COPY`、`ADD` 和 `RUN` 语句会向镜像中添加新层。前面的示例创建了两个层而不是一个。**

![alt](https://img-blog.csdn.net/20180829100633273?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Jid2FuZ2o=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 镜像的层就像 Git 的提交一样

Docker 的层用于保存镜像的上一版本和当前版本之间的差异。就像 Git 的提交一样，如果你与其他存储库或镜像共享它们，就会很方便。

实际上，当你向注册表请求镜像时，只是下载你尚未拥有的层。这是一种非常高效地共享镜像的方式。

但额外的层并不是没有代价的。

**层仍然会占用空间，你拥有的层越多，最终的镜像就越大。** Git 存储库在这方面也是类似的，存储库的大小随着层数的增加而增加，因为 Git 必须保存提交之间的所有变更。

过去，将多个`RUN`语句组合在一行命令中或许是一种很好的做法，就像上面的第一个例子那样，但在现在看来，这样做并不妥。

通过 Docker 多阶段构建将多个层压缩为一个

当 Git 存储库变大时，你可以选择将历史提交记录压缩为单个提交。

事实证明，在 Docker 中也可以使用多阶段构建达到类似的目的。

在这个示例中，你将构建一个 Node.js 容器。

让我们从 index.js 开始：

```sh
const express = require('express')
const app = express()
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(3000, () => {
  console.log(`Example app listening on port 3000!`)
})
```

和 package.json：

```sh
{
  "name": "hello-world",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.16.2"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

你可以使用下面的 Dockerfile 来打包这个应用程序：

```sh
FROM node:8
EXPOSE 3000
WORKDIR /app
COPY package.json index.js ./
RUN npm install
CMD ["npm", "start"]
```

```sh
FROM node:10
MAINTAINER xialeistudio xialeistudio@gmail.com
WORKDIR /usr/src/app
ENV TZ Asia/Shanghai
ARG registry=https://registry.npm.taobao.org
ARG disturl=https://npm.taobao.org/dist
RUN yarn config set disturl $disturl
RUN yarn config set registry $registry
COPY package.json /usr/src/app/
RUN yarn --frozen-lockfile --production
COPY . /usr/src/app
EXPOSE 8080
CMD [ "yarn", "start:prod" ]
```

然后开始构建镜像：

```sh
docker build -t node-vanilla .

```

然后用以下方法验证它是否可以正常运行：

```sh
docker run -p 3000:3000 -ti --rm --init node-vanilla

```

你应该能访问 http://localhost:3000，并收到 “Hello World!”。

Dockerfile 中使用了一个 COPY 语句和一个 RUN 语句，所以按照预期，新镜像应该比基础镜像多出至少两个层：

```sh
$docker history node-vanilla
IMAGE          CREATED BY                                      SIZE
075d229d3f48   /bin/sh -c #(nop)  CMD ["npm" "start"]          0B
bc8c3cc813ae   /bin/sh -c npm install                          2.91MB
bac31afb6f42   /bin/sh -c #(nop) COPY multi:3071ddd474429e1…   364B
500a9fbef90e   /bin/sh -c #(nop) WORKDIR /app                  0B
78b28027dfbf   /bin/sh -c #(nop)  EXPOSE 3000                  0B
b87c2ad8344d   /bin/sh -c #(nop)  CMD ["node"]                 0B
<missing>      /bin/sh -c set -ex   && for key in     6A010…   4.17MB
<missing>      /bin/sh -c #(nop)  ENV YARN_VERSION=1.3.2       0B
<missing>      /bin/sh -c ARCH= && dpkgArch="$(dpkg --print…   56.9MB
<missing>      /bin/sh -c #(nop)  ENV NODE_VERSION=8.9.4       0B
<missing>      /bin/sh -c set -ex   && for key in     94AE3…   129kB
<missing>      /bin/sh -c groupadd --gid 1000 node   && use…   335kB
<missing>      /bin/sh -c set -ex;  apt-get update;  apt-ge…   324MB
<missing>      /bin/sh -c apt-get update && apt-get install…   123MB
<missing>      /bin/sh -c set -ex;  if ! command -v gpg > /…   0B
<missing>      /bin/sh -c apt-get update && apt-get install…   44.6MB
<missing>      /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      /bin/sh -c #(nop) ADD file:1dd78a123212328bd…   123MB
```

但实际上，生成的镜像多了五个新层：每一个层对应 Dockerfile 里的一个语句。

现在，让我们来试试 Docker 的多阶段构建。

你可以继续使用与上面相同的 Dockerfile，只是现在要调用两次：

```sh
FROM node:8 as build
WORKDIR /app
COPY package.json index.js ./
RUN npm install
FROM node:8
COPY --from=build /app /
EXPOSE 3000
CMD ["index.js"]
```

Dockerfile 的第一部分创建了三个层，然后这些层被合并并复制到第二个阶段。在第二阶段，镜像顶部又添加了额外的两个层，所以总共是三个层。

![alt](https://img-blog.csdn.net/20180829100714764?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2Jid2FuZ2o=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

现在来验证一下。首先，构建容器：

```sh
docker build -t node-multi-stage .

```

查看镜像的历史：

```sh
$docker history node-multi-stage
IMAGE          CREATED BY                                      SIZE
331b81a245b1   /bin/sh -c #(nop)  CMD ["index.js"]             0B
bdfc932314af   /bin/sh -c #(nop)  EXPOSE 3000                  0B
f8992f6c62a6   /bin/sh -c #(nop) COPY dir:e2b57dff89be62f77…   1.62MB
b87c2ad8344d   /bin/sh -c #(nop)  CMD ["node"]                 0B
<missing>      /bin/sh -c set -ex   && for key in     6A010…   4.17MB
<missing>      /bin/sh -c #(nop)  ENV YARN_VERSION=1.3.2       0B
<missing>      /bin/sh -c ARCH= && dpkgArch="$(dpkg --print…   56.9MB
<missing>      /bin/sh -c #(nop)  ENV NODE_VERSION=8.9.4       0B
<missing>      /bin/sh -c set -ex   && for key in     94AE3…   129kB
<missing>      /bin/sh -c groupadd --gid 1000 node   && use…   335kB
<missing>      /bin/sh -c set -ex;  apt-get update;  apt-ge…   324MB
<missing>      /bin/sh -c apt-get update && apt-get install…   123MB
<missing>      /bin/sh -c set -ex;  if ! command -v gpg > /…   0B
<missing>      /bin/sh -c apt-get update && apt-get install…   44.6MB
<missing>      /bin/sh -c #(nop)  CMD ["bash"]                 0B
<missing>      /bin/sh -c #(nop) ADD file:1dd78a123212328bd…   123MB
```

文件大小是否已发生改变？

```sh
$docker images | grep node-
node-multi-stage   331b81a245b1   678MB
node-vanilla       075d229d3f48   679MB
```

最后一个镜像（node-multi-stage）更小一些。

你已经将镜像的体积减小了，即使它已经是一个很小的应用程序。

但整个镜像仍然很大！

有什么办法可以让它变得更小吗？

## 用 distroless 去除不必要的东西

这个镜像包含了 Node.js 以及 yarn、npm、bash 和其他的二进制文件。因为它也是基于 Ubuntu 的，所以你等于拥有了一个完整的操作系统，其中包括所有的小型二进制文件和实用程序。

但在运行容器时是不需要这些东西的，你需要的只是 Node.js。

Docker 容器应该只包含一个进程以及用于运行这个进程所需的最少的文件，你不需要整个操作系统。

实际上，你可以删除 Node.js 之外的所有内容。

但要怎么做？

所幸的是，谷歌为我们提供了 distroless（https://github.com/GoogleCloudPlatform/distroless）。

以下是 distroless 存储库的描述：

> “distroless” 镜像只包含应用程序及其运行时依赖项，不包含程序包管理器、shell 以及在标准 Linux 发行版中可以找到的任何其他程序。

这正是你所需要的！

你可以对 Dockerfile 进行调整，以利用新的基础镜像，如下所示：

```sh
FROM node:8 as build
WORKDIR /app
COPY package.json index.js ./
RUN npm install
FROM gcr.io/distroless/nodejs
COPY --from=build /app /
EXPOSE 3000
CMD ["index.js"]
```

你可以像往常一样编译镜像：

```sh
docker build -t node-distroless .

```

这个镜像应该能正常运行。要验证它，可以像这样运行容器：

```sh
docker run -p 3000:3000 -ti --rm --init node-distroless

```

现在可以访问 http://localhost:3000 页面。

不包含其他额外二进制文件的镜像是不是小多了？

```sh
$docker images | grep node-distroless
node-distroless   7b4db3b7f1e5   76.7MB
```

只有 76.7MB！

比之前的镜像小了 600MB！

但在使用 distroless 时有一些事项需要注意。

当容器在运行时，如果你想要检查它，可以使用以下命令 attach 到正在运行的容器上：

```sh
docker exec -ti <insert_docker_id> bash

```

attach 到正在运行的容器并运行 bash 命令就像是建立了一个 SSH 会话一样。

但 distroless 版本是原始操作系统的精简版，没有了额外的二进制文件，所以容器里没有 shell！

在没有 shell 的情况下，如何 attach 到正在运行的容器呢？

答案是，你做不到。这既是个坏消息，也是个好消息。

之所以说是坏消息，因为你只能在容器中执行二进制文件。你可以运行的唯一的二进制文件是 Node.js：

```sh
docker exec -ti <insert_docker_id> node

```

说它是个好消息，是因为如果攻击者利用你的应用程序获得对容器的访问权限将无法像访问 shell 那样造成太多破坏。换句话说，更少的二进制文件意味着更小的体积和更高的安全性，不过这是以痛苦的调试为代价的。

> 或许你不应在生产环境中 attach 和调试容器，而应该使用日志和监控。

但如果你确实需要调试，又想保持小体积该怎么办？

## 小体积的 Alpine 基础镜像

你可以使用 Alpine 基础镜像替换 distroless 基础镜像。

Alpine Linux 是：

> 一个基于 musl libc 和 busybox 的面向安全的轻量级 Linux 发行版。

换句话说，它是一个体积更小也更安全的 Linux 发行版。

不过你不应该理所当然地认为他们声称的就一定是事实，让我们来看看它的镜像是否更小。

先修改 Dockerfile，让它使用 node:8-alpine：

```sh
FROM node:8 as build
WORKDIR /app
COPY package.json index.js ./
RUN npm install
FROM node:8-alpine
COPY --from=build /app /
EXPOSE 3000
CMD ["npm", "start"]
```

使用下面的命令构建镜像：

```sh
docker build -t node-alpine .

```

现在可以检查一下镜像大小：

```sh
$docker images | grep node-alpine
node-alpine   aa1f85f8e724   69.7MB
```

69.7MB！

甚至比 distrless 镜像还小！

现在可以 attach 到正在运行的容器吗？让我们来试试。

让我们先启动容器：

```sh
$docker run -p 3000:3000 -ti --rm --init node-alpine
Example app listening on port 3000!
```

你可以使用以下命令 attach 到运行中的容器：

```sh
$docker exec -ti 9d8e97e307d7 bash
OCI runtime exec failed: exec failed: container_linux.go:296: starting container process caused "exec: \"bash\": executable file not found in $PATH": unknown
```

看来不行，但或许可以使用 shell？

```sh
docker exec -ti 9d8e97e307d7 sh / #

```

成功了！现在可以 attach 到正在运行的容器中了。

看起来很有希望，但还有一个问题。

Alpine 基础镜像是基于 muslc 的 C 语言的一个替代标准库，而大多数 Linux 发行版如 Ubuntu、Debian 和 CentOS 都是基于 glibc 的。这两个库应该实现相同的内核接口。

但它们的目的是不一样的：

- glibc 更常见，速度也更快；

- muslc 使用较少的空间，并侧重于安全性。

在编译应用程序时，大部分都是针对特定的 libc 进行编译的。如果你要将它们与另一个 libc 一起使用，则必须重新编译它们。

换句话说，基于 Alpine 基础镜像构建容器可能会导致非预期的行为，因为标准 C 库是不一样的。

你可能会注意到差异，特别是当你处理预编译的二进制文件（如 Node.js C++ 扩展）时。

例如，PhantomJS 的预构建包就不能在 Alpine 上运行。

## 你应该选择哪个基础镜像

你应该使用 Alpine、distroless 还是原始镜像？

如果你是在生产环境中运行容器，并且更关心安全性，那么可能 distroless 镜像更合适。

添加到 Docker 镜像的每个二进制文件都会给整个应用程序增加一定的风险。

只在容器中安装一个二进制文件可以降低总体风险。

例如，如果攻击者能够利用运行在 distroless 上的应用程序的漏洞，他们将无法在容器中使用 shell，因为那里根本就没有 shell！

> 请注意，OWASP 本身就建议尽量减少攻击表面。

如果你只关心更小的镜像体积，那么可以考虑基于 Alpine 的镜像。

它们的体积非常小，但代价是兼容性较差。Alpine 使用了略微不同的标准 C 库——muslc。你可能会时不时地遇到一些兼容性问题。

原始基础镜像非常适合用于测试和开发。

它虽然体积很大，但提供了与 Ubuntu 工作站一样的体验。此外，你还可以访问操作系统的所有二进制文件。
