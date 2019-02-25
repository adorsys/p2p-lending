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

  computed: 
  
  mapState({
    icoGoal: state => state.icoState.icoGoal,
    contractEtherBalance: state => state.icoState.icoEtherBalance
  }
  ),

  data() {
    return {
      loaded:false,
      datasets: null,
      labels: null,
      option: null
    
  }},
  
   async mounted () {
      
      this.loaded = false
      try {    

        this.datasets = [
        {
          data: await [ this.contractEtherBalance, (this.icoGoal-this.contractEtherBalance) ],
          backgroundColor: ["#4edf4a", "#c9c9c9"],
          hoverBackgroundColor: ["#673ab7", "#673ab7"]
        },
        this.labels = await ["Total ICO Balance of " +  this.contractEtherBalance+" Ether", "Needed to reach goal of "+ (this.icoGoal-this.contractEtherBalance) +" Ether"],
        this.option = {}
        ],

        this.loaded = true
      } catch (e) {
        console.error(e)
      }
  }
};
</script>