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
    goal: (state) => state.ico.goal,
    contractBalance: (state) => state.ico.contractBalance,
  }),

  data() {
    return {
      mywidth: 400,
      myheight: 75,
      loaded: false,
      datasets: [
        {
          data: [],
          backgroundColor: ['#4edf4a', '#c9c9c9'],
          hoverBackgroundColor: ['#673ab7', '#673ab7'],
        },
      ],
      labels: null,
      option: {},
      chart: null,
    }
  },
  methods: {
    getData(balance) {
      this.datasets[0].data = []
      this.datasets[0].data.push(balance, this.goal - balance)

      this.labels = [
        'Total ICO Balance: ' + balance + ' ETH',
        (this.goal - balance).toFixed(2) +
          ' ETH needed to reach goal of ' +
          this.goal +
          ' ETH',
      ]
      this.loaded = true //data from TrustToken had been loaded
    },
  },
  watch: {
    contractBalance: {
      handler: function(balance) {
        if (balance !== null) {
          this.getData(balance)
        }
      },
    },
  },
  mounted() {
    if (this.contractBalance !== null) {
      this.getData(this.contractBalance)
    }
  },
}
</script>
