import store from '@/store/'
import * as types from '@/util/constants/types'

async function pollProposals() {
    let contractInstance = store.state.contractInstance

    // only listen once to given event
    contractInstance().once('ProposalAdded', (error, event) => {
        if (!error && event) {
            store.dispatch(types.INIT_PROPOSALS)
        }
    })
    contractInstance().once('ProposalExecuted', (error, event) => {
        if (!error && event) {
            store.dispatch(types.INIT_PROPOSALS)
        }
    })
}

async function proposalInit() {
    store.dispatch(types.INIT_PROPOSALS)
}

export { pollProposals, proposalInit }
