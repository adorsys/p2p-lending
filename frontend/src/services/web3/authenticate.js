import store from '@/store/'

export const authenticate = async () => {
    const account = await store.state.web3.web3Instance().eth.getCoinbase()

    const authenticated = {
        tokenHolder: false,
        boardMember: false
    }

    const tokenBalance = parseInt(
        await store.state
            .icoContractInstance()
            .methods.balanceOf(account)
            .call(),
        10
    )

    if (tokenBalance !== 0) {
        authenticated.tokenHolder = true
    }
    const memberId = parseInt(
        await store.state
            .proposalManagementInstance()
            .methods.memberId(account)
            .call(),
        10
    )

    if (memberId !== 0) {
        authenticated.boardMember = true
    }

    return authenticated
}
