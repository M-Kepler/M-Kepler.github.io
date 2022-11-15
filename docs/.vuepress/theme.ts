import { path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

// [MDF] 博客简介
// 主题选项：https://vuepress-theme-hope.github.io/v2/zh/config/theme/layout.html
export default hopeTheme({
  hostname: "https://blog.huangjinjie.xyz",

  author: {
    name: "M-Kepler",
    url: "https://blog.huangjinjie.xyz",
  },

  // 启用 iconfont 精选图标
  iconAssets: "iconfont",

  // [MDF] 左侧栏的 logo
  logo: "/sidebar_logo.svg",

  // 文章顶部路径导航
  // breadcrumb: true,

  // 页面元数据：贡献者，最后修改时间，编辑链接
  contributors: false,
  lastUpdated: true,
  // 编辑此页
  editLink: false,

  // 深色模式配置
  // darkmode: "disable",

  // 可选主题色
  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },
  fullscreen: true,

  // [MDF] 默认为 GitHub. 同时也可以是一个完整的 URL
  repo: "M-Kepler",
  // 自定义仓库链接文字。默认从 `repo` 中自动推断为 "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
  repoLabel: "GitHub",
  // 是否在导航栏内显示仓库链接，默认为 `true`
  repoDisplay: true,

  // navbar
  navbar: navbar,

  // 导航栏布局
  navbarLayout: {
    left: ["Brand"],
    center: ["Links"],
    right: ["Repo", "Outlook", "Search"],
  },

  // 是否在向下滚动时自动隐藏导航栏
  // navbarAutoHide: "always",

  // 侧边栏配置
  sidebar: sidebar,

  // 侧边栏排序规则
  // sidebarSorter: ['readme', 'order', 'title'],

  // 侧边栏嵌套的标题深度
  // headerDepth: 10,

  // [MDF] 页脚
  footer: "路虽远，动则将至。",
  displayFooter: true,
  copyright: "Copyright © <a href='https://github.com/M-Kepler', target='_black'>M-Kepler</a>",

  // 是否在桌面模式下右侧展示标题列表，默认: true
  toc: true,

  // 页面布局 Frontmatter 配置：https://vuepress-theme-hope.github.io/v2/zh/config/frontmatter/layout.html#pageinfo
  pageInfo: ["Category", "Tag", "Word", "ReadingTime", "PageView"],

  // [MDF] 个人简介
  // 主题功能选项：https://vuepress-theme-hope.github.io/v2/zh/config/theme/feature.html
  blog: {
    // 文章列表中展示的文章信息
    articleInfo: ["Date", "PageView", "Category", "Tag", "ReadingTime"],
    name: "M-Kepler",
    avatar: "/blog_avatar.jpg",
    description: "学而不思则罔，思而不学则殆！",
    intro: "/sources/intro.html",
    // 剪裁头像为圆形形状
    roundAvatar: true,
    medias: {
      GitHub: "https://github.com/M-Kepler",
      Zhihu: "https://www.zhihu.com/",
      Weibo: "https://weibo.com/",
      Wechat: "https://weixin.qq.com",
    },
  },

  plugins: {
    blog: {
      // 自动摘要
      autoExcerpt: true,
    },

    // [MDF] 评论配置
    comment: {
      provider: "Waline",
      serverURL: "https://waline.huangjinjie.xyz",
      // 部署 Waline：https://waline.js.org/guide/get-started.html
      pageview: true, // 浏览量统计
      // Waline 等级标签
      walineLocales: {
        "/": {
          admin: "",
          level0: "Level0",
          level1: "Level1",
          level2: "Level2",
          level3: "Level3",
          level4: "Level4",
          level5: "Level5",
        },
      },
      // Giscus 样例
      //   provider: "Giscus",
      //   repo: "",
      //   repoId: "",
      //   category: "",
      //   categoryId: ""
    },

    // 组件库
    components: ["Badge", "BiliBili", "VideoPlayer", "YouTube"],

    // 禁用不需要的配置
    mdEnhance: {
      align: true,
      attrs: true, // 使用特殊标记为 Markdown 元素添加属性
      // chart: true,
      // codetabs: true, // 代码块分组
      container: true,
      // demo: true, //代码演示
      // echarts: true,
      // flowchart: true,
      gfm: true,
      // imageMark: true,
      imageSize: true,
      include: true, //导入文件
      // katex: true,
      mark: true,
      mermaid: true,
      footnote: true,
      tasklist: true,
      sub: true, // 上下角标
      sup: true,
      // tabs: true, // 选项卡
      // vpre: true,
      // vuePlayground: true, // Vue 交互演示
    },

    // rss 属性
    feed: {
      rss: true,
      count: 10,
    },

    // 网站当作应用
    pwa: true,
  },
});
