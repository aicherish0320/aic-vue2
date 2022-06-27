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

    // 孩子比较
    const newChildren = vNode.children || []
    const oldChildren = oldVNode.children || []

    if (!newChildren.length && oldChildren.length) {
      el.innerHTML = ''
    } else if (newChildren.length && !oldChildren.length) {
      newChildren.forEach((item) => el.appendChild(createElm(item)))
    } else {
      updateChildren(el, oldChildren, newChildren)
    }
    return el
  }
}

/*
  dom 的生成 ast -> render 方法 -> 虚拟节点 -> 真实 dom
  更新时需要重新创建 ast 语法树嘛
  如果动态添加了节点，（绕过 vue 添加的，vue 监控不到）难道不需要重新生成 ast 嘛
  后续数据变了，只会操作自己管理的 dom 元素
*/

// diff 算法
function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0
  let oldStartVNode = oldChildren[oldStartIndex]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVNode = oldChildren[oldEndIndex]
  let newStartIndex = 0
  let newStartVNode = newChildren[newStartIndex]
  let newEndIndex = newChildren.length - 1
  let newEndVNode = newChildren[newEndIndex]

  const makeIndexByKey = (children) => {
    return children.reduce((memo, current, index) => {
      if (memo[current.key]) {
        memo[current.key] = index
      }
      return memo
    }, {})
  }
  const keysMap = makeIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // null 处理
    if (!oldStartVNode) {
      oldStartVNode = oldChildren[++oldStartIndex]
    } else if (!oldEndVNode) {
      oldEndVNode = oldChildren[--oldEndIndex]
    }

    if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)

      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)

      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)

      el.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)

      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)

      el.insertBefore(oldEndVNode.el, oldStartVNode.el)

      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else {
      let moveIndex = keysMap[newStartVNode.key]
      if (!moveIndex) {
        el.insertBefore(createElm(newStartVNode), oldStartVNode.el)
      } else {
        const moveNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null

        el.insertBefore(moveNode.el, oldStartVNode.el)

        patch(moveNode, newStartVNode)
      }

      newStartVNode = newChildren[++newStartIndex]
    }
  }

  // 老的结束了 老的少 新的多
  if (newStartIndex <= newEndIndex) {
    // 有一种情况 从尾部开始比较 不能直接追加
    const anchor = newChildren[newEndIndex + 1]
      ? newChildren[newEndIndex + 1].el
      : null
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // anchor 值如果是 null 的话相当于 appendChild
      el.insertBefore(createElm(newChildren[i]), anchor)
    }
  }

  // 新的结束了 老的多 新的少
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i].el) {
        el.removeChild(oldChildren[i].el)
      }
    }
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
