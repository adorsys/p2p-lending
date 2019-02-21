import { address, abi } from '@/util/constants/contract'
import { icoaddress, icoabi } from '@/util/constants/ICOContract'
import store from '@/store/'
import { INIT_CONTRACT } from '@/util/constants/types'

const initializeContractHelper = async () => {
    let web3 = store.state.web3.web3Instance()
    let contract = await new web3.eth.Contract(abi, address)
    let icoContract = await new web3.eth.Contract(icoabi, icoaddress)

    let payload = {
        contractInstance: null,
        contractFee: null,
        icoContractInstance: null,
        decimals: null
    }

    payload.contractFee = await contract.methods.contractFee().call()
    payload.decimals = await icoContract.methods.decimals().call()

    payload.contractInstance = () => {
        return contract
    }

    payload.icoContractInstance = () => {
        return icoContract
    }

    return payload
}

const initializeContract = async () => {
    store.dispatch(INIT_CONTRACT)
}

export { initializeContractHelper, initializeContract }
