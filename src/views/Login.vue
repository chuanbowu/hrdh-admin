<template>
  <div class="loginInfo">
    <swiper></swiper>
    <!-- <img class="logo" :src="require('@/assets/img/logo-footer.png')" alt=""> -->
    <div id="login">
      <div class="main-title">
        <div class="beg-login-box">
            <header><h1>管理后台登录</h1></header>
            <div class="beg-login-main">
              <div class="login-form">
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item prop="username">
                    <i class="icon el-icon-user"></i><el-input clearable v-model="ruleForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
                  </el-form-item>
                  <el-tooltip class="item" v-model="bigChar" effect="dark" content="大写锁定已打开" placement="bottom" :manual="true">
                    <el-form-item prop="password">
                      <i class="icon el-icon-lock"></i><el-input show-password v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码" @keyup.native="keyDown"></el-input>
                    </el-form-item>
                  </el-tooltip>
                  <el-form-item prop="password" class="pas">
                    <i class="icon el-icon-bangzhu"></i><el-input clearable v-model="ruleForm.code" auto-complete="off" @keyup.enter.native="submitForm" placeholder="请输入验证码"></el-input>
                    <div class="code" @click="createCode">{{code}}</div>
                  </el-form-item>
                  <el-form-item class="pas">
                    <el-checkbox @change="change" v-model="checked">记住密码</el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" :disabled="disabled" :loading="subLoad" @click="submitForm">{{submitTitle}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'
import swiper from '@c/swiper'
import { setToken } from '@/utils/auth'
export default {
  name: 'Login',
  components: {
    swiper
  },
  data () {
    return {
      ruleForm: {
        username: '',
        password: '',
        code: ''
      },
      code: '',
      subLoad: false,
      submitTitle: '登录',
      checked: false,
      firstTochar: false,
      bigChar: false
    }
  },
  computed: {
    disabled: function () {
      return (this.ruleForm.username === '' || this.ruleForm.password === '' || this.ruleForm.code === '' || this.subLoad)
    }
  },
  methods: {
    keyDown (event) {
      const _that = this
      var e = event || window.event
      var keyvalue = e.keyCode ? e.keyCode : e.which
      if (_that.firstTochar) { // 是否输入过字母键，且判断是否按键为caps lock
        if (keyvalue === 20) {
          _that.bigChar = !_that.bigChar
          return
        }
      }
      // 未输入过字母键，或按键不是caps lock，判断每次最后输入的字符的大小写
      // eslint-disable-next-line no-unneeded-ternary
      var shifKey = e.shiftKey ? e.shiftKey : ((keyvalue === 16) ? true : false)
      var strlen = _that.ruleForm.password.length
      var password = _that.ruleForm.password
      if (strlen) {
        var uniCode = password.charCodeAt(strlen - 1)
        if (keyvalue >= 65 && keyvalue <= 90) {
          // 如果是字母键
          _that.firstTochar = true
          if (((uniCode >= 65 && uniCode <= 90) && !shifKey) || ((uniCode >= 97 && uniCode <= 122) && shifKey)) {
            _that.bigChar = true
          } else {
            _that.bigChar = false
          }
        }
      } else {
        if (keyvalue === 20) {
          _that.bigChar = !_that.bigChar
        }
      }
    },
    async submitForm () {
      if (this.disabled) return
      if (this.ruleForm.code.toLowerCase() !== this.code.toLowerCase()) {
        this.$message({ type: 'warning', message: '请输入正确的验证码' })
        this.createCode()
      } else {
        setTimeout(() => {
          this.subLoad = true
          this.submitTitle = '登录中...'
          this.login()
        }, 500)
      }
    },
    async login () {
      this.change()
      const res = await login({ username: this.ruleForm.username, password: this.ruleForm.password })
      this.subLoad = false
      if (res.result === '1') {
        setToken(res.datas.token)
        this.$router.push('/dashboard')
      }
      this.submitTitle = '登录'
    },
    createCode () {
      let code = ''
      const codeLength = 4
      const selectChar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 36)
        code += selectChar[charIndex]
      }
      code.toLowerCase()
      this.code = code
    },
    change () {
      if (this.checked) {
        localStorage.setItem('logindata', JSON.stringify(this.ruleForm))
      } else {
        localStorage.removeItem('logindata', JSON.stringify(this.ruleForm))
      }
    }
  },
  created () {
    this.createCode()
    if (localStorage.getItem('logindata')) {
      this.checked = true
      this.ruleForm = JSON.parse(localStorage.getItem('logindata'))
      this.ruleForm.code = ''
    }
  }
}
</script>

<style lang="less" scoped>
.loginInfo {
  height: 100%;
}
.logo {
  position: absolute;
  top: 7%;
  left: 10%;
  z-index: 100;
}
.main-title {
  max-width: 430px;
  width: 100%;
  position: absolute;
  margin: 0;
  padding: 0;
  color: #333;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%,-50%);
  transform: translate(-50%,-50%);
  .beg-login-box {
    width: 90%;
    max-width: 430px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 10px;
    header {
      height: 39px;
      padding: 10px;
      border-bottom: 1px solid #DCDFE6;
      h1 {
        text-align: center;
        font-size: 25px;
        line-height: 40px;
      }
    }
    footer {
      height: 25px;
      padding: 0px 10px 0 10px;
      p {
        line-height: 25px;
      }
    }
  }
}
#login {
  position: relative;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .login-form {
    padding: 10px;
    overflow: hidden;
    .icon {
      color: #666;
      font-size: 18px;
      position: absolute;
      z-index: 1;
      left: 8px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
}
</style>
<style lang="less">
.login-form {
  .el-form {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
  .el-form-item__content {
    margin-left: 0!important;
    display: flex;
    .el-button {
      width: 100%;
    }
    .el-input {
      flex: 1;
      &.code {
        .el-input__inner {
          padding-left: 15px;
        }
      }
      .el-input__inner {
        padding-left: 30px;
        line-height: 1;
      }
    }
    .code {
      width: 100px;
      height: 40px;
      margin-left: 5px;
      position: absolute;
      text-align: center;
      line-height: 40px;
      right: 0;
      top: 50%;
      transform: translate(0, -50%);
      background-color: #a0cfff;
      color: #fff;
      font-weight: 500;
      cursor: pointer;
      border-radius: 0 4px 4px 0;
    }
  }
}
.el-form-item.pas {
  margin-bottom: 0;
}
</style>
