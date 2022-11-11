- [快速开始](#快速开始)
- [为什么选择 docsify](#为什么选择-docsify)
- [目录结构](#目录结构)
- [参考资料](#参考资料)

## 快速开始

> docsify 模板，快速为本地的 markdown 笔记创建一个站点

- step1. 克隆本项目

  ```shell
  git clone git@github.com:M-Kepler/M-Kepler.github.io -b docsify

  ```

- step2. 把 markdown 文件或文件夹直接放在 `docs/` 目录下

- step3. 生成侧边栏目录

  > 托管在 https://vercel.com/ 平台或 githubpage，可以配置构建参数来自动执行命令，本地运行的话，需要手动操作下

  ```shell
  cd M-Kepler.github.io
  node gen_sidebar.js

  ```

- step4. 启动站点

  ```shell
  docsify serve .

  # 或者用 python 启动一个 HTTP 服务器也行
  python3 -m http.server 3000

  ```

- step5. 访问 http://localhost:3000

## 为什么选择 docsify

> 适合简单地把本地笔记发布出去，但是不像 hexo 那样，有标签、私密文章等那么多的功能

[https://docsify.js.org/#/](https://docsify.js.org/#/)

- 可以在不修改 Markdown 内容前提下，把本地笔记发布出去（hexo 则需要给文章配置分类、标签等元信息）

- 笔记的文件夹目录结构就是文章的分类（hexo 则是把所有的文件都丢到 `_post` 目录下，不好管理）

- Markdown 内的本地链接也都有效

- 工程目录结构简单，只有一个 `index.html` 文件，也不需要生成 HTML 文件（hexo 等都需要生成 HTML）即可提供服务

## 目录结构

| 文件作用               | 文件            |
| :--------------------- | :-------------- |
| 文章目录               | `docs/`         |
| 基础配置项（入口文件） | `index.html`    |
| 封面配置文件           | `_coverpage.md` |
| 侧边栏配置文件         | `_sidebar.md`   |
| 导航栏配置文件         | `_navbar.md`    |
| 页脚配置文件           | `_footer.md`    |
| 主页内容渲染文件       | `README.md`     |
| 浏览器图标             | `favicon.ico`   |

**目录与 URL 对应关系：**

```log
.
└── docs
    ├── README.md
    ├── guide.md
    └── zh-cn
        ├── README.md
        └── guide.md
Matching routes

docs/README.md        ==对应的路径==> http://domain.com/
docs/guide.md         ==对应的路径==> http://domain.com/#/guide
docs/zh-cn/README.md  ==对应的路径==> http://domain.com/#/zh-cn/
docs/zh-cn/guide.md   ==对应的路径==> http://domain.com/#/zh-cn/guide
```

## 参考资料

[docsify 使用指南](https://ysgstudyhards.github.io/Docsify-Guide/#/ProjectDocs/Docsify%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97)

[docsify 自动遍历当前目录下 md 文档生成 `_sidebar.md`](https://blog.csdn.net/Dueser/article/details/122761051)

[docsify 的配置+全插件列表](https://www.itrma.com/75.html)

[docsify 博客模板](https://github.com/wugenqiang/NoteBook)
