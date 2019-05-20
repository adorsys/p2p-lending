<template>
  <div>
    <div class="subtitle">Change Contract Fee</div>
    <div class="userInput">
      <label
        for="userInput__input--contractFee"
        class="userInput__label userInput__label--contractFee"
        >Proposed Fee:</label
      >
      <input
        type="text"
        id="userInput__input--contractFee"
        class="userInput__inputField userInput__inputField--contractFee"
        placeholder="Fee in ETH"
        v-model="proposedFee"
      />
      <div class="button button--contractFee" @click="createContractFeeProposal"
        >Change Fee</div
      >
    </div>
  </div>
</template>

<script>
import Web3Service from '@/services/web3/Web3Service'
import { proposalManagementInstance } from '@/services/proposalManagement/getProposalManagement'
export default {
  data() {
    return {
      proposedFee: null,
    }
  },
  methods: {
    async createContractFeeProposal() {
      const user = await Web3Service.getUser()
      const contract = await proposalManagementInstance.getInstance()
      if (contract) {
        if (this.proposedFee !== null) {
          const newFee = Web3Service.convertToWei(this.proposedFee, 'ether')
          await contract.methods
            .createContractFeeProposal(newFee)
            .send({ from: user })
        } else {
          alert('provide a fee')
        }
      }
      this.proposedFee = null
    },
  },
}
</script>

<style lang="scss">
@import './contractFeeInputs';
</style>
