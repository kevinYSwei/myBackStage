<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4" class="login_logo">
          <img src="../../assets/images/logo.jpg" alt>
        </el-col>
        <el-col :span="16" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="3" class="admin">
          <div class="admin_tit">
            <img src="../../assets/images/user.jpg" alt>
          </div>
          <span>admin</span>
        </el-col>
        <el-col :span="1" class="login_out">
          <div class="grid-content bg-purple">
            <a href="#" @click.prevent="login_out">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu class="aside_menu" :unique-opened="true" :router="true">
          <!-- 只保持一个子菜单的展开  router 是否使用 vue-router 的模式，开启路由模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
          <!-- 1 更新:实现侧边栏【动态导航】所有数据均在后台请求获取 :index字符串类型-->
          <el-submenu :index="''+item1.order" v-for="(item1,index) in navList" :key="index">
            <!-- index唯一标志 值不能一样 否则点击后都能展开 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <!-- path是路由跳转的地址 是从后台调取的 然后再更改路由组件的地址 -->
            <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
              <!-- route ， Vue Router路径对象 -->
              <!-- index 唯一标识  相当于router-link中的 to 跳转可加 / 也可不加 -->
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="role">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
            </el-menu-item>
          </el-submenu>-->
          <!-- 3 -->
          <!-- <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>商品分类</span>
            </el-menu-item>
          </el-submenu>-->
          <!-- 4 -->
          <!-- <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
            </el-menu-item>
          </el-submenu>-->
          <!-- 5 -->
          <!-- <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>数据报表</span>
            </el-menu-item>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<!-- 快捷键 scaffold -->
<script>
export default {
  data() {
    return {
      navList: []
    };
  },
  beforeCreate() {
    //这种方法 会导致与home同一级的组件 也要进行拦截判断token 很low
    // const token = localStorage.getItem('token')
    // if(!token){  //判断是否携带token 没有则返回登录组件
    //     this.$router.push({name:'login'})
    // }
    //如果有 将继续渲染后面的生命周期
  },
  created() {
    this.getAllNavInfo();
  },
  methods: {
    //获取侧边栏 动态导航列表和数据 左侧菜单权限
    async getAllNavInfo() {
      const res = await this.$http.get(`menus`);
      console.log(res, 223);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.navList = data; //将后台获取数据后传值给前端data
      }
    },
    login_out() {
      //点击退出按钮 三步 清除本地存储中的token 退出成功提示信息 路由跳转
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: rgb(96, 109, 185);
  color: #001
}
.aside {
  background-color: rgb(148, 191, 216)
}
.aside_menu{
  background-color: rgb(115, 166, 196)
}
.main {
  background-color: #e9eef3;
}
.header .el-row,
.header .el-col {
  height: 100%;
}
.login_logo img {
  height: 100%;
  width: 100%;
  cursor: pointer;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.login_out {
  text-align: center;
}
.login_out a {
  display: inline-block;
  font: 16px/60px "微软雅黑";
}
.admin {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.admin_tit {
  height: 60%;
  width: 24%;
  overflow: hidden;
  border-radius: 50%;
}
.admin_tit img {
  height: 100%;
  width: 100%;
}
.admin span {
  display: inline-block;
  margin: 0 0 14px 6px;
  align-self: flex-end;
}
</style>
