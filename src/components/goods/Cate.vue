<template>
  <div>
    <!-- 面包屑导航去模块 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类表格区域 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="colimns"
        :selection-type="false"
        show-index
        :expand-type="false"
        index-text="#"
        border
      >
        <!-- 是否有效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="opt" slot-scope="scope">
          <!-- 里面放两个按钮 -->
          <!-- 然后做点击编辑拿到这一行的数据，进行修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateInfo(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类:"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- 父级分类不需要prop验证，要用到级联选择器 -->
        <el-form-item label="父级分类">
          <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCatechanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加编辑的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="showEditDialogVisible"
      width="50%"
    >
      <!--内容主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="showEditDialogVisible = false"
          @close="editDialogClosed"
          >取 消</el-button
        >
        <el-button type="primary" @click="editformTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  </div>
</template>

<script>
import RolesVue from '../power/Roles.vue'
export default {
  name: 'Cate',
  data () {
    return {
      //商品分类的数据列表
      cateList: [],
      total: 0,
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //为table指定列的定义
      colimns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        //表示当前定义为模板列
        type: 'template',
        //表示定义的模板列的名称
        template: 'isok'
      }, {
        label: '排序',
        //表示当前定义为模板列
        type: 'template',
        //表示定义的模板列的名称
        template: 'order'
      },
      {
        label: '操作',
        //表示当前定义为模板列
        type: 'template',
        //表示定义的模板列的名称
        template: 'opt'
      }
      ],
      //添加分类的对话框的默认状态
      addCateDialogVisible: false,
      //添加表单分类的数据对象
      addCateForm: {
        //将要添加的分类的名称
        cat_name: '',
        //父级的id
        cat_pid: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      //添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类的名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      //父级分类的列表
      parentCateList: [],
      //指定级联选择器的
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        chilfren: 'children'
      },
      //定义父级分类的ID数组
      selectedKeys: [],
      //定义编辑的对话框的显示与隐藏
      showEditDialogVisible: false,
      //定义修改分类的对象
      editForm: {},
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //监听pagesize改变的事件处理函数
    handleSizeChange (newsize) {
      this.querInfo.pagesize = newsize
      //再刷新数据
      this.getCateList()
    },
    //监听pagenum发生改变的事件出处理函数
    handleCurrentChange (newpage) {
      this.querInfo.pagenum = newpage
      this.getCateList()
    },
    //控制添加分类的对话框的显示与隐藏
    showDialogVisible () {
      //在显示对话框前获取数据分类的数据列表！
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      //type:2 表示获取前两级的分类
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    //父级选择器发生改变，触发change事件
    parentCatechanged () {
      // console.log(this.selectedKeys)//可以拿到打印出的数组
      //先做判断
      if (this.selectedKeys.length > 0) {
        //1.说明有先做对象,找到最后一个选择的分类就是数组总最后的一个元素
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //2.为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        //父级分类的ID
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //添加分类
    addCat () {
      console.log(this.addCateForm)
      //点击了确定按钮把选择的分类添加进入
      //1.在对表单进行预验证
      //2.首先要在后台拿取数据
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        } else {
          this.$message.success('添加分类成功')
          this.getCateList()//重新刷新列表
          this.addCateDialogVisible = false
        }
      })
    },
    //监听对话框的关闭事件
    addCateDialogClosed () {
      //重置表单
      this.$refs.addCateFormRef.resetFields()
      //再把选择的级联选择框清空
      this.selectedKeys = [],
        this.addCateForm.cat_pid = 0,
        this.addCateForm.cat_level = 0
    },
    //定义修改对话框,用id来接收
    async editCateInfo (id) {
      console.log(id)
      //在后台拿取数据
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('修改分类失败')
      }
      this.editForm = res.data
      //点击之后展示编辑的对话框
      this.showEditDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()//重置表单
    },
    //点击确定后就把内容修改好，
    editformTrue () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        //因为要求是放在请求体中，所有要用{}来接收
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, { cat_name: this.editForm.cat_name })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败')
        }
        this.showEditDialogVisible = false
        this.getCateList()
        this.$message.success('修改用户成功')
      })
    },
    //点击删除就触发事件
    async removeCate (id) {
      //需要先弹框提示是否需要删除
      console.log(id)//拿到id之后，用messageBox组件弹框
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)//捕获错误，并返回错误
      //如果用户确定删除，则返回值为字符串confirm
      //如果用户取消删除，则返回值为cancel
      //接下里做判断
      if (confirmResult !== 'confirm') {
        //则表示走了取消的业务逻辑
        return this.$message.info('您取消了删除')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return $message.error('删除分类失败')
      }
      this.getCateList()
      this.$message.success('删除分类成功')
    }
  }
}
</script>

<style lang="less" scpoed>
.tree-table {
  margin-top: 15px;
}
</style>