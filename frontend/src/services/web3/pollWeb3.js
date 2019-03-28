import store from '@/store/'
import router from '@/router'

import * as types from '@/util/constants/types'

let pollHelper = async () => {
    let web3 = store.state.web3.web3Instance()

    let payload = {
        networkID: null,
        coinbase: null
    }

    payload.networkID = await web3.eth.net.getId()
    payload.coinbase = await web3.eth.getCoinbase()

    return payload
}

let pollWeb3 = (proposalManagement, requestManagement, icoContract) => {
    // eslint-disable-next-line no-undef
    ethereum.on('accountsChanged', () => {
        // force authentification if currently on p2pManagement
        if (router.currentRoute.name === 'p2pManagement') {
            store.dispatch(types.LOGOUT)
            router.push({ name: 'home' })
        }
        store.dispatch(types.POLL_WEB3)
        store.dispatch(types.UPDATE_PROPOSALS, proposalManagement)
        store.dispatch(types.UPDATE_REQUESTS, requestManagement)
        store.dispatch(types.UPDATE_ICO, icoContract)
    })
    // eslint-disable-next-line no-undef
    ethereum.on('networkChanged', () => {
        // force authentification if currently on p2pManagement
        if (router.currentRoute.name === 'p2pManagement') {
            store.dispatch(types.LOGOUT)
            router.push({ name: 'home' })
        }
        store.dispatch(types.POLL_WEB3)
        store.dispatch(types.UPDATE_PROPOSALS, proposalManagement)
        store.dispatch(
            types.UPDATE_REQUESTS,
            store.state.web3.requestManagement
        )
        store.dispatch(types.UPDATE_ICO, icoContract)
    })
}

export { pollWeb3, pollHelper }
