import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // 在vue项目中 @ 符号代表的是根目录，即 src 目录。
      component: require('@/components/Home').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
