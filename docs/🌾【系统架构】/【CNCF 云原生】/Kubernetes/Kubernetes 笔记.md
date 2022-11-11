- [CNCF 云原生](#cncf-云原生)
  - [云原生应用](#云原生应用)
  - [CI/CD 持续集成与发布](#cicd-持续集成与发布)
- [kubernetes](#kubernetes)
  - [一些概念](#一些概念)
  - [安装配置](#安装配置)
    - [k3s](#k3s)
    - [kind](#kind)
    - [minikube](#minikube)
  - [pod](#pod)
    - [服务发现](#服务发现)
    - [pod 协同](#pod-协同)
    - [★ pod 生命周期](#-pod-生命周期)
  - [★ 控制器](#-控制器)
  - [网络通讯模式](#网络通讯模式)
  - [服务发现](#服务发现-1)
  - [存储](#存储)
    - [volume](#volume)
      - [enptyDir](#enptydir)
      - [hostPath](#hostpath)
    - [pv](#pv)
  - [调度器](#调度器)
  - [集群安全机制](#集群安全机制)
    - [认证](#认证)
    - [鉴权](#鉴权)
    - [访问控制](#访问控制)
  - [HELM](#helm)
  - [运维](#运维)
    - [kubeadm](#kubeadm)
    - [高可用](#高可用)
- [管理工具](#管理工具)
  - [kubelet](#kubelet)
  - [kubectl](#kubectl)
  - [yml 编排配置文件](#yml-编排配置文件)
- [架构与原理](#架构与原理)
  - [重要概念](#重要概念)
- [学习过程中的疑问](#学习过程中的疑问)
- [其他](#其他)
- [参考资料](#参考资料)

# CNCF 云原生

> Cloud Native Computing Foundation 云原生计算基金会

[什么是云原生？这回终于有人讲明白了](https://zhuanlan.zhihu.com/p/150190166)

[以业务为核心的云原生体系建设](https://mp.weixin.qq.com/s?__biz=MzI1NzYzODk4OQ==&mid=2247485447&idx=1&sn=5aed0de927f7e799948db417bc7942dc&chksm=ea151f25dd629633663276fb90308b944394bee88f58d1f285311ee93eb12c485d24cb84e56d&scene=21#%E7%A0%94%E5%8F%91%E6%B5%81%E7%A8%8B%EF%BC%9A%E6%B5%8B%E8%AF%95%E4%B8%8E%E5%8F%91%E5%B8%83%E6%89%8B%E5%B7%A5%E5%8C%96%E5%8F%8A%E8%84%9A%E6%9C%AC%E5%8C%96)

云原生技术有利于各组织在公有云、私有云和混合云等新型动态环境中，构建和运行可贪心扩展的应用。云原生的代表性技术包括容器、服务网格、微服务、不可变基础设施建设和声明式 API

- 容器是 k8s 的底层引擎

- 服务网格是建立在 k8s 上的针对请求的扩展功能

- 不可变基础设施是现代运维的基石

- 声明式 API 是 k8s 的编码方式

  通过工具描述自己想要让事物达到的目标状态，然后由这个工具自己内部去达成这个目标，声明式设计描述的是目标状态，即 HOW；

  声明式 API 声明了系统要执行的动作，然后系统不断向这个状态启动，比如 SQL 语句

  过程式设计，所描述的是一系列动作，即 WHAT

  命令式 API 可以直接发出服务器要执行的命令

- 微服务是一种软件架构

这些技术能够构建容错性好、易于管理和便于观察的松耦合系统。结合可靠性的自动化手段，云原生技术使工程师能够轻松地对系统做出频繁和可预测的重大变更。

云原生不是某一种具体的技术或框架，**而是一类思想的集合**，技术要点包括服务网格、微服务和容器化等；管理要点包括 DevOps、康威定律等

云原生的基础架构

- 侵入式架构

  指服务框架嵌入程序代码，开发者组合各种组件，如 RPC、负载均衡、熔断等，实现微服务架构

- 非侵入式架构

  是一代理的形式与应用程序部署在一起，代理接管应用程序的网络，且对应用程序透明，以服务网格为代表

服务网格也是运行在 kubernetes 上， kubernetes 对资源的动态调度有极强的能力，用户可以快速编排出复杂的环境、复杂依赖关系的应用程序，同时开发者又无须过分关心应用程序的监控、扩展性、服务发现和分布式追踪这些繁琐的事情

![alt](https://jimmysong.io/kubernetes-handbook/images/cloud-native-architecutre-mindnode.jpg)

- 应用容器化

- 面向微服务架构

- 应用支持容器的编排调度

- 不明白为什么要指定用 RESTful API 通信？

## 云原生应用

**12 因素**

## CI/CD 持续集成与发布

不可变基础设施

![使用 Jenkins 进行持续集成与发布流程图](https://jimmysong.io/kubernetes-handbook/images/kubernetes-jenkins-ci-cd.png)

应用构建与发布流程说明（**开发人员只需要推代码到仓库，就可以完成自动构建和部署**）：

1. 用户向 Gitlab 提交代码，代码中必须包含 Dockerfile

2. 将代码提交到远程仓库

3. 用户在发布应用时需要填写 git 仓库地址和分支、服务类型、服务名称、资源数量、实例个数，确定后触发 Jenkins 自动构建

4. Jenkins 的 CI 流水线自动编译代码并打包成 Docker 镜像推送到 Harbor 镜像仓库

5. Jenkins 的 CI 流水线中包括了自定义脚本，根据我们已准备好的 Kubernetes 的 YAML 模板，将其中的变量替换成用户输入的选项

6. 生成应用的 Kubernetes YAML 配置文件

7. 更新 Ingress 的配置，根据新部署的应用的名称，在 Ingress 的配置文件中增加一条路由信息

8. 更新 PowerDNS，向其中插入一条 DNS 记录，IP 地址是边缘节点的 IP 地址。关于边缘节点，请查看 边缘节点配置

9. Jenkins 调用 Kubernetes 的 API，部署应用

# kubernetes

## 一些概念

- kubernetes 1.24 以前：

  ![alt](https://img-blog.csdnimg.cn/img_convert/0cdf9775c1a7159a6807b01f4d78fc5d.png)

- kubernetes 1.24 之后：如还想继续在 k8s 中使用 docker，需要自行安装 cri-dockerd 组件； 不然就使用 containerd

  ![alt](https://img-blog.csdnimg.cn/img_convert/e999b1b1d0978ae7014396b989b36434.png)

## 安装配置

[play_with_k8s 在线玩 k8s 的一个实验室](https://labs.play-with-k8s.com/)

[【容器架构】Minikube vs.kind vs.k3s-我应该用哪一个？](https://jiagoushi.pro/minikube-vs-kind-vs-k3s-what-should-i-use)

[kubeadm 部署 Kubernetes1.24_cri-docker 版本](https://blog.csdn.net/weixin_38299857/article/details/125143330)

[kubeadm 安装 Kubernetes v1.24.0 docker](https://www.cnblogs.com/zz-code/p/16323591.html)

### k3s

[K3d vs Kind 谁更适合本地研发](https://xie.infoq.cn/article/c19879da96a3adcca1ceed58b)

这个好像又是比 kind 更好的本地环境搭建工具，资源占用，启动速度都更好

通过对比可以看出 k3d 和 kind 的相似点很多，但两方的使用场景还是略有差别。Kind 更贴近原生 Kubernetes，适合用于开发测试 Kubernetes 原生组件、资源比较充沛的开发者；

而 K3s 则更适合边缘计算场景应用开发、资源紧张、使用非 x86 CPU 架构设备的开发者。如果你只是想学习 Kubernetes 集群的操作、各种资源的使用、Kubernetes 相关项目的尝鲜，则这两个工具都是不错的选择。

### kind

kind 比 minikube 更好地构建本地学习环境

![alt](https://static001.geekbang.org/infoq/70/709300894f53ff8d1207a7291fe65c5a.jpeg?x-oss-process=image/resize,p_80/auto-orient,1)

[kind 官网](https://kind.sigs.k8s.io/)

[基于 WSL2 和 Kind 或 Minikube：搭建 Windows 版 Kubernetes](https://www.kubernetes.org.cn/7723.html)

[基于 Kind 的 Kubernetes 环境部署](https://zhuanlan.zhihu.com/p/550841894)

**安装和使用**

```sh
# 用指定配置文件创建集群
kind create cluster --name [cluster_name] --config ./kind-3nodes.yaml

# 查看集群
kind get clusters

# 删除集群
kind delete cluster --name [cluster_name]

```

**本地 docker 镜像**

[kind 使用本地镜像](https://www.cnblogs.com/baixiaoyong/p/16051139.html)

[官网: Local Registry](https://kind.sigs.k8s.io/docs/user/local-registry/)

```
# 内网环境无法下载镜像，会出现 ImagePullBackOff 错误

$kubectl get pods
NAME                         READY   STATUS             RESTARTS   AGE
simpleweb-788865cb7c-gmz44   0/1     ImagePullBackOff   0          115s
simpleweb-788865cb7c-zwrl4   0/1     ImagePullBackOff   0          115s

# 查看 pod 信息
kubectl describe pod simpleweb-788865cb7c-zwrl4
```

### minikube

[Minikube 快速入门手册](https://www.jianshu.com/p/ef400bfea973)

一套完整的 Kubernetes 集群至少需要包括 master 节点和 node 节点，下图是常规 k8s 的集群架构，master 节点一般是独立的，用于协调调试其它节点之用，而容器实际运行都是在 node 节点上，kubectl 位于 master 节点。

kubernetes 是一主多从或者多主多从，需要多台服务器，minikube 则是可以在个人电脑上部署 k8s 学习环境的工具；Minikube 的架构，可以看出，master 节点与其它节点合为一体，而整体则通过宿主机上的 kubectl 进行管理，这样可以更加节省资源。

![alt](https://upload-images.jianshu.io/upload_images/16254840-4bec1f9098962451.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

## pod

- 在 kubernetes 中，pod 是由一组进行了资源限制的，在隔离环境中的容器组成。

### 服务发现

### pod 协同

### ★ pod 生命周期

## ★ 控制器

## 网络通讯模式

## 服务发现

## 存储

### volume

#### enptyDir

#### hostPath

### pv

## 调度器

能够根据要求把 pod 定义到想要的节点上运行

## 集群安全机制

### 认证

### 鉴权

### 访问控制

## HELM

作为 K8S 应用包管理器，它把一个 K8S 应用抽象成一个包，一键就可以部署一个应用，跟很多包管理器一样，它也有源 KubeApps Hub（甚至有阿里云提供的 国内源）。

## 运维

### kubeadm

### 高可用

# 管理工具

- Kubelet 负责与其他节点集群通信，并进行本节点 Pod 和容器生命周期的管理。Kubeadm 是 Kubernetes 的自动化部署工具，降低了部署难度，提高效率。Kubectl 是 Kubernetes 集群管理工具。

- Kubelet 通过 gRPC 框架与容器运行时或 shim 进行通信，其中 kubelet 作为客户端，CRI shim（也可能是容器运行时本身）作为服务器。

## kubelet

## kubectl

[kubectl 详细介绍](https://blog.csdn.net/as_dingjia/article/details/120364679)

kubectl 是一个命令行工具，用于与 Kubernetes 集群和其中的 pod 节点进行通信。使用它你可以查看集群的状态，列出集群中的所有 pod，进入 pod 中执行命令等。你还**可以使用 YAML 文件定义资源对象，然后使用 kubectl 将其应用到集群中**。

```sh
# 查看集群信息
kubectl cluster-info

# 查看节点信息
kubectl get nodes
# NAME                              STATUS   ROLES           AGE   VERSION
# wslkindmultinodes-control-plane   Ready    control-plane   25m   v1.24.0
# wslkindmultinodes-worker          Ready    <none>          24m   v1.24.0
# wslkindmultinodes-worker2         Ready    <none>          24m   v1.24.0

# 查看所有服务
kubectl get all --all-namespaces

# 创建仪表板
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-rc6/aio/deploy/recommended.yaml

# -n 查看 kubernetes-dashboard 命名空间下的服务
kubectl get all -n kubernetes-dashboard

kubectl get pods -A

# 开启代理，可以通过浏览器来访问管理页面了
# 允许通过外网访问
# https://www.cnblogs.com/builderman/p/13831788.html
kubectl proxy --address="0.0.0.0" --accept-hosts="^*$"

# 创建个 Token 用来登录管理页面
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
EOF
# Create a ClusterRoleBinding for the ServiceAccount
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
EOF

kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: admin-user-secret
  namespace: kubernetes-dashboard
  annotations:
    kubernetes.io/service-account.name: admin-user
type: kubernetes.io/service-account-token
EOF

# 生成 Token
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')

# 浏览器访问
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

```

```sh
kubectl describe pods [pod_name] -n [namespace]
kubectl delete -f [xxx.yml]

```

## yml 编排配置文件

![alt](https://files.mdnice.com/pic/43971ef9-055e-4cbe-8bdd-d06c43e56d75.png)

# 架构与原理

![alt](http://upload-images.jianshu.io/upload_images/16254840-44f55035f12879c9.png)

Kubernetes 运行在节点 (node) 上，节点是集群中的单个机器。如果你有自己的硬件，节点可能对应于物理机器，但更可能对应于在云中运行的虚拟机。节点是部署你的应用或服务的地方，是 Kubernetes 工作的地方。有 2 种类型的节点 ——master 节点和 worker 节点，所以说 Kubernetes 是主从结构的。

Kubernetes 中的逻辑而非物理的工作单位称为 `pod`。一个 pod 类似于 Docker 中的容器。记得我们在前面讲到，容器可以让你创建独立、隔离的工作单元，可以独立运行。但是要创建复杂的应用程序，比如 Web 服务器，你经常需要结合多个容器，然后在一个 pod 中一起运行和管理。这就是 pod 的设计目的 —— **一个 pod 允许你把多个容器，并指定它们如何组合在一起来创建应用程序**。而这也进一步明确了 Docker 和 Kubernetes 之间的关系 —— 一个 Kubernetes pod 通常包含一个或多个 Docker 容器，所有的容器都作为一个单元来管理。

Kubernetes 中的 service 是一组逻辑上的 pod。把一个 service 看成是一个 pod 的逻辑分组，它提供了一个单一的 IP 地址和 DNS 名称，你可以通过它访问服务内的所有 pod。有了服务，就可以非常容易地设置和管理负载均衡，当你需要扩展 Kubernetes pod 时，这对你有很大的帮助，我们很快就会看到。

请记住，我们使用 Kubernetes 而不是直接使用 Docker 的原因之一，是因为 **Kubernetes 能够自动扩展应用实例的数量以满足工作负载的需求**。

自动缩放是通过集群设置来实现的，当服务需求增加时，增加节点数量，当需求减少时，则减少节点数量。但也要记住，节点是 “物理” 结构 —— 我们把 “物理” 放在引号里，因为要记住，很多时候，它们实际上是虚拟机。

无论如何，节点是物理机器的事实意味着我们的云平台必须允许 Kubernetes 引擎创建新机器。各种云提供商对 Kubernetes 支持基本都满足这一点。

![alt](https://img2022.cnblogs.com/blog/1875656/202205/1875656-20220529121458000-805163363.webp)

## 重要概念

- Cluster

  是计算、存储和网络资源的集合，Kubernetes 利用这些资源运行各种基于容器的应用；

- Master 节点

  主要职责是调度，即决定将应用放在哪里运行,为了实现高可用，可以运行多个 Master;

  主要的核心组件：api server/Controller Manager/scheduler/etcd

- Node 节点

  由 Master 管理，职责是运行容器应用；

  主要的核心组件：kubelet、kube-proxy

- Pod

  Kubernetes 的最小工作单元，每个 Pod 包含一个或多个容器；

  引入 Pod 主要基于下面两个目的：

  可管理性：有些容器天生就是需要紧密联系，一起工作；

  通信和资源共享：Pod 中的所有容器使用同一个网络 namespace，即相同的 IP 地址和 Port 空间。它们可以直接用 localhost 通信；

- Kubernetes 运行容器（Pod）与访问容器（Pod）这两项任务分别由 Controller 和 Service 执行;

- Controller

  Kubernetes 通常不会直接创建 Pod，而是通过 Controller 来管理 Pod 的；

  Controller 中定义了 Pod 的部署特性，比如有几个副本，在什么样的 Node 上运行等；

  为了满足不同的业务场景，Kubernetes 提供了多种 Controller，包括 Deployment、ReplicaSet、DaemonSet、StatefuleSet、Job 等；

- Deployment

  最常用的 Controller，通过创建 Deployment 来部署应用的；

  - ReplicaSet

    实现了 Pod 的多副本管理;通常不需要直接使用 ReplicaSet;

  - DaemonSet

    用于每个 Node 最多只运行一个 Pod 副本的场景;

  - StatefuleSet

    能够保证 Pod 的每个副本在整个生命周期中名称是不变的;

  - Job

    用于运行结束就删除的应用;而其他 Controller 中的 Pod 通常是长期持续运行。

  - Service

  定义了外界访问一组特定 Pod 的方式。Service 有自己的 IP 和端口，Service 为 Pod 提供了负载均衡;

- Namespace

  Namespace 可以将一个物理的 Cluster 逻辑上划分成多个虚拟 Cluster，每个 Cluster 就是一个 Namespace。不同 Namespace 里的资源是完全隔离的

  Kubernetes 默认创建了两个 Namespace;

  - default 创建资源时如果不指定，将被放到这个 Namespace;

  - kube-system Kubernetes 自己创建的系统资源将放到这个 Namespace 中;

# 学习过程中的疑问

- **牵扯到好多概念。。。dockerd、cri-docker、containerd 等等，又说 k8s 不再支持 docker 用来做容器引擎**

  这和 docker 容器发展历史有关系

- **什么是编排，为什么要编排？**

  本来的话，我直接手动配置、拉起 docker 也不是不可以，升级也是，手动升级，提交镜像；但是在大规模场景下，就不可能靠手动去完成这些繁琐的动作了；

  最好是有个工具，可以自动帮我们完成部署发布，包括存储的挂载、容器的网络配置、容器端口映射管理、镜像更新和回滚等等问题。

  或者我要访问其他跑在容器外部的服务，但是我不知道他们的地址和端口

  比较挫的方法是，挂载一个配置文件 `env.conf` 这个文件记录着所有服务的入口

  或者是在启动容器的时候，指定环境变量，容器内的服务根据该环境变量获取服务入口

  kubernetes 在希腊语中是舵手、船长的意思；container 是集装箱的意思；docker 是码头工人的意思；很形象，主题是 container，docker 是管理这些 container 的；kubernetes 是把很多 container 管理起来的；

  容器编排系统，对性能要求高，kubernetes 用 go 语言实现，更轻量级（资源消耗小）

  而且支持弹性伸缩、支持 IPVS 的负载均衡方式

  怎么收集日志呢？日志散落在各个 docker 内部，或者都映射到宿主机上了

  支持监控容器健康状态，自动拉取容器等

- **云原生应用，可能镜像都比应用大很多？**

  你也不缺这点空间啊，不要纠结几十兆的问题

- **k8s 和 docker-compose 有什么关联？**

  docker-compose 是 docker 官方的一个简单的编排工具，可以用来单机部署一些环境；k8s 强多了

- **学这个 k8s 到底是学什么？像 MySQL 那样了解他的实现远离吗？还是说要编码写他的插件啥的？**

- **docker 更适合运行像 Nginx 那样的无状态服务吧，支持伸缩；k8s 可以支持无状态服务的管理吗，服务的状态、数据怎么处理？用持久化方式吗？存储？**

# 其他

现在，我们需要增加后端资源，使浏览我们网站的用户在浏览页面时加载时间不会过长或者超时。最简单的方式就是增加容器的数量，然后使用负载均衡器将传入的负载（以用户请求的形式）分配给容器。

这样做虽然行之有效，但也只能在用户规模有限的情况下使用。当用户请求达到几十万或几百万时，这种方法也是不可扩展的。你需要管理几十个也许是几百个负载均衡器，这本身就是另一个令人头疼的问题。如果我们想对网站或应用进行任何升级，也会遇到问题，因为负载均衡不会考虑到应用升级的问题。我们需要单独配置每个负载均衡器，然后升级该均衡器所服务的容器。想象一下，当你有 20 个负载均衡器和每周 5 或 6 个小的更新时，你将不得不进行大量的手工劳动。

**我们需要的是一种可以一次性将变更传递给所有受控容器的方法，同时也需要一种可以轻松地调度可用容器的方法，这个过程还必须要是自动化的，这正是 Kubernetes 所做的事情。**

# 参考资料

> 别到处找教程了，官方文档是真的全面，甚至还给你准备了实验环境

[大白话 k8s](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzkzMjMxMTg2NQ==&action=getalbum&album_id=2225391633284562944&scene=21&subscene=90&sessionid=1642653201&enterid=1642653281&from_msgid=2247483819&from_itemidx=1&count=3&nolastread=1#wechat_redirect)

[★ Kubernetes Handbook - Kubernetes 中文指南/云原生应用架构实战手册](https://jimmysong.io/kubernetes-handbook/cloud-native/quick-start.html)

[Kubernetes 中文手册](https://www.kubernetes.org.cn/docs)

[Kubernetes 官方教程](https://kubernetes.io/zh-cn/docs/home/)

https://github.com/guangzhengli/k8s-tutorials
