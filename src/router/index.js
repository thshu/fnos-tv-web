import { createRouter, createWebHistory } from 'vue-router';
const routes = [

    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/list',
        name: 'VideoList',
        component: () => import('../views/Video/VideoList.vue')
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
    // linkActiveClass: 'active',
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});

export default router