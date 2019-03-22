import store from '@/store/'

export const updateIcoEtherBalance = async contract => {
    const balance = await contract()
        .methods.contractEtherBalance()
        .call()

    return store.state.web3.web3Instance().utils.fromWei(balance, 'ether')
}

export const updateInvestedBalance = async contract => {
    const balance = await contract()
        .methods.etherBalances(store.state.web3.coinbase)
        .call()

    return store.state.web3.web3Instance().utils.fromWei(balance, 'ether')
}
