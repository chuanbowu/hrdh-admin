<template>
  <aside class="aside" :class="{active: isCollapse}">
    <div>
      <div class="logo">
        后台管理系统
      </div>
      <el-menu :default-active="$route.path" :unique-opened="true" class="menu" :collapse="isCollapse" router background-color="#333" text-color="#fff" active-text-color="#ffd04b">
        <template v-for="(item, index) in $store.getters.routerMenu">
          <el-submenu :index="item.path" v-if="item.children" :key="index">
            <template slot="title">
              <i class="icon iconfont" :class="item.meta.icon"></i>
              <span slot="title">{{item.meta.title}}</span>
            </template>
            <div>
              <el-menu-item-group v-for="(child, i) in item.children" :key="i">
                <el-menu-item :index="child.path">{{child.meta.title}}</el-menu-item>
              </el-menu-item-group>
            </div>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </aside>
</template>
<script>
export default {
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
.aside{
  width: 180px;
  overflow-x: hidden;
  height: 100%;
  overflow-y: auto;
  background-color: #333;
  transition: all 0.3s;
  &.active{
    width: 0;
  }
  &::-webkit-scrollbar{
    width: 0px;
    height: 0px;
    background-color: transparent;
  }
  .logo{
    text-align: center;
    color: #fff;
    line-height: 35px;
    font-size: 18px;
    box-sizing: border-box;
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,.4);
    img{
      width: 90%;
      margin-top: 15px;
    }
  }
  .icon{
    font-size: 18px;
    color: #fff;
    margin-right: 5px;
  }
  .menus{
    margin-top: 100px;
    font-size: 18px;
    color: #fff;
    .agentInfo{
      background: rgba(#ccc, 0.2);
      line-height: 60px;
      cursor: pointer;
      padding-left: 15px;
    }
  }
}
</style>

<style>
  .aside .el-menu-item.is-active {
    background-color: rgb(35, 35, 35)!important;
  }
</style>
