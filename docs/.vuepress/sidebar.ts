import { sidebar } from "vuepress-theme-hope";

// [MDF] 侧边栏
//（和 json 的层级结构类似），按定义顺序排布，默认用目录下的 README.md 作为首页
// 侧边栏配置：https://vuepress-theme-hope.github.io/v2/zh/guide/layout/sidebar.html
export default sidebar([
  // "/sources/Read", // 也可以直接把文章放到侧栏上
  {
    text: "🍒️ 代码",
    icon: "",
    prefix: "sources/code/",
    link: "",
    collapsable: true,
    // 侧边栏可嵌套和分组
    children: [
      "README.md",
      {
        text: "Basic",
        icon: "emmet",
        collapsable: true,
        children: ["Markdown.md"],
      },
      {
        text: "FrondEnd",
        icon: "app",
        collapsable: true,
        children: ["Python.md"],
      },
    ],
  },
  {
    text: "🌱 笔记",
    icon: "",
    prefix: "/sources/note/",
    link: "",
    collapsable: true,
    children: "structure",
  },
  {
    text: "📚 博客",
    icon: "",
    prefix: "/sources/blog/",
    link: "",
    collapsable: true,
    children: "structure",
  },
]);
