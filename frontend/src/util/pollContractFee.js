import store from '@/store/'
import * as types from '@/util/constants/types'

let pollUpdateFee = async () => {
  console.log('Update Fee Listener Active')
  let contractInstance = store.state.contractInstance

  // only listen once to given event
  contractInstance().once('ContractFeeChanged', (error, event) => {
    if (!error && event) {
      let newFee = event.returnValues._newFee
      store.dispatch(types.UPDATE_FEE, newFee)
      console.log('Fee changed to:', newFee)
    }
  })
}

export default pollUpdateFee
