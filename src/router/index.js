import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import Loyout from '@/pages/Loyout'
import Role from '@/pages/Role'
import User from '@/pages/User'
import Cate from '@/pages/Cate'
import Specs from '@/pages/Specs'
import Goods from  '@/pages/Goods'
import Banner from  '@/pages/Banner'
import Member from  '@/pages/Member'
import Seckill from  '@/pages/seckill'

const Menu = ()=>import('@/pages/Menu')

Vue.use(Router)

let router=new Router({
  routes: [
    {
      path: '/login',
      component:Login
    },
    {
      path: '/',
      component:Loyout,
      children: [
        {
          path: 'index',
          component:Index
        },
        {
          path: 'role',
          component:Role
        },
        {
          path: 'user',
          component:User
        },
        {
          path: 'menu',
          component:Menu
        },
        {
          path: 'category',
          component:Cate
        },
        {
          path: 'specs',
          component:Specs
        },
        {
          path: 'goods',
          component:Goods
        },
        {
          path: 'banner',
          component:Banner
        },
        {
          path: 'member',
          component:Member
        },
        {
          path: 'seckill',
          component:Seckill
        },
        {
          path: '*',
          redirect:Index
        },
       
      ]

    }
  ]
})
// 全局守卫导航开始触发
router.beforeEach((to,from,next)=>{
      // 登录状态
      let token=localStorage.getItem("token")?localStorage.getItem("token"):""
      let menus_Url=JSON.parse(localStorage.getItem('userinfo')).menus_url
      console.log(menus_Url)
      if(token){
        //  已登录
        if(to.path=="/login"){
          next(false)
        }else{
          // 已登录的情况下查看当前访问的地址是否有权限访问
          let flag=menus_Url.find(item=>to.path==item)
          console.log(flag)
          if(flag){
           
            next()

          }else{
            
            next(false)
          }
          // next()
        }
      }else{
        // 未登录 
        if(to.path=="/login"){
          next()
        }else{
          next("/login")
        }
      }


})






export default router
