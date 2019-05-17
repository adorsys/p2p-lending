import router from '@/router'
import { web3Active } from '@/services/web3/Web3Service'
import { authenticate } from '@/services/authenticate'
// import { accountListener, networkListener } from '@/services/web3/web3Listeners'

export default {
  namespaced: true,
  state: {
    isInjected: false,
    tokenHolder: false,
    boardMember: false,
  },
  actions: {
    async initialize({ commit }) {
      // check if web3 was found
      const injected = await web3Active()
      commit('INITIALIZE', injected)
      // update on account (or network) change
      // -> start ethereum.on event listeners
    },
    async login({ commit }) {
      const payload = await authenticate()
      commit('LOGIN', payload)
    },
    logout({ commit }) {
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
      if (routeName === 'p2pManagement' || routeName === 'ico') {
        router.push({ name: 'home' })
      }
      state.tokenHolder = false
      state.boardMember = false
    },
  },
}
