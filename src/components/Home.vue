<template>
  <div>
    Home 组件
    <el-button type="info" @click="LoginOut">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    //退出home页面
    LoginOut () {
      //1.点击退出按钮之后，要清除token值
      window.sessionStorage.clear()
      //2.用路由导航跳转到login页面
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>