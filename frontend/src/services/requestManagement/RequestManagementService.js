import { RequestManagement } from './RequestManagement'
import { Web3Service } from '../web3/Web3Service'

export const RequestManagementService = {
  getRequests: async () => {
    const requests = []
    const contract = await RequestManagement.get()
    if (contract) {
      try {
        const reqs = await contract.methods.getRequests().call()
        if (reqs.length > 0) {
          await Promise.all(
            reqs.map(async (address) => {
              const requestParameters = await contract.methods
                .getRequestParameters(address)
                .call()
              const requestState = await contract.methods
                .getRequestState(address)
                .call()
              const req = {
                address: address,
                asker: requestParameters.asker,
                lender: requestParameters.lender,
                askAmount: await Web3Service.convertFromWei(
                  requestParameters.askAmount,
                  'ether'
                ),
                paybackAmount: await Web3Service.convertFromWei(
                  requestParameters.paybackAmount,
                  'ether'
                ),
                purpose:
                  requestParameters.purpose.charAt(0).toUpperCase() +
                  requestParameters.purpose.slice(1),
                verifiedAsker: requestState.verifiedAsker,
                lent: requestState.lent,
                withdrawnByAsker: requestState.withdrawnByAsker,
                debtSettled: requestState.debtSettled,
                status: 'Waiting',
              }
              if (req.lent) {
                req.status = 'Ether Lent'
              }
              if (req.withdrawnByAsker) {
                req.status = 'Withdrawn'
              }
              if (req.debtSettled) {
                req.status = 'PaidBack'
              }
              requests.push(req)
            })
          )
        }
      } catch (error) {
        console.error(error)
      }
    }
    return requests
  },
  createRequest: async (credit, payback, description) => {
    const createRequestReturn = {
      invalidCredit: !(credit > 0),
      invalidPayback: !(payback > 0) || payback <= credit,
      invalidDescription: description.length < 1,
    }
    if (
      !createRequestReturn.invalidCredit &&
      !createRequestReturn.invalidPayback &&
      !createRequestReturn.invalidDescription
    ) {
      const contract = await RequestManagement.get()
      if (contract) {
        const user = await Web3Service.getUser()
        if (user) {
          const creditInWei = await Web3Service.convertToWei(
            String(credit),
            'ether'
          )
          const paybackInWei = await Web3Service.convertToWei(
            String(payback),
            'ether'
          )
          try {
            await contract.methods
              .ask(creditInWei, paybackInWei, description)
              .send({ from: user })
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
    return createRequestReturn
  },
  lend: async (address) => {
    // input is valid address
    if (!(await Web3Service.isValidAddress(address))) {
      return false
    }
    // get askAmount from address
    const contract = await RequestManagement.get()
    if (contract) {
      const user = await Web3Service.getUser()
      if (user) {
        try {
          const askAmount = (await contract.methods
            .getRequestParameters(address)
            .call()).askAmount
          if (!(askAmount > 0)) {
            return false
          }
          await contract.methods
            .deposit(address)
            .send({ from: user, value: askAmount })
          return true
        } catch (error) {
          console.error(error)
        }
      }
    }
    return false
  },
  withdraw: async (address) => {
    // address is valid
    if (!(await Web3Service.isValidAddress(address))) {
      return false
    }
    const contract = await RequestManagement.get()
    if (contract) {
      const user = await Web3Service.getUser()
      if (user) {
        try {
          await contract.methods.withdraw(address).send({ from: user })
          return true
        } catch (error) {
          console.error(error)
        }
      }
    }
    return false
  },
  payback: async (address) => {
    // address is valid
    if (!(await Web3Service.isValidAddress(address))) {
      return false
    }
    // get paybackAmount for address
    const contract = await RequestManagement.get()
    if (contract) {
      const user = await Web3Service.getUser()
      if (user) {
        try {
          const info = await contract.methods
            .getRequestParameters(address)
            .call()
          const contractFee = await Web3Service.convertFromWei(
            info.contractFee,
            'ether'
          )
          const paybackAmount = await Web3Service.convertFromWei(
            info.paybackAmount,
            'ether'
          )
          const payback = contractFee + paybackAmount
          const paybackInWei = await Web3Service.convertToWei(
            String(payback),
            'ether'
          )
          console.log(paybackInWei)
          if (!(payback > 0)) {
            return false
          }
          await contract.methods
            .deposit(address)
            .send({ from: user, value: paybackInWei })
          return true
        } catch (error) {
          console.error(error)
        }
      }
    }
    return false
  },
  cancel: async (address) => {
    // valid address
    if (!(await Web3Service.isValidAddress(address))) {
      return false
    }
    const contract = await RequestManagement.get()
    if (contract) {
      const user = await Web3Service.getUser()
      if (user) {
        try {
          await contract.methods.cancelRequest(address).send({ from: user })
          return true
        } catch (error) {
          console.error(error)
        }
      }
    }
    return false
  },
}
