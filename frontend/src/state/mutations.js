import * as types from '@/util/constants/types'
import router from '@/router'
import { initializeRequestManagementContract } from '../services/requestManagement/initializeRmContract'
import { pollRequestManagement } from '../services/requestManagement/RequestManagementListeners'
import { initializeProposalManagement } from '../services/proposalManagement/initializeProposalManagement'
import { pollProposalManagement } from '../services/proposalManagement/proposalManagementListeners'
import { updateContractFee } from '../services/proposalManagement/updateContractFee'

export default {
  [types.INIT_CONNECTION]() {
    initializeProposalManagement()
    initializeRequestManagementContract()
  },
  [types.INIT_PROPOSALMANAGEMENT](state, payload) {
    state.proposalManagementInstance = payload
    updateContractFee(state.proposalManagementInstance)
    pollProposalManagement(state.proposalManagementInstance)
  },
  [types.INIT_REQUESTMANAGEMENT](state, payload) {
    state.requestManagementInstance = payload
    pollRequestManagement(state.requestManagementInstance)
  },
  [types.UPDATE_PROPOSALS](state, payload) {
    state.proposals = payload
  },
  [types.UPDATE_FEE](state, payload) {
    state.contractFee = payload
  },
  [types.UPDATE_REQUESTS](state, payload) {
    state.allRequests = payload
  },
  [types.AUTHENTICATE](state, payload) {
    state.tokenHolder = payload.tokenHolder
    state.boardMember = payload.boardMember
  },
  [types.LOGOUT](state) {
    // no longer logged in -> prevent access to management
    const routeName = router.currentRoute.name
    if (routeName === 'p2pManagement' || routeName === 'ico') {
      router.push({ name: 'home' })
    }
    state.tokenHolder = false
    state.boardMember = false
  },
}
