/* eslint-disable no-unused-vars */
import Web3 from 'web3'
import { address, ABI } from './constants/lendingContract'

let getContract = new Promise(function(resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let lendingContract = web3.eth.contract(ABI)
  let lendingContractInstance = lendingContract.at(address)
  console.log(lendingContract)
  console.log(lendingContractInstance)
  resolve(lendingContractInstance)
})

export default getContract
