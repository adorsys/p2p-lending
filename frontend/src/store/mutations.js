import { pollWeb3 } from '@/services/web3/pollWeb3'
import * as types from '@/util/constants/types'
import { initializeRequestManagementContract } from '../services/web3/requestManagement/initializeRmContract'
import { pollRequestManagement } from '../services/web3/requestManagement/RequestManagementListeners'
import { initializeProposalManagement } from '../services/web3/proposalManagement/initializeProposalManagement'
import { pollProposalManagement } from '../services/web3/proposalManagement/proposalManagementListeners'
import {
    initializeIcoContract,
    getTokenContractData
} from '../services/web3/icoContract/initializeICO'
import { updateContractFee } from '../services/web3/proposalManagement/updateContractFee'
import { pollICO } from '../services/web3/icoContract/icoListeners'

export default {
    [types.INIT_CONNECTION](state, payload) {
        state.web3.isInjected = payload.web3.isInjected
        state.web3.networkID = payload.web3.networkID
        state.web3.coinbase = payload.web3.coinbase
        state.web3.web3Instance = payload.web3.web3Instance
        initializeIcoContract()
        initializeProposalManagement()
        initializeRequestManagementContract()
    },
    [types.INIT_PROPOSALMANAGEMENT](state, payload) {
        state.proposalManagementInstance = payload
        // update contract fee
        updateContractFee(state.proposalManagementInstance)
        // poll proposal Management
        pollProposalManagement(state.proposalManagementInstance)
    },
    [types.INIT_ICO](state, payload) {
        state.icoContractInstance = payload
        getTokenContractData()
        pollICO(state.icoContractInstance)
    },
    [types.INIT_ICO_CONTRACT](state, payload) {
        state.icoState.icoGoal = payload.icoGoal
        state.icoState.icoEtherBalance = payload.icoEtherBalance
        state.icoState.isIcoActive = payload.isIcoActive
        state.icoState.totalTokenSupply = payload.totalTokenSupply
        state.icoState.icoParticipantCount = payload.icoParticipantCount
        state.icoState.tokenSymbol = payload.tokenSymbol
        state.icoState.tokenBalanceUser = payload.tokenBalanceUser
        state.icoState.etherBalanceUser = payload.etherBalanceUser
        state.icoState.name = payload.name
        state.icoState.decimals = payload.decimals
        state.icoState.tokenHolders = payload.tokenHolders
    },
    [types.INIT_REQUESTMANAGEMENT](state, payload) {
        state.requestManagementInstance = payload
        pollWeb3(
            state.proposalManagementInstance,
            state.requestManagementInstance,
            state.icoContractInstance
        )
        pollRequestManagement(state.requestManagementInstance)
    },
    [types.POLL_WEB3](state, payload) {
        state.web3.networkID = payload.networkID
        state.web3.coinbase = payload.coinbase
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
    [types.UPDATE_ICO](state, payload) {
        state.icoState.icoEtherBalance = payload.balance
        state.icoState.icoParticipantCount = payload.participants
        state.icoState.etherBalanceUser = payload.etherBalanceUser
        state.icoState.tokenBalanceUser = payload.tokenBalanceUser
        state.icoState.isIcoActive = payload.icoActive
        state.icoState.tokenHolders = payload.tokenHolders
    },
    [types.AUTHENTICATE](state, payload) {
        state.tokenHolder = payload.tokenHolder
        state.boardMember = payload.boardMember
    },
    [types.LOGOUT](state) {
        state.tokenHolder = false
        state.boardMember = false
    }
}
