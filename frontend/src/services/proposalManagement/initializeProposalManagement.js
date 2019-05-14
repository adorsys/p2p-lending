import data from '@/../../build/contracts/ProposalManagement.json'
import store from '@/store/'
import { INIT_PROPOSALMANAGEMENT } from '@/util/constants/types'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const initializeProposalManagementHelper = async () => {
  let web3 = store.state.web3.web3Instance()
  let contract = await new web3.eth.Contract(abi, address)

  const payload = () => {
    return contract
  }

  return payload
}

export const initializeProposalManagement = async () => {
  store.dispatch(INIT_PROPOSALMANAGEMENT)
}
