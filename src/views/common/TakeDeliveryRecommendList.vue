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
        <el-table-column prop="takeDeliveryRecommendId" label="ID"></el-table-column>
        <el-table-column prop="sort" label="排序号"></el-table-column>
        <el-table-column prop="goodsId" label="商品ID"></el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品标题"></el-table-column>
        <el-table-column prop="mainPic" label="主图">
          <template slot-scope="scope">
            <img style="width:110px" @click="prev(scope.$index)" :src="baseUrl + scope.row.mainPic" alt="">
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
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑拿货推荐商品':'新增拿货推荐商品'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="90px">
          <el-form-item label="选择商品" prop="goodsId">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <span v-show="goodsName" style="padding-right:10px ">{{goodsName}}</span>
            <el-button  size="mini" type="primary" @click="dialogFormVisible1=true">选择商品</el-button>
          </el-form-item>
          <el-form-item label="排序号" prop="sort">
            <span style="position:absolute;left:-65px;color:#eb453c;">*</span>
            <el-input style="width: 270px" v-model="form.sort" placeholder="请输入排序号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog class="getgoods" :width="900" :zIndex="10" :dialogShow="dialogFormVisible1" title="商品选择">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <div class="search-zu">
          <div class="search-item">
            <span class="title">商品名称：</span>
            <el-input v-model="requestData1.businessTitle" clearable @keyup.enter.native="search1" placeholder="请输入商品名称"></el-input>
          </div>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="search1">搜索</el-button>
          <span style="padding: 0 10px;line-height: 40px;color: #eb453c;font-size:12px">双击商品列表行即可选中该商品</span>
        </div>
        <div class="my-table">
          <el-table :data="goodslist" ref="table" style="width: 100%" height="500" :stripe="true" highlight-current-row size="mini" @row-dblclick="dblclick">
            <el-table-column prop="goodsId" label="商品id"></el-table-column>
            <el-table-column prop="businessTitle" show-overflow-tooltip  label="商品名称"></el-table-column>
            <el-table-column prop="mainPic" label="商品主图" >
              <template slot-scope="scope">
                <img style="width:80px" :src="baseUrl + scope.row.mainPic" alt="">
              </template>
            </el-table-column>
            <el-table-column prop="goodsPrice"  label="商品价格"></el-table-column>
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
import { takeDeliveryRecommendList, addTakeDeliveryRecommend, takeDeliveryRecommendUp, takeDeliveryGoodsList } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible1: false,
      requestData: {},
      list: [],
      total: 0,
      form: { goodsId: '', sort: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false,
      requestData1: { pageNum: 1, pageSize: 20, businessTitle: '' },
      total1: 0,
      goodslist: [],
      goodsName: ''
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.goodsId === '' || this.form.sort === '' || this.subLoad)
    }
  },
  methods: {
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
      this.goodsName = ''
      this.requestData1.pageNum = 1
      this.requestData1.businessTitle = ''
      this.getQueryList()
    },
    edit (row) {
      this.form.takeDeliveryRecommendId = row.takeDeliveryRecommendId
      this.form.goodsId = row.goodsId
      this.form.sort = row.sort
      this.goodsName = row.businessTitle
      this.dialogFormVisible = true
      this.isedit = true
      this.requestData1.pageNum = 1
      this.requestData1.businessTitle = ''
      this.getQueryList()
    },
    del (row) {
      this.$confirm('此操作将删除拿货推荐商品，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await takeDeliveryRecommendUp({ takeDeliveryRecommendIds: row.takeDeliveryRecommendId, status: 3 })
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
      const res = await takeDeliveryRecommendList(this.requestData)
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
      const res = await addTakeDeliveryRecommend(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    freeze (row) {
      let tip
      row.status === 2 ? tip = '此操作将启用该拿货推荐商品，是否继续？' : tip = '此操作将禁用该拿货推荐商品，是否继续？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(row.status === 2 ? 1 : 2, row.takeDeliveryRecommendId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (status, takeDeliveryRecommendId) {
      const res = await takeDeliveryRecommendUp({ status: status, takeDeliveryRecommendIds: takeDeliveryRecommendId })
      if (res.result === '1') {
        this.getList()
      }
    },
    prev (index) {
      const srcs = this.list.map(item => {
        return this.baseUrl + item.mainPic
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    async getQueryList () {
      const res = await takeDeliveryGoodsList(this.requestData1)
      if (res.result === '0') {
        this.goodslist = res.datas.list
        this.total1 = res.datas.totalRow
      }
    },
    dblclick (row) {
      this.dialogFormVisible1 = false
      this.form.goodsId = row.goodsId
      this.goodsName = row.businessTitle
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
