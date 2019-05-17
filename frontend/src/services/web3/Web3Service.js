import { getWeb3 } from './getWeb3'

export const Web3Service = {
  web3Active: async () => {
    const web3 = getWeb3()
    if (web3) {
      return await web3.eth.net.isListening()
    } else {
      return false
    }
  },
  getUser: async () => {
    const web3 = getWeb3()
    if (web3) {
      return await web3.eth.getCoinbase()
    } else {
      return ''
    }
  },
  isValidAddress: async (address) => {
    const web3 = getWeb3()
    if (web3) {
      return web3.utils.isAddress(address)
    } else {
      return null
    }
  },
  initializeContract: async (abi, address) => {
    if (abi && address) {
      const web3 = getWeb3()
      if (web3) {
        return await web3.eth.Contract(abi, address)
      } else {
        return null
      }
    }
  },
  convertToWei: (amount, from) => {
    const unit = String(from).toLowerCase()
    if (validUnits.contains(unit)) {
      const web3 = getWeb3()
      if (web3) {
        return parseFloat(web3.utils.toWei(String(amount), unit))
      } else {
        return null
      }
    }
  },
  convertFromWei: (amount, from) => {
    const unit = String(from).toLowerCase()
    if (validUnits.contains(unit)) {
      const web3 = getWeb3()
      if (web3) {
        return parseFloat(web3.utils.fromWei(String(amount), unit))
      } else {
        return null
      }
    }
  },
}

const validUnits = [
  'wei',
  'kwei',
  'babbage',
  'mwei',
  'lovelace',
  'gwei',
  'shannon',
  'microether',
  'szabo',
  'milliether',
  'finney',
  'ether',
]
