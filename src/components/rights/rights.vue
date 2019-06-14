<template>
  <el-card>
    <!--注意：因为这里数据是写死的 故直接写成字符串的格式 没必要动态绑定，除非实时变化 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 表格 -->
    <el-table class="rights_tb" :data="rightsList" stripe border style="width: 100%" height="400">
      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"  width="180"></el-table-column>
      <el-table-column  label="层级">
          <!-- 这里注意 当单元格标签内不是字符串文本 而是插值表达式或者其他元素标签 那么将需要用 template 插槽进行传值 并且scope寻找的数据源为rightsList -->
          <template slot-scope="scope"><!-- 注意：这里的level的类型为字符串 -->
                <span v-if="scope.row.level === '0'">一级</span>
                <span v-if="scope.row.level === '1'">二级</span>
                <span v-if="scope.row.level === '2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.myRightsList();
  },
  methods: {
    //设置页面进来后自动加载数据
    async myRightsList() {
      //先从本地存储那 获取token值  将这些公共设置的请求头进行拦截统一设置
      //   const AUTH_TOKEN = localStorage.getItem("token");
      //   this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //除了登录之外 任何页面路由数据的请求都需要携带 token值 保证安全 设置请求头 这里因为已经进行统一拦截 设置相关请求头 所以局部组件内不再写
      const res = await this.$http.get(`rights/list`);
      console.log(res, 111);
      const { msg, status } = res.data.meta;
      if (status === 200) {
        this.rightsList = res.data.data;
        // this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.rights_tb{
    margin-top: 20px;
    text-align: center
}
.rights_tb .is-leaf,.rights_tb .el-table__row>td{
    text-align: center
}
</style>
