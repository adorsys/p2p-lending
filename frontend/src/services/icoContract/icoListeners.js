import router from '@/router'
import { ICO } from './ICO'
import { ICOService } from './IcoService'

export const icoListeners = async () => {
  const contract = await ICO.get()
  participatedListener(contract)
  icoFinishedListener(contract)
  transferListener(contract)
}

const participatedListener = (contract) => {
  let txHash = null
  contract.events.Participated().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      ICOService.updateICO()
    }
  })
}

const icoFinishedListener = (contract) => {
  let txHash = null
  contract.events.ICOFinished().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      ICOService.updateICO()
      router.push({ name: 'home' })
    }
  })
}

const transferListener = (contract) => {
  let txHash = null
  contract.events.Transfer().on('data', (event) => {
    if (txHash !== event.transactionHash) {
      txHash = event.transactionHash
      ICOService.updateICO()
    }
  })
}
