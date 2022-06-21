import { isObject } from './utils'
import { createElement, createText } from './vnode/index'

export function renderMixin(Vue) {
  // 创建元素的节点
  Vue.prototype._c = function () {
    const vm = this
    return createElement(vm, ...arguments)
  }
  // 创建文本的虚拟节点
  Vue.prototype._v = function (text) {
    const vm = this
    return createText(vm, text)
  }
  // JSON.stringify()
  Vue.prototype._s = function (value) {
    if (isObject(value)) {
      return JSON.stringify(value)
    }
    return value
  }

  Vue.prototype._render = function () {
    const vm = this
    const { render } = vm.$options
    const vNode = render.call(vm)
    return vNode
  }
}
