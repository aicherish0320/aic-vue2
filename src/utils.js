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
