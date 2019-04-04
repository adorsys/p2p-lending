import store from '@/store/'
import router from '@/router'
import {
    UPDATE_PROPOSALS,
    UPDATE_FEE,
    AUTHENTICATE,
    LOGOUT
} from '@/util/constants/types'

export const pollProposalManagement = contract => {
    proposalCreatedListener(contract)
    proposalExecutedListener(contract)
    contractFeeListener(contract)
    membershipChangedListener(contract)
}

const proposalCreatedListener = contract => {
    let txHash = null
    contract()
        .events.ProposalCreated()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_PROPOSALS, contract)
            }
        })
}

const proposalExecutedListener = contract => {
    let txHash = null
    contract()
        .events.ProposalExecuted()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_PROPOSALS, contract)
            }
        })
}

const contractFeeListener = contract => {
    let txHash = null
    contract()
        .events.NewContractFee()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(UPDATE_FEE, contract)
            }
        })
}

const membershipChangedListener = contract => {
    let txHash = null
    contract()
        .events.MembershipChanged()
        .on('data', event => {
            if (txHash !== event.transactionHash) {
                txHash = event.transactionHash
                store.dispatch(AUTHENTICATE)
                if (router.currentRoute.name === 'p2pManagement') {
                    if (
                        store.state.tokenHolder === false &&
                        store.state.bordMember === false
                    ) {
                        store.dispatch(LOGOUT)
                        router.push({ name: 'home' })
                    }
                }
            }
        })
}
