<template>
    <div id="img-wrap" class="display" :draggable="true"
         @dragstart="dragImageStart($event)" @drag="dragImagePeriod($event)">
        <span class="scale">{{fileItem.scale * 100}}%</span>
        <span class="origin">({{fileItem.x}}, {{fileItem.y}})</span>
      <!-- <div  id="human-body" class="d-body" ></div> -->
      <!--   <div class="img-wrap" id="img-wrap" v-html="">-->
          <img :draggable="false" :src="imageUrl" :style="imageStyle" id="human-body" class="human-body">

      <!--
            <template v-for="(_, index) in fileItem.objects">
                <bounding-box v-model="fileItem.objects[index]"></bounding-box>
            </template>  -->
         <!-- <img id='ghost' src="" style="visibility: hidden;">-->
      <!--  </div>-->
    </div>
</template>

<script>
  import Attributes from '../../../../config/attributes'
  import BoundingBox from './children/BoundingBox'
  import img from '../../../../assets/tips.png'
  const fs = require('fs')
  const xml2js = require('xml2js')
  const parser = new xml2js.Parser()
  const builder = new xml2js.Builder()
  const path = require('path')
  export default {
    name: 'Display',
    components: { BoundingBox },
    data () {
      return {
        imageUrl: img,
        fileItem: {
          directory: '',
          annotation: '',
          image: '',
          x: 0,
          y: 0,
          scale: 1,
          objects: [
          ]
        },
        humanBodys : [],
        dragX: 0,
        dragY: 0,
        SCALE_LEVEL: [0.20, 0.40, 0.60, 0.80, 1, 1.20, 1.40, 1.60, 1.8, 2, 3, 4],
        bodyHTML : '',
        iLeft: 0,
        iTop : 150,
        iWidth : 900,
        iHeight : 384,
        prop : 1
      }
    },
    computed: {
      imageStyle () {
        return {
          'position': 'absolute',
          'left': this.iLeft + 'px',
          'top': this.iTop + 'px',
          //'left': this.fileItem.x + 150 + 'px',
         // 'top': this.fileItem.y + 150 + 'px',
          'transform-origin': 'left top',
          '-webkit-transform': 'scale(' + 1 + ')',// this.fileItem.scale
          'width' : this.iWidth + 'px',
          'height': this.iHeight + 'px'
        }
      }
    },
    mounted:function(){
      // VUE的声明周期函数，在页面加载时会被调用
      // this.processBody();
    },
    methods: {
      loadImage (fileItem) {
        this.fileItem = fileItem
        this.imageUrl = 'file://' + fileItem.directory + '/' + fileItem.image
        // load annotation box
        const vm = this

        let annotationPath = fileItem.directory + '/' + fileItem.annotation
        let data = fs.readFileSync(annotationPath ,'utf-8')
        let jsonData = JSON.parse(data)

        // 获取图片的宽和高
        //debugger

        // 设置图片的宽和高
        let humanBody = document.getElementById("human-body")
        //humanBody.style.width = img.width + 'px'
        //humanBody.style.height = img.height + 'px'
        fileItem.scale = 1

        let personInfo = jsonData['person_info']
        if(jsonData['person_num'] == 0){
          // 不展示属性
          vm.$parent.$refs.objectList.active = false
        }else{
          vm.$parent.$refs.objectList.active = true
        }
        //this.drawPoint(100,100,100,100)
        //debugger
        // 清空原有的人体框
        //document.getElementById("img-wrap").removeChild(div)
        let bodyMarks = document.getElementsByClassName('body-mark')

        for(let i=bodyMarks.length-1;i>=0;i--){
          bodyMarks[i].remove()
        }
        // arr.splice(arr.indexOf(ele),length):
        vm.humanBodys.splice(0, vm.humanBodys.length)

        // 清空原有的humanBodys

        // humanBody.innerHTML = ""


        // 图片上下左右居中
        let imgDiv = document.getElementById("img-wrap")
        // alert("imgDiv:" + imgDiv.clientWidth + "  " + imgDiv.clientHeight)
        // 设置图片居中显示
        let img = new Image()
        img.src = 'file://' + fileItem.directory + '/' + fileItem.image

        img.onload = function() {
          debugger
          // 打印
          // alert('width:'+img.width+',height:'+img.height);
          // 使图片在层中居中显示
          let height = img.height
          let width = img.width
          // 存图片的原始宽和高
          vm.fileItem.objects.push({
            width: width,
            height: height
          })

          // .push({
          //       originX: fileItem.x,
          //       originY: fileItem.y,
          //       x: Number(value.bndbox[0].xmin[0]),
          //       y: Number(value.bndbox[0].ymin[0]),
          //       width: Number(value.bndbox[0].xmax[0]) - Number(value.bndbox[0].xmin[0]),
          //       height: Number(value.bndbox[0].ymax[0]) - Number(value.bndbox[0].ymin[0]),
          //       scale: fileItem.scale,
          //       name: value.name[0],
          //       selected: false
          //     }))
          vm.prop = 1
          //
          // debugger
          if (img.width > imgDiv.clientWidth) {
            // 如果图片比层还要大，则按比列缩写图片，
            // 高度等比例缩小
            height = img.height * imgDiv.clientWidth / img.width
            width = imgDiv.clientWidth
            // 修改图片缩放比例
            vm.prop = imgDiv.clientWidth / img.width

            // 图片的放缩比例必须在0.2,0.4,0.6,0.8,1,1.2,1.4,1.6,1.8,2,3,4
            const scaleLevel = vm.SCALE_LEVEL

            let minProp = scaleLevel[0]
            for(let i=0;i<scaleLevel.length-1;i++){
              if(vm.prop >= scaleLevel[i] && vm.prop < scaleLevel[i+1]){
                vm.prop = scaleLevel[i]
                break
              }
            }


            // alert(imgDiv.clientWidth / img.width)
            // 应用于图片
          }

          vm.fileItem.scale = vm.prop
         // alert(vm.prop)
          vm.iWidth = img.width * vm.prop
          vm.iHeight = img.height * vm.prop
          // 图片居中显示

          vm.iLeft = (imgDiv.clientWidth - img.width * vm.prop) / 2
          vm.iTop = (imgDiv.clientHeight - img.height * vm.prop) / 2
          // alert(vm.iLeft + "   " +  vm.iTop)

          for (let i = 0; i < personInfo.length; i++) {
            // 获取定位坐标
            let location = personInfo[i].location
            console.log(location.top, location.left, location.width, location.height)
            vm.drawPoint(location.top, location.left, location.width, location.height, (i + 1))
            // 存数据
           // debugger
            console.log(vm.fileItem.humanBodys)
            // vm.fileItem.humanBodys.push({
            //   top: location.top,
            //   left: location.left,
            //   width: location.width,
            //   height: location.height
            // })

          }
          console.log(typeof vm.fileItem.humanBodys);
          personInfo.forEach(value => vm.humanBodys.push({
            top: value.location.top,
            left: value.location.left,
            width: value.location.width,
            height: value.location.height
          }))
          debugger
          //result.annotation.object.forEach(value => fileItem.objects.push({
          // 添加点击事件
          vm.addListener();
          vm.loadImgAttr(fileItem, 1);

          // vm.curBodyIndex = 1
          //vm.changeCurBodyStyle()
        }


        fs.readFile(annotationPath, 'utf-8', function (error, data) {
          //debugger
          if (error) {
            vm.$Message.error(error)
            console.log(error)
          } else {
            // 解析JSON
            // TODO
            // 将字符串转成JSON格式的数据


            // xml2js.parseString(data, function (error, result)
            //   if (error) {
            //     vm.$Message.error(error)
            //     console.log(error)
            //   } else {
            //     console.log(result)
            //     console.log(typeof result.annotation.object)
            //     result.annotation.object.forEach(value => fileItem.objects.push({
            //       originX: fileItem.x,
            //       originY: fileItem.y,
            //       x: Number(value.bndbox[0].xmin[0]),
            //       y: Number(value.bndbox[0].ymin[0]),
            //       width: Number(value.bndbox[0].xmax[0]) - Number(value.bndbox[0].xmin[0]),
            //       height: Number(value.bndbox[0].ymax[0]) - Number(value.bndbox[0].ymin[0]),
            //       scale: fileItem.scale,
            //       name: value.name[0],
            //       selected: false
            //     }))
            //

            //
            //   }
            // })
          }
        })
      },
      drawPoint (top,left,width,height,index) {


        //debugger
        // 在图片上创建一个div，在图片上将div标出来
        // this.bodyHTML = "<div class='body-mark' style='width=" + width + 'px;height=' + height + 'px;border=' +
        //     '1px solid #ff0000;left=' + left + 'px;top=' + top  + 'px;position="absolute"' + "title=" + index +
        //     "id='b_index_'" + index +"></div>"
        let div = document.createElement('div')
        // 设置div的宽、高
        div.className = 'body-mark';
        div.style.width = width * this.prop + 'px'
        div.style.height = height * this.prop + 'px'
        div.style.border = '1px solid red'
        div.style.left = (left * this.prop + this.iLeft) + 'px'
        div.style.top = (top* this.prop+ this.iTop) + 'px'
        div.style.position = 'absolute';
        div.title = index
        div.id = "b_index_" + index;
        // 在图片中添加div
        document.getElementById('img-wrap').appendChild(div);
      },
      // 当前人体改变颜色
      changeCurBodyStyle(){
        let curBodyIndex = this.$parent.$refs.objectList.curBodyIndex
        //debugger
        let bodyMarks = document.getElementsByClassName('body-mark');
        for(let i=0;i<bodyMarks.length;i++){
          if(curBodyIndex-1 == i){
             bodyMarks[i].style.border = "1px solid blue"
          }else{
             bodyMarks[i].style.border = "1px solid red"
          }
        }

      },
      addListener(){
        let bodyMarks = document.getElementsByClassName('body-mark');
        for(let i=0;i<bodyMarks.length;i++){
          bodyMarks[i].onclick = this.loadBodyAttr
        }
      },
      loadBodyAttr(event){
        // 保存更改的属性值TODO
        this.saveFileItemObjects(this.curBodyIndex)
        //this.$parent.$refs.display.saveFileItemObjects()

        let bodyId = event.currentTarget.id;
        let index = bodyId.substring(bodyId.lastIndexOf("_") + 1);
        // 设置属性
        this.loadImgAttr(this.fileItem, index);
        this.changeCurBodyStyle()
      },
      loadImgAttr (fileItem, index) {
        // 加载人体属性

        this.fileItem = fileItem
        this.imageUrl = 'file://' + fileItem.directory + '/' + fileItem.image
        // load annotation
        const vm = this
        let annotationPath = fileItem.directory + '/' + fileItem.annotation
        // 读取JSON文件
        fs.readFile(annotationPath, 'utf-8', function (error, data) {

          if (error) {
            vm.$Message.error(error)
            console.log(error)
          } else {

            let jsonData = JSON.parse(data)
            let personInfo = jsonData['person_info']
            // 先默认加载第一个人体
            let attributes = personInfo[index-1]['attributes']
            console.log(attributes)
            // let attresult = result.root
            // 配置文件中的属性
            let allAttributes = Attributes
            //
            // 设置属性
            for (let key in allAttributes) {
              // 属性名：代码 & 属性值
              fileItem[key] = {}
              let lbel = attributes[key]['name']
              let code = attributes[key]['code']
              fileItem[key]['code'] = code
              fileItem[key]['lbel'] = lbel
              console.log('fileItem[key]', fileItem[key])
            }


            vm.fileItem = fileItem
            // 设置属性

            debugger
            vm.$parent.$refs.objectList.setFileItem(fileItem)
            vm.$parent.$refs.objectList.curBodyIndex = index
            vm.$parent.$refs.objectList.bodyNum = jsonData['person_num']

            vm.changeCurBodyStyle()

            // parser.parseString(data, function (error, result) {
            //   if (error) {
            //     vm.$Message.error(error)
            //     console.log(error)
            //   } else {
            //     let attresult = result.root
            //     let allAttributes = Attributes
            //     // console.log('arrresult : ', JSON.stringify(attresult))
            //     // console.log('fileItem : ', JSON.stringify(fileItem))
            //     for (var key in allAttributes) {
            //         fileItem[key] = {}
            //         let lbel = attresult[key][0]['lbel'][0]
            //         let code = attresult[key][0]['code'][0]
            //         fileItem[key]['code'] = code
            //         fileItem[key]['lbel'] = lbel
            //         // console.log('fileItem[key]', fileItem[key])
            //     }
            //     vm.$parent.$refs.objectList.setFileItem(vm.fileItem)
            //   }
            // })
          }
        })
      },
      // 保存图片属性到文件
      saveFileItemObjects (bodyIndex) {

        debugger
        let fileItem = this.fileItem
        this.imageUrl = 'file://' + fileItem.directory + '/' + fileItem.image
        // load annotation
        const vm = this
        let annotationPath = fileItem.directory + '/' + fileItem.annotation
        fs.readFile(annotationPath, 'utf-8', function (error, data) {
          //debugger
          if (error) {
            vm.$Message.error(error)
            console.log(error)
          } else {
            // 拿到JSON文件
            let jsonData = JSON.parse(data)
            // 第几个人体数据
            //let curBodyIndex = vm.$parent.$refs.objectList.curBodyIndex

            // 拿到该人体所对应的属性数据
            let attresult = jsonData['person_info'][bodyIndex-1]['attributes']
            console.log(attresult)
            let lbel = ''
            let code = 0
            // 循环所有的属性
            for (let key in Attributes){
              // 当前选中的按钮值
                lbel = fileItem[key]['lbel']
                code = Attributes[key].indexOf(lbel) + 1
                attresult[key]['name'] = lbel
                attresult[key]['code'] = code
            }
            // debugger
            // 把整个JSONData写回去
            //let filename = this.fileItem.directory + this.fileItem.annotation
            fs.writeFile(annotationPath, JSON.stringify(jsonData,null,"\t"),"utf-8", function (err){
              if (err) {
                return console.log(err)
              } else {
                vm.$parent.$refs.objectList.isChanged = false
                vm.$Message.success('修改成功')
                // console.log('写入成功')
              }
            })
            // fs.writeFile(annotationPath, builder.buildObject(attresult), 'utf-8', function (err) {
            //
            // })

            // xml2js.parseString(data, function (error, result) {
            //   if (error) {
            //     vm.$Message.error(error)
            //     console.log(error)
            //   } else {
            //     let attresult = result.root
            //     let lbel = ''
            //     let code = 0
            //     for (var key in Attributes){
            //         lbel = fileItem[key]['lbel']
            //         code = Attributes[key].indexOf(lbel) + 1
            //         attresult[key][0]['lbel'][0] = lbel
            //         attresult[key][0]['code'][0] = code
            //     }
            //     fs.writeFile(annotationPath, builder.buildObject(attresult), 'utf-8', function (err) {
            //       if (err) {
            //         return console.log(err)
            //       } else {
            //         vm.$Message.success('修改成功')
            //         // console.log('写入成功')
            //       }
            //     })
            //   }
            // }
            // )
          }
        })
      },
      unselectAllBoundingBox () {
        this.fileItem.objects.forEach(function (object) {
          object.selected = false
        })
        this.$children.forEach(function (boundingBox) {
          boundingBox.$refs.root.style.zIndex = 1
        })
      },
      dragImageStart (event) {
        // replace drag image with a hidden image
        // event.dataTransfer.setDragImage(document.getElementById('ghost'), 0, 0)
        // this.dragX = event.x
        // this.dragY = event.y
      },
      dragImagePeriod (event) {
        // if (event.x === 0 && event.y === 0) return
        // let offsetX = event.x - this.dragX
        // let offsetY = event.y - this.dragY
        // this.fileItem.x += offsetX
        // this.fileItem.y += offsetY
        // this.fileItem.objects.forEach(function (object) {
        //   object.originX += offsetX
        //   object.originY += offsetY
        // })
        // this.dragX = event.x
        // this.dragY = event.y
      },
      changeImageAndBodyProp(prop){
        // 改变定位
        let imgDiv = document.getElementById("img-wrap")
        // 得到放大之后图片的宽和高
        let originWidth = this.fileItem.objects[0].width
        let originHeight = this.fileItem.objects[0].height

        // 更改图片的宽和高
        this.iHeight = originHeight * prop
        this.iWidth = originWidth * prop

        // 图片居中显示
        if(originWidth * prop > imgDiv.clientWidth){
          this.iLeft = 0
        }else{
          this.iLeft = (imgDiv.clientWidth - originWidth * prop) / 2
        }

        if(originHeight * prop > imgDiv.clientHeight){
          this.iLeft = 0
        }else{
          this.iTop = (imgDiv.clientHeight - originHeight * prop ) / 2
        }
        // this.iLeft = (imgDiv.clientWidth - originWidth * prop) / 2
        // this.iTop = (imgDiv.clientHeight - originHeight * prop ) / 2
        console.log("iLeft" + this.iLeft)

        // 同时改变框的位置
        let bodyMarks = document.getElementsByClassName('body-mark')

        debugger
        // let prop = imgDiv.clientWidth / img.width
        for(let i=0;i<bodyMarks.length;i++){

          // 得到所有的人体框
          // bodyMarks[i].style.transform = "scale(" + scaleLevel[scaleIndex + 1] + ")"
          bodyMarks[i].style.width = this.humanBodys[i].width * prop + 'px'
          bodyMarks[i].style.height = this.humanBodys[i].height * prop + 'px'
          // 改变人体框的位置
          bodyMarks[i].style.left = (this.humanBodys[i].left * prop + this.iLeft) + 'px'
          bodyMarks[i].style.top = (this.humanBodys[i].top * prop + this.iTop) + 'px'
          // bodyMarks[i].remove()
        }
      },
      // 放大图片
      zoomIn () {
        debugger
        const scaleLevel = this.SCALE_LEVEL
        console.log("zoomIn" + scaleLevel)
        let scaleIndex = scaleLevel.findIndex(value => value === this.fileItem.scale)
        if (scaleIndex < scaleLevel.length - 1) {
          this.fileItem.scale = scaleLevel[scaleIndex + 1]
          this.fileItem.objects.forEach(function (object) {
            object.scale = scaleLevel[scaleIndex + 1]
          })

          this.changeImageAndBodyProp(scaleLevel[scaleIndex + 1])

          // transform: scale(1.2);
          // alert(vm.iLeft + "   " +  vm.iTop)
        } else {
          this.$Message.warning('Max scale level')
        }
      },
      // 缩小图片
      zoomOut () {
        debugger
        // 有几个放缩的比例： 0.2,0.4,0.6,0.8,1,1.2,1.4,1.6,1.8,2,3,4
        const scaleLevel = this.SCALE_LEVEL
        let scaleIndex = scaleLevel.findIndex(value => value === this.fileItem.scale)
        if (scaleIndex > 0) {
          // 需要放缩的比例
          this.fileItem.scale = scaleLevel[scaleIndex - 1]
          this.fileItem.objects.forEach(function (object) {
            object.scale = scaleLevel[scaleIndex - 1]
          })

          this.changeImageAndBodyProp(scaleLevel[scaleIndex - 1])

        } else {
          this.$Message.warning('Min scale level')
        }
      }
    }
  }

</script>

<style scoped>
    .display {
        position: relative;
        overflow: hidden;
    }
    .scale {
        position: absolute;
        top: 0;
        left: 1vmin;
        font-size: 4vmin;
        color: #ed4014;
        z-index: 1000;
    }
    .origin {
        position: absolute;
        top: 0;
        right: 1vmin;
        font-size: 4vmin;
        color: #ed4014;
        z-index: 1000;
    }
    .card {
        position: absolute;
        top: 0;
        left: 1vmin;
        font-size: 4vmin;
    }

    /*.attr >>> .iview-class{*/
    /*    position: absolute;*/
    /*    top: 40px;*/
    /*    right: 1vmin;*/
    /*    font-size: 4vmin;*/
    /*}*/
</style>
<style>
  .attr {
    position: absolute;
    top: 0;
    right: 1vmin;
    font-size: 4vmin;
    line-height: 0;
  }

  .d-body{
    /*background: url("../../../../assets/000006.jpg") no-repeat;
    width:500px;
    height:355px;*/
  }
  .img-wrap{

  }
</style>