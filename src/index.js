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

export default Vue
