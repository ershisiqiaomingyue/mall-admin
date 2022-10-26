import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '主页', icon: 'home' }
    }]
  },

  {
    path:'/user',
    component:Layout,
    name: 'user',
    redirect: '/user/menu1',
    meta: {
      title: '用户中心',
      icon:'user'
    },
    children: [
      {
        path:'menu1',
        component:() => import('@/views/user/menu1/index'),
        meta: {title: '用户管理',icon: 'ums-role'},
      },
      {
        name:'detail',
        path:'detail/:userId',
        component:() => import('@/views/user/menu1/detail/index'),
        meta: {
          title: '用户详情',
          noCache:true
        },
        hidden:true
      },
      {
        path: 'menu2',
        component:() => import('@/views/user/menu2/index'),
        meta: {title: '用户权限',icon: 'ums-resource'}
      }
    ]
  },

  {
    path:'/product',
    component:Layout,
    name: 'product',
    redirect: '/product/menu1',
    meta: {
      title: '商品中心',
      icon:'product'
    },
    children: [
      {
        path:'menu1',
        component:() => import('@/views/product/menu1/index'),
        meta: {title: '商品列表',icon: 'product-list'},
      },
      {
        path:'menu1/log/productId=:productId?',
        component: () => import('@/views/product/menu1/log/index'),
        meta: {
          title: '商品日志',
          noCache: true
        },
        hidden: true
      },
      {
        name:'menu2',
        path:'menu2',
        component:() => import('@/views/product/menu2/index'),
        meta: {
          title: '添加商品',
          icon:'product-add',
          noCache:true
        },
      },
      {
        path: 'menu3',
        component:() => import('@/views/product/menu3/index'),
        meta: {title: '商品分类',icon: 'product-attr'},
      },
    ]
  },

  {
    path: '/oms',
    component:Layout,
    name:'oms',
    redirect: '/oms/order',
    meta: {
      title:'订单中心',
      icon:'order'
    },
    children: [
      {
        path:'order',
        name:'order',
        component:() => import('@/views/oms/order/index'),
        meta: {
          title: '订单列表',
          icon:'order-return'
        }
      },
      {
        path: 'orderSetting',
        component:() => import('@/views/oms/order/orderSetting'),
        meta: {
          title: '订单设置',
          icon:'order-setting'
        }
      },
      {
        path:'order/detail/orderId=:orderId?',
        component: () => import('@/views/oms/order/info/index'),
        meta: {
          title: '订单详情',
          noCache: true
        },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
