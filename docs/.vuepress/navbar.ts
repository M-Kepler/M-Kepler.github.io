import { navbar } from "vuepress-theme-hope";

// [MDF] 导航栏
// 精选图标：https://vuepress-theme-hope.github.io/v2/zh/guide/interface/icon.html#iconfont-%E7%B2%BE%E9%80%89%E5%9B%BE%E6%A0%87
export default navbar([
  {
    text: "博客",
    icon: "blog",
    link: "/sources/blog"
  },
  {
    text: "代码",
    icon: "code",
    prefix: "/sources/code",
    children: [
      "/Markdown",
      {
        text: "开发",
        icon: "vue",
        prefix: "",
        children: [
          "/Python"
        ],
      },
    ],
  },
  {
    text: "生活",
    icon: "emmet",
    prefix: "/sources/life/",
    children: [
      "Diet"
    ],
  },
  {
    text: "工具收藏",
    icon: "tool",
    link: "https://nav.newzone.top/"
  },
]);
