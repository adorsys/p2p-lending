export default {
  namespaced: true,
  state: {
    contractFee: null,
    proposals: [],
  },
  actions: {
    // async initialize({ commit }) {
    //   const contract = await proposalManagementInstance.getInstance()
    //   const payload = {
    //     proposals: await updateProposals(contract),
    //     contractFee: await updateFee(contract),
    //   }
    //   commit('INITIALIZE', payload)
    // },
  },
  mutations: {
    INITIALIZE(state, payload) {
      state.contractFee = payload.contractFee
      state.proposals = payload.proposals
    },
  },
}
