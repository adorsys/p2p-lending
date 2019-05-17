import { Web3Service } from '@/services/web3/Web3Service'

export const updateIcoParameters = async (contract) => {
  const parameters = await contract.methods.getICOParameters().call()

  const payload = {
    contractBalance: parseFloat(
      Web3Service.convertFromWei(parameters.icoEtherBalance, 'ether')
    ),
    participants: parseInt(parameters.icoParticipantCount, 10),
    userEtherBalance: parseFloat(
      Web3Service.convertFromWei(parameters.etherBalanceUser, 'ether')
    ),
    userTokenBalance: parseFloat(
      Web3Service.convertFromWei(parameters.tokenBalanceUser, 'ether')
    ),
    active: parameters.isActive,
    tokenHolders: parseInt(parameters.numTrustees, 10),
  }

  return payload
}
