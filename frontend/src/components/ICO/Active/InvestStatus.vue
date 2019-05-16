<template>
  <div class="investStatus">
    <p class="investStatus__tokenSupply lead"
      >{{ tokenText }}: {{ tokenSupply }} {{ symbol }}</p
    >
    <div class="investStatus__start bulletpoint">0 ETH</div>
    <div class="investStatus__goal bulletpoint">{{ goal }} ETH</div>
    <div class="investStatus__progress">
      <ProgressBar />
    </div>
    <p class="investStatus__current lead"
      >{{ balanceText }}: {{ contractBalance }} ETH</p
    >
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('ico')
import ProgressBar from '../ProgressBar'

export default {
  components: {
    ProgressBar,
  },
  computed: {
    ...mapState(['active', 'contractBalance', 'goal', 'tokenSupply', 'symbol']),
  },
  data() {
    return {
      balanceText: 'Investment so far',
      tokenText: 'Token available',
    }
  },
  watch: {
    active() {
      if (this.active) {
        this.balanceText = 'Investment so far'
        this.tokenText = 'Token available'
      } else {
        this.balanceText = 'ICO collected'
        this.tokenText = 'Token Minted'
      }
    },
  },
  created() {
    if (this.active) {
      this.balanceText = 'Investment so far'
      this.tokenText = 'Token available'
    } else {
      this.balanceText = 'ICO collected'
      this.tokenText = 'Token Minted'
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'InvestStatus';
</style>
