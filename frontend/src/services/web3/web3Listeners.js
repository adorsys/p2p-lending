import store from '@/state'

export const accountListener = () => {
  // eslint-disable-next-line no-undef
  ethereum.on('accountsChanged', () => {
    store.dispatch('web3/logout')
    store.dispatch('ico/updateIco')
  })
}

export const networkListener = () => {
  // eslint-disable-next-line no-undef
  ethereum.on('networkChanged', () => {
    store.dispatch('web3/logout')
    store.dispatch('ico/updateIco')
  })
}
