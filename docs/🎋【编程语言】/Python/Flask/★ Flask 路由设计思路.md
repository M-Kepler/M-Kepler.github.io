- [引言](#引言)
- [flask route 设计思路](#flask-route-设计思路)
  - [源码版本说明](#源码版本说明)
  - [flask route 示例](#flask-route-示例)
  - [flask route 的作用](#flask-route-的作用)
  - [flask route 的实现思路](#flask-route-的实现思路)
  - [werkzeug 库中的 Map 与 Rule 在 Flask 中的应用](#werkzeug-库中的-map-与-rule-在-flask-中的应用)
  - [route 的完整流程](#route-的完整流程)
- [总结](#总结)

> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [segmentfault.com](https://segmentfault.com/a/1190000004213652)

本文主要梳理了 flask 源码中 route 的设计思路。

# 引言

本文主要梳理了`flask`源码中`route`的设计思路。
首先，从`WSGI`协议的角度介绍`flask route`的作用；
其次，详细讲解如何借助`werkzeug`库的`Map`、`Rule`实现`route`；
最后，梳理了一次完整的 http 请求中`route`的完整流程。

# flask route 设计思路

## 源码版本说明

本文参考的是`flask 0.5`版本的代码。
`flask 0.1`版本的代码非常短，只有 600 多行，但是这个版本缺少`blueprint`机制。
因此，我参考的是 0.5 版本。

## flask route 示例

直接使用`flask`官方文档中的例子

```py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id

if __name__ == '__main__':
    app.run()

```

此例中，使用`app.route`装饰器，完成了以下两个`url`与处理函数的`route`:

```json
{
    "/": hello_world,
    "/post/<int:post_id>" : show_post
}

```

这样做的效果为：
当 http 请求的 url 为'/'时，flask 会调用 hello_world 函数；
当 http 请求的 url 为'/post/<某整数值>'（例如 / post/32）时，flask 会调用 show_post 函数；

## flask route 的作用

从上面的示例中其实可以明白：**flask route 的作用就是建立 url 与处理函数的映射**。

WSGI 协议将处理请求的组件按照功能及调用关系分成了三种：**server, middleware, application**。
其中，server 可以调用 middleware 和 application，middleware 可以调用 application。

符合 WSGI 的框架对于一次 http 请求的完整处理过程为：
server 读取解析请求，生成 environ 和 start_response，然后调用 middleware；
middleware 完成自己的处理部分后，可以继续调用下一个 middleware 或 application，形成一个完整的请求链；
application 位于请求链的最后一级，其作用就是生成最终的响应。

```sh
http服务器（比如，nginx）--> WSGI server(比如gunicorn，SimpleHttpServer)-->
middleware--> ... -->application

```

如果接触过 Java Web 开发的人可能会立刻发现，这与 servlet 中的 middleware 机制是完全一致的。

特别重要的：

> 在上一小节的示例中`app = Flask(__name__)`创建了一个 **middleware**，
> 而这个 middleware 的核心作用是进行**请求转发**（request dispatch）。

上面这句话非常重要，请在心里重复一百遍。

上面这句话非常重要，请在心里重复一百遍。

上面这句话非常重要，请在心里重复一百遍。

进行请求转发的前提就是能够建立 url 与处理函数之间的映射关系，即`route`功能。
因此，在`flask`中，route 是 Flask 类的一个装饰器。

## flask route 的实现思路

通过上一小节，我们知道以下两点：

1. `flask route` 是 url 与处理函数的映射关系；

2. 在 http 请求时，`Flask`这个`middleware`负责完成对 url 对应的处理函数的调用；

那么，如果是我们自己来实现`route`，思路也很简单：

1. 建立一个类`Flask`，这个类是一个 middleware，并且有一个字典型的成员变量`url_map`；

2. `url_map = {url : function}`

3. 当 http 请求时，进行 request dispatch：根据 url，从 url_map 中找到`function`，然后调用 function；

4. 调用后续的 middleware 或 application，并把 function 的结果传递下去。

flask 的实现思路也是这样的。

```py
class Flask(object):

    def __init__(self):
        # 此处定义保存url与处理函数的映射关系
        self.url_map = {}

    def __call__(self, environ, start_response):
        """
        根据WSGI协议，middleware必须是可调用对象
        """
        # Flask的核心功能 request dispatch
        self.dispatch_request()
        #最后调用下一级的application
        return application(environ, start_response)

    def route(self, rule):
        """
        Flask使用装饰器来完成url与处理函数的映射关系建立
        """
        def decorator(f):
            # 简单，侵入小，优雅
            self.url_map[rule] = f
            return f
        return decorator

    def dispath_request(self):
        # 解析environ获得url
        url = get_url_from_environ()

        # 从url_map中找到对应的处理函数，并调用
        return self.url_map[url]()

```

至此， 一个简单的`Flask`middleware 的骨架就完成了。
上面的`Flask`类主要功能包括：

1. 符合 WSGI 协议的 middleware：可被调用，并且可以调用 application

2. 能够保存 url 与处理函数的映射信息

3. 能够根据 url 找到处理函数并调用（即，request dispatch）

当然，在实际中，不可能这么简单，但是基本思路是一致的。

## werkzeug 库中的 Map 与 Rule 在 Flask 中的应用

需要指出，上面实现的最简单的`Flask`类还是有很多问题的。
比如，HTTP 请求中相同的 url，不同的请求方法，比如 GET，POST 如果对应不同的处理函数，该如何处理？

flask 使用了`werkzeug`库中的`Map`和`Rule`来管理 url 与处理函数映射关系。

首先需要简单了解一下`Map`和`Rule`的作用：
在`werkzeug`中，`Rule`的主要作用是保存了一组`url`，`endpoint`，`methods`关系：
每个 (url, endpoint, methods) 都有一个对应的 Rule 对象：
其实现如下：

```py
class Rule(object):
    def __init__(self, url, endpoint, methods):
        self.rule = url
        self.endpoint = endpoint
        self.methods = methods

```

这里需要解释一下`endpoint`：
前面说过：url 与其处理函数可以使用一个字典来实现：{url: function}

`flask`在实现的时候，在中间加了一个中介`endpoint`，于是，url 与处理函数的映射变成了这样：

```sh
# 一个url对应一个endpoint，一个endpoint对应一个function
url-->endpoint-->function

# 保存url与endpoint之间的关系
{url: endpoint}

# 保存endpoint与function之间的关系
{endpoint: function}

```

于是，刚才我们实现的简单的`flask`骨架中`{url: function}`的字典，就变成了`{endpoint: function}`，
而`{url: endpoint}`这个映射关系就需要借助`Map`和`Rule`这两个类来完成。

可以发现：`endpoint`就是 url 和处理函数映射关系中的一个中介，所以，它可以是任何可以用作字典键的值，比如字符串。
但是在实际使用中`endpoint`，一般`endpoint`均为字符串，并且默认情况下：

1. 如果是通过`Flask.route`装饰器建立的映射关系，那么`endpoint`就是处理函数的函数名；

2. 如果是通过`blueprint`建立的映射关系，那么`endpoint`是 blueprint 名. 处理函数名；

因为，每建立一个`url-->endpoint-->function`关系就会创建一个`Rule`对象，所以，会有很多`Rule`对象存在。
`Map`的作用则是保存所有`Rule`对象。
所以，一般情况下`Map`的用法如下：

```py
m = Map([
    Rule('/', endpoint='index'),
    Rule('/downloads/', endpoint='downloads/index'),
    Rule('/downloads/<int:id>', endpoint='downloads/show')
])
```

在 flask 的源码中

```py
class Flask(object):
    def __init__(self):
        self.url_map = Map()  # url_map为保存所有Rule关系的容器Map
        self.view_functions = {} # view_functions保存endpoint-->function

```

1. 成员变量`url_map`保存所有的`(url, endpoint, method)`关系

2. 成员变量`view_functions`保存所有的 {endpoint, function} 关系

所以，对于一个 url，只要能找到`(url,endpoint,method)`，就能根据`endpoint`找到对应的`function`。

## route 的完整流程

首先，建立`Flask`对象：

```py
app = Flask(__name__)

```

然后，建立`url`与`function`之间的映射关系：

```py
@app.route('/')
def hello_world():
    return 'Hello World!'

```

在装饰器`route`中，创建`(url, endpoint, method)`和`{endpoint: function}`两组映射关系：

```py
if endpoint is None:
    # 默认使用响应函数名作为endpoint
    endpoint = view_func.__name__

# 保存(url, endpoint, method)映射关系
self.url_map.add(Rule(url, endpoint, method))

# 保存{endpoint: function}映射关系
self.view_functions[endpoint] = view_func

```

这样，就完成了对 url 和响应函数的映射关系。

下一步，调用 WSGI server 响应 http 请求，在文章开始的示例中使用：

```py
app.run()

```

调用`python`标准库提供的 WSGI server，在实际使用时，可能是`gunicorn`或`uwsgi`。

不论 server 是什么，最终都会调用`Flask.__call__`函数。这个函数完成 request dispatch 的任务。

对于 request dispatch 而言，首先根据请求，解析 environ，得到 url，

然后调用`Map.match`函数，这个函数会最终找到预先保存的`(url, endpoint, method)`映射，

然后返回 (endpoint, url 请求参数)，

由于得到了 endpoint, 然后，可以从`Flask.view_functions`中直接取到对应的响应函数，

所以，可以直接进行函数调用

```py
self.view_functions[endpoint](url请求参数)

```

至此，就完成了完整的`route`。

# 总结

1. `flask`的`Flask`类是`WSGI`的`dispatch middleware`；

2. `Flask`的`url_map`保存所有的 (url, endpoint, method) 映射关系；

3. `Flask`的`view_functions`保存所有的 {endpoint: function} 映射关系；

4. `dispath request`就是根据 url 找到 endpoint，再根据 endpoint 找到 function，最后调用 function 的过程
