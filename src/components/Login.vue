<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 设置头部的样式 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 利用element-ui来设置登录form表单 -->
      <!-- 1.给表单添加数据绑定 -->
      <!-- 2.对表单进行验证 -->
      <!-- 3.添加表单的重置按钮 -->
      <el-form
        ref="LoginFormRef"
        class="login_form"
        :model="LoginForm"
        :rules="LoginFormRules"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            prefix-icon=" iconfont icon-user"
            v-model="LoginForm.username"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="LoginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="Login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      //这个是登录表单的对象
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      //验证规则对象
      LoginFormRules: {
        //需要验证用户名
        username: [
          //required是必填的项
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //需要验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //ref引用后的实例对象
    resetLoginForm () {
      //重置表单
      this.$refs.LoginFormRef.resetFields()
    },
    //表单登录前的预校验
    Login () {
      //拿取得还是loginform的实例对象
      this.$refs.LoginFormRef.validate(async valid => {
        //判断valid的true或false
        if (!valid) return;
        const { data: res } = await this.$http.post('login', this.LoginForm)
        console.log(res)
      })
    }
  }
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