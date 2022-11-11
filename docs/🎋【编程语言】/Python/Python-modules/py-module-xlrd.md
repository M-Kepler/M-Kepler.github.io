- [`xlrd xlwt`](#xlrd-xlwt)

## `xlrd xlwt`

> 第三方库
> 操作 excel 表哥的读写库

- xlrd 读 excel 数据时，如果 excel 中存储的是数字类型，比如 123 读出来会变成 123.0

  一下做法是强转 float 到 int，但是如果单元格内容不是数字类型，会报错，忽略掉这个错误 XXX

  ```py
  import xlrd
  try:
      table = xlrd.open_workbook(excel_path).sheets()[0]
  except:
      raise Exception('read err')
  cols = table.row_values(0)
  deal_cols = list()
  for col in cols:
      try:
          if float(col) == int(col):
              col = int(col)
      except Exception:
          pass
      finally:
          deal_cols.append(col)
  ```
