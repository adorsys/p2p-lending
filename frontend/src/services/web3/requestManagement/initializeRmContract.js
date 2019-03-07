import {
    requestManagementAddress,
    requestManagementABI
} from '@/util/constants/requestManagementContract'
import getWeb3 from '@/services/web3/getWeb3'

export const initializeRequestManagementContract = async () => {
    let web3 = await getWeb3()
    let contract = await new web3.eth.Contract(
        requestManagementABI,
        requestManagementAddress
    )

    let contractInstance = () => {
        return contract
    }

    return contractInstance
}
