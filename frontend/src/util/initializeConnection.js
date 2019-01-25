import getWeb3 from './getWeb3'

let initializeConnection = async () => {
  let web3 = await getWeb3()

  let payload = {
    web3: {
      isInjected: null,
      networkID: null,
      coinbase: null,
      balance: null,
      web3Instance: null
    }
  }

  payload.web3.isInjected = await web3.eth.net.isListening()
  payload.web3.networkID = await web3.eth.net.getId()
  payload.web3.coinbase = await web3.eth.getCoinbase()
  payload.web3.balance = await web3.utils.fromWei(
    await web3.eth.getBalance(payload.web3.coinbase),
    'ether'
  )
  payload.web3.web3Instance = () => {
    return web3
  }

  return payload
}

export default initializeConnection
