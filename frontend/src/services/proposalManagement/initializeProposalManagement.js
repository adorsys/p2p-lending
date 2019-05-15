import data from '@/../../build/contracts/ProposalManagement.json'
import store from '@/state'
import { INIT_PROPOSALMANAGEMENT } from '@/util/constants/types'
import { web3Instance } from '@/services/web3/getWeb3'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const initializeProposalManagementHelper = async () => {
  const web3 = web3Instance.getInstance()
  let contract = await new web3.eth.Contract(abi, address)

  const payload = () => {
    return contract
  }

  return payload
}

export const initializeProposalManagement = async () => {
  store.dispatch(INIT_PROPOSALMANAGEMENT)
}
