import store from '../../state'
import { ICOService } from '../icoContract/IcoService'

export const accountListener = () => {
  // eslint-disable-next-line no-undef
  ethereum.on('accountsChanged', () => {
    store.dispatch('auth/logOut')
    ICOService.updateICO()
    // update proposals
    // update requests
  })
}
