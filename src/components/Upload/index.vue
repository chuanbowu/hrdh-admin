<template>
  <div class="upload-item">
    <input v-if="option.type === 1" type="file" ref="uploadInput1" @change="_uploadChange" accept="image/*">
    <input v-else type="file" ref="uploadInput2" @change="_uploadChange" multiple accept="image/*">
    <div class="upload-box">
      <div class="img-con" v-for="(item, index) in option.file" :key="index">
        <div class="img active" @click.stop="prev(index)">
          <el-image
            style="width: 100px; height: 100px"
            :src="baseUrl + item">
          </el-image>
          <div class="loading" v-show="item === ''">
            <el-progress class="circle" type="circle" :show-text="false" :percentage="25" :stroke-width="4" :width="90"></el-progress>
            <span>上传中</span>
          </div>
          <i class="el-icon-delete" @click.stop="_delete(index)" v-show="item!==''"></i>
          <label class="upload-status" v-show="item !== ''"><i class="el-icon-check"></i></label>
        </div>
      </div>
      <div class="upload" @click="_uploadClick" v-if="option.file.length < option.count">
        <i class="el-icon-plus"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/utils/commom'
import { uploadImage, uploadImageList } from '@/api'
export default {
  props: {
    option: Object,
    datePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseUrl: baseUrl
    }
  },
  methods: {
    _uploadClick () {
      if (this.option.type === 1) {
        this.$refs.uploadInput1.value = ''
        this.$refs.uploadInput1.click()
      } else {
        this.$refs.uploadInput2.value = ''
        this.$refs.uploadInput2.click()
      }
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
      this.option.file.push('')
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
      let res
      this.option.type === 1 ? res = await uploadImage(this.key) : res = await uploadImageList(this.key)
      for (var j = 0; j < Originalfile.length; j++) {
        this.option.file.pop('')
      }
      if (res.result === '1') {
        let file
        if (this.option.type === 1) {
          file = [res.datas.fileUrl]
        } else {
          file = res.datas.list.map((item) => item.fileUrl)
        }
        this.option.file = [...this.option.file, ...file]
        this.$emit('upfiles', { type: this.option.type, files: this.option.file })
      } else {
        this.$message({ message: '上传失败', type: 'warning', duration: 2000 })
      }
    },
    prev (index) {
      const srcs = this.option.file.map(item => {
        return this.baseUrl + item
      })
      this.$store.commit('prevData', { show: true, data: { index: index, srcs: srcs } })
    },
    _delete (index) { // 删除
      this.option.file.splice(index, 1)
      this.$emit('updelete', { index: index, files: this.option.file })
    }
  },
  created () {
  }
}
</script>

<style scoped lang="less">
  .upload-item {
    >input{
      display: none;
    }
    .upload-box{
      .img-con {
        width: 108px;
        display: inline-block;
        vertical-align: top;
        font-size: 0;
      }
      .img {
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 100px;
        height: 100px;
        margin-right: 8px;
        // display: inline-block;
        position: relative;
        overflow: hidden;
        top: -15px;
        animation: down 0.3s linear both;
        img{
          width: 100%;
          height: 100%;
        }
        .el-icon-delete{
          position: absolute;
          right: 2px;
          bottom: 3px;
          color: rgba(235,69,60,.7);
          cursor: pointer;
          font-size: 20px;
          &:hover {
            color: rgba(235,69,60,1);
          }
        }
        .upload-status{
          position: absolute;
          right: -15px;
          top: -6px;
          width: 40px;
          height: 24px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 0 1px 1px rgba(0,0,0,.2);
          display: block;
          i{
            position: absolute;
            font-size: 12px;
            left: 50%;
            top: 72%;
            transform: translate(-50%, -50%) rotate(-45deg);
            color: #fff;
            font-weight: 700;
          }
        }
        .loading {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-color: #fbfdff;
          .circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            animation: move 1s linear infinite both;
          }
          >span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            color: #409EFF;
          }
          @keyframes move {
            from {transform: translate(-50%, -50%) rotate(0deg)}
            to {transform: translate(-50%, -50%) rotate(360deg)}
          }
          @keyframes down {
            from {top: -15px;}
            to {top: 0px;}
          }
        }
      }
      .upload{
        display: inline-block;
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 100px;
        height: 100px;
        cursor: pointer;
        line-height: 100px;
        text-align: center;
        vertical-align: top;
        &:hover{
          border-color: #409eff;
          i{
            color: #409eff;
          }
        }
        i{
          font-size: 28px;
          color: #8c939d;
        }
      }
      .expressionName {
        width: 100px;
        input {
          height: 30px;
          width: 100%;
          border: none;
          outline: none;
          border-bottom: 1px solid #eee;
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
</style>
<style>
  .upload-item .el-image-viewer__close {
    color: #fff;
  }
</style>
