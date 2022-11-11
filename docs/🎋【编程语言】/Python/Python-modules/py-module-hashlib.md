- [hashlib](#hashlib)
  - [MD5](#md5)
  - [sha1](#sha1)

## hashlib

> 提供了常见的摘要算法，如 MD5，SHA1 等等

### MD5

- 例子
  ```py
  import hashlib
  sha1_encoder = hashlib.sha1()
  # 如果msg很大，可以分成多个部分，分别调用update，计算结果是一样的
  # sha1_encoder.update(msg_part_1)
  # sha1_encoder.update(msg_part_2)
  sha1_encoder.update(msg)
  # 计算结果
  msg_hash =  hashlib.md5.hexdigest()
  ```

- 计算文件md5值
  ```py
  with open(file_path, 'rb') as fd:
    data = fd.read()
    md5 = hashlib.md5(data).hexdigest()
  ```

### sha1
