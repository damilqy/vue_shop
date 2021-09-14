import Vue from 'vue'
import VueRouter from 'vue-router'
//导入需要用到的组件
import Login from '@/components/Login.vue'
//导入home的组件
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    //设置登录页面的路由规则，并设置重定义的路由规则
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home}
  ]
})
//设置路由前置守卫
router.beforeEach((to,from,next)=>{
  //如果访问的是login页面则直接放行
  if (to.path == '/login') return next()
  //并且保存token值
  const tokenStr = window.sessionStorage.getItem('token')
  //没有token值，强制跳转到login页面
  if(!tokenStr) return next('/login')
  //有的话直接放行
  next()
})

export default router
