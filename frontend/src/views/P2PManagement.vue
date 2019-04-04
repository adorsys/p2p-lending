<template>
  <div class="lendingBoard">
    <div class="title">p2p Management</div>
    <hr class="separator">
    <hr class="separator">
    <div class="managementData">
      <div class="subtitle">Management Data</div>
      <div class="subsubtitle">Contract Fee: {{ contractFee }} ETH</div>
      <div class="subsubtitle">ICO holds: {{ icoEtherBalance }} ETH</div>
    </div>
    <hr class="separator">
    <div class="memberFunctionality" v-if="boardMember">
      <ContractFeeInputs :contract="proposalManagementContract"/>
      <hr class="separator">
      <ContractFeeProposals :contract="proposalManagementContract"/>
    </div>
    <hr class="separator">
    <div class="tokenHolderFunctionality" v-if="tokenHolder">
      <MemberProposalInputs :contract="icoContract"/>
      <hr class="separator">
      <MemberProposals :contract="icoContract"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { UPDATE_PROPOSALS } from '@/util/constants/types'
import ContractFeeInputs from '@/components/ProposalManagement/MemberFunctionality/contractFeeInputs'
import ContractFeeProposals from '@/components/ProposalManagement/MemberFunctionality/contractFeeProposals'
import MemberProposalInputs from '@/components/ProposalManagement/TokenHolderFunctionality/memberProposalInputs'
import MemberProposals from '@/components/ProposalManagement/TokenHolderFunctionality/memberProposals'

export default {
  computed: mapState({
    contractFee: state => state.contractFee,
    proposalManagementContract: state => state.proposalManagementInstance,
    boardMember: state => state.boardMember,
    tokenHolder: state => state.tokenHolder,
    icoEtherBalance: state => state.icoState.icoEtherBalance,
    icoContract: state => state.icoContractInstance
  }),
  components: {
    ContractFeeInputs,
    ContractFeeProposals,
    MemberProposalInputs,
    MemberProposals
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
  color: $link-text-color;
}
</style>
