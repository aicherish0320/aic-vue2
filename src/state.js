export function initState(vm) {
  const opts = vm.$options

  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  console.log('数据初始化')
}
