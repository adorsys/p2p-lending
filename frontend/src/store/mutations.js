import { pollWeb3 } from '@/services/web3/pollWeb3'
import { initializeContract } from '@/services/web3/initializeContract'
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
        initializeContract()
        pollWeb3()
    },
    [types.INIT_CONTRACT](state, payload) {
        state.contractFee = payload.contractFee
        state.contractInstance = payload.contractInstance
        state.icoContractInstance = payload.icoContractInstance
        state.icoState.icoGoal = payload.icoPayload.icoGoal
        state.icoState.icoEtherBalance = payload.icoPayload.icoEtherBalance
        state.icoState.isIcoActive = payload.icoPayload.isIcoActive
        state.icoState.totalTokenSupply = payload.icoPayload.totalTokenSupply
        state.icoState.tokenSymbol = payload.icoPayload.tokenSymbol 
        state.icoState.tokenBalanceUser = payload.icoPayload.tokenBalanceUser 
        state.icoState.icoParticipantCount = payload.icoPayload.icoParticipantCount 
        state.icoState.etherBalanceUser = payload.icoPayload.etherBalanceUser 
        pollContractFee()
        proposalInit()
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
