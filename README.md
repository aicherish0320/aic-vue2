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

### new Vue

- new Vue() 会先调用 `_init` 方法进行初始化
- initState 处理 data，data 为函数、对象的情况
- initData 将 data 进行响应式处理
