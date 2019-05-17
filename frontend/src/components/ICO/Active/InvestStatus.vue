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
      tokenText: 'Token available',
    }
  },
  watch: {
    active() {
      this.tokenText = this.active ? 'Token available' : 'Token Minted'
    },
  },
  created() {
    this.tokenText = this.active ? 'Token available' : 'Token Minted'
  },
}
</script>

<style lang="scss" scoped>
@import 'InvestStatus';
</style>
