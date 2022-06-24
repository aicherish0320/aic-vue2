import { compileToFunction } from './compiler/index'
import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifeMixin } from './lifecycle'
import { renderMixin } from './render'
import { createElm, patch } from './vnode/patch'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeMixin(Vue)
initGlobalAPI(Vue)

const vm1 = new Vue({
  data() {
    return {
      fullName: 'jack'
    }
  }
})
const render1 = compileToFunction(`<h1 class="cls">{{ fullName }}</h1>`)
const oldVNode = render1.call(vm1)
const el1 = createElm(oldVNode)
document.body.appendChild(el1)

const vm2 = new Vue({
  data() {
    return {
      fullName: 'aicherish'
    }
  }
})
const render2 = compileToFunction(
  `<h1 id="app" style="color: red;background: yellow">{{ fullName }}</h1>`
)
const vNode = render2.call(vm2)

setTimeout(() => {
  patch(oldVNode, vNode)
  // document.body.removeChild(el1)
  // document.body.appendChild(el2)
}, 1000)

export default Vue
