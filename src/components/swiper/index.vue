<template>
  <div class="swiper">
    <div class="slide" :class="{active: index===i}" v-for="(item, index) in swiperArr" :key="index" :style="'background: url('+item+') no-repeat center/cover'"></div>
  </div>
</template>

<script>
import Bg1 from '../../assets/img/bj1.jpg'
import Bg2 from '../../assets/img/bj2.jpg'
import Bg3 from '../../assets/img/bj3.jpg'
import Bg4 from '../../assets/img/bj4.jpg'

export default {
  data () {
    return {
      timeFn: null,
      swiperArr: [Bg1, Bg2, Bg3, Bg4],
      i: 0
    }
  },
  mounted () {
    setInterval(item => {
      this.i++
      if (this.i > this.swiperArr.length - 1) this.i = 0
    }, 5000)
  }
}
</script>

<style scoped lang="less">
  .swiper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    .slide {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
      transition: opacity 2s;
      opacity: 0;
      &.active {
        z-index: 1;
        opacity: 1;
      }
    }
  }
</style>
