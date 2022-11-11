- [`RESTfulApi`](#restfulapi)

## `RESTfulApi`

`REST: representational state transfer`: 表现层状态转化

URL 定位资源，用 HTTP 动词（GET，POST，DELETE，PUSH 等）描述操作

- 个人理解

  - 路径就是 url

    比如代码文件在 `bbc_cgi/manage/cloud_deploy.py` 那么访问的 url 就是 `/bbc/manage/cloud_deploy` （bbc 是 apache 加的前缀）

  - 路由和处理方法分离

    > `get/post/put/delete` 这些方法的处理函数不要和 url 写在一起，以后修改也不方便，耦合度太高

    ```py
    # 像 flask 里就喜欢这样定义路由
    @app.route('/index', methods=['GET', 'POST'])
    def index():
      pass
    ```

  - 前后端数据交互使用 `json` 格式返回

- url 中 `提倡` 用减号做为连字符比用下划线要好（其实是对于搜索引擎的搜索结果而言）

- [什么是 RESTful API](https://blog.csdn.net/qq_41378597/article/details/85248848)

- URL 应仅**包含资源（名词）而不包含动作或者动词**！增加学生的 API 路径：`/addNewStudent`，包含操作 addNew 以及资源名称 Student。

# 其他
