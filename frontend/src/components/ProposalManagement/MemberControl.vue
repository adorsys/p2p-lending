<template>
  <div class="memberControl">
    <div class="memberControl__boardMembers" v-if="boardMember">
      <div class="title memberControl__title">Fee Control</div>
      <div class="memberControl__displayFee">
        <span class="memberControl__feeTitle">Contract Fee:</span>
        <span class="memberControl__fee">{{ contractFee }} ETH</span>
      </div>
      <div class="memberControl__feeInput-wrapper">
        <div class="input-group memberControl__feeInput">
          <input
            type="text"
            onkeydown="return (/^[0-9.]$/.test(event.key) ||
          event.key === 'Backspace')"
            id="memberControl__feeInput"
            class="form-control"
            v-model="feeInput"
            v-bind:class="{
              hasContent: feeInput.length > 0,
              invalidInput: invalidFee,
            }"
          />
          <label for="memberControl__feeInput">New Contract Fee (ETH)</label>
        </div>
        <div
          class="memberControl__button btn btn--form"
          @click="createFeeProposal"
          >Submit</div
        >
      </div>
      <FeeProposals />
    </div>
    <div class="memberControl__tokenHolders" v-if="tokenHolder">
      <div class="title memberControl__title">Member Control</div>
      <div class="memberControl__memberInput-wrapper">
        <div class="input-group memberControl__memberInput">
          <input
            type="text"
            id="memberControl__memberInput"
            class="form-control"
            v-model="memberInput"
            v-bind:class="{
              hasContent: memberInput.length > 0,
              invalidInput: invalidAddress,
            }"
          />
          <label for="memberControl__memberInput">Member Address</label>
        </div>
        <div
          class="memberControl__button btn btn--form"
          @click="createMemberProposal(true)"
          >Add</div
        >
        <div
          class="memberControl__button btn btn--form"
          @click="createMemberProposal(false)"
          >Remove</div
        >
      </div>
      <MemberProposals />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ProposalManagementService } from '../../services/proposalManagement/ProposalManagementService'
import FeeProposals from './FeeProposals'
import MemberProposals from './MemberProposals'

export default {
  components: {
    FeeProposals,
    MemberProposals,
  },
  computed: {
    ...mapState('proposalManagement', ['contractFee']),
    ...mapState('auth', ['boardMember', 'tokenHolder']),
  },
  data() {
    return {
      feeInput: '',
      memberInput: '',
      invalidFee: false,
      invalidAddress: false,
    }
  },
  methods: {
    async createFeeProposal() {
      this.invalidFee = !(await ProposalManagementService.createContractFeeProposal(
        this.feeInput
      ))

      if (!this.invalidFee) {
        this.feeInput = ''
      }
    },
    async createMemberProposal(adding) {
      const memberProposalReturn = await ProposalManagementService.createMemberProposal(
        this.memberInput,
        adding
      )

      this.invalidAddress =
        memberProposalReturn.invalidAddress ||
        memberProposalReturn.invalidAction

      if (!this.invalidAddress) {
        this.memberInput = ''
      }
    },
  },
  watch: {
    feeInput() {
      this.invalidFee = false
    },
    memberInput() {
      this.invalidAddress = false
    },
  },
}
</script>

<style lang="scss">
@import 'MemberControl';
</style>
