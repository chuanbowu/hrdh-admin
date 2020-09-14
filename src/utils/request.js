'use strict'

import axios from 'axios'
import setSign from '@/utils/MD5'
import { Message } from 'element-ui'
import store from '../store'
import router from '../router'
import { getToken, removeToken } from '@/utils/auth'
import NProgress from 'nprogress'

axios.interceptors.request.use(config => { // 发送请求前处理
  config.headers['Content-Type'] = 'application/json; charset=utf-8'
  if (getToken()) config.data.token = getToken()
  if (config.method === 'post') {
    config.data.appKey = 'web'
    config.data.sign = setSign.setSign(config.data)
  }
  // loading
  if (config.loading) {
    store.commit('UPDATE_LOADING', true)
    NProgress.start()
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => { // 数据响应前处理
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    const str = String(response.data.result).substr(String(response.data.result).length - 1)
    if (response.data.result === '100040') {
      removeToken()
      // Message({message: response.data.msg, type: 'warning', duration: 2000})
      router.push('/Login')
    } else if (str === '1') {
      Message({ message: response.data.message, type: 'success', duration: 2000 })
    }
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  // if (res.status === -404) {
  //   alert(res.msg)
  // }
  // if (res.data && (res.data.desc !== 'success')) {
  //   alert(res.data.desc)
  // }
  return res
}

export default {
  post (url, data, loading) {
    if (loading) {
      store.commit('UPDATE_LOADING', true)
      NProgress.start()
    }
    return axios({
      method: 'post',
      baseURL: '/hrdh-admin',
      url,
      data: data
    }).then(
      (response) => {
        store.commit('UPDATE_LOADING', false)
        NProgress.done()
        return checkStatus(response)
      }
    ).then(
      (res) => {
        store.commit('UPDATE_LOADING', false)
        NProgress.done()
        return checkCode(res)
      }
    )
  }
}
