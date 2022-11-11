// [docsify 自动遍历当前目录下 md 文档生成 `_sidebar.md`](https://blog.csdn.net/Dueser/article/details/122761051)
var path = require("path");
var fs = require("fs");

var sidebarTxt = "";
// 指定只生成 docs 文件夹下的路径，但是访问URI 还是要带上 docs/
var dosPath = path.resolve("./docs");
var url_prefix = "docs/";
var baseDirArr = [];

if (!fs.existsSync(dosPath)) {
  console.log("path not exists, quit!");
  return;
}

function walkSync(currentDirPath, callback) {
  var fs = require("fs"),
    path = require("path");
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      // 是文件
      callback(filePath, stat);
      // } else if (stat.isDirectory() && !filePath.includes(".git")) {
    } else if (stat.isDirectory() && !filePath.startsWith(".git")) {
      // 是目录但不是.git
      walkSync(filePath, callback);
    }
  });
}

walkSync(dosPath, function (filePath, stat) {
  if (
    ".md" == path.extname(filePath).toLowerCase() && //后缀是.md
    "_" != path.basename(filePath).substr(0, 1) &&
    path.basename(filePath).includes(`.md`)
  ) {
    var relativeFilePath = filePath.substr(dosPath.length + 1);
    if (relativeFilePath == path.basename(filePath)) {
      // 如果最后的string和原来的一样
      return;
    }
    var relativeFilePathArr = relativeFilePath.split("\\"); //这里可以看情况改

    for (var i = 0; i < relativeFilePathArr.length; i++) {
      if (baseDirArr[i] == relativeFilePathArr[i]) {
        // 相同就continue
        continue;
      }
      baseDirArr[i] = relativeFilePathArr[i]; //记录
      for (var j = 0; j < i; j++) {
        // 缩进
        sidebarTxt += "    ";
      }
      if (i != relativeFilePathArr.length - 1) {
        // 输出文件夹
        sidebarTxt += "- 📁 " + relativeFilePathArr[i] + "\n";
      }
      if (i == relativeFilePathArr.length - 1) {
        // 输入文件
        sidebarTxt +=
          "- [📝 " +
          path.basename(relativeFilePathArr[i], ".md") +
          "](" +
          encodeURI(url_prefix + relativeFilePath) +
          ")\n";
      }
    }
  }
});

console.log(sidebarTxt);
fs.writeFile(path.resolve("./") + "/_sidebar.md", sidebarTxt, function (err) {
  if (err) {
    console.error(err);
  }
  console.log("generate _sidebar.md success.");
});
