<template>
  <div id="app">
    <Navbar />
    <div class="content content--icoActive" v-if="icoActive">
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
import Sidebar from '@/components/Sidebar/Sidebar'
import { INIT_CONNECTION } from '@/util/constants/types'
import { mapState } from 'vuex'

export default {
  computed: mapState({
    icoActive: state => state.icoState.isIcoActive
  }),
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
@import './util/scss/main';
</style>
