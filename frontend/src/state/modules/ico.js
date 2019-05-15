import { icoInstance, initializeIco } from '@/services/icoContract/getIco'
import { updateIcoParameters } from '@/services/icoContract/updateICO'
import { pollICO } from '@/services/icoContract/icoListeners'

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
    userEtherBalance: null,
  },
  actions: {
    async initialize({ commit }) {
      const contract = await icoInstance.getInstance()
      const payload = await initializeIco(contract)
      pollICO(contract)
      commit('INITIALIZE', payload)
    },
    async updateIco({ commit }) {
      const contract = await icoInstance.getInstance()
      const payload = await updateIcoParameters(contract)
      commit('UPDATE_ICO', payload)
    },
  },
  mutations: {
    INITIALIZE(state, payload) {
      state.active = payload.isIcoActive
      state.goal = payload.icoGoal
      state.decimals = payload.decimals
      state.symbol = payload.tokenSymbol
      state.name = payload.name
      state.tokenSupply = payload.totalTokenSupply
      state.contractBalance = payload.icoEtherBalance
      state.participants = payload.icoParticipantCount
      state.tokenHolders = payload.tokenHolders
      state.userTokenBalance = payload.tokenBalanceUser
      state.userEtherBalance = payload.etherBalanceUser
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
