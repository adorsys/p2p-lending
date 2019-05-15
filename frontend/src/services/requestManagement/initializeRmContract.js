import data from '@/../../build/contracts/RequestManagement.json'
import store from '@/state'
import { INIT_REQUESTMANAGEMENT } from '@/util/constants/types'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

import { web3Instance } from '../web3/getWeb3'

export const requestManagementHelper = async () => {
  const web3 = web3Instance.getInstance()
  const contractInstance = await new web3.eth.Contract(abi, address)
  const contract = () => {
    return contractInstance
  }

  return contract
}

export const initializeRequestManagementContract = () => {
  store.dispatch(INIT_REQUESTMANAGEMENT)
}
