import { ProposalManagement } from './ProposalManagement'
import store from '../../state'

export const proposalManagementListeners = async () => {
  const contract = await ProposalManagement.get()
  if (!contract) {
    throw new Error('ProposalManagementListeners failed')
  }

  proposalCreatedListener(contract)
  proposalExecutedListener(contract)
  contractFeeListener(contract)
  membershipChangedListener(contract)
}

const proposalCreatedListener = (contract) => {
  let txHash
  contract.events.ProposalCreated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('proposalManagement/refreshProposals')
    }
  })
}

const proposalExecutedListener = (contract) => {
  let txHash
  contract.events.ProposalExecuted().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('proposalManagement/refreshProposals')
    }
  })
}

const contractFeeListener = (contract) => {
  let txHash
  contract.events.NewContractFee().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('proposalManagement/updateFee')
    }
  })
}

const membershipChangedListener = (contract) => {
  let txHash
  contract.events.MembershipChanged().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('auth/logIn')
      if (!(store.state.auth.tokenHolder || store.state.auth.bordMember)) {
        store.dispatch('auth/logOut')
      }
    }
  })
}
