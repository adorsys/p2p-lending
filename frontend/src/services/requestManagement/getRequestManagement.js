import data from '../../../../build/contracts/RequestManagement.json'
import { web3Instance } from '../web3/Web3Service'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const requestManagementInstance = (function() {
  let instance

  async function createInstance() {
    const web3 = web3Instance.getInstance()
    if (web3) {
      return await new web3.eth.Contract(abi, address)
    }
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
  }
})()
