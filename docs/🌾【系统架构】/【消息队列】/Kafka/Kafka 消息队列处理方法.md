- [如何保证消息不会重复消费（消息幂等性）](#如何保证消息不会重复消费消息幂等性)
- [如何保证消息的可靠传输/处理消息丢失](#如何保证消息的可靠传输处理消息丢失)
- [如何保证消息顺序](#如何保证消息顺序)
- [消息队列满了/消息积压/消费延时（生产案例 紧急处理流程）](#消息队列满了消息积压消费延时生产案例-紧急处理流程)
- [Kafka的消费组和partition数量](#kafka的消费组和partition数量)

## 如何保证消息不会重复消费（消息幂等性）

- 消费者消费完会定期commit当前offset到zk，并且每次会获取下一个offset，如果遇到重启会去zk取已存的offset

> 如果在commit之前重启？

- 这种情况Kafka本身无法保证消息幂等性，可以利用唯一索引等方式处理。

## 如何保证消息的可靠传输/处理消息丢失

- 可关闭自动commit，改用手动commit，确保处理完业务再提交

> 如果在Kafka未完成复制时宕机，leader重新选举

- Kafka配置 min_insync_replicas >= 1

- 生产者配置 acks = all

- 生产者配置 retries = MAX

- 以上参数设置可以确保每次消息发送到Kafka时，Kafka会在确保备份拷贝完成后才返回成功，不然会一直重试

## 如何保证消息顺序

- 发送接收Kafka可以指定Key，经过sharding后落盘一定在同一个partition并保证有序

> 如果消费者并发消费呢（生产案例）

- 对于一个key， consumer只读同一个partition
- consumer维护一个queue，按Key去hash分发，让同一个key落在同一个queue，再并发处理这些queue

## 消息队列满了/消息积压/消费延时（生产案例 紧急处理流程）

- 方案A：优先处理积压消息

  消费组添加新消费者，水平拓展

- 方案B：优先保证最新请求正常

  - 增加临时kafka和新建topic（例如30个topic）

  - 紧急修改代码上线，替换原consumer。让新程序快速消费积压消息，直接写入新建topic（例如30个topic）

  - 扩容（例如30个）consumer去新topic消费，处理原业务

  - 消息堆积处理完，恢复现场

## Kafka的消费组和partition数量

- partition个数要大于comsumer，最好N倍

  - 否则如果comsumer大于partiton  （造成有comsumer闲置）

  - 否则如果非N倍数会有comsumer （造成负载不均）

- Sticky分配策略选项：

  - 分区的分配要尽可能的均匀；

  - 分区的分配尽可能的与上次分配的保持相同。
