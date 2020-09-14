<template>
  <div class="head">
    <span class="menu-drag" @click="open">
      <i v-if="!isCollapse" class="icon iconfont icon-shouqicaidan" title="收起"></i>
      <i v-else class="icon iconfont icon-zhankaicaidan" title="展开"></i>
    </span>
    <div class="nav">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="$route.matched[0].meta.title">{{$route.matched[0].meta.title}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.matched[1].meta.title">{{$route.matched[1].meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="dropdown">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="password">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="loginOut">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" title="修改密码">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form :model="ruleForm" ref="ruleForm" label-width="90px" class="demo-ruleForm">
          <el-tooltip class="item" v-model="bigChar" effect="dark" content="大写锁定已打开" placement="bottom" :manual="true">
            <el-form-item label="当前密码">
              <span style="position:absolute;left:-76px;color:#eb453c;">*</span>
              <el-input :min="0" style="width:270px;" show-password v-model="ruleForm.oldPassword" placeholder="请输入当前密码" @keyup.native="keyDown"></el-input>
            </el-form-item>
          </el-tooltip>
          <el-tooltip class="item" v-model="bigChar2" effect="dark" content="大写锁定已打开" placement="bottom" :manual="true">
            <el-form-item label="新密码">
              <span style="position:absolute;left:-64px;color:#eb453c;">*</span>
              <el-input :min="0" style="width:270px;" show-password v-model="ruleForm.newPassword" placeholder="请输入新密码" @keyup.native="keyDown2"></el-input>
            </el-form-item>
          </el-tooltip>
          <el-tooltip class="item" v-model="bigChar3" effect="dark" content="大写锁定已打开" placement="bottom" :manual="true">
            <el-form-item label="确认密码">
              <span style="position:absolute;left:-76px;color:#eb453c;">*</span>
              <el-input :min="0" style="width:270px;" show-password v-model="checkpassword" placeholder="请输入新密码" @keyup.native="keyDown3"></el-input>
            </el-form-item>
          </el-tooltip>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
 </div>
</template>
<script>
import { loginOut, editUserPwd } from '@/api'
import vDialog from '@c/dialog'
import { removeToken } from '@/utils/auth'
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: ''
    }
  },
  components: {
    vDialog
  },
  data () {
    return {
      dialogFormVisible: false,
      submitTitle: '确定',
      subLoad: false,
      userInfo: '',
      ruleForm: {
        oldPassword: '',
        newPassword: ''
      },
      checkpassword: '',
      x: 0,
      hasmove: 0,
      canmove: false,
      num: [],
      firstTochar: false,
      bigChar: false,
      firstTochar2: false,
      bigChar2: false,
      firstTochar3: false,
      bigChar3: false
    }
  },
  computed: {
    cansubmit: function () {
      return (this.ruleForm.oldPassword === '' || this.ruleForm.newPassword === '' || this.checkpassword === '' || this.ruleForm.newPassword !== this.checkpassword)
    }
  },
  methods: {
    keyDown (event) {
      this.bigChar2 = false
      this.bigChar3 = false
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
      var strlen = _that.ruleForm.oldPassword.length
      var oldPassword = _that.ruleForm.oldPassword
      if (strlen) {
        var uniCode = oldPassword.charCodeAt(strlen - 1)
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
    keyDown2 (event) {
      this.bigChar = false
      this.bigChar3 = false
      const _that = this
      var e = event || window.event
      var keyvalue = e.keyCode ? e.keyCode : e.which
      if (_that.firstTochar2) { // 是否输入过字母键，且判断是否按键为caps lock
        if (keyvalue === 20) {
          _that.bigChar2 = !_that.bigChar2
          return
        }
      }
      // 未输入过字母键，或按键不是caps lock，判断每次最后输入的字符的大小写
      // eslint-disable-next-line no-unneeded-ternary
      var shifKey = e.shiftKey ? e.shiftKey : ((keyvalue === 16) ? true : false)
      var strlen = _that.ruleForm.newPassword.length
      var newPassword = _that.ruleForm.newPassword
      if (strlen) {
        var uniCode = newPassword.charCodeAt(strlen - 1)
        if (keyvalue >= 65 && keyvalue <= 90) {
          // 如果是字母键
          _that.firstTochar2 = true
          if (((uniCode >= 65 && uniCode <= 90) && !shifKey) || ((uniCode >= 97 && uniCode <= 122) && shifKey)) {
            _that.bigChar2 = true
          } else {
            _that.bigChar2 = false
          }
        }
      } else {
        if (keyvalue === 20) {
          _that.bigChar2 = !_that.bigChar2
        }
      }
    },
    keyDown3 (event) {
      this.bigChar2 = false
      this.bigChar = false
      const _that = this
      var e = event || window.event
      var keyvalue = e.keyCode ? e.keyCode : e.which
      if (_that.firstTochar3) { // 是否输入过字母键，且判断是否按键为caps lock
        if (keyvalue === 20) {
          _that.bigChar3 = !_that.bigChar3
          return
        }
      }
      // 未输入过字母键，或按键不是caps lock，判断每次最后输入的字符的大小写
      // eslint-disable-next-line no-unneeded-ternary
      var shifKey = e.shiftKey ? e.shiftKey : ((keyvalue === 16) ? true : false)
      var strlen = _that.checkpassword.length
      var checkpassword = _that.checkpassword
      if (strlen) {
        var uniCode = checkpassword.charCodeAt(strlen - 1)
        if (keyvalue >= 65 && keyvalue <= 90) {
          // 如果是字母键
          _that.firstTochar3 = true
          if (((uniCode >= 65 && uniCode <= 90) && !shifKey) || ((uniCode >= 97 && uniCode <= 122) && shifKey)) {
            _that.bigChar3 = true
          } else {
            _that.bigChar3 = false
          }
        }
      } else {
        if (keyvalue === 20) {
          _that.bigChar3 = !_that.bigChar3
        }
      }
    },
    open () {
      this.isCollapse ? this.$emit('open', false) : this.$emit('open', true)
    },
    async loginOut () { // 退出登录
      await loginOut()
      removeToken()
      this.$store.commit('ROUTER_MENU', [])
      this.$store.commit('targview', [])
      sessionStorage.removeItem('userInfo')
      this.$router.push('/Login')
    },
    submit () {
      if (this.cansubmit) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create()
      }, 700)
    },
    async create () {
      const res = await editUserPwd(this.ruleForm)
      if (res.result === '1') {
        this.subLoad = false
        this.dialogFormVisible = false
        this.submitTitle = '确定'
        this.loginOut()
      }
      this.submitTitle = '确定'
      this.subLoad = false
    },
    password () {
      this.ruleForm = {
        oldPassword: '',
        newPassword: ''
      }
      this.checkpassword = ''
      this.dialogFormVisible = true
    }
  },
  created () {
    if (sessionStorage.getItem('userInfo')) {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    }
  }
}
</script>
<style scoped lang="less">
.head {
  height: 49px;
  font-size: 0;
  position: relative;
  border-bottom: 1px solid #e2e9ef;
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .msg{
    position: absolute;
    top: 11px;
    right: 110px;
  }
  .dropdown{
    position: absolute;
    right: 20px;
    line-height: 50px;
    padding: 0 5px;
    top: 0;
    &:hover{
      &::after{
        width: 100%;
      }
    }
    &::after{
      content: '';
      position:absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 0;
      height: 2px;
      margin: 0 auto;
      background-color: #333;
      transition: all 0.2s;
    }
  }
}
.menu-drag{
  line-height: 50px;
  margin: 0 20px;
  display: inline-block;
  cursor: pointer;
  position: relative;
  &:hover{
    &::after{
      width: 100%;
    }
  }
  &::after{
    content: '';
    position:absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 0;
    height: 2px;
    margin: 0 auto;
    background-color: #20222A;
    transition: all 0.2s;
  }
  .icon{
    font-size: 18px;
    color: #333;
    vertical-align: middle;
  }
}
</style>
