import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules,
})

export default store

// dispatch all actions named 'initialize' on load
for (const moduleName of Object.keys(modules)) {
  if (modules[moduleName].actions && modules[moduleName].actions.initialize) {
    store.dispatch(`${moduleName}/initialize`)
  }
}
