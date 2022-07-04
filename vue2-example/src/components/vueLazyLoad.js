export const VueLazyLoad = {
  install(Vue) {
    Vue.directive('lazy', {
      bind() {},
      unbind() {}
    })
  }
}

/*
  我们需要有一个假的图片，换成新的 onload 事件 换成新的
  监控找到能滚动的元素 多次指令生成只监控一次 节流
  我们要监控滚动的位置 当前图片是否出现在可视区域内 如果出现加载图片
*/
