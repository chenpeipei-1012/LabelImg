<template>
    <div class="func-list">
        <func-btn button="primary" icon="ios-folder-open" text="Open Dir"
                  @click.native="openDirectory()"></func-btn>
      <!--
        <func-btn button="warning" icon="ios-list-box" text="File List"
                  @click.native="showFileItems()"></func-btn>  -->
        <func-btn button="info" icon="md-add" text="Zoom In"
                  @click.native="zoomIn()"></func-btn>
        <func-btn button="info" icon="md-remove" text="Zoom Out"
                  @click.native="zoomOut()"></func-btn>
        <func-btn button="info" icon="md-archive" text="Save"
                  @click.native="saveFileItemObjects()"></func-btn>
        <func-btn button="info" icon="md-arrow-round-back" text="Prev"
                  @click.native="prevImg()"></func-btn>
        <func-btn button="info" icon="md-arrow-round-forward" text="Next"
                  @click.native="nextImg()"></func-btn>
<!--        <func-btn button="info" icon="ios-square-outline" text="Draw Box"></func-btn>-->
    </div>
</template>

<script>
  import FuncBtn from './children/FuncBtn'
  const {dialog} = require('electron').remote
  // Node.js 引入fs模块
  const fs = require('fs')
  const path = require('path')
  export default {
    name: 'FuncList',
    components: {FuncBtn},
    methods: {
      // 打开目录
      openDirectory () {

        // 使用dialog打开目录，得到的ret是一个数组 [0]  --> F:\helmet\ls_copy\test_img_have_label 选择的目录
        let ret = dialog.showOpenDialog({
          properties: ['openDirectory']
        })
        if (!ret) {
          this.$Message.info('Not selectBoundingBox directory')
        } else {
          let dir = ret[0]
          // 以同步的方式检测目录是否存在
          if (!fs.existsSync(dir)) {
            // 目录不存在
            this.$Message.error(dir + ' not exist')
          } else if (!fs.statSync(dir).isDirectory()) {
            // 不是目录
            this.$Message.error(dir + ' is not a directory')
          } else {
            // 是目录且目录存在
            // 得到该目录下所有的文件名字 --> 构成数组
            let filenames = fs.readdirSync(dir)
            // 过滤出所有的JSON文件、图片文件
            let annotations = filenames.filter(filename => path.extname(filename) === '.json')
            let images = filenames.filter(filename => path.extname(filename) === '.jpg' ||
              path.extname(filename) === '.png' || path.extname(filename) === '.jpeg')
            // 在控制台打印过滤的图片文件数组
            console.log(images)
            let fileItems = []
            // 循环img
            // 得到文件名，不要后缀
            // debugger
            let fileName = path.basename("000006.jpg",path.extname("000006.jpg"))

            images.forEach(value => fileItems.push({
              // 在所有JSON的数组中查找同名文件
              'annotation': annotations.find(name => name.startsWith(path.basename(value,path.extname(value)))),
              'image': value,
              'directory': dir,
              'selected': false,
              'x': 0,
              'y': 0,
              'scale': 3,
              'objects': []
            }))
            // // 循环xml文件，并为fileItems赋值 --->  根据XML找图片
            // console.log('fileItems',JSON.stringify(fileItems[0]))
            // 展示文件详情
            this.$parent.showFileItems(fileItems)

            // 如果有图片需要展示第一张图片
            if(images.length > 0){
              // 展示第一张图片
              let imgPath = fileItems[0].image
              console.log(imgPath)
              //
              this.$parent.$refs.display.loadImage(fileItems[0])
              this.$parent.$refs.objectList.fileItems[0].selected = true
              this.$parent.fileItemsSelectedIndex = 0
              this.$parent.$refs.objectList.fileItemsSelectedIndex = 0
            }
          }
        }
      },
      //
      showFileItems () {
        this.$parent.showFileItems()
      },
      zoomIn () {
        this.$parent.$refs.display.zoomIn()
      },
      zoomOut () {
        this.$parent.$refs.display.zoomOut()
      },
      // 保存
      saveFileItemObjects (bodyIndex) {
        let isChanged = this.$parent.$refs.objectList.isChanged
        if(isChanged){
          this.$parent.$refs.display.saveFileItemObjects(bodyIndex)
        }

      },
      // 上一张
      prevImg () {
        // this.$parent.$refs.display.saveFileItemObjects()
        let index = this.$parent.getIndex()
        if (index === 0) {
          this.$Message.error('这是第一张图片')
        } else {
          index = index - 1
          this.$parent.$refs.objectList.openFile(index)
          this.$parent.fileItemsSelectedIndex = index
        }
      },
      // 下一章
      nextImg () {
        //debugger
        let index = this.$parent.getIndex()
        let fileNums = this.$parent.getFileNums() - 1
        if (index === fileNums) {
          this.$Message.error('这是最后一张图片')
        } else {
          index = index + 1
          // 保存当前已修改的对象 TODO
          //this.$parent.$refs.display.saveFileItemObjects()
          // 打开文件
          this.$parent.$refs.objectList.openFile(index)
          this.$parent.fileItemsSelectedIndex = index
          //openFile(index)
        }

      }
    }
  }
</script>

<style scoped>
    .func-list {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
