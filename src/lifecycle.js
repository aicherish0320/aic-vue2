import { patch } from './vnode/patch'

export function mountComponent(vm) {
  vm._update(vm._render())
}

export function lifeMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 先序深度遍历
    const vm = this
    patch(vm.$el, vNode)
  }
}
