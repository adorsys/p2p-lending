<template>
  <div class="icoStats">
    <p class="lead">ICO collected: {{ contractBalance }} ETH</p>
    <p class="lead">You have invested: {{ userInvestment }} ETH</p>
    <p class="lead" v-if="!active">You own: {{ userTokenBalance }} TT</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('ico', [
      'active',
      'userInvestment',
      'userTokenBalance',
      'contractBalance',
    ]),
  },
}
</script>

<style lang="scss">
@import '../../util/scss/variables';
.icoStats {
  > .lead {
    color: $navigation-color-grouping;
    padding: 0.25rem 0;
  }
}
</style>
