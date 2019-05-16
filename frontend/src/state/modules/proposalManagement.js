import { proposalManagementInstance } from '@/services/proposalManagement/getProposalManagement'

export default {
  namespaced: true,
  state: {
    contractFee: null,
    proposals: [],
  },
  actions: {
    async initialize({ commit }) {
      const contract = proposalManagementInstance.getInstance()
      //   const contractFee = await contract.methods
    },
  },
  mutations: {},
}
