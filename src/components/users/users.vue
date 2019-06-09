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
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <!--如果单元格内显示的内容不是字符串或文本,需要给被显示的内容外层包裹template -->
        <!-- 若template内部要用到外层组件的数据 则需要设置slot-scope属性 
        注意： 该属性的值是要用的create_time的数据源 【userList】-->
        <!-- 不同组件的作用域不同 数据不共享 这里用到插槽传值 -->
        <!-- slot-scope 作用：传值，slot-scope的值会自动去上一级寻找所需数据的数据源，这里是el-table绑定的数据userList，并将上一层数据源赋值给自定义名(scope)，此时"scope" == userList数组  故属性值名userList是任意取的 -->
        <!-- 且userList.row指数组中的每一个对象 -->
        <!-- <template slot-scope="userList"> -->
        <template slot-scope="scope">
          <!--自定义属性值,反正都是要将数据源赋给它 -->
          {{scope.row.create_time | toDate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <!-- 用户状态开关 mg_state布尔类型-->
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      userSearch: "",
      //表格绑定数据
      userList: [],
      //分页相关数据
      total: -1, //总数据条数
      pagenum: 1,
      pagesize: 3
    };
  },
  created() {
    // 在created生命周期中 进行调取后台数据 当然也可以在mountd里调取后台接口
    this.getUserList();
  },
  methods: {
    async getUserList() {
      //ES7 async await写法
      //query 查询参数 可以为空
      //pagenum 当前页码 不能为空 可变量
      //pagesize 每页显示条数 不能为空 可变量
      //此外 除了登录请求不需要授权，其余其他访问请求都需要【授权API】，必须在请求头中使用Authorization字段并提供token令牌 key:value形式 保证安全降低服务器压力减少会话控制
      //去找axios中设置请求头的代码 当发送请求时 会将请求头安排进请求中进行发送
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.userSearch}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   username: "admin";
      //   email: "810909767@qq.com";
      //   mobile: "13522002566";
      //   create_time: 1486720211;
      //   id: 500;
      //   mg_state: true;
      //   role_name: "主管";
      console.log(res, 777);
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data; //对象解构赋值
      if (status === 200) {
        this.userList = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
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
