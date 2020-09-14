<template>
  <div class="loading" v-show="show">
    <div>
      <img :src="require('@/assets/img/080.gif')" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="less">
  .loading {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, .9);
    >div {
      transform: rotate(0deg);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    img {
      border-radius: 50%;
    }
  }
  @keyframes rotate {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
</style>
