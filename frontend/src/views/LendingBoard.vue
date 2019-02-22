<template>
  <div class="lendingBoard">
    <div class="lendingBoard--title">Lending Board</div>
    <hr class="separator">
    <hr class="separator">
    <div class="lendingBoard--contractFee">Current Contract Fee: {{ contractFee }} mETH</div>
    <hr class="separator">
    <div class="lendingBoard--subtitle">Board Inputs:</div>
    <LendingBoardInputs/>
    <hr class="separator">
    <div class="lendingBoard--subtitle">Open Proposals:</div>
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

.lendingBoard--title {
  font-weight: 800;
  font-size: 2.8rem;
  color: $link-text-color-darkened;
  margin-bottom: 0.3em;
  text-decoration: underline;
}

.lendingBoard--contractFee {
  font-weight: 600;
  font-size: 1.3rem;
  color: $link-text-color-darkened;
  margin-top: 1em;
  margin-bottom: 1em;
}

.lendingBoard--subtitle {
  font-weight: 600;
  font-size: 1.7rem;
  color: $link-text-color-darkened;
  margin-top: 1em;
  margin-bottom: 1em;
  text-decoration: underline;
}
</style>
