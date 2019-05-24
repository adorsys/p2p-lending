import { ICOService } from './icoContract/IcoService'
import { ProposalManagementService } from './proposalManagement/ProposalManagementService'

export const authenticate = async () => {
  const authenticated = {
    tokenHolder: (await ICOService.getTokenBalance()) > 0,
    boardMember: await ProposalManagementService.getMemberStatus(),
  }
  return authenticated
}
