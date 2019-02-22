<template>
  <div class="lendingBoard">
    <div class="title">Lending Board</div>
    <hr class="separator">
    <hr class="separator">
    <div class="lendingBoard--contractFee">Current Contract Fee: {{ contractFee }} mETH</div>
    <hr class="separator">
    <LendingBoardInputs/>
    <hr class="separator">
    <Proposals/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LendingBoardInputs from '@/components/LendingBoard/Inputs/inputs'
import Proposals from '@/components/LendingBoard/Proposals/proposals'

export default {
  computed: mapState({
    contractFee: state => state.contractFee
  }),
  components: {
    LendingBoardInputs,
    Proposals
  }
}
</script>

<style lang="scss">
@import '../util/scss/variables';

.lendingBoard {
  text-align: center;
}

.lendingBoard--contractFee {
  font-weight: 600;
  font-size: 1.3rem;
  color: $link-text-color-darkened;
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
