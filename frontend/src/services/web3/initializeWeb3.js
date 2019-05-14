import Web3 from 'web3'

export const web3Instance = (function() {
  let instance

  function createInstance() {
    const provider =
      'ethereum' in window ? window.ethereum : window.web3.currentProvider
    if (provider) return new Web3(provider)
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance()
      }
      return instance
    },
  }
})()
