<template>
  <div>
    <h2>Doughnut</h2>

    <div class="card">
      <chartjs-doughnut
        v-if="loaded"
        v-bind:bind="true"
        v-bind:datasets="datasets"
        v-bind:labels="labels"
        v-bind:option="option"
      />
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    icoGoal: state => state.icoState.icoGoal,
    icoEtherBalance: state => state.icoState.icoEtherBalance
  }),

  data() {
    return {
      loaded: false,
      datasets: null,
      labels: null,
      option: {}
    }
  },
  methods: {
    async getData() {
      console.log('getdata')
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
      this.loaded = true
    }
  },
  mounted() {
    this.$parent.$on('loaded', () => {
      this.getData()
    })
  }
}
</script>
