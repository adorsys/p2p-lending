import { pollWeb3 } from '@/services/web3/pollWeb3'
import { initializeLBContract } from '@/services/web3/initializeLBContract'
import pollContractFee from '@/services/web3/pollContractFee'
import * as types from '@/util/constants/types'
import { pollProposals, proposalInit } from '../services/web3/pollProposals'

export default {
    [types.INIT_CONNECTION](state, payload) {
        state.web3.isInjected = payload.web3.isInjected
        state.web3.networkID = payload.web3.networkID
        state.web3.coinbase = payload.web3.coinbase
        state.web3.balance = payload.web3.balance
        state.web3.web3Instance = payload.web3.web3Instance
        initializeLBContract()
        pollWeb3()
    },
    [types.INIT_LB_CONTRACT](state, payload) {
        state.contractFee = payload.contractFee
        state.contractInstance = payload.contractInstance
        pollContractFee()
        proposalInit()
    },
    [types.INIT_ICO_CONTRACT](state, payload) {
        state.icoContractInstance = payload.icoInstance
        state.icoState.icoGoal = payload.icoGoal
        state.icoState.icoEtherBalance = payload.icoEtherBalance
        state.icoState.isIcoActive = payload.isIcoActive
        state.icoState.totalTokenSupply = payload.totalTokenSupply
        state.icoState.icoParticipantCount = payload.icoParticipantCount
        state.icoState.tokenSymbol = payload.tokenSymbol
        state.icoState.tokenBalanceUser = payload.tokenBalanceUser
        state.icoState.etherBalanceUser = payload.etherBalanceUser
    },
    [types.INIT_PROPOSALS](state, payload) {
        state.proposals = payload
        pollProposals()
    },
    [types.POLL_WEB3](state, payload) {
        state.web3.networkID = payload.networkID
        state.web3.coinbase = payload.coinbase
        state.web3.balance = payload.balance
    },
    [types.UPDATE_FEE](state, payload) {
        state.contractFee = payload
        pollContractFee()
    }
}
