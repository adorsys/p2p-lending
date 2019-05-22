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
              const requestParameters = await contract.methods.getRequestParameters(
                address
              )
              const requestState = await contract.methods.getRequestState(
                address
              )
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
                  requestParameters.charAt(0).toUpperCase() +
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
}
