import Vue from 'vue'
import App from './App.vue'
import { VueLazyLoad } from './components/vueLazyLoad'
// import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  // error: require('./assets/logo.png'),
  loading: require('./assets/logo.png')
})

new Vue({
  render: (h) => h(App)
}).$mount('#app')
