import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'

Vue.config.productionTip = false
router.beforeEach((to, form, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (getToken()) { // 是否登录
    if (to.path === '/login') {
      next('/')
    } else if (to.path === '/500') {
      next()
    } else {
      if (store.getters.routerMenu.length === 0) { // 是否获取了授权路由
        store.dispatch('getmenu').then(res => {
          router.addRoutes(res) // 动态添加路由表
          next({ ...to, replace: true })// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        })
      } else { // 已获取授权路由 想去哪就去哪
        next()
      }
    }
  } else {
    if (to.path === '/login' || to.path === '/404' || to.path === '/500') {
      next()
    } else {
      next('/login')
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
