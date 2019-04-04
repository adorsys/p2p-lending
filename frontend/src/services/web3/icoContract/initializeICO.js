import { icoAddress, icoAbi } from '@/util/constants/ICOContract'
import { INIT_ICO, INIT_ICO_CONTRACT } from '@/util/constants/types'
import store from '@/store/'

export const initializeTokenContract = async () => {
    const web3 = store.state.web3.web3Instance()
    const contract = await new web3.eth.Contract(icoAbi, icoAddress)

    const payload = () => {
        return contract
    }

    return payload
}

const initializeIcoContractHelper = async () => {
    const web3 = store.state.web3.web3Instance()
    const contract = store.state.icoContractInstance()

    const parameters = await contract.methods
        .getICOParameters()
        .call({ from: store.state.web3.coinbase })

    let payload = {
        icoGoal: null,
        icoEtherBalance: null,
        isIcoActive: null,
        totalTokenSupply: null,
        icoParticipantCount: null,
        tokenSymbol: null,
        tokenBalanceUser: null,
        etherBalanceUser: null,
        name: null,
        decimals: null,
        tokenHolders: null
    }

    payload.icoGoal = parseFloat(
        web3.utils.fromWei(parameters.icoGoal, 'ether'),
        10
    )
    payload.decimals = parseFloat(parameters.numDecimals)
    payload.name = parameters.icoName
    payload.icoEtherBalance = parseFloat(
        web3.utils.fromWei(parameters.icoEtherBalance, 'ether'),
        10
    )
    payload.isIcoActive = parameters.isActive
    payload.totalTokenSupply = parseFloat(
        web3.utils.fromWei(parameters.totalTokenSupply, 'ether'),
        10
    )
    payload.icoParticipantCount = parseFloat(parameters.icoParticipantCount, 10)
    payload.tokenSymbol = parameters.tokenSymbol
    payload.tokenBalanceUser = parseFloat(
        web3.utils.fromWei(parameters.tokenBalanceUser, 'ether'),
        10
    )
    payload.etherBalanceUser = parseFloat(
        web3.utils.fromWei(parameters.etherBalanceUser),
        10
    )

    payload.tokenHolders = parameters.numTrustees

    return payload
}

const initializeIcoContract = async () => {
    store.dispatch(INIT_ICO)
}

export const getTokenContractData = async () => {
    store.dispatch(INIT_ICO_CONTRACT)
}

export { initializeIcoContractHelper, initializeIcoContract }
