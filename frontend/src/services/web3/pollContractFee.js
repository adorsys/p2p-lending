import store from '@/store/'
import * as types from '@/util/constants/types'

let pollUpdateFee = async () => {
    let contractInstance = store.state.contractInstance

    // only listen once to given event
    contractInstance().once('ContractFeeChanged', (error, event) => {
        if (!error && event) {
            let newFee = event.returnValues._newFee
            store.dispatch(types.UPDATE_FEE, newFee)
        }
    })
}

export default pollUpdateFee
