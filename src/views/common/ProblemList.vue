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
        <el-table-column prop="problemId" label="ID"></el-table-column>
        <el-table-column prop="sort" label="排序号"></el-table-column>
        <el-table-column prop="askContent" label="问内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="answerContent" label="答内容" show-overflow-tooltip></el-table-column>
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
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑常见问题':'新增常见问题'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="90px">
          <el-form-item label="排序号" prop="sort">
            <span style="position:absolute;left:-65px;color:#eb453c;">*</span>
            <el-input style="width: 270px" v-model="form.sort" placeholder="请输入排序号"></el-input>
          </el-form-item>
          <el-form-item label="问内容" prop="askContent">
            <span style="position:absolute;left:-65px;color:#eb453c;">*</span>
            <el-input type="textarea" :rows="3" style="width: 270px" v-model="form.askContent" placeholder="请输入问内容"></el-input>
          </el-form-item>
          <el-form-item label="答内容" prop="answerContent">
            <span style="position:absolute;left:-65px;color:#eb453c;">*</span>
            <el-input type="textarea" :rows="3" style="width: 270px" v-model="form.answerContent" placeholder="请输入答内容"></el-input>
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
import cbLoading from '@c/loading'
import { baseUrl } from '@/utils/commom'
import { problemList, addProblem, problemUp } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      requestData: {},
      list: [],
      total: 0,
      form: { askContent: '', answerContent: '', sort: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.askContent === '' || this.form.answerContent === '' || this.form.sort === '' || this.subLoad)
    }
  },
  methods: {
    refresh () {
      this.requestData = {}
      this.getList()
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.form.problemId = row.problemId
      this.form.sort = row.sort
      this.form.askContent = row.askContent
      this.form.answerContent = row.answerContent
      this.dialogFormVisible = true
      this.isedit = true
    },
    del (row) {
      this.$confirm('此操作将删除常见问题，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await problemUp({ problemIds: row.problemId, status: 3 })
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
      const res = await problemList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
      }
    },
    setReset () {
      this.form = { askContent: '', answerContent: '', sort: '' }
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
      const res = await addProblem(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    freeze (row) {
      let tip
      row.status === 2 ? tip = '此操作将启用该常见问题，是否继续？' : tip = '此操作将禁用该常见问题，是否继续？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(row.status === 2 ? 1 : 2, row.problemId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (status, problemId) {
      const res = await problemUp({ status: status, problemIds: problemId })
      if (res.result === '1') {
        this.getList()
      }
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
