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
