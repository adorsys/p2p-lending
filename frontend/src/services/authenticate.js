import { web3Instance } from '@/services/web3/getWeb3'
import { icoInstance } from '@/services/icoContract/getIco'
import { proposalManagementInstance } from '@/services/proposalManagement/getProposalManagement'

export const authenticate = async () => {
  const web3 = web3Instance.getInstance()
  if (web3) {
    const user = await web3.eth.getCoinbase()
    const icoContract = await icoInstance.getInstance()
    const proposalManagementContract = await proposalManagementInstance.getInstance()

    const authenticated = {
      tokenHolder: false,
      boardMember: false,
    }

    if (icoContract) {
      const tokenBalance = parseFloat(
        await icoContract.methods.balanceOf(user).call()
      )
      authenticated.tokenHolder = tokenBalance !== 0
    }

    if (proposalManagementContract) {
      const memberId = await proposalManagementContract.methods
        .memberId(user)
        .call()
      authenticated.boardMember = memberId !== 0
    }
    return authenticated
  } else {
    return null
  }
}
