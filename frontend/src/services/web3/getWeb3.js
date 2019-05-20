import Web3 from 'web3'

export const getWeb3 = (function() {
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

  return {
    get: async function() {
      if (!instance) {
        instance = initialize()
      }
      // eslint-disable-next-line no-undef
      await ethereum.enable()
      return instance
    },
  }
})()
