<template>
  <div class="con">
    <div class="search-zu">
      <div class="search-item three">
        <span class="title">用户名：</span>
        <el-input v-model="serachData.userName" clearable></el-input>
      </div>
      <!-- <div class="search-item four">
        <span class="title">用户姓名：</span>
        <el-input v-model="serachData.trueName" clearable></el-input>
      </div> -->
      <div class="search-item two">
        <span class="title">状态：</span>
        <el-select clearable v-model="serachData.status" placeholder="请选择">
          <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-goods" @click="freeze(2)">冻结</el-button>
          <el-button size="mini" type="primary" icon="el-icon-check" @click="freeze(1)">恢复正常</el-button>
          <el-button size="mini" type="primary" @click="reset">重置密码</el-button>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="freeze(3)">删除</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="sysUser" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="userName" label="用户名"></el-table-column>
        <el-table-column prop="trueName" label="用户姓名"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1" style="color:#67c23a">正常</span>
            <span v-if="scope.row.status === 2" style="color:#eb453c">冻结</span>
            <span v-if="scope.row.status === 3" style="color:#999">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="loginIp" label="登录IP"></el-table-column>
        <el-table-column prop="loginDate" label="登录时间"></el-table-column>
        <el-table-column prop="loginDate" label="操作" width="190">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="openRoleTable(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="serachData.pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="serachData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
    </div>
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑用户信息':'新增系统用户'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-form-item label="登录账号" prop="userName">
            <span style="position:absolute;left:-78px;color:#eb453c;">*</span>
            <el-input style="width: 270px" clearable v-model="form.userName" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password" v-if="!isedit">
            <span style="position:absolute;left:-78px;color:#eb453c;">*</span>
            <el-input style="width: 270px" show-password v-model="form.password" placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-form-item label="账号姓名" prop="trueName">
            <span style="position:absolute;left:-78px;color:#eb453c;">*</span>
            <el-input style="width: 270px" clearable v-model="form.trueName" placeholder="请输入账号姓名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog :width="700" :zIndex="10" :dialogShow="dialogFormVisible1" title="角色分配">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con" class="role">
        <div class="my-table">
          <el-table :data="roleList" ref="roletable" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange1">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible1=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit1" :loading="subLoad" @click="sure">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { checkLoginName } from '@/utils/commom'
import { systemUserList, systemUserAdd, systemUserEdit, editStatus, resetPassword, userRoleList, userRoleAddUserRole } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      submitTitle: '确定',
      subLoad: false,
      isedit: false,
      form: { userName: '', password: '', trueName: '' },
      choseArr: [],
      userIds: [],
      roleids: [],
      count: 1,
      serachData: { userName: '', status: '', pageNum: 1, trueName: '', pageSize: 20 },
      sysUser: [],
      roleList: [],
      userId: '',
      options: [{ value: 1, label: '正常' }, { value: 2, label: '冻结' }],
      rules: {
        userName: [
          { validator: checkLoginName, trigger: 'change' }
        ]
      }
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.userName === '' || this.form.trueName === '' || !/^[a-zA-z]\w{3,15}$/.test(this.form.userName) || (!this.isedit && this.form.password === '') || this.subLoad)
    },
    cansubmit1: function () {
      return (this.roleids.length === 0 || this.subLoad)
    }
  },
  methods: {
    refresh () {
      this.serachData = { userName: '', status: '', pageNum: 1, trueName: '', pageSize: 20 }
      this.getUserList()
    },
    search () {
      this.serachData.pageNum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.serachData.pageNum = val
      this.getUserList()
    },
    handleSizeChange (val) { // 每页条数改变
      this.serachData.pageSize = val
      this.getUserList()
    },
    handleSelectionChange (val) {
      this.choseArr = val
    },
    handleSelectionChange1 (val) {
      if (val.length > 1) {
        this.$refs.roletable.clearSelection()
        val.shift()
        this.$refs.roletable.toggleRowSelection(val[0])
      }
      if (val[0]) this.roleids = [val[0].id]
    },
    addUser () {
      this.$refs.form.resetFields()
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.dialogFormVisible = true
      this.form.userName = row.userName
      this.form.trueName = row.trueName
      this.form.id = row.id
      this.isedit = true
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
      let res
      this.isedit ? res = await systemUserEdit({ id: this.form.id, trueName: this.form.trueName }) : res = await systemUserAdd(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getUserList()
      }
      this.submitTitle = '确定'
      this.subLoad = false
    },
    freeze (row) {
      if (this.choseArr.length === 0) {
        this.$message({ type: 'warning', message: '请选择要操作的用户' })
      } else {
        this.userIds = this.choseArr.map((item) => {
          return item.id
        })
        let tip
        row === 1 ? tip = '此操作将批量解冻选择的用户，是否继续？' : row === 2 ? tip = '此操作将批量冻结选择的用户，是否继续？' : tip = '此操作将批量删除选择的用户，是否继续？'
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._freeze(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
      }
    },
    async _freeze (row) {
      const res = await editStatus({ type: row, userIds: this.userIds.toString() })
      if (res.result === '1') {
        this.$refs.table.clearSelection()
        this.choseArr = []
        this.serachData.pageNum = 1
        this.getUserList()
      }
    },
    reset () {
      if (this.choseArr.length === 0) {
        this.$message({ type: 'warning', message: '请选择要操作的用户' })
      } else {
        this.userIds = this.choseArr.map((item) => {
          return item.id
        })
        this.$confirm('该操作将重置选中用户的密码，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._reset()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    },
    async _reset (row) {
      const res = await resetPassword({ userIds: this.userIds.toString() })
      if (res.result === '1') {
        this.$refs.table.clearSelection()
        this.choseArr = []
      }
    },
    openRoleTable (row) {
      this.userId = row.id
      this.dialogFormVisible1 = true
      this._sysRolelist()
    },
    async _sysRolelist () {
      const res = await userRoleList({ userId: this.userId })
      this.$refs.roletable.clearSelection()
      if (res.result === '0') {
        this.roleList = res.datas.list
        setTimeout(() => {
          res.datas.list.map((item) => {
            if (item.type === 'true') {
              this.roleids.push(item.id)
              this.$refs.roletable.toggleRowSelection(item)
            }
          })
        }, 20)
      }
    },
    async getUserList () {
      const res = await systemUserList(this.serachData)
      if (res.result === '0') {
        this.sysUser = res.datas.sysUser
        this.count = res.datas.totalRow
      }
    },
    setReset () {
      this.form = { userName: '', password: '', trueName: '' }
    },
    sure () {
      if (this.roleids.length === 0) {
        this.$message({ type: 'warning', message: '请至少选择一个要分配的角色' })
        return
      }
      if (this.cansubmit1) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.setrole()
      }, 700)
    },
    async setrole () {
      const res = await userRoleAddUserRole({ userId: this.userId, roleId: this.roleids.toString() })
      if (res.result === '1') {
        this.dialogFormVisible1 = false
        this.getUserList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    }
  },
  created () {
    this.getUserList()
  }
}
</script>
<style scoped lang="less">
.con{
  height: 100%;
  .btn-con {
    float: right;
  }
  .log-date{
    font-size: 14px;
  }
  .my-table{
    height: calc(100% - 100px);
    position: relative;
  }
  .el-dialog__body .my-table{
    height: 350px;
  }
  .role {
    .my-table {
      width: 99%;
      height: 420px;
    }
  }
}
</style>
<style>
.role thead .el-table-column--selection .cell {
  display: none;
}
</style>
