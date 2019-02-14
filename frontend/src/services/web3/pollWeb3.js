import store from '@/store/'

import * as types from '@/util/constants/types'

let pollHelper = async () => {
    let web3 = store.state.web3.web3Instance()

    let payload = {
        networkID: null,
        coinbase: null,
        balance: null
    }

    payload.networkID = await web3.eth.net.getId()
    payload.coinbase = await web3.eth.getCoinbase()
    payload.balance = await web3.utils.fromWei(
        await web3.eth.getBalance(payload.coinbase),
        'ether'
    )

    return payload
}

let pollWeb3 = async () => {
    // eslint-disable-next-line no-undef
    ethereum.on('accountsChanged', async () => {
        store.dispatch(types.POLL_WEB3)
    })
    // eslint-disable-next-line no-undef
    ethereum.on('networkChanged', async () => {
        store.dispatch(types.POLL_WEB3)
    })
}

export { pollWeb3, pollHelper }
