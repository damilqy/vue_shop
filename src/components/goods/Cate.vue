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
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类表格区域 -->
      <tree-table
        :data="cateList"
        :columns="colimns"
        :selection-type="false"
        show-index
        index-text="#"
        border
        ><template slot="isok" slot-scope:="scope">
          <i class="el-icon-circle-check"></i>
          <i class="el-icon-circle-close"></i>
        </template>
      </tree-table>
      <!-- 分页区 -->
    </el-card>
  </div>
</template>

<script>
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
      }]
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
    }
  }
}
</script>

<style lang="less" scpoed>
</style>