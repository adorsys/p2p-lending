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

<style lang="scss">
.ico {
  height: 100%;
  display: grid;
  grid-template-rows: 150px auto;
  align-items: center;

  &__content {
    grid-row: 2;
    height: 100%;
  }

  > section {
    grid-row: 1 / 3;
  }

  &__invest {
    padding: 1rem 0;
  }
}
</style>
