- [`collections`](#collections)
  - [`namedtuple`](#namedtuple)
  - [`deque`](#deque)
  - [`defaultdict`](#defaultdict)
    - [使用记录](#使用记录)
  - [`Counter`](#counter)
  - [`OrderedDict`](#ordereddict)

## `collections`

[Python——详解 collections 工具库](https://www.cnblogs.com/techflow/p/12400482.html)

### `namedtuple`

> namedtuple 元类；是一个非常简单的元类，通过它我们可以非常方便地定义我们想要的类。元类创建类，类创建对象

- 可以有 `tuple` 那样的不可变性，也可以轻松创建一个类

  ```py
  from collections import namedtuple

  # 创建了一个Point类，包含成员 x y
  Point = namedtuple('Point', ['x', 'y'])

  # 虽然我们定义了三个字段，但是我们只设置了两个缺失值。在这种情况下，namedtuple 会自动将缺失值匹配上 score 和 age 两个字段。因为在 Python 的规范当中，必选参数一定在可选参数前面。所以 nuamdtuple 会自动右对齐
  # Point = namedtuple('Point', ['x', 'y', 'z'], defaults=(10, 20)) 设置 y、z 的默认值
  p = Point(1,2)

  print(p.x)
  print(p.y)
  ```

### `deque`

- 作为一个弥补列表`list` 插入删除时效率低（`list` 用的是顺序表实现）的`双向链表`, 适用于队列和栈

  ```py{cmd=ture}
  from collections import deque
  q = deque(['a', 'b', 'c'])
  q.append('x')
  q.appendleft('y')
  print(q)
  # ['y', 'a', 'b', 'c', 'x']
  ```

### `defaultdict`

- [python 带有默认值的 dict 自定义默认值的 dict defaultdictbyKey](https://blog.csdn.net/mantoureganmian/article/details/97918236)

- 一个列表，里面是（key, value) 这样的键值对元组，要将它转换成一个字典对象，并将 key 相同的 value 作为一组

- 如果`key`不存在，容器会自动返回我们预先设置的默认值。需要注意的是 **`defaultdict`传入的默认值可以是一个类型也可以是一个方法**

  ```py
  >>> from collections import defaultdict
  >>> dd = defaultdict(lambda: 'N/A')
  >>> dd['key1'] = 'abc'
  >>> print(dd['key1'])
  >>> 'abc'
  >>> print(dd['key2'])
  >>> 'N/A'

  >>> data = [(1, 3), (2, 1), (1, 4), (2, 5), (3, 7)]
  >>> #怎么把这个东西搞成相同key的放在一起，然后后面的value组成列表
  result = defaultdict(list)
  for k, v in data:
    result[k].append(v)
  >>> defaultdict(<type 'list'>, {1: [3, 4], 2: [1, 5], 3: [7]})

  #### 用传统dict的setdefault也可以做到
  ret = dict()
  for k, v in data:
    ret.setdefault(k, list()).append(v)
  >>> {1: [3, 4], 2: [1, 5], 3: [7]}
  ```

#### 使用记录

- 把很多个用用相同键值对的字典合并在一起

  ```py
  origin_data = {
    "app_crc": 11111111,
    "app_name": "taobao",
    "priority": 5,
    "flow_type": 0,
    "session_info": [
        {
            "up_flow_rate": "111",
            "src_ip": "192.168.10.1"
        },
        {
            "up_flow_rate": "222",
            "src_ip": "92.68.7.1"
        }
    ]
  }

  new_data = [
    {
      "app_crc": 11111111,
      "app_name": "taobao",
      "priority": 5,
      "flow_type": 0,
      "up_flow_rate": "111",
      "src_ip": "192.168.10.1"
    },
    {
      "app_crc": 11111111,
      "app_name": "taobao",
      "priority": 5,
      "flow_type": 0,
      "up_flw_rate": "222",
      "src_ip": "92.68.7.1"
    },
  ]

  def do_merge():
      ret = list()
      for app_item in origin_data.get('section_info', []):
          for sec_item in app_item.pop('session_info', []):
              tmp_app_info_item = deepcopy(app_item)
              tmp_app_info_item.update(sec_item)
              ret.append(tmp_app_info)

  def do_split():
      ret = list()

  # 和上面相反的操作，还原回去
  ```

- 合并多个字典

  ```py

  # 有好几个这种文件，把结果整合在一起
  {
    "run_cnt": {
      1: 12,
      2: 22,
      3: 24
    },
    "run_time": {
      1: 0.23232,
      2: 2.23232,
      3: 0.2311
    },
    "slowest": {
      1: 0.1232,
      2: 0.7232,
      3: 0.3311
    }
  }
  import json
  from collections import defaultdict

  total = {}
  # 直接默认为整形，以前都是默认列表，这样还是挺少用的
  total["run_cnt"] = defaultdict(int)
  total["run_time"] = defaultdict(float)
  total["slowest"] = defaultdict(list)
  files = [name for name in os.listdir(os.path.abspath(".")) if name.endswith(('.json')]

  for f in files:
    with open(f, "r") as fd:
      content = json.load(f)
      for k, v in content.get("run_cnt", {}).items():
        total["run_cnt"][k] += v
      for k, v in content.get("run_time", {}).items():
        total["run_cnt"][k] += v
      for k, v in content.get("slowest", {}).items():
        # FIXME 本来想这样直接min的，但是得到的总是 0.0，估计 defaultdict(float) 默认值就是0.0了
        # total["run_cnt"][k] = min(total["run_cnt"][k], v)
        total["run_cnt"][k].append(v)
  print(total)
  ```

### `Counter`

作用是自动计数，比如常见的问题，计算词频、计算 `topk` 都可以一行代码解决

- `counter` 简单的计数器

  ```py
  from collections import Counter
  c = Counter()
  for ch in 'programming':
      c[ch] = c[ch] + 1
  print(c)
  ```

- 用例

  ```py
  >>> from collections import Counter
  >>> words = ['apple', 'apple', 'pear', 'watermelon', 'pear', 'peach']
  >>> counter = Counter(words)
  # 词频
  >>> print(counter)
  >>> Counter({'apple': 2}， {'pear': 2, 'watermelon': 1, 'peach':1})
  # top k
  >>> print(counter.moust_comm(1))
  >>> [('apple', 2)]

  # 列表元素为字典时
  >>> test = [{'event_type':1, 'other_info': 'xxx'}, 'eventy_type':2, 'other_info': 'yyy]
  ```

### `OrderedDict`

- 如其名，本来 `dict` 是无序的，要想保持 `key` 的顺序，就可以使用这个

  ```py
  # OrderedDict会根据放入元素的先后顺序进行排序。所以输出的值是排好序的。
  from collections import OrderedDict
  d = dict([('a', 1), ('b', 2), ('c', 3)])
  print(d)
  od = OrderedDict([('a', 1), ('b', 2), ('c', 3)])
  print(od)
  ```
