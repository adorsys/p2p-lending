import Vue from 'vue'
import Router from 'vue-router'
import LendingRequests from './views/LendingRequests.vue'

import store from './store/'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: LendingRequests
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
            path: '/p2pManagement',
            name: 'p2pManagement',
            component: () =>
                import(/* webpackChunkName: "lendingBoard" */ './views/P2PManagement.vue'),
            beforeEnter: (to, from, next) => {
                if (store.state.tokenHolder || store.state.boardMember) {
                    next()
                } else {
                    next({ name: 'home' })
                }
            }
        },
        {
            path: '/ico',
            name: 'ico',
            component: () =>
                import(/* webpackChunkName: "ICO" */ './views/ICO.vue')
        },
        {
            path: '/userrequests',
            name: 'userrequests',
            component: () =>
                import(/* webpackChunkName: "userRequests" */ './views/UserRequests.vue')
        }
    ]
})
