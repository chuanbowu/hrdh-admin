<template>
  <div class="content">
    <div class="search-zu">
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" icon="el-icon-delete" type="danger" @click="freeze(3)">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="getList">刷新</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="list" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="goodsTypeConfigId" label="分类ID"></el-table-column>
        <el-table-column prop="sort" label="排序号"></el-table-column>
        <el-table-column prop="typeName" label="分类名称"></el-table-column>
        <el-table-column prop="modifySysUserName" label="操作人"></el-table-column>
        <el-table-column prop="modifyDate" label="操作时间"></el-table-column>
        <el-table-column prop="enabled" label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <v-dialog :width="500" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑分类':'新增分类'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" @submit.native.prevent :model="form" label-width="130px">
          <el-form-item label="分类名称" prop="phone">
            <span style="position:absolute;left:-75px;color:#eb453c;">*</span>
            <el-input style="width: 300px" v-model="form.typeName" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="排序号" prop="password">
            <el-input style="width: 300px" type="number" min="0" v-model="form.sort" placeholder="请输入排序号"></el-input>
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
import { goodsTypeConfigList, addGoodsTypeConfig, updategoodsTypeStatus } from '@/api'
export default {
  data () {
    return {
      dialogFormVisible: false,
      list: [],
      total: 0,
      form: { typeName: '', sort: '' },
      submitTitle: '确定',
      subLoad: false,
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
      return (this.form.typeName === '' || this.subLoad)
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.choseA = val
    },
    add () {
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.form.goodsTypeConfigId = row.goodsTypeConfigId
      this.form.typeName = row.typeName
      this.form.sort = row.sort
      this.dialogFormVisible = true
      this.isedit = true
    },
    async getList () {
      const res = await goodsTypeConfigList({})
      if (res.result === '0') {
        this.list = res.datas.list
      }
    },
    setReset () {
      this.form = { typeName: '', sort: '' }
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
      const res = await addGoodsTypeConfig(this.form)
      if (res.result === '1') {
        this.dialogFormVisible = false
        this.getList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    freeze (row) {
      if (this.choseA.length === 0) {
        this.$message({ type: 'warning', message: '请先选择要操作的分类' })
        return
      }
      const ids = this.choseA.map(item => {
        return item.goodsTypeConfigId
      })
      console.log(ids)
      this.$confirm('此操作将禁用选中的分类，是否继续？', '提示', {
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
      const res = await updategoodsTypeStatus({ goodsTypeConfigIds: ids.toString() })
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
