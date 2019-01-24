import { address, ABI } from '@/util/constants/contract'
import store from '@/store/'
import { INIT_CONTRACT } from '@/util/constants/types'

const initializeContractHelper = async () => {
  let web3 = store.state.web3.web3Instance()
  let contract = await new web3.eth.Contract(ABI, address)

  let payload = {
    contractInstance: null,
    contractFee: null
  }

  payload.contractFee = await contract.methods.contractFee().call()

  payload.contractInstance = () => {
    return contract
  }

  return payload
}

const initializeContract = async () => {
  store.dispatch(INIT_CONTRACT)
}

export { initializeContractHelper, initializeContract }
