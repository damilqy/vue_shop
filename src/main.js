import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局css样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入vue-table插件
import TreeTable from 'vue-table-with-tree-grid'
//导入axios的包
import axios from 'axios'
//请求更路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在进行挂载前先添加拦截器（interceptors）
axios.interceptors.request.use(config =>{
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //必须要return
  return config
})
//通过vue原型对象进行$http的挂载
Vue.prototype.$http = axios

Vue.config.productionTip = false
//注册tree的插件
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
