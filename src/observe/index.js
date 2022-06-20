import { isObject } from '../utils.js'

/**
 * Observer 类是依附在每个被观察对象
 * Observer 将对象 key 转换为 getter/setters 形式
 * 收集依赖 派发更新
 */
class Observer {
  constructor(value) {
    this.walk(value)
  }
  walk(value) {
    Object.keys(value).forEach((key) => {
      defineReactive(value, key, value[key])
    })
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

  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(newVal) {
      if (newVal === value) return
      value = newVal
    }
  })
}

export function observe(data) {
  if (!isObject(data)) return

  // 对每一个对象进行观察
  return new Observer(data)
}
