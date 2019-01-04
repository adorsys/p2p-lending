import { store } from '../store/'

let currentFee = function() {
  let temp = new Promise((resolve, reject) => {
    store.state.contractInstance().contractFee.call(
      {
        from: store.state.web3.coinbase
      },
      function(error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(parseInt(result, 10))
        }
      }
    )
  })
  return temp
}

let initializeFee = function() {
  currentFee.call().then(result =>
    store.dispatch('initializeFee', {
      contractFee: result
    })
  )
}

export default initializeFee
