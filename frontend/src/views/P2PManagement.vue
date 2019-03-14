<template>
  <div class="lendingBoard">
    <div class="title">p2p Management</div>
    <hr class="separator">
    <hr class="separator">
    <ContractFeeInputs/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ContractFeeInputs from '@/components/ProposalManagement/MemberFunctionality/contractFeeInputs'

export default {
  computed: mapState({
    contractFee: state => state.contractFee
  }),
  components: {
    ContractFeeInputs
  }
}
</script>

<style lang="scss">
@import '../util/scss/variables';

.lendingBoard {
  text-align: center;
}
</style>
