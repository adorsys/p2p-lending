import store from '@/store/'
import * as types from '@/util/constants/types'

let pollProposals = async () => {
  console.log('Proposal Listener Active')
  let contractInstance = store.state.contractInstance

  // only listen once to given event
  contractInstance().once('ProposalAdded', (error, event) => {
    if (!error && event) {
      store.dispatch(types.INIT_PROPOSALS)
      console.log('updated Proposals')
    }
  })
  contractInstance().once('ProposalExecuted', (error, event) => {
    if (!error && event) {
      store.dispatch(types.INIT_PROPOSALS)
      console.log('updated Proposals')
    }
  })
}

export default pollProposals
