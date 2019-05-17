import { ICOService } from '@/services/icoContract/ICOService'

export default {
  namespaced: true,
  state: {
    active: null,
    goal: null,
    decimals: null,
    symbol: null,
    name: null,
    tokenSupply: null,
    contractBalance: null,
    participants: null,
    tokenHolders: null,
    userTokenBalance: null,
    userInvestment: null,
  },
  actions: {
    async initialize({ commit }) {
      const payload = await ICOService.initializeICO()
      // ICO event listeners
      commit('INITIALIZE', payload)
    },
    async updateIco({ commit }) {
      // get updated ICO Parameters
      const payload = await ICOService.updateICO()
      console.log(payload)
      //   commit('UPDATE_ICO', payload)
    },
  },
  mutations: {
    INITIALIZE(state, payload) {
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
      state.userEtherBalance = payload.userEtherBalance
      state.userTokenBalance = payload.userTokenBalance
      state.active = payload.active
      state.tokenHolders = payload.tokenHolders
    },
  },
}
