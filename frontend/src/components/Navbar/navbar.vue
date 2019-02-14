<template>
  <div>
    <nav>
      <ul>
        <li class="navbar-menu-icon">
          <img src="@/assets/menu.svg" @click="toggleSidebar">
        </li>
        <li class="navbar-title">
          <router-link :to="{ name: 'home' }" class="navbar-router-title">
            <span class="navbar-title-firstpart">P2P</span>
            <span class="navbar-title-secondpart">Lending</span>
          </router-link>
        </li>

        <li class="navbar-account" v-if="authenticated === true" @click="logOut">
          <router-link :to="{ name: 'about' }" class="navbar-router-link">LogOut</router-link>
        </li>
        <li class="navbar-account" v-if="authenticated !== true" @click="logIn">
          <router-link :to="{ name: 'about' }" class="navbar-router-link">LogIn</router-link>
        </li>
        <li class="navbar-network" v-if="network !== null">
          <span>{{ network }}</span>
        </li>
        <li class="navbar-balance" v-if="balance !== null">
          <span>{{ balance }}</span>
          <span class="navbar-balance-eth">ETH</span>
        </li>
        <li class="navbar-metamask navbar-metamask-active" v-if="isInjected">Connected</li>
        <li class="navbar-metamask navbar-metamask-inactive" v-if="!isInjected">Connected</li>
      </ul>
    </nav>
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
    balance: state => state.web3.balance,
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

<style lang="scss" scoped>
@import '@/components/Navbar/navbar.scss';
</style>
