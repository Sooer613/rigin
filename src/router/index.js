import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import welcome from '@/components/users/welcome.vue'
import users from '@/components/users/users.vue'
import roles from '@/components/power/roles.vue'
import rights from '@/components/power/rights.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
        path: '/home',
        component: home,
        children: [
            { path: '/home', redirect: '/welcome' },
            { path: '/welcome', component: welcome },
            { path: '/users', component: users },
            { path: '/roles', component: roles },
            { path: '/rights', component: rights },
        ]
    },
]

const router = new VueRouter({
        routes
    })
    // 路由导航守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router