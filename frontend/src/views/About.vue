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
    async test() {
      console.log('test')
    }
  }
}
</script>


<style lang="scss">
.about {
  text-align: center;
}
</style>
