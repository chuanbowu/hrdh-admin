'use strict'
import md5 from 'js-md5'
function setSign (params) {
  // 按字典排序
  var raw = function (args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function (key) {
      if (key === 'sign') {
        return
      }
      newArgs[key] = args[key]
    })
    var string = ''
    for (var k in newArgs) {
      string += k + '=' + newArgs[k]
    }
    return string + 'w5K21bOZdJPcFfq8AJtlG6kh8Cfc9wce'
  }
  return md5(raw(params))
}
export default {
  setSign (params) {
    return setSign(params)
  }
}
