// import { INIT_CONNECTION } from '@/util/constants/types'
import { web3Instance } from '../../services/web3/initializeWeb3'

export default {
  state: {
    isInjected: false,
    coinbase: null,
    instance: null,
  },
  actions: {
    async initTest({ commit }) {
      const payload = await web3Instance.getInstance()
      console.log(payload)
    },
  },
  mutations: {},
}
