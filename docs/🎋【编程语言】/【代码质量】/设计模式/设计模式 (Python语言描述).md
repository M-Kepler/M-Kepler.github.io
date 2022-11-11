- [参考资料](#参考资料)
- [设计原则](#设计原则)
  - [单一职责原则 `Single Responsibility Principle`](#单一职责原则-single-responsibility-principle)
  - [开闭原则 `Open Close Principle`](#开闭原则-open-close-principle)
  - [里氏代换原则 `Liskov Substitution Principle`](#里氏代换原则-liskov-substitution-principle)
  - [接口隔离原则 `Interface Segregation Principle`](#接口隔离原则-interface-segregation-principle)
  - [依赖倒置原则 `Dependence Inversion Principle`](#依赖倒置原则-dependence-inversion-principle)
  - [合成复用原则 `Composite Reuse Principle`](#合成复用原则-composite-reuse-principle)
  - [迪米特法则（最少知道原则） `Demeter rinciple`](#迪米特法则最少知道原则-demeter-rinciple)
- [设计模式 `Design Pattern`](#设计模式-design-pattern)
  - [创造型模式 `Creational Patterns`](#创造型模式-creational-patterns)
    - [简单工厂模式 `Simple Factory Pattern`](#简单工厂模式-simple-factory-pattern)
    - [工厂方法模式 `Factory Method Pattern`](#工厂方法模式-factory-method-pattern)
    - [抽象工厂模式 `Abstract Factory Pattern`](#抽象工厂模式-abstract-factory-pattern)
    - [单例模式 `Singleton Pattern`](#单例模式-singleton-pattern)
    - [建造者模式 `Builder Pattern`](#建造者模式-builder-pattern)
    - [原型模式 `Prototype Pattern`](#原型模式-prototype-pattern)
    - [创造型模式总结](#创造型模式总结)
  - [结构型模式](#结构型模式)
    - [适配器模式 `Adapter Pattern`](#适配器模式-adapter-pattern)
    - [桥接模式 `Bridge Pattern`](#桥接模式-bridge-pattern)
    - [过滤器模式 `Filter Pattern`](#过滤器模式-filter-pattern)
    - [组合模式 `Composite Pattern`](#组合模式-composite-pattern)
    - [装饰器模式 `Decorator Pattern`](#装饰器模式-decorator-pattern)
    - [外观模式 `Facade Pattern`](#外观模式-facade-pattern)
    - [享元模式 `Flywright Pattern`](#享元模式-flywright-pattern)
    - [代理模式 `Proxy Pattern`](#代理模式-proxy-pattern)
    - [结构型模式总结](#结构型模式总结)
  - [行为型模式 `Behavioral Patterns`](#行为型模式-behavioral-patterns)
    - [责任链模式 `Chain Of Responsibility Pattern`](#责任链模式-chain-of-responsibility-pattern)
    - [命令模式 `Command Pattern`](#命令模式-command-pattern)
    - [解释器模式 `Interpreter Pattern`](#解释器模式-interpreter-pattern)
    - [迭代器模式 `Iiterator Pattern`](#迭代器模式-iiterator-pattern)
    - [中介模式 `Mediator Pattern`](#中介模式-mediator-pattern)
    - [备忘录模式 `Memento Pattern`](#备忘录模式-memento-pattern)
    - [观察者模式 `Observer Pattern`](#观察者模式-observer-pattern)
    - [发布订阅模式 `Publish Subscribe Pattern`](#发布订阅模式-publish-subscribe-pattern)
    - [状态模式 `State Pattern`](#状态模式-state-pattern)
    - [空对象模式 `Null Pattern`](#空对象模式-null-pattern)
    - [策略模式 `Strategy Pattern`](#策略模式-strategy-pattern)
    - [模板模式 `Template Pattern`](#模板模式-template-pattern)
    - [访问者模式 `Visitor Pattern`](#访问者模式-visitor-pattern)
    - [行为型模式总结](#行为型模式总结)
- [其他](#其他)

# 参考资料

- 《大话设计模式》

- [★★★★★ 专门讲设计模式的网站](https://refactoringguru.cn/design-patterns/catalog)

- [★★★★★ 设计模式总结](https://www.cnblogs.com/chenssy/p/3357683.html)

- [★★★★★ 设计模式七大原则(C++描述)](https://www.cnblogs.com/Ligo-Z/p/11161911.html)

- [📺【网易】C++设计模式](https://www.bilibili.com/video/av22292899)

- [📺 五分钟学设计模式](https://space.bilibili.com/59546029/channel/detail?cid=134013)

- [设计模式](https://wizardforcel.gitbooks.io/design-pattern-lessons/content/index.html)

- [设计模式](https://blog.csdn.net/zhengzhb/category_926691.html)

- [★ 如何利用设计模式改善业务代码](http://r8n.cn/yMfNWl)

# 设计原则

> - 相对于细节的多变性，抽象的东西要稳定的多。以抽象为基础搭建起来的架构比以细节为基础搭建起来的架构要稳定的多
> - `SOLID` 设计原则
> - 单一职责原则告诉我们实现类要职责单一；
> - 里氏替换原则告诉我们不要破坏继承体系；
> - 依赖倒置原则告诉我们要面向接口编程；
> - 接口隔离原则告诉我们在设计接口的时候要精简单一；
> - 迪米特法则告诉我们要降低耦合。而开闭原则是总纲，他告诉我们要对扩展开放，对修改关闭。
> - 合成复用原则告诉我们要优先使用组合或者聚合关系复用，少用继承关系复用。

## 单一职责原则 `Single Responsibility Principle`

一个类，只有一个引起它变化的原因。应该只有一个职责。每一个职责都是变化的一个轴线，如果一个类有一个以上的职责，这些职责就耦合在了一起。这会导致脆弱的设计。当一个职责发生变化时，可能会影响其它的职责。另外，多个职责耦合在一起，会影响复用性。例如：要实现逻辑和界面的分离。

**特征**

- 类功能不明确，多个不相干的功能娇柔在一起，功能之间会相互影响

- 不利于扩展，单个类承担的职责越多，一位置这个类的复杂度也会越来越高

**优化**

- 把功能拆开，大类拆成小类，模块拆分，不要担心定义了太多的函数太多的类

## 开闭原则 `Open Close Principle`

> 开闭原则就是说`对扩展开放，对修改关闭`。在程序需要进行拓展的时候，不能去修改原有的代码，实现一个热插拔的效果，也就是说 **`你应该可以在不修改某个类原有代码的情况下，扩展它的行为`**
> 一句话概括就是：为了使程序的扩展性好，易于维护和升级。想要达到这样的效果，我们需要使用接口和抽象类，也就是说可以进行扩展，但是尽量不要去修改

**特征**

- 比如硬编码/魔数，我写死了这个类/函数只能完成这一件事情，那下次扩展或更改的时候就必须要去改代码了

**优化**

- 使用 `组合与依赖注入` 来改善代码

  你搞个参数入参也好啊，或者把里面的常量全抽离出来，不要写死

- 使用 `类继承` 来改善代码

  把父类中会变动的部分进行抽象，由子类去重写这部分逻辑

- 使用 `数据驱动思想` 来改善代码

  **将经常变动的东西，完全以数据的方式抽离出来。当需求变动时，只改动数据，代码逻辑保持不动**，就像做单元测试的时候一样，大部分代码都是一样的，只是测试一下不同数据会产生什么结果

- 开闭原则还是蛮重要的，下面的 `里氏代换原则`、`接口隔离原则` 其实都是为了实现开闭原则

## 里氏代换原则 `Liskov Substitution Principle`

里氏代换原则 (Liskov Substitution Principle LSP) 面向对象设计的基本原则之一。 里氏代换原则中说，**`任何基类可以出现的地方，子类一定可以出现`** LSP 是继承复用的基石，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。里氏代换原则是对 “开 - 闭” 原则的补充。实现 "开 - 闭" 原则的关键步骤就是抽象化。而基类与子类的继承关系就是抽象化的具体实现，所以里氏代换原则是对实现抽象化的具体步骤的规范。

- **特征**

  - 按照定义中的说法，那么就是父类的函数如果子类中没有做实现，那就无法用子类替代父类了（XXX 子类继承了父类，照理说父类能调用的方法子类肯定也能调用啊，所以为什么要有这个原则呢）

  - 这只是个规范吧，`子类可以扩展父类的功能，但不能改变父类原有的功能（覆盖???）`

  - 尽量`把父类设计为抽象类，让子类继承父类，并实现在父类中声明的方法`，运行时，子类实例替换父类实例，就可以很方便地扩展系统的功能，同时无须修改原有子类的代码，增加新的功能可以通过增加一个新的子类来实现

- 里氏代换原则的意思并不是“子类不能重写父类的方法”，而是**子类重写父类方法时，可以改变方法的具体行为，但不应该改变方法的用途**。比如父类有一个排序功能，子类可以重写来改变排序的算法，但不应该改变排序这个功能，这样父类才可以被子类替换。

- 改造前

  ```py{cmd=true}
  class A:
      def __init__(self):
          pass

      def func1(self, a, b):
          return a - b

  class SubA(A):
      def func1(self, a, b):
          ''' 覆盖了父类中原有的 func1
          '''
          return a + b

      def func2(self, a, b):
          return self.func1(a, b) - a

  if __name__ == "__main__":
      s_a = SubA()
      ret = s_a.func2(100, 20)
      print(ret)    # 输出20
  ```

- 改造后
  不要去覆盖父类原有的功能

## 接口隔离原则 `Interface Segregation Principle`

> 一个类对另一个类的依赖应该建立在最小的接口上，`也就是说把臃肿的接口进行拆分，不相干的不要放在一起`，降低类之间的耦合度的意思

- 特征

  - 这...好像我们都是这样来做的，比如有个工具模块 `utils.py`，里面实现了很多的方法 `func1`、`func2`、`func3`，有的方法是模块 `a.py` 用到的，有的方法是模块 `b.py` 用到的

- **不应该强迫客户程序依赖他们不用的方法;接口应该小而完备**

- 改造前

  ```py
  class Base(object):
      def __init__(self):
          pass

      def function1(self):
          pass

      def function2(self):
          pass

      def function3(self):
          pass

      def function4(self):
          pass


  class A:
      def __init__(self, base_obj):
          self.base_obj = base_obj

      def relative_func1(self):
          ''' A 类依赖 Base类的function1方法
          '''
          self.base_obj.function1()

      def relative_func3(self):
          ''' A 类依赖 Base类的function3方法
          '''
          self.base_obj.function3()


  class B(Base):
      def __init__(self, base_obj):
          self.base_obj = base_obj

      def function2(self):
          ''' B类继承base类，重写该方法
          '''
          print('function2 in class b')
          super().function2()

      def function4(self):
          ''' B类继承base类，重写该方法
          '''
          print('function4 in class b')
          super().function4()


  if __name__ == "__main__":
      '''
      上面的接口中可以看出并不符合接口隔离的原则
      应该把 Base 类拆开
      比如funciton1和function2是同一事情的，应该抽离到 Base1 类
      function3和function4是处理同一事情的，应该抽离到 Base2 类
      类A依赖function1和function3，那就入参 base1_obj 和 base2_obj
      类B依赖 function2和function4的，那就继承 Base1 和 Base2 就行了
      '''
      pass
  ```

- 改造后

  ```py

  class Base1(object):
      def __init__(self):
          pass

      def function1(self):
          pass

      def function2(self):
          pass

  class Base2(object):
      def __init__(self):
          pass

      def function3(self):
          pass

      def function4(self):
          pass


  class A:
      def __init__(self, base1_obj, base2_obj):
          self.base1_obj = base1_obj
          self.base2_obj = base2_obj

      def relative_func1(self):
          ''' A 类依赖 Base类的function1方法
          '''
          self.base1_obj.function1()

      def relative_func3(self):
          ''' A 类依赖 Base类的function3方法
          '''
          self.base2_obj.function3()


  class B(Base1, Base2):
      def function2(self):
          ''' B类继承base类，重写该方法
          '''
          print('function2 in class b')
          super().function2()

      def function4(self):
          ''' B类继承base类，重写该方法
          '''
          print('function4 in class b')
          super().function4()


  if __name__ == "__main__":
      pass
  ```

- 感觉自己之前写的 `utils.py` 就是了，把所有东西都不归类，全部叠加到一个模块里面去

- 看到这个例子，想到的就是自己之前写的类，一个 `class Config` 类就包含了多个配置在里面，其实自己也知道这是不合理的，应该每个配置文件就定义一个类

## 依赖倒置原则 `Dependence Inversion Principle`

> - 所谓依赖倒置原则（Dependence Inversion Principle）就是 `要依赖于抽象，不要依赖于具体`。简单的说就是要求对抽象进行编程，不要对实现进行编程，这样就降低了客户与实现模块间的耦合。
> - 实现开闭原则的关键是抽象化，并且从抽象化导出具体化实现，如果说开闭原则是面向对象设计的目标的话，那么依赖倒转原则就是面向对象设计的主要手段。 from：百度百科

- 这个原则主要是对于类之间的关系的一个约束，上面的几个原则几乎都是说同一类事物应该怎么组织，怎么创建；现在讲的是事物创建出来了，怎么更合适地给其他人去使用

- 问题提出
  比如说类 A 原本依赖类 B，现在需要修改为依赖类 C，那么将不得不修改类 A，但是类 A 属于高层次的模块，涉及业务比较多，B 和 C 是基础模块，修改类 A 很可能影响正常业务

- 解决方法

  - 说白了还是解耦，类 A 不要直接依赖于类 B ，将类 A 修改为依赖接口 I，类 B 和类 C 各自实现接口 I，类 A 通过接口 I 间接与类 B 或者类 C 发生联系，则会大大降低修改类 A 的几率
  - 核心思想仍然是 **面向接口编程**

- 改造前

  ```py
  class Man(object):
    def __init__(self):
      # 如果需求变成了读报纸，则需要修改Man类
      # 我不读书，我想读报纸，居然要修改我自己
      self.api = Book()

    def read(self):
      self.api.read()

  class Book(object):
    def read(self):
      print("reading book")

  if __name__ == "__main__":
      a = Man()
      a.read()
  ```

- 改造后

  ```py
  class Man(object):
    def __init__(self):
      self.api = IReader()

    def read(self):
      self.api.read()

  class IReader(self):
    """
    外部模块依赖类IReader，而不是直接依赖类Book或类Newspaper
    # 感觉有点像工厂模式 #
    """
    def __init__(self):
        self.interface = Book()

    def read(self):
        return self.interface.read()

  class Book(object):
    def read(self):
      print("reading book")

  class Newspaper(object):
    def read(self):
      print("reading newspaper")

  if __name__ == "__main__":
      a = Man()
      a.read()
  ```

## 合成复用原则 `Composite Reuse Principle`

> 合成复用原则就是指在一个新的对象里通过关联关系（包括组合关系和聚合关系）来使用一些已有的对象，使之成为新对象的一部分；新对象通过委派调用已有对象的方法达到复用其已有功能的目的。简言之：要尽量使用组合 / 聚合关系，少用继承。

## 迪米特法则（最少知道原则） `Demeter rinciple`

> 为什么叫最少知道原则，就是说：**`一个实体应当尽量少的与其他实体之间发生相互作用`**，使得系统功能模块相对独立。也就是说一个软件实体应当尽可能少的与其他实体发生相互作用。这样，当一个模块修改时，就会尽量少的影响其他的模块，扩展会相对容易，这是对软件实体之间通信的限制，它要求限制软件实体之间通信的宽度和深度。

- 改造前

  ```py
  class Customer(object):
      """
      拥有名字、性别、存款三个属性
      """
      def __init__(self, name, sex, deposit):
          self._name = name
          self._sex = sex
          self.wallet = Wallet()

      @propery
      def name(self):
          return self._name

      @propery
      def sex(self):
          return self._sex


  class Wallet(object):
      def __init__(self, value):
          self._value = value

      def get_total_money(self):
          return self._value

      def add_money(self, new_value):
          self._value += new_value

      def del_money(self, new_value):
          self._value -= new_value


  class Employee(object):
      def __init___(self):
          pass

      def pay(self, custom_obj, payment):
          """
          :desc 支付商品价钱
          :param custom_obj 客人信息
          :param payment 需要支付的金额
          """
          if custom_obj.get_total_money() > payment:
              # 这里是不合理的，不应该把cusotm_obj对象传过来
              # 在Employee类对custom对象的属性做判断

              # 这里就好比，你去商店买件东西，然后收银员把你的钱包
              # 拿了过去，检查是否资金充足，如果充足就扣去应付款项
              return custom_obj.del_money(payment)
          else:
              raise Exception("custom money not enough")

  if __name__ == "__main__":
      custom_01 = Customer()
      employee = Employee()
      staff_price = 10
      employee.pay(custom_01, staff_price)
  ```

- 改造后

  ```py
  class Customer(object):
      """
      拥有名字、性别、存款三个属性
      """
      def __init__(self, name, sex, deposit):
          self._name = name
          self._sex = sex
          self.wallet = Wallet()

      @propery
      def name(self):
          return self._name

      @propery
      def sex(self):
          return self._sex

    def pay(self, payment):
          if self.wallet.get_total_money() > payment:
              # 这里是不合理的，不应该把cusotm_obj对象传过来
              # 在Employee类对custom对象的属性做判断

              # 这里就好比，你去商店买件东西，然后收银员把你的钱包
              # 拿了过去，检查是否资金充足，如果充足就扣去应付款项
              return custom_obj.del_money(payment)
          else:
              raise Exception("I have no enough money")

  class Wallet(object):
      def __init__(self, value):
          self._value = value

      def get_total_money(self):
          return self._value

      def add_money(self, new_value):
          self._value += new_value

      def del_money(self, new_value):
          self._value -= new_value


  class Employee(object):
      def __init___(self):
          pass

      # 把支付的动作放回去，应该有客户来完成，而不是参杂在收银员类这里


  if __name__ == "__main__":
      custom_01 = Customer()
      # employee = Employee()
      staff_price = 10
      # employee.pay(custom_01, staff_price)
      custom_01.pay(staff_price)
  ```

# 设计模式 `Design Pattern`

## 创造型模式 `Creational Patterns`

> 主要用来创建对象的

- [`c/c++`——工厂模式](https://blog.csdn.net/lucky52529/article/details/101035525)

### 简单工厂模式 `Simple Factory Pattern`

> 在工厂模式中，我们并不会暴露给用户任何创建对象的信息，而是通过一个共同的接口来创建对象，主要是解决了接口选择问题，如果你需要一辆汽车，可以直接从工厂里取货，而不需要管这个汽车是怎么做出来的，以及具体的实现方法。

- 伪代码

  ```py
  # 简单工厂模式：云端易部署与各产品线的解耦
  # product_mig.py

  class ProductMig(object):
      def __init__(self):
          pass

      def get_gw_id(self):
          pass

      def get_ip_address(self):
          pass

  # product_ssl.py
  class ProductSSL(object):
      def __init__(self):
          pass

      def get_gw_id(self):
          pass

      def get_ip_address(self):
          pass

  # factory.py
  from product_ssl import ProductSSL
  from product_mig import ProductMig

  class Factory(object):
      ''' 简单工厂模式
      提供一个入口，通过传入参数来决定生产出什么样的产品
      '''

      def __init__(self):
          pass

      def create_product(self, product_type):
          if product_type == "mig":
              return ProductMig
          elif product_type == "ssl":
              return ProductSSLj

  # main.py
  if __name__ == "__main__":
      factory = Factory()
      product_mig = factory.create_product("mig")
      product_ssl = factory.create_product("ssl")

      product_mig.get_gw_id()
      product_ssl.get_gw_id()
  ```

- 如果每次业务改动都要增加新的 `if - else` 就涉及到旧代码的改动，不但容易出错，可读性也不好

- 违背了设计原则中的 `开闭原则` 每次扩展都会涉及到原来的代码

### 工厂方法模式 `Factory Method Pattern`

> 每一个子类都对应一个工厂子类，利用多态特性动态创建对象的模式，就是工厂方法模式(FactoryMethodPattern)

- 简单工厂模式由于违背了开闭原则，所以意味着我们不可能使用一个相同的工厂来创建不同的类。所以`工厂方法模式将工厂抽象了出来，而具体什么工厂创建什么对象由他的子类去完成`，代码如下。

- 感觉就像 `Python` 处理配置时一样，一个 `Config` 父类，`DbConfig` 子类、`PkgConfig` 子类，共同部分放在 `Config` 类中;所以工厂方法模式将工厂抽象了出来，而具体什么工厂创建什么对象由他的子类去完成

- 伪代码

  ```py
  class Product(object):
      def __init__(self):
          pass

      def get_gw_id(self):
          pass


  class ProductMig(Product):
      def __init__(self):
          super(ProductMig, self).__init__()

      def get_gw_id(self):
          pass


  class ProductSSL(Product):
      def __init__(self):
          super(ProductSSL, self).__init__()

      def get_gw_id(self):
          pass


  class Factory(object):
      def __init__(self):
          pass

      def create_product(self):
          ''' 不在这里实现，上面简单工厂模式就是全部堆砌在这里
          '''
          pass


  class FactoryMig(Factory):
      ''' 解耦，各个产品线单独构建一个创造器
      '''
      def __init__(self):
          super(FactoryMig).__init__()

      def create_product(self):
          return ProductMig()


  if __name__ == "__main__":
      factory = FactoryMig()
      product_mig = factory.create_product()
      product_mig.get_gw_id()
  ```

### 抽象工厂模式 `Abstract Factory Pattern`

> 上面的两种模式只适合产品种类单一的商品。 就是说我们如果生产烟，只能生产好猫牌的香烟。可是我的工厂可能还能生产好狗牌的香烟，那么我们如何让一个工厂同时既能生产好猫牌香烟，又能生产好狗牌香烟呢？
> 此时我们就要使用`抽象工厂模式，在抽象出作为基类的工厂类中提供不同类的创建纯虚函数，然后在工厂子类中重写这些虚函数`。

- 伪代码

  ```py

  from abc import abstractmethod

  class Product(object):
      def __init__(self):
          pass

      @abstractmethod
      def get_gw_id(self):
          pass


  class ProductMig(Product):
      def __init__(self):
          pass

      def get_gw_id(self):
          pass

  class ProductSSL(Product):
      def __init__(self):
          pass

      def get_gw_id(self):
          pass

  class Factory(object):
      def __init__(self):
          pass

      @abstractmethod
      def get_gw_id(self):
          pass


  class MigFactory(Factory):
      def __init__(self):
          pass

      def create_product(self):
          return ProductMig()

   class SSLFactory(Factory):
      def __init__(self):
          pass

      def create_product(self):
          return ProductSSL()

  if __name__ == "__main__":
      factory_mig = MigFactory()
      product_mig = factory_mig.create_product()
      product_mig.get_gw_id()

      factory_ssl = SSLFactory()
      product_ssl = factory_ssl.create_product()
      product_ssl.get_gw_id()

  ```

### 单例模式 `Singleton Pattern`

```py
class Singleton(object):
  __instance = None # 设置一个私有变量，默认没有被实例化

  def __new__(cls, age,name):
    # 如果已经实例化，返回实例化对象，否则实例化
    if not cls.__instance:
      cls.__instance = object.__new__(cls)
    return cls.__instance

if __name__ == "__main__":
    a = Singleton(18, "test1")
    b = Singleton(19, "test2")
    print(id(a))
    print(id(b))
```

### 建造者模式 `Builder Pattern`

### 原型模式 `Prototype Pattern`

### 创造型模式总结

## 结构型模式

> 用来优化代码结构的，处理类或者对象之间的组合

### 适配器模式 `Adapter Pattern`

> - 就像名字说得一样，用来做接口之间的适配的中间件
> - 在我们的应用程序中我们可能需要将两个不同接口的类来进行通信，在不修改这两个的前提下我们可能会需要某个中间件来完成这个衔接的过程。这个中间件就是适配器。
> - **所谓适配器模式就是将一个类的接口，转换成客户期望的另一个接口**。它可以让原本两个不兼容的接口能够无缝完成对接。作为 `中间件` 的适配器将目标类和适配者解耦，增加了类的透明性和可复用性。

### 桥接模式 `Bridge Pattern`

> - 桥接和适配器怎么感觉挺像的啊
> - 桥接模式通常会于**开发前期进行设计**， 使你能够将程序的各个部分独立开来以便开发。 另一方面， **适配器模式通常在已有程序中使用**， 让相互不兼容的类能很好地合作。
> - 处理跨平台应用、 支持多种类型的数据库服务器或与多个特定种类 （例如云平台和社交网络等） 的 API 供应商协作时会特别有用

- 现有图形类、颜色类，我现在需要得到一个黑色的正方形和一个红色的圆形，简单做就是实现 `黑色正方形` 和 `红色圆形` 这两个类，简单好理解，但是如果后续扩展就不比较麻烦，比如现在有 `n` 中颜色、`m` 种类形状，那么就要实现 `n * m` 个类

- 桥接模式解决这个问题的方法就是，颜色类和图形类不耦合在一起，各自实现各自的代码，然后增加一个 `桥` 来做连接，就是 `将抽象和实现解耦，使得两者可以独立变化`；其实就相当于，左边有 n 个点、右边有 m 个点，然后把左边的点和右边的点进行连线，这个线就是我们所说的桥了

```py

from abc import ABC, abstractmethod

class Abstraction:
  """ 扮演了桥的角色
  """
  def __init__(self, implementation: BaseImplementation) -> None:
    self.implementation = implementation

  def operation(self) -> str:
    # 定义好接口
    self.implementation.operation_implementation()


class ExtendAbstraction(Abstraction):
  def operation(self) -> str:
    pass


class BaseImplementation(ABC):
  """ 和桥对接口，只有这个抽象类的子类才能和桥进行对接
  """
  @abstractmethod
  def operation_implementation(self) -> str:
    pass


class AppleImplementation(BaseImplementation):
  """ 扮演桥的左端
  """
  def operation_implementation(self) -> str:
    pass


class BoyImplementation(BaseImplementation):
  def operation_implementation(self) -> str:
    pass


def client_code(abstraction: Abstrtaction) -> None:
  """ 扮演桥的右端
  """
  # 可以通过 "桥" 直接调用桥对端的接口
  print(abstraction.operation(), end="")

if __name__ == "__main__":
  apple_implementation = AppleImplementation()
  apple_abstraction = Abstraction(apple_implementation)
  client_code(apple_abstraction)

  # 换一个接口（把桥对接到其他的 BaseImplementation 的子类上）

  boy_implementation = BoyImplementation()
  boy_abstraction = Abstraction(boy_implementation)
  client_code(boy_abstraction)
```

### 过滤器模式 `Filter Pattern`

### 组合模式 `Composite Pattern`

### 装饰器模式 `Decorator Pattern`

> 和 `python` 的装饰器一个思想

- 它是作为现有的类的一个包装。这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能。

### 外观模式 `Facade Pattern`

### 享元模式 `Flywright Pattern`

### 代理模式 `Proxy Pattern`

### 结构型模式总结

## 行为型模式 `Behavioral Patterns`

> 用来描述对类或对象怎样交互和怎样分配职责的

### 责任链模式 `Chain Of Responsibility Pattern`

> 这种模型结构有点类似现实生活中铁链，由一个个铁环首尾相接构成一条链，如果这种结构用在编程领域，则每个节点可以看做一个对象，每个对象有不同的处理逻辑，**将一个请求从链的首端发出，沿着链的路径依次传递每个节点对象，直到有对象处理这个请求为止**，我们将这样一种模式称为责任链模式。

- 模式要点
  - `对象中含有另一个对象的应用`，因此来把多个处理对象形成链条
  - 每个对象都有明确的责任划分，即分别处理不同的请求
  - 链条最后一节应该设计成通用的处理请求，避免出现漏洞
  - 请求应该传入链条头

```py
from abc import ABC, abstractmethod
from typing import Any, Optional
from __future__ import annotations


class Checker(ABC):
  """
  抽象类
  """

  @abstractmethod
  def set_next_checker(self, checker: Checker) -> Checker:
    """ 子类必须实现本抽象方法，用来指向处理链的下一个节点
    """
    pass

  @abstractmethod
  def check(self, request) -> Optional[str]:
    """ 实际的处理方法
    """
    pass

  class AbstractChecker(Checker):
    # 默认/通用的处理类
    _next_checker: Checker = None
    def set_next_checker(self, checker: Checker) -> Checker:
      """ 设置下一处理节点
      """
      self._next_checker = checker
      return checker

    @abstractmethod
    def handle(self, request: Any) -> str:
      if self._next_checker:
        return self._next_checker.handle(request)
      return None

  class AppleChecker(AbstractChecker):
    """ A 检查器
    """
    def check(self, request: Any) -> str:
      print("checking a")

  class BoyChecker(object):
    """ B 检查器
    """
    def check(self, request: Any) -> str:
      print("checking b")

  class CatChecker(object):
    """ C 检查器
    """
    def check(self, request: Any) -> str:
      print("checking c")

  def do_check(request: Any, checker: Checker) -> None:
    """ 执行操作
    """
    checker.check(request)

  if __name__ == "__main__":
      a_checker = AppleChecker()
      b_checker = BoyChecker()
      c_checker = CatChecker()
      # 设置责任链，责任链上任何一个节点都可以进行处理
      # 并返回下一处理节点
      a_checker.set_next_checker(b_checker).set_next_checker(c_checker)
      do_check(a_checker)
      """
      # 输出为
      checking a
      checking b
      checking c
      """

      do_check(b_checker)
      """
      # 输出为
      checking b
      checking c
      """
```

### 命令模式 `Command Pattern`

### 解释器模式 `Interpreter Pattern`

### 迭代器模式 `Iiterator Pattern`

### 中介模式 `Mediator Pattern`

### 备忘录模式 `Memento Pattern`

### 观察者模式 `Observer Pattern`

- 观察者的存在不影响被观察者的处理，即使是把观察者拿掉，也不会影响到被观察者的运行；允许定义各种订阅机制，可以在对象事件发生的时候通知到多个 `观察` 该对象的其他对象

- 观察者就像是监工，被观察者就像是你这个打工人；你在那里干活，干完后要向上面 `n` 个人汇报工作情况；他们也不会主动来问你，但是你做完了还必须得告诉他们。所以我还要记住我完成任务后需要告诉哪些人；比如改完 `BUG_1` 需要告诉 测试、前端、项目经理，那我就把他们拉一个群，等我改完我发个消息到群里就是了。我在群里发的消息有些是测试需要关注的，有些是项目经理需要关注的，我会给这些消息都打上标签，比如 `#测试注意 xxxxx`；然后测试只需要关注这一类信息就行了，但是测试也不能每一秒钟看一次群啊（引入观察者模式前，就只能不断轮询地去访问），最好是我发这些消息的时候，会自动通知到测试同事，比如我发 `#测试注意 xxxxx` 的时候，就自动 `@` （通知一下）测试的同事

**与 `发布订阅模式` 的区别**

- 观察者模式只有两个角色：`观察者` 和 `被观察者`；发布订阅模式中有三种角色：`发布者`、`订阅者` 和 `调度器（消息队列）`

- 观察者和被观察者是松耦合的关系，发布者和订阅者由于调度器的存在，不存在耦合

- 观察者模式通常用在 `单个引用内部`；`发布订阅模式` 则更多用于 `跨应用 IPC` 之间；观察者模式也有发布订阅的思想，但是和发布订阅模式还是有点差别的

```py
from abc import ABC, abstractmethod
from time import sleep
from random import randrange
from typing import List

class BaseObserver(ABC):
  """ 观察者
  事件订阅者
  """

  # 关心的事件
  _watch_mission_id: int = None

  @abstractmethod
  def update(self, subject: BaseSubject) -> None:
    """ 收到事件通知后的处理
    """
    pass

class BaseSubject(ABC):
  """ 被观察者
  事件发布者
  """
  @abstractmethod
  def attach(self, observer: BaseObserver) -> None:
    """ 增加一个观察者
    订阅
    """
    pass

  @abstractmethod
  def detach(self, observer: BaseObserver) -> None:
    """ 取消一个观察者
    取消订阅
    """
    pass

  @abstractmethod
  def notify(self) -> None:
    """ 通知
    """
    pass


class AppleSubject(BaseSubject):

  # 加个变量，用来区分事件类型
  _mission_id: int = None
  # 观察者列表
  _observers: List[BaseObserver] = []

  def attach(self, observer: BaseObserver) -> None:
    self._observers.append(observer)

  def detach(self, observer: BaseObserver) -> None:
    self._observers.remove(observer)

  def notify(self) -> None:
    for observer in self._observers:
      observer.update(self)

  def do_something(self) -> None:
    """ 业务逻辑
    """
    self._mission_id = randrange(0, 10)
    print("mission %s is finished" % self._mission_id)
    self.notify()


class AppleObserver(BaseObserver):

  _watch_mission_id = 5

  def update(self, subject: BaseSubject) -> None:
    if self._watch_mission_id == subject._mission_id:
      print("I'm AppleObserver, I've got my observer mission id: %s" % subject._mission_id)


class BoyObserver(BaseObserver):

  _watch_mission_id = 4

  def update(self, subject: BaseSubject) -> None:
    if self._watch_mission_id == subject._mission_id:
      print("I'm BoyObserver, I've got my observer mission id: %s" % subject._mission_id)


if __name__ == "__main__":
  subject = AppleSubject()
  observer_a = AppleObserver()
  observer_b = BoyObserver()

  # 打工人添加一个需要知会的监工
  subject.attach(observer_a)
  subject.attach(observer_b)

  # 打工人开始打工，打工完成时会调用监工的接口
  for item in range(10):
    subject.do_something()

  # 打工人把一个无关的监工踢出去
  subject.detach(observer_a)
```

### 发布订阅模式 `Publish Subscribe Pattern`

- 还是用订阅报刊的场景来类比吧

  - 如果我要订阅报刊，我可以订阅 A 报纸、B 报纸、C 报纸

  - 那么我为了知道这几个报纸是否已经刊印好了，就需要`时不时去轮询`，看是否已准备好

  - 要么就等报社刊印好报纸后，`发消息通知我`，让我去拿。

  - 但是报社每天刊印那么多种类的报纸，肯定不能啥报刊刊印好了都来通知我吧，报社只要通知我感兴趣的报纸就行了，那么我先`向报社发起订阅`

### 状态模式 `State Pattern`

### 空对象模式 `Null Pattern`

### 策略模式 `Strategy Pattern`

> 打个比方说，我们出门的时候会选择不同的出行方式，比如骑自行车、坐公交、坐火车、坐飞机等等，这些出行方式，每一种都是一个策略。

- 定义了一组算法，将每个算法都封装起来，其实就是抽象类的子类，规定这些子类都必须实现抽象方法，所以这些子类可以互相替代

```py
from abc import ABC, abstractmethod

class BaseContext():
  """
  """
  def __init__(self, strategy: Strategy) -> None:
    self._strategy = strategy

  @property
  def strategy(self) -> Strategy:
    return self._strategy

  @strategy.setter
  def strategy(self, strategy_obj -> Strategy) -> None:
    self._strategy = strategy_obj

  def do_something(self) -> None:
    """ 执行策略
    """
    pass


class BaseStrategy(ABC):
  @abstrategymethod
  def do_strategy(self, data):
    """ 实现实际的策略
    """
    pass


class AppleStrategy(BaseStrategy):
  def do_strategy(self, data):
    print("doing something with strategy a")


class BoyStrategy(BaseStrategy):
  def do_strategy(self, data):
    print("doing something with strategy b")

# 还可以构造这样的映射关系
[
  A_STRATEGY,
  B_STRAGETY
] = range(0, 2)

ID_STRATEGY_MAP = {
  A_STRATEGY: AppleStrategy,
  B_STRAGETY: BoyStrategy
}

def get_strategy_from_config():
  """
  具体用什么策略可以从外部引入
  可以是环境变量，也可以是配置文件
  """
  # 更换策略只需要从配置文件改一下ID就行了
  # strategy_id = 从外部获取
  return ID_STRAGETY_MAP[strategy_id]


if __name__ == "__main__":
  # 使用策略 A
  strategy = _get_strategy_from_config()
  context = Context(strategy)
  context.do_strategy()
```

### 模板模式 `Template Pattern`

> 模板的价值在于骨架的定义，骨架内部将问题的处理路程已经定义好了，通用的处理逻辑一般由父类实现，个性化的处理由子类实现

- 不同场景的处理流程，部分逻辑是通用的，可以放到父类中作为通用实现，部分逻辑需要个性化的，则需要子类去实现（这有点像配置，父类实现通用的配置，子类个性化实现自己的配置）

```py
""" 以为系统升级为例
"""

from abc import ABC, abcstractmethod

class AbsUpgrade(object):
  def upgrade_system(self) -> None:
    self.upgrade_check()
    self.before_upgrade()
    self.prepare_package()
    self.check_package()
    self.do_upgrade()
    self.after_upgrade()

  @abstractmethod
  def upgrade_check():
    """ 升级前检查 """
    pass

  @abstractmethod
  def before_upgrade():
    """ 升级前准备 """
    pass

  @abstractmethod
  def prepare_package():
    """ 获取升级包 """
    pass

  @abstractmethod
  def check_package():
    """ 升级包检查 """
    pass

  @abstractmethod
  def do_package():
    """ 执行升级流程 """
    pass

  @abstractmethod
  def after_package():
    """ 升级后清理流程 """
    pass

class SystemUpgradeMission(AbsUpgrade):
  """ 系统升级 """
  pass # 实现上面的抽象方法

class InsideLibUpgradeMission(AbsUpgrade):
  """ 系统内置库升级 """
  pass # 实现上面的抽象方法
```

### 访问者模式 `Visitor Pattern`

### 行为型模式总结

# 其他

- 感觉很多业务代码都需要设计模式来拯救啊，比如说我有一个接口功能是先进行第一步、然后进行第二步... 这样子经过很多步来完成的操作，有没有方法来优化一下

  ```py
  def _merge_app_info(self, app_infos):
    pass

  def _get_app_info(self, origin_data):
    pass

  def _get_line_info(self, origin_data):
    pass

  def _make_app_line_link(self, app_infos, line_infos):
    pass

  def get_result(self):
    """
    # 像这种要一步步来完成的工作
    提供接口给外部获取结果
    实现过程中需要进行多部操作，比如获取原始数据、进行数据加工的几个步骤
    """
    origin_data = self._get_origin_data()
    app_infos = self._get_app_info(origin_data)
    app_infos =self._merge_app_info(app_infos)
    line_infos = self._get_line_info(origin_data)
    ret = self._make_app_line_link(app_infos, line_infos)
    return ret
  ```

- 比如新建分支检查，我需要检查分支名是否合法、检查分支数是否超出、检查是否已有重复分支等等，现在的做法就是一个大的 `check_add_branch` 入口，然后各种封装成一个个函数（如果某项检查不通过就抛异常，不进行下一步检查了），然后排队一样排在一起

  ```py
  def check_branch_name(branch_info):
    if _is_check_ok:
        return
    raise CheckBranchNameFail()

  def check_branch_cnt(branch_info):
    if _is_check_ok:
        return
    raise CheckBranchCntFail()

  def check_add_branch(self, branch_info):
      check_branch_cnt(branch_info)
      check_branch_name(branch_info)
  ```
