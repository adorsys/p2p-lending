import router from '../../router'
import store from '../../state'
import { ICO } from './ICO'

export const icoListeners = async () => {
  const contract = await ICO.get()
  if (contract) {
    participatedListener(contract)
    icoFinishedListener(contract)
    transferListener(contract)
  } else {
    console.error('ICOListeners failed')
  }
}

const participatedListener = (contract) => {
  let txHash = null
  contract.events.Participated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco')
    }
  })
}

const icoFinishedListener = (contract) => {
  let txHash = null
  contract.events.ICOFinished().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco')
      router.push({ name: 'home' })
    }
  })
}

const transferListener = (contract) => {
  let txHash = null
  contract.events.Transfer().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco')
    }
  })
}
