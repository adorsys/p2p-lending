<template>
  <div class="proposalControl">
    <div class="proposalControl__info lead">
      <p class="proposalControl__currentBalance"
        >Current Balance: {{ contractBalance }} ETH</p
      >
      <p class="proposalControl__currentFee"
        >Current Fee: {{ contractFee }} ETH</p
      >
    </div>
    <div class="proposalControl__feeProposals" v-if="boardMember">
      <CreateContractFeeProposal class="proposalControl__createFeeProposal" />
      <FeeProposals />
    </div>
    <div class="proposalControl__memberProposals" v-if="tokenHolder">
      <CreateMemberProposal class="proposalControl__createMemberProposal" />
      <MemberProposals />
    </div>
  </div>
</template>

<script>
import CreateContractFeeProposal from './MemberFunctionality/CreateContractFeeProposal'
import FeeProposals from './MemberFunctionality/FeeProposals'
import CreateMemberProposal from './TokenHolderFunctionality/CreateMemberProposal'
import MemberProposals from './TokenHolderFunctionality/MemberProposals'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('proposalManagement', ['contractFee']),
    ...mapState('ico', ['contractBalance']),
    ...mapState('auth', ['tokenHolder', 'boardMember']),
  },
  components: {
    CreateContractFeeProposal,
    FeeProposals,
    CreateMemberProposal,
    MemberProposals,
  },
}
</script>

<style lang="scss">
@import '../../util/scss/variables';
.proposalControl {
  &__createFeeProposal {
    padding: 3rem 0;
    display: grid;
    grid-template-columns: auto 600px auto;

    > div {
      grid-column: 2;
    }
  }

  &__createMemberProposal {
    padding: 3rem 0;
    display: grid;
    grid-template-columns: auto 600px auto;

    > div {
      grid-column: 2;
    }
  }
}
</style>
