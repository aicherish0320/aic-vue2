import { isObject, isReserverTag } from '../utils'

function VNode(vm, tag, data, children, key, text, options) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
    componentOptions: options
  }
}

function createComponent(vm, tag, data, children, key, Ctor) {
  if (isObject(Ctor)) {
    const Vue = vm.$options._base
    Ctor = Vue.extend(Ctor)
  }

  data.hook = {
    //组件的生命周期
    init(vNode) {
      const child = (vNode.componentInstance = new Ctor({}))

      child.$mount()
      // mount 挂在完毕后，会产生一个真实节点，在这个节点上 vm.$el -> 对应的是组件的真实内容
    },
    prepatch() {}
  }

  const componentVNode = VNode(vm, tag, data, undefined, key, undefined, {
    Ctor,
    children,
    tag
  })

  return componentVNode
}

export function createElement(vm, tag, data = {}, ...children) {
  // tag 可能是元素或者组件
  if (isReserverTag(tag)) {
    return VNode(vm, tag, data, children, data.key, undefined)
  } else {
    const Ctor = vm.$options.components[tag]
    // 组件
    return createComponent(vm, tag, data, children, data.key, Ctor)
  }
}
export function createText(vm, text) {
  return VNode(vm, undefined, undefined, undefined, undefined, text)
}
// vue2 性能问题 -> 递归比对
export function isSameVNode(newVNode, oldVNode) {
  return newVNode.tag === oldVNode.tag && newVNode.key === oldVNode.key
}
