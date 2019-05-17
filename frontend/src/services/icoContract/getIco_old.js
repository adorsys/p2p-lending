import data from '@/../../build/contracts/TrustToken.json'
import { Web3Service } from '../web3/Web3Service'

export const getICO = function() {
  let instance

  async function initialize() {
    const abi = data.abi
    const address = data.networks[Object.keys(data.networks)[0]].address
    instance = Web3Service.initializeContract(abi, address)
  }

  if (!instance) {
    instance = initialize()
  }

  return instance
}

// export const initializeIco = async (contract) => {
//   const web3 = web3Instance.getInstance()
//   const parameters = await contract.methods.getICOParameters().call()

//   let payload = {
//     icoGoal: null,
//     icoEtherBalance: null,
//     isIcoActive: null,
//     totalTokenSupply: null,
//     icoParticipantCount: null,
//     tokenSymbol: null,
//     tokenBalanceUser: null,
//     etherBalanceUser: null,
//     name: null,
//     decimals: null,
//     tokenHolders: null,
//   }

//   payload.icoGoal = parseFloat(web3.utils.fromWei(parameters.icoGoal, 'ether'))
//   payload.decimals = parseInt(parameters.numDecimals, 10)
//   payload.name = parameters.icoName
//   payload.icoEtherBalance = parseFloat(
//     web3.utils.fromWei(parameters.icoEtherBalance, 'ether')
//   )
//   payload.isIcoActive = parameters.isActive
//   payload.totalTokenSupply = parseInt(
//     web3.utils.fromWei(parameters.totalTokenSupply, 'ether'),
//     10
//   )
//   payload.icoParticipantCount = parseInt(parameters.icoParticipantCount, 10)
//   payload.tokenSymbol = parameters.tokenSymbol
//   payload.tokenBalanceUser = parseInt(
//     web3.utils.fromWei(parameters.tokenBalanceUser, 'ether'),
//     10
//   )
//   payload.etherBalanceUser = parseFloat(
//     web3.utils.fromWei(parameters.etherBalanceUser)
//   )
//   payload.tokenHolders = parseInt(parameters.numTrustees, 10)

//   return payload
// }
