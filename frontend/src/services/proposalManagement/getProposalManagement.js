import data from '@/../../build/contracts/ProposalManagement.json'
import Web3Service from '@/services/web3/Web3Service'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const proposalManagementInstance = (function() {
  let instance

  async function createInstance() {
    return await Web3Service.initializeContract(abi, address)
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

export const updateProposals = async (contract) => {
  const proposals = await contract.methods.getProposals().call()
  const props = []
  if (proposals.length !== 0) {
    await Promise.all(
      proposals.map(async (proposal) => {
        const prop = await contract.methods
          .getProposalParameters(proposal)
          .call()
        props.push(prop)
      })
    )
  }
  return props
}

export const updateFee = async (contract) => {
  return Web3Service.convertFromWei(
    await contract.methods.contractFee().call(),
    'ether'
  )
}
