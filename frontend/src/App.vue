<template>
  <div id="app">
    <Sidebar>
      <router-view slot="router-view"/>
    </Sidebar>
    <Navbar/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar/navbar'
import Sidebar from '@/components/Sidebar/sidebar'
import * as types from '@/util/constants/types'

export default {
  components: {
    Navbar,
    Sidebar
  },
  beforeCreate() {
    this.$store.dispatch(types.INIT_CONNECTION)
  }
}
</script>

<style lang="scss">
@import './util/scss/main';
</style>
