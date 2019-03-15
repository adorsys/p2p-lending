<template>
  <div class="about">
    <div class="title">About</div>
    <hr class="separator">
    <hr class="separator">
    <div class="button" @click="test">Test</div>
  </div>
</template>

<script>
import { updateProposalHelper } from '@/services/web3/proposalManagement/updateProposals'
export default {
  methods: {
    test() {
      updateProposalHelper(this.$store.state.proposalManagementInstance)
    }
  }
}
</script>


<style lang="scss">
.about {
  text-align: center;
}
</style>
