import Web3 from 'web3'

export const getWeb3 = (function() {
  let instance

  function initialize() {
    if (window.ethereum) {
      // eslint-disable-next-line no-undef
      return new Web3(ethereum)
    } else if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider)
    } else {
      return null
    }
  }

  return {
    get: async function() {
      if (!instance) {
        instance = initialize()
        if (instance) {
          // eslint-disable-next-line no-undef
          await ethereum.enable()
        }
      }
      return instance
    },
  }
})()
