import Vue from 'vue'
import VueRouter from 'vue-router'
//导入需要用到的组件
import Login from '@/components/Login.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    //设置登录页面的路由规则，并设置重定义的路由规则
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login}
  ]
})

export default router
