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
        <!-- v-model双向数据绑定queryInfo 的query(关键字才可以搜索) -->
        <el-col :span="9"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button> </el-input
        ></el-col>
        <!-- 按钮这一行 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
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
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 操作列的作用域插槽 -->
          <template v-slot:="scope">
            <!-- 修改按钮 -->
            <!-- 点击了修改之后就添加一个修改用户信息的对话框 -->
            <el-tooltip content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              >
              </el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <!-- 点击删除按钮就拿到这一行的数据 -->
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUsersById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <!-- 用到tooltip文件提示组件 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
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
    <!-- 添加用户区域Dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 主体区域 -->
      <!-- 添加有验证规则的form表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- form区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限管理的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：<el-select v-model="SelectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      //判断
      if (regEmail.test(value)) {
        //合法邮箱
        return cb()
      }
      //非法邮箱
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
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
      total: 0,
      //定义对话框不显示
      addDialogVisible: false,
      //定义添加用户的对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //定义验证规则对象
      addFormRules: {
        username: [
          //required必填项
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱', trigger: 'blur' },
          //邮箱的验证 用自定义校验规则
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //定义修改用户的对话框的显示和隐藏
      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      //修改表格的验证规则对象
      editFormRules: {
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //分配权限的对话框的默认
      setRightDialogVisible: false,
      //需要被分配角色的用户信息
      userInfo: {
      },
      //所有角色的数据列表
      rolesList: [],
      //数据双向绑定
      SelectedRoleId: ''
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
    },
    //监听开关的状态
    async userStateChange (userInfo) {
      // console.log(userInfo)
      //得到一个布尔值
      //这里的uid是动态数据，我们要模板字符串
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        //1.如果失败则把状态还原
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      console.log(res)
    },
    //当关闭时给dailog添加重置表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    //在确定前给表单进行预校验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    //添加修改用户信息的方法
    async showEditDialog (id) {
      //点击按钮让修改用户的对话框显示出来
      //console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
      })
    },
    //通过id来删除对应的用户
    async removeUsersById (id) {
      //因为删除前不能直接删除，还需要确认，所以这里可以用messageBox组件里的确认消息框
      //因为confirm返回的是promise对象，所以可以用await和async来接收
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {//如果这个结果不等于confirm字符串，则说明是已取消的
        return this.$message.info('您已经取消删除')
      }
      //否则走删除
      const { data: res } = await this.$http.delete('users/' + id)
      // console.log(res)  第一个是不允许删除的
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.getUserList()
      this.$message.success('删除用户成功')
    },
    //控制分配权限的对话的显示和隐藏
    async showSetRightDialog (userInfo) {
      this.userInfo = userInfo
      //在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      this.setRightDialogVisible = true
      console.log(res)
    },
    //保存角色信息
    async saveRoleInfo () {
      if (!this.SelectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      //如果有选择，则通过put获取请求
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.SelectedRoleId })
      if (res.meta.status !== 200) {
        this.$message.error('更新角色失败')
      }
      this.$message.success('获取角色成功')
      this.getUserList()
      this.setRightDialogVisible = false
    },
    //角色对话框的关闭事件
    setRoleDialogClosed () {
      this.SelectedRoleId = '',
        this.userInfo = ''
    }
  }
}
</script>

<style lang="less" scoped>
</style>