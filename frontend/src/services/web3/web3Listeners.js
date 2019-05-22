import store from '../../state'

export const accountListener = () => {
  // eslint-disable-next-line no-undef
  ethereum.on('accountsChanged', () => {
    store.dispatch('auth/logOut')
    store.dispatch('ico/updateIco')

    if (!store.state.ico.active) {
      // Token were distributed
      console.log('icoInactive account change')
      // update requests
    }
  })
}
