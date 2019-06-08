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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userSearch: ""
    };
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
