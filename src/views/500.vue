<template>
  <div style="background:#f0f2f5;margin-top: -20px;height:100%;">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" :src="require('@/assets/img/icon-500.svg')" alt="500">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">500</div>
        <div class="bullshit__info">抱歉，服务器出错了！</div>
        <router-link to="dashboard" class="bullshit__return-home">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'no404'
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
.wscn-http404 {
  position: relative;
  margin: 20px auto 0;
  padding: 0 100px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  .pic-404 {
    position: relative;
    // float: left;
    width: 430px;
    padding: 150px 0 0;
    overflow: hidden;
    margin-right: 100px;
    &__parent {
      width: 100%;
    }
  }
  .bullshit {
    position: relative;
    // float: left;
    width: 300px;
    padding: 200px 0 0;
    overflow: hidden;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>
