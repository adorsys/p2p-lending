import { address, abi } from '@/util/constants/contract'
import store from '@/store/'
import { INIT_LB_CONTRACT } from '@/util/constants/types'

const initializeLBContractHelper = async () => {
    let web3 = store.state.web3.web3Instance()
    let contract = await new web3.eth.Contract(abi, address)

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

const initializeLBContract = async () => {
    store.dispatch(INIT_LB_CONTRACT)
}

export { initializeLBContractHelper, initializeLBContract }
