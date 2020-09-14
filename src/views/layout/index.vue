<template>
  <div class="all-container index">
    <section class="content">
      <section class="menu-con" :class="{active: isCollapse}"><my-menu :isCollapse="isCollapse" @changeCollapse="changeCollapse" /></section>
      <section class="substance" :class="{active: isCollapse}">
        <top-head :isCollapse="isCollapse" @open="open" :username="msg.username"/>
        <section class="main">
          <tag-view />
          <transition name="fade-transform" mode="out-in">
            <div id="content" :key="key">
              <keep-alive :include="$route.keepAlive"><router-view/></keep-alive>
            </div>
          </transition>
        </section>
      </section>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MyMenu from './components/Menu'
import TopHead from './components/head'
import TagView from './components/targview'
export default {
  name: 'Index',
  data () {
    return {
      isCollapse: false,
      msg: { username: '' }
    }
  },
  computed: {
    ...mapGetters([
      'currentPage'
    ]),
    key () {
      return this.$route.fullPath
    }
  },
  components: {
    MyMenu,
    TopHead,
    TagView
  },
  methods: {
    changeCollapse (data) {
      this.isCollapse = data
    },
    open (val) {
      this.isCollapse = val
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  height: 100%;
  .menu-con {
    height: 100%;
    transition: all 0.3s;
  }
  .substance{
    position: absolute;
    min-width: 900px;
    top: 0;
    left: 180px;
    bottom: 0px;
    right: 0;
    transition: all 0.3s;
    &.active{
      left: 0;
    }
    .main{
      height: calc(100% - 50px);
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #e2e9ef;
      .nav{
        background: #fff;
        padding-left: 30px;
        display: flex;
        height: 30px;
        align-items: center;
        overflow: hidden;
        .icon-weizhi{
          font-size: 18px;
          color: #eb453c;
          margin-right: 8px;
        }
      }
    }
  }
}
#content{
  margin: 10px;
  overflow-y: auto;
  height: calc(100% - 70px);
  background: #fff;
  padding: 10px;
}
</style>

<style>
  .fade-transform-enter-active,.fade-transform-leave-active {
    transition: all 0.5s ease;
  }
  .fade-transform-enter{
    transform: translate3d(-30px,0,0);
    opacity: 0;
  }
  .fade-transform-leave-to{
    opacity: 0;
    transform: translate3d(10px,0,0);
  }
</style>
