<template>
  <div>
    <!-- 面包屑导航去模块 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <template>
        <el-table :data="roleList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template v-slot:="scope">
              <el-row
                :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                v-for="(item1, i1) in scope.row.children"
                :key="item1.id"
              >
                <!-- 渲染一级 -->
                <el-col :span="5">
                  <el-tag
                    closable
                    @close="removeRightById(scope.row, item1.id)"
                  >
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染二级和三级 -->
                <el-col :span="19">
                  <!-- 渲染二级和三级权限 -->
                  <el-row
                    v-for="(item2, i2) in item1.children"
                    :key="item2.id"
                    :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  >
                    <!-- 二级权限 -->
                    <el-col :span="6">
                      <el-tag
                        type="success"
                        closable
                        @close="removeRightById(scope.row, item2.id)"
                        >{{ item2.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限 -->
                    <el-col :span="18">
                      <el-tag
                        @close="removeRightById(scope.row, item3.id)"
                        closable
                        type="warning"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作">
            <!-- 操作区作用域插槽模板 -->
            <template v-slot:="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeRoles(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 添加显示分配全限的对话框 -->
    <el-dialog
      @close="setRightDialogClosed"
      title="分配全限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- tree树形空件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesClosed">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加编辑的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="70%"
      @close="editDialogClosed"
    >
      <!-- 内容字体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      //角色列表
      roleList: [],
      //定义对话框不显示
      addDialogVisible: false,
      //添加角色列表
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //验证规则对象
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      //定义修改用户的对话框的显示和隐藏
      editDialogVisible: false,
      editForm: {
        roleDesc: '',
        roleName: ''
      },
      editFormRules: {
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      //控制分配权限的对话框的显示和隐藏
      setRightDialogVisible: false,
      //所有权限的数据
      rightsList: [],
      //树形控件的绑定对象
      treeProps: {
        // 我们看到的属性（名字）
        label: 'authName',
        // 里面嵌套的孩子的属性
        children: 'children'
      },
      //默认展开时勾选的id值数组
      defkeys: [],
      //定义拿取分配权限里的默认id
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('角色列表获取失败')
      }
      this.roleList = res.data
      console.log(res)
    },
    //关闭对话框重置表单
    addDialogClosed () {
      this.$refs.addRolesFormRef.resetFields()
    },
    //对表格进行预校验
    addRolesClosed () {
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    //修改角色表单
    async showEditDialog (id) {
      // console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
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
        const { data: res } = await this.$http.put('roles/' + this.editForm.id, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户失败')
        }
        this.getRolesList()
        this.editDialogVisible = false
        this.$message.success('修改用户信息成功')
      })
    },
    async removeRoles (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${this.editForm.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //删除ID对应的全向
    async removeRightById (role, rightId) {
      //弹框提示用户是否要真的删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles / ${role.id} / rights / ${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除文件失败')
      }
      this.$message.success('删除文件成功')
      // this.getRolesList()
      role.children = res.data
      //这样可以防止整个页面刷新
    },
    //显示分配角色对话框的处理函数
    async showSetRightDialog (role) {
      this.roleId = role.id
      //调用获取分配全限的API
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data
      //需要再对话框显示之前调用getLeafKeys
      this.getLeafKeys(role, this.defkeys)

      //控制分配权限的对话框的显示
      this.setRightDialogVisible = true
      console.log(res)
    },
    //通过递归的形式，获取角色下所有的三级权限id，并保存的defkeys数组中
    getLeafKeys (node, arr) {
      //如果当前node节点不包含三级权限的节点
      if (!node.children) {
        return arr.push(node.id)
        //如果不是三级节点，我们需要用递归来循环数组
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    //监听分配权限对话框的关闭事件
    setRightDialogClosed () {
      //当关闭对话框就清空数组
      this.defkeys = []
    },
    //定义添加节点和子节点的函数
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        //获取半选状态的节点
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)  打印是否拿到id
      const idStr = keys.join(',')//用字符串拼接
      const { data: res } = await this.$http.post(`roles / ${this.roleId} / rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('添加权限分配失败')
      }
      this.$message.success('添加权限分配成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>