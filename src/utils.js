export function isFunction(value) {
  return typeof value === 'function'
}

export function isObject(value) {
  return typeof value === 'object' && value !== null
}

export function isArray(value) {
  return Array.isArray(value)
}

let callbacks = []
let waiting = false
function flushCallbacks() {
  callbacks.forEach((c) => c())
  waiting = false
  callbacks = []
}
export function nextTick(fn) {
  callbacks.push(fn)
  if (!waiting) {
    Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}

const strategy = {}
const lifecycle = ['beforeCreate', 'created', 'beforeMount', 'mounted']
// 生命周期合并策略
lifecycle.forEach((hook) => {
  strategy[hook] = function (parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal)
      } else {
        if (isArray(childVal)) {
          return childVal
        } else {
          return [].concat(childVal)
        }
      }
    } else {
      return parentVal
    }
  }
})
// 组件合并策略
strategy.components = function (parentVal, childVal) {
  const ret = Object.create(parentVal)

  for (const key in childVal) {
    ret[key] = childVal[key]
  }

  return ret
}

export function mergeOptions(parent, child) {
  const options = {}

  for (const key in parent) {
    mergeField(key)
  }

  for (const key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strategy[key]) {
      options[key] = strategy[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]
    }
  }

  return options
}

export const isReserverTag = (tag) => {
  return [
    'html',
    'body',
    'div',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'a',
    'button',
    'section',
    'b',
    'i',
    'span',
    'ul',
    'li',
    'style',
    'canvas',
    'img',
    'input'
  ].includes(tag)
}
