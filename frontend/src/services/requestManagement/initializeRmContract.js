import data from '@/../../build/contracts/RequestManagement.json'
import { initializeContract } from '../web3/Web3Service'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const requestManagementHelper = async () => {
  const contractInstance = await initializeContract(abi, address)
  const contract = () => {
    return contractInstance
  }

  return contract
}
