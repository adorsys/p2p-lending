import * as types from '@/util/constants/types'

import initializeConnection from '@/services/web3/initializeConnection'
import { initializeProposalManagementHelper } from '../services/web3/proposalManagement/initializeProposalManagement'
import { initializeIcoContractHelper } from '@/services/web3/initializeICO'
import { pollHelper } from '@/services/web3/pollWeb3'
import { requestManagementHelper } from '../services/web3/requestManagement/initializeRmContract'
import { requestHelper } from '../services/web3/requestManagement/getLendingRequests'
import { authenticate } from '../services/web3/authenticate'
import { initializeTokenContract } from '../services/web3/initializeICO'

export default {
    async [types.INIT_CONNECTION]({ commit }) {
        const payload = await initializeConnection()
        commit(types.INIT_CONNECTION, payload)
    },
    async [types.INIT_PROPOSALMANAGEMENT]({ commit }) {
        const payload = await initializeProposalManagementHelper()
        commit(types.INIT_PROPOSALMANAGEMENT, payload)
    },
    async [types.INIT_REQUESTMANAGEMENT]({ commit }) {
        const payload = await requestManagementHelper()
        commit(types.INIT_REQUESTMANAGEMENT, payload)
    },
    async [types.INIT_ICO]({ commit }) {
        const payload = await initializeTokenContract()
        commit(types.INIT_ICO, payload)
    },
    async [types.INIT_ICO_CONTRACT]({ commit }) {
        const payload = await initializeIcoContractHelper()
        commit(types.INIT_ICO_CONTRACT, payload)
    },
    async [types.POLL_WEB3]({ commit }) {
        const payload = await pollHelper()
        commit(types.POLL_WEB3, payload)
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
    }
}
