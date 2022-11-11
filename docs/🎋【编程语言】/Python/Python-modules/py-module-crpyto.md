- [`crpyto`](#crpyto)

## `crpyto`

- 加密、解密、签名、验签

- `AES`

  ```py
  # https://my.oschina.net/keyven/blog/830410
  # CBC 分组模式, 这种模式是将整个明文分成若干个长度相同的分组，然后对每一小组进行加密
  # AES最常见的有3种方案，分别是AES-128、AES-192和AES-256，区别在于密钥长度不同，AES-128的密钥长度为16bytes（128bit / 8）
  from Crypto.Cipher import AES
  BLOCK_SIZE = AES.block_size # 分组大小，可以指明 16、24、32

  # 填充到16字节
  _pad = lambda s: s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * chr(0)

  # 新建一个AES的对象
  # key为对称加密密钥，16个字节
  # iv 为16位随机初始向量，比如16个字节的ascii
  cryptor = AES.new(key, AES.MODE_CBC, _pad(""))
  # cipher_msg 为待加密明文
  encrypt_buf = cryptor.encrypt(_pad(cipher_msg))
  # '\xaf\xd7\x03\xeb\x10?0\x19\xedk]\xe8\xc5\xfa\xb6\x96'
  # 16进制转化为ascii
  b2a_hex(encrypt_buf)
  # 'afd703eb103f3019ed6b5de8c5fab696'

  # 解密
  # ascii转化为16进制
  encrypt_text = a2b_hex(encrypt_buf)
  # 【需要重新创建一个对象】
  cryptor = AES.new(key, AES.MODE_CBC, _pad(""))
  decrypt_buf = cryptor.decrypt(encrypt_text)
  decrypt_buf = decrypt_buf.rstrip(chr(0))
  ```

- `RSA`

  ```py
  from Crypto.Cipher import RSA
  key = "xxx"
  pri_key = RSA.importKey(key)
  ```
