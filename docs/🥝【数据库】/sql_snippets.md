*   [使用变量](#使用变量)
*   [命令行执行 SQL 并获取结果](#命令行执行-sql-并获取结果)
*   [去除字段中的前后缀，加上自己的前缀](#去除字段中的前后缀加上自己的前缀)
*   [存在则更新，不存在则新增](#存在则更新不存在则新增)
*   [获取刚插入数据的 ID](#获取刚插入数据的-id)
*   [查看下一个 ID](#查看下一个-id)
*   [插入时 ID 自增](#插入时-id-自增)
*   [A 表数据某些字段更新到 B 表](#a-表数据某些字段更新到-b-表)
*   [批量插入数据](#批量插入数据)

### 使用变量

```sql
-- 设置变量
set @my_arg = 1;

-- 查看变量
select @my_arg

-- 使用变量
update xxx set yy = concat(@my_arg, yy) where id = 1;
```

### 命令行执行 SQL 并获取结果

```sh
mysql -uroot -p <<EOF
select version() from dual;
show status like '%conn%';

select * from zabbix.users;
EOF
```

### 去除字段中的前后缀，加上自己的前缀

<https://www.qetool.com/scripts/view/17524.html>

```sql

mysql> select img_url from `test` where id = 4;
+---------------------------------------------------------------+
| img_url                                                       |
+---------------------------------------------------------------+
| 前缀$https://huangjinjie.com/2022/09/20220908/e2zItvz2.png$后缀|
+---------------------------------------------------------------+


mysql> select substring_index(substring_index(img_url, "$", -2), "$", 1) as img_url from `test` where id = 4;
+-------------------------------------------------------------------+
| img_url                                                           |
+-------------------------------------------------------------------+
| https://huangjinjie.com/2022/09/20220908/e2zItvz2.png |
+-------------------------------------------------------------------+

-- 用 update 语句更新上去就行了
update `test` set vpath = CONCAT("huangjinjie_", substring_index(substring_index(img_url, "$", -2), "$", 1)) where id = 4;

```

### 存在则更新，不存在则新增

[MySql 不存在则插入，存在则更新或忽略](https://blog.csdn.net/t894690230/article/details/77996355)

```sql

INSERT IGNORE INTO `br_org`(pid, ccode, level, name) select 0, 83040281, 1, "测试分组" where not exists(select 1 from br_org where `name`="测试分组");

```

### 获取刚插入数据的 ID

[mysql 插入一条数据并获取该数据的 id](https://www.cnblogs.com/gionlee/p/13330907.html)

```sql
INSERT INTO demo (name) values ('add');
SELECT @@IDENTITY
```

### 查看下一个 ID

```sql
SELECT Auto_increment FROM information_schema.tables WHERE table_name='test_device';
```

### 插入时 ID 自增

```sql
-- 创建表，设置 ID 自增
create table users (
    -- 需要设置 AUTO_INCREMENT
    id int(11) not null auto_increment primary key,
    name varchar(32)
);

-- 插入测试数据（需要指明插入字段）
insert into users (name) values ('hjj');
insert into users (name) values ('hjj2');

-- 查看结果
select * from users;
+----+------+
| id | name |
+----+------+
|  1 | hjj  |
|  2 | hjj2 |
+----+------+
2 rows in set (0.00 sec)

```

### A 表数据某些字段更新到 B 表

```sql
update test_new.test_device_list a set a.dhcp_config = (select b.dhcp_config from test_new_bak.test_device_list b where b.id=a.id);
```

### 批量插入数据
