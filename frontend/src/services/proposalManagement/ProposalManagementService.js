import { ProposalManagement } from './ProposalManagement'
import { proposalManagementListeners } from './proposalManagementListeners'
import { Web3Service } from '../web3/Web3Service'
import store from '../../state'

export const ProposalManagementService = {
  getProposals: async () => {
    const proposalParameters = []
    const contract = await ProposalManagement.get()
    if (contract) {
      proposalManagementListeners(contract)
      try {
        const proposals = await contract.methods.getProposals().call()
        if (proposals.length > 0) {
          await Promise.all(
            proposals.map(async (element) => {
              const prop = await contract.methods
                .getProposalParameters(element)
                .call()
              proposalParameters.push(prop)
            })
          )
        }
        return proposalParameters
      } catch (error) {
        console.error(error)
      }
    }
    return proposalParameters
  },
  getContractFee: async () => {
    const contract = await ProposalManagement.get()
    if (contract) {
      const fee = await contract.methods.contractFee().call()
      return await Web3Service.convertFromWei(fee, 'ether')
    }
  },
  getMemberStatus: async (address) => {
    const contract = await ProposalManagement.get()
    if (contract) {
      try {
        if (address == null) {
          address = await Web3Service.getUser()
        }
        const memberId = await contract.methods.memberId(address).call()
        return memberId > 0
      } catch (error) {
        console.error(error)
      }
    }
    return false
  },
  createContractFeeProposal: async (proposedFee) => {
    if (!(proposedFee > 0) || !proposedFee) {
      return false
    }

    // prevent non member call
    const isMember = await ProposalManagementService.getMemberStatus()
    if (!isMember) {
      return false
    }

    const contract = await ProposalManagement.get()
    if (contract) {
      try {
        const user = await Web3Service.getUser()
        const feeInWei = await Web3Service.convertToWei(
          String(proposedFee),
          'ether'
        )
        await contract.methods
          .createContractFeeProposal(feeInWei)
          .send({ from: user })
        return true
      } catch (error) {
        console.error(error)
      }
    }
    return false
  },
  createMemberProposal: async (memberAddress, action) => {
    const memberProposalReturn = {
      invalidAddress: !(await Web3Service.isValidAddress(memberAddress)),
      invalidAction: true,
    }

    // check if proposal for memberAddress exists already
    store.state.proposalManagement.proposals.forEach((element) => {
      if (
        String(element.memberAddress).toLowerCase() ===
        String(memberAddress).toLowerCase()
      ) {
        memberProposalReturn.invalidAddress = true
        return memberProposalReturn
      }
    })

    if (memberAddress.length > 0) {
      const memberStatus = await ProposalManagementService.getMemberStatus(
        memberAddress
      )
      /**
       * action is valid for memberAddress
       * action === true -> addMember
       * action === false -> removeMember
       * memberStatus === true -> action has to be removeMember
       * meberStatus === false -> action has to be addMember
       */
      memberProposalReturn.invalidAction = memberStatus ? action : !action
    }

    if (
      !memberProposalReturn.invalidAddress &&
      !memberProposalReturn.invalidAction
    ) {
      // prevent call from non member
      const calleeIsMember = await ProposalManagementService.getMemberStatus()
      if (!calleeIsMember) {
        return memberProposalReturn
      }
      const contract = await ProposalManagement.get()
      if (contract) {
        try {
          const user = await Web3Service.getUser()
          await contract.methods
            .createMemberProposal(memberAddress, action)
            .send({ from: user })
        } catch (error) {
          console.error(error)
        }
      }
    }
    return memberProposalReturn
  },
  vote: async (stance, address) => {
    if (!(await Web3Service.isValidAddress(address))) {
      return false
    }

    // prevent call from non member
    const calleeIsMember = await ProposalManagementService.getMemberStatus()
    if (!calleeIsMember) {
      return false
    }

    const contract = await ProposalManagement.get()
    if (contract) {
      const user = await Web3Service.getUser()
      try {
        await contract.methods.vote(stance, address).send({ from: user })
        return true
      } catch (error) {
        console.error(error)
      }
    }
    return false
  },
}
