<template>
  <div>
    <board/>
    <proposals/>
    <hr>
    <metamask/>
  </div>
</template>

<script>
import Metamask from '@/components/metamask'
import Board from '@/components/board'
import Proposals from '@/components/proposals'
// import ContractFee from '@/components/displayFee'
export default {
  name: 'p2p-lending',
  beforeCreate() {
    console.log('registerWeb3 dispatched from p2p-lending.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    metamask: Metamask,
    board: Board,
    // contractFee: ContractFee,
    proposals: Proposals
    // fee: ContractFee
  }
}
</script>

<style scoped>
</style>
