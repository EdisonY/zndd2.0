import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Cookies from 'js-cookie'


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/springboard',
        component: () => import('@/views/springboard'),
        hidden: true
    },
    {
        path: '/rungrap',
        component: () => import('@/layout/rungrapMain'),
        hidden: true
    },
    {
        path: '/is',
        component: Layout,
        redirect: '/emergency',
        name:'智能调度',
        meta: { title: '智能调度', icon: 'dashboard' },
        children: [
            {
                path: 'emergency',
                name: '应急事件',
                component: () => import('@/views/is/emergency'),
                meta: { title: '应急事件', icon: 'form' }
            },{
                path: 'command',
                name: '调度命令',
                component: () => import('@/views/is/command'),
                meta: { title: '调度命令', icon: 'example' }
            },
            {
                path: 'malfunction',
                name: '故障录入',
                component: () => import('@/views/is/malfunction'),
                meta: { title: '故障录入', icon: 'example' }
            },{
                path: 'configuration',
                name: '系统参数配置',
                component: () => import('@/views/is/configuration'),
                meta: { title: '系统参数配置', icon: 'example' }
            },{
                path: 'backupservices',
                name: '后台服务设备状态',
                component: () => import('@/views/is/backupservices'),
                meta: { title: '后台服务设备状态', icon: 'example' }
            }
        ]
    },
    {
        path: '/station',
        component: Layout,
        // redirect: '/emergency',
        name:'维修工作站',
        meta: { title: '维修工作站', icon: 'form' },
        children: [
            {
                path: 'maintain',
                name: '软件维护',
                component: () => import('@/views/station/maintain'),
                meta: { title: '软件维护'}
            },{
                path: 'monitor',
                name: '系统监控',
                component: () => import('@/views/station/monitor'),
                meta: { title: '系统监控'}
            },{
                path: 'type',
                name: '系统配置类型',
                component: () => import('@/views/list/type'),
                meta: { title: '系统配置类型'}
            },{
                path: 'detail',
                name: '系统配置详情',
                component: () => import('@/views/list/detail'),
                meta: { title: '系统配置详情'}
            },{
                path: 'nmc',
                name: '雷达图',
                component: () => import('@/views/station/nmc'),
                meta: { title: '雷达图'}
            }
        ]
    },
    {
        path: '/construction',
        component: Layout,
        // redirect: '/emergency',
        name:'施工/计表管理',
        alwaysShow: true,
        meta: { title: '施工/计表管理', icon: 'form' },
        children: [
            {
                path: 'meter',
                name: '施工/计表',
                component: () => import('@/views/construction/meter'),
                meta: { title: '施工/计表'}
            },
            {
                path: 'declare',
                name: '施工/计表申报',
                component: () => import('@/views/construction/declare'),
                meta: { title: '施工/计表申报'}
            },
            {
                path: 'linetone',
                name: '施工/计表(行调)',
                component: () => import('@/views/construction/linetone'),
                meta: { title: '施工/计表(行调)'}
            },
            {
                path: 'plan',
                name: '施工/计表电子计划总表',
                component: () => import('@/views/construction/plan'),
                meta: { title: '施工/计表电子计划总表'}
            }
        ]
    },
    {
        path: '/index',
        component: () => import('@/views/index'),
        hidden: true
    },
    {
        path: '/',
        redirect:'/index'
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

console.log(process.env,BASEROUTER);

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    mode:'history',
    base: BASEROUTER,
    routes: constantRoutes
})

const router = createRouter()
router.beforeEach((to, from, next) => {
    if(localStorage.getItem('token') && localStorage.getItem('token') != ''){
        if(to.path == '/login'){
            next('/')
        }else{
            next()
        }
    }else{
        if(to.path == '/login'){
            next()
        }else{
            next('/login')
        }
    }
    // next()



    // if(to.path == '/rungraph' || to.path == '/pfbasic' || to.path == '/simulation' || to.path == '/indicator'){
    //     store.state.app.sidebar.opened = false
    // }else{
    //     store.state.app.sidebar.opened = true
    // }
    // if(kg){
    //     kg = false
    //     if(sessionStorage.getItem('line') != '' && typeof(sessionStorage.getItem('line')) == 'string'){
    //         next()
    //     }else if(to.path == '/choseline' || to.path == '/login'){
    //         next()
    //     }else{
    //         Vue.prototype.$message.error('请先选择线路！')
    //         next('/choseline')
    //     }
    //     setTimeout(()=>{
    //         kg = true
    //     })
    // }

    // next()
})

Vue.prototype.$resetRoute = function(){
    console.log(sessionStorage.getItem('line'))
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
