import { pollWeb3 } from '@/services/web3/pollWeb3'
import * as types from '@/util/constants/types'
import { initializeRequestManagementContract } from '../services/web3/requestManagement/initializeRmContract'
import { pollRequestManagement } from '../services/web3/requestManagement/RequestManagementListeners'
import { initializeProposalManagement } from '../services/web3/proposalManagement/initializeProposalManagement'
import {
    initializeIcoContract,
    getTokenContractData
} from '../services/web3/initializeICO'

export default {
    [types.INIT_CONNECTION](state, payload) {
        state.web3.isInjected = payload.web3.isInjected
        state.web3.networkID = payload.web3.networkID
        state.web3.coinbase = payload.web3.coinbase
        state.web3.balance = payload.web3.balance
        state.web3.web3Instance = payload.web3.web3Instance
        initializeIcoContract()
        initializeProposalManagement()
        initializeRequestManagementContract()
        pollWeb3()
    },
    [types.INIT_PROPOSALMANAGEMENT](state, payload) {
        state.contractFee = payload.contractFee / 10 ** 18
        state.proposalManagementInstance = payload.contractInstance

        // for test purposes
        state.authenticated = true
    },
    [types.INIT_ICO](state, payload) {
        state.icoContractInstance = payload
        getTokenContractData()
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
    },
    [types.INIT_REQUESTMANAGEMENT](state, payload) {
        state.requestManagementInstance = payload
        pollRequestManagement(state.requestManagementInstance)
    },
    [types.POLL_WEB3](state, payload) {
        state.web3.networkID = payload.networkID
        state.web3.coinbase = payload.coinbase
        state.web3.balance = payload.balance
    },
    [types.UPDATE_REQUESTS](state, payload) {
        state.allRequests = []
        payload.forEach(element => {
            state.allRequests.push(element)
        })
    },
    [types.AUTHENTICATE](state, payload) {
        state.authenticated = payload
    },
    [types.LOGOUT](state) {
        state.authenticated = false
    }
}
