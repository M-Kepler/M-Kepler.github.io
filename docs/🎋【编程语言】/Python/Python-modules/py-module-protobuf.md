- [参考资料](#参考资料)
- [`protobuff`](#protobuff)
- [使用记录](#使用记录)
- [模块学习](#模块学习)
  - [数据类型](#数据类型)
    - [`bytes`](#bytes)
    - [`repeated`](#repeated)
    - [`enum` 枚举](#enum-枚举)
    - [`varint` 变长整型](#varint-变长整型)
    - [`map`](#map)
  - [模块化](#模块化)
  - [默认值](#默认值)
  - [与 `json/dict` 的转换](#与-jsondict-的转换)
  - [把 dict 转成 protobuf](#把-dict-转成-protobuf)
- [模块亮点](#模块亮点)
- [模块的坑](#模块的坑)
  - [中文 unicode](#中文-unicode)
  - [`"'RepeatedCompositeFieldContainer' object has no attribute 'DESCRIPTOR'"`](#repeatedcompositefieldcontainer-object-has-no-attribute-descriptor)
  - [`DecodeError: Truncated message.`](#decodeerror-truncated-message)
  - [`UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 4: ordi`](#unicodedecodeerror-ascii-codec-cant-decode-byte-0xe5-in-position-4-ordi)
  - [默认值问题](#默认值问题)
  - [其他](#其他)
- [性能](#性能)

## 参考资料

[protobuf3 语法详解](https://www.cnblogs.com/tohxyblog/p/8974763.html)

[官方接口文档](https://developers.google.com/protocol-buffers/docs/reference/overview)

- 对于 `python` 来说编译过后，原`proto`中每一个`message`都是一个类，都可以通过 `.` 操作符来获取其中的成员

- `.proto` 文件

  用来描述你想存储的数据结构，protocol buffer 编译器会创建一个类，实现自动编码和解析 protocol buffer 数据

  - `Message` 一个 Message 是一个包含一组类型字段的集合。有许多简单的标准的数据类型可以用在类型字段中，包括 bool，int32，float，double 和 string。你也可以使用更加多的结构来定义你的 Message，`例如用其它 Message 类型当作类型字段`

  - `repeated`：这个字段会重复几次一些号码（包括 0）。重复的值给按顺序保存在 protocol buffer 中。重复的字段会被认为是动态的数组。

## `protobuff`

## 使用记录

- 相同结构之间可以相互赋值

  ```py
  rep.query_param.CopyFrom(req.query_param)
  ```

- 编译

  ```sh
  protoc --python_out=. branch.proto
  # 编译后生成 xxx_pb2.py
  ```

- 序列化和反序列化

  ```py
  req = update_branch_req()
  req.branch_name = "test_name"
  # 序列化
  pb_str = req.SerializeToString()

  # 反序列化后得到req2对象
  req2 = update_branch_req()
  req2.ParseFromString(pb_str)
  # ParseFromString函数不会反序列化后的数据，数据还在req2
  print(req2.ParseFromString(pb_str))  # 输出的是None
  print(req2)
  ```

- 判断查出来是否有值

  ```py
  # 判断
  >>> a = get_device_backup_plan_response()
  >>> data = a.SerializeToString()

  >>> b = get_device_backup_plan_response()
  >>> b.ParseFromString(data)
  >>> print(b.ByteSize())
  >>> 0
  ```

## 模块学习

| 类型      | 说明                 |
| :-------- | :------------------- |
| `package` | 包名                 |
| `syntax`  | `protobuf` 版本      |
| `service` | 定义服务             |
| `rpc`     | 定义服务中的成员方法 |
| `stream`  | 定义方法传输的流传输 |
| `message` | 定义消息体           |
| `extend`  | 扩展消息体 TODO      |
| `import`  | 导入一些插件/包      |
| `//`      | 注释                 |

### 数据类型

[google_protobuf 数据类型](https://blog.csdn.net/superbfly/article/details/17920383)

| 类型       | 说明                                     |
| :--------- | :--------------------------------------- |
| `string`   | 字符串类型                               |
| `bytes`    | 比特类型                                 |
| `bool`     | 布尔类型                                 |
| `int32`    | 32 位整形                                |
| `int64`    | 64 位整形                                |
| `float`    | 浮点类型                                 |
| `repeated` | 数组/列表 `repeated string data = 1;`    |
| `map`      | 字典类型 `map<string, string> data = 1;` |

#### `bytes`

> 字节类型

- `protobuf` 的基础参定义，有 `socket_server` 创建出来的服务的`proto` 只需要定义自己的命令和命令的入参就行了

  ```protobuf
  message common_request {
    notify_type type = 1;        // 命令字
    bytes data = 2;              // 传给该命令处理函数的数据，用bytes方便自定义proto类型
    bool wait_for_resp = 3;      // 是否等待结果，否则直接返回调用成功，是则同步等待结果再返回
  }

  message common_response {
      bool result = 1;           // 调用错误码
      string errmsg = 2;         // 调用错误信息
      ##这里使用bytes类型是因为不同的命令字的返回结果不一样，这里忽略了其返回的结构，是什么protobuf结构都可以，只要序列化后传进来即可
      bytes ret_data = 3;        // 命令执行结果
  }
  ```

#### `repeated`

- 初始化中的 `repeated` 成员

  ```py
  # test.proto:
  msg_xxx {
    ...
  }
  msg_test{
    repeated string cfg = 1;
    repeated msg_xxx xxxs= 3;
  }
  # xxx.py:
  for i in ids:
    # 重复的元素使用add()方法一个个进行赋值
    item = yyy.xxxs.add()
    item.id = i
  ```

- 怎么获取 `repeated` 元素的值

  ```protobuf
  # 定义:
  message msg_auto_vpn_info {
    ...
    repeated msg_xxx vpn_topo_ids = 2;
    ...
  }

  message msg_add_branch {
    ...
    msg_auto_vpn_info auto_vpn_info  = 2;
    ...
  }

  # 获取值
  req.auto_vpn_info.vpn_topo_ids[0].id
  ```

#### `enum` 枚举

- proto

  ```cpp
  enum LINE_LABEL_TYPE {
      LABEL_TYPE_ALL = 0;     // proto3 中，第一个枚举值必须为 0
      LABEL_LINE_TYPE = 1;   // 线路类型
      LABEL_LINE_CARRIER = 2;  // 线路运营商
  }

  message test {
      int32 id = 1;
      LINE_LABEL_TYPE type = 2;
  }
  ```

- 使用

  ```py
  # 可以直接导入枚举值
  from path.to.protos.line_label_pb2 import (
      LABEL_TYPE_ALL,
      LABEL_LINE_TYPE,
      LABEL_LINE_CARRIER
  )
  pritn(LABEL_TYPE_ALL)

  # 可以直接导入枚举类型
  from path.to.protos import LINE_LABEL_TYPE
  print(LINE_LABEL_TYPE.LABEL_TYPE_ALL)
  ```

#### `varint` 变长整型

整数在计算机当中占据 `4` 个字节，但是绝大部分的整数，比如价格，库存等，都是比较小的整数，实际用不了 4 个字节，像 127 这种数，在计算机中的二进制是： `00000000 00000000 00000000 01111111（4字节32位）`，完全可以用最后 1 个字节来进行存储，`protobuf` 当中定义了 `Varint` 这种数据类型，可以以不同的长度来存储整数，将数据进一步的进行了压缩。

#### `map`

https://developers.google.com/protocol-buffers/docs/reference/python-generated#map-fields

**定义**

```protobuf
message test {
    map<string, int32> myMap = 1;
}
```

**使用**

```py
# 像字典那样是用就行了，不同的是，如果取不到键值，回返回 0，而 python 是返回 None
for item in result:
    rep.myMap[item.name] = item.id


print(rep.myMap['test'])
print(rep.myMap.get('test222', 333))
```

### 模块化

- 在 `common.proto` 中定义了 `message common_req`，现在 `notify_server.proto` 也需要用这个 message 怎么办？可以导入吗？

  ```py
    # common.proto
    package db_service.common.proto

    message msg_common_utils {
      int32 cmd_id = 1;
      string result = 2;
    }

    # test.proto

    # 这里对导入的路径很敏感，如果两个文件在同一个文件夹下就很好办
    # 如果不是同一个文件夹下，就难办了，因为编译的时候会校验一次import对不对
    import db_service.common
    message test_req {
      int32 id = 1;
    }

    message test_rep {
      # 导入的 message 作为类型
      db_service.common.msg_common_utils ouput = 1;
    }
  ```

### 默认值

如果不赋值的话，`proto` 默认值是什么

```cpp
int32 初始化前是 0
repeated 初始化前是 []
string 初始化前是 ""
```

### 与 `json/dict` 的转换

[pb2json](https://github.com/NextTuesday/py-pb-converters/blob/master/pbjson.py)

- `MessageToDict(rep, including_default_value_fields=True, preserving_proto_file_name=Ture)`

  ```py
  # MessageToJson 用法和 MessageToDict 一样，返回一个json串
  read_data = test_request()
  read_data.ParseFromString(pb_str)
  dict_data = MessageToDict(message=read_data,
                            including_default_value_fields=False,
                            preserving_proto_file_name=True)
  json_data = MessageToDict(message=read_data,
                            including_default_value_fields=False,
                            preserving_proto_file_name=True)
  print(dict_data)
  print(json.loads(json_data))
  ```

### 把 dict 转成 protobuf

[dict-to-protobuf 模块](https://github.com/ericmoritz/dict-to-protobuf)

```py
""" test.proto
message msg_test {
  int32 id = 1;
  bool status = 2;
  string name = 3;
}
"""
from test_pb2 import msg_test
from dict_to_protobuf import dict_to_protobuf

test_pb = msg_test()
test_data = {
  "id": 1,
  "status": False,
  "name": "test"
}
dict_to_protobuf(test_data, test_pb)
print(test_pb)
```

## 模块亮点

> 模块设计中值的借鉴的亮点

## 模块的坑

> 一些不注意使用容易犯错的地方

### 中文 unicode

在 `python` 中 `protobuf` 的解析后的中文数据是 `unicode` 的

```py
#-*-coding:utf-8-*-

import sys
from bbc.db_service.protos.branch_pb2 import query_branch_name_id_map_response

reload(sys)
sys.setdefaultencoding('utf-8')

text = "中文"
rep = query_branch_name_id_map_response()
rep.branch_name_id_map[text] = 100

print rep
"""
branch_name_id_map {
  key: "\344\270\255\346\226\207"
  value: 1
}
"""

# print rep.branch_name_id_map[text]

### 尽量不要用中文作为键得
print rep.branch_name_id_map[unicode(text)]
```

### `"'RepeatedCompositeFieldContainer' object has no attribute 'DESCRIPTOR'"`

```py
message test {
  string name = 1;
  repeated int32 device_ids = 2;
}

test.name

# 想把其中一部分转成dict类型
MessageToDict(test.device_ids)   #  会报错
```

不能只把 protobuf 结构的一部分转为 json 格式

### `DecodeError: Truncated message.`

- 使用 httplib 发请求，请求收到的数据是 protobuf 字符串

  ```sh
  '{"message":"\xe6\x88\x90\xe5\x8a\x9f","data":"\\u0012\\u0012\\b\\u0001\\u0010\\u0001\\u0018\\u0001(\\u00018\xa0\xf8\xfa\\u0005@\xe0\xe8\xf0\\u0011\\u0012\\u0012\\b\\u0001\\u0010\\u0002\\u0018\\u0001(\\u00018\xa0\xf8\xfa\\u0005@\xe0\xe8\xf0\\u0011\\u0012\\u0012\\b\\u0002\\u0010\\u0001\\u0018\\u0001(\\u00018\xa0\xf8\xfa\\u0005@\xe0\xe8\xf0\\u0011\\u0012\\u0012\\b\\u0002\\u0010\\u0002\\u0018\\u0001(\\u00028\xa0\xf8\xfa\\u0005@\xe0\xe8\xf0\\u0011\\u0012","code":0}'
  ```

- 把字符串转为 json 格式：

  ```sh
  # 不指定编码，默认是 utf-8 编码
  (Pdb) json.loads(http_ret)
  *** UnicodeDecodeError: 'utf8' codec can't decode byte 0xa0 in position 1: invalid start byte
  ```

  ```sh
  # 需要指定编码才能得到 protobuf 数据
  (Pdb) json.loads(http_ret, encoding="latin-1")
  {u'message': u'\xe6\x88\x90\xe5\x8a\x9f', u'code': 0, u'data': u'\x12\x12\x08\x01\x10\x01\x18\x01(\x018\xa0\xf8\xfa\x05@\xe0\xe8\xf0\x11\x12\x12\x08\x01\x10\x02\x18\x01(\x018\xa0\xf8\xfa\x05@\xe0\xe8\xf0\x11\x12\x12\x08\x02\x10\x01\x18\x01(\x018\xa0\xf8\xfa\x05@\xe0\xe8\xf0\x11\x12\x12\x08\x02\x10\x02\x18\x01(\x028\xa0\xf8\xfa\x05@\xe0\xe8\xf0\x11\x12'}
  ```

- 但是这个数据无法进行 protobuf 解析

  ```sh
  (Pdb) result.ParseFromString(pb_str)
  *** DecodeError: Truncated message.

  # 虽然抛异常，但是实际上 result 已经得到解析后的结果了
  ```

### `UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 4: ordi`

[UnicodeDecodeError: 'ascii' codec can't decode byte 0xe5 in position 4: ordi 问题](https://blog.csdn.net/weixin_44349707/article/details/103802027)

```py
import sys

reload(sys)

sys.setdefaultencoding('utf-8')
```

### 默认值问题

- [默认值](https://www.v2ex.com/t/535379)产生的问题

  `protobuf3` 会对没有赋值的字段一个默认值，这样很容易造成错误

  查询操作没有传 `delete_flag=0`，但是由于 `proto` 整形默认值就是 `0`，所以序列化传送到 `db_service` 后解序列化出来取 `req.columns.delete_flag` 取到的就是 `0`

- 解决方法一

  我的做法是不使用 `Integer()`，使用 `String(length=2)` 字符串来表示整形

  ```py
  req = get_device_list_request()
  with session_scope() as session:
    # 这里即使没有传delete_flag过来
    # 查询的时候取 req.columns.delete_flag会取到默认值 0
    dev_list = MysqlApi(session).query(
      delete_flag=req.columns.delelte_flag
    )
  ```

- 解决方法二

  为有可能被默认值干扰的字段（`repeated`数据类型如果不赋值就是 `[]`，用 `if req.books` 已足够判断出来）增加一个布尔类型的赋值字段，表示该字段是否来自用户赋值

  ```py
  def get_org_dhcp_cfg(self, pb_str):
    req = get_org_dhcp_cfg_request()
    req = get_org_dhcp_cfg_response()
    req.ParseFromString(pb_str)
    kwargs = {}
    # proto中增加字段 has_cfg_id 表示这一项是否有设值（无论是否设为0）
    # 如果有设置，就把他传过去，如果没有设置，取到的是None
    if req.has_cfg_id:
      kwargs['cfg_id'] = req.cfg_id
    if req.has_org_id:
      kwargs['org_id'] = req.org_id
    if req.has_enable:
      kwargs['enable'] = req.enable
    ret = mysql_api_org(session).query(**kwargs)

  def query(self, cfg_id=None, org_id=None, enable=None):
    if cfg_id is not None:
      do_something...
  ```

- 解决方法三

  和解决方法二一样，为每个字段增加一个值，用来表示该项是否被设值；封装到 `common.proto` 中

  ```py
  # common.proto
  synctax = "proto3"
  message optional_int32 {
      bool has_value = 1;
      bool value = 2;
  }
  message optional_64 {
      bool has_value = 1;
      bool value = 2;
  }
    message optional_string {
      bool has_value = 1;
      bool value = 2;
  }
  # test.proto
  synctax = "proto3"
  import "common.proto"
  package db_service.device;
  message msg_device_info {
      optional_string device_name = 1;
      ...
  }
  }
  ```

### 其他

- 数据库字段默认值为 `NULL`，查询的时候把它赋值给了 `string` 类型的成员

  ```py
  # 报错
  # rep.dhcp_config = dhcp_config
  # TypeError: None has type <type 'NoneType'>, but expected one of: (<type 'str'>, <type 'unicode'>)
  # 1. 先判断一下是否存在
  if dhcp_config:
      rep.dhcp_config = dhcp_config

  # 2.强转string（不推荐）因为数据库中为NULL但是却查询回来空字符串""
  ```

- `repeated string cfg = 1;`

  ```py
  # 赋值
  cfg.extend(xxx)
  ```

## 性能

- 从数据表查出两万条数据进行序列化，耗时 0.几秒

```log
集团测试
<type 'unicode'>
Traceback (most recent call last):
  File "b.py", line 52, in <module>
    _parse_excel("/root/hjj/jd_dev_dhcp_cfg.xlsx")
  File "b.py", line 39, in _parse_excel
    db_dhcp_config = name_dhcp_map[a]
KeyError: u'\u96c6\u56e2\u6d4b\u8bd5'
```
