---
article: false
title: M-Kepler
icon: note
---

基于 https://newzone.top/ 进行修改，==个性化的改动已经用 `[MDF]` 标记出来，可全局搜索出来进行修改。==

## 目录结构

```log
docs                        =====> 【网站根目录】
|-- .vuepress               =====> 【⭐ 配置文件夹】
|   |-- .cache                  =====> 缓存
|   |-- .temp                   =====> 生成的 HTML 文档
|   |-- config.ts               =====> 配置文件入口
|   |-- navbar.ts               =====> 【侧边栏配置】
|   |-- sidebar.ts              =====> 【导航栏配置】
|   |-- public                  =====> 【静态资源根目录】
|   |-- styles                  =====> css 样式
|   |-- templateBuild.html      =====> 指定构建时使用的 HTML 模板
|   `-- theme.ts                =====> 主题配置
|-- README.md               =====> 首页（xxx/README.md 对应的路由为 xxx/)
|-- intro.md                =====> 个人介绍
`-- sources                 =====> 【⭐文档目录】
    ├── blog                    =====> 下面的子文件夹可以自行组织，只要和 sidebar.ts 中的访问路径对的上就行
    │   ├── README.md           =====> 博客页面
    │   └── 2017-04-22-my_post.md
    ├── blog.md
    ├── code
    │   ├── Markdown.md
    │   ├── Python.md
    │   └── README.md
    ├── intro.md
    ├── life
    │   └── Diet.md
    └── note
        ├── README.md       =====> 如果 note 目录配置是 structure（根据目录结构自动生成目录）
        |                   =====> 该 README.md 就是 xxx/note/ 路径的配置，可以配置是否显示等 frontmater
        ├── 🥝【数据库】
        │   ├── MySQL
        │   │   ├── 00. MySQL 笔记.md
        │   │   ├── README.md
        │   │   └── 参考资料
        │   │       ├── ★ 20 张图带你彻底搞懂 MySQL MVCC 原理.md
        │   │       └── README.md
        │   └── README.md
        └── 随便写写.md

```

## 本地图片引用

==本地图片必须保存在 `docs/.vuepress/public` 目录中，否则生成静态页面时会报错 `Rollup failed to resolve import`。==

假设图片名为 1.png，将其保存在 `docs/.vuepress/public/imgs` 中，则该图片的引用链接为 `/imgs/1.png`，或使用 Markdown 图片链接 `![](/imgs/1.png)`。

# 🖥️ 网站部署

## 本地运行

1. 安装环境 npm 和 pnpm，方法查看 [环境部署教程](https://newzone.top/deploy/VPS.html#环境部署)。

2. 执行 `run.sh` 脚本

    ```
    bash run.sh
    ```

3. 成功即可提示访问链接，默认为 `http://localhost:3000/`

## 文章目录

- 一级标题默认作为文章名了，所以右侧目录不会显示一级标题（也就是说对多个一级标题的显示没那么好）

## 根据文件夹结构自动生成侧边栏

> 期望直接丢个文件夹进去，就可以自动生成侧边栏，而不需要繁琐的配置

- ==默认会把文章的一级别标题作为入口名称==，如果没有一级标题，也没有配置 `frontmater` 的 `title` 这会显示该文章的路径

- 有 `README.md` 的文件夹才会作为栏目展示出来，==可以在 README.md 里配置这个文件夹（分组）的属性，比如是否要显示出来等==，否则会显示一个名称为空白的栏目；README.md 就是该栏目的首页（`xxx/README.md` 对应的路由为 `xxx/`)；否则，显示的是该文章的路径

- **要想文件夹作为分组，且不显示出来，可以在文件夹下放一个 README.md 文件，内容如下：**

    ```yaml
    ---
    article: false
    title: [你的文件夹名称]
    index: false
    ---

    ```

> 可惜不能用文件名作为标题

## 部署到 Vercel

### 方案一

- 到 https://vercel.com/ 新建一个项目，导入本仓库，选择编译后的分支为 `vuepress-publish` （和 `.github/main.yaml` 中定义的保持一致）就行了

    因为已经用 github action 触发了编译，并输出到该分支

### 方案二

- 可以用 vercel 的 CI 完成编译，打开 `Build & Development Settings` 页面

    ```sh
    # Framework Preset 默认选择 Other

    # Build Command 配置为：
    pnpm run docs:build

    # Output Directory 配置为：
    docs/.vuepress/dist

    ```

- 修改 Git 配置页中的 `Production Branch`，选择源码分支，比如 `vuepress-template`

## icon 图标

[iconfont-精选图标](https://vuepress-theme-hope.github.io/v2/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87)

## frontmatter 说明

https://vuepress-theme-hope.github.io/v2/zh/config/frontmatter/layout.html#pageinfo
