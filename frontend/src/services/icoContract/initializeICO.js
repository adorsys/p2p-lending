import data from '@/../../build/contracts/TrustToken.json'
import { INIT_ICO, INIT_ICO_CONTRACT } from '@/util/constants/types'
import store from '@/store/'

const abi = data.abi
const address = data.networks[Object.keys(data.networks)[0]].address

export const initializeTokenContract = async () => {
    const web3 = store.state.web3.web3Instance()
    const contract = await new web3.eth.Contract(abi, address)
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
        web3.utils.fromWei(parameters.icoGoal._hex, 'ether')
    )
    payload.decimals = parseInt(parameters.numDecimals, 10)
    payload.name = parameters.icoName
    payload.icoEtherBalance = parseFloat(
        web3.utils.fromWei(parameters.icoEtherBalance._hex, 'ether')
    )
    payload.isIcoActive = parameters.isActive
    payload.totalTokenSupply = parseInt(
        web3.utils.fromWei(parameters.totalTokenSupply._hex, 'ether'),
        10
    )
    payload.icoParticipantCount = parseInt(parameters.icoParticipantCount, 10)
    payload.tokenSymbol = parameters.tokenSymbol
    payload.tokenBalanceUser = parseInt(
        web3.utils.fromWei(parameters.tokenBalanceUser._hex, 'ether'),
        10
    )
    payload.etherBalanceUser = parseFloat(
        web3.utils.fromWei(parameters.etherBalanceUser._hex)
    )

    payload.tokenHolders = parseInt(parameters.numTrustees, 10)

    return payload
}

const initializeIcoContract = async () => {
    store.dispatch(INIT_ICO)
}

export const getTokenContractData = async () => {
    store.dispatch(INIT_ICO_CONTRACT)
}

export { initializeIcoContractHelper, initializeIcoContract }