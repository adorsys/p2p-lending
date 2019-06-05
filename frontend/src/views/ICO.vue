<template>
  <div class="ico" v-if="active">
    <section>
      <div class="x-large">Trust Token</div>
      <div class="ico__content">
        <InvestStatus />
        <IcoStats />
        <Invest class="ico__invest" />
      </div>
    </section>
  </div>
  <div class="ico" v-else>
    <div class="x-large">Token Management</div>
    <div class="ico__content">
      <IcoStats />
      <TokenControl />
    </div>
  </div>
</template>

<script>
import Invest from '../components/ICO/Active/Invest'
import InvestStatus from '../components/ICO/Active/InvestStatus'
import IcoStats from '../components/ICO/IcoStats'
import TokenControl from '../components/ICO/Finished/TokenControl'

import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ico', ['active', 'contractBalance', 'goal']),
  },
  components: {
    Invest,
    InvestStatus,
    IcoStats,
    TokenControl,
  },
}
</script>
