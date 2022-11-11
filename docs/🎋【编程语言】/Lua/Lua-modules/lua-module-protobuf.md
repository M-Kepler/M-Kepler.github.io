- [protoc-gen-lua](#protoc-gen-lua)
  - [参考资料](#参考资料)
  - [工具安装](#工具安装)
- [其他](#其他)

# protoc-gen-lua

## 参考资料

- [protoc-gen-lua](https://github.com/sean-lin/protoc-gen-lua)

## 工具安装

- 编译安装

  ```sh
  # 下载代码
  cd /opt
  git clone https://github.com/sean-lin/protoc-gen-lua.git protoc-gen-lua

  # 系统 lua 库路径
  LUA_LIB_PATH=/usr/local/lib/lua
  PROTOC_GEN_LUA_PATH=/opt/protoc-gen-lua

  # 编译 so 库
  cd $PROTOC_GEN_LUA_PATH/protobuf/
  sudo make

  # 创建 protoc 插件软链
  sudo ln -s $PROTOC_GEN_LUA_PATH/plugin/protoc-gen-lua /usr/local/bin

  # 添加到环境变量中
  # 创建一个文件夹来存放自己的lua库
  mkdir -p $LUA_LIB_PATH
  echo "export LUA_PATH=\"$LUA_LIB_PATH/?.lua;;\"" >> ~/.bashrc
  source ~/.bashrc

  # 创建软链到 lua 库目录下
  for file in $(ls *.lua *.so);do sudo ln -s $PROTOC_GEN_LUA_PATH/protobuf/$file $LUA_LIB_PATH/$file;done;
  ```

- 简单测试一下

  ```sh
  cp -r /opt/protoc-gen-lua/example ~/example
  protoc --lua_out=. person.proto
  lua test.lua
  ```

# 其他
