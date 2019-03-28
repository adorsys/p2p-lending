import store from '@/store/'

export const updateIcoParameters = async contract => {
    const payload = {
        balance: null,
        participants: null,
        etherBalanceUser: null,
        tokenBalanceUser: null,
        icoActive: null
    }

    const user = await store.state.web3.web3Instance().eth.getCoinbase()

    const parameters = await contract()
        .methods.getICOParameters()
        .call({ from: user })

    payload.balance = parseFloat(
        await store.state.web3
            .web3Instance()
            .utils.fromWei(parameters.icoEtherBalance, 'ether'),
        10
    )
    payload.participants = parseFloat(parameters.icoParticipantCount, 10)
    payload.etherBalanceUser = parameters.etherBalanceUser / 10 ** 18
    payload.tokenBalanceUser = parameters.tokenBalanceUser / 10 ** 18

    payload.icoActive = parameters.isActive

    return payload
}
