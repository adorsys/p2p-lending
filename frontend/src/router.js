import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

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
      path: '/ico',
      name: 'ico',
      component: () => import(/* webpackChunkName: "ICO" */ './views/ICO.vue'),
    },
    {
      path: '/requests',
      name: 'requests',
      component: () =>
        import(/* webpackChunkName: "Requests" */ './views/Requests.vue'),
    },
  ],
})
