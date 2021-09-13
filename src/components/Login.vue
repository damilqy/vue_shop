<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 设置头部的样式 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 利用element-ui来设置登录form表单 -->
      <el-form class="login_form">
        <!--用户名-->
        <el-form-item>
          <el-input prefix-icon=" iconfont icon-user"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary">>登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  width: 450px;
  height: 300px;
  background-color: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    display: flex;
    //利用弹性盒模型，来固定
    justify-content: flex-end;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    //设置成css3盒模型
    box-sizing: border-box;
  }
}
</style>