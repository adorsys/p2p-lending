import { web3Instance } from '@/services/web3/getWeb3'

export const updateIcoParameters = async (contract) => {
  const web3 = web3Instance.getInstance()
  const parameters = await contract.methods.getICOParameters().call()

  const payload = {
    contractBalance: parseFloat(
      web3.utils.fromWei(parameters.icoEtherBalance, 'ether')
    ),
    participants: parseInt(parameters.icoParticipantCount, 10),
    userEtherBalance: parseFloat(
      web3.utils.fromWei(parameters.etherBalanceUser, 'ether')
    ),
    userTokenBalance: parseFloat(
      web3.utils.fromWei(parameters.tokenBalanceUser, 'ether')
    ),
    active: parameters.isActive,
    tokenHolders: parseInt(parameters.numTrustees, 10),
  }

  return payload
}
