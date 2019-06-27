import { ProposalManagement } from './ProposalManagement'
import { Web3Service } from '../web3/Web3Service'
import store from '../../state'

export const ProposalManagementService = {
  getProposals: async () => {
    const proposals = []

    const contract = await ProposalManagement.get()
    if (!contract) {
      return proposals
    }

    const rawProposals = await contract.methods.getProposals().call()
    if (rawProposals.length <= 0) {
      return proposals
    }

    // get data for all existing proposals
    await Promise.all(
      rawProposals.map(async (element) => {
        const prop = await contract.methods
          .getProposalParameters(element)
          .call()
        proposals.push(prop)
      })
    )

    return proposals
  },

  getContractFee: async () => {
    const contract = await ProposalManagement.get()
    if (!contract) {
      return null
    }

    const rawFee = await contract.methods.contractFee().call()
    const contractFee = await Web3Service.convertFromWei(rawFee, 'ether')

    return contractFee
  },

  getMemberStatus: async (user) => {
    const contract = await ProposalManagement.get()
    if (!contract) {
      return false
    }

    // no user given as parameter -> get current active user
    if (!user) {
      user = await Web3Service.getUser()
    }

    // return early if getUser() provided no user
    if (!user) {
      return false
    }

    const memberId = await contract.methods.memberId(user).call()

    return memberId > 0
  },

  createContractFeeProposal: async (proposedFee) => {
    if (parseFloat(proposedFee) <= 0) {
      return false
    }

    const callerIsMember = await ProposalManagementService.getMemberStatus()
    if (!callerIsMember) {
      return false
    }

    const contract = await ProposalManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    const feeInWei = await Web3Service.convertToWei(proposedFee, 'ether')
    contract.methods.createContractFeeProposal(feeInWei).send({ from: user })

    return true
  },

  createMemberProposal: async (memberAddress, adding) => {
    const memberProposalReturn = {
      invalidAddress: false,
      invalidAction: false,
    }

    const memberAddressIsValid = await Web3Service.isValidAddress(memberAddress)
    if (!memberAddressIsValid) {
      memberProposalReturn.invalidAddress = true
      return memberProposalReturn
    }

    // check if proposal for memberAddress exists already
    // Array.propotype.some() returns when first truthy element was found

    const locale = navigator.userLanguage || navigator.language
    const inputAddress = String(memberAddress).toLocaleUpperCase(locale)

    const invalidAction = store.state.proposalManagement.proposals.some(
      (element) => {
        const elementMemberAddress = String(
          element.memberAddress
        ).toLocaleUpperCase(locale)

        return inputAddress === elementMemberAddress
      }
    )

    if (invalidAction) {
      memberProposalReturn.invalidAction = true
      return memberProposalReturn
    }

    const isMember = await ProposalManagementService.getMemberStatus(
      memberAddress
    )

    // action: add member -> member must not exist
    if (adding && isMember) {
      memberProposalReturn.invalidAction = true
      return memberProposalReturn
    }

    // action: remove member -> member must exist
    if (!adding && !isMember) {
      memberProposalReturn.invalidAction = true
      return memberProposalReturn
    }

    const calleeIsMember = await ProposalManagementService.getMemberStatus()
    if (!calleeIsMember) {
      return memberProposalReturn
    }

    const contract = await ProposalManagement.get()
    if (!contract) {
      return memberProposalReturn
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return memberProposalReturn
    }

    contract.methods
      .createMemberProposal(memberAddress, adding)
      .send({ from: user })

    return memberProposalReturn
  },

  vote: async (stance, address) => {
    const validAddress = await Web3Service.isValidAddress(address)
    if (!validAddress) {
      return false
    }

    const calleeIsMember = await ProposalManagementService.getMemberStatus()
    if (!calleeIsMember) {
      return false
    }

    const contract = await ProposalManagement.get()
    if (!contract) {
      return false
    }

    const user = await Web3Service.getUser()
    if (!user) {
      return false
    }

    contract.methods.vote(stance, address).send({ from: user })

    return true
  },
}
