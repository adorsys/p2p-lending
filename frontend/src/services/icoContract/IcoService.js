import { ICO } from './ICO'
import { Web3Service } from '../web3/Web3Service'
import store from '../../state'

export const ICOService = {
  initializeICO: async () => {
    const contract = await ICO.get()
    if (!contract) {
      return null
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return null
    }

    const parameters = await contract.methods
      .getICOParameters()
      .call({ from: user })

    const payload = {
      active: parameters.isActive,
      name: parameters.icoName,
      symbol: parameters.tokenSymbol,
      decimals: parseFloat(parameters.numDecimals),
      goal: await Web3Service.convertFromWei(parameters.icoGoal, 'ether'),
      contractBalance: await Web3Service.convertFromWei(
        parameters.icoEtherBalance,
        'ether'
      ),
      tokenSupply: await Web3Service.convertFromWei(
        parameters.totalTokenSupply,
        'ether'
      ),
      participants: parseFloat(parameters.icoParticipantCount),
      tokenHolders: parseFloat(parameters.numTrustees),
      userInvestment: await Web3Service.convertFromWei(
        parameters.etherBalanceUser,
        'ether'
      ),
      userTokenBalance: await Web3Service.convertFromWei(
        parameters.tokenBalanceUser,
        'ether'
      ),
    }

    return payload
  },

  updateICO: async () => {
    const contract = await ICO.get()
    if (!contract) {
      return null
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return null
    }

    const parameters = await contract.methods
      .getICOParameters()
      .call({ from: user })

    const payload = {
      contractBalance: await Web3Service.convertFromWei(
        parameters.icoEtherBalance,
        'ether'
      ),
      participants: parseFloat(parameters.icoParticipantCount),
      userInvestment: await Web3Service.convertFromWei(
        parameters.etherBalanceUser,
        'ether'
      ),
      userTokenBalance: await Web3Service.convertFromWei(
        parameters.tokenBalanceUser,
        'ether'
      ),
      active: parameters.isActive,
      tokenHolders: parseFloat(parameters.numTrustees),
    }

    return payload
  },

  getTokenBalance: () => {
    return store.state.ico.userTokenBalance
  },

  invest: async (amount) => {
    if (parseFloat(amount) <= 0) {
      return false
    }

    const contract = await ICO.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    const amountInWei = await Web3Service.convertToWei(amount, 'ether')
    contract.methods.participate().send({ from: user, value: amountInWei })

    return true
  },

  transfer: async (amount, recipient) => {
    const transferReturn = {
      invalidAmount: parseFloat(amount) <= 0,
      invalidRecipient: !(await Web3Service.isValidAddress(recipient)),
    }
    if (transferReturn.invalidAmount || transferReturn.invalidRecipient) {
      return transferReturn
    }

    const contract = await ICO.get()
    if (!contract) {
      return transferReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return transferReturn
    }

    const amountInWei = await Web3Service.convertToWei(amount, 'ether')
    contract.methods.transfer(recipient, amountInWei).send({ from: user })
    return transferReturn
  },

  giveApproval: async (amount, target) => {
    const giveApprovalReturn = {
      invalidAmount: parseFloat(amount) <= 0,
      invalidTarget: !(await Web3Service.isValidAddress(target)),
    }
    if (giveApprovalReturn.invalidAmount || giveApprovalReturn.invalidTarget) {
      return giveApprovalReturn
    }

    const contract = await ICO.get()
    if (!contract) {
      return giveApprovalReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return giveApprovalReturn
    }

    const rawUserTokenBalance = await contract.methods.balanceOf(user).call()
    const userTokenBalance = await Web3Service.convertFromWei(
      rawUserTokenBalance,
      'ether'
    )

    if (userTokenBalance < parseFloat(amount)) {
      giveApprovalReturn.invalidAmount = true
      return giveApprovalReturn
    }

    const amountInWei = await Web3Service.convertToWei(amount, 'ether')
    contract.methods.approve(target, amountInWei).send({ from: user })

    return giveApprovalReturn
  },

  checkAllowance: async (owner) => {
    const checkAllowanceReturn = {
      invalidOwner: !(await Web3Service.isValidAddress(owner)),
      allowance: '',
    }
    if (checkAllowanceReturn.invalidOwner) {
      return checkAllowanceReturn
    }

    const contract = await ICO.get()
    if (!contract) {
      return checkAllowanceReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return checkAllowanceReturn
    }

    const rawAllowance = await contract.methods.allowance(owner, user).call()
    const allowance = await Web3Service.convertFromWei(rawAllowance, 'ether')
    checkAllowanceReturn.allowance = String(allowance)

    return checkAllowanceReturn
  },

  transferFrom: async (amount, origin, recipient) => {
    const transferFromReturn = {
      invalidAmount: false,
      invalidOrigin: false,
      invalidRecipient: false,
    }

    const validOrigin = await Web3Service.isValidAddress(origin)
    if (!validOrigin) {
      transferFromReturn.invalidOrigin = true
      return transferFromReturn
    }

    const allowanceForOrigin = await ICOService.checkAllowance(origin).allowance
    if (allowanceForOrigin < parseFloat(amount)) {
      transferFromReturn.invalidAmount = true
      return transferFromReturn
    }

    const validRecipient = await Web3Service.isValidAddress(recipient)
    if (!validRecipient) {
      transferFromReturn.invalidRecipient = true
      return transferFromReturn
    }

    const contract = await ICO.get()
    if (!contract) {
      return transferFromReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return transferFromReturn
    }

    const amountInWei = await Web3Service.convertToWei(amount, 'ether')
    contract.methods
      .transferFrom(origin, recipient, amountInWei)
      .send({ from: user })

    return transferFromReturn
  },
}
