<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4" class="login_logo">
              <img src="../../assets/images/logo.jpg" alt="">
        </el-col>
        <el-col :span="16" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="3" class="admin">
            <div class="admin_tit">
                <img src="../../assets/images/user.jpg" alt="">
            </div>
            <span>admin</span>
        </el-col>
        <el-col :span="1" class="login_out">
          <div class="grid-content bg-purple">
              <a href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>
<!-- 快捷键 scaffold -->
<script>
export default {};
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
.header .el-row,.header .el-col{
    height: 100%;
}
.login_logo img{
    height: 100%;
    width: 100%;
    cursor: pointer;
}
.middle{
    text-align: center;
    line-height: 60px;
}
.login_out{
    text-align: center;
}
.login_out a{
    display: inline-block;
    font: 16px/60px '微软雅黑';
}
.admin{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}
.admin_tit{
    height: 60%;
    width: 24%;
    overflow: hidden;
    border-radius: 50%;
}
.admin_tit img{
    height: 100%;
    width: 100%;
}
.admin span{
    display: inline-block;
    margin: 0 0 14px 6px;
    align-self: flex-end;
    
}
</style>
