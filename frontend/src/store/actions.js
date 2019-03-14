import * as types from '@/util/constants/types'

import getOpenProposals from '../util/proposalHelpers'
import initializeConnection from '@/services/web3/initializeConnection'
import { initializeContractHelper } from '@/services/web3/initializeContract'
import { initializeIcoContractHelper } from '@/services/web3/initializeICO'
import { pollHelper } from '@/services/web3/pollWeb3'
import { requestManagementHelper } from '../services/web3/requestManagement/initializeRmContract'
import { requestHelper } from '../services/web3/requestManagement/getLendingRequests'
import { authenticate } from '../services/web3/authenticate'

export default {
    async [types.INIT_CONNECTION]({ commit }) {
        const payload = await initializeConnection()
        commit(types.INIT_CONNECTION, payload)
    },
    async [types.INIT_CONTRACT]({ commit }) {
        const payload = await initializeContractHelper()
        commit(types.INIT_CONTRACT, payload)
    },
    async [types.INIT_REQUESTMANAGEMENT]({ commit }) {
        const payload = await requestManagementHelper()
        commit(types.INIT_REQUESTMANAGEMENT, payload)
    },
    async [types.INIT_ICO_CONTRACT]({ commit }) {
        const payload = await initializeIcoContractHelper()
        commit(types.INIT_ICO_CONTRACT, payload)
    },
    async [types.INIT_PROPOSALS]({ commit }) {
        const payload = await getOpenProposals()
        commit(types.INIT_PROPOSALS, payload)
    },
    async [types.UPDATE_PROPOSALS]({ commit }) {
        const payload = await getOpenProposals()
        commit(types.UPDATE_PROPOSALS, payload)
    },
    async [types.POLL_WEB3]({ commit }) {
        const payload = await pollHelper()
        commit(types.POLL_WEB3, payload)
    },
    async [types.UPDATE_FEE]({ commit }, payload) {
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
    }
}
