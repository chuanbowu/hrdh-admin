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
    <el-tabs v-model="status">
      <el-tab-pane v-for="(item, index) in typeA" :key="index" :label="item.name" :name="String(item.type)"></el-tab-pane>
    </el-tabs>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sensationId" width="55" label="红人id"></el-table-column>
        <el-table-column prop="phone" width="100" label="手机号"></el-table-column>
        <el-table-column prop="nickName" label="昵称"></el-table-column>
        <el-table-column prop="headPic" label="头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sex" label="性别" width="90" >
          <template slot-scope="scope">
            <span v-if="scope.row.sex===1">男</span>
            <span v-if="scope.row.sex===2">女</span>
            <span v-if="scope.row.sex===3">无</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column prop="weChat" label="微信"></el-table-column> -->
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
        <!-- <el-table-column prop="balancePrice" label="余额"></el-table-column> -->
        <!-- <el-table-column prop="customerWeChatPic" width="120" label="客服微信二维码">
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="baseUrl + scope.row.customerWeChatPic" alt="">
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="consigneeName" width="100" label="收样人姓名"></el-table-column>
        <el-table-column prop="consigneeAddress" width="150" label="收样地址"></el-table-column> -->
        <el-table-column prop="authenticationLink" label="认证链接"></el-table-column>
        <el-table-column prop="authenticationPic" width="120" label="认证图片">
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,3)" :src="baseUrl + scope.row.authenticationPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="followersNum" width="100" label="粉丝数量"></el-table-column>
        <el-table-column prop="totalLikedNum" width="100" label="获赞总量"></el-table-column>
        <el-table-column prop="singleHighestNum" width="100" label="单条最高获赞"></el-table-column>
        <el-table-column prop="contentType" label="内容分类" width="90" >
          <template slot-scope="scope">
            <span v-if="scope.row.contentType">{{classify1[scope.row.contentType-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followersSpreadType" label="粉丝分布" width="90" >
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.followersSpreadType">{{this.classify3[scope.row.followersSpreadType-1].name}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="extensionType" label="推广方式" width="90" >
          <template slot-scope="scope">
            <span v-if="scope.row.extensionType.indexOf('1')>-1">橱窗广告</span>
            <span v-if="scope.row.extensionType.indexOf('2')>-1">、原创视频+发布</span>
            <span v-if="scope.row.extensionType.indexOf('3')>-1">、CPS分成</span>
            <span v-if="scope.row.extensionType.indexOf('4')>-1">、直播带货</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column v-if="status!=='1'" prop="checkSysUserName" label="审核人"></el-table-column>
        <el-table-column v-if="status==='2'||status==='0'" prop="refuseContent" width="150" label="审核拒绝原因"></el-table-column>
        <el-table-column v-if="status!=='1'" prop="checkDate" label="审核时间"></el-table-column>
        <el-table-column prop="sensationSurvey" fixed="right" label="红人概况">
          <template slot-scope="scope">
            <el-button size="mini"  @click="opengoodsDetail1(scope.row.sensationSurvey)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="status==='0'||status==='1'" prop="enabled" fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="examine(scope.row, 2)">审核通过</el-button>
            <el-button size="mini" type="primary" @click="examine(scope.row)">审核失败</el-button>
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
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" title="红人认证审核">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" label-width="100px">
          <el-form-item label="审核备注" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" rows="5" type="textarea" v-model="refuseContent" placeholder="请输入审核备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
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
import { sensationCheckList, updateSensationCheck } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      dialogFormVisible4: false,
      requestData: { pageNum: 1, pageSize: 20, checkStatus: '1', sensationId: '' },
      list: [],
      total: 0,
      baseUrl: baseUrl,
      typeA: [{ type: 1, name: '审核中' }, { type: 2, name: '审核拒绝' }, { type: 3, name: '审核通过' }],
      classify1: [{ type: 1, name: '搞笑娱乐' }, { type: 2, name: '萌宠动漫' }, { type: 3, name: '情感励志' }, { type: 4, name: '教育知识' }, { type: 5, name: '母婴玩具' }, { type: 6, name: '颜值才艺' }, { type: 7, name: '健康养生' }, { type: 8, name: '游戏电竞' }, { type: 9, name: '汽车周边' }, { type: 10, name: '科技生活' }, { type: 11, name: '新闻媒体' }, { type: 12, name: '美妆护肤' }, { type: 13, name: '旅游攻略' }, { type: 14, name: '美食攻略' }, { type: 15, name: '教程技术' }, { type: 16, name: '综合种草' }, { type: 17, name: '服装穿搭' }, { type: 18, name: '家居百货' }, { type: 19, name: '剧情故事' }, { type: 20, name: '音乐' }, { type: 21, name: '时尚' }, { type: 22, name: '创意' }],
      classify2: [{ type: 1, name: '10W以内' }, { type: 2, name: '10W-30W' }, { type: 3, name: '30W-100W' }, { type: 4, name: '100W-300W' }, { type: 5, name: '300W-500W' }, { type: 6, name: '500W以上' }],
      classify3: [{ type: 1, name: '男女平衡' }, { type: 2, name: '男粉较多' }, { type: 3, name: '女粉较多' }],
      classify4: [{ type: 1, name: '10W以内' }, { type: 2, name: '10W-30W' }, { type: 3, name: '30W-100W' }, { type: 4, name: '100W-300W' }, { type: 5, name: '300W-500W' }, { type: 6, name: '500W以上' }],
      classify5: [{ type: 110000, name: '北京市' }, { type: 120000, name: '天津市' }, { type: 130000, name: '河北省' }, { type: 140000, name: '山西省' }, { type: 210000, name: '辽宁省' }, { type: 220000, name: '吉林省' }, { type: 230000, name: '黑龙江省' }, { type: 310000, name: '上海市' }, { type: 320000, name: '江苏省' }, { type: 330000, name: '浙江省' }, { type: 340000, name: '安徽省' }, { type: 350000, name: '福建省' }, { type: 360000, name: '江西省' }, { type: 370000, name: '山东省' }, { type: 410000, name: '河南省' }, { type: 420000, name: '湖北省' }, { type: 430000, name: '湖南省' }, { type: 440000, name: '广东省' }, { type: 450000, name: '广西壮族自治区' }, { type: 460000, name: '海南省' }, { type: 500000, name: '重庆市' }, { type: 510000, name: '四川省' }, { type: 520000, name: '贵州省' }, { type: 530000, name: '云南省' }, { type: 540000, name: '西藏自治区' }, { type: 610000, name: '陕西省' }, { type: 620000, name: '青海省' }, { type: 630000, name: '宁夏回族自治区' }, { type: 650000, name: '新疆维吾尔族自治区' }, { type: 710000, name: '台湾省' }, { type: 810000, name: '香港特别行政区' }, { type: 31, name: '海外' }, { type: 620000, name: '甘肃省' }, { type: 150000, name: '内蒙古自治区' }],
      choseA: [],
      status: '1',
      refuseContent: '',
      subLoad: false,
      submitTitle: '确定',
      title: '',
      html1: ''
    }
  },
  components: {
    vDialog,
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
    handleSelectionChange (val) {
      this.choseA = val
    },
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    refresh () {
      this.status = '1'
      this.requestData = { pageNum: 1, pageSize: 20, checkStatus: '1', sensationId: '' }
      if (this.$route.query.id) this.requestData.sensationId = this.$route.query.id
      this.getList()
    },
    async getList () {
      const res = await sensationCheckList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      }
    },
    async examine (row, type) {
      this.row = row
      if (type) {
        this.$confirm('该操作将审核通过红人认证申请,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await updateSensationCheck({ sensationCheckId: this.row.sensationCheckId, checkStatus: 2 })
          if (res.result === '1') {
            this.getList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作取消'
          })
        })
      } else {
        this.dialogFormVisible = true
      }
    },
    submit () {
      if (this.cansubmit) return
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create()
      }, 700)
    },
    create () {
      this.$confirm('该操作将驳回红人认证申请,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await updateSensationCheck({ sensationCheckId: this.row.sensationCheckId, checkStatus: 1, refuseContent: this.refuseContent })
        if (res.result === '1') {
          this.dialogFormVisible = false
          this.getList()
        }
        this.subLoad = false
        this.submitTitle = '确定'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
        this.subLoad = false
        this.submitTitle = '确定'
      })
    },
    prev (index, type) {
      const srcs = this.list.map(item => {
        if (type === 1) {
          return this.baseUrl + item.headPic
        } else if (type === 2) {
          return this.baseUrl + item.customerWeChatPic
        } else {
          return this.baseUrl + item.authenticationPic
        }
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    opengoodsDetail1 (row) {
      row = row.replace(/\n/g, '<br>')
      this.title = '红人概况'
      this.dialogFormVisible4 = true
      this.html1 = row
    }
  },
  created () {
    if (this.$route.query.id) this.requestData.sensationId = this.$route.query.id
    this.getList()
  },
  watch: {
    status: function (val) {
      this.requestData.checkStatus = val
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
