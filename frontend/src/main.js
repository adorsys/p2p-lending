import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//--------------------chart
import "chart.js";
import "hchs-vue-charts";
Vue.use(window.VueCharts);
//--------------------chart 

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
