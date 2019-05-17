import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  mutations,
  actions,
  modules,
})

export default store

// dispatch all actions 'initialize' on load
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions && modules[moduleName].actions.initialize) {
    store.dispatch(`${moduleName}/initialize`)
  }
}
