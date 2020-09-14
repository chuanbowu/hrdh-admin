<template>
  <div id="app">
    <router-view/>
    <preve-img @closepreveImg="$store.commit('prevData', {show: false, data:{index:0, srcs:[]}})" v-if="$store.getters.prevData.show" :data="$store.getters.prevData.data" />
  </div>
</template>

<script>
import preveImg from '@c/preveImg'
export default {
  components: {
    preveImg
  }
}
</script>

<style lang="less">
@import 'styles/reset.css';
@import 'styles/font/iconfont.css';
@import 'styles/element-ui.css';
html, body{
  height: 100%;
  width: 100%;
}
.all-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body .el-table th.gutter {
  display: table-cell !important;
}
.el-table {
  th.gutter,
  colgroup.gutter {
    display: block !important;
    width: 20px !important
  }
}
</style>
