import router from '../../router'
import store from '../../state'
import { Web3Service } from '../../services/web3/Web3Service'
import { accountListener } from '../../services/web3/web3Listeners'
import { authenticate } from '../../services/authenticate'
import data from '../../../../build/contracts/Migrations.json'

export default {
  namespaced: true,
  state: {
    isInjected: false,
    invalidNetwork: true,
    currentNetwork: null,
    tokenHolder: false,
    boardMember: false,
  },
  actions: {
    async initialize({ commit, dispatch }) {
      const payload = {
        injected: await Web3Service.web3Active(),
        invalidNetwork: true,
        currentNetwork: null,
      }
      if (payload.injected) {
        // prevent load on wrong network
        const network = await Web3Service.getCurrentNetwork()
        const deployedNetwork = Object.keys(data.networks)
        payload.currentNetwork = Web3Service.getNetworkName(deployedNetwork[0])
        if (data.networks.hasOwnProperty(network)) {
          payload.invalidNetwork = false
          dispatch('ico/initializeIco', null, {
            root: true,
          })
          dispatch('proposalManagement/initializeProposalManagement', null, {
            root: true,
          })
          dispatch('requestManagement/initializeRequestManagement', null, {
            root: true,
          })
          dispatch('requestManagement/getRequests', null, {
            root: true,
          })
          accountListener()
        }
      }
      commit('INITIALIZE', payload)
    },
    async logIn({ commit }) {
      const payload = await authenticate()
      commit('LOGIN', payload)
    },
    logOut({ commit }) {
      commit('LOGOUT')
    },
  },
  mutations: {
    INITIALIZE(state, payload) {
      state.isInjected = payload.injected
      state.invalidNetwork = payload.invalidNetwork
      state.currentNetwork = payload.currentNetwork
    },
    LOGIN(state, payload) {
      state.tokenHolder = payload.tokenHolder
      state.boardMember = payload.boardMember
    },
    LOGOUT(state) {
      const routeName = router.currentRoute.name
      state.tokenHolder = false
      state.boardMember = false
      if (
        routeName === 'p2pManagement' ||
        (routeName === 'ico' && !store.state.ico.active)
      ) {
        router.push({ name: 'home' })
      }
    },
  },
}
