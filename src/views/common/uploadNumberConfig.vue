<template>
  <div class="content">
    <div class="search-zu">
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="con">
      <div class="box-con">
        <span class="title">初级商家可上传商品数量：</span>
        <el-input style="width: 200px;margin-right: 15px;" v-model="detail.primaryNum" placeholder="初级商家可上传商品数量"></el-input>
      </div>
      <div class="box-con">
        <span class="title">中级商家可上传商品数量：</span>
        <el-input style="width: 200px;margin-right: 15px;" v-model="detail.intermediateNum" placeholder="中级商家可上传商品数量"></el-input>
      </div>
      <div class="box-con">
        <span class="title">高级商家可上传商品数量：</span>
        <el-input style="width: 200px;margin-right: 15px;" v-model="detail.seniorNum" placeholder="高级商家可上传商品数量"></el-input>
      </div>
      <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="edit">确定</el-button>
      <cb-loading :show="$store.getters.loading"/>
    </div>
  </div>
</template>

<script>
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { goodsNumConfigList, addGoodsNumConfig } from '@/api'
export default{
  data () {
    return {
      detail: {},
      total: 0,
      form: {},
      subLoad: false,
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.detail.primaryNum === '' || this.detail.intermediateNum === '' || this.detail.seniorNum === '' || this.subLoad)
    }
  },
  methods: {
    refresh () {
      this.getList()
    },
    search () {
      this.requestData.currentPage = 1
      this.getList()
    },
    handleSizeChange (val) { // 每页条数改变
      this.requestData.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.requestData.currentPage = val
      this.getList()
    },
    async getList () {
      const res = await goodsNumConfigList({})
      if (res.result === '0') {
        this.detail = res.datas
      }
    },
    async edit () {
      let res = await addGoodsNumConfig({ primaryNum: this.detail.primaryNum, intermediateNum: this.detail.intermediateNum, seniorNum: this.detail.seniorNum })
      if (res.result === '1') {
        this.getList()
      }
      this.subLoad = false
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
  .con {
    position: relative;
    height: calc(100% - 40px);
    .box-con {
      margin-bottom: 10px;
      .title {
        font-size: 14px;
        font-weight: bold;
        line-height: 50px;
      }
    }
  }
}
</style>
