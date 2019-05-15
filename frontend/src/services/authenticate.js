import store from '@/state'
import { web3Instance } from '@/services/web3/getWeb3'
import { icoInstance } from '@/services/icoContract/getIco'

export const authenticate = async () => {
  const account = await web3Instance.getInstance().eth.getCoinbase()
  const icoContract = await icoInstance.getInstance()

  const authenticated = {
    tokenHolder: false,
    boardMember: false,
  }

  const tokenBalance = parseInt(
    await icoContract.methods.balanceOf(account).call(),
    10
  )

  if (tokenBalance !== 0) {
    authenticated.tokenHolder = true
  }
  const memberId = parseInt(
    await store.state
      .proposalManagementInstance()
      .methods.memberId(account)
      .call(),
    10
  )

  if (memberId !== 0) {
    authenticated.boardMember = true
  }

  return authenticated
}
