- [参考资料](#参考资料)
- [数据库](#数据库)
  - [migrate](#migrate)
  - [模型（models）](#模型models)
    - [数据表](#数据表)
    - [序列化](#序列化)
    - [数据类型](#数据类型)
    - [增删查改](#增删查改)
    - [信号](#信号)
    - [SQL](#sql)
  - [模板 template](#模板-template)
  - [事务](#事务)

# 参考资料

# 数据库

## migrate

```sh
python manage.py makemigrations app_name
python manage.py migrate app_name
```

## 模型（models）

> https://blog.csdn.net/yanpenggong/article/details/82316514

- [Meta](https://www.cnblogs.com/389446367zgn/p/9664357.html)
  Django 模型类的 Meta 是一个内部类，它用于定义一些 Django 模型类的行为特性

### 数据表

- 如果模型类如果未指明表名，`Django` 默认以 `小写app应用名_小写模型类名` 为数据库表名；可以在模型类下的 `Meta` 类下指定 `db_table='test'` 来自定义表名

- [`verbose_name` 给表、列添加备注信息](http://www.imooc.com/qadetail/331279)

- `_meta`

### 序列化

### 数据类型

![alt](https://img-blog.csdn.net/20180902153820684?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3lhbnBlbmdnb25n/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### 增删查改

- 增

  ```py
  # 使用 save 方法
  book = BookInfo(
      btitle='test',
      bput_date=date(1988,1,1),
      bread=10,
      bcomment=10
  )
  book.save()

  # 使用 create 方法
  BookInfo.objects.create(
    btitle='test',
    bput_date=date(1988,1,1),
    bread=10,
    bcomment=10
  )
  ```

- 删

  ```py
  # 使用 delete 方法
  hero = HeroInfo.objects.get(id=13).delete()
  ```

- 改

  ```py
  # 1. 使用update方法
  HeroInfo.objects.filter(hname='huang').update(hname='jinjie')
  # 2. 使用save方法
  hero = HeroInfo.objects.get(hname='huang')
  hero.hname = 'jinjie'
  hero.save()
  ```

- [查](https://www.cnblogs.com/alex3174/p/11608374.html)

### 信号

> 即进行增删查改时触发的函数 `django.db.models.signales`

### SQL

和 sqlalchemy 还是有很多区别的，sqlalchemy 大多数都是通过 `表名.列名.xxx` 来过滤

- get 获取某一条记录

  ```py
  from .modules import DownloadFile
  obj = DownloadFile.objects.get(download_path__exact='upload_setting.ini')
  # obj = DownloadFile.objects.get(download_path='upload_setting.ini')
  ```

- [`filter 过滤出多条记录`](https://blog.csdn.net/qq_34493908/article/details/81352784)

  `Django`中的条件过滤不像 `Flask` 那样用`列.in()`来完成，而是用 `列__exact=xxx` 来完成

  - `exact` 判等

    ```sql
    where a.id = 10
    ```

  - `contains` 判断是否包含某字符串

    ```sql
    where a.name like '%test%'
    ```

  - `startswith/endswith` 以某字符串开头结尾

    ```sql
    where a.name like 'huang%'
    ```

  - `isnull` 是否为空

    ```sql
    where a.age is NULL
    ```

  - `in` 范围

    ```sql
    where a.age in (21, 22, 23)
    ```

  - `gt gte / lt lte` 大小比较

    ```sql
    where a.age > 19
    ```

    https://blog.csdn.net/m0_38061194/article/details/79379377

- `exclude` 获取掉某条件以外的记录

  ```py
  User.objects.exclude(id__in([1, 3, 5])
  ```

- `order_by`

  ```py
  User.objects.order_by('name')  # 按 user.name 升序
  User.objects.order_by('-name')  # 按 user.name 降序
  ```

- `F` 对象

  之前的查询都是对象的属性与常量值比较，F 对象可以比较表的两个属性

  ```py
  from django.db.models import F
  BookInfo.objects.filter(bread__gte=F('bcomment'))
  # select * from book_info a where a.bread >= a.bcomment;

  BookInfo.objects.filter(bread__gt=F('bcomment') * 2)
  # select * from book_info a where a.bread >= a.bcomment * 2;
  ```

- `Q` 对象用来实现 `& 与、| 或、~ 非`

  ```py
  from django.db.modules import Q
  BookInfo.objects.filter(Q(bread__gt=20) | Q(pk__lt=3))
  # select * from book_info where bread >= 20 and pk <= 3;
  BookInfo.objects.filter(~Q(pk=3))
  # select * from book_info where pk != 3
  ```

## 模板 template

[raise TemplateDoesNotExist](https://blog.csdn.net/weixin_30500105/article/details/99242668)

## 事务
