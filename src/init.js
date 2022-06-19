import { initState } from './state'

export function initMixin(Vue) {
  // 后续组件化开发的时候，Vue.extend 可以创建一个子组件，子组件可以继承 Vue
  // 子组件也可以调用 _init 方法进行组件的初始化
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    initState(vm)

    if (vm.$options.el) {
      // 挂载
      console.log('元素挂载')
    }
  }
}
