import router from '@/router'
import { web3Instance } from '@/services/web3/getWeb3'
import { authenticate } from '@/services/authenticate'
import { accountListener, networkListener } from '@/services/web3/web3Listeners'

export default {
  namespaced: true,
  state: {
    isInjected: false,
    tokenHolder: false,
    boardMember: false,
  },
  actions: {
    async initialize({ commit }) {
      const web3 = await web3Instance.getInstance()
      if (web3) {
        try {
          // eslint-disable-next-line no-undef
          await ethereum.enable()
          accountListener()
          networkListener()
          const isInjected = await web3.eth.net.isListening()
          commit('INITIALIZE', isInjected)
        } catch (error) {
          console.error(error)
        }
      }
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
