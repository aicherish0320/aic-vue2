const oldArrayPrototype = Array.prototype

const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']

// arrayMethods.__proto__ === oldArrayPrototype  // true
// 让 arrayMethods 通过 __proto__ 能获取到数组的方法
export const arrayMethods = Object.create(oldArrayPrototype)

// 属性的查找方式 先查找自己的 再去原型上去查找
methods.forEach((m) => {
  arrayMethods[m] = function () {
    console.log(`${m} 方法被触发了`)
  }
})
