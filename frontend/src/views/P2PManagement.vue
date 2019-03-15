<template>
  <div class="lendingBoard">
    <div class="title">p2p Management</div>
    <hr class="separator">
    <hr class="separator">
    <div class="managementData">
      <div class="subtitle">Management Data</div>
      <div class="subsubtitle">Contract Fee: {{ contractFee }} ETH</div>
      <div class="subsubtitle">??? Number of Members: 10 ???</div>
    </div>
    <hr class="separator">
    <div class="memberFunctionality">
      <ContractFeeInputs :contract="proposalManagementContract"/>
      <hr class="separator">
      <ContractFeeProposals :contract="proposalManagementContract"/>
    </div>
    <hr class="separator">
    <div class="tokenHolderFunctionality">
      <MemberProposalInputs/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { UPDATE_PROPOSALS } from '@/util/constants/types'
import ContractFeeInputs from '@/components/ProposalManagement/MemberFunctionality/contractFeeInputs'
import ContractFeeProposals from '@/components/ProposalManagement/MemberFunctionality/contractFeeProposals'
import MemberProposalInputs from '@/components/ProposalManagement/TokenHolderFunctionality/memberProposalInputs'

export default {
  computed: mapState({
    contractFee: state => state.contractFee,
    proposalManagementContract: state => state.proposalManagementInstance
  }),
  components: {
    ContractFeeInputs,
    ContractFeeProposals,
    MemberProposalInputs
  },
  watch: {
    proposalManagementContract: {
      handler: function(managementContract) {
        if (managementContract) {
          this.$store.dispatch(UPDATE_PROPOSALS, managementContract)
        }
      }
    }
  },
  mounted() {
    if (this.proposalManagementContract) {
      this.$store.dispatch(UPDATE_PROPOSALS, this.proposalManagementContract)
    }
  }
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
}
</style>
