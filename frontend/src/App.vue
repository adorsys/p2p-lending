<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar__left">
        <router-link :to="{ name: 'home' }" class="navbar__title"
          >p2p lending</router-link
        >
      </div>
      <router-link
        :to="{ name: 'allRequests' }"
        class="navbar__right navbar__right--allRequests"
        v-if="$route.matched.some((record) => record.name === 'requests')"
        v-bind:class="{
          navbar__active: $route.matched.some(
            (record) => record.name === 'allRequests'
          ),
        }"
        >Open Lending Requests</router-link
      >
      <router-link
        :to="{ name: 'userRequests' }"
        class="navbar__right navbar__right--userRequests"
        v-if="$route.matched.some((record) => record.name === 'requests')"
        v-bind:class="{
          navbar__active: $route.matched.some(
            (record) => record.name === 'userRequests'
          ),
        }"
        >My Requests</router-link
      >
    </nav>
    <div class="content" v-if="isInjected && !invalidNetwork">
      <router-view />
    </div>
    <div class="content" v-else>
      <ErrorContent />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ErrorContent from './components/ErrorContent'

export default {
  components: {
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
