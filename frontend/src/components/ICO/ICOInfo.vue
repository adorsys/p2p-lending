<template>
  <div class="icoInfo card card--icoInfo">
    <div class="icoInfo__wrapper" v-if="active">
      <img src="../../assets/participants.svg" class="icoInfo__icon" />
      <div class="icoInfo__info">
        <p class="icoInfo__info-title">Participants</p>
        <p class="icoInfo__info-count">{{ participants }}</p>
      </div>
    </div>
    <div class="icoInfo__wrapper" v-if="!active">
      <img src="../../assets/token.svg" class="icoInfo__icon" />
      <div class="icoInfo__info">
        <p class="icoInfo__info-title">Your Token Balance</p>
        <p class="icoInfo__info-count">{{ userTokenBalance }} TT</p>
      </div>
    </div>
    <div class="icoInfo__wrapper" v-if="active">
      <img src="../../assets/token.svg" class="icoInfo__icon" />
      <div class="icoInfo__info">
        <p class="icoInfo__info-title">Token Available</p>
        <p class="icoInfo__info-count">{{ tokenSupply }} TT</p>
      </div>
    </div>
    <div class="icoInfo__wrapper" v-else>
      <img src="../../assets/contract.svg" class="icoInfo__icon" />
      <div class="icoInfo__info">
        <p class="icoInfo__info-title">Contract Balance</p>
        <p class="icoInfo__info-count">{{ contractBalance }} ETH</p>
      </div>
    </div>
    <div class="icoInfo__wrapper">
      <img
        src="../../assets/coins.svg"
        class="icoInfo__icon icoInfo__icon--coins"
      />
      <div class="icoInfo__info">
        <p class="icoInfo__info-title">You invested</p>
        <p class="icoInfo__info-count">{{ userInvestment }} ETH</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ico', [
      'active',
      'participants',
      'userTokenBalance',
      'userInvestment',
      'tokenSupply',
      'contractBalance',
    ]),
  },
}
</script>

<style lang="scss">
@import 'ICOInfo';
</style>
