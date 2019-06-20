import axios from 'axios'
// 将不是Vue插件的库 改成插件   开发插件
const myServerHttp = {}
myServerHttp.install = function (Vue) {
  // 设置基础公共地址
  axios.defaults.baseURL = 'http://47.97.214.102:8888/api/private/v1'

  // 【在每一次请求发起之前，会先来到下面的回调函数】
  // 添加请求拦截器  除了登录外的任何请求都会 添加请求头 token验证
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做点什么   请求前 均在此处进行拦截
    // 先从本地存储那 获取token值  将这些公共设置的请求头进行拦截统一设置
    // 这里的 config.url指的是 前面设置基础公共地址后面的 数据！！！
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      // 因为 headers 是一个对象 所以可直接设置添加
      config.headers['Authorization'] = AUTH_TOKEN
    }
    // console.log(config, 211)
    return config
  }, function (err) {
    // 对请求错误做点什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 在这里对响应数据做点什么
    return response
  }, function (err) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })

  // 4. 添加实例方法
  Vue.prototype.$http = axios
}

export default myServerHttp
