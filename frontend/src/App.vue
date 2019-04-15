<template>
  <div id="app">
    <Navbar @toggleSidebar="toggleSidebar" />
    <div class="content" v-bind:class="{ toggleOverflow: sidebar }">
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
  data() {
    return {
      sidebar: false
    }
  },
  beforeCreate() {
    this.$store.dispatch(INIT_CONNECTION)
  },
  methods: {
    toggleSidebar() {
      this.sidebar = !this.sidebar
    }
  }
}
</script>

<style lang="scss">
@import './util/scss/main';
</style>
