<template>
  <div class="lendingBoard">
    <div class="title">p2p Management</div>
    <GeneralManagement
      :proposalContract="proposalManagementContract"
      :ico="icoContract"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GeneralManagement from '@/components/Management/GeneralManagement/generalManagement'

export default {
  computed: mapState({
    proposalManagementContract: state => state.proposalManagementInstance,
    icoContract: state => state.icoContractInstance
  }),
  components: {
    GeneralManagement
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
