<template>
  <div class="login_wrap">
    <el-form
      :label-position="loginPosition"
      label-width="80px"
      :model="loginData"
      class="login_form"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="loginData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="loginData.password" show-password></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin" type="primary" class="login_btn">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginPosition: "top",
      loginData: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    handleLogin() {
      this.$http.post("login", this.loginData).then(res => {
        console.log(res, 111);
        //当登录成功 跳转home页、提示登录成功
        //这里是ES6对象解构赋值
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.$router.push({
            name:'home'
          });
          this.$message.success(msg);
        } else {
          //当登录失败 不跳转、提示登录失败
          this.$message.warning(msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.login_wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_wrap .login_form {
  width: 400px;
  padding: 0 30px 30px;
  border-radius: 5px;
  background-color: #fff;
}
.login_wrap .el-form-item {
  margin: 0;
}
.login_wrap .login_btn {
  margin-top: 30px;
  width: 100%;
}
</style>


