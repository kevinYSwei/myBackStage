import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Home from '@/components/home/home'
import Users from '@/components/users/users'
import Rights from '@/components/rights/rights'
import Role from '@/components/rights/role'
import Goods from '@/components/goods/goods'
import GoodsAdd from '@/components/goods/goodsAdd'
import Params from '@/components/goods/params'
import Categories from '@/components/goods/categories'
import Orders from '@/components/orders/orders'
// 单独引入 Message组件
import { Message } from 'element-ui'

Vue.use(Router)

// 声明路由 router 对象
const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {// 配置角色列表
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'goodsAdd',
          path: '/goodsAdd',
          component: GoodsAdd
        },
        {
          name: 'orders',
          path: '/orders',
          component: Orders
        }
      ]
    }

  ]
})
// 配置全局导航守卫/钩子  beforeEach  在路由配置生效之前进行拦截 判断token存在与否
// 这样做目的 可以让每一次路由跳转进入的组件都会进行判断是否有携带 token 不必在每一个组件内一一判断token 代码冗余 麻烦
router.beforeEach((to, from, next) => {
  // to 要去的路由配置  要去哪里
  // from 当前的路由配置 从哪里来
  // next() 让to要去的路由配置继续生效 即放行
  // console.log(to)
  if (to.path === '/login') {
    next()
  } else { // 拦截 并且进行token是否存在的验证 而且每次发出请求后台数据也将会对token进行验证
    const token = localStorage.getItem('token')
    if (!token) { // 判断是否携带token 没有则返回登录组件
      Message.warning('请先登录再继续操作！')
      // this.$router.push({name:'login'})//因为现在this就是router，而不再是Vue的实例
      router.push({ name: 'login' })
      return // 阻止代码继续向下执行
    }
    // 当token存在时
    next() // 放行 之后每次请求数据都会对token进行后台权限验证 保证安全
  }
})

export default router
