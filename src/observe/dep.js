import { watch } from 'rollup'

let id = 0

class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }
  depend() {
    // this.subs.push(Dep.target)
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((sub) => sub.update())
  }
}

// 全局变量 借助了 JS 单线程
Dep.target = null

export default Dep
