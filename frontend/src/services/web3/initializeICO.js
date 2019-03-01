import getWeb3 from '@/services/web3/getWeb3'
import { icoAddress, icoAbi } from '@/util/constants/ICOContract'
import { INIT_ICO_CONTRACT } from '@/util/constants/types'
import store from '@/store/'

const initializeIcoContractHelper = async () => {
    let web3 = await getWeb3()
    let contract = await new web3.eth.Contract(icoAbi, icoAddress)

    let payload = {
        icoInstance: null,
        icoGoal: null,
        icoEtherBalance: null,
        isIcoActive: null,
        totalTokenSupply: null,
        icoParticipantCount: null,
        tokenSymbol: null,
        tokenBalanceUser: null,
        etherBalanceUser: null,
        name: null,
        decimals: null
    }

    payload.icoGoal = parseFloat(await web3.utils.fromWei(await contract.methods.goal().call(), 'ether'),10)
    payload.decimals = parseFloat(await contract.methods.decimals().call())
    payload.name = await contract.methods.name().call()
    payload.icoEtherBalance = parseFloat(await web3.utils.fromWei(await contract.methods.contractEtherBalance().call(),'ether'),10)
    payload.isIcoActive = await contract.methods.isIcoActive().call()
    payload.totalTokenSupply = parseFloat(await web3.utils.fromWei(await contract.methods.totalSupply().call(),'ether'),10)
    payload.icoParticipantCount = parseFloat(await contract.methods.getParticipantsCount().call(),10)
    payload.tokenSymbol = await contract.methods.symbol().call()
    payload.tokenBalanceUser = parseFloat(await web3.utils.fromWei(await contract.methods.balanceOf(await web3.eth.getCoinbase()).call(),'ether'),10)
    payload.etherBalanceUser = parseFloat(await web3.utils.fromWei(await contract.methods.getEtherBalances().call({ from: await web3.eth.getCoinbase() })),10)
    
    payload.icoInstance = () => {
        return contract
    }

    console.log(payload)

    return payload
}

const initializeIcoContract = async () => {
    store.dispatch(INIT_ICO_CONTRACT)
}

export { initializeIcoContractHelper, initializeIcoContract }
