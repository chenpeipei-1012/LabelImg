<template>
    <div>
    <Card title="属性列表" style="height:60%" v-bind:id="curBodyIndex" >
      <div v-if="active">
        <div>
          <span>{{curBodyIndex}}</span>/<span>{{bodyNum}}</span>
          <span v-if="isChanged" class="changed">*(当前人体属性值有更改)</span>
        </div>
        <template v-for="(values, attri) in this.allAttributes" >
          <Card>
            <span style="width: 155px;display: inline-block">{{attri}}</span>
            <RadioGroup v-model="fileItem[attri]['lbel']" >
              <template v-for="value in values">
                <Radio :label="value" @change.native="recordChange()">{{value}}</Radio>
              </template>
            </RadioGroup>
          </Card>
        </template>
        <!-- 上一个人体，下一个人体的按钮 -->
        <div>
          <button @click="changePreBody()" class="bodyBtn">上一个</button>
          <button @click="changeNextBody()" class="bodyBtn">下一个</button>
        </div>

        <div style="padding: 20px">
          <p>注意</p>
          <p>
            1: 切换人体或图片时已更改的属性自动保存<br>

          </p>
        </div>
      </div>
    </Card>
    <!-- 选中目录下所有图片的信息 -->
    <div class="pic-list" style="overflow-y: auto">
      <CellGroup>
        <template v-for="(item, index) in fileItems">
          <div>
            <input type="checkbox" disabled="true" checked="true" style="position: relative;top: -5px;"/>
            <Cell :title="item.annotation" :selected="item.selected" @click.native="openFile(index)" style="padding: 0 0 0 0;display:inline-block"/>
          </div>
        </template>
      </CellGroup>
    </div>
    </div>
</template>

<script>
  import Attributes from '../../../../config/attributes'
  export default {
    name: 'ObjectList',
    data () {
      return {
        fileItem: {},
        allAttributes: [],
        // Vue是数据驱动的，只要绑定的数据发生了改变，就会重新加载某些地方
        fileItems:{},
        curBodyIndex:0,
        bodyNum:0,
        active : false,
        isChanged: false
      }
    },
    created () {
      // 获取配置文件
      this.allAttributes = Attributes
      for (let attri in this.allAttributes) {
          this.fileItem[attri] = {}
          this.fileItem[attri]['code'] = 0
          this.fileItem[attri]['lbel'] = ''
      }
    },
    methods: {
      // 记录输入框是否有更改
      recordChange(){
        this.isChanged = true
      },
      changePreBody(){
        // 当前人体索引  bodyNum
        debugger
        // 先保存值
        this.$parent.$refs.funcList.saveFileItemObjects(this.curBodyIndex)
        if(this.curBodyIndex == 1){
          // 已经是第一个了，变为最后一个
          this.curBodyIndex = this.bodyNum
        }else{
          this.curBodyIndex--;
        }

        // 切换属性
        this.$parent.$refs.display.loadImgAttr(this.fileItem, this.curBodyIndex);
        //this.$parent.$refs.display.changeCurBodyStyle()
      },
      changeNextBody(){
        debugger
        this.$parent.$refs.funcList.saveFileItemObjects(this.curBodyIndex)
        if(this.curBodyIndex == this.bodyNum){
          // 已经是最后一个，变为第一个
          this.curBodyIndex = 1
        }else{
          this.curBodyIndex++;
        }

        // 切换属性
        // this.$parent.$refs.funcList.saveFileItemObjects()
        this.$parent.$refs.display.loadImgAttr(this.fileItem, this.curBodyIndex);
        //this.$parent.$refs.display.changeCurBodyStyle()
      },
      setFileItem (newfileItem) {
        debugger
        let vm = this;

        vm.fileItem = newfileItem
        this.$forceUpdate()
        // console.log('newfileItem', JSON.stringify(newfileItem))
      },
      // 打开文件
      openFile (index) {
        // 切换图片
        // 先保存值
        this.$parent.$refs.funcList.saveFileItemObjects(this.curBodyIndex)
        debugger
        this.fileItems.forEach(item => (item.selected = false))
        this.fileItems[index].selected = true
        this.fileItemsSelectedIndex = index
        let fileItem = this.fileItems[index]
        // console.log('JSON.stringify前的fileItem：', fileItem)
        // console.log('JSON.stringify后的fileItem：', JSON.stringify(fileItem))   //前后不一样啊老哥  emmmm好像异步还是没有怎么搞懂哎
        // TODO
        // 更新图片, 调用Display的某个方法
        // 兄弟组件通信，通过父组件交互，子组件1调用父组件方法，父组件对应方法调用子组件2的方法
        this.$parent.$refs.display.loadImage(fileItem)
        // 更新属性列表
        //this.$refs.objectList.$forceUpdate()
      }
    }
  }
</script>

<style scoped>
.pic-list{
  background: #fff ;
  height:40%;
  padding: 20px;
  border: 1px solid #dcdee2;
  border-color: #e8eaec;
}

.f-item{
  width:100%;
}

.bodyBtn{
  cursor: pointer;
}

.active{
  display: block;
}

.inActive{
  display: none;
}

.changed{
  color: red;
}
</style>
