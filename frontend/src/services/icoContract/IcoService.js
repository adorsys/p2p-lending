import { ICO } from './getICO'
import { ICOListeners } from './icoListeners'
import {
  getUser,
  convertFromWei,
  convertToWei,
  isValidAddress,
} from '../web3/Web3Service'

export const ICOService = {
  initializeICO: async () => {
    const contract = await ICO.getInstance()
    if (contract) {
      // get initial parameters
      const parameters = await contract.methods.getICOParameters().call()
      const payload = {
        active: parameters.isActive,
        name: parameters.icoName,
        symbol: parameters.tokenSymbol,
        decimals: parseFloat(parameters.numDecimals),
        goal: convertFromWei(parameters.icoGoal, 'ether'),
        contractBalance: convertFromWei(parameters.icoEtherBalance, 'ether'),
        tokenSupply: convertFromWei(parameters.totalTokenSupply, 'ether'),
        participants: parseFloat(parameters.icoParticipantCount),
        tokenHolders: parseFloat(parameters.numTrustees),
        userInvestment: convertFromWei(parameters.etherBalanceUser, 'ether'),
        userTokenBalance: convertFromWei(parameters.tokenBalanceUser, 'ether'),
      }

      // start event listeners
      ICOListeners(contract)

      return payload
    } else {
      return null
    }
  },
  updateICO: async () => {
    const contract = await ICO.getInstance()
    if (contract) {
      const parameters = await contract.methods.getICOParameters().call()
      const payload = {
        active: parameters.isActive,
        participants: parseFloat(parameters.icoParticipantCount),
        tokenHolders: parseFloat(parameters.numTrustees),
        contractBalance: convertFromWei(parameters.icoEtherBalance, 'ether'),
        userInvestment: convertFromWei(parameters.etherBalanceUser, 'ether'),
        userTokenBalance: convertFromWei(parameters.tokenBalanceUser, 'ether'),
      }
      return payload
    } else {
      return null
    }
  },
  invest: async (amount) => {
    if (amount > 0) {
      const contract = await ICO.getInstance()
      if (contract) {
        try {
          const user = await getUser()
          const amountInWei = convertToWei(String(amount), 'ether')
          await contract.methods
            .participate()
            .send({ from: user, value: amountInWei })
          return true
        } catch (error) {
          console.error(error)
          return false
        }
      }
    } else {
      return false
    }
  },
  transfer: async (amount, recipient) => {
    if (amount > 0) {
      if (isValidAddress(recipient)) {
        console.log('valid')
      }
    }
  },
}
