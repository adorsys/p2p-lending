import { getWeb3 } from './getWeb3'

export const Web3Service = {
  web3Active: async () => {
    const web3 = await getWeb3.get()
    if (!web3) {
      return false
    }
    return await web3.eth.net.isListening()
  },

  getCurrentNetwork: async () => {
    const web3 = await getWeb3.get()
    if (!web3) {
      return null
    }
    return await web3.givenProvider.networkVersion
  },

  getNetworkName: (networkId) => {
    if (!NETWORKS.hasOwnProperty(networkId)) {
      return null
    }
    return NETWORKS[networkId]
  },

  getUser: async () => {
    const web3 = await getWeb3.get()
    if (!web3) {
      return null
    }
    return await web3.eth.getCoinbase()
  },

  isValidAddress: async (address) => {
    const web3 = await getWeb3.get()
    if (!web3) {
      return false
    }
    return web3.utils.isAddress(address)
  },

  initializeContract: async (abi, address) => {
    const web3 = await getWeb3.get()
    if (!web3) {
      return null
    }

    const contract = await new web3.eth.Contract(abi, address)

    return contract
  },

  convertToWei: async (amount, from) => {
    const unit = String(from).toLowerCase()
    if (!validUnits.includes(unit)) {
      return null
    }

    const web3 = await getWeb3.get()
    if (!web3) {
      return null
    }

    return web3.utils.toWei(String(amount), unit)
  },

  convertFromWei: async (amount, to) => {
    const unit = String(to).toLowerCase()
    if (!validUnits.includes(unit)) {
      return null
    }

    const web3 = await getWeb3.get()
    if (!web3) {
      return null
    }

    return parseFloat(web3.utils.fromWei(String(amount), unit))
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
