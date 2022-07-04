export const VueLazyLoad = {
  install(Vue, userOptions) {
    const lazyClass = lazy(Vue)
    const instance = new LazyClass(userOptions)
    Vue.directive('lazy', {
      bind: instance.add.bind(instance),
      unbind: instance.unbind.bind(instance)
    })
  }
}

function lazy(Vue) {
  return class LazyClass {
    constructor(userOptions) {
      this.userOptions = userOptions
    }
    // es6 中类的原型方法如果单独拿出来使用，this 会指向 undefined
    add(el, dirs, vNode) {
      // 获取滚动元素
    }
    unbind() {}
  }
}

/*
  我们需要有一个假的图片，换成新的 onload 事件 换成新的
  监控找到能滚动的元素 多次指令生成只监控一次 节流
  我们要监控滚动的位置 当前图片是否出现在可视区域内 如果出现加载图片
*/
