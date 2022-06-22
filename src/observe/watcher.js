import Dep from './dep'
import { queueWatcher } from './scheduler'

let id = 0
class Watcher {
  constructor(vm, fn, cb, options) {
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.options = options
    this.id = id++
    this.depsId = new Set()
    this.deps = []

    // fn 就是页面渲染逻辑
    // 这里赋值，目的是为了后面实现 $watch
    this.getter = fn

    // 一上来就做一次初始化 进行页面渲染
    this.get()
  }
  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }
  addDep(dep) {
    const depId = dep.id
    if (!this.depsId.has(depId)) {
      this.depsId.add(depId)
      this.deps.push(dep)

      dep.addSub(this)
    }
  }
  update() {
    queueWatcher(this)
    // this.get()
    // console.log('update')
    // if (this.timer) {
    //   return
    // }
    // this.timer = setTimeout(() => {
    //   this.timer = null
    //   console.log('update')
    //   this.get()
    // }, 0)
  }
  run() {
    this.get()
  }
}

export default Watcher
