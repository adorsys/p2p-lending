import { getWeb3 } from './getWeb3'

export const Web3Service = {
  web3Active: async () => {
    const web3 = await getWeb3.get()
    if (web3) {
      return await web3.eth.net.isListening()
    }
    return false
  },
  getCurrentNetwork: async () => {
    const web3 = await getWeb3.get()
    if (web3) {
      return await web3.givenProvider.networkVersion
    }
    return null
  },
  getNetworkName: (networkId) => {
    if (NETWORKS.hasOwnProperty(networkId)) {
      return NETWORKS[networkId]
    }
    return null
  },
  getUser: async () => {
    const web3 = await getWeb3.get()
    if (web3) {
      return await web3.eth.getCoinbase()
    }
    return null
  },
  isValidAddress: async (address) => {
    const web3 = await getWeb3.get()
    if (web3) {
      return web3.utils.isAddress(address)
    }
    return false
  },
  initializeContract: async (abi, address) => {
    if (abi && address) {
      const web3 = await getWeb3.get()
      if (web3) {
        return await new web3.eth.Contract(abi, address)
      }
    }
    return null
  },
  convertToWei: async (amount, from) => {
    const unit = String(from).toLowerCase()
    if (validUnits.includes(unit)) {
      const web3 = await getWeb3.get()
      if (web3) {
        return web3.utils.toWei(String(amount), unit)
      }
    }
    return null
  },
  convertFromWei: async (amount, to) => {
    const unit = String(to).toLowerCase()
    if (validUnits.includes(unit)) {
      const web3 = await getWeb3.get()
      if (web3) {
        return parseFloat(web3.utils.fromWei(String(amount), unit))
      }
    }
    return null
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

const NETWORKS = {
  '1': 'MainNet',
  '2': 'Deprecated Morden',
  '3': 'Ropsten',
  '4': 'Rinkeby',
  '42': 'Kovan',
  '4447': 'Truffle',
  '5777': 'localhost',
}
