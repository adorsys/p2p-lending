import { RequestManagementService } from '../../services/requestManagement/RequestManagementService'
import { requestManagementListeners } from '../../services/requestManagement/RequestManagementListeners'

export default {
  namespaced: true,
  state: {
    requests: [],
  },
  actions: {
    initializeRequestManagement() {
      requestManagementListeners()
    },
    async getRequests({ commit }) {
      const requests = await RequestManagementService.getRequests()
      commit('GETREQUESTS', requests)
    },
  },
  mutations: {
    GETREQUESTS(state, requests) {
      state.requests = requests
    },
  },
}
