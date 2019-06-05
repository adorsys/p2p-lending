<template>
  <div class="createContractFeeProposal">
    <div class="input-group createContractFeeProposal__newFee">
      <input
        type="number"
        min="0"
        onkeydown="return event.keyCode !== 69"
        id="createContractFeeProposal__newFee"
        class="form-control"
        v-model="newFee"
        v-bind:class="{
          hasContent: newFee,
          invalidInput: invalidFee,
        }"
      />
      <label for="createContractFeeProposal__newFee">New Contract Fee</label>
    </div>
    <div class="createContractFeeProposal__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="submit">Submit</div>
    </div>
  </div>
</template>

<script>
import { ProposalManagementService } from '../../../services/proposalManagement/ProposalManagementService'
export default {
  data() {
    return {
      newFee: null,
      invalidFee: false,
    }
  },
  methods: {
    async submit() {
      this.invalidFee = !(await ProposalManagementService.createContractFeeProposal(
        this.newFee
      ))
      if (!this.invalidFee) this.reset()
    },
    reset() {
      this.newFee = null
      this.invalidFee = false
    },
  },
  watch: {
    newFee() {
      this.invalidFee = false
    },
  },
}
</script>
