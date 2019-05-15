import data from '@/../../build/contracts/TrustToken.json'
import { web3Instance } from '@/services/web3/getWeb3'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const icoInstance = (function() {
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

export const initializeIco = async (contract) => {
  const web3 = web3Instance.getInstance()
  const parameters = await contract.methods.getICOParameters().call()

  let payload = {
    icoGoal: null,
    icoEtherBalance: null,
    isIcoActive: null,
    totalTokenSupply: null,
    icoParticipantCount: null,
    tokenSymbol: null,
    tokenBalanceUser: null,
    etherBalanceUser: null,
    name: null,
    decimals: null,
    tokenHolders: null,
  }

  payload.icoGoal = parseFloat(web3.utils.fromWei(parameters.icoGoal, 'ether'))
  payload.decimals = parseInt(parameters.numDecimals, 10)
  payload.name = parameters.icoName
  payload.icoEtherBalance = parseFloat(
    web3.utils.fromWei(parameters.icoEtherBalance, 'ether')
  )
  payload.isIcoActive = parameters.isActive
  payload.totalTokenSupply = parseInt(
    web3.utils.fromWei(parameters.totalTokenSupply, 'ether'),
    10
  )
  payload.icoParticipantCount = parseInt(parameters.icoParticipantCount, 10)
  payload.tokenSymbol = parameters.tokenSymbol
  payload.tokenBalanceUser = parseInt(
    web3.utils.fromWei(parameters.tokenBalanceUser, 'ether'),
    10
  )
  payload.etherBalanceUser = parseFloat(
    web3.utils.fromWei(parameters.etherBalanceUser)
  )
  payload.tokenHolders = parseInt(parameters.numTrustees, 10)

  return payload
}
