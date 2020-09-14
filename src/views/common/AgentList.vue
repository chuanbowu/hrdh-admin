<template>
  <div class="content">
    <div class="search-zu">
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column prop="agentId" label="经纪人ID"></el-table-column>
        <el-table-column prop="agentName" label="经纪人姓名"></el-table-column>
        <el-table-column prop="agentPic" label="经纪人微信二维码">
          <template slot-scope="scope">
            <img style="width:110px" @click="prev(scope.$index)" :src="baseUrl + scope.row.agentPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">启用</span>
            <span class="false" v-if="scope.row.status===2">禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifySysUserName" label="操作人"></el-table-column>
        <el-table-column prop="modifyDate" label="操作时间"></el-table-column>
        <el-table-column prop="enabled" label="操作" width="210">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="success" v-if="scope.row.status===2" @click="freeze(scope.row)">启用</el-button>
            <el-button size="mini" type="danger" v-if="scope.row.status===1" @click="freeze(scope.row)">禁用</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <v-dialog :width="450" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑经纪人':'新增经纪人'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="130px">
          <el-form-item label="经纪人姓名" prop="agentName">
            <span style="position:absolute;left:-90px;color:#eb453c;">*</span>
            <el-input style="width: 270px" v-model="form.agentName" placeholder="请输入经纪人昵称"></el-input>
          </el-form-item>
          <el-form-item label="经纪人微信二维码" prop="agentPic">
            <span style="position:absolute;left:-130px;color:#eb453c;">*</span>
            <my-upload :option="option" @updelete="updelete" @upfiles="upfiles"/>
          </el-form-item>
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
import vDialog from '@c/dialog'
import MyUpload from '@/components/Upload'
import cbLoading from '@c/loading'
import { baseUrl } from '@/utils/commom'
import { agentList, addAgent, agentUp } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      requestData: {},
      list: [],
      total: 0,
      form: { agentName: '', agentPic: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false,
      option: {
        type: 1,
        file: [],
        count: 1
      }
    }
  },
  components: {
    vDialog,
    MyUpload,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.agentName === '' || this.form.agentPic === '' || this.subLoad)
    }
  },
  methods: {
    refresh () {
      this.requestData = {}
      this.getList()
    },
    upfiles (file) {
      this.form.agentPic = file.files[0]
    },
    updelete (file) {
      this.form.agentPic = ''
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.form.agentId = row.agentId
      this.form.agentName = row.agentName
      this.form.agentPic = row.agentPic
      this.option.file = [row.agentPic]
      this.dialogFormVisible = true
      this.isedit = true
    },
    del (row) {
      this.$confirm('此操作将删除经纪人，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await agentUp({ agentIds: row.agentId, status: 3 })
        if (res.result === '1') {
          this.getList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '该操作已被取消'
        })
      })
    },
    async getList () {
      const res = await agentList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
      }
    },
    setReset () {
      this.option.file = []
      this.form = { agentName: '', agentPic: '' }
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
      const res = await addAgent(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    freeze (row) {
      let tip
      row.status === 2 ? tip = '此操作将启用该经纪人，是否继续？' : tip = '此操作将禁用该经纪人，是否继续？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(row.status === 2 ? 1 : 2, row.agentId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (status, agentId) {
      const res = await agentUp({ status: status, agentIds: agentId })
      if (res.result === '1') {
        this.getList()
      }
    },
    prev (index) {
      const srcs = this.list.map(item => {
        return this.baseUrl + item.agentPic
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped lang="less">
.content{
  height: 100%;
  .btn-con {
    float: right;
  }
  .my-table {
    position: relative;
    height: calc(100% - 43px);
  }
}
</style>
