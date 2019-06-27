import { RequestManagement } from './RequestManagement'
import store from '../../state'

export const requestManagementListeners = async () => {
  const contract = await RequestManagement.get()
  if (!contract) {
    throw new Error('requestManagementListeners failed')
  }

  requestCreatedListener(contract)
  requestGrantedListener(contract)
  withdrawListener(contract)
  debtPaidListener(contract)
}

const requestCreatedListener = (contract) => {
  let txHash
  contract.events.RequestCreated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const requestGrantedListener = (contract) => {
  let txHash
  contract.events.RequestGranted().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const withdrawListener = (contract) => {
  let txHash
  contract.events.Withdraw().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
    }
  })
}

const debtPaidListener = (contract) => {
  let txHash
  contract.events.DebtPaid().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('requestManagement/getRequests')
      store.dispatch('ico/updateIco')
    }
  })
}
