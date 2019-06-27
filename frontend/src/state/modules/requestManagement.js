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
      commit('GET_REQUESTS', requests)
    },
  },
  mutations: {
    GET_REQUESTS(state, requests) {
      state.requests = requests
    },
  },
}
