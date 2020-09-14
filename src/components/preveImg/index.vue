<template>
  <div class="preveImg">
    <div class="left" @click="prev"><i class="el-icon-arrow-left"></i></div>
    <div class="right" @click="next"><i class="el-icon-arrow-right"></i></div>
    <div class="tools">
      <i class="el-icon-zoom-out" @click="zoomOut()"></i>
      <i class="el-icon-zoom-in" @click="zoomIn()"></i>
      <i class="el-icon-refresh-left" @click="rotateLeft"></i>
      <i class="el-icon-refresh-right" @click="rotateRight"></i>
    </div>
    <i @click="$emit('closepreveImg', 'closepreveImg')" class="close el-icon-circle-close"></i>
    <div class="img" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <template v-for="(item, index) in data.srcs">
        <div :key="index" v-show="which===index" :style="'transform: translate('+style[index].x+'px,'+style[index].y+'px)'">
          <img ref="img" @mousedown.stop.prevent="touchstarts($event)" @mousemove.stop.prevent="touchmove($event)" @mouseup.stop.prevent="touchend($event)" style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px;transition: transform 0.3s ease 0s;" :src="item" alt="">
        </div>
      </template>
    </div>
    <div class="num">{{which + 1}}/{{data.srcs.length}}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return { index: 0, srcs: [] }
      }
    }
  },
  data () {
    return {
      which: this.data.index,
      style: [],
      styleinit: [],
      x: 0,
      y: 0,
      istouch: false
    }
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
        // console.log(e)
      }
      if (delta < 0) { // 缩小
        this.zoomOut(0.05)
      } else {
        this.zoomIn(0.05)
      }
    },
    touchstarts (e) {
      this.x = e.clientX
      this.y = e.clientY
      this.istouch = true
    },
    touchmove (e) {
      if (!this.istouch) return
      const x = this.styleinit[this.which].x + (e.clientX - this.x)
      const y = this.styleinit[this.which].y + (e.clientY - this.y)
      this.style[this.which].x = x
      this.style[this.which].y = y
    },
    touchend (e) {
      this.istouch = false
      this.styleinit[this.which].x = this.style[this.which].x
      this.styleinit[this.which].y = this.style[this.which].y
    },
    prev () {
      if (this.data.srcs.length === 1) return
      this.which--
      if (this.which === -1) this.which = this.data.srcs.length - 1
    },
    next () {
      if (this.data.srcs.length === 1) return
      this.which++
      if (this.which > this.data.srcs.length - 1) this.which = 0
    },
    zoomOut (sacle = 0.2) {
      var s = +this.$refs.img[this.which].style.transform.split('scale(')[1].split(') ')[0]
      var r = +this.$refs.img[this.which].style.transform.split('rotate(')[1].split('deg')[0]
      if (s === 0.2) return
      s -= sacle
      this.$refs.img[this.which].style.transform = `scale(${s}) rotate(${r}deg)`
    },
    zoomIn (sacle = 0.2) {
      var s = +this.$refs.img[this.which].style.transform.split('scale(')[1].split(') ')[0]
      var r = +this.$refs.img[this.which].style.transform.split('rotate(')[1].split('deg')[0]
      s += sacle
      this.$refs.img[this.which].style.transform = `scale(${s}) rotate(${r}deg)`
    },
    rotateLeft () {
      var s = +this.$refs.img[this.which].style.transform.split('scale(')[1].split(') ')[0]
      var r = +this.$refs.img[this.which].style.transform.split('rotate(')[1].split('deg')[0]
      r -= 90
      this.$refs.img[this.which].style.transform = `scale(${s}) rotate(${r}deg)`
    },
    rotateRight () {
      var s = +this.$refs.img[this.which].style.transform.split('scale(')[1].split(') ')[0]
      var r = +this.$refs.img[this.which].style.transform.split('rotate(')[1].split('deg')[0]
      r += 90
      this.$refs.img[this.which].style.transform = `scale(${s}) rotate(${r}deg)`
    }
  },
  created () {
    this.data.srcs.map(item => {
      this.style.push({ x: 0, y: 0 })
      this.styleinit.push({ x: 0, y: 0 })
    })
  }
}
</script>

<style scoped lang="less">
  .preveImg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1000;
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        transition: transform 0.3s esae 0s;
        cursor: pointer;
      }
    }
    .left {
      position: absolute;
      border-radius: 50%;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      font-size: 24px;
      color: #fff;
      background-color: #606266;
      border-color: #fff;
      left: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
    }
    .right {
      position: absolute;
      border-radius: 50%;
      top: 50%;
      right: 40px;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      font-size: 24px;
      color: #fff;
      background-color: #606266;
      border-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
    }
    .close {
      position: absolute;
      top: 5px;
      right: 60px;
      width: 40px;
      height: 40px;
      font-size: 40px;
      color: #fff;
      z-index: 10;
      cursor: pointer;
      &:hover {
        color: #eb453c;
      }
    }
    .tools {
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
      width: 282px;
      height: 44px;
      padding: 0 23px;
      background-color: #606266;
      border-color: #fff;
      border-radius: 22px;
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: .8;
      cursor: pointer;
      box-sizing: border-box;
      user-select: none;
      color: #fff;
      font-size: 23px;
    }
    .num {
      position: absolute;
      bottom: 40px;
      right: 40px;
      width: 40px;
      height: 40px;
      font-size: 24px;
      color: #fff;
      z-index: 2;
    }
  }
</style>
