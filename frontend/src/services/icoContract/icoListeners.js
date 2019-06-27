import store from '../../state'
import { ICO } from './ICO'

export const icoListeners = async () => {
  const contract = await ICO.get()
  if (!contract) {
    throw new Error('ICOListeners failed')
  }
  participatedListener(contract)
  icoFinishedListener(contract)
  transferListener(contract)
}

const participatedListener = (contract) => {
  let txHash
  contract.events.Participated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco')
    }
  })
}

const icoFinishedListener = (contract) => {
  let txHash
  contract.events.ICOFinished().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('auth/logOut')
      store.dispatch('ico/updateIco')
    }
  })
}

const transferListener = (contract) => {
  let txHash
  contract.events.Transfer().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco')
    }
  })
}
