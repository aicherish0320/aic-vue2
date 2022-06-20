import { compileToFunction } from './compiler/index'
import { initState } from './state'

export function initMixin(Vue) {
  // 后续组件化开发的时候，Vue.extend 可以创建一个子组件，子组件可以继承 Vue
  // 子组件也可以调用 _init 方法进行组件的初始化
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    initState(vm)

    // 程序运行到这里 数据已经被劫持了
    // 数据变化需要更新视图 diff 算法更新需要更新的部分
    // 在 vue 中视图使用 template
    // vue3 中 template 写起来性能会更高一些 内部做了很多优化
    // template -> ast 语法树（用来描述语法的）-> 描述成一个树结构 -> 将代码重组成 js 语法
    // 模板编译原理（把 template 模板编译成 render 函数）-> 虚拟 DOM -> diff 算法比对虚拟 DOM
    // ast -> render -> VNode -> 真实 DOM
    // 更新的时候 再次调用 render -> 新的 VNode -> 新旧比对 -> 更新真实 DOM
    if (vm.$options.el) {
      // 挂载
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el)
    vm.$el = el

    if (!opts.render) {
      let template = opts.template
      if (!template) {
        template = el.outerHTML
      }
      const render = compileToFunction(template)
      opts.render = render
    }
  }
}
