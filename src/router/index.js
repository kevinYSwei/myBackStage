import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import home from '@/components/home/home'
import users from '@/components/users/users'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'login',
      path: '/login',
      component:login
    },
    {
      name:'home',
      path:'/',
      component:home,
      children:[
        {
          name:'users',
          path:'/users',
          component:users
        }
      ]
    },
    
  ]
})
