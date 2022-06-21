export function patch(el, vNode) {
  const elm = createElm(vNode)
  const parentNode = el.parentNode
  parentNode.insertBefore(elm, el.nextSibling)
  parentNode.removeChild(el)
  return elm
}

function createElm(vNode) {
  const { tag, data, children, text, vm } = vNode
  if (text) {
    vNode.el = document.createTextNode(text)
  } else {
    // 虚拟节点和真实节点做一个映射关系
    // 后续某个虚拟节点更新了，可以跟踪到真实节点，并且更新真实节点
    vNode.el = document.createElement(tag)

    // 处理属性
    updateProperties(vNode.el, data)

    children.forEach((child) => vNode.el.appendChild(createElm(child)))
  }
  return vNode.el
}

function updateProperties(el, props = {}) {
  for (const prop in props) {
    el.setAttribute(prop, props[prop])
  }
}
