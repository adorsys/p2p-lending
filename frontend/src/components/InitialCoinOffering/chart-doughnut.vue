<!--Directory: P2P-Lending/frontend/src/components/InitialCoinOffering/chart-doughnut.vue-->
<template>
  <div>
    <h2>Collected Ether</h2>
    <!--if data from TrustToken-Contract had been loaded-->
    <div class="card" v-if="loaded">
      <chartjs-doughnut
        v-bind:bind="true"
        v-bind:datasets="datasets"
        v-bind:labels="labels"
        v-bind:option="option"
        :width="mywidth"
        :height="myheight"
      />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({ //get data from TrustToken contract
    icoGoal: state => state.icoState.icoGoal,
    icoEtherBalance: state => state.icoState.icoEtherBalance
  }),

  data() {
    return {
      mywidth: 500,
      myheight: 100,
      loaded: false,
      datasets: null,
      labels: null,
      option: {}
    }
  },
  methods: {
    getData() {
      this.datasets = [
        {
          data: [this.icoEtherBalance, this.icoGoal - this.icoEtherBalance],
          backgroundColor: ['#4edf4a', '#c9c9c9'],
          hoverBackgroundColor: ['#673ab7', '#673ab7']
        }
      ]
      this.labels = [
        'Total ICO Balance of ' + this.icoEtherBalance + ' Ether',
        'Needed to reach goal of ' +
          (this.icoGoal - this.icoEtherBalance) +
          ' Ether'
      ]
      this.loaded = true //data from TrustToken had been loaded
    }
  },
  watch: {
    icoEtherBalance: {
      handler: function(etherBalance) {
        if (etherBalance !== null) {
          this.getData()
        }
      }
    }
  },
  mounted() {
    if (this.icoEtherBalance !== null) {
      this.getData()
    }
  }
}
</script>
