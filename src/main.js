// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
// import axios from 'axios'
import myServerHttp from '@/plugins/http.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
/* 引入公共的组件库 */
Vue.config.productionTip = false;
//使用ElementUI插件
Vue.use(ElementUI)
//以前引入 axios第三方http库使用
// Vue.prototype.$axios = axios
//现在我想改使用 第三方插件的形式 使用这个axios库   Vue.use(axios)
Vue.use(myServerHttp) //用法还是跟之前一样 直接 this.$http

/* eslint-disable no-new */
new Vue({
  router,
  render:h => h(App),
  // components: { App },
  // template: '<App/>'
}).$mount('#app')
