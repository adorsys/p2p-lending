import store from '@/store/'
import * as types from '@/util/constants/types'

async function pollOnAdded() {
    const contractInstance = store.state.contractInstance

    contractInstance()
        .events.ProposalAdded()
        .on('data', () => {
            store.dispatch(types.UPDATE_PROPOSALS)
        })
}

async function pollOnExecute() {
    const contractInstance = store.state.contractInstance
    contractInstance()
        .events.ProposalExecuted()
        .on('data', () => {
            store.dispatch(types.UPDATE_PROPOSALS)
        })
}

async function proposalInit() {
    store.dispatch(types.INIT_PROPOSALS)
}

export { pollOnAdded, pollOnExecute, proposalInit }
