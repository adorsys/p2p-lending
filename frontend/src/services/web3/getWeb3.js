import Web3 from 'web3'

export const getWeb3 = function() {
  let instance

  function initialize() {
    const provider =
      'ethereum' in window ? window.ethereum : window.web3.currentProvider
    if (provider) {
      return new Web3(provider)
    } else {
      return null
    }
  }

  if (!instance) {
    instance = initialize()
  }

  return instance
}
