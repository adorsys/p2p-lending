<template>
  <div class="icoStats">
    <p class="lead" v-if="!active">ICO collected: {{ contractBalance }} ETH</p>
    <p class="lead">You have invested: {{ userEtherBalance }} ETH</p>
    <p class="lead" v-if="!active">You own: {{ userTokenBalance }} TT</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('ico')

export default {
  computed: {
    ...mapState([
      'active',
      'userEtherBalance',
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
