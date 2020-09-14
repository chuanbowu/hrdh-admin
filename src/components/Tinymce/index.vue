<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <input type="file" ref="uploadInput" @change="_uploadChange" multiple accept="image/*">
      <el-button icon="el-icon-upload" size="mini" type="primary" @click="_uploadClick">上传图片</el-button>
      <!-- <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/> -->
    </div>
  </div>
</template>

<script>
import { uploadImageList } from '@/api'
import editorImage from './components/editorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { baseUrl } from '@/utils/commom'
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'
export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function () {
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        en: 'en',
        zh: 'zh_CN',
        es: 'es_MX',
        ja: 'ja'
      },
      baseUrl: baseUrl
    }
  },
  computed: {
    containerWidth () {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    edit: function (val) {
      this.hasChange = !val
    },
    value (val) {
      if (this.edit && this.hasInit && !this.hasChange) {
        this.hasChange = true
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted () {
    this.init()
  },
  activated () {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated () {
    this.destroyTinymce()
  },
  destroyed () {
    this.destroyTinymce()
  },
  methods: {
    init () {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initTinymce()
      })
    },
    initTinymce () {
      const _this = this
      window.tinymce.init({
        language: 'zh_CN',
        selector: `#${this.tinymceId}`,
        height: this.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: this.menubar,
        plugins: plugins,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 300,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent())
          })
        },
        setup (editor) {
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        }
      })
    },
    destroyTinymce () {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }
      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent (value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent()
    },
    _uploadClick () {
      this.$refs.uploadInput.value = ''
      this.$refs.uploadInput.click()
    },
    async _uploadChange (e) {
      this.key = new FormData()
      this.compressDone(e.target.files, 0)
    },
    compressDone (Originalfile, k) { // 第一次判断是否需要图片压缩
      const that = this
      console.log(Originalfile, k)
      if (Originalfile[k].type !== 'image/gif' && Originalfile[k].size > 1048576) { // 大于1M需要压缩
        const name = Originalfile[k].name
        const reader = new FileReader() // 新建一个FileReader对象
        reader.readAsDataURL(Originalfile[k]) // 将读取的文件转换成base64格式
        reader.onload = function (ev) { // 转换后的文件
          const src = ev.target.result
          const img = new Image()
          img.src = src
          img.onload = function (e) { // 图片加载完成后
            const canvas = document.createElement('canvas') // 创建一个canvas元素
            const context = canvas.getContext('2d') // context相当于画笔，里面有各种可以进行绘图的API
            const imageWidth = img.width // 压缩后图片的宽度，这里设置为缩小一半
            const imageHeight = img.height // 压缩后图片的高度，这里设置为缩小一半
            let data = '' // 存储压缩后的图片
            canvas.width = imageWidth // 设置绘图的宽度
            canvas.height = imageHeight // 设置绘图的高度
            // 使用drawImage重新设置img标签中的图片大小，实现压缩。drawImage方法的参数可以自行查阅W3C
            context.drawImage(img, 0, 0, imageWidth, imageHeight)
            // 使用toDataURL将canvas上的图片转换为base64格式
            data = canvas.toDataURL(Originalfile[k].type)
            // 返回base64转blob的值
             console.log(`原图${(src.length / 1024).toFixed(2)}kb`, `新图${(data.length / 1024).toFixed(2)}kb`)
            if (data.length > 1048576) { // 压缩后还在1m以上继续压缩
              that.compressAgain(Originalfile, k, 0.8)
            } else {
              // 去掉url的头，并转换为byte
              const bytes = window.atob(data.split(',')[1])
              // 处理异常,将ascii码小于0的转换为大于0
              const ab = new ArrayBuffer(bytes.length)
              const ia = new Uint8Array(ab)
              for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i)
              }
              const file = new Blob([ab], { type: Originalfile[k].type })
              file.name = name
              k++
              that.key.append('file', file)
              if (k === Originalfile.length) { // 所有图片处理完毕
                that.done(Originalfile)
              } else {
                that.compressDone(Originalfile, k)
              }
            }
          }
        }
      } else { // 不需要压缩
        this.key.append('file', Originalfile[k])
        k++
        if (k === Originalfile.length) {
          this.done(Originalfile)
        } else {
          this.compressDone(Originalfile, k)
        }
      }
    },
    compressAgain (Originalfile, k, scale) { // 图片压缩
      const that = this
      const name = Originalfile[k].name
      const reader = new FileReader() // 新建一个FileReader对象
      reader.readAsDataURL(Originalfile[k]) // 将读取的文件转换成base64格式
      reader.onload = function (ev) { // 转换后的文件
        const src = ev.target.result
        const img = new Image()
        img.src = src
        img.onload = function (e) { // 图片加载完成后
          const canvas = document.createElement('canvas') // 创建一个canvas元素
          const context = canvas.getContext('2d') // context相当于画笔，里面有各种可以进行绘图的API
          const imageWidth = img.width * scale // 压缩后图片的宽度，这里设置为缩小一半
          const imageHeight = img.height * scale // 压缩后图片的高度，这里设置为缩小一半
          let data = '' // 存储压缩后的图片
          canvas.width = imageWidth // 设置绘图的宽度
          canvas.height = imageHeight // 设置绘图的高度
          // 使用drawImage重新设置img标签中的图片大小，实现压缩。drawImage方法的参数可以自行查阅W3C
          context.drawImage(img, 0, 0, imageWidth, imageHeight)
          // 使用toDataURL将canvas上的图片转换为base64格式
          data = canvas.toDataURL(Originalfile[k].type)
          console.log(`原图${(src.length / 1024).toFixed(2)}kb`, `新图${(data.length / 1024).toFixed(2)}kb`)
          // 去掉url的头，并转换为byte
          // 返回base64转blob的值
          if (data.length < 1048576) { // 不需要压缩了
            const bytes = window.atob(data.split(',')[1])
            // 处理异常,将ascii码小于0的转换为大于0
            const ab = new ArrayBuffer(bytes.length)
            const ia = new Uint8Array(ab)
            for (let i = 0; i < bytes.length; i++) {
              ia[i] = bytes.charCodeAt(i)
            }
            const file = new Blob([ab], { type: Originalfile[k].type })
            file.name = name
            k++
            that.key.append('file', file)
            if (k === Originalfile.length) {
              that.done(Originalfile)
            } else {
              that.compressDone(Originalfile, k)
            }
          } else { // 没压缩到1M一下还需继续压缩
            that.compressAgain(Originalfile, k, scale - 0.1)
          }
        }
      }
    },
    async done (Originalfile) {
      const res = await uploadImageList(this.key)
      if (res.result === '1') {
        const len = res.datas.list.length
        let str = ''
        for (let i = 0; i < len; i++) {
          str += `<img class="wscnph" src="${baseUrl + res.datas.list[i].fileUrl}" >`
        }
        if (res.result === '1') {
          window.tinymce.get(this.tinymceId).insertContent(str)
        }
      } else {
        this.$message({ message: '上传失败', type: 'warning', duration: 2000 })
      }
    }
    // imageSuccessCBK(arr) {
    //   const _this = this
    //   arr.forEach(v => {
    //     window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
    //   })
    // }
  },
  created () {
    this.change = this.edit
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  font-size: 13px;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: -1px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}
.editor-custom-btn-container input {
  display: none;
}
</style>
