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
            <a href="#" @click.prevent = "login_out">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu :unique-opened="true" :router="true"> 
            <!-- 只保持一个子菜单的展开  router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
            <!-- 1 -->
          <el-submenu index="1"> <!-- index唯一标志 值不能一样 否则点击后都能展开 -->
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users"> <!-- route ， Vue Router路径对象 -->
            <!-- index 唯一标识  相当于router-link中的 to 跳转可加 / 也可不加 -->
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
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
          </el-submenu>
          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
                <i class="el-icon-menu"></i>
                <span>数据报表</span>
            </el-menu-item>
          </el-submenu>
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
            
        }
    },
    beforeCreate() {
        const token = localStorage.getItem('token')
        if(!token){  //判断是否携带token 没有则返回登录组件
            this.$router.push({name:'login'})
        }
        //如果有 将继续渲染后面的生命周期
    },
    methods: {
        login_out(){
            //点击退出按钮 三步 清除本地存储中的token 退出成功提示信息 路由跳转
            localStorage.clear()
            this.$message.success('退出成功')
            this.$router.push({name:'login'})
        }
    },
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
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
