<template>
  <div id="app">
    <Sidebar>
      <router-view/>
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
#app {
  font-family: 'Fira Code', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#main {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  padding-top: 45px;
  transition: margin-left 0.3s;
}
</style>
