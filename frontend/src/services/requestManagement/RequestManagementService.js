import { RequestManagement } from './RequestManagement'
import { Web3Service } from '../web3/Web3Service'

export const RequestManagementService = {
  getRequests: async () => {
    const requests = []
    const contract = await RequestManagement.get()
    if (!contract) {
      return requests
    }

    const requestAddresses = await contract.methods.getRequests().call()
    if (requestAddresses.length <= 0) {
      return requests
    }

    await Promise.all(
      requestAddresses.map(async (address) => {
        const requestParameters = await contract.methods
          .getRequestParameters(address)
          .call()
        const requestState = await contract.methods
          .getRequestState(address)
          .call()

        const request = {
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

        if (request.lent) {
          request.status = 'Ether Lent'
        }

        if (request.withdrawnByAsker) {
          request.status = 'Withdrawn'
        }

        if (request.debtSettled) {
          request.status = 'PaidBack'
        }

        requests.push(request)
      })
    )

    return requests
  },

  createRequest: async (credit, payback, description) => {
    const createRequestReturn = {
      invalidCredit: false,
      invalidPayback: false,
      invalidDescription: false,
    }

    const invalidCredit = parseFloat(credit) <= 0
    if (invalidCredit) {
      createRequestReturn.invalidCredit = true
      return createRequestReturn
    }

    const invalidPayback = parseFloat(payback) <= 0
    if (invalidPayback) {
      createRequestReturn.invalidPayback = true
      return createRequestReturn
    }

    if (parseFloat(payback) <= parseFloat(credit)) {
      createRequestReturn.invalidPayback = true
      return createRequestReturn
    }

    if (description.length <= 0) {
      createRequestReturn.invalidDescription = true
      return createRequestReturn
    }

    const contract = await RequestManagement.get()
    if (!contract) {
      return createRequestReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return createRequestReturn
    }

    const creditInWei = await Web3Service.convertToWei(String(credit), 'ether')
    const paybackInWei = await Web3Service.convertToWei(
      String(payback),
      'ether'
    )

    contract.methods
      .ask(creditInWei, paybackInWei, description)
      .send({ from: user })

    return createRequestReturn
  },

  lend: async (address) => {
    const validAddress = await Web3Service.isValidAddress(address)
    if (!validAddress) {
      return false
    }

    const contract = await RequestManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    const addressParameters = await contract.methods
      .getRequestParameters(address)
      .call()
    const askAmount = addressParameters.askAmount
    if (parseFloat(askAmount) <= 0) {
      return false
    }

    contract.methods.deposit(address).send({ from: user, value: askAmount })
  },

  withdraw: async (address) => {
    const validAddress = await Web3Service.isValidAddress(address)
    if (!validAddress) {
      return false
    }

    const contract = await RequestManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    contract.methods.withdraw(address).send({ from: user })
  },

  payback: async (address) => {
    const validAddress = await Web3Service.isValidAddress(address)
    if (!validAddress) {
      return false
    }

    const contract = await RequestManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    const info = await contract.methods.getRequestParameters(address).call()
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
    if (payback <= 0) {
      return false
    }

    contract.methods.deposit(address).send({ from: user, value: paybackInWei })
  },
  cancel: async (address) => {
    const validAddress = await Web3Service.isValidAddress(address)
    if (!validAddress) {
      return false
    }

    const contract = await RequestManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    contract.methods.cancelRequest(address).send({ from: user })
  },
}
