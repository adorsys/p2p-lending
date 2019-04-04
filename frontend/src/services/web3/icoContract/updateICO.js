import store from '@/store/'

export const updateIcoParameters = async contract => {
    const payload = {
        balance: null,
        participants: null,
        etherBalanceUser: null,
        tokenBalanceUser: null,
        icoActive: null,
        tokenHolders: null
    }

    const user = await store.state.web3.web3Instance().eth.getCoinbase()

    const parameters = await contract()
        .methods.getICOParameters()
        .call({ from: user })

    payload.balance = parameters.icoEtherBalance / 10 ** 18
    payload.participants = parseInt(parameters.icoParticipantCount, 10)
    payload.etherBalanceUser = parameters.etherBalanceUser / 10 ** 18
    payload.tokenBalanceUser = parameters.tokenBalanceUser / 10 ** 18
    payload.icoActive = parameters.isActive
    payload.tokenHolders = parameters.numTrustees

    return payload
}
