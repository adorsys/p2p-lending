import * as types from '@/util/constants/types'

import getOpenProposals from '../util/proposalHelpers'
import initializeConnection from '@/services/web3/initializeConnection'
import { initializeLBContractHelper } from '@/services/web3/initializeLBContract'
import { pollHelper } from '@/services/web3/pollWeb3'
import { initializeIcoContractHelper } from '../services/web3/initializeICO'

export default {
    async [types.INIT_CONNECTION]({ commit }) {
        let payload = await initializeConnection()
        commit(types.INIT_CONNECTION, payload)
    },
    async [types.INIT_LB_CONTRACT]({ commit }) {
        let payload = await initializeLBContractHelper()
        commit(types.INIT_LB_CONTRACT, payload)
    },
    async [types.INIT_ICO_CONTRACT]({ commit }) {
        let payload = await initializeIcoContractHelper()
        commit(types.INIT_ICO_CONTRACT, payload)
    },
    async [types.INIT_PROPOSALS]({ commit }) {
        let payload = await getOpenProposals()
        commit(types.INIT_PROPOSALS, payload)
    },
    async [types.POLL_WEB3]({ commit }) {
        let payload = await pollHelper()
        commit(types.POLL_WEB3, payload)
    },
    async [types.UPDATE_FEE]({ commit }, payload) {
        commit(types.UPDATE_FEE, payload)
    }
}
