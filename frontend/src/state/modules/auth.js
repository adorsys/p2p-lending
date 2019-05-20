import router from '@/router'
import store from '@/state'
import Web3Service from '@/services/web3/Web3Service'
import { accountListener } from '@/services/web3/web3Listeners'
import { authenticate } from '@/services/authenticate'

export default {
  namespaced: true,
  state: {
    isInjected: false,
    tokenHolder: false,
    boardMember: false,
  },
  actions: {
    async initialize({ commit }) {
      // start account changed listener
      accountListener()
      // check if web3 is available
      const injected = await Web3Service.web3Active()
      commit('INITIALIZE', injected)
    },
    async logIn({ commit }) {
      const payload = await authenticate()
      commit('LOGIN', payload)
    },
    logOut({ commit }) {
      commit('LOGOUT')
    },
  },
  mutations: {
    INITIALIZE(state, isInjected) {
      state.isInjected = isInjected
    },
    LOGIN(state, payload) {
      state.tokenHolder = payload.tokenHolder
      state.boardMember = payload.boardMember
    },
    LOGOUT(state) {
      const routeName = router.currentRoute.name
      if (
        routeName === 'p2pManagement' ||
        (routeName === 'ico' && !store.state.ico.active)
      ) {
        router.push({ name: 'home' })
      }
      state.tokenHolder = false
      state.boardMember = false
    },
  },
}
