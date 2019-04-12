<template>
  <div id="app">
    <Navbar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar/navbar'
import { INIT_CONNECTION } from '@/util/constants/types'

export default {
  components: {
    Navbar
  },
  beforeCreate() {
    this.$store.dispatch(INIT_CONNECTION)
  }
}
</script>

<style lang="scss">
@import './util/scss/main';
</style>
