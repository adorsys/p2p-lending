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
        icoPayload:{
            icoGoal: null,
            icoEtherBalance: null,
            isIcoActive: null,
            totalTokenSupply: null,
            icoParticipantCount: null,
            tokenSymbol: null,
            tokenBalanceUser: null
        }
        
    }

    payload.icoPayload.contractFee = await contract.methods.contractFee().call()
    payload.icoPayload.icoGoal = await icoContract.methods.goal().call()
    payload.icoPayload.icoEtherBalance = await icoContract.methods.contractEtherBalance().call()
    payload.icoPayload.isIcoActive = await icoContract.methods.isIcoActive().call()
    payload.icoPayload.totalTokenSupply = await icoContract.methods.totalSupply().call()
    payload.icoPayload.icoParticipantCount = await icoContract.methods.getParticipantsCount().call()
    payload.icoPayload.tokenSymbol = await icoContract.methods.symbol().call()
    payload.icoPayload.tokenBalanceUser= await icoContract.methods.balanceOf(await web3.eth.getCoinbase()).call()

    
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
