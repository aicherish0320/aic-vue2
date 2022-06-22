import { nextTick } from '../utils'

let queue = [] // 这里存放要更新的 watcher
let has = {} // 用来存储已有的 watcher 的 id

let pending = false

export function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    has[id] = true
    queue.push(watcher)
  }

  if (!pending) {
    nextTick(flushScheduleQueue, 0)
    pending = true
  }
}

function flushScheduleQueue() {
  queue.forEach((w) => w.run())
  has = {}
  queue = []
  pending = false
}
