<template>
  <div class="tokenSaleInfo">
    <div class="tokenSaleInfo__text tokenSaleInfo__text--active"
      >ICO is active</div
    >
    <div class="tokenSaleInfo__text tokenSaleInfo__text--participants"
      >Participants: {{ icoParticipants }}</div
    >
    <div class="tokenSaleInfo__text tokenSaleInfo__text--balance"
      >Contract Balance: {{ contractEtherBalance }} ETH</div
    >
    <div class="tokenSaleInfo__text tokenSaleInfo__text--goal"
      >ICO Goal: {{ icoGoal }} ETH</div
    >
    <div class="tokenSaleInfo__text tokenSaleInfo__text--invested"
      >You have invested: {{ etherBalanceUser }} ETH</div
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: mapState({
    icoActive: (state) => state.ico.active,
    contractEtherBalance: (state) => state.ico.contractBalance,
    icoGoal: (state) => state.ico.goal,
    etherBalanceUser: (state) => state.ico.userEtherBalance,
    icoParticipants: (state) => state.ico.participants,
  }),
}
</script>

<style lang="scss">
@import './tokenSaleInfo';
</style>
