- [`base64`](#base64)
  - [base 编码](#base-编码)
  - [使用](#使用)

## `base64`

### base 编码

> BaseXX 编码是一种用 XX 个字符来表示任意二进制数据的方法

- `Base64`

  - 包含大写字母（A-Z）,小写字母（a-z），数字（0-9）以及+/;
  - Base64 是把 3 个字节变为 4 个字节，所以，Base64 编码的长度永远是 4 的倍数
  - 由于`=`字符也可能出现在 Base64 编码中，但`=`用在 URL、Cookie 里面会造成歧义，所以，很多 Base64 编码后会把=去掉

- `Base32`
  而 Base32 中只有大写字母（A-Z）和数字 234567；

- `Base16`
  而 Base16 就是 16 进制，他的范围是数字(0-9)，字母（ABCDEF）；

### 使用

```py
>>> import base64
>>> base64.b64encode(b'binary\x00string')
b'YmluYXJ5AHN0cmluZw=='

# 标准的 Base64 编码后可能出现字符+和/，在 URL 中就不能直接作为参数，所以又有一种 "url safe" 的 base64 编码，其实就是把字符+和/分别变成-和_：
>>> base64.b64encode(b'i\xb7\x1d\xfb\xef\xff')
b'abcd++//'

>>> base64.urlsafe_b64encode(b'i\xb7\x1d\xfb\xef\xff')
b'abcd--__'

>>> base64.urlsafe_b64decode('abcd--__')
b'i\xb7\x1d\xfb\xef\xff'

```

- 有些 base64 编码末尾等号去除了

  ```py
  import base64
  def _b64decode(data):
      missing_padding = len(data) % 4
      if missing_padding != 0:
          data += b'=' * (4 - missing_padding)
      return base64.urlsafe_b64decode(str(data))
  ```
