import { isArray, isObject } from '../utils.js'
import { arrayMethods } from './array.js'
import Dep from './dep.js'

/**
 * Observer 类是依附在每个被观察对象
 * Observer 将对象 key 转换为 getter/setters 形式
 * 收集依赖 派发更新
 */
class Observer {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false,
      value: this
    })

    if (isArray(value)) {
      value.__proto__ = arrayMethods
      // 数组递归处理
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(value) {
    Object.keys(value).forEach((key) => {
      defineReactive(value, key, value[key])
    })
  }
  observeArray(data) {
    data.forEach((item) => observe(item))
  }
}
/*
  Vue2 应用了 defineProperty 需要一加载的时候，就进行递归操作。
  性能优化的原则：
  1. 不要把所有的数据都放在 data 中，因为所有的数据都会增加 get set
  2. 不要写数据的时候，层次过深，尽量扁平化数据
  3. 不要频繁的获取数据
  4. 如果数据不需要响应式，可以使用 Object.freeze 冻结属性
*/
function defineReactive(obj, key, value) {
  observe(value)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get() {
      Dep.target && dep.depend()
      return value
    },
    set(newVal) {
      if (newVal === value) return
      observe(newVal)
      value = newVal

      dep.notify()
    }
  })
}

export function observe(data) {
  if (!isObject(data)) return
  // 已经被观测过了
  if (data.__ob__) return

  // 对每一个对象进行观察
  return new Observer(data)
}
