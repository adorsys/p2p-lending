<template>
  <div class="icoProgress card card--icoDetails">
    <div class="icoProgress__title">Collected Ether</div>
    <div class="icoProgress__details">
      <div class="icoProgress__total">
        <div class="rectangle rectangle--blue"></div>
        <p class="icoProgress__totalText">Total: {{ contractBalance }} ETH</p>
      </div>
      <div class="icoProgress__goal">
        <div class="rectangle rectangle--gray"></div>
        <p class="icoProgress__goalText">Goal: {{ goal }} ETH</p>
      </div>
    </div>
    <div class="ppc" v-bind:class="{ 'gt-50': percent > 50 }">
      <div class="ppc__progress">
        <div class="ppc__progress-fill"></div>
      </div>
      <div class="ppc__textInfo">
        <div class="ppc__percentInfoWrapper">
          <div class="ppc__percentValue">{{ percent }}</div>
          <div class="ppc__percentSign">%</div>
        </div>
        <div class="ppc__etherDetails"
          >{{ contractBalance }} / {{ goal }} ETH</div
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ico', ['goal', 'contractBalance']),
  },
  data() {
    return {
      loaded: false,
      percent: 0,
    }
  },
  methods: {
    updateProgressBar() {
      const progress_fill = document.querySelector('.ppc__progress-fill')
      let percent = this.percent
      if (this.goal > 0 && this.contractBalance > 0) {
        percent = (this.contractBalance / this.goal) * 100
      }

      if (this.loaded) {
        progress_fill.style.transition = 'transform 0.3s ease-out'
      }

      const roundedPercent = Math.round(percent)
      // prevent flickering when crop gt50 style is added
      if (this.percent < 50 && roundedPercent >= 50) {
        progress_fill.style.transition = ''
      }

      this.percent = roundedPercent
      const deg = (360 * percent) / 100
      const rot = 'rotate(' + deg + 'deg)'
      progress_fill.style.transform = rot
    },
  },
  mounted() {
    this.updateProgressBar()
    this.loaded = true
  },
  watch: {
    contractBalance() {
      this.updateProgressBar()
    },
  },
}
</script>

<style lang="scss">
@import 'ICOProgress';
</style>
