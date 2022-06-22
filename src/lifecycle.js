import Watcher from './observe/watcher'
import { patch } from './vnode/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    // vm._render() 将 render 函数生成虚拟DOM
    // vm._update() 将虚拟 DOM 转换为真实 DOM
    vm._update(vm._render())
  }
  callHook(vm, 'beforeCreate')
  // true: 表示此 watcher 为渲染 watcher
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('更新的逻辑')
      // callHook(vm, 'beforeUpdate')
    },
    true
  )
  // callHook(vm, 'mounted')
}

export function lifeMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 先序深度遍历
    const vm = this
    vm.$el = patch(vm.$el, vNode)
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach((handler) => handler.call(vm))
  }
}
