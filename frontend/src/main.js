import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'chart.js'
import 'hchs-vue-charts'
Vue.use(window.VueCharts)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
