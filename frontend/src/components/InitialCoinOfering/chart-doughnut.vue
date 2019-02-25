<template>
  <div>
    <h2>Doughnut</h2>

    <div class="card">
      <chartjs-doughnut
        v-bind:bind="true"
        v-bind:datasets="datasets"
        v-bind:labels="labels"
        v-bind:option="option"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datasets: [
        {
          data: [10, 20],
          backgroundColor: ["#b388ff", "#82b1ff"],
          hoverBackgroundColor: ["#673ab7", "#2196f3"]
        }
      ],
      labels: ["Foo", "Bar"],
      option: {}
    };
  }
};
</script>