import { isSameVNode } from './index'

export function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const elm = createElm(vNode)
    const parentNode = oldVNode.parentNode
    parentNode.insertBefore(elm, oldVNode.nextSibling)
    parentNode.removeChild(oldVNode)
    return elm
  } else {
    if (!isSameVNode(vNode, oldVNode)) {
      return oldVNode.el.parentNode.replaceChild(createElm(vNode), oldVNode.el)
    }
    // 复用节点
    const el = (vNode.el = oldVNode.el)
    // 文本
    if (!oldVNode.tag) {
      if (vNode.text !== oldVNode.text) {
        return (el.textContent = vNode.text)
      }
    }
    // 元素
    updateProperties(vNode, oldVNode.data)
  }
}

export function createElm(vNode) {
  const { tag, data, children, text, vm } = vNode
  if (text) {
    vNode.el = document.createTextNode(text)
  } else {
    // 虚拟节点和真实节点做一个映射关系
    // 后续某个虚拟节点更新了，可以跟踪到真实节点，并且更新真实节点
    vNode.el = document.createElement(tag)

    // 处理属性
    updateProperties(vNode, data)

    children.forEach((child) => vNode.el.appendChild(createElm(child)))
  }
  return vNode.el
}

function updateProperties(vNode, oldProps = {}) {
  const el = vNode.el
  const newProps = vNode.data || {}

  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}

  for (const key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  for (const key in newProps) {
    if (key === 'style') {
      for (const key in newStyle) {
        el.style[key] = newStyle[key]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }

  for (const key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }
}
