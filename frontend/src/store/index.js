import Vue from 'vue'
import Vuex from 'vuex'

import web3 from './modules/web3'

import state from '@/store/state'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations,
  actions,
  modules: {
    web3,
  },
})
