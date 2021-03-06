import { initGlobalAPI } from './global-api/index'
import { initMixin } from './init'
import { lifeMixin } from './lifecycle'
import { renderMixin } from './render'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifeMixin(Vue)
initGlobalAPI(Vue)

export default Vue
