export const VueLazyLoad = {
  install(Vue, userOptions) {
    const LazyClass = lazy(Vue)
    const instance = new LazyClass(userOptions)
    Vue.directive('lazy', {
      bind: instance.add.bind(instance),
      unbind: instance.unbind.bind(instance)
    })
  }
}

function getScrollParent(el) {
  let parent = el.parentNode
  while (parent) {
    if (/(scroll)|(auto)/.test(getComputedStyle(parent)['overflow'])) {
      return parent
    }
    parent = parent.parentNode
  }
  return null
}

function lazy(Vue) {
  function render(imgListener, state) {
    const el = imgListener.el
    switch (state) {
      case 'loading':
        el.src = imgListener.options.loading
        break
      case 'loaded':
        el.src = imgListener.src
        break
      case 'error':
        el.src = imgListener.options.error
        break
      default:
        break
    }
  }

  function loadImg(src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.src = src
      img.onload = resolve
      img.onerror = reject
    })
  }

  class ReactiveListener {
    constructor(el, src, options) {
      this.el = el
      this.src = src
      this.options = options
      this.state = { loading: false }
    }
    checkInView() {
      const { top } = this.el.getBoundingClientRect()
      return top < window.innerHeight * this.options.preLoad
    }
    load() {
      render(this, 'loading')

      loadImg(this.src)
        .then(() => {
          this.state.loading = true
          render(this, 'loaded')
        })
        .catch(() => {
          this.state.loading = true
          render(this, 'error')
        })
    }
  }

  return class LazyClass {
    constructor(userOptions) {
      this.options = userOptions
      this.hasScrollHandler = false
      this.queue = []
    }
    lazyLoadHandler() {
      this.queue.forEach((imgListener) => {
        if (imgListener.state.loading) return
        imgListener.checkInView() && imgListener.load()
      })
    }
    // es6 中类的原型方法如果单独拿出来使用，this 会指向 undefined
    add(el, dirs, vNode) {
      // 获取滚动元素
      Vue.nextTick(() => {
        const imgListener = new ReactiveListener(el, dirs.value, this.options)
        this.queue.push(imgListener)

        if (!this.hasScrollHandler) {
          const ele = getScrollParent(el)
          ele.addEventListener('scroll', this.lazyLoadHandler.bind(this), {
            passive: true
          })
          this.hasScrollHandler = true
        }
        this.lazyLoadHandler()
      })
    }
    unbind() {}
  }
}

/*
  我们需要有一个假的图片，换成新的 onload 事件 换成新的
  监控找到能滚动的元素 多次指令生成只监控一次 节流
  我们要监控滚动的位置 当前图片是否出现在可视区域内 如果出现加载图片
*/
