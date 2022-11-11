- [**1 容器的本质是什么？**](#1-容器的本质是什么)
  - [**1.1 为何要这么做？**](#11-为何要这么做)
- [**2 Pod 实现原理**](#2-pod-实现原理)
  - [**2.1 只是一个逻辑概念**](#21-只是一个逻辑概念)
- [**3 容器设计模式**](#3-容器设计模式)
  - [**3.1 WAR 包与 Web 服务器**](#31-war-包与-web-服务器)
  - [**3.2 容器的日志收集**](#32-容器的日志收集)
- [**3 总结**](#3-总结)
- [**FAQ**](#faq)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/571033994?utm_source=cn.ticktick.task&utm_medium=social&utm_oi=70255225339904)

在 Kubernetes 里部署一个应用的过程。Pod，是 Kubernetes 项目中最小的 API 对象。更专业说法，是 Kubernetes 项目的原子调度单位。

Docker 容器本质不过 “Namespace 做隔离，Cgroups 做限制，rootfs 做文件系统”，为何 Kubernetes 又搞个 Pod？

## **1 容器的本质是什么？**

是进程！就是未来云计算系统中的进程；容器镜像就是这个系统里的 “.exe” 安装包。

那 Kubernetes 呢？就是操作系统！

登录到一台 Linux 机器里，执行如下命令：

```
$pstree -g

```

展示当前系统中正在运行的进程的树状结构。结果：

```log
systemd(1)-+-accounts-daemon(1984)-+-{gdbus}(1984)
           | `-{gmain}(1984)
           |-acpid(2044)
          ...
           |-lxcfs(1936)-+-{lxcfs}(1936)
           | `-{lxcfs}(1936)
           |-mdadm(2135)
           |-ntpd(2358)
           |-polkitd(2128)-+-{gdbus}(2128)
           | `-{gmain}(2128)
           |-rsyslogd(1632)-+-{in:imklog}(1632)
           |  |-{in:imuxsock) S 1(1632)
           | `-{rs:main Q:Reg}(1632)
           |-snapd(1942)-+-{snapd}(1942)
           |  |-{snapd}(1942)
           |  |-{snapd}(1942)
           |  |-{snapd}(1942)
           |  |-{snapd}(1942)

```

在一个真正的 os，进程并非 “孤苦伶仃” 独自运行，而是以进程组，“有原则的”组织在一起。该进程树状图中，每个进程后面括号里的数字，就是它的进程组 ID（Process Group ID, PGID）。

如 rsyslogd 程序负责 Linux 日志处理。可见 rsyslogd 的主程序 main，和它要用到的内核日志模块 imklog 等，同属 1632 进程组。这些进程相互协作，共同完成 rsyslogd 程序的职责。

对 os，这样的进程组更方便管理。Linux 操作系统只需将信号，如 SIGKILL 信号，发给一个进程组，该进程组中的所有进程就都会收到这个信号而终止运行。

而 Kubernetes 所做的，其实就是将 “进程组” 的概念映射到容器技术，并使其成为云计算 “os” 里的“一等公民”。

### **1.1 为何要这么做？**

Borg 项目的开发和实践中，Google 发现，他们部署的应用，往往存在类似 “进程和进程组” 的关系。即这些应用之间有着密切协作关系，使得它们必须部署在同一台机器。

若事先没有 “组” 的概念，这种运维关系就很难处理。

以 rsyslogd 为例。已知 rsyslogd 由三个进程组成：

- 一个 imklog 模块
- 一个 imuxsock 模块
- 一个 rsyslogd 自己的 main 函数主进程

这三个进程要运行在同一机器，否则它们之间基于 Socket 的通信和文件交换，都会有问题。

现在，要把 rsyslogd 应用给容器化，但受限于容器的 “单进程模型”，这三个模块须被分别制作成三个不同容器。而在这三个容器运行时，它们设置的内存配额都是 1GB。

> 容器的 “单进程模型”，并非指容器里只能运行“一个” 进程，而是容器没有管理多个进程的能力。因为容器里 PID=1 的进程就是应用本身，其他进程都是这个 PID=1 进程的子进程。可用户编写的应用，并不能像正常 os 里的 init 进程或 systemd 那样拥有进程管理的功能。如你的应用是个 Java Web 程序（PID=1），然后你执行 docker exec 在后台启动了一个 Nginx 进程（PID=3）。可当该 Nginx 进程异常退出时，你怎么知道？该进程退出后的 GC 工作，又由谁去做？

假设 Kubernetes 集群上有两个节点：

- node-1 上有 3 GB 可用内存
- node-2 有 2.5 GB 可用内存

假设我用 Swarm 运行该 rsyslogd 程序。为能够让这三容器都运行在同一机器，须在另外两个容器设置 affinity=main（与 main 容器有亲密性）的约束，即：它们俩必须和 main 容器运行在同一机器。

然后，顺序执行：

- docker run main
- docker run imklog
- docker run imuxsock

创建这三个容器。这样，这三个容器都会进入 Swarm 待调度队列。然后，main 容器和 imklog 容器都先后出队并被调度到 node-2（这 case 完全有可能）。

可当 imuxsock 容器出队开始被调度时，Swarm 就懵了：node-2 上的可用资源只有 0.5 GB 了，并不足以运行 imuxsock 容器；可根据 affinity=main 的约束，imuxsock 容器又只能运行在 node-2。

这就是典型的成组调度（gang scheduling）没有被妥善处理的 case。如 Mesos 就有个资源囤积（resource hoarding）机制，会在所有设置了 Affinity 约束的任务都达到时，才开始对它们统一调度。而在 Google Omega 论文提出使用乐观调度处理冲突的方法，即：先不管这些冲突，而是通过精心设计的回滚机制在出现冲突后解决问题。

可都谈不上完美。资源囤积带来不可避免的调度效率损失和死锁可能；而乐观调度的复杂程度，不是常规技术团队所能驾驭。

但到 Kubernetes 这问题迎刃而解：Pod 是 Kubernetes 里的原子调度单位。即 Kubernetes 的调度器统一按 Pod 而非容器的资源需求进行计算。

所以，像 imklog、imuxsock 和 main 函数主进程这样的三个容器，正是典型的由三个容器组成的 Pod。Kubernetes 调度时，自然就会去选择可用内存 3G 的 node-1 节点进行绑定，而不会考虑 node-2。

像这样容器间的紧密协作，可称为 “超亲密关系”，有“超亲密关系” 容器的典型特征包括但不限于：

- 互相之间会发生直接的文件交换
- 使用 localhost 或者 Socket 文件进行本地通信
- 会发生非常频繁的远程调用
- 需要共享某些 Linux Namespace（如一个容器要加入另一个容器的 Network Namespace）

即并非所有有 “关系” 的容器都属同一 Pod。如 PHP 应用容器和 MySQL 虽也发生访问关系，但并没有必要、也不该部署在同一机器，更适合做成两个 Pod。

一般都是先学会用 Docker 这种单容器工具，才开始接触 Pod。若 Pod 设计只是调度考虑，那 Kubernetes 似乎完全没必要非得把 Pod 作为 “一等公民”？这不故意增加学习门槛？

若只处理 “超亲密关系” 调度问题，有 Borg 和 Omega 论文，Kubernetes 项目肯定可以在调度器层解决。但 Pod 在 Kubernetes 还有更重要的意义：**容器设计模式**。

## **2 Pod 实现原理**

### **2.1 只是一个逻辑概念**

即 Kubernetes 真正处理的，还是宿主机 os 上 Linux 容器的 Namespace 和 Cgroups，而并不存在一个所谓的 Pod 的边界或隔离环境。

那 Pod 又怎么被 “创建” 的？其实是一组共享了某些资源的容器。Pod 里的所有容器，共享的是同一 Network Namespace，并且可声明共享同一个 Volume。

这么看，一个有 A、B 两个容器的 Pod，不就是等同于一个容器（容器 A）共享另外一个容器（容器 B）的网络和 Volume？

这好像通过 docker run --net --volumes-from 就能实现，如：

```
$docker run --net=B --volumes-from=B --name=A image-A ...

```

若真这么做，容器 B 就须比容器 A 先启动，这样一个 Pod 里的多个容器就不是对等关系，而是拓扑关系。

所以，在 Kubernetes Pod 的实现需要使用一个中间容器 - Infra 容器。在该 Pod 中，Infra 容器永远都是第一个被创建的容器，而其他用户定义的容器，则通过 Join Network Namespace，与 Infra 容器关联在一起。组织关系如下：

![](https://pic4.zhimg.com/v2-03e4ef69cf227e7b167e4ba04049667b_r.jpg)

该 Pod 有两个用户容器 A、B，还有个 Infra 容器。Kubernetes 里的 Infra 容器一定要占用极少资源，所以它使用特殊镜像：`k8s.gcr.io/pause`。这是汇编语言编写的、永处于 “暂停” 状态的容器，解压后的大小也只有 100~200KB。

在 Infra 容器 “Hold 住”Network Namespace 后，用户容器就能加入 Infra 容器的 Network Namespace。所以，若查看这些容器在宿主机上的 Namespace 文件（该 Namespace 文件的路径），它们指向的值一定完全一样。

即对 Pod 里的容器 A、B：

- 它们能直接使用 localhost 进行通信
- 它们看到的网络设备跟 Infra 容器看到的完全一样
- 一个 Pod 只有一个 IP 地址，也就是这个 Pod 的 Network Namespace 对应的 IP 地址
- 其他所有网络资源，都是一个 Pod 一份，且被该 Pod 中的所有容器共享
- Pod 的生命周期只跟 Infra 容器一致，与容器 A、B 无关

而对同一 Pod 里的所有用户容器，它们的进出流量，也可认为都是通过 Infra 容器完成。将来若你要为 Kubernetes 开发一个网络插件，应重点考虑如何配置这个 Pod 的 Network Namespace，而非每个用户容器如何使用你的网络配置，这没意义。

即若你的网络插件需在容器里安装某些包或配置才能完成的话，是不可取的：Infra 容器镜像的 rootfs 里几乎啥都没，没你随意发挥的空间。这也意味着你的网络插件完全不必关心用户容器的启动与否，而只需关注如何配置 Pod，即 Infra 容器的 Network Namespace。

有了该设计，共享 Volume 就简单了：Kubernetes 只要把所有 Volume 的定义都设计在 Pod 层级。

这样，一个 Volume 对应的宿主机目录对 Pod 就只有一个，Pod 里的容器只要声明挂载该 Volume，就一定能共享这个 Volume 对应的宿主机目录。如下案例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: two-containers
spec:
  restartPolicy: Never
  volumes:
    - name: shared-data
      hostPath:
        path: /data
  containers:
    - name: nginx-container
      image: nginx
      volumeMounts:
        - name: shared-data
          mountPath: /usr/share/nginx/html
    - name: debian-container
      image: debian
      volumeMounts:
        - name: shared-data
          mountPath: /pod-data
      command: ["/bin/sh"]
      args:
        ["-c", "echo Hello from the debian container > /pod-data/index.html"]
```

debian-container 和 nginx-container 都声明挂载了 shared-data 这个 Volume。而 shared-data 是 hostPath 类型。所以，它对应在宿主机上的目录就是：/data。该目录就被同时绑定挂载进上述两个容器。

这就是为何 nginx-container 可从它的 / usr/share/nginx/html 目录中，读取到 debian-container 生成的 index.html 文件。

## **3 容器设计模式**

Pod 这种 “超亲密关系” 容器的设计思想，就是希望，当用户想在一个容器里跑多个功能不相关的应用时，应优先考虑它们是不是更应被描述成一个 Pod 里的多个容器。

为掌握这种思考方式，应尽量尝试使用它来描述一些用单容器难解决的问题。

### **3.1 WAR 包与 Web 服务器**

现有一 Java Web 应用的 WAR 包，需放在 Tomcat 的 webapps 目录下运行起来。假如现在只能用 Docker，如何处理该组合关系？

- 把 WAR 包直接放在 Tomcat 镜像的 webapps 目录，做成一个新镜像运行。可这时，若你要更新 WAR 包内容或升级 Tomcat 镜像，就要重新制作一个新的发布镜像，麻烦！
- 不管 WAR 包，永远只发布一个 Tomcat 容器。但该容器的 webapps 目录，须声明一个 hostPath 类型的 Volume，从而把宿主机上的 WAR 包挂载进 Tomcat 容器当中运行起来。但这样就须解决：如何让每台宿主机，都预先准备好这个存储有 WAR 包的目录？看来，你只能独立维护一套分布式存储系统。

有 Pod 之后，这样的问题很容易解决。把 WAR 包和 Tomcat 分别做成镜像，然后把它们作为一个 Pod 里的两个容器 “组合”。该 Pod 的配置文件：

```
apiVersion: v1
kind: Pod
metadata:
  name: javaweb-2
spec:
  initContainers:
  - image: javaedge/sample:v2
    name: war
    command: ["cp", "/sample.war", "/app"]
    volumeMounts:
    - mountPath: /app
      name: app-volume
  containers:
  - image: javaedge/tomcat:7.0
    name: tomcat
    command: ["sh","-c","/root/apache-tomcat-7.0.42-v2/bin/start.sh"]
    volumeMounts:
    - mountPath: /root/apache-tomcat-7.0.42-v2/webapps
      name: app-volume
    ports:
    - containerPort: 8080
      hostPort: 8001
  volumes:
  - name: app-volume
    emptyDir: {}

```

该 Pod 定义两个容器，第一个容器使用的镜像是 javaedge/sample:v2，这个镜像里只有一个 WAR 包（sample.war）放在根目录下。而第二个容器则使用的是一个标准的 Tomcat 镜像。

WAR 包容器的类型不再是个普通容器，而是个 Init Container 类型。

Pod 中所有 Init Container 定义的容器，都会比 spec.containers 定义的用户容器先启动。且 Init Container 容器会按序逐一启动，直到它们都启动并且退出，用户容器才启动。

所以，该 Init Container 类型的 WAR 包容器启动后，执行 "cp /sample.war /app"，把应用的 WAR 包拷贝到 / app 目录，然后退出。

而后该 / app 目录，就挂载了一个名叫 app-volume 的 Volume。

Tomcat 容器同样声明了挂载 app-volume 到自己的 webapps 目录下。所以，等 Tomcat 容器启动，其 webapps 目录下就一定会存在 sample.war 文件：这文件正是 WAR 包容器启动时拷贝到这 Volume 里的，而这个 Volume 被这两个容器共享。

像这就用 “组合”，解决了 WAR 包与 Tomcat 容器的耦合问题。这所谓的“组合” 操作，正是容器设计模式里最常用的一种模式：sidecar。即可以在一个 Pod 中，启动一个辅助容器，来完成一些独立于主进程（主容器）之外的工作。

如在我们的这个应用 Pod 中，Tomcat 容器是主容器，而 WAR 包容器的存在，只是给它提供一个 WAR 包。所以，用 Init Container 的方式优先运行 WAR 包容器，扮演 sidecar 角色。

### **3.2 容器的日志收集**

现有一应用，需不断将日志文件输出到容器的 / var/log 目录。就能把一个 Pod 里的 Volume 挂载到应用容器的 / var/log 目录。

然后，在该 Pod 里同时运行一个 sidecar 容器，它也声明挂载同一个 Volume 到自己的 / var/log 目录。

接下来，sidecar 容器就只需不断从自己的 / var/log 目录读取日志文件，转发到 MongoDB 或 ES 中存储起来。这样，一个最基本的日志收集工作完成了。

该例中的 sidecar 的主要也是使用共享的 Volume 完成对文件的操作。

Pod 另一重要特性：它的所有容器都共享同一 Network Namespace。这使得很多与 Pod 网络相关的配置和管理，也都能交给 sidecar，而完全无须干涉用户容器。最典型的莫过 Istio。

> Kubernetes 社区把 “容器设计模式” 理论理成的[论文](https://link.zhihu.com/?target=https%3A//www.usenix.org/conference/hotcloud16/workshop-program/presentation/burns)。

## **3 总结**

仍很多人把容器跟虚拟机相比，把容器当做性能更好的 VM，讨论如何把应用从 VM 无缝迁移到容器。

但无论是从实现原理还是使用方法、特性、功能等方面，容器与 VM 几乎无任何相似。也不存在一种普遍的方法，能够把虚拟机里的应用无缝迁移到容器中。因为，容器的性能优势，必伴随缺陷，即它不能像 VM，完全模拟本地物理机环境中的部署方法。所以，“上云” 最终还是要深入理解容器本质，即进程。

一个运行在 VM 里的应用，都被管理在 systemd 或 supervisord 下的一组进程，而非一个进程。这跟本地物理机上应用的运行方式一样。这也是为何，从物理机到虚拟机之间的应用迁移不难。

可一个容器永远只能管理一个进程，一个容器就是一个进程。所以，将一个原运行在虚拟机的应用，“无缝迁移” 到容器，和容器的本质相悖。

所以 Swarm 无法成长：一旦到生产环境，Swarm 这种单容器工作方式，难以描述真实世界的应用架构。所以，你可理解 Pod 本质：扮演传统基础设施里 “VM” 的角色；而容器，则是该 VM 里运行的用户程序。

所以下一次，当你需要把一个运行在 VM 的应用迁移到 Docker 容器，仔细分析到底有哪些进程（组件）运行在这 VM 里。

然后，你就能把整个 VM 想象成为一个 Pod，把这些进程分别做成容器镜像，把有顺序关系的容器，定义为 Init Container。这才是更合理的、松耦合的容器编排，也是从传统应用架构，到 “微服务架构” 最自然的过渡。

> Pod 提供的是一种编排思想，而非具体技术方案。若愿意，完全可使用 VM 作为 Pod 实现，然后把用户容器都运行在该 VM。如 Mirantis 公司的 [virtlet 项目](https://link.zhihu.com/?target=https%3A//github.com/Mirantis/virtlet)。甚至，你能实现一个带 Init 进程的容器项目，模拟传统应用的运行方式。

相反的，若强行把整个应用塞到一个容器，甚至不惜使用 Docker In Docker，则后患无穷。

## **FAQ**

除了 Network Namespace 外，Pod 里的容器还可以共享哪些 Namespace 呢？你能说出共享这些 Namesapce 的具体应用场景吗？
