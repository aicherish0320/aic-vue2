import { patch } from './vnode/patch'

export function mountComponent(vm) {
  const updateComponent = () => {
    // vm._render() 将 render 函数生成虚拟DOM
    // vm._update() 将虚拟 DOM 转换为真实 DOM
    vm._update(vm._render())
  }
  updateComponent()
}

export function lifeMixin(Vue) {
  Vue.prototype._update = function (vNode) {
    // 先序深度遍历
    const vm = this
    vm.$el = patch(vm.$el, vNode)
  }
}
