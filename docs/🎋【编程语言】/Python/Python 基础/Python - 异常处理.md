- [异常处理](#异常处理)

# 异常处理

[BaseException 和 Exception 的区别](https://www.cnblogs.com/-chenxs/p/11206678.html)

```py
# BaseException 是 Exception 的父类，作为子类的Exception无法截获父类BaseException类型的错误
class BbcCloudSvrException(Exception):
    _MESSAGE = _("%s$$unknown_bbc_scloud_svr_exception" % MODULE_NAME)

    def __init__(self, message=None, **kwargs):
        if not message:
            message = self._MESSAGE
        try:
            if kwargs:
                message = message % kwargs
        except Exception:
            pass

        self.message = message
        super(BbcCloudSvrException, self).__init__(message)

    def __str__(self):
        return self.message

    def __unicode__(self):
        return self.message.decode('utf8')

class ExceptionTest(BbcCloudSvrException):
  _MESSAGE = _('国际化')
  def __init__(self, message=None):
    super(ExceptionTest, self).__init__(
      message=message
    )
```
