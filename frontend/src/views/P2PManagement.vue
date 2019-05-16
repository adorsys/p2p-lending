<template>
  <div class="lendingBoard">
    <div class="title">p2p Management</div>
    <hr class="separator" />
    <hr class="separator" />
    <div class="managementData">
      <div class="subtitle">Management Data</div>
      <div class="subsubtitle">Contract Fee: {{ contractFee }} ETH</div>
      <div class="subsubtitle">ICO holds: {{ contractBalance }} ETH</div>
    </div>
    <hr class="separator" />
    <div class="memberFunctionality" v-if="boardMember">
      <ContractFeeInputs />
      <hr class="separator" />
      <ContractFeeProposals />
    </div>
    <hr class="separator" />
    <div class="tokenHolderFunctionality" v-if="tokenHolder">
      <MemberProposalInputs />
      <hr class="separator" />
      <MemberProposals />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContractFeeInputs from '@/components/ProposalManagement/MemberFunctionality/contractFeeInputs'
import ContractFeeProposals from '@/components/ProposalManagement/MemberFunctionality/contractFeeProposals'
import MemberProposalInputs from '@/components/ProposalManagement/TokenHolderFunctionality/memberProposalInputs'
import MemberProposals from '@/components/ProposalManagement/TokenHolderFunctionality/memberProposals'

export default {
  computed: {
    ...mapState('web3', ['boardMember', 'tokenHolder']),
    ...mapState('ico', ['contractBalance']),
    ...mapState('proposalManagement', ['contractFee']),
  },
  components: {
    ContractFeeInputs,
    ContractFeeProposals,
    MemberProposalInputs,
    MemberProposals,
  },
}
</script>

<style lang="scss">
@import '../util/scss/variables';

.lendingBoard {
  text-align: center;
}

.subsubtitle {
  margin-top: 20px;
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 500;
  color: $link-text-color;
}
</style>
