import * as types from '@/util/constants/types'

import { requestManagementHelper } from '../services/requestManagement/initializeRmContract'
import { requestHelper } from '../services/requestManagement/getLendingRequests'
import { authenticate } from '../services/authenticate'

export default {
  //   async [types.INIT_CONNECTION]({ commit }) {
  //     commit(types.INIT_CONNECTION)
  //   },
  //   async [types.INIT_REQUESTMANAGEMENT]({ commit }) {
  //     const payload = await requestManagementHelper()
  //     commit(types.INIT_REQUESTMANAGEMENT, payload)
  //   },
  //   async [types.UPDATE_REQUESTS]({ commit }, contract) {
  //     const payload = await requestHelper(contract)
  //     commit(types.UPDATE_REQUESTS, payload)
  //   },
  async [types.AUTHENTICATE]({ commit }) {
    const payload = await authenticate()
    commit(types.AUTHENTICATE, payload)
  },
  [types.LOGOUT]({ commit }) {
    commit(types.LOGOUT)
  },
}
