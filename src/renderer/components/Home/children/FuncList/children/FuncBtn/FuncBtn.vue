<template>
    <Button :type="button" class="func-btn">
        <div class="func-icon"><Icon :type="icon"></Icon></div>
        <div class="func-text">{{text}}</div>
    </Button>
</template>

<script>
  export default {
    name: 'FuncBtn',
    props: {
      icon: String,
      button: String,
      text: String
    },
    methods: {
    }
  }
</script>

<style scoped>
    .func-btn {
        position: relative;
        width: 80%;
        padding: 80% 0 0 0;
        margin: 5% 0 5% 0;
        align: center;
    }
    .func-icon {
        position: absolute;
        top: 10%;
        left: 0;
        bottom: 0;
        right: 0;
        text-align: center;
        font-size: 4.4vmin;
    }
    .func-text {
        position: absolute;
        top: 62%;
        left: 0;
        bottom: 0;
        right: 0;
        text-align: center;
        font-size: 2.1vmin;
        color: white;
    }
</style>
