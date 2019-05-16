import data from '@/../../build/contracts/ProposalManagement.json'
import { web3Instance } from '@/services/web3/getWeb3'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const proposalManagementInstance = (function() {
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
