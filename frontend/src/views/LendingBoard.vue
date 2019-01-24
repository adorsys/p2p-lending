<template>
  <div class="lendingboard">
    <h1>Lending Board</h1>
    <h3>Current Contract Fee: {{ contractFee }} WEI</h3>
    <LendingBoardInputs/>
    <Proposals/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LendingBoardInputs from '@/components/LendingBoard/inputs'
import Proposals from '@/components/LendingBoard/proposals'

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
