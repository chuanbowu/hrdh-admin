import { sysInfo } from '@/api'
import { menu } from '@/router'
const routeArr = {
  state: {
    loading: false,
    authPower: [],
    routerMenu: [],
    prevData: { show: false, data: { index: 0, srcs: [] } }
  },
  mutations: {
    UPDATE_LOADING: (state, loading) => {
      state.loading = loading
    },
    authPower: (state, arr) => {
      state.authPower = arr
    },
    ROUTER_MENU: (state, arr) => {
      state.routerMenu = arr
    },
    prevData: (state, param) => {
      state.prevData = param
    }
  },
  actions: {
    getmenu ({ commit }) {
      return new Promise((resolve, reject) => {
        sysInfo().then(res => { // 拉取用户信息
          if (res.result === '0') {
            sessionStorage.setItem('userInfo', JSON.stringify(res.datas.userInfo))
            const addRoutes = []
            menu.map(item => {
              res.datas.oneMenuList.map(value => {
                if (item.path === value.menuUrl) {
                  item.meta.title = value.menuName
                  addRoutes.push(item)
                }
              })
            })
            addRoutes.map((item, i) => {
              const child = []
              item.children.map((value, j) => {
                res.datas.oneMenuList.map(item1 => {
                  if (item.path === item1.menuUrl) {
                    item1.twoMenuList.map(value1 => {
                      if (value.path === value1.menuUrl) {
                        value.titel = value1.menuName
                        child.push(value)
                      }
                    })
                  }
                })
              })
              item.children = child
            })
            addRoutes.push({ path: '*', redirect: '/404', hidden: true })
            commit('ROUTER_MENU', addRoutes)
            resolve(addRoutes)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default routeArr
