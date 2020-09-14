<template>
  <div class="content">
    <div class="search-zu">
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="freeze(3)">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" fixed width="55"></el-table-column>
        <el-table-column prop="sensationRecommendId" label="红人推荐ID"></el-table-column>
        <el-table-column prop="sensationRecommendId" label="红人ID"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="headPic" label="头像">
          <template slot-scope="scope">
            <img style="width:110px" @click="prev(scope.$index)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="modifySysUserName" label="操作人"></el-table-column>
        <el-table-column prop="modifyDate" label="操作时间"></el-table-column>
        <el-table-column prop="enabled" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑红人推荐':'新增红人推荐'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="90px">
          <el-form-item label="选择红人" prop="sensationRecommendId">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <span v-show="sessionName" style="padding-right:10px ">{{sessionName}}</span>
            <el-button  size="mini" type="primary" @click="dialogFormVisible1=true">选择红人</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog class="getgoods" :width="900" :zIndex="10" :dialogShow="dialogFormVisible1" title="选择红人">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <div class="search-zu">
          <div class="search-item">
            <span class="title">红人昵称：</span>
            <el-input v-model="requestData1.nickName" clearable @keyup.enter.native="search" placeholder="请输入红人昵称"></el-input>
          </div>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search1">搜索</el-button>
          <span style="padding: 0 10px;line-height: 40px;color: #eb453c;font-size:12px">双击红人列表行即可选中该红人</span>
        </div>
        <el-tabs v-model="requestData1.sensationType" @tab-click="handleClick">
          <el-tab-pane label="红人" name="1"></el-tab-pane>
          <el-tab-pane label="找红人" name="2"></el-tab-pane>
        </el-tabs>
        <div class="my-table">
          <el-table :data="sessionList" ref="table" style="width: 100%" height="455" :stripe="true" highlight-current-row size="mini" @row-dblclick="dblclick">
            <el-table-column prop="sensationId" fixed label="红人id"></el-table-column>
            <el-table-column prop="nickName" width="100" fixed label="昵称"></el-table-column>
            <el-table-column prop="headPic" label="头像" width="90" >
              <template slot-scope="scope">
                <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="90" >
              <template slot-scope="scope">
                <span v-if="scope.row.sex===1">男</span>
                <span v-if="scope.row.sex===2">女</span>
                <span v-if="scope.row.sex===3">无</span>
              </template>
            </el-table-column>
            <el-table-column prop="provinceName" label="所在地区" width="200">
              <template slot-scope="scope">
                <span>{{`${scope.row.provinceName} ${scope.row.cityName} ${scope.row.areaName}`}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="extensionStatus" label="推广类目" width="90" >
              <template slot-scope="scope">
                <span v-if="scope.row.extensionStatus===1">抖音</span>
                <span v-if="scope.row.extensionStatus===2">快手</span>
                <span v-if="scope.row.extensionStatus===3">小红书</span>
                <span v-if="scope.row.extensionStatus===4">淘宝</span>
                <span v-if="scope.row.extensionStatus===5">今日头条</span>
                <span v-if="scope.row.extensionStatus===6">微博</span>
                <span v-if="scope.row.extensionStatus===7">B站</span>
              </template>
            </el-table-column>
            <el-table-column prop="extensionType" label="推广方式" width="250" >
              <template slot-scope="scope">
                <span v-if="scope.row.extensionType.indexOf('1')>-1">橱窗广告</span>
                <span v-if="scope.row.extensionType.indexOf('2')>-1">、原创视频+发布</span>
                <span v-if="scope.row.extensionType.indexOf('3')>-1">、CPS分成</span>
                <span v-if="scope.row.extensionType.indexOf('4')>-1">、直播带货</span>
              </template>
            </el-table-column>
          </el-table>
          <cb-loading :show="$store.getters.loading"/>
        </div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="requestData1.pageNum"
            :page-sizes="[20, 25, 30, 35]"
            :page-size="requestData1.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { baseUrl } from '@/utils/commom'
import { sensationRecommendList, addSensationRecommend, sensationRecommendUp, sensationList } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      requestData: {},
      list: [],
      total: 0,
      form: { sensationId: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false,
      requestData1: { pageNum: 1, pageSize: 20, nickName: '', status: '', sensationType: '1' },
      total1: 0,
      sessionList: [],
      sessionName: '',
      choseA: []
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.sensationId === '' || this.subLoad)
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.choseA = val
    },
    handleClick () {
      this.sessionName = ''
      this.requestData1.pageNum = 1
      this.requestData1.nickName = ''
      this.getQueryList()
    },
    handleSizeChange1 (val) {
      this.requestData1.pageSize = val
      this.getQueryList()
    },
    handleCurrentChange1 (val) {
      this.requestData1.pageNum = val
      this.getQueryList()
    },
    search1 () {
      this.requestData1.pageNum = 1
      this.getQueryList()
    },
    refresh () {
      this.requestData = {}
      this.getList()
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
      this.sessionName = ''
      this.requestData1.pageNum = 1
      this.requestData1.nickName = ''
      this.requestData1.sensationType = '1'
      this.getQueryList()
    },
    edit (row) {
      this.form.sensationRecommendId = row.sensationRecommendId
      this.form.sensationId = row.sensationId
      this.sessionName = row.nickName
      this.dialogFormVisible = true
      this.isedit = true
      this.requestData1.pageNum = 1
      this.requestData1.nickName = ''
      this.requestData1.sensationType = '1'
      this.getQueryList()
    },
    async getList () {
      const res = await sensationRecommendList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
      }
    },
    setReset () {
      this.form = { sensationId: '' }
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
      const res = await addSensationRecommend(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    prev (index) {
      const srcs = this.list.map(item => {
        return this.baseUrl + item.headPic
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    async getQueryList () {
      const res = await sensationList(this.requestData1)
      if (res.result === '0') {
        this.sessionList = res.datas.list
        this.total1 = res.datas.totalRow
      }
    },
    dblclick (row) {
      this.dialogFormVisible1 = false
      this.form.sensationId = row.sensationId
      this.sessionName = row.nickName
    },
    freeze (row) {
      if (this.choseA.length === 0) {
        this.$message({ type: 'warning', message: '请先选择要操作的推荐红人' })
        return
      }
      const ids = this.choseA.map(item => {
        return item.sensationRecommendId
      })
      this.$confirm('此操作将删除选中的红人推荐，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (ids) {
      const res = await sensationRecommendUp({ sensationRecommendIds: ids.toString() })
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
<style>
  .getgoods .dialog_content .dialog_body {
    max-height: 608px!important;
  }
</style>
