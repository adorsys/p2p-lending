import * as types from '@/util/constants/types'

import { initializeProposalManagementHelper } from '../services/proposalManagement/initializeProposalManagement'
import { requestManagementHelper } from '../services/requestManagement/initializeRmContract'
import { requestHelper } from '../services/requestManagement/getLendingRequests'
import { authenticate } from '../services/authenticate'
import { updateProposalHelper } from '../services/proposalManagement/updateProposals'
import { updateContractFeeHelper } from '../services/proposalManagement/updateContractFee'

export default {
  async [types.INIT_CONNECTION]({ commit }) {
    commit(types.INIT_CONNECTION)
  },
  async [types.INIT_PROPOSALMANAGEMENT]({ commit }) {
    const payload = await initializeProposalManagementHelper()
    commit(types.INIT_PROPOSALMANAGEMENT, payload)
  },
  async [types.INIT_REQUESTMANAGEMENT]({ commit }) {
    const payload = await requestManagementHelper()
    commit(types.INIT_REQUESTMANAGEMENT, payload)
  },
  async [types.UPDATE_PROPOSALS]({ commit }, contract) {
    const payload = await updateProposalHelper(contract)
    commit(types.UPDATE_PROPOSALS, payload)
  },
  async [types.UPDATE_FEE]({ commit }, contract) {
    const payload = await updateContractFeeHelper(contract)
    commit(types.UPDATE_FEE, payload)
  },
  async [types.UPDATE_REQUESTS]({ commit }, contract) {
    const payload = await requestHelper(contract)
    commit(types.UPDATE_REQUESTS, payload)
  },
  async [types.AUTHENTICATE]({ commit }) {
    const payload = await authenticate()
    commit(types.AUTHENTICATE, payload)
  },
  [types.LOGOUT]({ commit }) {
    commit(types.LOGOUT)
  },
}
