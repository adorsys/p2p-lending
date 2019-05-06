import data from '@/../../build/contracts/RequestManagement.json'
import store from '@/store/'
import { INIT_REQUESTMANAGEMENT } from '@/util/constants/types'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

import getWeb3 from '@/services/web3/getWeb3'

export const requestManagementHelper = async () => {
    let web3Instance = await getWeb3()
    let contractInstance = await new web3Instance.eth.Contract(abi, address)
    const contract = () => {
        return contractInstance
    }

    return contract
}

export const initializeRequestManagementContract = () => {
    store.dispatch(INIT_REQUESTMANAGEMENT)
}
