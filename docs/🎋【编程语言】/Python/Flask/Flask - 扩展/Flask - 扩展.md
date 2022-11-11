- [Flask 扩展](#flask-扩展)
  - [`flask-cas`](#flask-cas)
  - [`flask-moment`](#flask-moment)
  - [`flask-login`](#flask-login)
  - [`flask-script`](#flask-script)
  - [`flask-wtf`](#flask-wtf)
  - [`flask_uploads`](#flask_uploads)
  - [`falsk_session`](#falsk_session)
  - [`flask-restful`](#flask-restful)

# Flask 扩展

## `flask-cas`

单点登录

## `flask-moment`

> 日期、时间本地化插件

- 安装

  ```sh
  pip install flask-moment
  ```

## `flask-login`

## `flask-script`

> - Django 自带了一个管理程序 `manage.py`，可以通过在命令行运行这个程序来做一些操作
> - Flask 也可以通过 `flask-script` 来创建命令行指令

- 基本使用

  ```py
  from flask_script import Manager, Shell
  from flask import Flask
  app = Flask(__name__)
  # 实例化一个对象
  manager = Manager(app)
  ```

- 添加自定义的指令

  ```py
  # 通过命令行执行 python manager.py deploy 就会执行这个函数
  @manager.command
  def deploy():
    pass

  # 添加带参数的命令
  @manager.option('-u', '--username', dest='name')
  @manager.option('-e', '--email', dest='email')
  @manager.option('-p', '--password', dest='password')
  def create_user(name, email, password):
      # 如果没有传参数，则打印到终端，提示输入参数
      if name is None:
          name = input('Username(default admin):') or 'admin'
      if email is None:
          email = input('Email:')
      if password is None:
          password = input('Password:')

  # 从模块中导入命令
  # db_manager.py
  from flask_migrate import MigrateCommand

  # manager.py
  manager.add_command("db", db.manager)
  ```

## `flask-wtf`

> 表单处理插件，但是对于我们这种前后端分离的就用不上，我们都是用 json 来做数据交互，不需要自己写表单

- 安装

  ```sh
  pip install flask-wtf
  ```

- [分析 flask-wtf.csrf 理解 CSRF 防御机制](https://www.jianshu.com/p/aed7d67b665b)

## `flask_uploads`

- 上传功能一般都不会直接传入一个文件名，而是上传之后，返回一个 uuid，然后前端也是通过这个 id 去访问文件

## `falsk_session`

## `flask-restful`
