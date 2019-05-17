import { getICO } from './getICO'
import { Web3Service } from '../web3/Web3Service'

export const ICOService = {
  transfer: async function(amount, recipient) {
    if (amount > 0) {
      if (Web3Service.isValidAddress(recipient)) {
        console.log('valid')
      } else {
        console.log(getICO())
      }
    }
  },
}
