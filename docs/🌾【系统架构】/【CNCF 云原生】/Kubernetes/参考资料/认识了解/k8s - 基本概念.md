- [一. 术语](#一-术语)
  - [1.node(结点)](#1node结点)
  - [2.pod](#2pod)
  - [3. 命名空间 (Namespace)](#3-命名空间-namespace)
  - [4.Object(对象)](#4object对象)
  - [5.Label(标签)](#5label标签)
  - [6.Annotation(注解)](#6annotation注解)
  - [7.Service Discovery(服务注册和发现)](#7service-discovery服务注册和发现)
  - [8.ReplicaSet(副本集)](#8replicaset副本集)
  - [9.DaemonSet(守护进程集)](#9daemonset守护进程集)
  - [10.StatefulSet(有状态集)](#10statefulset有状态集)
  - [11.Job(任务)](#11job任务)
  - [12.ConfigMap(配置映射)](#12configmap配置映射)
  - [13.Secret(机密配置)](#13secret机密配置)
  - [14.Deployment(部署)](#14deployment部署)
  - [15.Storage(存储)](#15storage存储)
  - [16.Ingress](#16ingress)
- [二. k8s 概述](#二-k8s-概述)
- [1. 架构图](#1-架构图)
  - [1.1 k8s 组件](#11-k8s-组件)
  - [K8s 集群的神经中枢：控制平面](#k8s-集群的神经中枢控制平面)
  - [K8s 集群 API: kube-apiserver](#k8s-集群-api-kube-apiserver)
  - [K8s 调度程序：kube-scheduler](#k8s-调度程序kube-scheduler)
  - [K8s 控制器：kube-controller-manager](#k8s-控制器kube-controller-manager)
  - [键值存储数据库 etcd](#键值存储数据库-etcd)
  - [1.2 Node 组件](#12-node-组件)
  - [kube-proxy](#kube-proxy)
  - [容器运行时（Container Runtime）](#容器运行时container-runtime)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.csdn.net](https://blog.csdn.net/qq_35703848/article/details/120033690)

## 一. 术语

### 1.node(结点)

Node 是机器。它们是 [Kubernetes](https://so.csdn.net/so/search?q=Kubernetes&spm=1001.2101.3001.7020) 用于部署 Pod 的 “裸机”（或虚拟机）。Node 为 Kubernetes 提供可用的集群资源用于以保持数据、运行作业、维护工作负载、创建网络路由等。

### 2.pod

Pod 是 Kubernetes 中最小的可互动单元。一个 Pod 可以由多个容器组成，这些容器共同部署在单个节点上形成一个单元。一个 Pod 具有一个 IP，该 IP 在其容器之间共享。在[微服务](https://so.csdn.net/so/search?q=%E5%BE%AE%E6%9C%8D%E5%8A%A1&spm=1001.2101.3001.7020)世界中，一个 Pod 可以是执行后台工作或服务请求的微服务的单个实例。

### 3. 命名空间 (Namespace)

k8s 命名空间主要用于隔离集群资源、隔离容器等，为集群提供了一种虚拟隔离的策略；默认存在 3 个名字空间，分别是默认命名空间 default、系统命名空间 kube-system 和 kube-public。

### 4.Object(对象)

k8s 对象 (Object) 是一种持久化存储并且用于表示集群状态的实体。k8s 对象其实就是 k8s 自己的配置协议，总之我们可以通过定义一个 object 让 k8s 根据 object 定义执行一些部署任务、监控任务等等。

### 5.Label(标签)

Label 是 Kubernetes 及其最终用户用于过滤系统中相似资源的方式，也是资源与资源相互 “访问” 或关联的粘合剂。比如说，为 Deployment 打开端口的 Service。不论是监控、日志、调试或是测试，任何 Kubernetes 资源都应打上标签以供后续查验。例如，给系统中所有 Worker Pod 打上标签：app=worker，之后即可在 kubectl 或 Kubernetes API 中使用–selector 字段对其进行选择。

### 6.Annotation(注解)

Annotation 与 Label 非常相似，但通常用于以自由的字符串形式保存不同对象的元数据，例如 “更改原因: 安全补丁升级”。

### 7.Service Discovery(服务注册和发现)

作为编排系统，Kubernetes 控制着不同工作负载的众多资源，负责管理 Pod、作业及所有需要通信的物理资源的网络。为此，Kubernetes 使用了 ETCD。

ETCD 是 Kubernetes 的 “内部” 数据库，Master 通过它来获取所有资源的位置。Kubernetes 还为服务提供了实际的“服务发现”——所有 Pod 使用了一个自定义的 DNS 服务器，通过解析其他服务的名称以获取其 IP 地址和端口。它在 Kubernetes 集群中“开箱即用”，无须进行设置。

### 8.ReplicaSet(副本集)

是一种控制器，负责监控和维护集群中 pod 的副本 (replicas) 数，确保 pod 的副本数是我们期望的样子。这也是配置自动伸缩的所在，在系统高负载时创建额外的副本，并在不再需要这些资源来支撑所运行的工作负载时进行缩容。

### 9.DaemonSet(守护进程集)

有时候，应用程序每个节点需要的实例不超过一个。比如 FileBeat 这类日志收集器就是个很好的例子。为了从各个节点收集日志，其代理需要运行在所有节点上，但每个节点只需要一个实例。Kubernetes 的 DaemonSet 即可用于创建这样的工作负载。

### 10.StatefulSet(有状态集)

尽管多数微服务涉及的都是不可变的无状态应用程序，但也有例外。有状态的工作负载有赖于磁盘卷的可靠支持。虽然应用程序容器本身可以是不可变的，可以使用更新的版本或更健康的实例来替代，但是所有副本还是需要数据的持久化。StatefulSet 即是用于这类需要在整个生命周期内使用同一节点的应用程序的部署。它还保留了它的 “名称”：容器内的 hostname 以及整个集群中服务发现的名称。3 个 ZooKeeper 构成的 StatefulSet 可以被命名 zk-1、zk-2 及 zk-3，也可以扩展到更多的成员 zk-4、zk-5 等等……StatefulSets 还负责管理 PersistentVolumeClaim（Pod 上连接的磁盘）。

### 11.Job(任务)

Kubernetes 核心团队考虑了大部分使用编排系统的应用程序。虽然多数应用程序要求持续运行以同时处理服务器请求（比如 Web 服务器），但有时还是需要生成一批作业并在其完成后进行清理。比如，一个迷你的无服务器环境。为了在 Kubernetes 中实现这一点，可以使用 Job 资源。正如其名，Job 的工作是生成容器来完成特定的工作，并在成功完成时销毁。举个例子，一组 Worker 从待处理和存储的数据队列中读取作业。一旦队列空了，就不再需要这些 Worker 了，直到下个批次准备好。

### 12.ConfigMap(配置映射)

现代应用程序的一个关键概念是无环境，并可通过注入的环境变量进行配置。应用程序应与其位置完全无关。为了在 Kubernetes 中实现这个重要的概念，就有了 ConfigMap。实际上这是一个环境变量键值列表，它们会被传递给正在运行的工作负载以确定不同的运行时行为。

### 13.Secret(机密配置)

在同样的范畴下，Secret 与正常的配置条目类似，只是会进行加密以防类似密钥、密码、证书等敏感信息的泄漏。

### 14.Deployment(部署)

一切看起来都很美好，Pod 可以正常运行，如果上层有 ReplicaSet，还可以根据负载进行伸缩。不过，大家蜂拥而来，为的是能用新版本快速替换应用程序。我们想小规模地进行构建、测试和发布，以缩短反馈周期。使用 Deployments 即可持续地部署新软件，这是一组描述特定运行工作负载新需求的元数据。举个例子，发布新版本、错误修复，甚至是回滚（这是 Kubernetes 的另一个内部选项）。

### 15.Storage(存储)

Kubernetes 在存储之上添加了一层抽象。工作负载可以为不同任务请求特定存储，甚至可以管理超过 Pod 生命周期的持久化 (数据库)

### 16.Ingress

是一种网关服务，可以将 k8s 服务通过 http 协议暴露到外部。

## 二. k8s 概述

## 1. 架构图

### 1.1 k8s 组件

### K8s 集群的神经中枢：控制平面

- 让我们从 Kubernetes 集群的神经中枢（即控制平面）开始说起。在这里，我们可以找到用于控制集群的 Kubernetes 组件以及一些有关集群状态和配置的数据。这些核心 Kubernetes 组件负责处理重要的工作，以确保容器以足够的数量和所需的资源运行。 控制平面会一直与您的计算机保持联系。集群已被配置为以特定的方式运行，而控制平面要做的就是确保万无一失。

### K8s 集群 API: kube-apiserver

- 如果需要与您的 Kubernetes 集群进行交互，就要通过 API。[Kubernetes API](https://www.redhat.com/zh/topics/containers/what-is-the-kubernetes-API)  是 Kubernetes 控制平面的前端，用于处理内部和外部请求。API 服务器会确定请求是否有效，如果有效，则对其进行处理。您可以通过 REST 调用、kubectl 命令行界面或其他命令行工具（例如 kubeadm）来访问 API。

### K8s 调度程序：kube-scheduler

- 您的集群是否状况良好？如果需要新的容器，要将它们放在哪里？这些是 Kubernetes 调度程序所要关注的问题。调度程序会考虑容器集的资源需求（例如 CPU 或内存）以及集群的运行状况。随后，它会将容器集安排到适当的计算节点。

### K8s 控制器：kube-controller-manager

在主节点运行控制器，每个[控制器](https://kubernetes.io/zh/docs/concepts/architecture/controller/)都是一个单独的进程， 但是为了降低复杂性，它们都被编译到同一个可执行文件，并在一个进程中运行。这些控制器包括:

- 节点控制器（Node Controller）: 负责在节点出现故障时进行通知和响应
- 任务控制器（Job controller）: 监测代表一次性任务的 Job 对象，然后创建 Pods 来运行这些任务直至完成

- 端点控制器（Endpoints Controller）: 填充端点 (Endpoints) 对象(即加入 Service 与 Pod)
- 服务帐户和令牌控制器（Service Account & Token Controllers）: 为新的命名空间创建默认帐户和 API 访问令牌

### 键值存储数据库 etcd

- 配置数据以及有关集群状态的信息位于  [etcd](https://www.redhat.com/zh/topics/containers/what-is-etcd)（一个键值存储数据库）中。etcd 采用分布式、容错设计，被视为集群的最终事实来源。

### 1.2 Node 组件

kubelet

- 一个在集群中每个[节点（node）](https://kubernetes.io/zh/docs/concepts/architecture/nodes/)上运行的代理。 它保证[容器（containers）](https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/#why-containers)都 运行在  [Pod](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/)  中。kubelet 接收一组通过各类机制提供给它的 PodSpecs，确保这些 PodSpecs 中描述的容器处于运行状态且健康。 kubelet 不会管理不是由 Kubernetes 创建的容器。

### kube-proxy

- [kube-proxy](https://kubernetes.io/zh/docs/reference/command-line-tools-reference/kube-proxy/)  是集群中每个节点上运行的网络代理， 实现 Kubernetes [服务（Service）](https://kubernetes.io/zh/docs/concepts/services-networking/service/)  概念的一部分。
- kube-proxy 维护节点上的网络规则。这些网络规则允许从集群内部或外部的网络会话与 Pod 进行网络通信。

- 如果操作系统提供了数据包过滤层并可用的话，kube-proxy 会通过它来实现网络规则。否则， kube-proxy 仅转发流量本身。

### 容器运行时（Container Runtime）

- 容器运行环境是负责运行容器的软件。
- Kubernetes 支持多个容器运行环境: [Docker](https://kubernetes.io/zh/docs/reference/kubectl/docker-cli-to-kubectl/)、 [containerd](https://containerd.io/docs/)、[CRI-O](https://cri-o.io/#what-is-cri-o)  以及任何实现  [Kubernetes CRI (容器运行环境接口)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)。
