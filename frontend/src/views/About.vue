<template>
  <div class="about">
    <div class="title">About</div>
    <hr class="separator">
    <hr class="separator">
    <div class="button" @click="test">Test</div>
  </div>
</template>

<script>
import { updateInvestedBalance } from '@/services/web3/icoContract/updateICO'
export default {
  methods: {
    async test() {
      console.log(
        await updateInvestedBalance(this.$store.state.icoContractInstance)
      )
    }
  }
}
</script>


<style lang="scss">
.about {
  text-align: center;
}
</style>
