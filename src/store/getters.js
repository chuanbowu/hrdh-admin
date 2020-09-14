/* 工具接口为了方便构建全局state自定义方法 */
const getters = {
  loading: state => state.route.loading,
  routerMenu: state => state.route.routerMenu,
  authPower: state => state.route.authPower,
  prevData: state => state.route.prevData
}
export default getters
