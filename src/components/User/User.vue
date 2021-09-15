<template>
  <div>
    <!-- 面包屑导航去模块 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <!-- 输入框区 -->
      <el-row :gutter="20">
        <!-- input输入框这一行 -->
        <el-col :span="9"
          ><el-input placeholder="请输入内容">
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <!-- 按钮这一行 -->
        <el-col :span="4">
          <el-button type="primary">添加</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <!-- data表示需要绑定的数据源，prop要渲染的数据项，label渲染这一列的标题 -->
      <el-table :data="userList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 状态列的作用域插槽 -->
          <template v-slot="scope">
            <!-- 获得这个一行的数据 -->
            <!-- {{ scope.row }} -->
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作列的作用域插槽 -->
          <template v-slot:="scope">
            <!-- 修改按钮 -->
            <el-tooltip content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <!-- 用到tooltip文件提示组件 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    return {
      //定义一个空数组来接收数据
      userList: [],
      //接收后台数据的信息
      queryInfo: {
        //查询参数
        query: '',
        //当前页码值
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      //总条数
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    //监听pagesize发送改变的事件
    handleSizeChange (newSize) {
      //1.只要发生改变就把新数据赋值给它
      this.queryInfo.pagesize = newSize
      //2.重新获取数据
      this.getUserList()
    },
    //页码值pagenum发送改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>