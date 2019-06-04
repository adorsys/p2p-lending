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
import { mapState } from 'vuex'
import ProgressBar from '../ProgressBar'
export default {
  components: {
    ProgressBar,
  },
  computed: {
    ...mapState('ico', [
      'active',
      'contractBalance',
      'goal',
      'tokenSupply',
      'symbol',
    ]),
  },
  data() {
    return {
      tokenText: null,
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
