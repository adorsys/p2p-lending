import data from '../../../../build/contracts/TrustToken.json'
import { Web3Service } from '../web3/Web3Service'

// ICO Singleton
export const ICO = (function() {
  let instance

  async function initialize() {
    const network = await Web3Service.getCurrentNetwork()
    const abi = data.abi
    const address = data.networks[network].address
    return await Web3Service.initializeContract(abi, address)
  }

  return {
    get: async function() {
      if (!instance) {
        instance = await initialize()
      }
      return instance
    },
  }
})()
