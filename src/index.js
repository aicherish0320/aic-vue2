import { initMixin } from './init'
import { renderMixin } from './render'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)

export default Vue
