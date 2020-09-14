import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import index from '@/views/layout'
import no from '@/views/404'
import ServerError from '@/views/500'

Vue.use(VueRouter)

export const routersMenu = [
  {
    path: '/Login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'index',
    component: index,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: no,
    meta: { title: '无权限' }
  },
  {
    path: '/500',
    name: '500',
    component: ServerError,
    meta: { title: '服务器错误' }
  }
]
export const menu = [
  {
    path: '/business',
    name: 'business',
    component: index,
    redirect: '/BusinessList',
    meta: { title: '商家管理', icon: 'icon-shangwuhezuo' },
    children: [
      {
        path: '/BusinessList',
        name: 'BusinessList',
        component: () => import('@/views/business/BusinessList'),
        meta: { title: '商家列表' }
      },
      {
        path: '/CommissionGoodsList',
        name: 'CommissionGoodsList',
        component: () => import('@/views/business/CommissionGoodsList'),
        meta: { title: '返佣商品列表' }
      },
      {
        path: '/TakeDeliveryGoodsList',
        name: 'TakeDeliveryGoodsList',
        component: () => import('@/views/business/TakeDeliveryGoodsList'),
        meta: { title: '拿货商品列表' }
      }
    ]
  },
  {
    path: '/sensation',
    name: 'sensation',
    component: index,
    redirect: '/SensationList',
    meta: { title: '红人管理', icon: 'icon-qun' },
    children: [
      {
        path: '/SensationList',
        name: 'SensationList',
        component: () => import('@/views/sensation/SensationList'),
        meta: { title: '红人列表' }
      },
      {
        path: '/SensationCheckList',
        name: 'SensationCheckList',
        component: () => import('@/views/sensation/SensationCheckList'),
        meta: { title: '红人认证审核列表' }
      },
      {
        path: '/SensationWithdrawInfoList',
        name: 'SensationWithdrawInfoList',
        component: () => import('@/views/sensation/SensationWithdrawInfoList'),
        meta: { title: '红人提现明细列表' }
      }
    ]
  },
  {
    path: '/common',
    name: 'common',
    component: index,
    redirect: '/CustomerList',
    meta: { title: '公共配置', icon: 'icon-peizhi' },
    children: [
      {
        path: '/CustomerList',
        name: 'CustomerList',
        component: () => import('@/views/common/CustomerList'),
        meta: { title: '客服列表' }
      },
      {
        path: '/AdvertList',
        name: 'AdvertList',
        component: () => import('@/views/common/AdvertList'),
        meta: { title: '轮播图列表' }
      },
      {
        path: '/AgentList',
        name: 'AgentList',
        component: () => import('@/views/common/AgentList'),
        meta: { title: '经纪人列表' }
      },
      {
        path: '/AdvertisementList',
        name: 'AdvertisementList',
        component: () => import('@/views/common/AdvertisementList'),
        meta: { title: '广告列表' }
      },
      {
        path: '/SensationRecommendList',
        name: 'SensationRecommendList',
        component: () => import('@/views/common/SensationRecommendList'),
        meta: { title: '红人推荐列表' }
      },
      {
        path: '/ProblemList',
        name: 'ProblemList',
        component: () => import('@/views/common/ProblemList'),
        meta: { title: '常见问题配置列表' }
      },
      {
        path: '/CommissionRecommendList',
        name: 'CommissionRecommendList',
        component: () => import('@/views/common/CommissionRecommendList'),
        meta: { title: '返佣推荐商品列表' }
      },
      {
        path: '/TakeDeliveryRecommendList',
        name: 'TakeDeliveryRecommendList',
        component: () => import('@/views/common/TakeDeliveryRecommendList'),
        meta: { title: '拿货推荐商品列表' }
      },
      {
        path: '/BottomCommissionRecommendList',
        name: 'BottomCommissionRecommendList',
        component: () => import('@/views/common/BottomCommissionRecommendList'),
        meta: { title: '底部返佣推荐商品' }
      },
      {
        path: '/GoodsAdvertisementList',
        name: 'GoodsAdvertisementList',
        component: () => import('@/views/common/GoodsAdvertisementList'),
        meta: { title: '商品广告位配置' }
      },
      {
        path: '/GoodsNumConfig',
        name: 'GoodsNumConfig',
        component: () => import('@/views/common/uploadNumberConfig'),
        meta: { title: '商家上传商品数量配置' }
      },
      {
        path: '/GoodsTypeConfigList',
        name: 'GoodsTypeConfigList',
        component: () => import('@/views/common/GoodsTypeConfigList'),
        meta: { title: '商品分类配置' }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: index,
    redirect: '/Operator',
    meta: { title: '系统设置', icon: 'icon-xitongguanli' },
    children: [
      {
        path: '/Operator',
        name: 'Operator',
        component: () => import('@/views/system/Operator'),
        meta: { title: '用户管理' }
      },
      {
        path: '/RoleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/system/RoleManagement'),
        meta: { title: '角色管理' }
      }
    ]
  }
]

export default new VueRouter({
  mode: 'history',
  base: '/hrdh-web/', // 生产环境
  // base: '/', // 开发环境
  routes: routersMenu
})
