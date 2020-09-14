<template>
  <div class="content">
    <div class="search-zu">
      <div class="search-item">
        <span class="title">红人id：</span>
        <el-input v-model="requestData.sensationId" clearable @keyup.enter.native="search" placeholder="请输入红人id"></el-input>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="预估收入" name="1"></el-tab-pane>
      <el-tab-pane label="已入账" name="2"></el-tab-pane>
      <el-tab-pane label="违规处罚" name="3"></el-tab-pane>
    </el-tabs>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column prop="sensationWithdrawInfoId" fixed label="提现id"></el-table-column>
        <el-table-column prop="sensationId" fixed label="红人id"></el-table-column>
        <el-table-column prop="phone" fixed label="手机号"></el-table-column>
        <el-table-column prop="nickName" fixed label="昵称"></el-table-column>
        <el-table-column prop="headPic" label="头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="goodsId" label="商品id"></el-table-column>
        <el-table-column prop="businessTitle" label="商品标题"></el-table-column>
        <el-table-column prop="commissionPrice" label="佣金"></el-table-column>
        <el-table-column prop="incomeDate" label="收入时间"></el-table-column>
        <el-table-column prop="status" label="收入类型">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">即将到账</span>
            <span class="false" v-if="scope.row.status===2">已到账</span>
            <span class="false" v-if="scope.row.status===3">无效订单</span>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestData.pageNum"
        :page-sizes="[20, 25, 30, 35]"
        :page-size="requestData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import cbLoading from '@c/loading'
import { sensationIncomeList } from '@/api'
import { baseUrl } from '@/utils/commom'
export default {
  data () {
    return {
      requestData: { pageNum: 1, pageSize: 20, sensationId: '', status: '' },
      list: [],
      total: 0,
      status: '0',
      baseUrl: baseUrl
    }
  },
  components: {
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.refuseContent === '' || this.subLoad)
    }
  },
  methods: {
    handleSizeChange (val) {
      this.requestData.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.requestData.pageNum = val
      this.getList()
    },
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    refresh () {
      this.status = '0'
      this.requestData = { pageNum: 1, pageSize: 20, sensationId: '', status: '' }
      this.getList()
    },
    async getList () {
      const res = await sensationIncomeList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
      }
    },
    handleClick () {
      if (this.status === '0') {
        this.requestData.status = ''
      } else {
        this.requestData.status = this.status
      }
      this.requestData.pageNum = 1
      this.getList()
    }
  },
  created () {
    if (this.$route.query.id) this.requestData.sensationId = this.$route.query.id
    this.getList()
  },
  watch: {
    status: function (val) {
      val === '0' ? this.requestData.checkStatus = '' : this.requestData.checkStatus = val
      this.requestData.pageNum = 1
      this.getList()
    }
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
    height: calc(100% - 142px);
  }
}
</style>
