import { observe } from './observe/index.js'
import { isFunction } from './utils.js'

export function initState(vm) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  // 获取 data，data 有可能为函数
  let data = vm.$options.data
  data = vm._data = isFunction(data) ? data.call(vm) : data

  Object.keys(data).forEach((key) => {
    proxy(vm, '_data', key)
  })

  // 将 data 转换成响应式的
  // 观测数据
  observe(data)
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(val) {
      vm[source][key] = val
    }
  })
}
