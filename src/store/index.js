/*
 文件都会汇聚到这个地方来,也是创建store对象的地方,就像store的入口一样
 http://www.cnblogs.com/web-Rain/p/6495364.html
 */
import Vue from 'vue'
import Vuex from 'vuex'
import route from './moduels/route'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    route
  },
  getters
})

export default store
