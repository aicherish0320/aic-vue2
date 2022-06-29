import { isObject, mergeOptions } from '../utils'

export function initGlobalAPI(Vue) {
  // 全局属性 在每个组件初始化的时候 将这些属性放在每个组件上
  Vue.options = {}
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }

  Vue.options._base = Vue

  Vue.options.components = {}

  Vue.extend = function (opt) {
    const Super = this
    const Sub = function (options) {
      this._init(options)
    }
    // function create(parentPrototype) {
    //   const Fn = function () {}
    //   Fn.prototype = parentPrototype
    //   return new Fn()
    // }
    // Object.create 方法创建一个新对象，使用现有的对象来作为新创建对象的原型
    // Sub.prototype.__proto__ = Super.prototype
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(Super.options, opt)

    // Sub.mixin = Super.mixin

    return Sub
  }

  Vue.component = function (id, definition) {
    let name = definition.name || id
    definition.name = name

    if (isObject(definition)) {
      definition = Vue.extend(definition)
    }

    Vue.options.components[name] = definition
  }

  Vue.filter = function () {}
  Vue.directive = function () {}
}
