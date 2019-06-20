// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import '@/assets/css/reset.css'
// main.js中的引入顺序决定了打包后css的顺序，组件内的样式没有生效可能是被第三方组件样式覆盖了，所以把第三方组件放在前面引入，router放在后面引入，就可以实现组件样式在第三方样式之后渲染。
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入自定义组件 设置成全局组件 MyBread为组件选项所在的对象
import router from './router'
import MyBread from 'components/custom/myBread.vue'
// import axios from 'axios'
import myServerHttp from 'plugins/http.js'
// 引入全局过滤器
import filter from './filter'
/* 引入公共的组件库 */
Vue.config.productionTip = false
for (let i in filter) {
  Vue.filter(i, filter[i])
}
// 使用ElementUI插件
Vue.use(ElementUI)
// 以前引入 axios第三方http库使用
// Vue.prototype.$axios = axios
// 现在我想改使用 第三方插件的形式 使用这个axios库   Vue.use(axios)
Vue.use(myServerHttp) // 用法还是跟之前一样 直接 this.$http
// 设置全局自定义组件
Vue.component(MyBread.name, MyBread)
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
  // components: { App },
  // template: '<App/>'
}).$mount('#app')
