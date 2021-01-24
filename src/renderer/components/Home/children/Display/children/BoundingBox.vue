<template>
    <div class="bounding-box" ref="root" :draggable="false" :style="boxStyle">
        <span class="object-name">{{name}}</span>
        <span class="border" v-show="selected"></span>
        <span class="top-edge" v-show="selected"></span>
        <span class="bottom-edge" v-show="selected"></span>
        <span class="left-edge" v-show="selected"></span>
        <span class="right-edge" v-show="selected"></span>
        <span class="internal-area" :draggable="true"
              v-contextmenu:contextmenu
              @click="selectBoundingBox()"
              @dragstart="dragStart($event)"
              @drag="dragInternalArea($event)"></span>
        <span class="left-top-vertex" :draggable="true"
              @dragstart="dragStart($event)"
              @drag="dragLeftTopVertex($event)"></span>
        <span class="right-top-vertex" :draggable="true"
              @dragstart="dragStart($event)"
              @drag="dragRightTopVertex($event)"></span>
        <span class="left-bottom-vertex" :draggable="true"
              @dragstart="dragStart($event)"
              @drag="dragLeftBottomVertex($event)"></span>
        <span class="right-bottom-vertex" :draggable="true"
              @dragstart="dragStart($event)"
              @drag="dragRightBottomVertex($event)"></span>
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item>菜单1</v-contextmenu-item>
            <v-contextmenu-item>菜单2</v-contextmenu-item>
            <v-contextmenu-item>菜单3</v-contextmenu-item>
        </v-contextmenu>
    </div>
</template>

<script>
  export default {
    name: 'BoundingBox',
    data () {
      return {
        originX: this.value.originX,
        originY: this.value.originY,
        x: this.value.x,
        y: this.value.y,
        width: this.value.width,
        height: this.value.height,
        scale: this.value.scale,
        name: this.value.name,
        selected: this.value.selected,
        dragX: 0,
        dragY: 0
      }
    },
    props: {
      value: Object
    },
    watch: {
      value: {
        handler (val) {
          this.originX = val.originX
          this.originY = val.originY
          this.x = val.x
          this.y = val.y
          this.width = val.width
          this.height = val.height
          this.scale = val.scale
          this.name = val.name
          this.selected = val.selected
        },
        deep: true
      }
    },
    computed: {
      boxStyle () {
        return {
          'position': 'absolute',
          'left': (this.originX + this.scale * this.x) + 'px',
          'top': (this.originY + this.scale * this.y) + 'px',
          'width': this.width + 'px',
          'height': this.height + 'px',
          'transform-origin': 'left top',
          '-webkit-transform': 'scale(' + this.scale + ')',
          'z-index': 1
        }
      }
    },
    methods: {
      updateDisplayObject () {
        this.$emit('input', {
          originX: this.originX,
          originY: this.originY,
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
          scale: this.scale,
          name: this.name,
          selected: this.selected
        })
      },
      selectBoundingBox () {
        this.$parent.unselectAllBoundingBox()
        this.selected = true
        this.$refs.root.style.zIndex = 2
        this.updateDisplayObject()
      },
      dragStart (event) {
        // replace drag image with a hidden image
        event.dataTransfer.setDragImage(document.getElementById('ghost'), 0, 0)
        this.selectBoundingBox()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      },
      dragInternalArea (event) {
        if (event.x === 0 && event.y === 0) return
        this.x += event.x - this.dragX
        this.y += event.y - this.dragY
        this.updateDisplayObject()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      },
      dragLeftTopVertex (event) {
        if (event.x === 0 && event.y === 0) return
        let offsetX = event.x - this.dragX
        let offsetY = event.y - this.dragY
        this.x += offsetX
        this.width -= offsetX
        this.y += offsetY
        this.height -= offsetY
        this.updateDisplayObject()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      },
      dragRightTopVertex (event) {
        if (event.x === 0 && event.y === 0) return
        let offsetX = event.x - this.dragX
        let offsetY = event.y - this.dragY
        this.y += offsetY
        this.height -= offsetY
        this.width += offsetX
        this.updateDisplayObject()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      },
      dragLeftBottomVertex (event) {
        if (event.x === 0 && event.y === 0) return
        let offsetX = event.x - this.dragX
        let offsetY = event.y - this.dragY
        this.x += offsetX
        this.width -= offsetX
        this.height += offsetY
        this.updateDisplayObject()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      },
      dragRightBottomVertex (event) {
        if (event.x === 0 && event.y === 0) return
        let offsetX = event.x - this.dragX
        let offsetY = event.y - this.dragY
        this.width += offsetX
        this.height += offsetY
        this.updateDisplayObject()
        this.dragX = event.x
        this.dragY = event.y
        event.stopPropagation()
      }
    }
  }
</script>

<style scoped>
    .bounding-box {
        /*z-index: 1;*/
    }
    .object-name {
        position: absolute;
        top: -4vmin;
        left: -0.5vmin;
        color: #2679f4;
        font-size: 3vmin;
        /*opacity: 1;*/
    }
    .border {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(51,102,255,.75);
    }
    .internal-area {
        position: absolute;
        width: 100%;
        height: 100%;
        cursor: move;
        background-color: white;
        opacity: 0.2;
    }
    .right-top-vertex {
        position: absolute;
        top: -2px;
        right: -2px;
        cursor: ne-resize;
        width: 5px;
        height: 5px;
        background-color: #69f;
        opacity: 1;
    }
    .left-top-vertex {
        position: absolute;
        top: -2px;
        left: -2px;
        cursor: nw-resize;
        width: 5px;
        height: 5px;
        background-color: #69f;
        opacity: 1;
    }
    .left-bottom-vertex {
        position: absolute;
        bottom: -2px;
        left: -2px;
        cursor: sw-resize;
        width: 5px;
        height: 5px;
        background-color: #69f;
        opacity: 1;
    }
    .right-bottom-vertex {
        position: absolute;
        bottom: -2px;
        right: -2px;
        cursor: se-resize;
        width: 10px;
        height: 10px;
        background-color: #69f;
        opacity: 1;
    }
    .top-edge {
        position: absolute;
        left: 0;
        right: 0;
        top: -2px;
        height: 5px;
        background-color: #69f;
        opacity: 0.2;
    }
    .bottom-edge {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 5px;
        background-color: #69f;
        opacity: 0.2;
    }
    .left-edge {
        position: absolute;
        top: 0;
        bottom: 0;
        left: -2px;
        width: 5px;
        background-color: #69f;
        opacity: 0.2;
    }
    .right-edge {
        position: absolute;
        top: 0;
        bottom: 0;
        right: -2px;
        width: 5px;
        background-color: #69f;
        opacity: 0.2;
    }
</style>
