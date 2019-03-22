<!--Directory: P2P-Lending/frontend/src/components/InitialCoinOffering/chart-doughnut.vue-->
<template>
  <div class="icoSaleStatus">
    <div class="subtitle">Collected Ether</div>
    <!--if data from TrustToken-Contract had been loaded-->
    <chartjs-doughnut
      v-bind:bind="true"
      v-bind:datasets="datasets"
      v-bind:labels="labels"
      v-bind:option="option"
      :width="mywidth"
      :height="myheight"
      v-if="loaded"
    />
    {{ chart }}
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    //get data from TrustToken contract
    icoGoal: state => state.icoState.icoGoal,
    icoEtherBalance: state => state.icoState.icoEtherBalance
  }),

  data() {
    return {
      mywidth: 400,
      myheight: 100,
      loaded: false,
      datasets: [
        {
          data: [],
          backgroundColor: ['#4edf4a', '#c9c9c9'],
          hoverBackgroundColor: ['#673ab7', '#673ab7']
        }
      ],
      labels: null,
      option: {},
      chart: null
    }
  },
  methods: {
    getData(etherBalance) {
      this.datasets[0].data = []
      this.datasets[0].data.push(etherBalance, this.icoGoal - etherBalance)

      this.labels = [
        'Total ICO Balance: ' + etherBalance + ' ETH',
        (this.icoGoal - etherBalance).toFixed(2) +
          ' ETH needed to reach goal of ' +
          this.icoGoal +
          ' ETH'
      ]
      this.loaded = true //data from TrustToken had been loaded
    }
  },
  watch: {
    icoEtherBalance: {
      handler: function(etherBalance) {
        if (etherBalance !== null) {
          this.getData(etherBalance)
        }
      }
    }
  },
  mounted() {
    if (this.icoEtherBalance !== null) {
      this.getData(this.icoEtherBalance)
    }
  }
}
</script>
