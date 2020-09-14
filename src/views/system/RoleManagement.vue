  <template>
  <div class="con">
    <div class="search-zu">
      <div class="search-item four">
        <span class="title">角色描述：</span>
        <el-input v-model="serachData.roleRemark" clearable></el-input>
      </div>
      <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <div class="btn-con">
        <el-button-group class="operation-button">
          <el-button size="mini" type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addRole">新增</el-button>
          <el-button size="mini" type="primary" icon="el-icon-delete" @click="del">删除</el-button>
        </el-button-group>
      </div>
    </div>
    <div class="my-table">
      <el-table :data="tableData" ref="table" style="width: 100%" height="100%" :stripe="true" highlight-current-row size="mini" @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleRemark" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="ConMenu(scope.row.sysRoleId)">配置系统菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <cb-loading :show="$store.getters.loading"/>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="serachData.pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="serachData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <v-dialog :width="400" :zIndex="10" :dialogShow="dialogFormVisible" :title="isedit?'编辑系统角色':'新增系统角色'">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible=false"></i>
      <div slot="con">
        <el-form ref="form" :model="form" label-width="90px" size="small">
          <el-form-item label="角色名称" prop="roleName">
            <span style="position:absolute;left:-78px;color:#eb453c;">*</span>
            <el-input style="width: 270px" v-model="form.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleRemark">
            <el-input style="width: 270px" type="textarea" :rows="5" v-model="form.roleRemark" placeholder="请输入角色描述"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer-btn" slot="footer-btn">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" :disabled="cansubmit" :loading="subLoad" @click="submit">{{submitTitle}}</el-button>
      </div>
    </v-dialog>
    <v-dialog title="角色权限分配" :width="400" :zIndex="10" :dialogShow="dialogFormVisible1">
      <i slot="close" class="el-icon-close close" @click="dialogFormVisible1=false"></i>
      <div slot="con">
        <div class="plan-con">
          <div class="button-box">
            <el-button size="mini" type="primary" @click="getCheckedNodes">授权选中菜单</el-button>
          </div>
          <div class="tree">
            <el-tree
              :data="data2"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :check-strictly="true"
              :default-checked-keys="checked"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
import vDialog from '@c/dialog'
import cbLoading from '@c/loading'
import { sysRoleAdd, sysRoleEdit, sysRoleList, roleMenuList, sysRoleDelete, addRoleMenu } from '@/api'
export default {
  data () {
    return {
      submitTitle: '确定',
      subLoad: false,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      isedit: false,
      form: { roleName: '', roleRemark: '' },
      choseArr: [],
      totalNum: 0,
      serachData: { roleRemark: '', pageNum: 1, pageSize: 10 },
      tableData: [],
      data2: [],
      defaultProps: {
        children: 'menuTwoList',
        label: 'menuName'
      },
      checkedId: '',
      checked: []
    }
  },
  components: {
    vDialog,
    cbLoading
  },
  computed: {
    cansubmit: function () {
      return (this.form.roleName === '' || this.subLoad)
    }
  },
  methods: {
    refresh () {
      this.serachData = { roleRemark: '', pageNum: 1, pageSize: 10 }
      this._sysRoleList()
    },
    search () {
      this.serachData.pageNum = 1
      this._sysRoleList()
    },
    handleSizeChange (val) { // 每页条数改变
      this.serachData.pageSize = val
      this._sysRoleList()
    },
    handleCurrentChange (val) { // page改变
      this.serachData.pageNum = val
      this._sysRoleList()
    },
    handleSelectionChange (val) {
      this.choseArr = val
    },
    async _sysRoleList () {
      const res = await sysRoleList(this.serachData)
      if (res.result === '0') {
        this.totalNum = res.datas.totalRow
        this.tableData = res.datas.sysRoleList
      }
    },
    addRole () {
      this.subLoad = false
      this.submitTitle = '确定'
      this.dialogFormVisible = true
      this.isedit = false
      this.setReset()
    },
    edit (row) {
      this.subLoad = false
      this.submitTitle = '确定'
      this.dialogFormVisible = true
      this.form.roleName = row.roleName
      this.form.sysRoleId = row.sysRoleId
      this.form.roleRemark = row.roleRemark
      this.isedit = true
    },
    del () {
      if (this.choseArr.length < 1) {
        this.$message({ type: 'warning', message: '请至少选择一个角色进行删除' })
      } else {
        const ids = []
        this.choseArr.forEach(element => {
          ids.push(element.sysRoleId)
        })
        this.$confirm('此操作将批量删除选择的角色，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await sysRoleDelete({ sysRoleIds: ids.join(',') })
          this._sysRoleList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '操作已取消'
          })
        })
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
    async create () {
      let res
      this.isedit ? res = await sysRoleEdit(this.form) : res = await sysRoleAdd(this.form)
      if (res.result === '1') {
        this.setReset()
        this.dialogFormVisible = false
        this._sysRoleList()
      }
      this.subLoad = false
      this.submitTitle = '确定'
    },
    setReset () {
      this.form = { roleName: '', roleRemark: '' }
    },
    async ConMenu (id) {
      this.checkedId = id
      this.checked = []
      const res = await roleMenuList({ roleId: this.checkedId })
      res.datas.menuList.map(item => {
        if (item.type === 'true') {
          this.checked.push(item.id)
        }
        item.menuTwoList.map(item2 => {
          if (item2.type === 'true') {
            this.checked.push(item2.id)
          }
        })
      })
      this.data2 = res.datas.menuList
      this.dialogFormVisible1 = true
    },
    async getCheckedNodes () {
      if (this.$refs.tree.getCheckedNodes().length > 0) {
        const menuIds = []
        this.$refs.tree.getCheckedNodes().map(item => {
          menuIds.push(item.id)
        })
        const res = await addRoleMenu({ roleId: this.checkedId, menuId: menuIds.join(',') })
        if (res.result === '1') {
          this.dialogFormVisible1 = false
        }
      } else {
        this.$message({ message: '菜单ID不能为空', type: 'warning' })
      }
    }
  },
  created () {
    this._sysRoleList()
  }
}
</script>
<style scoped lang="less">
.con{
  height: 100%;
  .btn-con {
    float: right;
  }
  .my-table{
    height: calc(100% - 100px);
    position: relative;
  }
}
.plan-con {
  width: 98%;
  .button-box{
    width: 100%;
    height: 28px;
    button{
      float: right;
    }
  }
  .tree{
    width: 100%;
    max-height: 400px;
    overflow: auto;
  }
}
</style>
