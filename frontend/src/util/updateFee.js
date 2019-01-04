import { store } from '../store/'

let updateFee = function() {
  setInterval(() => {
    let feeEvent = store.state.contractInstance().ContractFeeChanged()
    let oldFee = store.state.contractFee

    feeEvent.watch(function(error, result) {
      if (!error) {
        let newFee = parseInt(result.args._newFee, 10)
        if (oldFee !== newFee) {
          store.dispatch('updateFee', {
            contractFee: newFee
          })
        }
      } else {
        console.log(error)
      }
    })
  }, 1000)
}

export default updateFee
