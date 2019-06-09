<template>
  <!-- el-card 卡片 小容器 -->
  <el-card class="box-card">
    <!-- 首页/用户管理/用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="userSearchWrap">
      <el-col>
        <!-- 当清空搜索框时 数据全部重新加载 -->
        <el-input
          @clear="loadUserList"
          clearable
          placeholder="请输入内容"
          v-model="userSearch"
          class="usersInput"
        >
          <el-button @click="searchKeys" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain @click="addUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 el-table(data数据源[]) el-table-column 列 (label表头 prop="每个对象的属性数据") 给表格设置固定高度  将自动在数据超出时出现滚动条 并且固定表头-->
    <el-table :data="userList" style="width: 100%" height="400px">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="80"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <!--如果单元格内显示的内容不是字符串或文本,需要给被显示的内容外层包裹template -->
        <!-- 若template内部要用到外层组件的数据 则需要设置slot-scope属性 
        注意： 该属性的值是要用的create_time的数据源 【userList】-->
        <!-- 不同组件的作用域不同 数据不共享 这里用到插槽传值 -->
        <!-- slot-scope 作用：传值，slot-scope的值会自动去上一级寻找所需数据的数据源，这里是el-table绑定的数据userList，并将上一层数据源赋值给自定义名(scope)，此时"scope" == userList数组  故属性值名userList可以是任意取的 -->
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
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            @click="showEditUserMsgBox"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="showDelUserMsgBox(scope.row.id)"
            circle
          ></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 首先需要当前该接口支持分页 url参数中有pagenum pagesize -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[4, 8, 12, 16]"
      :page-size="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户 dialog -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密 码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
      <!-- form里有哪些数据 看接口文档添加用户需要哪些数据 username password email mobile -->
    </el-dialog>
    <!-- 编辑用户信息 dialog -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleEdit = false">确 定</el-button>
      </div>
      <!-- form里有哪些数据 看接口文档添加用户需要哪些数据 username password email mobile -->
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      userSearch: "", //双向数据绑定
      //表格绑定数据
      userList: [],
      //分页相关数据
      total: -1, //总数据条数
      pagenum: 1, //当前页
      pagesize: 4, //每页显示条数,
      //添加用户dialog
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      }
    };
  },
  created() {
    // 在created生命周期中 进行调取后台数据 当然也可以在mountd里调取后台接口
    this.getUserList();
  },
  methods: {
    //编辑用户
    showEditUserMsgBox() {
        this.dialogFormVisibleEdit = true
    },
    //点击删除小图标
    showDelUserMsgBox(userid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //点击确定执行  这里后台提供的方法接口是 delete()
          const res = await this.$http.delete(`users/${userid}`);
          console.log(res, 222);
          if (res.data.meta.status === 200) {
            this.pagenum = 1;
            this.$message({
              type: "success",
              message: res.data.meta.msg
            });
            this.$nextTick(() => {
              this.getUserList(); //删除成功后重新更新视图
            });
          }
        })
        .catch(() => {
          //点击取消执行
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //取消添加数据
    cancelAdd() {
      this.dialogFormVisibleAdd = false;
      this.form = {};
    },
    //确认添加数据
    async confirmAdd() {
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post("users", this.form);
      console.log(res, 343);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        this.$message.success(msg);
        this.form = {};
        this.getUserList(); //更新视图
      } else {
        this.$message.warning(msg);
        this.form = {};
      }
    },
    //添加用户--显示dialog
    addUserDialog() {
      this.dialogFormVisibleAdd = true;
    },
    //点击清空搜索框按钮 触发
    loadUserList() {
      this.getUserList();
    },
    //搜索关键字按钮
    searchKeys() {
      this.getUserList();
    },
    //分页操作
    handleSizeChange(val) {
      //改变每页显示条数
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      //并且无论原先页码是多少 只要切换页内数据量后 都让他从第一页开始展示
      this.pagenum = 1;
      //此方法触发时 要重新从后台获取数据
      this.$nextTick(() => {
        //延迟加载，在将DOM结构重新加载完成以后再触发
        this.getUserList();
      });
    },
    handleCurrentChange(val) {
      //改变页码
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      //此方法触发时 要重新从后台获取数据
      this.getUserList();
    },
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
        //当query为空时 请求加载全部数据
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
        // this.$message.success(msg);
      } else {
        // this.$message.warning(msg);
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
.box-card .el-dialog__title {
  display: inline-block;
  font: bold 24px/40px "微软雅黑";
  padding-left: 20px;
}
</style>
