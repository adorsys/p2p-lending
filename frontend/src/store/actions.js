import * as types from '@/util/constants/types'

import getOpenProposals from '../util/proposalHelpers'
import initializeConnection from '@/services/web3/initializeConnection'
import { initializeContractHelper } from '@/services/web3/initializeContract'
import { initializeIcoContractHelper } from '@/services/web3/initializeICO'
import { pollHelper } from '@/services/web3/pollWeb3'
import { requestManagementHelper } from '../services/web3/requestManagement/initializeRmContract'
import { requestHelper } from '../services/web3/requestManagement/getLendingRequests'

export default {
    async [types.INIT_CONNECTION]({ commit }) {
        let payload = await initializeConnection()
        commit(types.INIT_CONNECTION, payload)
    },
    async [types.INIT_CONTRACT]({ commit }) {
        let payload = await initializeContractHelper()
        commit(types.INIT_CONTRACT, payload)
    },
    async [types.INIT_REQUESTMANAGEMENT]({ commit }) {
        let payload = await requestManagementHelper()
        commit(types.INIT_REQUESTMANAGEMENT, payload)
    },
    async [types.INIT_ICO_CONTRACT]({ commit }) {
        let payload = await initializeIcoContractHelper()
        commit(types.INIT_ICO_CONTRACT, payload)
    },
    async [types.INIT_PROPOSALS]({ commit }) {
        let payload = await getOpenProposals()
        commit(types.INIT_PROPOSALS, payload)
    },
    async [types.UPDATE_PROPOSALS]({ commit }) {
        let payload = await getOpenProposals()
        commit(types.UPDATE_PROPOSALS, payload)
    },
    async [types.POLL_WEB3]({ commit }) {
        let payload = await pollHelper()
        commit(types.POLL_WEB3, payload)
    },
    async [types.UPDATE_FEE]({ commit }, payload) {
        commit(types.UPDATE_FEE, payload)
    },
    async [types.UPDATE_REQUESTS]({ commit }, contract) {
        let payload = await requestHelper(contract)
        commit(types.UPDATE_REQUESTS, payload)
    }
}
