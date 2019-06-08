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
      //找到距离异步操作有结果的代码最近的方法，前面加async
    async handleLogin() {
      //ES7 异步方法写法  async + await  虽然是异步操作 但是代码执行等同于同步,这种写法对代码性能没有优化 只是看起来更好看些。。
      //首先找到异步操作有结果的代码前面加上 await 同时接收异步操作结果res
      const res = await this.$http.post("login", this.loginData);//也就是说这行异步操作有结果后 才会执行后面的代码
      //当登录成功 跳转home页、提示登录成功
      //这里是ES6对象解构赋值
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$router.push({
          name: "home"
        });
        this.$message.success(msg);
      } else {
        //当登录失败 不跳转、提示登录失败
        this.$message.warning(msg);
      }
      /* //ES6 异步方法写法
      this.$http.post("login", this.loginData).then(res => {
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
      }); */
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


