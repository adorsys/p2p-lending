import store from '@/store/'
import { UPDATE_FEE } from '@/util/constants/types'

export const updateContractFeeHelper = async contract => {
    const contractFee = await contract()
        .methods.contractFee()
        .call()
    return contractFee / 10 ** 18
}

export const updateContractFee = contract => {
    store.dispatch(UPDATE_FEE, contract)
}
