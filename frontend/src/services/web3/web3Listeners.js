import store from '../../state'

export const accountListener = () => {
  // eslint-disable-next-line no-undef
  ethereum.on('accountsChanged', () => {
    store.dispatch('auth/logOut')
    store.dispatch('ico/updateIco')

    if (!store.state.ico.active) {
      store.dispatch('requestManagement/getRequests')
      store.dispatch('proposalManagement/refreshProposals')
      store.dispatch('proposalManagement/updateFee')
    }
  })
}
