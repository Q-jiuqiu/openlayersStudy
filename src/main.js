/*
 * @Author: quling
 * @Date: 2022-02-16 17:07:06
 * @LastEditors: quling
 * @LastEditTime: 2022-09-13 10:24:19
 * @Description:
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

// 全局css
// import './styles/global.scss'

Vue.config.productionTip = false
Vue.prototype.$axios = axios // 全局注册，使用方法为:this.$axios

Vue.use(ViewUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
