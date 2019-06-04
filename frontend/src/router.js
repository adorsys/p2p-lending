import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './state'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/p2pManagement',
      name: 'p2pManagement',
      component: () =>
        import(
          /* webpackChunkName: "lendingBoard" */ './views/P2PManagement.vue'
        ),
      beforeEnter: (to, from, next) => {
        if (store.state.auth.tokenHolder || store.state.auth.boardMember) {
          next()
        } else {
          next({ name: 'home' })
        }
      },
    },
    {
      path: '/ico',
      name: 'ico',
      component: () => import(/* webpackChunkName: "ICO" */ './views/ICO.vue'),
    },
    {
      path: '/lendingRequests',
      name: 'lendingRequests',
      component: () =>
        import(
          /* webpackChunkName: "lendingRequests" */ './views/LendingRequests.vue'
        ),
    },
    {
      path: '/userRequests',
      name: 'userRequests',
      component: () =>
        import(
          /* webpackChunkName: "userRequests" */ './views/UserRequests.vue'
        ),
    },
    {
      path: '/createRequest',
      name: 'createRequest',
      component: () =>
        import(
          /* webpackChunkName: "createRequest" */ './views/CreateRequest.vue'
        ),
    },
  ],
})
