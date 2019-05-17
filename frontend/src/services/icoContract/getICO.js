import data from '@/../../build/contracts/TrustToken.json'
import { initializeContract } from '../web3/Web3Service'

export const ICO = (function() {
  let instance

  async function initialize() {
    const abi = data.abi
    const address = data.networks[Object.keys(data.networks)[0]].address
    return await initializeContract(abi, address)
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = initialize()
      }
      return instance
    },
  }
})()
