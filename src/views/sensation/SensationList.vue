<template>
  <div class="content">
    <div class="search-zu">
      <div class="search-item">
        <span class="title">红人昵称：</span>
        <el-input v-model="requestData.nickName" clearable @keyup.enter.native="search" placeholder="请输入红人昵称"></el-input>
      </div>
      <div class="search-item">
        <span class="title">内容分类：</span>
        <el-select v-model="requestData.contentType" filterable placeholder="请选择内容分类">
          <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify1" :key="index"></el-option>
        </el-select>
      </div>
      <el-button class="extend-btn" :class="{active: extend}" size="mini" type="primary" icon="el-icon-set-up" @click.stop="extend=!extend">扩展查询</el-button>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="freeze(3)">删除</el-button>
          <el-button size="mini" icon="el-icon-close" type="danger"  @click="freeze(1)">禁用</el-button>
          <el-button size="mini" icon="el-icon-check" type="primary" @click="freeze(2)">启用</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" v-if="requestData.sensationType===2" @click="add">新增找红人</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
      <div class="extend-con" @click.stop="extend=true" :class="{active: extend}">
        <div class="search-zu">
          <div class="search-item">
            <span class="title">粉丝数量：</span>
            <el-select v-model="requestData.followersType" filterable placeholder="请选择粉丝数量">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify2" :key="index"></el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span class="title">粉丝分布：</span>
            <el-select v-model="requestData.followersSpreadType" filterable placeholder="请选择粉丝分布">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify3" :key="index"></el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span class="title">获赞总量：</span>
            <el-select v-model="requestData.totalLikedType" filterable placeholder="请选择获赞总量">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify4" :key="index"></el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span class="title">省份：</span>
            <el-select v-model="requestData.provinceType" filterable placeholder="请选择省份">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify5" :key="index"></el-option>
            </el-select>
          </div>
          <el-button class="extend-btn" size="mini" type="primary" icon="el-icon-search" @click.stop="search">搜索</el-button>
          <el-button class="extend-btn" size="mini" @click.stop="refresh">重置</el-button>
          <el-button class="extend-btn" size="mini" @click.stop="extend=!extend">收起</el-button>
        </div>
      </div>
    </div>
    <el-tabs v-model="status" @tab-click="handleClick">
      <el-tab-pane label="待认证" name="1"></el-tab-pane>
      <el-tab-pane label="红人" name="2"></el-tab-pane>
      <el-tab-pane label="找红人" name="3"></el-tab-pane>
    </el-tabs>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" fixed width="55"></el-table-column>
        <el-table-column prop="sensationId" fixed label="红人id"></el-table-column>
        <el-table-column prop="phone" width="100" fixed label="手机号"></el-table-column>
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
        <el-table-column prop="qq" width="100" label="QQ"></el-table-column>
        <el-table-column prop="weChat" width="100" label="微信"></el-table-column>
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
        <el-table-column prop="balancePrice" label="余额"></el-table-column>
        <el-table-column prop="estimatedRevenuePrice" width="120" label="预估收入余额"></el-table-column>
        <!-- <el-table-column v-if="status!=='1'" prop="customerWeChatPic" width="120" label="客服微信二维码">
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="baseUrl + scope.row.customerWeChatPic" alt="">
          </template>
        </el-table-column> -->
        <el-table-column prop="consigneeName" width="100" label="收样人姓名"></el-table-column>
        <el-table-column prop="consigneeAddress" width="150" label="收样地址"></el-table-column>
        <el-table-column prop="authenticationLink" label="认证链接"></el-table-column>
        <el-table-column prop="authenticationPic" width="120" label="认证图片">
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,3)" :src="baseUrl + scope.row.authenticationPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="followersNum" width="100" label="粉丝数量">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.followersNum">{{this.classify2[scope.row.followersNum-1].name}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="totalLikedNum" width="100" label="获赞总量">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.totalLikedNum">{{this.classify2[scope.row.totalLikedNum-1].name}}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="singleHighestNum" width="100" label="单条最高获赞"></el-table-column>
        <el-table-column prop="contentType" label="内容分类" width="90" >
          <template slot-scope="scope">
            <span v-if="scope.row.contentType">{{classify1[scope.row.contentType-1].name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="followersSpreadType" label="粉丝分布" width="90" >
          <template slot-scope="scope">
            <span v-if="scope.row.followersSpreadType">{{classify3[scope.row.followersSpreadType-1].name}}</span>
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
        <el-table-column prop="status" label="认证状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">未完善个人资料</span>
            <span v-if="scope.row.status===2">未认证</span>
            <span v-if="scope.row.status===3">认证中</span>
            <span v-if="scope.row.status===4">认证拒绝</span>
            <span v-if="scope.row.status===5">已认证</span>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间"></el-table-column>
        <el-table-column prop="sensationSurvey" fixed="right" label="红人概况">
          <template slot-scope="scope">
            <el-button size="mini"  @click="opengoodsDetail1(scope.row.sensationSurvey)" type="primary">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" fixed="right" label="操作" width="90" v-if="requestData.sensationType===2 || requestData.status==='1'">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="requestData.sensationType===2" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" v-if="requestData.status==='1'" @click="$router.push('/SensationCheckList?id='+scope.row.sensationId)">去审核</el-button>
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
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑找红人':'新增找红人'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="100px">
          <el-form-item label="手机号" prop="phone">
            <span style="position:absolute;left:-62px;color:#eb453c;">*</span>
            <el-input style="width: 370px" v-model="form.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <span style="position:absolute;left:-50px;color:#eb453c;">*</span>
            <el-input style="width: 370px" v-model="form.nickName" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="headPic">
            <span style="position:absolute;left:-50px;color:#eb453c;">*</span>
            <my-upload :option="option" @updelete="updelete" @upfiles="upfiles"/>
          </el-form-item>
          <el-form-item label="性别" prop="area">
            <span style="position:absolute;left:-50x;color:#eb453c;">*</span>
            <el-select style="width: 370px" v-model="form.sex" filterable placeholder="请选择性别">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
              <el-option label="无" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地区" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-cascader style="width: 370px" v-model="area" @expand-change="handleChange" :options="options" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="推广类目" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-select style="width: 370px" v-model="form.extensionStatus" filterable placeholder="请选择推广类目">
              <el-option label="抖音" :value="1"></el-option>
              <el-option label="快手" :value="2"></el-option>
              <el-option label="小红书" :value="3"></el-option>
              <el-option label="淘宝" :value="4"></el-option>
              <el-option label="今日头条" :value="5"></el-option>
              <el-option label="微博" :value="6"></el-option>
              <el-option label="B站" :value="7"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="粉丝数量" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" type="number" v-model="form.followersNum" placeholder="请输入粉丝数量"></el-input>
          </el-form-item>
          <el-form-item label="获赞总量" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" type="number" v-model="form.totalLikedNum" placeholder="请输入获赞总量"></el-input>
          </el-form-item>
          <el-form-item label="单条最高获赞" prop="area">
            <span style="position:absolute;left:-102px;color:#eb453c;">*</span>
            <el-input style="width: 370px" type="number" v-model="form.singleHighestNum" placeholder="请输入单条最高获赞"></el-input>
          </el-form-item>
          <el-form-item label="内容分类" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-select style="width: 370px" v-model="form.contentType" placeholder="请选择内容分类">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify1" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="粉丝分布" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-select style="width: 370px" v-model="form.followersSpreadType" placeholder="请选择粉丝分布">
              <el-option :label="item.name" :value="item.type" v-for="(item, index) in classify3" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推广方式" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-select style="width: 370px" multiple v-model="form.extensionType" placeholder="请选择推广方式">
              <el-option label="橱窗广告" :value="1"></el-option>
              <el-option label="原创视频+发布" :value="2"></el-option>
              <el-option label="CPS分成" :value="3"></el-option>
              <el-option label="直播带货" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="红人概况" prop="area">
            <span style="position:absolute;left:-77px;color:#eb453c;">*</span>
            <el-input style="width: 370px" rows="5" type="textarea" v-model="form.sensationSurvey" placeholder="请输入红人概况"></el-input>
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
import MyUpload from '@/components/Upload'
import { sensationList, addSensation, updateSensation, sensationupdateStatus, provinceList, cityList, areaList } from '@/api'
export default {
  data () {
    return {
      extend: false,
      dialogFormVisible: false,
      dialogFormVisible4: false,
      requestData: { pageNum: 1, pageSize: 20, sensationType: '', nickName: '', status: '1', contentType: '', followersSpreadType: '', followersType: '', totalLikedType: '', provinceType: '' },
      list: [],
      total: 0,
      form: { phone: '', nickName: '', headPic: '', sex: '', provinceId: '', cityId: '', areaId: '', extensionStatus: '', followersNum: '', totalLikedNum: '', singleHighestNum: '', contentType: '', followersSpreadType: '', extensionType: [], sensationSurvey: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false,
      option: {
        type: 1,
        file: [],
        count: 1
      },
      typeA: [{ type: 0, name: '全部' }, { type: 1, name: '未完善资料' }, { type: 2, name: '未认证' }, { type: 3, name: '认证中' }, { type: 4, name: '认证失败' }, { type: 5, name: '已认证' }],
      classify1: [{ type: 1, name: '搞笑娱乐' }, { type: 2, name: '萌宠动漫' }, { type: 3, name: '情感励志' }, { type: 4, name: '教育知识' }, { type: 5, name: '母婴玩具' }, { type: 6, name: '颜值才艺' }, { type: 7, name: '健康养生' }, { type: 8, name: '游戏电竞' }, { type: 9, name: '汽车周边' }, { type: 10, name: '科技生活' }, { type: 11, name: '新闻媒体' }, { type: 12, name: '美妆护肤' }, { type: 13, name: '旅游攻略' }, { type: 14, name: '美食攻略' }, { type: 15, name: '教程技术' }, { type: 16, name: '综合种草' }, { type: 17, name: '服装穿搭' }, { type: 18, name: '家居百货' }, { type: 19, name: '剧情故事' }, { type: 20, name: '音乐' }, { type: 21, name: '时尚' }, { type: 22, name: '创意' }],
      classify2: [{ type: 1, name: '10W以内' }, { type: 2, name: '10W-30W' }, { type: 3, name: '30W-100W' }, { type: 4, name: '100W-300W' }, { type: 5, name: '300W-500W' }, { type: 6, name: '500W以上' }],
      classify3: [{ type: 1, name: '男女平衡' }, { type: 2, name: '男粉较多' }, { type: 3, name: '女粉较多' }],
      classify4: [{ type: 1, name: '10W以内' }, { type: 2, name: '10W-30W' }, { type: 3, name: '30W-100W' }, { type: 4, name: '100W-300W' }, { type: 5, name: '300W-500W' }, { type: 6, name: '500W以上' }],
      classify5: [{ type: 110000, name: '北京市' }, { type: 120000, name: '天津市' }, { type: 130000, name: '河北省' }, { type: 140000, name: '山西省' }, { type: 210000, name: '辽宁省' }, { type: 220000, name: '吉林省' }, { type: 230000, name: '黑龙江省' }, { type: 310000, name: '上海市' }, { type: 320000, name: '江苏省' }, { type: 330000, name: '浙江省' }, { type: 340000, name: '安徽省' }, { type: 350000, name: '福建省' }, { type: 360000, name: '江西省' }, { type: 370000, name: '山东省' }, { type: 410000, name: '河南省' }, { type: 420000, name: '湖北省' }, { type: 430000, name: '湖南省' }, { type: 440000, name: '广东省' }, { type: 450000, name: '广西壮族自治区' }, { type: 460000, name: '海南省' }, { type: 500000, name: '重庆市' }, { type: 510000, name: '四川省' }, { type: 520000, name: '贵州省' }, { type: 530000, name: '云南省' }, { type: 540000, name: '西藏自治区' }, { type: 610000, name: '陕西省' }, { type: 620000, name: '青海省' }, { type: 630000, name: '宁夏回族自治区' }, { type: 650000, name: '新疆维吾尔族自治区' }, { type: 710000, name: '台湾省' }, { type: 810000, name: '香港特别行政区' }, { type: 31, name: '海外' }, { type: 620000, name: '甘肃省' }, { type: 150000, name: '内蒙古自治区' }],
      props: {
        value: 'cid',
        label: 'name'
      },
      options: [],
      area: '',
      choseA: [],
      status: '1',
      title: '',
      html1: ''
    }
  },
  components: {
    vDialog,
    cbLoading,
    MyUpload
  },
  mounted () {
    const that = this
    document.onclick = function () {
      that.extend = false
    }
  },
  computed: {
    cansubmit: function () {
      return (this.form.phone === '' || this.form.nickName === '' || this.form.headPic === '' || this.form.sex === '' || this.area.length < 3 || this.form.extensionStatus === '' || this.form.followersNum === '' || this.form.totalLikedNum === '' || this.form.singleHighestNum === '' || this.form.contentType === '' || this.form.followersSpreadType === '' || this.form.extensionType.length === 0 || this.form.sensationSurvey === '' || this.subLoad)
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
      this.status = '0'
      this.requestData.pageNum = 1
      this.requestData.pageSize = 20
      this.requestData.nickName = ''
      this.requestData.contentType = ''
      this.requestData.followersType = ''
      this.requestData.totalLikedType = ''
      this.requestData.provinceType = ''
      this.requestData.sensationType = ''
      if (this.status === 1) this.requestData.status = '1'
      this.getList()
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      const that = this
      this.option.file = []
      this.form.sensationId = row.sensationId
      this.form.phone = row.phone
      this.form.nickName = row.nickName
      this.form.headPic = row.headPic
      this.option.file.push(row.headPic)
      this.form.sex = row.sex
      this.form.provinceId = row.provinceId
      this.getcityList(String(row.provinceId), function () {
        that.getareaList([String(row.provinceId), String(row.cityId)])
      })
      this.form.cityId = row.cityId
      this.form.areaId = row.areaId
      this.area = [String(this.form.provinceId), String(this.form.cityId), String(this.form.areaId)]
      this.form.extensionStatus = row.extensionStatus
      this.form.followersNum = row.followersNum
      this.form.totalLikedNum = row.totalLikedNum
      this.form.singleHighestNum = row.singleHighestNum
      this.form.contentType = row.contentType
      this.form.followersSpreadType = row.followersSpreadType
      this.form.extensionType = row.extensionType.split(',').map(item => {
        item = Number(item)
        return item
      })
      this.form.sensationSurvey = row.sensationSurvey
      this.dialogFormVisible = true
      this.isedit = true
    },
    async getList () {
      const res = await sensationList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
        this.$nextTick(() => {
          this.$refs.table.doLayout()
        })
      }
    },
    setReset () {
      this.area = []
      this.option.file = []
      this.form = { phone: '', nickName: '', headPic: '', sex: '', provinceId: '', cityId: '', areaId: '', extensionStatus: '', followersNum: '', totalLikedNum: '', singleHighestNum: '', contentType: '', followersSpreadType: '', extensionType: [], sensationSurvey: '' }
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
      this.form.provinceId = this.area[0]
      this.form.cityId = this.area[1]
      this.form.areaId = this.area[2]
      this.form.extensionType = this.form.extensionType.sort().toString()
      let res
      if (this.isedit) {
        res = await updateSensation(this.form)
      } else {
        res = await addSensation(this.form)
      }
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    freeze (row) {
      if (this.choseA.length === 0) {
        this.$message({ type: 'warning', message: '请先选择要操作的红人' })
        return
      }
      const ids = this.choseA.map(item => {
        return item.sensationId
      })
      let tip
      row === 2 ? tip = '此操作将启用选中的红人，是否继续？' : row === 3 ? tip = '此操作将删除选中的红人，是否继续？' : tip = '此操作将禁用选中的红人，是否继续？'
      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._freeze(row === 2 ? 1 : row === 1 ? 2 : 3, ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        })
      })
    },
    async _freeze (status, ids) {
      const res = await sensationupdateStatus({ status: status, sensationIds: ids.toString() })
      if (res.result === '1') {
        this.getList()
      }
    },
    upfiles (file) {
      this.form.headPic = file.files[0]
    },
    updelete (file) {
      this.form.headPic = ''
    },
    async getprovinceList () {
      const res = await provinceList({})
      if (res.result === '0') {
        this.options = res.datas.list.map(item => {
          item.children = []
          return item
        })
      }
    },
    async getcityList (cid, cb) {
      const res = await cityList({ cid: cid })
      if (res.result === '0') {
        this.options.map(item => {
          if (item.cid === cid) {
            item.children = res.datas.list.map(child => {
              child.children = []
              return child
            })
            cb && cb()
          }
        })
      }
    },
    async getareaList (cid) {
      const res = await areaList({ cid: cid[1] })
      if (res.result === '0') {
        this.options.map(item => {
          if (item.cid === cid[0]) {
            item.children.map(child => {
              if (child.cid === cid[1]) child.children = res.datas.list
            })
          }
        })
      }
    },
    handleChange (val) {
      if (val.length === 1) {
        this.getcityList(val[0])
      } else if (val.length === 2) {
        this.getareaList(val)
      }
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
    handleClick () {
      if (this.status === '1') {
        this.requestData.status = '1'
        this.requestData.sensationType = ''
      } else if (this.status === '2') {
        this.requestData.status = ''
        this.requestData.sensationType = 1
      } else {
        this.requestData.status = ''
        this.requestData.sensationType = 2
      }
      this.requestData.pageNum = 1
      this.getList()
    },
    opengoodsDetail1 (row) {
      row = row.replace(/\n/g, '<br>')
      this.title = '红人概况'
      this.dialogFormVisible4 = true
      this.html1 = row
    }
  },
  created () {
    this.getprovinceList()
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
