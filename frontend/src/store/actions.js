import * as types from '@/util/constants/types'

import initializeConnection from '@/util/initializeConnection'
import { initializeContractHelper } from '../util/initializeContract'
import { pollHelper } from '@/util/pollWeb3'
import { getOpenProposals } from '../util/proposalHelpers'

export default {
    async [types.INIT_CONNECTION]({ commit }) {
        let payload = await initializeConnection()
        commit(types.INIT_CONNECTION, payload)
    },
    async [types.INIT_CONTRACT]({ commit }) {
        let payload = await initializeContractHelper()
        commit(types.INIT_CONTRACT, payload)
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
