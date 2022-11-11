- [参考资料](#参考资料)
- [selectors](#selectors)

# 参考资料

# selectors

标准库提供的 selectors 模块是对底层 epoll 等的封装。DefaultSelector 类会根据内核环境自动选择最佳的模块，那在 Linux2.5.44 及更新的版本上都是 epoll 了。
