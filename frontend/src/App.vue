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
import { INIT_CONNECTION } from '@/util/constants/types'

export default {
  components: {
    Navbar,
    Sidebar
  },
  beforeCreate() {
    this.$store.dispatch(INIT_CONNECTION)
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Fira Code', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
