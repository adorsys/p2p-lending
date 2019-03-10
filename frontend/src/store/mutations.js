import { pollWeb3 } from '@/services/web3/pollWeb3'
import { initializeContract } from '@/services/web3/initializeContract'
import pollContractFee from '@/services/web3/pollContractFee'
import * as types from '@/util/constants/types'
import * as poll from '../services/web3/pollProposals'
import { initializeRequestManagementContract } from '../services/web3/requestManagement/initializeRmContract'

export default {
    [types.INIT_CONNECTION](state, payload) {
        state.web3.isInjected = payload.web3.isInjected
        state.web3.networkID = payload.web3.networkID
        state.web3.coinbase = payload.web3.coinbase
        state.web3.balance = payload.web3.balance
        state.web3.web3Instance = payload.web3.web3Instance
        initializeContract()
        initializeRequestManagementContract()
        pollWeb3()
    },
    [types.INIT_CONTRACT](state, payload) {
        state.contractFee = payload.contractFee
        state.contractInstance = payload.contractInstance
        pollContractFee()
        poll.proposalInit()
    },
    [types.INIT_REQUESTMANAGEMENT](state, payload) {
        state.requestManagementInstance = payload
    },
    [types.INIT_PROPOSALS](state, payload) {
        state.proposals = payload
        poll.pollOnExecute()
        poll.pollOnAdded()
    },
    [types.UPDATE_PROPOSALS](state, payload) {
        state.proposals = payload
    },
    [types.POLL_WEB3](state, payload) {
        state.web3.networkID = payload.networkID
        state.web3.coinbase = payload.coinbase
        state.web3.balance = payload.balance
    },
    [types.UPDATE_FEE](state, payload) {
        state.contractFee = payload
        pollContractFee()
    },
    [types.UPDATE_REQUESTS](state, payload) {
        payload.forEach(element => {
            state.allRequests.push(element)
        })
    }
}
