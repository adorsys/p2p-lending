import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'
import { proposalManagementListeners } from '../../services/proposalManagement/proposalManagementListeners'

export default {
  namespaced: true,
  state: {
    contractFee: null,
    proposals: [],
  },
  actions: {
    async initializeProposalManagement({ commit, dispatch }) {
      const payload = {
        proposals: await ProposalManagementService.getProposals(),
        contractFee: await ProposalManagementService.getContractFee(),
      }
      if (payload.contractFee) {
        proposalManagementListeners()
        commit('INITIALIZE_PROPOSAL_MANAGEMENT', payload)

        // authentication on load
        dispatch('auth/logIn', null, {
          root: true,
        })
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
