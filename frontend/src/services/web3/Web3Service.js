import { getWeb3 } from './getWeb3'

export const Web3Service = {
  web3Active: async () => {
    const web3 = await getWeb3.get()
    return await web3.eth.net.isListening()
  },
  getUser: async () => {
    const web3 = await getWeb3.get()
    return await web3.eth.getCoinbase()
  },
  isValidAddress: async (address) => {
    const web3 = await getWeb3.get()
    return web3.utils.isAddress(address)
  },
  initializeContract: async (abi, address) => {
    if (abi && address) {
      const web3 = await getWeb3.get()
      return await new web3.eth.Contract(abi, address)
    }
    return null
  },
  convertToWei: async (amount, from) => {
    const unit = String(from).toLowerCase()
    if (validUnits.includes(unit)) {
      const web3 = await getWeb3.get()
      return web3.utils.toWei(String(amount), unit)
    }
    return null
  },
  convertFromWei: async (amount, to) => {
    const unit = String(to).toLowerCase()
    if (validUnits.includes(unit)) {
      const web3 = await getWeb3.get()
      return parseFloat(web3.utils.fromWei(String(amount), unit))
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
