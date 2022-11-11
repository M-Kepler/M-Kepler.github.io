- [`SQLAlchemy`](#sqlalchemy)
  - [参考资料](#参考资料)
  - [表模型 `modules`](#表模型-modules)
    - [建表](#建表)
    - [字段类型](#字段类型)
    - [索引](#索引)
    - [自动生成表模型](#自动生成表模型)
  - [`event` 事件监听（触发器）](#event-事件监听触发器)
  - [`session` 事务](#session-事务)
    - [事务锁](#事务锁)
  - [序列化](#序列化)
  - [SQL](#sql)
    - [`execute` 执行 SQL](#execute-执行-sql)
    - [session 内基本操作](#session-内基本操作)
    - [查询 `query`](#查询-query)
      - [查询函数 `func`](#查询函数-func)
      - [时间](#时间)
      - [`where` 条件语句](#where-条件语句)
      - [多表查询 join](#多表查询-join)
      - [子查询 `subquery`](#子查询-subquery)
      - [动态查询条件](#动态查询条件)
    - [批量操作](#批量操作)
    - [sort](#sort)
    - [group](#group)
    - [`MetaData`](#metadata)
    - [有时候查询会来的数据会很多，可不可以用生成器来优化](#有时候查询会来的数据会很多可不可以用生成器来优化)
  - [连接池](#连接池)
    - [连接池可能带来的问题](#连接池可能带来的问题)
  - [异步](#异步)
  - [坑](#坑)
    - [有没有 `sql` 注入危险](#有没有-sql-注入危险)
    - [并发问题](#并发问题)
    - [旧版本数据库使用模型的问题](#旧版本数据库使用模型的问题)
  - [MySQL 重启，连接断开](#mysql-重启连接断开)
  - [性能](#性能)
  - [其他](#其他)
  - [其他](#其他-1)

# `SQLAlchemy`

> ORM 框架，SQLAlchemy 本身无法操作数据库，其必须以来 pymysql 等第三方插件

- sqlalchemy 的源码还是不错的

- pymysql 和 MySQLdb 的区别: MySQLdb 只支持 Python2.x，还不支持 3.x

## 参考资料

- [中文文档](https://www.osgeo.cn/sqlalchemy/)

## 表模型 `modules`

### 建表

- [常用的 SQLalchemy 字段类型](https://blog.csdn.net/weixin_41896508/article/details/80772238)

```py
# 添加字段注释, 首先需要升级版本到1.2.x以上版本
from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy .ext.declarative import declarative_base
Base = declarative_base()
class BbcOrg(Base):
  __tablename__ = 'bbc_org'  # 表名称
  id = Column('id',
              Integer,
              primary_key=True,
              autoincrement=True,
              comment='主键ID')
  # 当表字段和python关键字冲突
  from_ = Column('from', String(50), nulable=False)

  # 可以自定义查询该表字段时的行为
  # ORM 就是把数据表映射成类，所以这里是支持按普通的类那样来操作的
  @property
  def from_():
      print("do something")

```

### 字段类型

- [字段类型](https://blog.csdn.net/weixin_44737646/article/details/104428251)

  ```py
  from sqlalchemy import Column
  from sqlalchemy import Integer

  # Column常用参数
  '''
  name            = 该属性在数据库中的字段映射
  nullable        = 是否可空
  primary_key     = 是否为主键
  autoincrement   = 是否自增（配合主键使用）
  unique          = 值是否唯一
  onupdate        = 更新时，执行的回调函数
  comment         = 字段描述
  default         = ORM对象操作该字段时，带上的默认值
                    create_time = Column(Datetime, default=datetime.now)
                    # 表示每次数据插入都会调用 datetime.now() 去获取插入时的时间
                    create_time = Column(Datetime, default=datetime.now())
                    # # 表示程序部署的时候，即添加这个字段的时候的时间，所有数据都是固定的
  server_default  = 为数据库表的该字段设置默认值
  server_onupdate =
  '''

  ```

- [默认值](https://www.jianshu.com/p/6d3ec5851f3a)

- [server_default 和 default](https://zhuanlan.zhihu.com/p/37892676)

  - `default` 参数来设置默认值，实际生成的 `数据库表` 并没有把这个字段的默认值设置上；但是如果你通过 `SQLAlchemy` 来添加更新数据会发现默认值确实生效了，即这个默认值是`SQLAlchemy` 操作的时候给自己加的，并不是我们希望的把表结构的这个字段设置上默认值

  - `server_default` 只接收字符串类型的值，并不接受整型或者布尔型的值

  - `server_default='0'` 即使类型是 `TINYINT`，这个 `server_default` 也要引号引起来的

- 数据库数据类型

  ```py
  # 数据类型
  '''
  from sqlalchemy import Integer, String, Float 等
  from sqlalchemy.dialects.mysql import LONGTEXT


  Integer         = 整形
                    id = Column(Integer, primary_key=True, autoincrement=True)

  Float           = 浮点类型
                    price = Column(Float)

  Boolean         = 传递True/False进去
                    is_admin = Column(Float)

  DECIMAL         = 定点类型
                    price = Column(DECIMAL(11, 10))
                    # 参数一表示， 参数二表示小数点后几位

  Enum            = 枚举类型
                    cource = Column(Enum("python", "flask", "django"))
                    # 参数为枚举值，即给该字段赋值时，只能赋这几个值之一，即给该字段赋值时，只能赋这几个值之一
                    # 参数也可以为枚举对象，即python3中的Enum类

  Time            = 传递datetime.time()进去
                    occur_time = Column(Time)
                    # 参数为 from datetime import time 的实例，比如 tt = time(hour=16, minute=23, second=11)
  Date            = 传递datetime.date()进去
  DateTime        = 传递datetime.datetime()进去

  String          = 字符类型，使用时需要指定长度，区别于Text类型

  Text            = 文本类型
                    content = Column(Text)

  LONGTEXT        = 长文本类型
  '''
  ```

- 表间主、外键关系

  ```py
  class Role(Base):
    __tablename__ = 'roles'  # 指定表名
    id = Column(db.Integer, primary_key=True)  # 定义列对象
    ...
    users = relationship('User', backref='role', lazy='dynamic')
    # 设置关联表的方向引用
    # users属性添加到Role模型中,用来返回与角色相关联的用户组成的列表,
    # 第一个参数表示这个关系的另一端是哪个模型;
    # backref则表示向User模型添加一个role属性, 从而定义反向关系
    # 这个属性可替代role_id来访问Role表, lazy 指定如何加载相关记录

  class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    ...
    role_id = Column(Integer, ForeignKey('roles.id'))
    # 表示role_id的值参照role表的id
  ```

- 多对多关系

  ```py
  from sqlalchemy.ext.declarative import declarative_base
  Base = declarative_base()

  # 新建一张表来存储多对多关系
  registrations = Table(
      'registrations',
      Base.metadata,
      Column('post_id', Integer, ForeignKey('posts.id')),
      Column('category_id', Integer, ForeignKey('categorys.id'))
  )
  # -- select posts.id, categorys.id from left join registrations on posts.id = registrations.post_id join right on registrations.categorys.id = categorys.id

  class Post(Base):
      __tablename__ = 'posts'
      id = Column(Integer, primary_key=Ture)
      title = Column(String(64))
      body = Column(Text)
      create_time = Column(DateTime, index=True, default=datetime.utcnow)

      # 多对多关系，一篇文章可以属于多个分类，一个分类也可以有多篇文章
      categorys = relationship('Category',
                               secondary=registrations,
                               backref=backref('posts', lazy='dynamic'),
                               lazy='dynamic')
  ```

- [修改表结构](https://blog.csdn.net/weixin_34049948/article/details/90337867)
  > 这个应该放到 `alembic` 那里，修改 `alembic` 的升级脚本

### 索引

FIXME 我很奇怪，比如我现表已经建好了，要加一个索引，再改这个 module，还是改 alembic 的迁移脚本呢，还是两个都要改

- 数据表加了索引就行了，SQLAlchemy 查询就会走索引，想要确认的话，可以打印出 SQLAlchemy 语句，放到 mysql 上验证

- [SQLAlchemy] 创建: 主键 / 索引 / 唯一约束 / 联合唯一约束 / 联合主键约束](https://blog.csdn.net/weixin_42902669/article/details/102666970)

### 自动生成表模型

```sh
$sqlacodegen --outfile <输出的文件名> <数据库连接 URI>

TB_NAME="mygzycj.com"
DB_NAME="xx"
sqlacodegen --tables $TB_NAME --outfile ${TB_NAME}_test.py mysql+pymysql://root:root@127.0.0.1:3306/$DB_NAME?charset=utf8

```

## `event` 事件监听（触发器）

> [SQLAlchemy 事件监听与初始化](https://www.cnblogs.com/wangjq19920210/p/11846941.html)

- 支持的触发机制

  - `orm` 中的字段改变时触发
  - `orm` 中对象状态改变时触发
  - `session` 状态改变时触发
  - 连接池事件

- 搞些例子

  ```py
  XXX
  from sqlalchemy import event
  # 表模型或表字段，触发条件，回调函数，是否改变插入值
  event.listen(User.password, "set", setPassword, retval=True)

  def on_body_changed(target, value, oldvalue, initiator):
      target.body_html = markdown(value) if value else ""
  ```

## `session` 事务

> 用 `SQLAlchemy` 写数据的时候要创建 `Session` 对象来维护数据库会话，用完了再关掉

- `create_engine`

  > [SQLAlchemy 中的 Session,sessionmaker,scoped_session 详解](https://blog.csdn.net/weixin_42474540/article/details/105100677)

  - `创建一个session，连接池会分配一个connection`，当 session 在使用后显示地调用 session.close()，也不能把这个连接关闭，而是由由 QueuePool 连接池管理并复用连接。
  - 确保 session 在使用完成后用 session.close、session.commit 或 session.rollback 把连接还回 pool，这是一个必须在意的习惯。

- [SQLAlchemy 的 scoped_session](https://blog.csdn.net/lucyxu107/article/details/82699996)

- [`session` 装饰器](https://blog.csdn.net/qq_43355223/article/details/86678516)

  ```py
  from contextlib import contextmanager
  from sqlalchemy.orm import sessionmaker
  engine = create_engine(xxxx)  # 数据库链接引擎
  DBSession = sessionmaker(bind=engine)

  @contextmanager
  def session_scope():
      session = DBSession()
      try:
          yield session
          session.commit()
      except:
          session.rollback()
          raise
      finally:
          # session.remove() 会调用 ScopedSsession.close() 关闭session释放资源
          session.close()
  ```

- `session`生命周期

  `web` 应用会同时服务多个用户，不同的请求要有不同的 `session` 来操作数据，才不至于翻车

  ```py
  from sqlalchemy import create_engine
  from sqlalchemy.orm import sessionmaker

  # 创建session
  engine = create_engine(SQLALCHEMY_DB_URI)
  Session = sessionmaker(bind=engine)
  session = Session()

  session.add(obj)
  # 写数据库但不提交
  session.flush()
  session.commit()
  # 销毁session
  session.close()
  ```

- `flush` 和 `commit` 的区别

  - flush 会生成 primary key

  - 当前紧接着的 session 可以查到 flush 做的增删改的结果

  - 其他 session 只有在 commit 之后，才能查到 flush 做的增删改结果

- 怎么才能做到不同的用户的操作不会串戏

  - 从 `session` 的特点可以看出来的

  - 每个请求来的时候，都会使用 `soped_session` 函数来对原始的 `Session` 工厂做处理，返回个 `ScopedSession` 工厂来处理本次请求

  - 注册模式：调用 `ScopedSession` 工厂的时候，先看看 `registry` 中是否已经给该用户创建过会话了，如果没有就新建否则返回已有的（是不是有点像`单例模式`）

    ```py
    >>> old_session = ScopedSession()
    >>> cur_session = ScopedSession()
    >>> old_session is cur_session
    >>> true
    ```

  - `python` 中还有一个 `ThreadLocal` 来创建一个作用域只属于当前线程环境的变量

    - 线程本地存储另一个好处是，线程销毁的时候，线程内的所有变量（比如会话）也会被销毁，所以即使没有调用 `session.remove()` 也没事

    - 协程会不会出现问题？ 并不会，协程 `gevent` 已经在绿化的时候做了处理了，协程之间仍然是隔离的

### 事务锁

- [SQLAlchemy 并发写入引发的思考](https://www.cnblogs.com/qflyue/p/10040154.html)

  对于要更新的的表的 `query` 结果加上 `with_for_update` 实行行锁，来避免一个事务里做查询和更新出现的并发问题

- [flask-sqlalchemy 解决 with_for_update() 行锁不生效、数据滞后问题](https://blog.csdn.net/qq_33763224/article/details/115018371)

- `with_for_update(read=False, nowait=False, of=None)`

  `read` 是标识加互斥锁还是共享锁

  - 为 `True` 时, 是共享锁. 多个事务可以同时获取

  - 为 `False` 时，是互斥锁，只能一个事务获取

  - `nowait` 其它事务碰到锁, 是否不等待直接"报错".

  - `of` 指明上锁的表, 如果不指明, 则查询中涉及的所有表(行)都会加锁.

## 序列化

## SQL

### `execute` 执行 SQL

- 不适用 ORM，直接执行 sql 语句

  ```py
  session.execute(
    User.__table__.insert(),
    [{'name': `randint(1, 100)`,'age': randint(1, 100)} for i in xrange(10000)]
  )
  session.commit()

  ret = session.execute('select * from bbc_org')
  printf(ret.fetchall())
  ```

- 样例

  ```py
  with session_scope() as session:
    ret = session.execute(sql)
  # 将只取最上面的第一条结果，返回单个元组如('id','title')，然后多次使用cursor.fetchone()，依次取得下一条结果，**直到为空**
  one = ret.fetchone()
  two = ret.fetchone()

  with session_scope() as session:
    ret = session.execute(sql)
  # fetchall()之后ret就变成了空了，就像栈一样，全部吐出来了
  all = ret.fetchall()
  # 或者如下用for取遍历之后，ret也变成空了
  for item in ret:
    print(item.id, item.name) # 可以通过表字段来取值
  ```

### session 内基本操作

- `insert`

  ```py
  data = testTable(
      name="huangjinjie",
      age=25
  )
  session.add(data)
  session.flush()
  return data.id
  ```

- `update`

  ```py
  kwargs = dict()
  kwargs[BranchTable.name] = name
  ...
  session.query(BranchTable).filter(BranchTable.id == id).update(kwargs)
  ```

- `delete`

  ```py
  delete_obj = self.session.query(TableStudent.Sno = Sno)
  delete_obj.delete()

  delete_obj = self.session.query(TableStudent.Sno.in_(Snos))

  # delete_obj.delete() # error
  # https://segmentfault.com/q/1010000000130368
  # SQLAlchemy.exc.InvalidRequestError: ... Specify 'fetch' or False for the synchronize_session parameter.

  delete_obj.delete(synchronize_session=False) # ok
  ```

- `group_by`

- `query`查询出来的数据是序的，大数据量的时候能明显看出来；这样的话不知道会不会对分页有影响，因为每次点击下一页都是重新查询，有可能查询到相同的数据

- 分页查询

  ```py
  # page_num 当前页码
  # page_size 每页显示数量
  query(Table).limit(page_size).offset((int(page_num) - 1) * page_size)
  ```

  - [`flask-SQLAlchemy`才能用`paginate`进行分页](https://www.jianshu.com/p/ab45a932921d)

- 分页获取总数的问题

  > 因为查询的时候把分页的页数和页大小传进去了，但是只返回查询出来的对象，这样就没办法得到总数；比如总数 100 条，每页 10 条，分 10 页，如果先进行查询再取总数的话，分页得到的是 10 个对象，这样又要查一次总数

  正确做法是：按条件查询、取总数、最后再进行分页

- 限制查询返回的数量

  ```py
  query(Table).limit(10)
  ```

- 查询全部数据

  ```py
  users = query(User)
  if limit and start:
      users = users.limit(limit).offset(start)
  ```

### 查询 `query`

[SQLAlchemy query 函数可用参数有哪些？](https://www.cnblogs.com/lmh001/p/9959412.html)

[SQLAlchemy 操作](https://blog.csdn.net/weixin_41896508/article/details/80776631)

- [sqlalchemy 中的 literal 为查询结果增加一个常量值](https://www.cnblogs.com/tastepy/p/14719116.html)

  ```py
  from sqlalchemy import literal

  # 为查询结果增加了一个 num 字段, 且值一直为 value
  query = db_session.query(AlarmRule.id, literal('value').label('num')).filter(AlarmRule.id==1).first()
  ```

- 语句最终返回的一行数据的对象（或者它们组成的列表），其实就是定义表结构时的那个类，可以通过点操作符来访问字段的值

- 如果直接 `print` 打印这个对象，则输出的是 query 对应的 sql 语句

- 如果 `query` 参数为表的字段，比如 `ret = query(BranchTable.id, BranchTable.name)` 则返回的列表其中每一项都是一个 tuple，一个 tuple 里面就是一行内`查询的指定字段的值`，可以向访问 tuple 那样通过下标访问，也可以通过 `ret.name` 来访问

- 如果查询不到信息则返回结果为空列表

  - **只有当调用这些 count 等函数的时候才真正执行 sql**

  - `for` 遍历 `__iter__` 迭代器

  - `session.query(xxx)` 返回的是 Qeury 对象, 也可以进行进行循环取值，可以当成列表去遍历，查询不到也不会报错，这时候只能通过 `count()` 来检查是否查询到数据。而无法直接用 if 来判断`if not ret: print('no')`

  - `session.query(xxx).first()` 返回查询到的第一个查询对象，如果查不到则返回 None

  - `session.query(xxx).all()` 返回所有结果的元祖列表，**所有查询到的数据都会载入到内存中**，如果查不到则返回空列表

  - `session.query(xxx).get("primary_key_val")` 获取`主键`那一行数据的对象

  - `session.query(xxx).one()` 如果只能查询到一个结果，返回它，否则（查不到或超过一个）抛出异常

  - `session.query(xxx).one_or_none()` 如果只能查询到一个结果，返回它，查询不到时抛出异常

  - `session.query(xxx).scalar()` 和 `one_or_none()` 效果一样

  - `session.query(xxx).count()` 返回查询结果条数

- 查出来的数据是否是有序的？

  > 查出来是无序的，需要自己手动排序

  - `order_by` 语句排序

    ```py
    ret = session.query(User).order_by(User.create_time.desc()).all()
    ```

  - 定义模型时声明排序方式

    ```py
    class User(Base):
        __tablename__ = "user"
        id = Column(Integer, primary_key=True, autoincrement=True)
        create_time = Column(DateTime, nullable=False, default=datetime.now)
        __mapper_args__ = {
            "order_by": create_time.desc()
        }
    ```

  - 声明表间关系的时候

    ```py
    author = relationship('User', backref=backref('articles', order_by=create_time.desc()))
    ```

- `filter(TableName.col = xxx) & filter_by()`
  相当于 where 查询

- `with_entities` 指定获取的列

  ```py
  result = User.query.with_entities(User.name, User.email).all()
  for (username, email) in result:
      print(username, email)
  ```

- 一些 qury 的函数是可以拆开的，但是要用新变量来接

  ```py
  # 原来 session.query(TestTb).outerjoin(TestTb2, TestTb2.id == TestTb.tb2_id)

  # 可以拆成两段
  aa = session.query(TestTb)
  bb = aa.outerjoin(TestTb2, TestTb2.id == TestTb.tb2_id)
  ```

#### 查询函数 `func`

- 一下函数都可以用作 `query` 的参数

  | 名称                              | 作用     |
  | :-------------------------------- | :------- |
  | func.sum                          | 求和     |
  | func.max                          | 求最大值 |
  | func.min                          | 求最小值 |
  | func.count('1')、func.count('\*') | 求行数   |
  | func.avg                          | 求平均值 |
  | func.now()                        | 取时间   |
  | func.current_timestamp()          | 取时间戳 |
  | func.md5()                        | md5      |

- `func.count(Tb.id)`

#### 时间

#### `where` 条件语句

- `filter_by` 和 `filter` 的差别
  filter_by 可以直接使用字段名作为过滤条件

  ```py
  session.query(User).filter_by(name='user1').all()
  session.query(User).filter(User.name == "user").all()
  session.query(User).filter("id>:id").params(id=1).all()
  ```

- `like`

  ```py
  session.query.filter(User.name.like('%ed%'))
  ```

- `is null`

  ```py
  session.query.filter(User.name == None)
  session.query.filter(User.name.is_(None))
  ```

- `is not null`

  ```py
  session.query.filter(User.name != None)
  session.query.filter(User.name.isnot(None))
  ```

- `notin_`

  ```py
  news = session.query(News).filter(News.title.notin_(['标题1','标题2'])).all()
  print(news)

  news = session.query(News).filter(~News.title.in_(['标题1','标题2'])).all()
  print(news)
  ```

- `in_`
  “包括”过滤，不需要导入，在 SQLAlchemy 中
  用法 `filter( “包括”过滤 用法`filter( “包括”过滤
  用法 `filter(Student.Sname.in_(['Frank','Takanashi']))`
  在 filter 方法所有参数最前面加上一个 `~` ，就是“非包括”过滤，比如刚才那个加上的话就是查询所有不叫 Frank 和 Takanashi 的学生了

- `and_ 和 or_`

  ```py
  from sqlalchemy import and_, or_
  session.query(Student).filter(
    and_(
      Student.Sdept == 'SFS',
      Student.Sage < 22
    )
  ).all()
  # 上句选出了所有外院但是年龄小于22的学生记录，经测试也可以写3个及以上的条件参数
  # or_方法也是类似的
  ```

- `exist`

  ```py
  print(session.query(User).filter(exists().where(Address.user_id == User.id)))
  print(session.query(User).filter(User.addresses.any()))
  ```

- `order_by`

  ```py
  order_by(User.name)
  order_by('name')
  # 返回结果按照给出的字段排序。
  order_by(User.name.desc()) 或者 order_by('name desc')
  ```

- `offset`

  ```py
  session.query(User).offset(1) # 从第二条记录开始返回
  ```

- `limit`

  ```py
  # 限制每次查询的时候查询数据的条数
  session.query(User).limit(10) # 最多返回10条数据
  ```

- `slice`

  ```py
  # 切片操作，取第91到99条数据，参数为从0开始的列表下标
  session.query(User).slice(90, 100).all()

  # 或者直接用列表的切片操作，效果一样
  session.query(User)[90:100]
  ```

#### 多表查询 join

- 表间查询，连接多个条件
  虽然可以链接查询，但是不能对查询后的数据进行删除 `records.delete()`
  https://stackoverflow.com/questions/31491804/sqlalchemy-delete-grandchildren

  ```py
  # SELECT * FROM bbc_vpn_user_mgr INNER JOIN bbc_vpn_conn_mgr ON bbc_vpn_conn_mgr.topo_id = bbc_vpn_user_mgr.topo_id AND bbc_vpn_conn_mgr.user = bbc_vpn_user_mgr.user ORDER BY bbc_vpn_user_mgr.id DESC
  records = self.session.query(
          VpnUserMgrTable
      ).join(
          BbcVpnConnMgrTable,
          and_(
              BbcVpnConnMgrTable.topo_id == VpnUserMgrTable.topo_id,
              BbcVpnConnMgrTable.user == VpnUserMgrTable.user
          )
      )
  ```

- 多个表使用 `where` 连接查询

  ```py
  def get_dev_list_info_detail(self, deploy_org_id):
      # 分支设备名称、所在分支、sn码、接入状态、分配IP地址范围、保留IP范围起始IP
      '''
      分支设备名称、所在分支、sn码、接入状态、分配IP地址范围、保留IP范围起始IP
      SELECT bbc_device.name, bbc_branch.name, bbc_device_list.key,
             bbc_device_list.conn_status, bbc_device_list.dhcp_config,
             bbc_device_list.retain_start_ip
          FROM bbc_device, bbc_branch, bbc_device_list
          WHERE bbc_branch.id = bbc_device.branch_id
          AND bbc_branch.org_id = bbc_device_list.deploy_org
          AND bbc_device_list.device_id = bbc_device.id
      '''
      if deploy_org_id is None:
          return None
      detail_info = self.session.query(
          # 返回的是tuple，元素为每个查询出来的字段值（也可以是表模型定义的类）
          # 有 label 会好一点，要不然就要用下标访问，比较奇怪
          DeviceTable.name.label('device_name'),
          BranchTable.name.label('branch_name'),
          # DeviceListTable,  # 返回的是 tables.DeviceListTable object 即表定义的那个类
          DeviceListTable.key,
          DeviceListTable.conn_status,
          DeviceListTable.dhcp_config,
          DeviceListTable.retain_start_ip
      ).filter(
          and_(
              (BranchTable.id == DeviceTable.branch_id),
              (BranchTable.org_id == DeviceListTable.deploy_org),
              (DeviceListTable.device_id == DeviceTable.id)
          )
      )

  ret = get_dev_list_info_detail(1)
  for item in ret:
      # 虽然返回的是tuple，但是也可以像访问成员一样访问元祖的值
      # 避免通过 item[0], item[1] 这样的不明不白的访问
      print(ret.device_name)  # item[0]
      print(ret.conn_status)  # item[3]
  ```

- 外连接

  ```py
  # 这个是inner join
  session.query(User.username, UserDetails.last_login
    ).join(
      UserDetails,UserDetails.id==User.id
    ).all()
  '''
  select user.username, userdetails.last_login from user, userdetails where user.id = userdetails.id
  '''

  # 左连接，SQLAlchemy 没有右连接
  session.query(
    User.username,
    UserDetails.last_login
  ).outerjoin(
    UserDetails,
    UserDetails.id==User.id
  ).all()
  '''
  select user.username, userdetails.last_login from user left outer join userdetails on userdetails.id=user.id
  '''
  ```

- [union 合并多个查询结果](https://blog.csdn.net/weixin_34162629/article/details/92471685)

  ```sh
  q_1 = self.session.query(TestTable1.name, TestTable2.age)
  q_2 = self.session.query(TestTable1.name, TestTable2.age)
  # q_1 和 q_2 返回结果要一样
  query_result = q_1.union(q_2)
  ```

#### 子查询 `subquery`

- 用法

  ```py
  # 要使用 c 来定位上一个子句的属性
  s1_result = session.query(m.a, m.b).filter().subquery()

  s2_result = session.query(s1_result.c.a, s1_result.c.b).filter().subquery()

  s = session.query(s2_result.c.a, s2_result.c.b).filter().all()
  ```

#### 动态查询条件

- [SQLAlchemy 的优雅：不定字段、不定长查询](https://blog.csdn.net/qq_39177678/article/details/107512138)

- [SQLAlchemy 如何现实动态查询条件以及动态字段查询](https://discuss.helloflask.com/t/topic/452)

- 有时候`query(User)` 有时候 `query(User.id)`

### 批量操作

bulk_update_mappings

- 批量插入、批量更新

  ```py
  # 创建session
  session =  Session()
  # add_all
  records = [
    User(username=faker.name(),
         password=faker.word(),
         email=faker.email(),
    ) for i in range(10)]

  # 批量添加，一次提交
  session.add_all(records)
  session.commit()
  # 关闭session
  session.close()

  # 单个添加，需要多次commit，效率太低
  for item in range(10):
    data = User(username=faker.name(),
                password=faker.word(),
                email=faker.email())
    session.add(data)
    session.commit()
  ```

- 好像不支持批量查询

### sort

### group

```python
aaa = session.query(
  tb_a.id, tb_a.name,
  func.date_format(tb_b.time)
).filter(
  tb_a.id = tb_b.a_id
).group_by(
  tb_a.id,
  extract('hour', tb_b.time)  # 从时间里取出 hour
)
```

### `MetaData`

medata 表模型，可以直接操作数据库中的表；其实也是直接通过 `execute` 执行 SQL 语句，只不过可以用上 `sqlalchemy` 封装好的接口，不用直接写 SQL

```py
from sqlalchemy import Table, MetaData

metadata = MetaData()
metadata.bind = engine
device_list_table = Table('bbc_device_list', metadata, autoload=True)
device_table = Table('bbc_device', metadata, autoload=True)
db_conn = engine.connect()
...
db_conn.close()
```

- `execute`

  ```py
  test = db_conn.execte("select * from org")
  # test.fetchall()
  for i in test:
    print i.id
  ```

- `create`

  ```py
  test_tb = Table(
      'test', metadata,
      sa.Column('id', INTEGER, primary_key=True)
      sa.Column('name', VARCHAR(32), nullable=False, index=True)
      sa.Column('age', INTEGER, nullable=False, default=0)
  )
  metadata.create_all()
  ```

- `select`

  ```py
  sql = select([device_list_table, ])  # 查表
  devices = db_conn.execute(sql).fetchall()
  for device in devices:
      if device.device_id == 0:  # 用表字段
          continue
      db_conn.execute(device_table.update().where(
          device_table.c.id == device.device_id and device_table.c.gwsn == "").values(
          gwsn = device.key))
  ```

- `insert`

  ```py
  email_table = Table('org_alert_email', metadata, autoload=True)
  db_conn = engine.connect()

  sql = insert(email_table).value(
      emails="test",
      org_id=0,
      enabled=False
  )
  db_conn.execute(sql)
  db_conn.close()
  ```

- `update`

  ```py
  line_table = Table('line', metadata, autoload=True)
  db_conn.engine.connect()

  sql = line_table.update().where(
      and_(
          line_table.c.name == "test",
          line_table.c.flag == 1,
      ).values(
          name="test_new"
      )
  )
  db_conn.execute(sql)
  db_conn.close()
  ```

### 有时候查询会来的数据会很多，可不可以用生成器来优化

## 连接池

> - [python 的 SQLAlchemy 数据库连接池原理的说明](https://www.cnblogs.com/pengyusong/p/5790867.html)
> - [深入研究 SQLAlchemy 连接池](https://www.cnblogs.com/jackadam/p/8727409.html)
> - [SQLAlchemy 的连接池机制](https://sanyuesha.com/2019/01/02/SQLAlchemy-pool-mechanism/)

SQLAlchemy 连接数据库所使用的 Engine 对象默认采用一个连接池（默认为 QueuePool）来管理连接

- 如果你有 10000 个并发用户，设置一个 10000 的连接池基本等于失了智。 1000 仍然很恐怖。即是 100 也太多了。你需要一个 10 来个连接的小连接池，然后让剩下的业务线程都在队列里等待。连接池中的连接数量应该等于你的数据库能够有效同时进行的查询任务数（`通常不会高于2*CPU核心数`）。

### 连接池可能带来的问题

- [SQLAlchemy 报错: QueuePool limit of size 500 overflow 10 reached, connection timed out](https://blog.csdn.net/runnoob_1115/article/details/107088627)

- [`TimeoutError: QueuePool limit of size 5 overflow 10 reached, connection timed out, timeout 30`](https://blog.csdn.net/u013673976/article/details/45939297)

- 数据库服务器重启，连接池里的连接怎么办？（失效的链接）

- `SQLAlchemy.exc.OperationalError: (_mysql_exceptions.OperationalError) (2003, "Can't connect to MySQL server on '127.0.0.1'` 报错连接 mysql 失败，实际上 mysql 是正常的

  - [解决 2003, "Can't connect to MySQL server on '127.0.0.1' (10061)"](https://blog.csdn.net/lezeqe/article/details/88941571)
  - [关于大并发 mysql 连接引起数据库错误 OperationalError: (2003, "Can't connect to MySQL server on 'x.x.x.x (99)")](https://blog.csdn.net/a657941877/article/details/23350133)

- `OperationalError: (2013, ‘Lost connection to MySQL server during query‘）`
  [python 使用 SQLAlchemy 链接 MySQL 断链问题](https://blog.csdn.net/weixin_44463766/article/details/109739426)
  > pool_pre_ping ： 这是 1.2 新增的参数

## 异步

## 坑

### 有没有 `sql` 注入危险

- `SQLAlchemy` 本身已支持 `sql注入` 防范，他会把传入的数据做处理；而且用这个 `orm` 框架，都不需要我们自己拼 `sql`，所有的操作都是通过框架提供的函数来完成的

- 即使可以用 `session.execute(sql)` 来直接执行 `sql` 语句，也可以防范

  ```py
  # 有命令注入的危险
  sql_str = "select * from user where username = '%s' and password ='%s'" % (username, password)
  session.execute(sql_str)

  # 使用 SQLAlchemy 提供的 %s 函数来消除危险
  sql_str = "select * from user where username = %s and password = %s" % (username, password)
  session.execute(sql_str)
  # 字符串拼接要加 '%s', 系统提供的函数 %s  没有使用引号
  ```

### 并发问题

- 两个请求过来，第一个请求查询到数据后进行计算；第二个请求也上来了，去数据库中查询数据（此时由于第一个请求还没计算完更新到数据库中，所以拿到的原始数据和请求一都是一样额）；第一个请求计算得到数据 A，第二个请求计算得到数据 B，然后都各自继续执行更新逻辑，更新到数据表中。但是原本的设计就是该数据不应该重复出现的，计算的时候如果发现已经在数据库中就会把它排除掉，但是由于这种并发问题，就导致无法做到唯一性

  - 由于这个字段默认值是空字符串，所以不能依靠主键来限制唯一性

  - 对事务加锁，`query(xxx).with_for_update(read=False)` 如果查询和更新在一个事务中进行操作，则会等待这个事务完成再处理下一个事务

  - 普通的查询只是做了事务隔离，但是没有做互斥

### 旧版本数据库使用模型的问题

- 在数据库升级脚本中尽量不要使用 `mysql_tools.api.TableName` 的接口做查询操作，后面的版本会给表新增字段，如果在执行新增字段的升级脚本之前就使用这个 `api` 做查询操作的话，会报错

- `api` 中执行 SQL 语句的时候把结果集赋值给表模型，由于还没执行`A3`升级脚本，所以查询出来的结果集没有足够的值赋给表模型，就报错了

## MySQL 重启，连接断开

- 比如事务正在进行到一半，MySQL 重启了，就会导致连接丢失，需要回滚事务，重新开始

https://www.osgeo.cn/sqlalchemy/core/pooling.html?highlight=pre_ping#disconnect-handling-pessimistic

## 性能

- `_in(xxx)` 判断 `id` 是否存在于 `2w` 的列表中耗时 `0.2s`

  - 可以采用 `notin_` 来优化

- [`func.count(Tb.id)` 和 `ret.count()` 有什么优劣](https://blog.csdn.net/u010311062/article/details/76268783)

  - `count()` 会临时建一个表把数据查询出来然后在 count

- [查询的时候 `.all()` 和直接遍历有什么优劣吗](https://cloud.tencent.com/developer/ask/76816)

  - `.all()` 会一次提交 sql 语句进行查询，并且把返回的结果做 ORM 对象转换，返回一个列表；所以一个是慢的问题，一个是内存会爆的问题

  - 如果非得查全部，可以根据业务需要，只返回指定的字段，减少把数据转换成类的耗时

- [慎用 .all() 查询全部数据](https://blog.csdn.net/silentime/article/details/84812087)

- [官方文档 - 性能](https://www.osgeo.cn/SQLAlchemy/faq/performance.html#query-profiling)

- [如何修复使用 Python ORM 工具 SQLAlchemy 时的常见陷阱](https://zhuanlan.zhihu.com/p/92546510)

## 其他

- `id()`

- `is not 和 !=`

- 别名 `label`

  ```py
  detail_info = self.session.query(
    DeviceTable.name.label('device_name')
  ).first()
  ```

- [aliased](https://blog.csdn.net/weixin_44733660/article/details/104095365)

- [`url` 中末尾带和不带 `\` 的区别](https://www.cnblogs.com/lfxiao/p/9290809.html)
  按照理解，`bbc/branch/` 访问的是资源、目录，`bc/branch/branch` 访问的是页面，flask 会自动重定向，比如 `bbc/branch/branch/` 也可以

- [GitHub](https://github.com/kvesteri/intervals)

- 想查看 `sqlqlchemy` 实际执行的是什么语句，直接 `print` query 对象就行了

## 其他

- 范围查询怎么用索引

- 需要差一个数据，然后找 id 在这个数据里的，怎么写成一个，而不是分两次查询（in\_ + 子查询)

- 批量更新 `bulk_update_mappings`

- [SQLAlchemy 批量操作数据](https://blog.csdn.net/aaaaaaazhaofeng/article/details/99670667)

- [`synchronize_session`](https://segmentfault.com/q/1010000000130368)

  [官方文档](https://www.osgeo.cn/sqlalchemy/orm/session_basics.html#selecting-a-synchronization-strategy)

  该参数用来说明 session 删除、更新对象时需要执行的策略；删除记录时，默认会尝试删除 `session` 中符合条件的对象。解决办法就是删除时不进行同步，然后再让 session 里的所有实体都过期。更新操作的问题也是类似的
