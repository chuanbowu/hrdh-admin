<template>
  <div class="content">
    <div class="search-zu">
      <div class="search-item">
        <span class="title">商家：</span>
        <el-select v-model="requestData.businessId" filterable placeholder="请选择商家">
          <el-option v-for="(item, index) in goodslist" :key="index" :label="item.nickName" :value="item.businessId"></el-option>
        </el-select>
      </div>
      <div class="search-item">
        <span class="title">商品名称：</span>
        <el-input v-model="requestData.businessTitle" clearable @keyup.enter.native="search" placeholder="请输入商品名称"></el-input>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <el-tabs v-model="requestData.typeId">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane v-for="(item, index) in goodsTypeConfigList" :key="index" :label="item.typeName" :name="String(item.goodsTypeConfigId)"></el-tab-pane>
    </el-tabs>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini">
        <el-table-column fixed="left" prop="goodsId" width="60" label="商品ID"></el-table-column>
        <el-table-column fixed="left" prop="businessId" width="60" label="商家ID"></el-table-column>
        <el-table-column prop="shopName" width="100"  label="商家店铺名称"></el-table-column>
        <el-table-column prop="phone" width="100" label="商家手机号"></el-table-column>
        <el-table-column prop="headPic" label="店铺logo" width="100" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="businessTitle" min-width="200" show-overflow-tooltip label="商品名称"></el-table-column>
        <el-table-column prop="mainPic" label="商品主图" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="scope.row.mainPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="typeName" width="100"  label="商品分类"></el-table-column>
        <el-table-column prop="consigneeAddress" width="100"  label="收样地址"></el-table-column>
        <el-table-column prop="couponAfterPrice" width="100" label="券后价格"></el-table-column>
        <el-table-column prop="couponPrice" width="150" label="优惠券金额"></el-table-column>
        <el-table-column prop="commissionPrice" width="80" label="佣金"></el-table-column>
        <el-table-column prop="proportion" width="80" label="比例"></el-table-column>
        <el-table-column prop="surplusNum" width="80" label="样品剩余数量"></el-table-column>
        <el-table-column prop="conditionNum" width="100" label="取样条件数量"></el-table-column>
        <!-- <el-table-column prop="depositPrice" width="100" label="押金金额"></el-table-column> -->
        <el-table-column prop="itemUrl" width="250" label="宝贝链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.itemUrl)">{{scope.row.itemUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="promotionLink" width="250" label="推广链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.promotionLink)">{{scope.row.promotionLink}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="couponShareUrl" width="250" label="宝贝+券二合一推广链接">
          <template slot-scope="scope">
            <span class="outurl" @click="out(scope.row.couponShareUrl)">{{scope.row.couponShareUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" width="70" label="状态">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">启用</span>
            <span class="false" v-if="scope.row.status===2">禁用</span>
            <span class="false" v-if="scope.row.status===3">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityStartDate" width="100" label="活动开始时间"></el-table-column>
        <el-table-column prop="activityEndDate" width="100" label="活动结束时间"></el-table-column>
        <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
        <el-table-column fixed="right" prop="shotRequirement" width="80"  label="拍摄要求">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail1(scope.row.shotRequirement, 1)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="ruleDescription" width="80"  label="规则说明">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail1(scope.row.ruleDescription, 2)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="details" width="80"  label="商品详情">
          <template slot-scope="scope">
            <el-button size="mini" @click="opengoodsDetail(scope.row)" type="primary">查看</el-button>
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
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible3" title="商品图文详情预览">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible3=false"></i>
      <div slot="con">
        <div style="min-height: 300px" class="html" v-html="html"></div>
      </div>
    </v-dialog>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible4" :title="title">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible4=false"></i>
      <div slot="con">
        <div style="min-height: 300px; line-height: 25px" class="html" v-html="html1"></div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { baseUrl } from '@/utils/commom'
import { businessList, commissionGoodsList, goodsTypeConfigList } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      title: '',
      requestData: { pageNum: 1, pageSize: 20, businessId: '', businessTitle: '', typeId: '' },
      list: [],
      total: 0,
      subLoad: false,
      baseUrl: baseUrl,
      goodslist: [],
      html: '',
      html1: '',
      goodsTypeConfigList: []
    }
  },
  components: {
    cbLoading,
    vDialog
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
      this.requestData = { pageNum: 1, pageSize: 20, businessId: '', businessTitle: '', typeId: 'all' }
      this.getList()
    },
    async getList () {
      const res = await commissionGoodsList({ pageNum: 1, pageSize: 20, businessId: this.requestData.businessId, businessTitle: this.requestData.businessTitle, typeId: this.requestData.typeId === 'all' ? '' : this.requestData.typeId })
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
      }
    },
    async businessList () {
      const res = await businessList({ pageSize: 1000, pageNum: 1 })
      if (res.result === '0') {
        this.goodslist = res.datas.list
      }
    },
    prev (index, type) {
      const srcs = this.list.map(item => {
        if (type === 1) {
          return this.baseUrl + item.headPic
        } else {
          return item.mainPic
        }
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    out (url) {
      window.open(url, '_blank')
    },
    opengoodsDetail (row) {
      this.dialogFormVisible3 = true
      this.html = row.details
    },
    opengoodsDetail1 (row, type) {
      row = row.replace(/\n/g, '<br>')
      this.title = type === 1 ? '拍摄要求' : '规则说明'
      this.dialogFormVisible4 = true
      this.html1 = row
    },
    async _goodsTypeConfigList () {
      const res = await goodsTypeConfigList({})
      if (res.result === '0') {
        this.goodsTypeConfigList = res.datas.list
      }
    }
  },
  created () {
    this.requestData.typeId = 'all'
    this.businessList()
    this.getList()
    this._goodsTypeConfigList()
  },
  watch: {
    'requestData.typeId': function (val) {
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
    .outurl {
      cursor: pointer;
      &:hover {
        color: #eb453c;
      }
    }
  }
}
</style>

<style>
  .html img{
    width: 100%;
    display: block;
    margin: 5px auto;
  }
  .html {
    padding-bottom: 5px;
    font-size: 12px;
  }
</style>
