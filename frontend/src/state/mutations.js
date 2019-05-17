import * as types from '@/util/constants/types'

export default {
  [types.INIT_CONNECTION]() {},
  [types.INIT_REQUESTMANAGEMENT](state, payload) {
    state.requestManagementInstance = payload
  },
  [types.UPDATE_REQUESTS](state, payload) {
    state.allRequests = payload
  },
}
