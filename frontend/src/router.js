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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/p2pManagement',
      name: 'p2pManagement',
      component: () =>
        import(
          /* webpackChunkName: "lendingBoard" */ './views/P2PManagement.vue'
        ),
      beforeEnter: (to, from, next) => {
        if (store.state.web3.tokenHolder || store.state.web3.boardMember) {
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
      beforeEnter: (to, from, next) => {
        if (store.state.ico.active) {
          next()
        } else if (store.state.web3.tokenHolder && !store.state.ico.active) {
          next()
        } else {
          next({ name: 'home' })
        }
      },
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
