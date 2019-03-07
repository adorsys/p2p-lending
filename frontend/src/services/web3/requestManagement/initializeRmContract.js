import {
    requestManagementAddress,
    requestManagementABI
} from '@/util/constants/requestManagementContract'
import getWeb3 from '@/services/web3/getWeb3'

export const initializeRequestManagementContract = async () => {
    let web3Instance = await getWeb3()
    let contractInstance = await new web3Instance.eth.Contract(
        requestManagementABI,
        requestManagementAddress
    )
    return {
        contract: contractInstance,
        web3: web3Instance
    }
}
