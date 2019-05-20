<template>
  <div id="app">
    <Navbar />
    <div class="content" v-if="active">
      <router-view class="view view--icoActive" />
    </div>
    <div class="content" v-else>
      <Sidebar />
      <router-view class="view" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar/navbar'
import Sidebar from '@/components/Sidebar/sidebar'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('ico', ['active']),
  },
  components: {
    Navbar,
    Sidebar,
  },
}
</script>

<style lang="scss">
@import './util/scss/main';
</style>
