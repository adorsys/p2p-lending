import store from '@/store/'

export const authenticate = async () => {
    const account = await store.state.web3.web3Instance().eth.getCoinbase()
    const memberId = parseInt(
        await store.state
            .contractInstance()
            .methods.memberID(account)
            .call(),
        10
    )

    // check if user is token holder and handle authentication

    return memberId !== 0 ? true : false
}
