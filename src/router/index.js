import Vue from 'vue'
import VueRouter from 'vue-router'
import CesiumView from '@/views/CesiumView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CesiumView',
    component: CesiumView
  },
]

const router = new VueRouter({
  routes
})

export default router
