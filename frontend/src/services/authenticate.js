import { ICOService } from './icoContract/IcoService'

export const authenticate = async () => {
  const authenticated = {
    tokenHolder: (await ICOService.getTokenBalance()) !== 0,
    boardMember: false,
  }

  return authenticated
}
