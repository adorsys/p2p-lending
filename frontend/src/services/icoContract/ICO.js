import data from '@/../../build/contracts/TrustToken.json'
import Web3Service from '../web3/Web3Service'

export const ICO = (function() {
  let instance

  async function initialize() {
    const abi = data.abi
    const address = data.networks[Object.keys(data.networks)[0]].address
    return await Web3Service.initializeContract(abi, address)
  }

  return {
    get: async function() {
      if (!instance) {
        instance = await initialize()
      }
      return await instance
    },
  }
})()
