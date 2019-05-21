<template>
  <div class="ico" v-if="active">
    <div class="x-large">Trust Token</div>
    <div class="ico__content">
      <InvestStatus class="ico__status" />
      <IcoStats class="ico__stats" />
      <Invest class="ico__invest" />
    </div>
  </div>
  <div class="ico" v-else>
    <div class="x-large">Token Management</div>
    <div class="ico__content">
      <IcoStats class="ico__stats" />
      <TokenControl />
    </div>
  </div>
</template>

<script>
import Invest from '../components/ICO/Active/Invest'
import InvestStatus from '../components/ICO/Active/InvestStatus'
import IcoStats from '../components/ICO/IcoStats'
import TokenControl from '../components/ICO/Finished/TokenControl'

import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('ico')

export default {
  computed: {
    ...mapState(['active', 'contractBalance', 'goal']),
  },
  components: {
    Invest,
    InvestStatus,
    IcoStats,
    TokenControl,
  },
}
</script>

<style lang="scss">
.ico {
  &__status {
    padding: 1rem 0 0;
  }
  &__invest {
    padding: 1rem 0;
  }
}
</style>
