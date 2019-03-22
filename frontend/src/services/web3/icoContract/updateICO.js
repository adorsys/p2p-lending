import store from '@/store/'

export const updateIcoParameters = async contract => {
    const payload = {
        balance: null,
        participants: null,
        etherBalanceUser: null,
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
    payload.etherBalanceUser = parseFloat(
        await store.state.web3
            .web3Instance()
            .utils.fromWei(parameters.etherBalanceUser),
        10
    )

    payload.icoActive = parameters.isActive

    return payload
}
