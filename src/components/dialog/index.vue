<template>
  <transition name="fade">
    <div v-show="dialogShow" class="dialog_wrapper" @mouseup="mouseup" @mousemove="mousemove">
      <div class="dialog_content" ref="moveBox" :style="{width: width + 'px', zIndex: zIndex}">
        <div class="dialog_header" @mousedown="mousedown">
          <span>{{title}}</span>
          <div class="close">
            <slot name="close"></slot>
          </div>
        </div>
        <div class="dialog_body">
          <div class="body">
            <slot name="con"></slot>
          </div>
        </div>
        <div class="footer-con">
          <slot name="footer-btn"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 300
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      movedata: { initX: 0, initY: 0, currentX: 0, currentY: 0 },
      x: 0,
      y: 0,
      touch: false
    }
  },
  methods: {
    mousedown (e) {
      this.movedata.initX = e.pageX
      this.movedata.initY = e.pageY
    },
    mousemove (e) {
      if (!this.touch) return
      this.x = this.movedata.currentX + e.pageX - this.movedata.initX
      this.y = this.movedata.currentY + e.pageY - this.movedata.initY
      this.style = 'translate(' + this.x + 'px, ' + this.y + 'px)'
    },
    mouseup (e) {
      this.touch = false
      this.movedata.currentX = this.x
      this.movedata.currentY = this.y
    }
  }
}
</script>

<style lang="less" scoped>
.dialog_wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 1000;
  .dialog_content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow-x: hidden;
    border-radius: 8px;
    min-width: 300px;
    .dialog_header {
      background-color: #409eff;
      color: #fff;
      height: 35px;
      line-height: 35px;
      position: relative;
      border-radius: 8px 8px 0 0;
      span {
        font-size: 15px;
        padding-left: 15px;
      }
      .close {
        position: absolute;
        top: 50%;
        right: 15px;
        font-size: 20px;
        transform: translate(0, -50%) rotate(0deg);
        color: rgba(255, 255, 255, 0.6);
        transition: all 1s;
        cursor: pointer;
        &:hover {
          transform: translate(0, -50%) rotate(360deg);
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .dialog_body {
      padding: 10px;
      background-color: #fff;
      padding-top: 15px;
      width: calc(100% - 9px);
      max-height: 500px;
      overflow-y: auto;
      position: relative;
    }
    .footer-con {
      background-color: #fff;
      border-radius: 0 0 8px 8px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<style lang="less">
.footer-btn {
  text-align: right;
  padding: 10px;
  div {
    width: 120px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 13px;
    display: inline-block;
    border-radius: 4px;
    margin-right: 20px;
    cursor: pointer;
  }
  .cancel {
    background-color: #ccc;
    color: #fff;
  }
  .confirm {
    background-color: #409eff;
    color: #fff;
  }
}
</style>
