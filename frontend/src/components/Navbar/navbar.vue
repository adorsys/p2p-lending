<template>
  <div>
    <ul class="navbar">
      <li class="navbar__icon">
        <img src="@/assets/menu.svg" @click="toggleSidebar">
      </li>
      <li class="navbar__title">
        <span class="navbar__title--first">p2p</span>
        <span class="navbar__title--second">Lending</span>
      </li>
      <li class="navbar__right">
        <span class="navbar__right--auth" v-if="!authenticated" @click="logIn">LogIn</span>
        <span class="navbar__right--auth" v-if="authenticated" @click="logOut">LogOut</span>
      </li>
      <li class="navbar__right navbar__right--network" v-if="network !== null">
        <span>{{ network }}</span>
      </li>
      <li class="navbar__right">
        <span class="navbar__right--metamaskActive" v-if="isInjected">Connected</span>
        <span class="navbar__right--metamaskInactive" v-if="!isInjected">Connected</span>
      </li>
    </ul>
    <div class="router-view-slotted">
      <slot name="sidebar">
        <slot name="sidebar-overlay"></slot>
      </slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { NETWORKS } from '@/util/constants/networks'

export default {
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkID]
  }),
  data() {
    return {
      authenticated: false
    }
  },
  methods: {
    toggleSidebar() {
      this.$parent.$emit('toggleSidebar')
    },
    logIn() {
      console.log('login')
      this.authenticated = true
    },
    logOut() {
      console.log('logout')
      this.authenticated = false
    }
  }
}
</script>

<style lang="scss">
@import '@/components/Navbar/navbar.scss';
</style>
