import { RequestManagement } from './RequestManagement'
import store from '../../state'

export const requestManagementListeners = async () => {
  const contract = await RequestManagement.get()
  if (contract) {
    requestCreatedListener(contract)
    requestGrantedListener(contract)
    withdrawListener(contract)
    debtPaidListener(contract)
  } else {
    console.error('requestManagementListeners failed')
  }
}

const requestCreatedListener = (contract) => {
  let txHash = null
  contract.events.RequestCreated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const requestGrantedListener = (contract) => {
  let txHash = null
  contract.events.RequestGranted().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const withdrawListener = (contract) => {
  let txHash = null
  contract.events.Withdraw().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const debtPaidListener = (contract) => {
  let txHash = null
  contract.events.DebtPaid().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}
