import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from "@/components/HelloWorld";
import MainPage from '@/views/index/MainPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    }
  ]
})
