<template>
    <div class="home">
        <func-list ref="funcList" class="func-list"></func-list>
        <display ref="display" class="display"></display>
        <object-list ref="objectList" class="object-list"></object-list>
        <!-- 是否展示还文件详情列表： 默认不展示
        <Drawer title="文件列表" :draggable="true" v-model="fileItemsShowFlag">
            <CellGroup style="width: fit-content;">
                <template v-for="(item, index) in fileItems">
                  <Cell :title="item.annotation" :selected="item.selected" @click.native="openFile(index)" style="padding: 0 0 0 0;"/>
                </template>
            </CellGroup>
        </Drawer>  -->
    </div>
</template>

<script>
  import FuncList from './children/FuncList'
  import Display from './children/Display'
  import ObjectList from './children/ObjectList'
  export default {
    name: 'Home',
    components: {FuncList, Display, ObjectList},
    data () {
      return {
        fileItemsShowFlag: false,
        fileItemsSelectedIndex: -1,
        fileNums: 1,
        fileItems: [{
          directory: '',
          annotation: '',
          image: '',
          x: 0,
          y: 0,
          scale: 1,
          objects: []
        }]
      }
    },
    methods: {
      // 展示文件详情： fileItems中包含目录
      showFileItems (fileItems) {
        //debugger
        if (fileItems) {
          // 如果有值，清空原有的列表页面
          // 重新渲染新页面
          this.fileItems = fileItems
          this.fileNums = this.fileItems.length
          this.$refs.objectList.fileItems = fileItems
        }
        // this.fileItemsShowFlag = true
      },
      // 打开文件
      openFile (index) {
        debugger
        this.fileItems.forEach(item => (item.selected = false))
        this.fileItems[index].selected = true
        this.fileItemsSelectedIndex = index
        let fileItem = this.fileItems[index]
        // console.log('JSON.stringify前的fileItem：', fileItem)
        // console.log('JSON.stringify后的fileItem：', JSON.stringify(fileItem))   //前后不一样啊老哥  emmmm好像异步还是没有怎么搞懂哎
        this.$refs.display.loadImgAttr(fileItem)
        this.$refs.objectList.$forceUpdate()


      },
      getIndex () {
        console.log('当前的打开的是', this.fileItemsSelectedIndex)
        return this.fileItemsSelectedIndex
      },
      getFileNums(){
          // console.log('总共多少图片：', this.fileNums)
          return this.fileNums
      },
      reloadImgAndAttr(fileItem){
          //
        this.$refs.display.loadImgAttr(fileItem)
        this.$refs.objectList.$forceUpdate()
      }
    }
  }
</script>

<!-- 整个页面布局 -->
<style scoped>
    .home {
        height: 100%;
        margin:0;
        padding:0;
        display: flex;
        flex-direction: row;
    }
    .func-list {
        width: 8%;
        height: 100%;
    }
    .display {
        width: 62%;
        height: 100%;
        background: #dcdee2;
        overflow: auto;
    }
    .object-list {
        width: 30%;
        height: 100%;

    }
</style>
