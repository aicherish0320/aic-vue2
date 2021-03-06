# Vue Lesson

## Vue2 源码解析

### Rollup 搭建开发环境

Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂代码，rollup.js 更专注与 JavaScript 类库打包（开始应用时使用 Webpack，开发库时使用 Rollup）

### Vue 的初始化流程

- Vue 默认支持响应式数据变化
- 双向绑定
  - 双向绑定页面得需要修改（表单 Radio、CheckBox），数据变化可以影响视图显示
  - 响应式数据变化 能监控到数据变化 并且更新视图
- Vue 的模式，并不是 MVVM，Vue 默认只是做视图的，
  - 渐进式：组件化 + Vue-Router + Vuex + Vue-Cli
- Vue 的响应式数据变化
  - 我们要知道数据的变化是如何变化的
  - `Object.defineProperty`将对象中的原有属性，更改成带有 `get` 和 `set` 的一个属性，这样当修改的时候，会触发 set 方法 -> 更新视图

### Vue 的实现

- Vue 是基于原型的模式去实现的，所有的功能都通过原型扩展的方式来添加

- `Object.defineProperty` 方法会在一个对象上定义一个新的属性，或者修改现有的属性

- 数组可以使用 `Object.defineProperty` 进行响应式处理，并且，数组使用`Object.defineProperty`实现响应式，还是可以使用修改索引去更新视图的，但是这种操作概率低，正常用户操作数组，是使用变异方法 (push pop unshift shift splice sort reverse)。

- Vue3 中为了兼容 proxy，内部对数组就是使用 `defineProperty`

### new Vue

- new Vue() 会先调用 `_init` 方法进行初始化
- initState 处理 data，data 为函数、对象的情况
- initData 将 data 进行响应式处理
- proxy，将 data 中的数据代理到 vm 实例上
- 数组和对象的响应式处理
  - 数组：拦截数组的方法
  - 对象：`Object.defineProperty`
  - 数组和对象都需要递归处理
- 通过 `__ob__`进行标识这个对象被监控过（在 Vue 中被监控的对象身上都有一个 `__ob__` 这个属性）

## 原型和原型链

- 每个对象都有一个 `__proto__`属性，它指向所属类的原型 `fn.__proto__ === Function.prototype`
- 每个原型上都有一个 `constructor` 属性，指向函数本身 `Function.prototype.constructor === Function`

## 依赖收集过程实现

> 观察者模式，数据一变，视图自动更新。发布订阅模式是被动的，需要手动触发更新、手动监听

> 一个属性对应一个 dep，一个 dep 对应多个 watcher（因为一个属性可以在多个视图中被使用），一个 watcher 可以对应多个 dep（因为一个视图中可以有多个属性，就有多个 dep）

- Dep：dep 是可以有多个指令订阅的可观察对象(A dep is an observable that can have multiple directives subscribing to it)
- Watcher： watcher 可以解析表达式，收集依赖，并且当表达式的值改变时触发回调函数 (A watcher parses an expression, collects dependencies,and fires callback when the expression value changes,This is used for both the $watch() api and directives)

## 数据响应式原理分析（从三个对象的角度去讨论）

- Observer：Observer 类 是依附在每一个可被观测到对，一旦被吸附了，observer 就将目标对象的 key 转换成 getter/setter，目的是为了依赖收集和触发更新
- Dep：dep 能被多个指令订阅
- Watcher：watcher 能够转换表达式，收集依赖，并且在表达式发生改变时去触发回调函数。

> Vue 中使用 **Object.defineProperty** 结合**观察者模式**进行响应式处理，数据变化会自动更新视图。在初始化渲染的时候，会有一个 渲染 Watcher，执行在编译阶段生成的 render 函数，在执行 render 函数时，会去获取数据，会触发 data 的 get 方法，在 initStat 的时候，会递归遍历每一个对象的 key，并且每一个 key 都对应一个 dep，存储在当前 key 的闭包中，dep 中的作用就是收集当前 key 所依赖的视图，也就是 watcher
> 在 Vue 中是组件级更新，一个组件对应一个 watcher。当数据发生变化时，调用 dep 中收集的 watcher 进行更新视图
> 每个属性都对应一个 dep，收集当前 key 所依赖的视图（watcher）；一个 watcher 也对应多个 dep，一个视图中存在多个属性

## Diff 算法

key 尽量不要用索引，会导致 diff 更新的时候，重新创建子元素，而不是移动元素，创建元素的性能要高于移动元素

## 组件的初始化流程

1. Vue.component 注册成全局组件，内部会自动调用 Vue.extend 方法，返回组件的构造函数
2. 组件初始化的时候，会做一个合并 mergeOptions （自己的组件.**proto** = 全局组件）
3. 内部会对模版进行编译操作 \_c('组件的名字')，做筛查如果是组件就创造一个组件的虚拟节点，还会判断 Ctor 如果是对象会调用 Vue.extend，所有的组件都是通过 Vue.extend 方法来实现的（componentOptions 里面放着组件的所有内容，属性的实现，事件的实现，插槽的内容，Ctor）
4. 创建组件的真实节点（new Ctor 拿到组件的实例，并且调用组件的 $mount 方法，会生成一个 $el 对应组件模版渲染后的结果）vNode.componentInstance.$el，插入到父标签中
5. 组件在 new Ctor 时，会进行组件的初始化，给组件再次添加一个独立的渲染 Watcher（每个组件都有自己的 Watcher），更新时，只需要更新自己组件对应的渲染 watcher，（因为组件渲染时，组件对应的属性会收集自己渲染的 watcher）

> 组件的查找规则，类似于作用域链，不会覆盖，先找自己的，自己的找不到就往上找

- 组件的渲染原理
- 组件的更新流程
- 函数式组件
- 异步组件
- 组件 通信方式
- keep-alive 的原理

## 组件通信

> 组件的渲染是先父后子

```Vue
  <App @fn="handler"></App>
  <!--
    将解析这个模板，将 fn 放在 listeners 上，最终循环 listeners 给当前的组件增加 listeners
    handler 是属于父组件的

    app.$on('fn') app.$emit('fn')
   -->
```

```vue
<my-button></my-button>
->
<button>点我</button>
```

`vm._vNode：<button></button>` 的虚拟节点
`vm.$vNode：<my-button></my-button> `虚拟节点

### 数据响应式原理、组件渲染原理、diff 算法、组件渲染机制整体流程
