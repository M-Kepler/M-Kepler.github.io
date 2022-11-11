- [`jsonschema`](#jsonschema)
  - [什么是 jsonschema](#什么是-jsonschema)
  - [使用记录](#使用记录)
  - [Q & A](#q--a)
  - [模块亮点](#模块亮点)
  - [模块的坑](#模块的坑)
  - [参考资料](#参考资料)

## `jsonschema`

[利用 JSON-Schema 对 Json 数据进行校验( Python 示例)](https://cloud.tencent.com/developer/article/1005810)

[什么是 jsonschema](https://www.cnblogs.com/terencezhou/p/10474617.html)

[jsonschema 检查工具](https://www.jsonschemavalidator.net/)

### 什么是 jsonschema

JsonSchema 定义了一系列关键字，元数据通过这些关键字来描述 Json 数据的规范

```json
{
    "city": "深圳市",
    "user": {
        "name": "huangjinjie",
        "age": 21
    },
    "hobby": [
        "basketball",
        "football"
    ]
}

====> 对应的 jsonschema 为:

{
    "type": "object",
    "properties": {            =====> 属性
        "city": {              =====> 字段名称
            // 字段的类型
            "type": "string",
            // 可以对字符串的最小长度、最大长度做规范。
            "minLength": 2,
            "maxLength": 3,
            // 通过正则表达式描述
            "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
            // 对字符串的格式做规范，例如电子邮件、日期、域名等。
            // 支持的 format 包括 "date", "time", "date-time", "email", "hostname" 等
            "format" : "date",
        },
        "user": {
            "type": "object",
            "properties": {
                "name" : {
                    "type": "string"
                },
                "age" : {
                    "type": "number"
                }
            }
        },
        "hobby": {
            "type": "array",
            "items": [
                {
                    "type": "number"
                }, {
                    "type": "string"
                }
            ],
        }
    },
    "required": ["user"]
}
```

### 使用记录

> 模块使用记录

- 例子

  ```py
  import jsonschema
  get_params = {
      "type": "object",
      "properties": {
          "name": {"type": "string"},
          "age": {"type": "integer"},
          "address": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "country": {"type": "string"}
                }
            }
        },
        "required" : ["name"]
    }

    """
    对应这样一个json：
    {
        "name": "Froid",
        "age" : 26,
        "address" : {
            "city" : "New York",
            "country" : "USA"
        }
    }
    """
  ```

### Q & A

> 使用过程中发现的一些问题或者坑

### 模块亮点

> 模块设计中值的借鉴的亮点

### 模块的坑

> 一些不注意使用容易犯错的地方

### 参考资料

> 参考资料

- [Python 的 jsonschema 模块详解](https://blog.csdn.net/swinfans/article/details/89231682)
