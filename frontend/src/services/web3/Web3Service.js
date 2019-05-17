import { getWeb3 } from './getWeb3'

let web3

export const web3Active = async () => {
  if (!web3) {
    console.log('web3Active init')
    web3 = getWeb3()
  }
  return await web3.eth.net.isListening()
}
export const getUser = async () => {
  if (!web3) {
    console.log('getUser init')
    web3 = getWeb3()
  }
  return await web3.eth.getCoinbase()
}
export const isValidAddress = async (address) => {
  if (!web3) {
    console.log('isValidAddress init')
    web3 = getWeb3()
  }
  return web3.utils.isAddress(address)
}
export const initializeContract = async (abi, address) => {
  if (abi && address) {
    if (!web3) {
      console.log('initializeContract init')
      web3 = getWeb3()
    }
    return await new web3.eth.Contract(abi, address)
  }
  return null
}
export const convertToWei = (amount, from) => {
  const unit = String(from).toLowerCase()
  if (validUnits.includes(unit)) {
    if (!web3) {
      console.log('convertToWei init')
      web3 = getWeb3()
    }
    return parseFloat(web3.utils.toWei(String(amount), unit))
  }
  return null
}
export const convertFromWei = (amount, from) => {
  const unit = String(from).toLowerCase()
  if (validUnits.includes(unit)) {
    if (!web3) {
      console.log('convertFromWei init')
      web3 = getWeb3()
    }
    return parseFloat(web3.utils.fromWei(String(amount), unit))
  }
  return null
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
