<template>
  <div class="tag-view">
    <div class="btn-con left-btn">
      <button type="text" @click="handleScroll(240)">
        <i class="el-icon-arrow-left" />
      </button>
    </div>
    <div class="btn-con right-btn">
      <button type="text" @click="handleScroll(-240)">
        <i class="el-icon-arrow-right" />
      </button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <span v-for="(tag, index) in tags" :key="index" ref="tagsPageOpened" :data-route-item="tag.path.path" class="el-tag el-tag--small is-hit" :class="{active: current === tag.path.match}" @click.stop="changeview(tag)" @contextmenu.prevent="openMenu(tag, index, $event)">
          {{tag.name}}
          <i v-if="index > 0" class="el-tag__close el-icon-close" @click.stop="handleClose(tag, index)"></i>
        </span>
      </div>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="closeSelectedTag">关闭当前</li>
      <li @click="closeOthersTags">关闭其他标签页</li>
      <li @click="closeRightTags">关闭右侧标签页</li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tagBodyLeft: 0,
      outerPadding: 4,
      isnew: false,
      tags: [{ closable: false, name: '首页', path: { path: '/dashboard', match: '/dashboard' } }],
      visible: false,
      top: 15,
      left: 0,
      selectedTag: {},
      index: null,
      refsTag: []
    }
  },
  computed: {
    current () {
      const that = this
      for (var i = 0; i < that.tags.length; i++) {
        if (that.tags[i].path.match === that.$route.path + location.search) {
          that.isnew = true
        } else {
          that.tags[i].active = false
        }
      }
      if (that.isnew) {
        that.isnew = false
      } else {
        that.tags.push({ closable: true, name: that.$route.query.name ? that.$route.query.name : that.$route.meta.title, path: { path: that.$route.path, query: that.$route.query, match: that.$route.path + location.search } })
      }
      return that.$route.path + location.search
    }
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {} else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    handleClose (tag, index) {
      this.tags.splice(index, 1)
      this.tags[this.tags.length - 1].active = true
      this.$router.push(this.tags[this.tags.length - 1].path)
    },
    moveToView (tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
      }
    },
    getTagElementByName (route) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened
        this.refsTag.forEach((item, index) => {
          if (item.dataset.routeItem === route.path) {
            const tag = this.refsTag[index]
            this.moveToView(tag)
          }
        })
      })
    },
    changeview (tag) {
      if (tag.path.match === this.$route.path + location.search) return
      this.tags.map((item) => {
        item.active = false
      })
      tag.active = true
      this.$router.push(tag.path)
    },
    openMenu (tag, index, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }
      // this.top = e.clientY
      this.index = index
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu () {
      this.visible = false
    },
    closeSelectedTag () { // 关闭当前
      this.tags.splice(this.index, 1)
      this.tags[this.tags.length - 1].active = true
      this.$router.push(this.tags[this.tags.length - 1].path)
    },
    closeOthersTags () { // 关闭其他标签页
      if (this.index === 0) {
        this.tags = [{ closable: false, name: '首页', path: { path: '/dashboard', match: '/dashboard' } }]
        this.$router.push(this.tags[0].path)
      } else {
        this.$router.push(this.tags[this.index].path)
        this.tags = [{ closable: false, name: '首页', path: { path: '/dashboard', match: '/dashboard' } }, this.tags[this.index]]
      }
    },
    closeRightTags () { // 关闭右侧标签页
      this.$router.push(this.tags[this.index].path)
      this.tags = this.tags.slice(0, this.index)
    }
  },
  watch: {
    '$route' (to) {
      this.getTagElementByName(to)
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created () {
    setTimeout(() => {
      this.getTagElementByName(this.$route)
    }, 200)
  }
}
</script>
<style scoped lang="less">
  .tag-view {
    background: #fff;
    height: 30px;
    position: relative;
    .btn-con {
      position: absolute;
      top: 0px;
      height: 100%;
      background: #fff;
      z-index: 1;
      button {
        padding: 8px 8px;
        line-height: 14px;
        text-align: center;
        background-color: transparent;
        border: 0;
        outline:none;
      }
      &.left-btn {
        left: 0px;
      }
      &.right-btn {
        right: 0px;
        border-right: 1px solid #F0F0F0;
      }
    }
    .scroll-outer {
      position: absolute;
      left: 28px;
      right: 28px;
      top: 0;
      bottom: 0;
      box-shadow: 0px 0 3px 2px rgba(100,100,100,.1) inset;
      .scroll-body {
        height: ~"calc(100% - 1px)";
        padding: 3px 4px;
        position: absolute;
        overflow: visible;
        white-space: nowrap;
        transition: left .3s ease;
        .ivu-tag-dot-inner {
          transition: background .2s ease;
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
  .el-tag {
    color: #495060;
    background: #fff;
    cursor: pointer;
    &.active {
      background: #42b983;
      color: #fff;
      i {
        color: #fff;
        font-size: 12px;
        &:hover {background: #ccc;}
      }
    }
  }
  .el-tag + .el-tag {
    margin-left: 5px;
  }
</style>
<style>
  .scroll-outer .el-tag.is-hit {
    border-color: #d9ecff;
  }
</style>
