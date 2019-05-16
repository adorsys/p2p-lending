import store from '@/store/'
import router from '@/router'

import * as types from '@/util/constants/types'
import { web3Instance } from '@/services/web3/getWeb3'

const pollHelper = async () => {
  const web3 = web3Instance.getInstance()
  const coinbase = await web3.eth.getCoinbase()
  return coinbase
}

const pollWeb3 = (proposalManagement, requestManagement) => {
  // eslint-disable-next-line no-undef
  ethereum.on('accountsChanged', () => {
    // force authentification if currently on p2pManagement
    store.dispatch(types.LOGOUT)
    if (
      router.currentRoute.name === 'p2pManagement' ||
      router.currentRoute.name === 'ico'
    ) {
      router.push({ name: 'home' })
    }
    store.dispatch(types.POLL_WEB3)
    store.dispatch(types.UPDATE_PROPOSALS, proposalManagement)
    store.dispatch(types.UPDATE_REQUESTS, requestManagement)
    store.dispatch('ico/updateIco')
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
    store.dispatch(types.UPDATE_REQUESTS, store.state.web3.requestManagement)
    store.dispatch('ico/updateIco')
  })
}

export { pollWeb3, pollHelper }
