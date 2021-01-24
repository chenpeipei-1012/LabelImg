<template>
  <div id="app" class="app">
    <!-- 路由匹配到的组件将显示在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'label-img'
  }
</script>

<style scoped>
  .app {
    height: 100%;
    margin:0;
    padding:0;
  }
</style>
