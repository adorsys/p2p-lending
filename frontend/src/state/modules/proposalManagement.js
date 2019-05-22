import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'
import { proposalManagementListeners } from '../../services/proposalManagement/proposalManagementListeners'

export default {
  namespaced: true,
  state: {
    contractFee: null,
    proposals: [],
  },
  actions: {
    async initializeProposalManagement({ commit }) {
      const payload = {
        proposals: await ProposalManagementService.getProposals(),
        contractFee: await ProposalManagementService.getContractFee(),
      }
      if (payload.contractFee) {
        commit('INITIALIZE_PROPOSAL_MANAGEMENT', payload)
        try {
          proposalManagementListeners()
        } catch (error) {
          console.error(error)
        }
      }
    },
    async updateFee({ commit }) {
      const newFee = await ProposalManagementService.getContractFee()
      commit('UPDATE_FEE', newFee)
    },
    async refreshProposals({ commit }) {
      const proposals = await ProposalManagementService.getProposals()
      commit('REFRESH_PROPOSALS', proposals)
    },
  },
  mutations: {
    INITIALIZE_PROPOSAL_MANAGEMENT(state, payload) {
      state.contractFee = payload.contractFee
      state.proposals = payload.proposals
    },
    UPDATE_FEE(state, newFee) {
      state.contractFee = newFee
    },
    REFRESH_PROPOSALS(state, proposals) {
      state.proposals = proposals
    },
  },
}
