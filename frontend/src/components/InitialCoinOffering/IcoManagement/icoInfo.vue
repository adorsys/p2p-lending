<template>
  <div class="icoInfo">
    <div class="icoInfo__text icoInfo__text--inactive">ICO is inactive</div>
    <div class="icoInfo__text icoInfo__text--participants">TokenHolders: {{ tokenHolders }}</div>
    <div class="icoInfo__text icoInfo__text--invested">You invested: {{ etherBalanceUser }} ETH</div>
    <div
      class="icoInfo__text icoInfo__text--tokenAmount"
    >You own: {{ tokenBalanceUser }} {{ tokenSymbol }}</div>
    <div
      class="icoInfo__text icoInfo__text--contractValue"
    >ICO collected: {{ contractEtherBalance }} ETH</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    tokenHolders: state => state.icoState.tokenHolders,
    etherBalanceUser: state => state.icoState.etherBalanceUser,
    tokenBalanceUser: state => state.icoState.tokenBalanceUser,
    tokenSymbol: state => state.icoState.tokenSymbol,
    contractEtherBalance: state => state.icoState.icoEtherBalance
  })
}
</script>

<style lang="scss">
@import './icoInfo';
</style>
