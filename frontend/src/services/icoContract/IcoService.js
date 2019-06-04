import { ICO } from './ICO'
import { Web3Service } from '../web3/Web3Service'
import store from '../../state'

export const ICOService = {
  initializeICO: async () => {
    const contract = await ICO.get()
    if (contract) {
      try {
        const user = await Web3Service.getUser()
        if (user) {
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
        }
      } catch (error) {
        console.error(error)
      }
      return null
    }
  },
  updateICO: async () => {
    const contract = await ICO.get()
    if (contract) {
      try {
        const user = await Web3Service.getUser()
        if (user) {
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
        }
      } catch (error) {
        console.error(error)
      }
    }
    return null
  },
  getTokenBalance: () => {
    return store.state.ico.userTokenBalance
  },
  invest: async (amount) => {
    if (amount > 0) {
      const contract = await ICO.get()
      if (contract) {
        try {
          const user = await Web3Service.getUser()
          if (user) {
            const amountInWei = await Web3Service.convertToWei(
              String(amount),
              'ether'
            )
            await contract.methods
              .participate()
              .send({ from: user, value: amountInWei })
            return true
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return false
  },
  transfer: async (amount, recipient) => {
    const transferReturn = {
      invalidAmount: !(amount > 0),
      invalidRecipient: !(await Web3Service.isValidAddress(recipient)),
    }
    if (!transferReturn.invalidAmount && !transferReturn.invalidRecipient) {
      const contract = await ICO.get()
      if (contract) {
        try {
          const user = await Web3Service.getUser()
          if (user) {
            const amountInWei = await Web3Service.convertToWei(
              String(amount),
              'ether'
            )
            await contract.methods
              .transfer(recipient, amountInWei)
              .send({ from: user })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return transferReturn
  },
  giveApproval: async (amount, target) => {
    const giveApprovalReturn = {
      invalidTarget: !(await Web3Service.isValidAddress(target)),
      invalidAmount: !(amount > 0),
    }
    if (
      !giveApprovalReturn.invalidTarget &&
      !giveApprovalReturn.invalidAmount
    ) {
      const contract = await ICO.get()
      if (contract) {
        try {
          const user = await Web3Service.getUser()
          if (user) {
            const userBalanceInWei = await contract.methods
              .balanceOf(user)
              .call()

            const userBalance = await Web3Service.convertFromWei(
              userBalanceInWei,
              'ether'
            )
            const amountInWei = await Web3Service.convertToWei(
              String(amount),
              'ether'
            )
            if (userBalance >= amount) {
              await contract.methods
                .approve(target, amountInWei)
                .send({ from: user })
            } else {
              giveApprovalReturn.invalidAmount = true
            }
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return giveApprovalReturn
  },
  checkAllowance: async (owner) => {
    const checkAllowanceReturn = {
      invalidOwner: !(await Web3Service.isValidAddress(owner)),
      allowance: 0,
    }
    if (!checkAllowanceReturn.invalidOwner) {
      const contract = await ICO.get()
      if (contract) {
        try {
          const user = await Web3Service.getUser()
          if (user) {
            const allowance = await contract.methods
              .allowance(owner, user)
              .call()
            checkAllowanceReturn.allowance = await Web3Service.convertFromWei(
              allowance,
              'ether'
            )
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return checkAllowanceReturn
  },
  transferFrom: async (amount, origin, recipient) => {
    const transferFromReturn = {
      invalidAmount:
        (await ICOService.checkAllowance(origin)).allowance < amount,
      invalidOrigin: !(await Web3Service.isValidAddress(origin)),
      invalidRecipient: !(await Web3Service.isValidAddress(recipient)),
    }
    if (
      !transferFromReturn.invalidOrigin &&
      !transferFromReturn.invalidRecipient
    ) {
      if (!transferFromReturn.invalidAmount) {
        const contract = await ICO.get()
        if (contract) {
          const amountInWei = await Web3Service.convertToWei(amount, 'ether')
          const user = await Web3Service.getUser()
          if (user) {
            await contract.methods
              .transferFrom(origin, recipient, amountInWei)
              .send({ from: user })
          }
        }
      }
    }
    return transferFromReturn
  },
}
