import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'

Vue.config.productionTip = false

// 引入Cesium相关
const cesium = require('cesium/Cesium.js')
const widgets = require('cesium/Widgets/widgets.css')
// cesium对象
Vue.prototype.Cesium = cesium
Vue.prototype.widgets = widgets
// 视图对象
Vue.prototype.viewer = null

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
