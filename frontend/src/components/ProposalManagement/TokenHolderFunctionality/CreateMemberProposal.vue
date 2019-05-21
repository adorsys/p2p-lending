<template>
  <div class="createMemberProposal">
    <div class="input-group createMemberProposal__address">
      <input
        type="text"
        id="createMemberProposal__address"
        class="form-control"
        v-model="address"
        v-bind:class="{
          hasContent: address.length > 0,
          invalidInput: invalidAddress,
        }"
      />
      <label for="createMemberProposal__address">Member Address</label>
    </div>
    <div class="createMemberProposal__buttons">
      <div class="btn btn--light" @click="reset">Reset</div>
      <div class="btn btn--light" @click="submit(true)">Add</div>
      <div class="btn btn--light" @click="submit(false)">Remove</div>
    </div>
  </div>
</template>

<script>
import { ProposalManagementService } from '../../../services/proposalManagement/ProposalManagementService'
export default {
  data() {
    return {
      address: '',
      invalidAddress: false,
    }
  },
  methods: {
    reset() {
      this.address = ''
      this.invalidAddress = false
    },
    async submit(adding) {
      const memberProposalReturn = await ProposalManagementService.createMemberProposal(
        this.address,
        adding
      )
      this.invalidAddress = memberProposalReturn.invalidAddress
      if (!this.invalidAddress) this.reset()
    },
  },
  watch: {
    address() {
      this.invalidAddress = false
    },
  },
}
</script>

<style lang="scss">
.createMemberProposal {
  display: grid;
  grid-template-rows: repeat(2, minmax(80px, 10vh));

  &__address {
    grid-row: 1;
  }

  &__buttons {
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
  }
}
</style>
