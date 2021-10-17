import Vue from 'vue'
import VueRouter from 'vue-router'
//导入需要用到的组件
import Login from '@/components/Login.vue'
//导入home
import Home from '@/components/Home.vue'
//导入welcome
import Welcome from '@/components/Welcome.vue'
//导入子路由user
import User from '@/components/User/User.vue'
//导入子路由right.vue
import Rights from '@/components/power/Rights.vue'
//导入roles
import Roles from '@/components/power/Roles.vue'
//导入Cate组件
//导入Cate.vue 
import Cate from '@/components/goods/Cate.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    //设置登录页面的路由规则，并设置重定义的路由规则
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    //设置home主页的路由规则
    {path:'/home',component:Home,redirect:'/welcome',
    children:[
    {path:'/welcome',component:Welcome},
    {path:'/users',component:User},{path:'/rights',component:Rights},{path:'/roles',component:Roles},{path:'/categories',component:Cate}
    ]}
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
