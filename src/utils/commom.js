export function isPC () {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

function formatNumber (n) { // 过滤时间数字
  n = n.toString()
  return n[1] ? n : '0' + n
}

export function formatTime (date) { // 时间戳过滤或获取新日期
  const time = date ? new Date(date) : new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  const hour = time.getHours()
  const minute = time.getMinutes()
  const second = time.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export function getStartTime (date) { // 获取当天开始时间
  const time = date ? new Date(date) : new Date()
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const day = time.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + '00:00:00'
}

export function checkLoginName (rule, value, callback) { // 验证登录账号
  if (!/^[a-zA-z]\w{3,15}$/.test(value)) callback(new Error('字母、数字、下划线组成，字母开头，4-16位'))
}

export function checkPhone (rule, value, callback) { // 验证Phone
  if (!/^1[3456789]\d{9}$/.test(value)) callback(new Error('请输入正确的手机号'))
}

export function checkMobile (rule, value, callback) { // 验证Mobile
  if (!/^1[3456789]\d{9}$/.test(value)) callback(new Error('请输入正确的电话号码'))
}

export function checkQQ (rule, value, callback) { // 验证QQ
  if (!/^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/.test(value)) callback(new Error('请输入正确的QQ号码'))
}

export function checkIP (rule, value, callback) { // 验证IP
  if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(value)) callback(new Error('请输入正确的IP'))
}

export function checkEMAIL (rule, value, callback) { // 验证EMAIL
  if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) callback(new Error('请输入正确的EMAIL'))
}

export function checkPic (rule, value, callback) { // 验证金额
  if (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value)) callback(new Error('请输入正确的金额'))
}

export function checkNumber (rule, value, callback) { // 验证整数
  if (!/^-?\d+$ /.test(value)) callback(new Error('请输入正数'))
}

export function checkInt (rule, value, callback) { // 验证正整数（>0的整数）
  if (!/^[1-9]*[1-9][0-9]*$/.test(value)) callback(new Error('请输入正整数'))
}

export function checkInt2 (rule, value, callback) { // 验证正整数（>=0的整数）
  if (!/^[1-9]*[0-9][0-9]*$/.test(value)) callback(new Error('请输入正整数'))
}

export function checkDefeatInt (rule, value, callback) { // 验证负整数（<0的整数）
  if (!/^-[1-9]*[1-9][0-9]*$/.test(value)) callback(new Error('请输入负整数'))
}

export function checkDefeatInt2 (rule, value, callback) { // 验证负整数（<=0的整数）
  if (!/^-[1-9]*[0-9][0-9]*$/.test(value)) callback(new Error('请输入负整数'))
}

export function checkSmallNumber (rule, value, callback) { // 验证非负小数
  if (!/^(([0-9]+|0)\.([0-9]{1,}))$/.test(value)) callback(new Error('请输入非负小数'))
}

export function checkOneAsTwoSmallNumber (rule, value, callback) { // 验证1~2位非负小数
  if (!/^(([0-9]+|0)\.([0-9]{1,2}))$/.test(value)) callback(new Error('请输入非负小数，且最多两位小数'))
}

export function checkOneSmallNumber (rule, value, callback) { // 验证1位小数
  if (!/^(([^0][0-9]+|0)\.([0-9]{1}))$/.test(value)) callback(new Error('请输入1位小数'))
}

export function checkTwoSmallNumber (rule, value, callback) { // 验证2位小数
  if (!/^(([0-9]+|0)\.([0-9]{2}))$/.test(value)) callback(new Error('请输入2位小数'))
}

export function checkFourSmallNumber (rule, value, callback) { // 验证4位小数
  if (!/^(([^0][0-9]+|0)\.([0-9]{4}))$/.test(value)) callback(new Error('请输入4位小数'))
}

export function checkOneFlaseSmallNumber (rule, value, callback) { // 验证1位非负小数
  if (!/^(([0-9]+|0)\.([0-9]{1}))$/.test(value)) callback(new Error('请输入1位非负小数'))
}

export function checkTwoFlaseSmallNumber (rule, value, callback) { // 验证2位非负小数
  if (!/^(([0-9]+|0)\.([0-9]{2}))$/.test(value)) callback(new Error('请输入2位非负小数'))
}

export function checkFourFlaseSmallNumber (rule, value, callback) { // 验证4位非负小数
  if (!/^(([0-9]+|0)\.([0-9]{4}))$/.test(value)) callback(new Error('请输入4位非负小数'))
}

export const baseUrl = 'http://www.chuanbowu.com/'
