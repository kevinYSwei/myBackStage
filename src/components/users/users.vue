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
          <!-- 用户状态开关 mg_state布尔类型  注意这里mg_state是双向数据绑定
          这里 视图操作改变数据 所以数据的改变也将反过来影响视图-->
          <el-switch
            v-model="scope.row.mg_state"
            @change="userState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            @click="showEditUserMsgBox(scope.row)"
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
          <!-- 分配用户角色 角色名源于后台请求 每个角色权限不同 点击弹出dialog -->
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
            @click="showSetUserRoleMsgBox(scope.row)"
          ></el-button>
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
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
      <!-- form里有哪些数据 看接口文档添加用户需要哪些数据 username password email mobile -->
    </el-dialog>
    <!-- 设置用户角色 dialog -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{form.username}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 如果select绑定的 currRoleId数据的值 和 option中value的值一样时 
          那么页面就会显示该option中的label值 与原生用法一样-->
          <el-select v-model="currRoleId" placeholder>
            <!--动态就是->数字类型 非动态->字符串 并将option分为两类 -1和v-for遍历出的 -->
            <el-option label="请选择" :value="-1"></el-option>
            <!-- 遍历 取出后台数据 -->
            <!-- 当通过视图操作改变label值 -> 则对应value值也改变 ->则v-model双向数据绑定的 currRoleId 值也会自动改变 自动关联-->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item,index) in roles"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="confirmRole(currRoleId)">确 定</el-button>
      </div>
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
      dialogFormVisibleRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      currRoleId: -1,
      roles: [] //获取所有的用户角色信息
    };
  },
  /* 这行代码用于测试 */
  created() {
    // 在created生命周期中 进行调取后台数据 当然也可以在mountd里调取后台接口
    this.getUserList();
  },
  methods: {
    //当点击确认更改用户角色后  发请求修改后台数据 关闭dialog
    async confirmRole(currRoleId) {
      this.dialogFormVisibleRole = false; //隐藏对话框
      const res = await this.$http.put(`users/${this.form.id}/role`,{
        rid:currRoleId
      })
      if(res.data.meta.status === 200){
        this.$message.success(res.data.meta.msg)
      }else{
        this.$message.warning(res.data.meta.msg)
      }
    },
    //分配角色 打开设置角色的dialog
    async showSetUserRoleMsgBox(user) {
      this.dialogFormVisibleRole = true; //显示对话框
      this.form = user; //获取用户名

      //获取后台所有的角色信息
      const resPerson = await this.$http.get("roles");
      this.roles = resPerson.data.data;

      //获取当前用户的角色Id -> rid
      const res = await this.$http.get(`users/${user.id}`);
      this.currRoleId = res.data.data.rid;
      // console.log(res, 123);
    },
    //当用户状态改变时触发 并实时传给后台
    async userState(user) {
      //视图操作改变数据 数据存到后台后 再反过来渲染视图 所以相互影响 v-model双向数据绑定
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    //当弹出edit dialog框后，点击确定编辑按钮
    async confirmEdit() {
      this.dialogFormVisibleEdit = false;
      //put方法,更新（同post一样 post是创建新的） 看接口文档，这里需要传个请求体 请求体也是对象
      //将this.form 修改后的数据（双向数据绑定） 提交给后台更新
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res,22)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg);
        this.pagenum = 1; //可设置修改完成后回到第一页
        this.getUserList(); //更新视图
      } else {
        this.$message.warning(res.data.meta.msg);
      }
    },
    //编辑用户
    showEditUserMsgBox(user) {
      this.dialogFormVisibleEdit = true;
      this.form = user;
    },
    //点击删除小图标
    showDelUserMsgBox(userid) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //点击确定执行  这里请求方法是 delete() 即删除数据 方式同get
          const res = await this.$http.delete(`users/${userid}`);
          // console.log(res, 222);
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
      // console.log(res, 343);
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
    //并且因为添加与编辑用的是同一个form 要保证在添加dialog弹出时 form里面的值全为空的
    addUserDialog() {
      this.dialogFormVisibleAdd = true;
      this.form = {}; //保证表单数据为空
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
      // console.log(`每页 ${val} 条`);
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
      // console.log(`当前页: ${val}`);
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
