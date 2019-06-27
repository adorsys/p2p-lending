import { ICOService } from '../../services/icoContract/IcoService'
import { icoListeners } from '../../services/icoContract/icoListeners'

export default {
  namespaced: true,
  state: {
    active: true,
    goal: 0,
    decimals: null,
    symbol: null,
    name: null,
    tokenSupply: 0,
    contractBalance: 0,
    participants: null,
    tokenHolders: null,
    userTokenBalance: 0,
    userInvestment: null,
  },
  actions: {
    async initializeIco({ commit }) {
      const payload = await ICOService.initializeICO()
      if (payload) {
        icoListeners()
        commit('INITIALIZE_ICO', payload)
      }
    },
    async updateIco({ commit }) {
      const payload = await ICOService.updateICO()
      if (payload) commit('UPDATE_ICO', payload)
    },
  },
  mutations: {
    INITIALIZE_ICO(state, payload) {
      state.active = payload.active
      state.goal = payload.goal
      state.decimals = payload.decimals
      state.symbol = payload.symbol
      state.name = payload.name
      state.tokenSupply = payload.tokenSupply
      state.contractBalance = payload.contractBalance
      state.participants = payload.participants
      state.tokenHolders = payload.tokenHolders
      state.userTokenBalance = payload.userTokenBalance
      state.userInvestment = payload.userInvestment
    },
    UPDATE_ICO(state, payload) {
      state.contractBalance = payload.contractBalance
      state.participants = payload.participants
      state.userInvestment = payload.userInvestment
      state.userTokenBalance = payload.userTokenBalance
      state.active = payload.active
      state.tokenHolders = payload.tokenHolders
    },
  },
}
