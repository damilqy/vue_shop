<template>
  <!-- 用布局容器container来进行布局 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!--头部区域里面有一个图片和一段文字 -->
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="LoginOut">退出</el-button>
    </el-header>
    <!-- container布局容器 -->
    <el-container>
      <!-- aside左侧区域 -->
      <!-- 因为这里用了toggle来控制左侧的宽度，就补=不能写死，要做一个判断它折叠时的宽度是多少 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 1.用el-submenu作为一级菜单，el-menu-item作为二级菜单 -->
        <!-- 2.navmenu导航菜单 -->
        <!-- 3.用unique-opened可以使列表只展开一个的 -->
        <!-- 4.toggle这个是用来控制展开和隐藏的 ,在data里面定义一个collapse的布尔值来控制，相当于开关-->
        <!-- 开启router规则，就会把index当做路径来跳转 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4091ff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 在我们拿取了后台数据之后，我们用过v-for渲染数据 ,可以得到我们的ui结构-->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 通过第三方字体图标来改fonts,这里不应该写死，应该动态绑定 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 因为index是值，这边要转换为字符串 -->
            <!-- 因为现在激活了router，它是用index的path来做路径的，所以我们这边要把刚刚的subItem.id 改为subItem.path -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右边主体区 -->
      <el-main>
        <!-- 放一个welcome的占位符（子路由） -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      //这里因为一级分类里面所有的小图片都不一样，所有我们直接建一个对象
      iconsObj: {
        //在这里面通过k[值],k就是item.id   id , 值（icons）
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      //被激活的路径
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    //当home组件刚被创建时就把sessionStorage里面的值拿出来赋值给左侧的菜单
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //退出home页面
    LoginOut () {
      //1.点击退出按钮之后，要清除token值
      window.sessionStorage.clear()
      //2.用路由导航跳转到login页面
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
      this.menuList = res.data
      console.log(res.data)
    },
    toggleCollapse () {
      //点击这个toggle时，会控制左侧侧边栏的展开和折叠
      this.isCollapse = !this.isCollapse
    },
    //定义路由链接被激活的方法
    saveNavState (activePath) {
      //1.当点击了二级菜单里的路由链接，就把它存贮起来    将需要被激活的路由路径，后面这是activePath 是需要被激活的理由路径的名字
      window.sessionStorage.setItem('activePath', activePath)
      //2.需要重新赋值
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  //采用弹性布局，让其左右贴边对齐
  justify-content: space-between;
  //让其贴边，不要做padding
  padding-left: 0;
  //让右边的按钮居中对齐
  align-items: center;
  //字体颜色为白色
  color: #fff;
  font-size: 20px;
  > div {
    //给里面的盒子一个弹性布局
    display: flex;
    //让其对齐
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  text-align: center;
  //调整线之间的距离
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>