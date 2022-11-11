- [参考资料](#参考资料)
- [cJSON](#cjson)
  - [认识一下 `json`](#认识一下-json)
  - [`cJSON`结构](#cjson结构)
  - [`cJSON`存储结构](#cjson存储结构)
  - [使用记录](#使用记录)
- [其他](#其他)

# 参考资料

- [cJSON 使用详细教程 | 一个轻量级 C 语言 JSON 解析器](https://blog.csdn.net/Mculover666/article/details/103796256)
- [cJSON 源码及解析流程详解](https://blog.csdn.net/qq_38289815/article/details/103307262)

# cJSON

## 认识一下 `json`

## `cJSON`结构

- 认识一下 `cJSON` 结构

  ```cpp
  /* The cJSON structure: */
  typedef struct cJSON
  {
      /* next/prev allow you to walk array/object chains. Alternatively, use GetArraySize/GetArrayItem/GetObjectItem */
      // next / prev用于遍历数组或对象链的前向后向链表指针
      struct cJSON *next;
      struct cJSON *prev;

      /* An array or object item will have a child pointer pointing to a chain of the items in the array/object. */
      // child 指向数组或对象的孩子节点0
      struct cJSON *child;

      /* The type of the item, as above. */
      // value值的类型
      int type;

      /* The item's string, if type==cJSON_String  and type == cJSON_Raw */
      // 字符串值
      char *valuestring;

      /* writing to valueint is DEPRECATED, use cJSON_SetNumberValue instead */
      // 整数值
      int valueint;

      /* The item's number, if type==cJSON_Number */
      // 浮点数值
      double valuedouble;

      /* The item's name string, if this item is the child of, or is in the list of subitems of an object. */
      // key的名称
      char *string;
  } cJSON;
  ```

## `cJSON`存储结构

## 使用记录

- `Eval`

# 其他
