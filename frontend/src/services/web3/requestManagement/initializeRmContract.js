import {
    requestManagementAddress,
    requestManagementABI
} from '@/util/constants/requestManagementContract'
import store from '@/store/'
import { INIT_REQUESTMANAGEMENT } from '@/util/constants/types'

import getWeb3 from '@/services/web3/getWeb3'

export const requestManagementHelper = async () => {
    let web3Instance = await getWeb3()
    let contractInstance = await new web3Instance.eth.Contract(
        requestManagementABI,
        requestManagementAddress
    )
    const contract = () => {
        return contractInstance
    }

    return contract
}

export const initializeRequestManagementContract = () => {
    store.dispatch(INIT_REQUESTMANAGEMENT)
}
