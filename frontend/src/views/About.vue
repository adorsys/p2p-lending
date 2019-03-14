<template>
  <div class="about">
    <div class="title">About</div>
    <hr class="separator">
    <hr class="separator">
    <div class="button" @click="test">Test</div>
  </div>
</template>

<script>
export default {
  methods: {
    test() {
      console.log(this.$store.state.proposalManagementInstance().methods)
    }
  }
}
</script>


<style lang="scss">
.about {
  text-align: center;
}
</style>
