<template>
  <div id="app">
    <Navbar />
    <div
      class="content content--hasWeb3"
      v-if="isInjected && !invalidNetwork"
      v-bind:class="{ tokenSale: active }"
    >
      <Sidebar v-if="!active" />
      <section>
        <router-view />
      </section>
    </div>
    <div class="content" v-else>
      <ErrorContent />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navbar from './components/Navbar/navbar'
import Sidebar from './components/Sidebar/sidebar'
import ErrorContent from './components/LandingPage/ErrorContent'

export default {
  components: {
    Navbar,
    Sidebar,
    ErrorContent,
  },
  computed: {
    ...mapState('auth', ['isInjected', 'invalidNetwork']),
    ...mapState('ico', ['active']),
  },
}
</script>

<style lang="scss">
@import './util/scss/main';
</style>
