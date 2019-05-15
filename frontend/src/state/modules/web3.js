import { web3Instance } from '@/services/web3/getWeb3'

export default {
  namespaced: true,
  state: {
    isInjected: false,
    coinbase: null,
  },
  actions: {
    async initialize({ commit }) {
      const web3 = await web3Instance.getInstance()
      const payload = {
        isInjected: null,
        coinbase: null,
      }

      if (web3) {
        // eslint-disable-next-line no-undef
        await ethereum.enable()
        payload.isInjected = await web3.eth.net.isListening()
        payload.coinbase = await web3.eth.getCoinbase()
      }

      commit('INITIALIZE', payload)
    },
  },
  mutations: {
    INITIALIZE(state, payload) {
      state.isInjected = payload.isInjected
      state.coinbase = payload.coinbase
    },
  },
}
