// import { IcoService } from '@/services/icoContract/IcoService'
import { Web3Service } from './web3/Web3Service'
import { proposalManagementInstance } from '@/services/proposalManagement/getProposalManagement'

export const authenticate = async () => {
  const user = await Web3Service.getUser()
  const proposalManagementContract = await proposalManagementInstance.getInstance()

  const authenticated = {
    tokenHolder: false,
    boardMember: false,
  }

  //   if (icoContract) {
  //     const tokenBalance = parseFloat(
  //       await icoContract.methods.balanceOf(user).call()
  //     )
  //     authenticated.tokenHolder = tokenBalance !== 0
  //   }

  if (proposalManagementContract) {
    const memberId = await proposalManagementContract.methods
      .memberId(user)
      .call()
    authenticated.boardMember = memberId !== 0
  }
  return authenticated
}
