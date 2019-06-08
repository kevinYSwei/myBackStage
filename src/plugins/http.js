import axios from 'axios'
//将不是Vue插件的库 改成插件   开发插件
const myServerHttp = {}
myServerHttp.install = function (Vue) {
    //设置基础公共地址
    axios.defaults.baseURL = 'http://47.97.214.102:8888/api/private/v1'
    // 4. 添加实例方法
    Vue.prototype.$http = axios
  }

export default myServerHttp