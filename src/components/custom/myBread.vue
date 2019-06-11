<template>
  <!-- 因为面包屑组件被多个组件反复使用，所以创建一个全局的自定义组件 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  //注意：组件的名字应该来源于组件本身
  name: "my-bread",
  data() {
    return {};
  },
  //props 值是字符串数组 它的值来源于使用此自定义组件时 传来的值  并使用插值表达式处理
  props: ["level1", "level2"]
};
</script>

<style>
</style>
