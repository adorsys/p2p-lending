<template>
  <div class="icoStats">
    <p class="bulletpoint">You have invested: {{ userEtherBalance }} ETH</p>
    <p class="bulletpoint">You own: {{ userTokenBalance }} TT</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('ico')

export default {
  computed: {
    ...mapState([
      'active',
      'participants',
      'userEtherBalance',
      'tokenSupply',
      'userTokenBalance',
    ]),
  },
}
</script>

<style lang="scss">
@import '../../util/scss/variables';
.lead--icoInfo {
  color: $secondary-dark-color;
  font-weight: 700;
}
</style>
