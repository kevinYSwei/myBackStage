<template>
  <!-- el-card 卡片 小容器 -->
  <el-card class="box-card">
    <!-- 首页/用户管理/用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="userSearchWrap">
      <el-col>
        <el-input placeholder="请输入内容" v-model="userSearch" class="usersInput">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- el-table(data数据源[]) el-table-column 列 (label表头 prop="每个对象的属性数据") -->
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        prop="address"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="address"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="address"
        label="创建日期">
      </el-table-column>
      <el-table-column
        prop="address"
        label="用户状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userSearch: "",
      pagenum:1,
      pagesize:3,
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }]
    };
  },
  created() { // 在created生命周期中 进行调取后台数据 当然也可以在mountd里调取后台接口
      this.getUserList()
  },
  methods: {
      async getUserList(){ //ES7 async await写法
        //query 查询参数 可以为空
        //pagenum 当前页码 不能为空 可变量
        //pagesize 每页显示条数 不能为空 可变量
        //此外 除了登录请求不需要授权，其余其他访问请求都需要【授权API】，必须在请求头中使用Authorization字段并提供token令牌 key:value形式 保证安全降低服务器压力减少会话控制 
        //去找axios中设置请求头的代码  当发送请求时 会将请求头安排进请求中进行发送
        const AUTH_TOKEN = localStorage.getItem('token')
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
          const res = await this.$http.get(`users?query=${this.userSearch}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
          console.log(res,777)
      }
  },
};
</script>

<style>
.box-card {
  height: 100%;
}
.userSearchWrap {
  margin-top: 20px;
}
.usersInput {
  width: 300px;
}
</style>
