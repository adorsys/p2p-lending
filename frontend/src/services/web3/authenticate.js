import store from '@/store/'

export const authenticate = async () => {
    const account = await store.state.web3.web3Instance().eth.getCoinbase()
    const tokenBalance = parseInt(
        await store.state
            .icoContractInstance()
            .methods.balanceOf(account)
            .call(),
        10
    )

    if (tokenBalance !== 0) {
        return true
    } else {
        const memberId = parseInt(
            await store.state
                .proposalManagementInstance()
                .methods.memberId(account)
                .call(),
            10
        )

        if (memberId !== 0) {
            return true
        }
    }
    return false
}
