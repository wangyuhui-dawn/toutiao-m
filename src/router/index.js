import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
/*路由表*/
const routes = [
  {
    path:'/login',
    name:'login',
    component:()=>import('@/views/login')
  },{//一级路由渲染到根组件中的router-view中
     path:'/',
    component:()=>import('@/views/layout'),
    children:[//子路由渲染到父路由的router-view中
      {
        path:'',     //默认子路由
        name:'home',
        component:()=>import('@/views/home')
      },
      {
        path:'/qa',
        name:'qa',
        component:()=>import('@/views/qa')
      },
      {
        path:'/video',
        name:'video',
        component:()=>import('@/views/video')
      },
      {
        path:'/my',
        name:'my',
        component:()=>import('@/views/my')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
