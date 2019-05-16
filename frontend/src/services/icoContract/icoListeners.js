import store from '@/state'
import router from '@/router'

export const pollICO = (contract) => {
  participatedListener(contract)
  icoFinishedListener(contract)
  transferListener(contract)
}

const participatedListener = (contract) => {
  let txHash = null
  contract.events.Participated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco', contract)
    }
  })
}

const icoFinishedListener = (contract) => {
  let txHash = null
  contract.events.ICOFinished().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      router.push({ name: 'home' })
      store.dispatch('ico/updateIco', contract)
    }
  })
}

const transferListener = (contract) => {
  let txHash = null
  contract.events.Transfer().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      store.dispatch('ico/updateIco', contract)
    }
  })
}
