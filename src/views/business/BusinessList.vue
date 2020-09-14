<template>
  <div class="content">
    <div class="search-zu">
      <!-- <div class="search-item">
        <span class="title">手机号：</span>
        <el-input v-model="requestData.phone" clearable @keyup.enter.native="search" placeholder="请输入商家手机号"></el-input>
      </div> -->
      <div class="search-item">
        <span class="title">商家昵称：</span>
        <el-input v-model="requestData.nickName" clearable @keyup.enter.native="search" placeholder="请输入商家昵称"></el-input>
      </div>
      <div class="search-item">
        <span class="title">商家等级：</span>
        <el-select clearable v-model="requestData.gradeType" placeholder="请选择商家等级">
          <el-option label="初级" :value="1"></el-option>
          <el-option label="中级" :value="2"></el-option>
          <el-option label="高级" :value="3"></el-option>
        </el-select>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <!-- <el-button size="mini" icon="el-icon-delete" type="danger" @click="freeze(3)">删除</el-button> -->
          <el-button size="mini" icon="el-icon-close" type="danger" @click="freeze(1)">禁用</el-button>
          <el-button size="mini" icon="el-icon-check" type="primary" @click="freeze(2)">启用</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column fixed="left" prop="businessId" width="60" label="商家ID"></el-table-column>
        <el-table-column fixed="left" prop="nickName" width="100"  label="商家昵称"></el-table-column>
        <el-table-column fixed="left" prop="phone" width="100" label="手机号"></el-table-column>
        <el-table-column prop="headPic" label="头像" width="90" >
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,1)" :src="baseUrl + scope.row.headPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="shopName" width="100"  label="店铺名称"></el-table-column>
        <el-table-column prop="gradeType" width="70" label="店铺等级">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.gradeType===1">初级</span>
            <span class="true" v-if="scope.row.gradeType===2">中级</span>
            <span class="true" v-if="scope.row.gradeType===3">高级</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopAddress" width="150"  label="淘宝或天猫店铺地址"></el-table-column>
        <el-table-column prop="code" width="100"  label="邀请码"></el-table-column>
        <el-table-column prop="consigneeName" width="100" label="收样人姓名"></el-table-column>
        <el-table-column prop="consigneeAddress" width="150" label="收样地址"></el-table-column>
        <el-table-column prop="babyDescription" width="80" label="宝贝描述"></el-table-column>
        <el-table-column prop="sellerServices" width="80" label="卖家服务"></el-table-column>
        <el-table-column prop="logisticsService" width="80" label="物流服务"></el-table-column>
        <el-table-column prop="reputationType" width="100" label="淘宝信誉等级">
          <template slot-scope="scope">
            <template v-if="scope.row.reputationType<6"><img v-for="(item, index) in scope.row.reputationType" :key="index" class="icon" :src="require('@/assets/img/level4.gif')" alt=""></template>
            <template v-if="scope.row.reputationType>5&&scope.row.reputationType<11"><img v-for="(item, index) in scope.row.reputationType-5" :key="index" class="icon" :src="require('@/assets/img/level5.gif')" alt=""></template>
            <template v-if="scope.row.reputationType>10&&scope.row.reputationType<16"><img v-for="(item, index) in scope.row.reputationType-10" :key="index" class="icon" :src="require('@/assets/img/level1.gif')" alt=""></template>
            <template v-if="scope.row.reputationType>15"><img v-for="(item, index) in scope.row.reputationType-15" :key="index" class="icon" :src="require('@/assets/img/level2.png')" alt=""></template>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" width="100" label="客服电话"></el-table-column>
        <el-table-column prop="customerWeChatPic" width="120" label="客服微信二维码">
          <template slot-scope="scope">
            <img style="width:80px" @click="prev(scope.$index,2)" :src="baseUrl + scope.row.customerWeChatPic" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="status" width="70" label="状态">
          <template slot-scope="scope">
            <span class="true" v-if="scope.row.status===1">启用</span>
            <span class="false" v-if="scope.row.status===2">禁用</span>
            <span class="false" v-if="scope.row.status===3">删除</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifySysUserName" width="100" label="操作人"></el-table-column>
        <el-table-column prop="modifyDate" width="150" label="操作时间"></el-table-column>
        <el-table-column prop="enabled" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="editBasic(scope.row)">基本信息</el-button> -->
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
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
      <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑商家':'新增商家'">
        <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
        <div slot="con">
          <el-form ref="form" @submit.native.prevent :model="form" label-width="130px">
            <el-form-item label="商家账号" prop="phone" v-show="!isedit">
              <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
              <el-input style="width: 300px" v-model="form.phone" placeholder="请输入手机号作为商家账号"></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password" v-show="!isedit">
              <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
              <el-input style="width: 300px" type="password" v-model="form.password" placeholder="请输入商家登录密码"></el-input>
            </el-form-item>
            <el-form-item label="商家等级" prop="gradeType">
              <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
              <el-select style="width: 300px" clearable v-model="form.gradeType" placeholder="请选择商家等级">
                <el-option label="初级" :value="1"></el-option>
                <el-option label="中级" :value="2"></el-option>
                <el-option label="高级" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商家淘宝信誉等级" prop="gradeType">
              <span style="position:absolute;left:-130px;color:#eb453c;">*</span>
              <el-select style="width: 300px" clearable v-model="form.reputationType" placeholder="请选择商家淘宝信誉等级">
                <el-option v-for="(item, index) in reputationTypes" :key="index" :label="item.name" :value="item.value">
                  <template v-if="item.value<6"><img v-for="(child, i) in item.num" :key="i" style="height: 17px;margin-right:5px;vertical-align:middle" :src="require('@/assets/img/level4.gif')" alt=""></template>
                  <template v-if="item.value>5&&item.value<11"><img v-for="(child, i) in item.num" :key="i" style="height: 17px;margin-right:5px;vertical-align:middle" :src="require('@/assets/img/level5.gif')" alt=""></template>
                  <template v-if="item.value>10&&item.value<16"><img v-for="(child, i) in item.num" :key="i" style="height: 17px;margin-right:5px;vertical-align:middle" :src="require('@/assets/img/level1.gif')" alt=""></template>
                  <template v-if="item.value>15"><img v-for="(child, i) in item.num" :key="i" style="height: 17px;margin-right:5px;vertical-align:middle" :src="require('@/assets/img/level2.png')" alt=""></template>
                </el-option>
              </el-select>
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
import { businessList, addBusiness, updateBusiness, updateStatus } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      requestData: { pageNum: 1, pageSize: 20, phone: '', nickName: '', gradeType: '' },
      reputationTypes: [{ value: 1, num: 1, name: '一星' }, { value: 2, num: 2, name: '二星' }, { value: 3, num: 3, name: '三星' }, { value: 4, num: 4, name: '四星' }, { value: 5, num: 5, name: '五星' }, { value: 6, num: 1, name: '一钻' }, { value: 7, num: 2, name: '二钻' }, { value: 8, num: 3, name: '三钻' }, { value: 9, num: 4, name: '四钻' }, { value: 10, num: 5, name: '五钻' }, { value: 11, num: 1, name: '一皇冠' }, { value: 12, num: 2, name: '二皇冠' }, { value: 13, num: 3, name: '三皇冠' }, { value: 14, num: 4, name: '四皇冠' }, { value: 15, num: 5, name: '五皇冠' }, { value: 16, num: 1, name: '一金冠' }, { value: 17, num: 2, name: '二金冠' }, { value: 18, num: 3, name: '三金冠' }, { value: 19, num: 4, name: '四金冠' }, { value: 20, num: 5, name: '五金冠' }],
      list: [],
      total: 0,
      form: { phone: '', password: '', gradeType: '', reputationType: '' },
      submitTitle: '确定',
      subLoad: false,
      baseUrl: baseUrl,
      isedit: false,
      choseA: []
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      if (this.isedit) {
        return (this.form.gradeType === '' || this.form.reputationType === '' || this.subLoad)
      } else {
        return (this.form.phone === '' || this.form.password === '' || this.form.gradeType === '' || this.form.reputationType === '' || this.subLoad)
      }
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
    refresh () {
      this.requestData = { pageNum: 1, pageSize: 20, phone: '', nickName: '', gradeType: '' }
      this.getList()
    },
    search () {
      this.requestData.pageNum = 1
      this.getList()
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.form.businessId = row.businessId
      this.form.phone = row.phone
      this.form.gradeType = row.gradeType
      this.form.reputationType = row.reputationType
      this.dialogFormVisible = true
      this.isedit = true
    },
    async getList () {
      const res = await businessList(this.requestData)
      if (res.result === '0') {
        this.list = res.datas.list
        this.total = res.datas.totalRow
      }
    },
    setReset () {
      this.form = { phone: '', password: '', gradeType: '', reputationType: '' }
    },
    submit () {
      if (this.cansubmit) return
      if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
        this.$message({ type: 'warning', message: '手机号码不正确' })
        return
      }
      this.subLoad = true
      this.submitTitle = '提交中...'
      setTimeout(() => {
        this.create()
      }, 700)
    },
    async create () {
      let res
      if (this.isedit) {
        res = await updateBusiness({ businessId: this.form.businessId, gradeType: this.form.gradeType, reputationType: this.form.reputationType })
      } else {
        res = await addBusiness(this.form)
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
        this.$message({ type: 'warning', message: '请先选择要操作的商家' })
        return
      }
      const ids = this.choseA.map(item => {
        return item.businessId
      })
      let tip
      row === 2 ? tip = '此操作将启用选中的商家，是否继续？' : row === 3 ? tip = '此操作将删除选中的商家，是否继续？' : tip = '此操作将禁用选中的商家，是否继续？'
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
      const res = await updateStatus({ status: status, businessIds: ids.toString() })
      if (res.result === '1') {
        this.getList()
      }
    },
    prev (index, type) {
      const srcs = this.list.map(item => {
        if (type === 1) {
          return this.baseUrl + item.headPic
        } else {
          return this.baseUrl + item.customerWeChatPic
        }
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
    height: calc(100% - 93px);
    img.icon {
      height: 17px;
    }
  }
}
.basicInfo {
  padding: 0 20px 20px;
  .header {
    position: absolute;
    width: 310px;
    top: 20px;
    left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
<style lang="less">
  .el-drawer__header {
    margin-bottom: 10px;
  }
</style>
